import { Request, Response, NextFunction } from "express";
import * as driveItemService from "../services/driveItem.service";

export async function createItemHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // We assume an `ownerId` is attached to the request, e.g., from an auth middleware
    const ownerId = "mock-user-uuid"; // Replace with actual user ID from auth
    const newItem = await driveItemService.createItem(req.body, ownerId);

    res.status(201).json({
      // 201 is the status for success POST request?
      success: true,
      data: newItem,
      message: "Item created successfully",
    }); // where is this json mesage send to
  } catch (error) {
    next(error); // next(error) ?
  }
}
