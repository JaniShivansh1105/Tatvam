export interface IAuthService {
  register(data: any, sessionInfo: any): Promise<any>;
  login(data: any, sessionInfo: any): Promise<any>;
  refresh(userId: string, incomingRefreshToken: string, sessionInfo: any): Promise<any>;
  logout(userId: string, incomingRefreshToken: string): Promise<void>;
  getMe(userId: string): Promise<any>;
  updatePreferences(userId: string, data: any): Promise<any>;
  updateProfile(userId: string, data: any): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyOTP(email: string, otp: string): Promise<any>;
  resetPassword(token: string, newPassword: string): Promise<any>;
}

export interface IWorkspaceService {
  getBookmarks(userId: string, lessonId: string, query?: any): Promise<any>;
  addBookmark(userId: string, lessonId: string, data: any): Promise<any>;
  updateBookmark(userId: string, id: string, data: any): Promise<any>;
  removeBookmark(userId: string, id: string): Promise<any>;
  restoreBookmark(userId: string, id: string): Promise<any>;
  getNotes(userId: string, lessonId: string, query?: any): Promise<any>;
  addNote(userId: string, lessonId: string, data: any): Promise<any>;
  updateNote(userId: string, id: string, data: any): Promise<any>;
  removeNote(userId: string, id: string): Promise<any>;
  getFlashcards(userId: string, lessonId: string): Promise<any>;
  generateFlashcard(userId: string, lessonId: string, data: any): Promise<any>;
  reviewFlashcard(userId: string, id: string, data: any): Promise<any>;
}

export interface IProgressService {
  getDNA(userId: string): Promise<any>;
  updateDNA(userId: string, data: any): Promise<any>;
  logActivity(userId: string, type: string, lessonId?: string, details?: any): Promise<any>;
  getTimeline(userId: string, lessonId?: string): Promise<any>;
  getMastery(userId: string, lessonId: string): Promise<any>;
  recordInteraction(userId: string, lessonId: string, conceptId: string, type: any): Promise<any>;
}

export interface IContentService {
  getLesson(slug: string): Promise<any>;
  getDashboard(userId: string): Promise<any>;
  getRoadmap(userId: string): Promise<any>;
  getAchievements(userId: string): Promise<any>;
  ensureDefaultLessons(): Promise<void>;
}

export interface IAIService {
  chatStream(userId: string, messages: any[], context: any, provider?: string): AsyncGenerator<any, void, unknown>;
  getHistory(userId: string, lessonId?: string): Promise<any>;
  generateStudyPlanTasks(userId: string, type: string): Promise<any>;
  generatePracticeQuestions(userId: string, lessonId: string | null, type: string, difficulty: string): Promise<any>;
  generateDashboardRecommendations(userId: string, stats: any, nextLesson: any): Promise<any>;
  generateStudyArtifact(userId: string, artifactType: string, requestContent: string, lessonId?: string): Promise<any>;
}
