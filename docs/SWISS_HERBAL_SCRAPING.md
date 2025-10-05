# SwissHerbal.pl scraping and import plan

This document describes the compliant scraping and ingestion plan for SwissHerbal.pl products into the Suplementor database (ComprehensiveSupplement model).

## Compliance and safety
- robots.txt: Disallows Amazonbot only (confirmed); proceed with a polite, low-concurrency crawler and 1–2s delay per request.
- Rate limiting: Hard-limit concurrency to 3 and insert 1s sleep between requests.
- TOS: Educational use only; store source URL per record and maintain attribution.

## Data model mapping (minimum viable)
- id: slug from URL (e.g. "/produkt/l-teanina" → "l-teanina").
- polishName/name: page <h1> text; fall back to slug.
- category: infer from breadcrumbs/taxonomy labels → map to enum (AMINO_ACID/HERB/VITAMIN/MINERAL/ADAPTOGEN/FATTY_ACID/OTHER).
- description/polishDescription: short intro under "Co to jest …" or short description in summary.
- dosageGuidelines: parse "Jak stosować" table → portion size, portions/day, absorption, time, cycle (stored partially; mapped to our structure with sensible defaults).
- economicData: optional price range; store as PLN range (approximate). Not used for business logic.
- tags/searchKeywords: derive from title and category.
- educationalContent: mirror description as placeholders initially.

## Implementation
1) Discovery → tavily_map to collect product URLs (already prototyped).
2) Scraper → scripts/scrapers/swissherbal/scrape-swissherbal.ts
   - Inputs: urls.seed.json (or later a category crawler)
   - Outputs: out/swissherbal-products.ndjson (one JSON per line)
   - Dependencies: cheerio, p-limit
3) Importer → scripts/scrapers/swissherbal/import-swissherbal.ts
   - Connects via existing MongoDB util and upserts to ComprehensiveSupplement
   - Conservative defaults for required fields
4) QA: Sample 5–10 products; compare online data vs stored; verify schema constraints

## Commands (require approval)
```
# install deps
bun add cheerio p-limit

# scrape
bun scripts/scrapers/swissherbal/scrape-swissherbal.ts

# import (writes to DB!)
bun scripts/scrapers/swissherbal/import-swissherbal.ts scripts/scrapers/swissherbal/out/swissherbal-products.ndjson
```

## Notes
- For richer fields (activeCompounds, mechanisms, clinicalApplications) we can extend the parser in a second pass if content exists in structured sections.
- Keep per-product `sourceUrl` in the NDJSON for traceability.

