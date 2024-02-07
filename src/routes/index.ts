import { Router } from "express";
import { contactRouter } from "./contact";

const router = Router();

router.use("/identify", contactRouter)

export { router };
