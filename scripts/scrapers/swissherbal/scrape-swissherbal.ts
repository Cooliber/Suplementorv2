/*
  SwissHerbal full-site product scraper (read-only)
  - Discovers product URLs
  - Extracts product core fields
  - Writes JSON lines file to scripts/scrapers/swissherbal/out/swissherbal-products.ndjson

  NOTE: This script expects cheerio and p-limit to be installed.
  Install (with Bun):
    bun add cheerio p-limit

  Usage:
    bun scripts/scrapers/swissherbal/scrape-swissherbal.ts
*/

import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import pLimit from "p-limit";
import * as cheerio from "cheerio";

const ROOT = "https://swissherbal.pl";
const OUT_DIR = path.join(process.cwd(), "scripts/scrapers/swissherbal/out");
const OUT_FILE = path.join(OUT_DIR, "swissherbal-products.ndjson");
const URLS_SEED = path.join(
  process.cwd(),
  "scripts/scrapers/swissherbal/urls.seed.json"
);

// politeness
const CONCURRENCY = 3; // keep low
const MIN_DELAY_MS = 1000; // ≥1s between requests per worker

function ensureOut() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "SuplementorBot/1.0 (+https://example.com/bot-info) respectful;",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pl,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function text($: cheerio.CheerioAPI, el: cheerio.Element | cheerio.Cheerio<any> | undefined | null): string {
  if (!el) return "";
  const node = (el as any).cheerio ? (el as cheerio.Cheerio<any>) : $(el as cheerio.Element);
  return node.text().replace(/\s+/g, " ").trim();
}

function findHeading($: cheerio.CheerioAPI, contains: string) {
  const sels = ["h1", "h2", "h3", "h4", "h5"]; 
  for (const s of sels) {
    const el = $(s).filter((_, e) => text($, e).toLowerCase().includes(contains.toLowerCase())).first();
    if (el.length) return el;
  }
  return null;
}

function parsePriceRange($: cheerio.CheerioAPI): { min?: number; max?: number; raw?: string } {
  const possible = $("body").find(":contains('zł')").first().text();
  const raw = possible?.replace(/\s+/g, " ").trim();
  const m = raw?.match(/([0-9]+,[0-9]{2})\s*zł.*?([0-9]+,[0-9]{2})\s*zł/);
  if (m) {
    const n1 = parseFloat(m[1].replace(",", "."));
    const n2 = parseFloat(m[2].replace(",", "."));
    return { min: Math.min(n1, n2), max: Math.max(n1, n2), raw };
  }
  const s = raw?.match(/([0-9]+,[0-9]{2})\s*zł/);
  if (s) return { min: parseFloat(s[1].replace(",", ".")), max: parseFloat(s[1].replace(",", ".")), raw };
  return { raw };
}

function parseBreadcrumbCategory($: cheerio.CheerioAPI): string | undefined {
  // Try to read breadcrumb trail links (observed paths like /sklep/proszki/aminokwasy/)
  const crumbs = $("a").toArray().map(a => ({ href: $(a).attr("href") || "", txt: text($, a) }));
  // Prefer deep product taxonomy hints
  const cat = crumbs.find(c => /sklep\/.+/.test(c.href) || /kategoria|proszki|adaptogeny|aminokwasy|zio[lł]a|witamina|minera/.test(c.txt.toLowerCase()));
  return cat?.txt || undefined;
}

function mapCategoryToEnum(label?: string): string {
  const t = (label || "").toLowerCase();
  if (t.includes("aminokwasy") || t.includes("amino")) return "AMINO_ACID";
  if (t.includes("witamin")) return "VITAMIN";
  if (t.includes("minera")) return "MINERAL";
  if (t.includes("adaptogen")) return "ADAPTOGEN";
  if (t.includes("grzyb") || t.includes("herb") || t.includes("zio")) return "HERB";
  if (t.includes("omega") || t.includes("kwasy tłuszczowe")) return "FATTY_ACID";
  return "OTHER";
}

