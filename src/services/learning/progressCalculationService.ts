/**
 * NEXORA Progress Calculation Engine
 *
 * Authoritative learning progress calculation service.
 * Implements strict hierarchical separation:
 * Question Completion -> Topic Completion -> Lesson Completion -> Level Completion -> Course Completion -> Curriculum Progress
 *
 * Requirements:
 * 1. Completing 10 Python questions makes Python topic progress 100%. Only Python.
 * 2. NumPy, Pandas, Statistics and other topics retain their actual progress (0% if incomplete).
 * 3. Level 1 contains 5 required topics (weights: 20% each). Completing Python alone makes Level 1 20%, NOT 100%.
 * 4. Course progress is calculated strictly from its own required lessons and modules.
 * 5. Deduplication: Duplicate question submissions never inflate progress.
 * 6. Completing a question does not mark an entire lesson or level complete.
 */

import {
  LearnerProgressState,
  TopicProgressReport,
  LevelProgressReport,
  CourseProgressReport,
  RoadmapPhase,
} from '../../types/learner';
import { getLearnerState, saveLearnerState } from './learnerService';

// ==========================================
// 1. TOPIC & CURRICULUM DEFINITIONS
// ==========================================

export interface TopicDefinition {
  id: string;
  name: string;
  skill: string;
  weight: number; // percentage weight in level (e.g., 20)
  totalQuestions: number; // required questions to reach 100%
  questionIds: string[]; // canonical question identifiers
  lessonIds: string[]; // associated course lessons
}

export interface LevelDefinition {
  id: string;
  levelNumber: number;
  title: string;
  courseId: string;
  topics: TopicDefinition[];
  totalTopics: number;
}

// Canonical Question Banks for Level 1 Topics (10 questions each)
export const LEVEL_1_PYTHON_QUESTIONS = [
  'py_q_01',
  'py_q_02',
  'py_q_03',
  'py_q_04',
  'py_q_05',
  'py_q_06',
  'py_q_07',
  'py_q_08',
  'py_q_09',
  'py_q_10',
];

export const LEVEL_1_NUMPY_QUESTIONS = [
  'np_q_01',
  'np_q_02',
  'np_q_03',
  'np_q_04',
  'np_q_05',
  'np_q_06',
  'np_q_07',
  'np_q_08',
  'np_q_09',
  'np_q_10',
];

export const LEVEL_1_PANDAS_QUESTIONS = [
  'pd_q_01',
  'pd_q_02',
  'pd_q_03',
  'pd_q_04',
  'pd_q_05',
  'pd_q_06',
  'pd_q_07',
  'pd_q_08',
  'pd_q_09',
  'pd_q_10',
];

export const LEVEL_1_STATISTICS_QUESTIONS = [
  'stat_q_01',
  'stat_q_02',
  'stat_q_03',
  'stat_q_04',
  'stat_q_05',
  'stat_q_06',
  'stat_q_07',
  'stat_q_08',
  'stat_q_09',
  'stat_q_10',
];

export const LEVEL_1_SQL_QUESTIONS = [
  'sql_q_01',
  'sql_q_02',
  'sql_q_03',
  'sql_q_04',
  'sql_q_05',
  'sql_q_06',
  'sql_q_07',
  'sql_q_08',
  'sql_q_09',
  'sql_q_10',
];

// Level 1: Foundations of Scientific Computing & Data Analysis
// 5 core topics, equally weighted at 20% each (Total = 100%)
export const LEVEL_1_TOPICS: TopicDefinition[] = [
  {
    id: 'python',
    name: 'Python Fundamentals & Logic',
    skill: 'Python',
    weight: 20,
    totalQuestions: 10,
    questionIds: LEVEL_1_PYTHON_QUESTIONS,
    lessonIds: ['ds-les-1', 'ds-les-2'],
  },
  {
    id: 'numpy',
    name: 'NumPy & Vectorized Math',
    skill: 'NumPy',
    weight: 20,
    totalQuestions: 10,
    questionIds: LEVEL_1_NUMPY_QUESTIONS,
    lessonIds: ['ds-les-3'],
  },
  {
    id: 'pandas',
    name: 'Pandas & Data Manipulation',
    skill: 'Pandas',
    weight: 20,
    totalQuestions: 10,
    questionIds: LEVEL_1_PANDAS_QUESTIONS,
    lessonIds: ['ds-les-pandas'],
  },
  {
    id: 'statistics',
    name: 'Statistical Inference & Probability',
    skill: 'Statistics',
    weight: 20,
    totalQuestions: 10,
    questionIds: LEVEL_1_STATISTICS_QUESTIONS,
    lessonIds: ['ds-les-4', 'ds-les-5'],
  },
  {
    id: 'sql',
    name: 'Relational Schemas & SQL',
    skill: 'SQL',
    weight: 20,
    totalQuestions: 10,
    questionIds: LEVEL_1_SQL_QUESTIONS,
    lessonIds: ['ds-les-6'],
  },
];

