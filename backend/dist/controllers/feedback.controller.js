import { prisma } from "../prisma.js";
/**
 * GET /api/feedback
 * Filters: source, severity, productArea
 * Pagination: limit, offset
 */
export const getFeedbackInbox = async (req, res) => {
    try {
        const { source, severity, productArea, limit = "10", offset = "0", } = req.query;
        const feedback = await prisma.feedbackItem.findMany({
            where: {
                source: source ? String(source) : undefined,
                severity: severity ? String(severity) : undefined,
                productArea: productArea ? String(productArea) : undefined,
            },
            orderBy: { createdAt: "desc" },
            take: Number(limit),
            skip: Number(offset),
        });
        const total = await prisma.feedbackItem.count();
        res.json({
            data: feedback,
            pagination: {
                limit: Number(limit),
                offset: Number(offset),
                total,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch feedback inbox" });
    }
};
/**
 * GET /api/feedback/:id
 */
export const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedbackItem.findUnique({
            where: { id },
            include: {
                notes: true,
            },
        });
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.json(feedback);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch feedback item" });
    }
};
