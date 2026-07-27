import { prisma } from "../data/prisma.js";
import { EventBus } from "../core/events/event-bus.js";

// Repositories
import { AuthRepository } from "../data/repositories/auth.repository.js";
import { WorkspaceRepository } from "../data/repositories/workspace.repository.js";
import { ProgressRepository } from "../data/repositories/progress.repository.js";
import { ContentRepository } from "../data/repositories/content.repository.js";
import { ChatRepository } from "../data/repositories/chat.repository.js";
import { PlansRepository } from "../data/repositories/plans.repository.js";
import { PracticeRepository } from "../data/repositories/practice.repository.js";
import { KnowledgeRepository } from "../data/repositories/knowledge/knowledge.repository.js";
import { ArtifactRepository } from "../data/repositories/study-tools/artifact.repository.js";

// Services
import { AuthService } from "../core/services/auth/auth.service.js";
import { WorkspaceService } from "../core/services/workspace/workspace.service.js";
import { ProgressService } from "../core/services/progress/progress.service.js";
import { ContentService } from "../core/services/content/content.service.js";
import { AIService } from "../core/services/ai/ai.service.js";
import { AIContextBuilder } from "../core/services/ai/ai.context-builder.js";
import { DocumentPipeline } from "../core/knowledge/document-pipeline.js";
import { StubEmbeddingProvider, StubVectorRepository } from "../core/knowledge/stub-providers.js";
import { MasteryEngine } from "../core/learning/adaptive/mastery-engine.js";
import { DNAEvolutionEngine } from "../core/learning/adaptive/dna-evolution-engine.js";
import { RecommendationEngine } from "../core/learning/adaptive/recommendation-engine.js";

// Use Cases
import { RegisterUseCase, LoginUseCase, RefreshUseCase, LogoutUseCase, GetMeUseCase, UpdatePreferencesUseCase, UpdateProfileUseCase, ForgotPasswordUseCase, VerifyOTPUseCase, ResetPasswordUseCase } from "../application/auth/auth.use-cases.js";
import { GetBookmarksUseCase, AddBookmarkUseCase, UpdateBookmarkUseCase, RemoveBookmarkUseCase, RestoreBookmarkUseCase } from "../application/workspace/bookmarks.use-case.js";
import { GetNotesUseCase, AddNoteUseCase, UpdateNoteUseCase, RemoveNoteUseCase } from "../application/workspace/notes.use-case.js";
import { GetFlashcardsUseCase, GenerateFlashcardUseCase, ReviewFlashcardUseCase } from "../application/workspace/flashcards.use-case.js";
import { GetLessonUseCase, GetDashboardUseCase, GetRoadmapUseCase, GetAchievementsUseCase } from "../application/content/content.use-cases.js";
import { GetDNAUseCase, UpdateDNAUseCase, GetMasteryUseCase, RecordInteractionUseCase, GetTimelineUseCase } from "../application/progress/progress.use-cases.js";
import { 
  ChatStreamUseCase, 
  GetHistoryUseCase,
  CreateConversationUseCase,
  RenameConversationUseCase,
  ArchiveConversationUseCase,
  DeleteConversationUseCase,
  RestoreConversationUseCase,
  SearchConversationUseCase,
  GetPinnedConversationsUseCase
} from "../application/ai/ai.use-cases.js";
import { GetPlansUseCase, CreatePlanUseCase, UpdateTaskStatusUseCase } from "../application/plans/plans.use-cases.js";
import { GetPracticeSetsUseCase, GeneratePracticeSetUseCase, SubmitAnswerUseCase, CompletePracticeSetUseCase } from "../application/practice/practice.use-cases.js";
import { CreateKnowledgeCollectionUseCase, IngestDocumentUseCase } from "../application/knowledge/knowledge.use-cases.js";
import { GenerateEducationalArtifactUseCase } from "../application/study-tools/study-tools.use-cases.js";
import { TrackInteractionUseCase, GenerateRecommendationsUseCase } from "../application/learning/adaptive/adaptive.use-cases.js";

