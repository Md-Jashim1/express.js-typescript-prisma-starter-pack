import http, { Server } from "http";
import app from "./app";
import { envVars } from "./config/env";
import { prisma } from "./config/prisma";
import seedSuperAdmin from "./app/utils/seedAdmin";

let server: Server | null = null;

const connectToDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ SQL Database Connected");
  } catch (err) {
    console.log("❌ Database Connection Failed", err);
  }
};

const startServer = async () => {
  try {
    server = http.createServer(app);
    server.listen(envVars.PORT, () => {
      console.log(`✅ Server is running on port ${envVars.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
};

async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

(async () => {
  await seedSuperAdmin();
  await connectToDB();
  await startServer();
})();
