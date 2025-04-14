import { db } from "../server/db";
import { badges, userBadges } from "../shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting badge table migration...");

  try {
    // Add new columns to badges table
    await db.execute(sql`
      ALTER TABLE badges 
      ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'bronze' NOT NULL,
      ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1 NOT NULL,
      ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10 NOT NULL,
      ADD COLUMN IF NOT EXISTS symbolism TEXT,
      ADD COLUMN IF NOT EXISTS is_limited BOOLEAN DEFAULT FALSE NOT NULL,
      ADD COLUMN IF NOT EXISTS max_supply INTEGER,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    `);
    
    console.log("✅ Successfully updated badges table");

    // Add new columns to user_badges table
    await db.execute(sql`
      ALTER TABLE user_badges 
      ADD COLUMN IF NOT EXISTS enhanced BOOLEAN DEFAULT FALSE NOT NULL,
      ADD COLUMN IF NOT EXISTS completed_criteria TEXT,
      ADD COLUMN IF NOT EXISTS issued_by INTEGER
    `);

    console.log("✅ Successfully updated user_badges table");

    // Create Harmony Founder badge if it doesn't exist
    const founderBadge = await db.select().from(badges).where(sql`name = 'Harmony Founder'`);
    
    if (founderBadge.length === 0) {
      await db.insert(badges).values({
        name: "Harmony Founder",
        description: "Awarded to pioneers who contributed to the formation of Harmony — the world's first ethical, co-governed platform for human-AI collaboration and digital rights.",
        icon: "dove",
        requirement: "Join 1 discussion, post 1 original idea, vote on 1 amendment, define identity",
        category: "Founders",
        tier: "founder",
        level: 1,
        points: 100,
        symbolism: "The dove = peace across beings, The fractal halo = consciousness in evolution, The orb = shared vision and sovereignty, The purple = royalty of responsibility and love",
        isLimited: true,
        maxSupply: 100
      });
      console.log("✅ Created Harmony Founder badge");
    } else {
      console.log("ℹ️ Harmony Founder badge already exists");
    }

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });