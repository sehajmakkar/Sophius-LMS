import { getConnectionStatus } from "../database/db.js";

export const checkHealth = (req, res) => {
  try {
    const dbStatus = getConnectionStatus();
    const healthStatus = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus.isConnected ? "HEALTHY" : "UNHEALTHY",
          details: {
            ...dbStatus,
            readyState: getReadyStateText(dbStatus.readyState),
          },
        },
        server: {
          status: "HEALTHY",
          upTime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
      },
    };

    const httpStatus =
      healthStatus.services.database.status === "HEALTHY" ? 200 : 503;

    return res.status(httpStatus).json(healthStatus);
  } catch (error) {
    console.error("Error checking health:", error);
    return res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      message: "Internal server error",
    });
  }
};

function getReadyStateText(state) {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "UNKNOWN";
  }
}
