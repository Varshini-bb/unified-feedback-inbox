import { prisma } from "../prisma.js";
export const addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const note = await prisma.feedbackNote.create({
            data: {
                content,
                feedbackId: id,
            },
        });
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add note" });
    }
};
