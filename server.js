

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/models/routes/authRoutes");
const eligibilityRoutes = require("./src/models/routes/eligibilityRoutes");
const applicationRoutes = require("./src/models/routes/applicationRoutes");
const authMiddleware = require("./src/models/routes/middleware/authMiddleware");
const User = require("./src/models/User");

const app = express();

// Middleware
const configuredFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === configuredFrontendUrl || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed by the server."));
    }
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Loan Eligibility Portal Backend is running!");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/applications", applicationRoutes);

// Protected route - Get logged-in user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User authenticated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exitCode = 1;
    });
