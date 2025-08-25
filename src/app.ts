import express, { Express, Request, Response, NextFunction } from "express";
// this is just the router exported from app.ts, driveItemRoutes
// is just a name we assigned to it
import { Prisma } from "@prisma/client";
import cors from 'cors';
import driveItemRoutes from "./api/driveItem.routes";

const app: Express = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1/items", driveItemRoutes);

app.set("json replacer", (key: string, value: any) =>
  typeof value === "bigint" ? value.toString() : value,
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      code: "URL_NOT_FOUND",
      message: `The requested URL ${req.originalUrl} was not found on this server.`,
    },
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested resource was not found.",
      },
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
});

export default app;