function extractSectionTable($: cheerio.CheerioAPI, sectionTitle: string) {
  const h = findHeading($, sectionTitle);
  if (!h) return undefined;
  // Next table after heading
  const tbl = h.nextAll("table").first();
  if (!tbl.length) return undefined;
  const rows: Record<string, string> = {};
  tbl.find("tr").each((_, tr) => {
    const tds = $(tr).find("td,th");
    const key = text($, tds.eq(0));
    const val = text($, tds.eq(1));
    if (key) rows[key.replace(/:$/,'')] = val;
  });
  return rows;
}

function extractHowToUse($: cheerio.CheerioAPI) {
  const rows = extractSectionTable($, "Jak stosować");
  if (!rows) return undefined;
  return {
    portionSize: rows["WIELKOŚĆ PORCJI"],
    portionsPerDay: rows["ILOŚĆ PORCJI NA DOBĘ"],
    absorption: rows["OPTYMALNA PRZYSWAJALNOŚĆ"],
    timeOfDay: rows["OPTYMALNA PORA STOSOWANIA"],
    cycle: rows["OPTYMALNA DŁUGOŚĆ CYKLU"],
  };
}

function extractSpecification($: cheerio.CheerioAPI) {
  const rows = extractSectionTable($, "Specyfikacja produktu");
  if (!rows) return undefined;
  return {
    form: rows["POSTAĆ PRODUKTU"] || rows["FORMA PRODUKTU"],
    standardization: rows["STANDARYZACJA"],
    scoop: rows["MIARKA"],
    packaging: rows["OPAKOWANIE"],
    purpose: rows["PRZEZNACZENIE"],
    legalStatus: rows["STATUS PRAWNY"],
  };
}

function normalizeIdFromUrl(url: string): string {
  const slug = url.split("/").filter(Boolean).pop() || url;
  return slug.toLowerCase();
}

function parseProduct(html: string, url: string) {
  const $ = cheerio.load(html);
  const title = $("h1").first().text().trim() || $(".product_title").first().text().trim();
  const price = parsePriceRange($);
  const spec = extractSpecification($);
  const how = extractHowToUse($);
  const catLabel = parseBreadcrumbCategory($);
  const category = mapCategoryToEnum(catLabel);
  const descNode = findHeading($, "Co to jest")?.nextAll("p").slice(0, 4).text().trim() || $(".woocommerce-product-details__short-description, .summary p").first().text().trim();

  return {
    sourceUrl: url,
    id: normalizeIdFromUrl(url),
    polishName: title || normalizeIdFromUrl(url),
    name: title || normalizeIdFromUrl(url), // English often absent
    price,
    categoryLabel: catLabel,
    category,
    descriptionPL: descNode,
    specification: spec,
    howToUse: how,
  };
}

async function scrapeOne(url: string) {
  const html = await fetchText(url);
  const data = parseProduct(html, url);
  return data;
}

async function main() {
  ensureOut();
  const urls: string[] = JSON.parse(fs.readFileSync(URLS_SEED, "utf-8"));
  const limit = pLimit(CONCURRENCY);

  let done = 0;
  const out = fs.createWriteStream(OUT_FILE, { flags: "w" });

  const promises = urls.map((url) =>
    limit(async () => {
      try {
        const data = await scrapeOne(url);
        out.write(JSON.stringify(data) + "\n");
      } catch (err) {
        out.write(JSON.stringify({ sourceUrl: url, error: (err as Error).message }) + "\n");
      } finally {
        done++;
        if (done % 5 === 0) console.log(`Processed ${done}/${urls.length}`);
        await sleep(MIN_DELAY_MS);
      }
    })
  );

  await Promise.all(promises);
  out.end();
  console.log(`\n✅ Scraping finished → ${OUT_FILE}`);
}

// Run immediately
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

