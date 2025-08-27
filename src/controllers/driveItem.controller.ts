import { Request, Response, NextFunction } from "express";
import * as driveItemService from "../services/driveItem.service";

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
    // Check if a file was uploaded by multer
    if (req.file) {
      // It's a file upload. The metadata is in req.body.document
      const metadata = JSON.parse(req.body.document);
      // The actual file data is in req.file
      newItem = await driveItemService.createFile(metadata, ownerId, req.file);
    } else {
      // It's a folder creation (or other JSON-based creation)
      newItem = await driveItemService.createItem(req.body, ownerId);
    }

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
