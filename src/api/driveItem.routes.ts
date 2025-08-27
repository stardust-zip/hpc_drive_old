import { Router } from "express";
import {
  createItemHandler,
  getItemByIdHandler,
  getItemsHandler,
  updateItemHandler,
  deleteItemHandler,
} from "../controllers/driveItem.controller";
import { validate } from "../middlewares/validate";
import {
  createDriveItemSchema,
  getItemSchema,
  getItemsSchema,
  updateItemSchema,
  deleteItemSchema,
} from "../validations/driveItem.validation";
import upload from "../middlewares/upload";

const router: Router = Router();

// router.post("/", validate(createDriveItemSchema), createItemHandler);
router.post("/", upload.single("file"), createItemHandler);

router.get("/", validate(getItemsSchema), getItemsHandler);
router.get("/:itemId", validate(getItemSchema), getItemByIdHandler);

router.put("/:itemId", validate(updateItemSchema), updateItemHandler);

router.delete("/:itemId", validate(deleteItemSchema), deleteItemHandler);

export default router;