// Controllers
import { AuthController } from "../api/controllers/auth/auth.controller.js";
import { WorkspaceController } from "../api/controllers/workspace/workspace.controller.js";
import { ContentController } from "../api/controllers/content/content.controller.js";
import { ProgressController } from "../api/controllers/progress/progress.controller.js";
import { AIController } from "../api/controllers/ai/ai.controller.js";
import { PlansController } from "../api/controllers/plans/plans.controller.js";
import { PracticeController } from "../api/controllers/practice/practice.controller.js";

// 1. Core Infrastructure
export const eventBus = new EventBus();
import { ProgressEventHandlers } from "../core/events/handlers/progress.handlers.js";

// 2. Repositories
export const authRepo = new AuthRepository(prisma);
export const workspaceRepo = new WorkspaceRepository(prisma);
export const progressRepo = new ProgressRepository(prisma);
export const contentRepo = new ContentRepository(prisma);
export const chatRepo = new ChatRepository(prisma);
export const plansRepo = new PlansRepository(prisma);
export const practiceRepo = new PracticeRepository(prisma);
export const knowledgeRepo = new KnowledgeRepository(prisma);
export const artifactRepo = new ArtifactRepository(prisma);

export const vectorRepo = new StubVectorRepository();
export const embeddingProvider = new StubEmbeddingProvider();

// 3. Services
export const aiContextBuilder = new AIContextBuilder(authRepo, progressRepo, contentRepo, vectorRepo, embeddingProvider, eventBus);
export const documentPipeline = new DocumentPipeline(knowledgeRepo, vectorRepo, embeddingProvider, eventBus);
export const authService = new AuthService(authRepo, progressRepo, eventBus);
export const workspaceService = new WorkspaceService(workspaceRepo, progressRepo, eventBus);
export const progressService = new ProgressService(progressRepo, eventBus);
export const contentService = new ContentService(contentRepo, authRepo, progressRepo, workspaceRepo, eventBus);
export const aiService = new AIService(chatRepo, contentRepo, aiContextBuilder, eventBus);

export const masteryEngine = new MasteryEngine();
export const dnaEvolutionEngine = new DNAEvolutionEngine();
export const recommendationEngine = new RecommendationEngine();

// 4. Use Cases
// Auth
export const registerUseCase = new RegisterUseCase(authService, eventBus);
export const loginUseCase = new LoginUseCase(authService, eventBus);
export const refreshUseCase = new RefreshUseCase(authService, eventBus);
export const logoutUseCase = new LogoutUseCase(authService, eventBus);
export const getMeUseCase = new GetMeUseCase(authService, eventBus);
export const updatePreferencesUseCase = new UpdatePreferencesUseCase(authService, eventBus);
export const updateProfileUseCase = new UpdateProfileUseCase(authService, eventBus);
export const forgotPasswordUseCase = new ForgotPasswordUseCase(authService, eventBus);
export const verifyOTPUseCase = new VerifyOTPUseCase(authService, eventBus);
export const resetPasswordUseCase = new ResetPasswordUseCase(authService, eventBus);

// Workspace
export const getBookmarksUseCase = new GetBookmarksUseCase(workspaceService, eventBus);
export const addBookmarkUseCase = new AddBookmarkUseCase(workspaceService, eventBus);
export const updateBookmarkUseCase = new UpdateBookmarkUseCase(workspaceService, eventBus);
export const removeBookmarkUseCase = new RemoveBookmarkUseCase(workspaceService, eventBus);
export const restoreBookmarkUseCase = new RestoreBookmarkUseCase(workspaceService, eventBus);
export const getNotesUseCase = new GetNotesUseCase(workspaceService, eventBus);
export const addNoteUseCase = new AddNoteUseCase(workspaceService, eventBus);
export const updateNoteUseCase = new UpdateNoteUseCase(workspaceService, eventBus);
export const removeNoteUseCase = new RemoveNoteUseCase(workspaceService, eventBus);
export const getFlashcardsUseCase = new GetFlashcardsUseCase(workspaceService, eventBus);
export const generateFlashcardUseCase = new GenerateFlashcardUseCase(workspaceService, eventBus);
export const reviewFlashcardUseCase = new ReviewFlashcardUseCase(workspaceService, eventBus);

