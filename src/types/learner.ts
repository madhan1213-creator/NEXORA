import { DifficultyLevel } from './assessment';
import { Course } from './index';

export interface LearningActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'assessment' | 'lesson' | 'quiz' | 'challenge' | 'milestone';
  details?: string;
}

export interface TopicProgressReport {
  topicId: string;
  topicName: string;
  skill: string;
  weight: number;
  totalQuestions: number;
  completedQuestions: number;
  percentage: number;
  isCompleted: boolean;
}

export interface LevelProgressReport {
  levelId: string;
  levelNumber: number;
  title: string;
  topics: TopicProgressReport[];
  percentage: number;
  isCompleted: boolean;
  totalTopics: number;
  completedTopics: number;
}

export interface CourseProgressReport {
  courseId: string;
  title: string;
  percentage: number;
  isCompleted: boolean;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export interface LearnerProgressState {
  userId: string;
  overallProgress: number; // 0 - 100 percentage
  completedCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson / Module IDs
  completedAssessments: string[]; // Assessment Result IDs
  completedQuestions?: string[]; // Unique deduplicated question IDs completed
  topicProgress?: Record<string, number>; // topicId -> percentage (0-100)
  levelProgress?: Record<string, number>; // levelId -> percentage (0-100)
  courseProgress?: Record<string, number>; // courseId -> percentage (0-100)
  assessmentStatus: 'not_started' | 'completed';
  roadmapStatus: 'not_generated' | 'generated';
  currentLevel: string | null;
  currentCourseId?: string;
  nextTopic?: {
    topicName: string;
    courseId: string;
    levelId?: string;
    lessonId?: string;
  };
  skillProficiency: Record<string, number>;
  learningActivity: LearningActivityItem[];
  achievements: string[];
  hoursLogged: number;
  streakDays: number;
  lastActiveDate: string;
  isDemoAccount?: boolean;
}

export interface RoadmapLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  type: 'concept' | 'code_challenge' | 'quiz' | 'project';
  summary: string;
  content?: string;
  practicePrompt?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface RoadmapCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  topics: string[];
  prerequisites: string[];
  lessons: RoadmapLesson[];
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  completionPercentage: number;
  skillsCovered: string[];
  courses: RoadmapCourse[];
}

export interface PersonalizedRoadmap {
  id: string;
  userId: string;
  careerGoal: string;
  generatedAt: string;
  assessmentResultId?: string;
  phases: RoadmapPhase[];
  totalPhases: number;
  completedPhases: number;
  totalLessonsCount: number;
  completedLessonsCount: number;
  overallProgressPercentage: number;
  recommendedNextTopic: {
    topicName: string;
    courseId: string;
    lessonId: string;
    phaseTitle: string;
  } | null;
}
