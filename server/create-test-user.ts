import { storage } from "./storage";
import * as crypto from "crypto";

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create a first user to use for testing
async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await storage.getUser(1);
    
    if (existingUser) {
      console.log("✅ Test user already exists with ID 1:", existingUser.username);
      return;
    }
    
    // Create the first user
    const testUser = await storage.createUser({
      username: "founder",
      displayName: "Sephirots Founder",
      password: hashPassword("harmony"),
      avatar: null,
      bio: "First user of the platform, with founder privileges.",
      isAi: false,
      level: 10,
      points: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      isAdmin: true,
      settings: {
        theme: "cosmic",
        notifications: true,
        emailUpdates: false
      },
      metrics: {
        discussionsCreated: 0,
        commentsPosted: 0,
        proposalsSubmitted: 0,
        votesParticipated: 0,
        badgesEarned: 0,
        lastActiveAt: new Date().toISOString()
      }
    });
    
    console.log("✨ Created first test user:", testUser);
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}

// Run the function
createTestUser();