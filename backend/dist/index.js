import express from "express";
import cors from "cors";
import feedbackRoutes from "./routes/feedback.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);
app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
