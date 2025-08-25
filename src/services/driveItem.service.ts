import { prisma } from "../lib/prisma";
import { ItemType, Permission, Prisma } from "@prisma/client";

// Create type from zod schema for type safety
import { z } from "zod";
import { createDriveItemSchema } from "../validations/driveItem.validation";
type CreateDriveItemInput = z.infer<typeof createDriveItemSchema>["body"];

// this data come from a request, post request for example
export async function createItem(data: CreateDriveItemInput, ownerId: string) {
  // Set data.name to name, data.parentId to parentId,...
  const { name, parentId, itemType } = data;

  // Define the type for data payload, these are just shorthand for name: name, etc.
  const createPayload: Prisma.DriveItemCreateInput = {
    name,
    ownerId,
    itemType,
    permission: Permission.PRIVATE,
  };

  // if parentId exist, the foreign key active, connecting this item's id to it's parent item's id
  if (parentId) {
    createPayload.parent = {
      connect: { itemId: parentId },
    };
  }

  if (itemType === ItemType.FILE && data.itemType === ItemType.FILE) {
    createPayload.fileMetadata = {
      create: {
        mimeType: data.fileMetadata.mimeType,
        // size: data.fileMetadata.size,
        size: BigInt(data.fileMetadata.size),
        storagePath: `some/path/${name}`, // This is just placeholder path, do whatever u want with it?
      },
    };
  }

  // okay, we cooked the new item now. let's ship it to the prisma kitchen
  const newItem = await prisma.driveItem.create({
    data: createPayload,
    include: {
      fileMetadata: true, // this is fine, even if item is a folder
    },
  });

  return newItem;
}

export async function findItemById(itemId: string) {
  const item = await prisma.driveItem.findUniqueOrThrow({
    where: { itemId },
    include: {
      fileMetadata: true,
      children: true,
    },
  });
  return item;
}

export async function findItems(query: { parentId?: string }) {
  const { parentId } = query;
  const items = await prisma.driveItem.findMany({
    where: {
      parentId: parentId || null,
      isTrashed: false,
    },
  });
  return items;
}
