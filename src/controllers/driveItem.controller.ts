import { Request, Response, NextFunction } from "express";
import * as driveItemService from "../services/driveItem.service";
import { createDriveItemSchema } from "../validations/driveItem.validation";
import { ZodError } from "zod";

export async function createItemHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    if (!ownerId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User ID is missing" },
      });
    }

    let newItem;
    if (req.file) {
      const metadata = JSON.parse(req.body.document);
      const validatedMetadata = createDriveItemSchema.parse({
        body: metadata,
      }).body;
      newItem = await driveItemService.createFile(
        validatedMetadata,
        ownerId,
        req.file,
      );
    } else {
      const validatedBody = createDriveItemSchema.parse({
        body: req.body,
      }).body;
      newItem = await driveItemService.createItem(validatedBody, ownerId);
    }

    res.status(201).json({
      success: true,
      data: newItem,
      // message: "Item created successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: error.issues,
        },
      });
    }
    // For all other errors, pass them to the 500 handler
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

export async function updateItemHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { itemId } = req.params;
    const updatedItem = await driveItemService.updateItem(itemId!, req.body);

    res.status(200).json({
      success: true,
      data: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteItemHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { itemId } = req.params;
    await driveItemService.deleteItem(itemId!);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