// Content
export const getLessonUseCase = new GetLessonUseCase(contentService, eventBus);
export const getDashboardUseCase = new GetDashboardUseCase(contentService, eventBus);
export const getRoadmapUseCase = new GetRoadmapUseCase(contentService, eventBus);
export const getAchievementsUseCase = new GetAchievementsUseCase(contentService, eventBus);

// Progress
export const getDNAUseCase = new GetDNAUseCase(progressService, eventBus);
export const updateDNAUseCase = new UpdateDNAUseCase(progressService, eventBus);
export const getMasteryUseCase = new GetMasteryUseCase(progressService, eventBus);
export const recordInteractionUseCase = new RecordInteractionUseCase(progressService, eventBus);
export const getTimelineUseCase = new GetTimelineUseCase(progressService, eventBus);

// AI
export const chatStreamUseCase = new ChatStreamUseCase(aiService, eventBus);
export const getHistoryUseCase = new GetHistoryUseCase(chatRepo, eventBus);
export const createConversationUseCase = new CreateConversationUseCase(chatRepo, eventBus);
export const renameConversationUseCase = new RenameConversationUseCase(chatRepo, eventBus);
export const archiveConversationUseCase = new ArchiveConversationUseCase(chatRepo, eventBus);
export const deleteConversationUseCase = new DeleteConversationUseCase(chatRepo, eventBus);
export const restoreConversationUseCase = new RestoreConversationUseCase(chatRepo, eventBus);
export const searchConversationUseCase = new SearchConversationUseCase(chatRepo, eventBus);
export const getPinnedConversationsUseCase = new GetPinnedConversationsUseCase(chatRepo, eventBus);

// Plans & Practice
export const getPlansUseCase = new GetPlansUseCase(plansRepo, eventBus);
export const createPlanUseCase = new CreatePlanUseCase(aiService, plansRepo, eventBus);
export const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(plansRepo, eventBus);
export const getPracticeSetsUseCase = new GetPracticeSetsUseCase(practiceRepo, eventBus);
export const generatePracticeSetUseCase = new GeneratePracticeSetUseCase(aiService, practiceRepo, eventBus);
export const submitAnswerUseCase = new SubmitAnswerUseCase(practiceRepo, eventBus);
export const completePracticeSetUseCase = new CompletePracticeSetUseCase(practiceRepo, progressService, eventBus);

// Knowledge
export const createKnowledgeCollectionUseCase = new CreateKnowledgeCollectionUseCase(knowledgeRepo);
export const ingestDocumentUseCase = new IngestDocumentUseCase(documentPipeline);

// Study Tools
export const generateEducationalArtifactUseCase = new GenerateEducationalArtifactUseCase(aiService, artifactRepo, eventBus);

// Adaptive Learning
export const trackInteractionUseCase = new TrackInteractionUseCase(progressRepo, masteryEngine, dnaEvolutionEngine, eventBus);
export const generateRecommendationsUseCase = new GenerateRecommendationsUseCase(progressRepo, recommendationEngine);

// 5. Controllers
export const authController = new AuthController();
export const workspaceController = new WorkspaceController();
export const contentController = new ContentController();
export const progressController = new ProgressController();
export const aiController = new AIController();
export const plansController = new PlansController();
export const practiceController = new PracticeController();

// 6. Register Event Handlers
const progressHandlers = new ProgressEventHandlers(eventBus, progressService);
progressHandlers.register();
