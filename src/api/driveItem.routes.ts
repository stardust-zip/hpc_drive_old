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

router.post("/", validate(createDriveItemSchema), createItemHandler);
// we set the route, the middleware and the hanlder
// validate is a higher order function to validate incoming request, the second part of router.post
// is just a middleeware
// for example, an user create an item and validate, use craeteDriveItemSchema, compare it
// to the item. If the item sastifie the schema. it's an succesfful request, else fail


router.post('/', upload.single('file'), validate(createDriveItemSchema), createItemHandler);

router.get("/", validate(getItemsSchema), getItemsHandler);
router.get("/:itemId", validate(getItemSchema), getItemByIdHandler);

router.put("/:itemId", validate(updateItemSchema), updateItemHandler);

router.delete("/:itemId", validate(deleteItemSchema), deleteItemHandler);

export default router;
