"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTag = exports.addTag = void 0;
const prisma_1 = require("../prisma");
const addTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const tag = await prisma_1.prisma.feedbackTag.create({
            data: {
                name,
                feedbackId: id,
            },
        });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(400).json({ message: "Tag already exists" });
    }
};
exports.addTag = addTag;
const removeTag = async (req, res) => {
    try {
        const { id, tagId } = req.params;
        await prisma_1.prisma.feedbackTag.delete({
            where: { id: tagId },
        });
        res.json({ message: "Tag removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to remove tag" });
    }
};
exports.removeTag = removeTag;
