import { SkillProficiency } from './index';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'code_output'
  | 'short_code'
  | 'scenario';

export interface AssessmentQuestionOption {
  id: string;
  text: string;
  codeSnippet?: string;
}

export interface AssessmentTestCase {
  input: string;
  expectedOutput: string;
}

export interface AssessmentQuestion {
  id: string;
  careerDomain: string; // e.g. "Python Programming", "Statistics & Probability"
  skill: string; // e.g. "Python", "SQL", "Mathematics"
  topic: string; // e.g. "List Comprehensions", "Bayes Theorem"
  difficulty: DifficultyLevel;
  type: QuestionType;
  questionText: string;
  codeSnippet?: string;
  options?: AssessmentQuestionOption[];
  correctAnswer: string | string[]; // ID or array of IDs, or exact expected output string
  explanation: string;
  marks: number;
  prerequisites?: string[]; // missing prerequisites flagged if this question is failed
  scenarioContext?: string;
  codeStarter?: string;
  testCases?: AssessmentTestCase[];
}

export interface AssessmentBlueprint {
  careerId: string;
  careerTitle: string;
  description: string;
  domains: { domain: string; skill: string; weight: number }[];
  estimatedMinutes: number;
  totalQuestions: number;
}

export interface LearnerResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  awardedMarks: number;
  maxMarks: number;
}

export interface SkillProficiencyEstimate {
  skill: string;
  selfReportedProficiency: SkillProficiency | 'untested';
  demonstratedProficiency: number; // 0 - 100 percentage
  questionsAttempted: number;
  questionsCorrect: number;
  level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced';
  status: 'strong' | 'developing' | 'weak' | 'not_assessed';
  missingPrerequisites: string[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  blueprintId: string;
  careerGoal: string;
  completedAt: string;
  totalScorePercentage: number;
  totalMarksAwarded: number;
  totalPossibleMarks: number;
  timeSpentSeconds: number;
  difficultyBreakdown: Record<DifficultyLevel, { attempted: number; correct: number; percentage: number }>;
  domainBreakdown: Record<string, { attempted: number; correct: number; percentage: number }>;
  skillEstimates: SkillProficiencyEstimate[];
  strongAreas: string[];
  weakAreas: string[];
  missingPrerequisites: string[];
  recommendedRevisionTopics: string[];
  responses: LearnerResponse[];
}

export interface AssessmentSession {
  id: string;
  userId: string;
  careerGoal: string;
  blueprintId: string;
  startedAt: string;
  currentQuestionIndex: number;
  currentDifficulty: DifficultyLevel;
  questionIds: string[];
  responses: Record<string, string | string[]>;
  flaggedQuestionIds: string[];
  timeElapsedSeconds: number;
  isCompleted: boolean;
  resultId?: string;
}
