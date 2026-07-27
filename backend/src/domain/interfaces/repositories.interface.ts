import { Prisma } from "@prisma/client";

export interface IAuthRepository {
  findUserByEmailOrUsername(email: string, username?: string): Promise<any>;
  findUserByEmail(email: string): Promise<any>;
  findUserById(id: string): Promise<any>;
  createUserWithRelations(data: Prisma.UserCreateInput): Promise<any>;
  updatePassword(id: string, hashedPassword: string): Promise<any>;
  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<any>;
  upsertProfile(userId: string, createData: any, updateData: any): Promise<any>;
  upsertPreference(userId: string, createData: any, updateData: any): Promise<any>;
  findLanguageByName(name: string): Promise<any>;
  findDefaultLanguage(): Promise<any>;
  createLanguage(data: any): Promise<any>;
  createSession(data: any): Promise<any>;
  findActiveSessions(userId: string): Promise<any>;
  findNonRevokedSessions(userId: string): Promise<any>;
  updateSession(id: string, data: any): Promise<any>;
  revokeAllUserSessions(userId: string): Promise<any>;
}

export interface IWorkspaceRepository {
  getBookmarks(userId: string, lessonId: string, query?: any): Promise<any>;
  createBookmark(data: any): Promise<any>;
  getBookmarkById(id: string): Promise<any>;
  updateBookmark(id: string, data: any): Promise<any>;
  getNotes(userId: string, lessonId: string, query?: any): Promise<any>;
  createNote(data: any): Promise<any>;
  getNoteById(id: string): Promise<any>;
  updateNote(id: string, data: any): Promise<any>;
  getFlashcards(userId: string, lessonId: string): Promise<any>;
  createFlashcard(data: any): Promise<any>;
  getFlashcardById(id: string): Promise<any>;
  updateFlashcard(id: string, data: any): Promise<any>;
}

export interface IProgressRepository {
  getDNA(userId: string): Promise<any>;
  createDNA(data: any): Promise<any>;
  updateDNA(userId: string, data: any): Promise<any>;
  upsertDNA(userId: string, createData: any, updateData: any): Promise<any>;
  createActivity(data: any): Promise<any>;
  getTimeline(userId: string, lessonId?: string, take?: number): Promise<any>;
  getConceptMasteries(userId: string, lessonId?: string): Promise<any>;
  getConceptMasteryById(userId: string, lessonId: string, conceptId: string): Promise<any>;
  upsertConceptMastery(userId: string, lessonId: string, conceptId: string, createData: any, updateData: any): Promise<any>;
  getPracticeSets(userId: string, status: string): Promise<any>;
  countNotes(userId: string): Promise<number>;
  countFlashcards(userId: string): Promise<number>;
  countBookmarks(userId: string): Promise<number>;
  countActivities(userId: string): Promise<number>;
}

export interface IContentRepository {
  countLessons(): Promise<number>;
  findSubjectBySlug(slug: string): Promise<any>;
  createSubject(data: any): Promise<any>;
  getLessonBySlug(slug: string): Promise<any>;
  getLessonById(id: string): Promise<any>;
  getFirstLesson(): Promise<any>;
  getAllLessonsForRoadmap(): Promise<any>;
  createLesson(data: any): Promise<any>;
  getActiveStudyPlan(userId: string): Promise<any>;
  countActivePlans(userId: string): Promise<number>;
  getCompletedStudySessions(userId: string): Promise<any>;
  getMasteryIds(userId: string, minConfidence?: number): Promise<any>;
  countMasteries(userId: string, minConfidence?: number): Promise<number>;
  getCompletedPracticeSets(userId: string): Promise<any>;
}

export interface IChatRepository {
  findActiveSession(userId: string, lessonId?: string): Promise<any>;
  createSession(data: any): Promise<any>;
  getSessionById(id: string): Promise<any>;
  updateSession(id: string, data: any): Promise<any>;
  deleteSession(id: string): Promise<any>;
  searchSessions(userId: string, query: string): Promise<any>;
  getPinnedSessions(userId: string): Promise<any>;
  
  createMessage(data: any): Promise<any>;
  updateMessage(id: string, data: any): Promise<any>;
  getMessageById(id: string): Promise<any>;
  
  getHistory(userId: string, lessonId?: string, query?: any): Promise<any>;
}

export interface IPlansRepository {
  getPlans(userId: string): Promise<any>;
  createPlan(data: any, tasksData: any[]): Promise<any>;
  updateTask(taskId: string, status: string): Promise<any>;
  updatePlanProgress(planId: string, progress: number): Promise<any>;
}

export interface IPracticeRepository {
  getPracticeSets(userId: string): Promise<any>;
  createPracticeSet(data: any, questionsData: any[]): Promise<any>;
  getQuestionById(id: string): Promise<any>;
  updateQuestion(id: string, data: any): Promise<any>;
  getPracticeSetById(id: string): Promise<any>;
  updatePracticeSet(id: string, data: any): Promise<any>;
}
