"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNote = void 0;
const prisma_1 = require("../prisma");
const addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const note = await prisma_1.prisma.feedbackNote.create({
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
exports.addNote = addNote;
