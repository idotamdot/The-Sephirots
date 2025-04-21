import { storage } from "./storage"; // Assuming storage handles DB interactions based on Drizzle schema
import * as crypto from "crypto";
// Import the InsertUser type if available from your schema definition file
// import { InsertUser } from './path/to/your/schema';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create a first user to use for testing
async function createTestUser() {
  try {
    // Check if user already exists by a unique field like username, ID 1 might not be reliable
    // or perhaps storage.getUser(1) is specifically designed for this bootstrap scenario.
    // Sticking with ID 1 check as per original code for now.
    const existingUser = await storage.getUserById(1); // Assuming a method like getUserById exists

    if (existingUser) {
      console.log("✅ Test user already exists with ID 1:", existingUser.username);
      return;
    }

    // Prepare user data matching the InsertUser schema (+ potential default overrides)
    const newUserData = { // Explicitly define the type if InsertUser is imported: : Partial<InsertUser> & { level?: number; points?: number }
      username: "founder",
      displayName: "Sephirots Founder",
      password: hashPassword("harmony"), // Hashed password
      // avatar: null, // Optional, null is default or handled by schema if text type allows null
      // avatarType: 'url', // Optional, handled by schema default
      bio: "First user of the platform, with founder privileges.", // Matches schema
      // isAi: false, // Optional, handled by schema default
      level: 10, // Overriding default level
      points: 1000, // Overriding default points
      // Let DB handle createdAt default
      // lastActive: new Date(), // Set lastActive if needed, matches schema type timestamp
      preferences: JSON.stringify({ // Correct field name and stringified JSON
        theme: "cosmic",
        notifications: true,
        emailUpdates: false
      }),
      // No extraneous fields like updatedAt, lastLoginAt, isActive, isAdmin, metrics
    };

    // Create the first user using the corrected data object
    const createdUser = await storage.createUser(newUserData);

    console.log("✨ Created first test user:", createdUser);

    // --- Post-Creation Steps (Example) ---
    // If 'isAdmin: true' was intended, assign the admin role separately:
    if (createdUser && createdUser.id) {
      try {
        // Assuming a method like storage.assignRole exists
        await storage.assignRole({ userId: createdUser.id, role: 'admin' /* or your specific admin role enum/string */ });
        console.log(`👑 Assigned 'admin' role to user ID ${createdUser.id}`);
      } catch (roleError) {
        console.error(`❌ Error assigning admin role to user ID ${createdUser.id}:`, roleError);
      }
    }
    // Add other post-creation logic if needed (e.g., awarding initial badges)

  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}

// Run the function
createTestUser();


// Assuming MemStorage type definition or class structure
interface MemStorage {
  getUserByUsername: (username: string) => Promise<any>; // Replace 'any' with proper type
  // Add other methods declarations
}
// Mock method for demonstration
const storage: MemStorage = {
  getUserByUsername: async (username: string) => {
    // Mock implementation
    if (username === 'founder') {
      return { id: 1, username: 'founder' }; // Assuming user data structure
    }
    return null;
  }
};

async function createTestUser() {
  try {
    const existingUser = await storage.getUserByUsername('founder'); // Using getUserByUsername
    if (existingUser) {
      console.log("✅ Test user already exists with ID 1:", existingUser.username);
      return;
    }
    // Remaining creation logic as before...
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}

createTestUser();