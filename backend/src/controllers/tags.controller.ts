import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const addTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await prisma.feedbackTag.create({
      data: {
        name,
        feedbackId: id,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: "Tag already exists" });
  }
};

export const removeTag = async (req: Request, res: Response) => {
  try {
    const { id, tagId } = req.params;

    await prisma.feedbackTag.delete({
      where: { id: tagId },
    });

    res.json({ message: "Tag removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove tag" });
  }
};
