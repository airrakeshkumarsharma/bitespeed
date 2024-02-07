import { contactCtrl } from "@controllers/contact";
import { asyncMiddleware } from "@middlewares/asyncMiddleware";
import { validator } from "@middlewares/validator";
import { Router } from "express";
import { contactSchema } from "../validators/contact";

const router = Router();

router.post("/", validator(contactSchema.create), asyncMiddleware(contactCtrl.identifyAndLinkContact.bind(contactCtrl)))

export { router as contactRouter };
