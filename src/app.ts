import express, { Express, Request, Response, NextFunction } from "express";
// this is just the router exported from app.ts, driveItemRoutes
// is just a name we assigned to it
import driveItemRoutes from "./api/driveItem.routes";

const app: Express = express();

app.use(express.json());

// API Routes
app.use("/api/v1/items", driveItemRoutes);

// Error Handling Middleware
// Handler for routes that don't exist
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found on this server.",
    },
  });
});

// Generic error handler (catches errors passed by `next(error)`)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
});

export default app;
