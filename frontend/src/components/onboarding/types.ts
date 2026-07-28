export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OnboardingData {
  // Step 2: Personal
  dateOfBirth: string;
  gender: string;
  state: string;
  district: string;
  city: string;

  // Step 3: Academic
  educationLevel: string;
  board: string;
  medium: string;
  gradeClass: string;
  stream: string;
  schoolName: string;
  preferredLanguage: string; // Also collected or derived? User said Medium is mandatory, then Preferred Language in Step 5 or 3.

  // Step 4: Subjects (Handled via separate API usually, but keep locally to display)
  subjects: Array<{ id: string; name: string }>;

  // Step 5: Learning Preferences
  learningGoals: string[]; // Changed from learningGoal string
  dailyStudyTime: string;
  careerInterests: string[]; // Changed from careerInterest string
  learningStyle: string;
  subjectConfidence: Record<string, string>; // Maps subject name to confidence level

  // Step 6: Optional
  avatarUrl: string;
  bio: string;
  emergencyContact: string;
  alternateEmail: string;
  careerGoal: string;
}

export const defaultOnboardingData: OnboardingData = {
  dateOfBirth: "",
  gender: "",
  state: "",
  district: "",
  city: "",
  educationLevel: "",
  board: "",
  medium: "",
  gradeClass: "",
  stream: "",
  schoolName: "",
  preferredLanguage: "",
  subjects: [],
  learningGoals: [],
  dailyStudyTime: "",
  careerInterests: [],
  learningStyle: "",
  subjectConfidence: {},
  avatarUrl: "",
  bio: "",
  emergencyContact: "",
  alternateEmail: "",
  careerGoal: "",
};
