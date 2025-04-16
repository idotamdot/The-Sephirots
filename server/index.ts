import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import cors from "cors";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true // Allow credentials (cookies)
}));

// Setup session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "harmony-sephirots-secret",
  resave: true, // Changed to true to ensure session is saved on each request
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week,
    httpOnly: true,
    path: '/'
  }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Create a test user on server startup for development
  try {
    const saltRounds = 10;
    const testPassword = "testpassword";
    const passwordHash = await bcrypt.hash(testPassword, saltRounds);
    
    // Create test user with bcrypt hashed password
    const testUser = await storage.createUser({
      username: "testuser",
      displayName: "Test User",
      password: null, // We store the password hash instead
      // @ts-ignore - Custom fields
      passwordHash,
      avatar: null,
      bio: "A test user account",
      // @ts-ignore - Custom fields
      isAi: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    log(`Created test user: ${testUser.username} (ID: ${testUser.id})`);
  } catch (error) {
    log(`Error creating test user: ${error.message}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
