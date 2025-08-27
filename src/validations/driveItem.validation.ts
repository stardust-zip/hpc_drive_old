import { z } from "zod";
import { ItemType } from "@prisma/client";

export const createDriveItemSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      itemType: z.enum(ItemType),
      parentId: z.uuid().nullable().optional(),
    })
    .and(
      z.discriminatedUnion("itemType", [
        z.object({
          itemType: z.literal(ItemType.FOLDER),
        }),
        z.object({
          itemType: z.literal(ItemType.FILE),
          fileMetadata: z.object({
            mimeType: z.string(),
            size: z.number().positive(),
          }),
        }),
      ]),
    ),
});

export const getItemSchema = z.object({
  params: z.object({
    itemId: z.uuid("Invalid item ID"),
  }),
});

export const getItemsSchema = z.object({
  query: z.object({
    parentId: z.uuid("Invalid parent ID").optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    itemId: z.uuid('Invalid item ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    parentId: z.uuid().nullable().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Update body cannot be empty',
  }),
});

export const deleteItemSchema = z.object({
  params: z.object({
    itemId: z.uuid('Invalid item ID'),
  }),
});
