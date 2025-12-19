import { Router } from "express";
import {
  getFeedbackInbox,
  getFeedbackById,
} from "../controllers/feedback.controller";
import { addNote } from "../controllers/notes.controller";
import { addTag, removeTag } from "../controllers/tags.controller";

const router = Router();


router.post("/:id/notes", addNote);
router.post("/:id/tags", addTag);
router.delete("/:id/tags/:tagId", removeTag);



router.get("/", getFeedbackInbox);
router.get("/:id", getFeedbackById);

export default router;
