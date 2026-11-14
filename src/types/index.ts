/**
 * Nexora - Comprehensive TypeScript Domain Definitions
 * Modular architecture covering Auth, Learner Profile, Curriculum, Recommendations,
 * Roadmaps, Assessments, Coding IDE, and Mentorship.
 */

export * from './assessment';
export * from './learner';


export type AuthStatus = 'unauthenticated' | 'authenticated_incomplete' | 'authenticated_complete';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'student' | 'career_changer' | 'early_engineer';
  targetCareerId?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillProficiency = 'no_experience' | 'beginner' | 'intermediate' | 'advanced';

export interface SelectedSkill {
  skill: string;
  proficiency: SkillProficiency;
}

export interface EducationProfile {
  level: string; // e.g. "Bachelor's Degree", "Master's Degree", etc.
  fieldOfStudy: string; // e.g. "Computer Science", "Data Science", etc.
  currentYear: string; // e.g. "3rd Year", "Graduated", etc.
  experienceBackground: string; // e.g. "University CS coursework", etc.
}

export interface LearningPreferences {
  language: string; // e.g. "English"
  dailyStudyHours: number; // e.g. 2
  style: string; // e.g. "Hands-on Coding Labs"
  previousCourses: string; // e.g. "CS50, Andrew Ng Deep Learning"
  completedProjects: string; // e.g. "Built a fullstack CRUD app, implemented linear regression"
}

export interface CompleteLearnerProfile {
  userId: string;
  careerGoal: string; // e.g. "Data Scientist", "AI Engineer", etc.
  customCareerGoal?: string;
  education: EducationProfile;
  skills: SelectedSkill[];
  preferences: LearningPreferences;
  isOnboardingCompleted: boolean;
  completedAt?: string;
}

export interface LearnerProfile {
  userId: string;
  targetRole: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyCommitmentHours: number;
  learningPreferences: ('video' | 'hands_on_coding' | 'interactive_labs' | 'reading')[];
  primaryInterests: string[];
  diagnosticCompleted: boolean;
  currentStreakDays: number;
  totalStudyHours: number;
  overallReadinessScore: number; // 0 - 100
}

// ==========================================
// 2. CAREER DATABASE
// ==========================================

export interface CareerPath {
  id: string;
  slug: string;
  title: string;
  category: 'AI & Data' | 'Software Engineering' | 'Cloud & Systems' | 'Cybersecurity' | 'Product & Design';
  shortDescription: string;
  longDescription: string;
  averageSalary: string;
  marketDemand: 'Very High' | 'High' | 'Explosive';
  requiredSkills: {
    skillId: string;
    name: string;
    targetProficiency: number; // 0 - 100
    category: 'core' | 'advanced' | 'tooling';
  }[];
  growthRate: string;
  recommendedRoadmapId?: string;
  iconName: string;
}

// ==========================================
// 3. SKILL ANALYZER & COMPETENCY VECTORS
// ==========================================

export interface SkillNode {
  id: string;
  name: string;
  category: 'algorithmic' | 'architecture' | 'ai_ml' | 'systems' | 'data' | 'tooling';
  currentLevel: number; // 0 - 100
  targetLevel: number; // 0 - 100
  marketAverage: number; // 0 - 100
  lastAssessedAt?: string;
  status: 'mastered' | 'proficient' | 'developing' | 'untested';
}

export interface SkillGapAnalysis {
  careerId: string;
  overallMatchPercentage: number;
  criticalGaps: SkillNode[];
  strengths: SkillNode[];
  estimatedWeeksToReadiness: number;
}

// ==========================================
// 4. CURRICULUM ENGINE (Separated from AI)
// ==========================================

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  levelsCount: number;
  topics: string[];
  prerequisites: string[]; // course IDs
  levels: CourseLevel[];
}

export interface CourseLevel {
  id: string;
  courseId: string;
  levelNumber: number;
  title: string;
  summary: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  type: 'concept' | 'interactive_lab' | 'quiz' | 'code_challenge';
  estimatedMinutes: number;
  isCompleted?: boolean;
}

// ==========================================
// 5. AI RECOMMENDATION ENGINE (Input: Proficiency + History)
// ==========================================

export interface RecommendationContext {
  userId: string;
  targetCareerId: string;
  skillGaps: SkillNode[];
  completedModuleIds: string[];
  recentQuizScores: { quizId: string; score: number }[];
  learningVelocity: number; // modules completed / week
}

export interface NextBestAction {
  id: string;
  actionType: 'start_level' | 'practice_challenge' | 'retake_diagnostic' | 'review_mentor_feedback';
  title: string;
  reason: string;
  urgency: 'high' | 'recommended' | 'optional';
  targetRoute: string;
  estimatedMinutes: number;
  expectedSkillImpact: { skillName: string; delta: number };
}

// ==========================================
// 6. PERSONALIZED ROADMAP ENGINE
// ==========================================

export interface RoadmapMilestone {
  id: string;
  number: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  status: 'completed' | 'in_progress' | 'locked';
  completionPercentage: number;
  skillsCovered: string[];
  associatedCourseIds: string[];
  capstoneChallengeId?: string;
}

export interface PersonalizedRoadmap {
  id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  generatedAt: string;
  lastOptimizedAt: string;
  totalWeeksEstimate: number;
  milestones: RoadmapMilestone[];
}

// ==========================================
// 7. ASSESSMENTS & QUIZZES
// ==========================================

export interface DiagnosticQuestion {
  id: string;
  skillId: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface DiagnosticResult {
  completedAt: string;
  score: number;
  assessedSkills: { skillId: string; computedProficiency: number }[];
  suggestedLevel: 'beginner' | 'intermediate' | 'advanced';
}

// ==========================================
// 8. CODING ASSESSMENT & TEST EVALUATION
// ==========================================

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCode: Record<string, string>; // e.g. { python: "def solution(x):...", javascript: "..." }
  testCases: TestCase[];
  hints: string[];
  timeLimitMs: number;
}

export interface TestExecutionResult {
  testCaseId: string;
  passed: boolean;
  actualOutput?: string;
  executionTimeMs?: number;
  errorMessage?: string;
}

// ==========================================
// 9. AI MENTOR
// ==========================================

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  codeSnippet?: { language: string; code: string };
  referencedSkill?: string;
}

// ==========================================
// 10. PROGRESS TRACKING & TELEMETRY
// ==========================================

export interface WeeklyStudyVelocity {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  hours: number;
}

export interface ProgressSummary {
  hoursLoggedThisWeek: number;
  totalXP: number;
  streakDays: number;
  completedMilestones: number;
  totalMilestones: number;
  weeklyVelocity: WeeklyStudyVelocity[];
}
