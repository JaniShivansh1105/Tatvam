import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { healthRouter } from "./api/routes/health.route.js";
import { authRouter } from "./api/routes/auth.route.js";
import { workspaceRouter } from "./api/routes/workspace.route.js";
import { progressRouter } from "./api/routes/progress.route.js";
import { aiRouter } from "./api/routes/ai.route.js";
import { plansRouter } from "./api/routes/plans.route.js";
import { practiceRouter } from "./api/routes/practice.route.js";
import { knowledgeRouter } from "./api/routes/knowledge.route.js";
import { errorHandler } from "./api/middleware/error-handler.js";
import { requestLogger } from "./api/middleware/request-logger.js";
import { notFoundHandler } from "./api/middleware/not-found.js";

const app = express();

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { success: false, error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── Parsing ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Observability ──────────────────────────────────────────────────────────
app.use(requestLogger);

import { contentRouter } from "./api/routes/content.route.js";

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/workspace", workspaceRouter);
app.use("/api/progress", progressRouter);
app.use("/api/content", contentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/plans", plansRouter);
app.use("/api/practice", practiceRouter);
app.use("/api/knowledge", knowledgeRouter);

// ─── Fallback Handlers (must be last) ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
