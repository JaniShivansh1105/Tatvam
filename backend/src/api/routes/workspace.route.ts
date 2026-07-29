import { Router } from "express";
import { workspaceController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const workspaceRouter = Router();

workspaceRouter.use(requireAuth);

// ─── Bookmarks (Lesson-Scoped) ──────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/bookmarks", asyncHandler(workspaceController.getBookmarks.bind(workspaceController)));
workspaceRouter.post("/lessons/:lessonId/bookmarks", asyncHandler(workspaceController.addBookmark.bind(workspaceController)));
workspaceRouter.patch("/bookmarks/:id", asyncHandler(workspaceController.updateBookmark.bind(workspaceController)));
workspaceRouter.delete("/bookmarks/:id", asyncHandler(workspaceController.removeBookmark.bind(workspaceController)));
workspaceRouter.post("/bookmarks/:id/restore", asyncHandler(workspaceController.restoreBookmark.bind(workspaceController)));

// ─── Smart Notes (Lesson-Scoped) ────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/notes", asyncHandler(workspaceController.getNotes.bind(workspaceController)));
workspaceRouter.post("/lessons/:lessonId/notes", asyncHandler(workspaceController.addNote.bind(workspaceController)));
workspaceRouter.put("/notes/:id", asyncHandler(workspaceController.updateNote.bind(workspaceController)));
workspaceRouter.delete("/notes/:id", asyncHandler(workspaceController.removeNote.bind(workspaceController)));

// ─── Flashcards (Lesson-Scoped) ─────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/flashcards", asyncHandler(workspaceController.getFlashcards.bind(workspaceController)));
workspaceRouter.post("/lessons/:lessonId/flashcards/generate", asyncHandler(workspaceController.generateFlashcard.bind(workspaceController)));
workspaceRouter.put("/flashcards/:id/review", asyncHandler(workspaceController.reviewFlashcard.bind(workspaceController)));

// ─── Educational Artifacts ────────────────────────────────────────────────
workspaceRouter.get("/artifacts", asyncHandler(workspaceController.getArtifacts.bind(workspaceController)));
workspaceRouter.post("/artifacts", asyncHandler(workspaceController.createArtifact.bind(workspaceController)));
workspaceRouter.patch("/artifacts/:id", asyncHandler(workspaceController.updateArtifact.bind(workspaceController)));
workspaceRouter.delete("/artifacts/:id", asyncHandler(workspaceController.deleteArtifact.bind(workspaceController)));

export { workspaceRouter };