export const LEVEL_1_DEFINITION: LevelDefinition = {
  id: 'lvl-1',
  levelNumber: 1,
  title: 'Level 1: Foundations of Scientific Computing & Data',
  courseId: 'ds-course-101',
  topics: LEVEL_1_TOPICS,
  totalTopics: LEVEL_1_TOPICS.length,
};

// Course-to-lessons registry for independent course calculation
export const COURSE_LESSONS_MAP: Record<string, string[]> = {
  'ds-course-101': ['ds-les-1', 'ds-les-2', 'ds-les-3'],
  'ds-course-102': ['ds-les-4', 'ds-les-5'],
  'ds-course-201': ['ds-les-6', 'ds-les-7'],
  'ds-course-301': ['ds-les-8'],
  'course-transformers-101': ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5', 'mod-6', 'mod-7', 'mod-8'],
  'course-python-adv': ['py-adv-1', 'py-adv-2', 'py-adv-3', 'py-adv-4'],
  'course-vector-db': ['vec-1', 'vec-2', 'vec-3'],
};

// ==========================================
// 2. TOPIC MATCHING & NORMALIZATION
// ==========================================

/**
 * Maps a question ID to its canonical Level 1 topic ID.
 * Supports canonical IDs ('py_q_01') and diagnostic question prefixes ('ds_py_01', etc.).
 */
export function getTopicIdForQuestion(questionId: string): string | null {
  const qLower = questionId.toLowerCase().trim();

  // Python matching
  if (
    LEVEL_1_PYTHON_QUESTIONS.includes(questionId) ||
    qLower.startsWith('py_') ||
    qLower.startsWith('ds_py_') ||
    qLower.includes('python')
  ) {
    return 'python';
  }

  // NumPy matching
  if (
    LEVEL_1_NUMPY_QUESTIONS.includes(questionId) ||
    qLower.startsWith('np_') ||
    qLower.startsWith('ds_np_') ||
    qLower.includes('numpy')
  ) {
    return 'numpy';
  }

  // Pandas matching
  if (
    LEVEL_1_PANDAS_QUESTIONS.includes(questionId) ||
    qLower.startsWith('pd_') ||
    qLower.startsWith('ds_pd_') ||
    qLower.includes('pandas')
  ) {
    return 'pandas';
  }

  // Statistics matching
  if (
    LEVEL_1_STATISTICS_QUESTIONS.includes(questionId) ||
    qLower.startsWith('stat_') ||
    qLower.startsWith('ds_stat_') ||
    qLower.includes('stat')
  ) {
    return 'statistics';
  }

  // SQL matching
  if (
    LEVEL_1_SQL_QUESTIONS.includes(questionId) ||
    qLower.startsWith('sql_') ||
    qLower.startsWith('ds_sql_') ||
    qLower.includes('sql')
  ) {
    return 'sql';
  }

  return null;
}

// ==========================================
// 3. DETERMINISTIC CALCULATION FORMULAS
// ==========================================

/**
 * 1. INDIVIDUAL TOPIC PROGRESS FORMULA:
 * Completed Unique Questions in Topic / Total Required Questions in Topic * 100
 *
 * Guarantees:
 * - 0/10 Python questions = 0%
 * - 5/10 Python questions = 50%
 * - 10/10 Python questions = 100%
 * - Duplicate question submissions are strictly ignored.
 * - Incomplete topics (0 questions) return 0%.
 */
export function calculateTopicProgress(
  topicId: string,
  completedQuestionIds: string[] = []
): number {
  const topic = LEVEL_1_TOPICS.find((t) => t.id === topicId);
  if (!topic) return 0;

  // Deduplicate question IDs
  const uniqueQuestions = new Set(completedQuestionIds);

  // Count unique completed questions belonging to this topic
  let completedCount = 0;
  for (const qId of uniqueQuestions) {
    // Check direct membership in questionIds or dynamic mapping
    if (topic.questionIds.includes(qId) || getTopicIdForQuestion(qId) === topic.id) {
      completedCount++;
    }
  }

  if (topic.totalQuestions <= 0) return 0;

  // Topic progress percentage (0 - 100)
  const percentage = Math.min(
    100,
    Math.round((completedCount / topic.totalQuestions) * 100)
  );

  return percentage;
}

/**
 * Generates a full progress report for a single topic
 */
