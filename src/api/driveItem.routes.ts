import { Router } from "express";
import { createItemHandler } from "../controllers/driveItem.controller";
import { validate } from "../middlewares/validate";
import { createDriveItemSchema } from "../validations/driveItem.validation";

const router: Router = Router();

router.post("/", validate(createDriveItemSchema), createItemHandler);
// we set the route, the middleware and the hanlder
// validate is a higher order function to validate incoming request, the second part of router.post
// is just a middleeware
// for example, an user create an item and validate, use craeteDriveItemSchema, compare it
// to the item. If the item sastifie the schema. it's an succesfful request, else fail

export default router;
