import { Router } from "express";
import {
  getFeedbackInbox,
  getFeedbackById,
} from "../controllers/feedback.controller";

const router = Router();

router.get("/", getFeedbackInbox);
router.get("/:id", getFeedbackById);

export default router;
