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
      success: true,
      data: newItem,
      message: "Item created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { itemId } = req.params;
    const item = await driveItemService.findItemById(itemId!);

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await driveItemService.findItems(req.query);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateItemHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { itemId } = req.params;
    const updatedItem = await driveItemService.updateItem(itemId!, req.body);

    res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully',
    });
  } catch (error) {
    next(error);
  }
}
