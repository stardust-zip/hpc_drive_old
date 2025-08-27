import { prisma } from "../lib/prisma";
import { ItemType, Permission, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

import { z } from "zod";
import { createDriveItemSchema } from "../validations/driveItem.validation";
type CreateDriveItemInput = z.infer<typeof createDriveItemSchema>["body"];

export async function createItem(data: any, ownerId: string) {
  const createPayload: Prisma.DriveItemCreateInput = {
    name: data.name,
    itemType: data.itemType,
    ownerId: ownerId,
    permission: Permission.PRIVATE,
  };

  if (data.parentId) {
    createPayload.parent = { connect: { itemId: data.parentId } };
  }

  const newItem = await prisma.driveItem.create({
    data: createPayload,
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

export type UpdateDriveItemInput = {
  name?: string;
  parentId?: string | null;
};

export async function updateItem(itemId: string, data: UpdateDriveItemInput) {
  const updatedItem = await prisma.driveItem.update({
    where: { itemId },
    data: data,
  });
  return updatedItem;
}

export async function deleteItem(itemId: string) {
  const deletedItem = await prisma.driveItem.delete({
    where: { itemId },
  });
  return deletedItem;
}

export async function createFile(
  data: any,
  ownerId: string,
  file: Express.Multer.File,
) {
  const uploadDir = path.join(__dirname, `../../uploads/${ownerId}`);

  fs.mkdirSync(uploadDir, { recursive: true });

  const storagePath = path.join(
    uploadDir,
    `${Date.now()}-${file.originalname}`,
  );

  fs.writeFileSync(storagePath, file.buffer);
  console.log(`Saved file to: ${storagePath}`);

  const createPayload: Prisma.DriveItemCreateInput = {
    name: data.name,
    ownerId: ownerId,
    itemType: "FILE",
    permission: Permission.PRIVATE,
    fileMetadata: {
      create: {
        mimeType: file.mimetype,
        size: BigInt(file.size),
        storagePath: storagePath,
      },
    },
  };

  if (data.parentId) {
    createPayload.parent = { connect: { itemId: data.parentId } };
  }

  const newItem = await prisma.driveItem.create({
    data: createPayload,
    include: { fileMetadata: true },
  });

  return newItem;
}
