import "dotenv/config";
import connectToDatabase, { disconnectFromDatabase } from "@/lib/db/mongodb";
import seedSupplementHistoryTCM from "@/lib/db/seeds/supplement-history-tcm";

async function main() {
  try {
    await connectToDatabase();
    const count = await seedSupplementHistoryTCM();
    console.log(`[Seed] SupplementHistory TCM upserted ${count} entries`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await disconnectFromDatabase();
  }
}

void main();