export function getTopicProgressReport(
  topicId: string,
  completedQuestionIds: string[] = []
): TopicProgressReport {
  const topic = LEVEL_1_TOPICS.find((t) => t.id === topicId);
  if (!topic) {
    return {
      topicId,
      topicName: topicId,
      skill: topicId,
      weight: 0,
      totalQuestions: 10,
      completedQuestions: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const uniqueQuestions = new Set(completedQuestionIds);
  let completedCount = 0;
  for (const qId of uniqueQuestions) {
    if (topic.questionIds.includes(qId) || getTopicIdForQuestion(qId) === topic.id) {
      completedCount++;
    }
  }

  const percentage = Math.min(
    100,
    Math.round((completedCount / topic.totalQuestions) * 100)
  );

  return {
    topicId: topic.id,
    topicName: topic.name,
    skill: topic.skill,
    weight: topic.weight,
    totalQuestions: topic.totalQuestions,
    completedQuestions: completedCount,
    percentage,
    isCompleted: percentage === 100,
  };
}

/**
 * Returns progress reports for all Level 1 topics
 */
export function getAllLevel1TopicReports(
  completedQuestionIds: string[] = []
): TopicProgressReport[] {
  return LEVEL_1_TOPICS.map((t) => getTopicProgressReport(t.id, completedQuestionIds));
}

/**
 * 2. LEVEL 1 PROGRESS FORMULA:
 * Weighted sum of all required Level 1 topics:
 * Level 1 Progress = Sum(Topic Progress_i * Weight_i) / Sum(Weight_i)
 *
 * Example:
 * If Level 1 contains 5 equally weighted topics (20% each) and only Python is complete (100%):
 * Level 1 Progress = (100 * 20 + 0 * 20 + 0 * 20 + 0 * 20 + 0 * 20) / 100 = 20%.
 *
 * Completing Python alone must NEVER make Level 1 100%!
 * When all 5 topics are complete: Level 1 Progress = 100%.
 */
export function calculateLevelProgress(
  levelId: string = 'lvl-1',
  completedQuestionIds: string[] = [],
  completedLessonIds: string[] = []
): number {
  // If Level 1: calculate strictly by topic requirements and weights
  if (levelId === 'lvl-1' || levelId === 'level-1') {
    const topicReports = getAllLevel1TopicReports(completedQuestionIds);

    let weightedSum = 0;
    let totalWeight = 0;

    for (const report of topicReports) {
      weightedSum += report.percentage * report.weight;
      totalWeight += report.weight;
    }

    if (totalWeight <= 0) return 0;

    return Math.min(100, Math.round(weightedSum / totalWeight));
  }

  // Fallback for other levels: calculate by completed modules/lessons in that level
  const totalLessons = 3; // default modules in level
  const uniqueLessons = new Set(completedLessonIds);
  const done = completedLessonIds.filter((id) => uniqueLessons.has(id)).length;
  return Math.min(100, Math.round((done / totalLessons) * 100));
}

/**
 * Full breakdown report for Level 1
 */
export function getLevel1ProgressBreakdown(
  completedQuestionIds: string[] = []
): LevelProgressReport {
  const topics = getAllLevel1TopicReports(completedQuestionIds);
  const percentage = calculateLevelProgress('lvl-1', completedQuestionIds);
  const completedTopicsCount = topics.filter((t) => t.isCompleted).length;

  return {
    levelId: LEVEL_1_DEFINITION.id,
    levelNumber: 1,
    title: LEVEL_1_DEFINITION.title,
    topics,
    percentage,
    isCompleted: percentage === 100,
    totalTopics: LEVEL_1_DEFINITION.totalTopics,
    completedTopics: completedTopicsCount,
  };
}

/**
 * 3. COURSE PROGRESS FORMULA:
 * Calculate each course independently using its own completed required lessons.
 * Python progress is NEVER copied into other courses or topics.
 */
export function calculateCourseProgress(
  courseId: string,
  completedLessonIds: string[] = []
): number {
  const requiredLessons = COURSE_LESSONS_MAP[courseId];
  if (!requiredLessons || requiredLessons.length === 0) {
    return 0;
  }

  const completedSet = new Set(completedLessonIds);
  let completedCount = 0;

  for (const lessonId of requiredLessons) {
    if (completedSet.has(lessonId)) {
      completedCount++;
    }
  }

  return Math.min(
    100,
    Math.round((completedCount / requiredLessons.length) * 100)
  );
}

/**
 * 4. ROADMAP PHASE PROGRESS FORMULA:
 * Sum of completed lessons in phase / Total lessons in phase * 100
 */
export function calculatePhaseProgress(
  phase: RoadmapPhase,
  completedLessonIds: string[] = []
): number {
  let phaseTotalLessons = 0;
  let phaseCompletedLessons = 0;
  const completedSet = new Set(completedLessonIds);

  for (const course of phase.courses) {
    for (const lesson of course.lessons) {
      phaseTotalLessons++;
      if (completedSet.has(lesson.id)) {
        phaseCompletedLessons++;
      }
    }
  }

  if (phaseTotalLessons === 0) return 0;

  return Math.min(
    100,
    Math.round((phaseCompletedLessons / phaseTotalLessons) * 100)
  );
}

/**
 * 5. OVERALL CURRICULUM PROGRESS FORMULA:
 * Total completed lessons / Total lessons in curriculum * 100
 */
export function calculateOverallProgress(
  completedLessonIds: string[] = [],
  totalLessonsCount: number = 0
): number {
  if (totalLessonsCount <= 0) return 0;
  const uniqueCompleted = new Set(completedLessonIds).size;
  return Math.min(100, Math.round((uniqueCompleted / totalLessonsCount) * 100));
}

// ==========================================
// 4. STATE RECORDING & PERSISTENCE
// ==========================================

/**
 * Records a single completed question for a learner.
 *
 * Rules:
 * - Duplicate submissions are ignored (deduplicated).
 * - Updates topicProgress and levelProgress.
 * - Does NOT mark lessons or levels complete.
 * - Saves state to localStorage.
 */
export function recordQuestionCompletion(
  userId: string,
  questionId: string
): LearnerProgressState {
  const state = getLearnerState(userId);

  // Initialize completedQuestions if absent
  if (!state.completedQuestions) {
    state.completedQuestions = [];
  }

  // Deduplicate: If already completed, return existing state without inflating
  if (state.completedQuestions.includes(questionId)) {
    return state;
  }

  // Add question ID
  state.completedQuestions.push(questionId);

  // Recalculate topic progress for all Level 1 topics
  state.topicProgress = state.topicProgress || {};
  for (const topic of LEVEL_1_TOPICS) {
    state.topicProgress[topic.id] = calculateTopicProgress(topic.id, state.completedQuestions);
  }

  // Recalculate Level 1 progress
  state.levelProgress = state.levelProgress || {};
  state.levelProgress['lvl-1'] = calculateLevelProgress(
    'lvl-1',
    state.completedQuestions,
    state.completedLessons
  );

  // Update skill proficiencies: Python topic percentage updates Python skill
  const pythonTopicProgress = state.topicProgress['python'] || 0;
  state.skillProficiency['Python'] = pythonTopicProgress;

  // Other topics reflect their actual scores (0% if no questions completed)
  for (const topic of LEVEL_1_TOPICS) {
    if (topic.id !== 'python') {
      const topicPct = state.topicProgress[topic.id] || 0;
      // Only set if not already higher from assessment
      if (!state.skillProficiency[topic.skill] || topicPct > state.skillProficiency[topic.skill]) {
        state.skillProficiency[topic.skill] = topicPct;
      }
    }
  }

  state.lastActiveDate = new Date().toISOString();
  saveLearnerState(state);

  return state;
}

/**
 * Records multiple completed questions at once (e.g., from an assessment or batch test).
 *
 * Guarantees deduplication and authoritative progress updates.
 */
export function recordMultipleQuestionCompletions(
  userId: string,
  questionIds: string[]
): LearnerProgressState {
  const state = getLearnerState(userId);

  if (!state.completedQuestions) {
    state.completedQuestions = [];
  }

  const existingSet = new Set(state.completedQuestions);
  let newlyAdded = 0;

  for (const qId of questionIds) {
    if (!existingSet.has(qId)) {
      existingSet.add(qId);
      newlyAdded++;
    }
  }

  if (newlyAdded === 0) {
    return state; // No new questions completed
  }

  state.completedQuestions = Array.from(existingSet);

  // Recalculate topic progress
  state.topicProgress = state.topicProgress || {};
  for (const topic of LEVEL_1_TOPICS) {
    state.topicProgress[topic.id] = calculateTopicProgress(topic.id, state.completedQuestions);
  }

  // Recalculate Level 1 progress
  state.levelProgress = state.levelProgress || {};
  state.levelProgress['lvl-1'] = calculateLevelProgress(
    'lvl-1',
    state.completedQuestions,
    state.completedLessons
  );

  // Sync skill proficiencies
  for (const topic of LEVEL_1_TOPICS) {
    const topicPct = state.topicProgress[topic.id] || 0;
    state.skillProficiency[topic.skill] = topicPct;
  }

  state.lastActiveDate = new Date().toISOString();
  saveLearnerState(state);

  return state;
}
