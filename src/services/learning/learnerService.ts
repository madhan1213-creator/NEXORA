import {
  LearnerProgressState,
  PersonalizedRoadmap,
  RoadmapPhase,
  RoadmapCourse,
  RoadmapLesson,
  LearningActivityItem,
} from '@/types/learner';
import { AssessmentResult } from '@/types/assessment';
import { CompleteLearnerProfile } from '@/types';
import { supabase } from '@/services/auth/supabaseClient';

const STATE_STORAGE_PREFIX = 'skillpath_learner_state_';
const ROADMAP_STORAGE_PREFIX = 'skillpath_roadmap_';

export const DEMO_USER_ID = 'usr_dev_complete_101';

/**
 * Creates an empty, genuinely fresh learner state for a new user
 */
export function createFreshLearnerState(userId: string): LearnerProgressState {
  return {
    userId,
    overallProgress: 0,
    completedCourses: [],
    completedLessons: [],
    completedAssessments: [],
    assessmentStatus: 'not_started',
    roadmapStatus: 'not_generated',
    currentLevel: null,
    skillProficiency: {},
    learningActivity: [],
    achievements: [],
    hoursLogged: 0,
    streakDays: 0,
    lastActiveDate: new Date().toISOString(),
    isDemoAccount: false,
  };
}

/**
 * Returns pre-seeded demo state exclusively for the Alex Chen demo account
 */
export function getDemoLearnerState(): LearnerProgressState {
  return {
    userId: DEMO_USER_ID,
    overallProgress: 68,
    completedCourses: ['course-python-adv', 'course-vector-db'],
    completedLessons: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
    completedAssessments: ['diag-general-ds'],
    assessmentStatus: 'completed',
    roadmapStatus: 'generated',
    currentLevel: 'Level 2: Multi-Head Splitting & Causal Masking',
    currentCourseId: 'course-transformers-101',
    nextTopic: {
      topicName: 'Implement Causal Lower-Triangular Masking',
      courseId: 'course-transformers-101',
      levelId: 'lvl-2',
      lessonId: 'mod-5',
    },
    skillProficiency: {
      Python: 85,
      SQL: 62,
      Statistics: 45,
      Transformers: 30,
      'Distributed Systems': 55,
    },
    learningActivity: [
      {
        id: 'act-1',
        title: 'Completed Scaled Dot Product Attention Lab',
        timestamp: '2 hours ago',
        type: 'lesson',
        details: 'Scored 100% on tensor shape verification',
      },
      {
        id: 'act-2',
        title: 'Completed Baseline Diagnostic Assessment',
        timestamp: 'Yesterday',
        type: 'assessment',
        details: 'Identified strong baseline in Python & Linear Algebra',
      },
      {
        id: 'act-3',
        title: 'Unlocked Level 2: Attention Mechanisms',
        timestamp: '3 days ago',
        type: 'milestone',
      },
    ],
    achievements: ['Diagnostic Certified', 'Attention Architect', 'Fast Starter'],
    hoursLogged: 8.4,
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
    isDemoAccount: true,
  };
}

/**
 * Retrieves the persisted state for a specific user ID
 */
export function getLearnerState(userId: string): LearnerProgressState {
  // If user is specifically the demo user and has no explicit state saved yet, return demo state
  if (userId === DEMO_USER_ID) {
    try {
      const stored = localStorage.getItem(`${STATE_STORAGE_PREFIX}${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return getDemoLearnerState();
  }

  try {
    const raw = localStorage.getItem(`${STATE_STORAGE_PREFIX}${userId}`);
    if (raw) {
      const state: LearnerProgressState = JSON.parse(raw);
      return state;
    }
  } catch (err) {
    console.error('Error reading learner state:', err);
  }

  // Non-demo users without state always start completely fresh (0% progress)
  const fresh = createFreshLearnerState(userId);
  saveLearnerState(fresh);
  return fresh;
}

/**
 * Persists learner progress state locally (and to Supabase if available)
 */
export function saveLearnerState(state: LearnerProgressState): void {
  try {
    localStorage.setItem(`${STATE_STORAGE_PREFIX}${state.userId}`, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist learner state locally:', err);
  }

  // Attempt Supabase sync if configured
  if (supabase) {
    try {
      supabase
        .from('learner_profiles')
        .upsert({
          user_id: state.userId,
          overall_progress: state.overallProgress,
          completed_courses: state.completedCourses,
          completed_lessons: state.completedLessons,
          completed_assessments: state.completedAssessments,
          assessment_status: state.assessmentStatus,
          roadmap_status: state.roadmapStatus,
          current_level: state.currentLevel,
          hours_logged: state.hoursLogged,
          streak_days: state.streakDays,
          updated_at: new Date().toISOString(),
        })
        .then();
    } catch {}
  }
}

/**
 * Creates structured curriculum templates tailored to the selected career
 */
function getCurriculumForCareer(
  careerGoal: string,
  weakSkills: string[],
  missingPrereqs: string[]
): RoadmapPhase[] {
  const isDataScientist = careerGoal.toLowerCase().includes('data') || careerGoal.toLowerCase().includes('scientist');
  const isAIEngineer = careerGoal.toLowerCase().includes('ai') || careerGoal.toLowerCase().includes('machine learning');
  const isFullStack = careerGoal.toLowerCase().includes('full stack') || careerGoal.toLowerCase().includes('developer');
  const isCloud = careerGoal.toLowerCase().includes('cloud');
  const isSecurity = careerGoal.toLowerCase().includes('security');

  if (isFullStack) {
    return [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Phase 1: Modern JavaScript & Frontend Architecture',
        description: 'Core DOM mechanics, asynchronous promises, TypeScript type systems, and React component state.',
        estimatedWeeks: 3,
        status: 'in_progress',
        completionPercentage: 0,
        skillsCovered: ['JavaScript', 'TypeScript', 'React'],
        courses: [
          {
            id: 'fs-course-101',
            title: 'Modern TypeScript & ESNext Runtime Dynamics',
            slug: 'typescript-modern-runtime',
            description: 'Master closures, event loop microtasks, generics, and strict type safety.',
            estimatedHours: 10,
            difficulty: 'beginner',
            topics: ['Event Loop', 'TypeScript Generics', 'Utility Types'],
            prerequisites: [],
            lessons: [
              {
                id: 'fs-les-1',
                title: 'Event Loop & Microtask Execution Order',
                estimatedMinutes: 20,
                type: 'concept',
                summary: 'Understand synchronous frames, microtasks (Promises), and macrotasks (setTimeout).',
                practicePrompt: 'Predict output order for promises and macrotask timeouts.',
                quizQuestion: {
                  question: 'Which queue has higher priority after the synchronous execution stack empties?',
                  options: ['Microtask Queue (Promises)', 'Macrotask Queue (setTimeout)', 'I/O Polling', 'Idle Handlers'],
                  correctIndex: 0,
                  explanation: 'Microtasks run immediately upon completion of synchronous execution before the next macrotask is processed.',
                },
              },
              {
                id: 'fs-les-2',
                title: 'Strict Null Checks & Union Narrowing in TypeScript',
                estimatedMinutes: 30,
                type: 'code_challenge',
                summary: 'Implement discriminated unions and user-defined type guards for safe data handling.',
              },
            ],
          },
          {
            id: 'fs-course-102',
            title: 'React 18 Component Architecture & Hooks',
            slug: 'react-architecture',
            description: 'Virtual DOM reconciliation, state immutability, effect lifecycles, and custom hooks.',
            estimatedHours: 14,
            difficulty: 'intermediate',
            topics: ['Reconciliation', 'useEffect Lifecycle', 'Custom Hooks'],
            prerequisites: ['fs-course-101'],
            lessons: [
              {
                id: 'fs-les-3',
                title: 'Reconciliation & The Mechanics of Keys',
                estimatedMinutes: 25,
                type: 'concept',
                summary: 'Why index keys cause subtle bugs and how React tracks DOM identity.',
              },
              {
                id: 'fs-les-4',
                title: 'Building a Resilient Debounce Hook',
                estimatedMinutes: 35,
                type: 'code_challenge',
                summary: 'Write and test a useDebounce hook with proper cleanup to prevent memory leaks.',
              },
            ],
          },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Phase 2: Scalable Backend Services & Databases',
        description: 'REST API design, Node.js stream backpressure, and SQL relational query optimization.',
        estimatedWeeks: 4,
        status: 'not_started',
        completionPercentage: 0,
        skillsCovered: ['Node.js', 'SQL', 'REST APIs'],
        courses: [
          {
            id: 'fs-course-201',
            title: 'High-Throughput Node.js Microservices',
            slug: 'nodejs-services',
            description: 'Event-driven I/O, stream backpressure, and stateless JWT authentication.',
            estimatedHours: 12,
            difficulty: 'intermediate',
            topics: ['Streams', 'Idempotency', 'Middleware'],
            prerequisites: ['fs-course-102'],
            lessons: [
              {
                id: 'fs-les-5',
                title: 'Managing Stream Backpressure in Node.js',
                estimatedMinutes: 30,
                type: 'concept',
                summary: 'Prevent Out-Of-Memory crashes when piping fast streams to slow network consumers.',
              },
              {
                id: 'fs-les-6',
                title: 'Relational Database Schema & N+1 Query Elimination',
                estimatedMinutes: 40,
                type: 'code_challenge',
                summary: 'Optimize query loads by replacing N+1 iterations with batch joins.',
              },
            ],
          },
        ],
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Phase 3: Production Full Stack Capstone',
        description: 'End-to-end full stack deployment with automated CI/CD and monitoring.',
        estimatedWeeks: 3,
        status: 'locked',
        completionPercentage: 0,
        skillsCovered: ['Full Stack', 'CI/CD', 'Docker'],
        courses: [
          {
            id: 'fs-course-301',
            title: 'Full Stack Production Deployment & Containerization',
            slug: 'fullstack-capstone',
            description: 'Docker multi-stage builds, cloud hosting, and real-time database sync.',
            estimatedHours: 16,
            difficulty: 'advanced',
            topics: ['Docker', 'Production Monitoring', 'Full Stack Capstone'],
            prerequisites: ['fs-course-201'],
            lessons: [
              {
                id: 'fs-les-7',
                title: 'Multi-Stage Docker Packaging for Next.js & Node',
                estimatedMinutes: 45,
                type: 'project',
                summary: 'Create production-hardened minimal container images.',
              },
            ],
          },
        ],
      },
    ];
  }

  // Default: Data Scientist / AI Engineer Curriculum
  return [
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Phase 1: Computational Foundations & Mathematics',
      description: missingPrereqs.length > 0
        ? `Targeted focus on identified prerequisites: ${missingPrereqs.slice(0, 3).join(', ')}.`
        : 'Solidify algorithmic Python, linear algebra dimensions, and probability theory.',
      estimatedWeeks: 3,
      status: 'in_progress',
      completionPercentage: 0,
      skillsCovered: ['Python', 'Mathematics', 'Statistics'],
      courses: [
        {
          id: 'ds-course-101',
          title: 'Algorithmic Python & Vectorized Operations',
          slug: 'python-vectorization',
          description: 'Master list slicing, generators, NumPy multidimensional tensors, and memory profiling.',
          estimatedHours: 12,
          difficulty: 'beginner',
          topics: ['List Mutability', 'Generators', 'NumPy Broadcasting'],
          prerequisites: [],
          lessons: [
            {
              id: 'ds-les-1',
              title: 'Python Memory Mutability & Shallow Slicing',
              estimatedMinutes: 20,
              type: 'concept',
              summary: 'Understand how Python handles list references versus shallow copies.',
              practicePrompt: 'Predict mutability outputs across nested data structures.',
              quizQuestion: {
                question: 'When slicing a Python list `nums[1:4]`, what is created in memory?',
                options: [
                  'A new shallow copy of the specified slice',
                  'A pointer view modifying the original list in-place',
                  'An immutable tuple',
                  'A generator expression',
                ],
                correctIndex: 0,
                explanation: 'Standard slicing creates a new list with shallow references to the selected elements.',
              },
            },
            {
              id: 'ds-les-2',
              title: 'Lazy Evaluation with Python Generators',
              estimatedMinutes: 30,
              type: 'code_challenge',
              summary: 'Build memory-efficient streaming pipelines using yield and generator expressions.',
            },
            {
              id: 'ds-les-3',
              title: 'NumPy Tensor Broadcasting Rules',
              estimatedMinutes: 35,
              type: 'concept',
              summary: 'Derive trailing dimension alignment across multidimensional arrays.',
            },
          ],
        },
        {
          id: 'ds-course-102',
          title: 'Linear Algebra & Statistical Foundations',
          slug: 'linear-algebra-statistics',
          description: 'Matrix multiplication dimensions, dot products, covariance matrices, and Bayes theorem.',
          estimatedHours: 14,
          difficulty: 'intermediate',
          topics: ['Matrix Products', 'Bayes Theorem', 'Hypothesis Testing'],
          prerequisites: ['ds-course-101'],
          lessons: [
            {
              id: 'ds-les-4',
              title: 'Matrix Dot Products & Dimensional Invariants',
              estimatedMinutes: 25,
              type: 'concept',
              summary: 'Understand inner dimension alignment and projection geometry.',
            },
            {
              id: 'ds-les-5',
              title: 'Bayesian Inference & Base Rate Calibrations',
              estimatedMinutes: 30,
              type: 'quiz',
              summary: 'Solve medical testing and fraud detection posterior probability problems.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Phase 2: SQL, Data Manipulation & Machine Learning',
      description: 'Complex SQL window functions, exploratory data analysis, and predictive model training.',
      estimatedWeeks: 4,
      status: 'not_started',
      completionPercentage: 0,
      skillsCovered: ['SQL', 'Machine Learning', 'Data Analysis'],
      courses: [
        {
          id: 'ds-course-201',
          title: 'Advanced SQL & Analytical Window Functions',
          slug: 'advanced-sql-analytics',
          description: 'Master DENSE_RANK vs RANK, CTEs, aggregation filtering, and three-valued NULL logic.',
          estimatedHours: 10,
          difficulty: 'intermediate',
          topics: ['Window Functions', 'HAVING vs WHERE', 'Three-Valued Logic'],
          prerequisites: ['ds-course-101'],
          lessons: [
            {
              id: 'ds-les-6',
              title: 'SQL Partitioning & Window Ranking Functions',
              estimatedMinutes: 30,
              type: 'concept',
              summary: 'Calculate running averages, cohort ranks, and row offsets without grouping data away.',
            },
            {
              id: 'ds-les-7',
              title: 'Evaluating Bias-Variance Tradeoffs in Ensembles',
              estimatedMinutes: 35,
              type: 'code_challenge',
              summary: 'Diagnose overfitting vs underfitting in tree ensembles using validation curves.',
            },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Phase 3: Deep Learning, Transformers & Capstone Projects',
      description: 'Implement attention mechanisms, vector databases, and deploy end-to-end models.',
      estimatedWeeks: 4,
      status: 'locked',
      completionPercentage: 0,
      skillsCovered: ['PyTorch', 'Transformers', 'Vector Databases'],
      courses: [
        {
          id: 'ds-course-301',
          title: 'Attention Mechanisms & Modern Transformer Architectures',
          slug: 'transformer-mechanics',
          description: 'Scaled dot-product attention, causal masking, KV cache optimization, and vector search.',
          estimatedHours: 18,
          difficulty: 'advanced',
          topics: ['Self-Attention', 'HNSW Vector Search', 'KV Caching'],
          prerequisites: ['ds-course-201'],
          lessons: [
            {
              id: 'ds-les-8',
              title: 'Deriving Scaled Dot Product Attention in PyTorch',
              estimatedMinutes: 45,
              type: 'project',
              summary: 'Implement multi-head attention from scratch and verify gradient propagation.',
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Generates a rule-based personalized roadmap based on target career and assessment results
 */
export function generatePersonalizedRoadmap(
  userId: string,
  careerGoal: string,
  assessmentResult: AssessmentResult | null,
  profile: CompleteLearnerProfile | null
): PersonalizedRoadmap {
  const weakSkills = assessmentResult ? assessmentResult.weakAreas : [];
  const missingPrereqs = assessmentResult ? assessmentResult.missingPrerequisites : [];

  const phases = getCurriculumForCareer(careerGoal, weakSkills, missingPrereqs);

  // Count total lessons
  let totalLessonsCount = 0;
  phases.forEach((phase) => {
    phase.courses.forEach((course) => {
      totalLessonsCount += course.lessons.length;
    });
  });

  // Determine recommended first topic
  const firstPhase = phases[0];
  const firstCourse = firstPhase?.courses[0];
  const firstLesson = firstCourse?.lessons[0];

  const roadmap: PersonalizedRoadmap = {
    id: `roadmap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    careerGoal,
    generatedAt: new Date().toISOString(),
    assessmentResultId: assessmentResult?.id,
    phases,
    totalPhases: phases.length,
    completedPhases: 0,
    totalLessonsCount,
    completedLessonsCount: 0,
    overallProgressPercentage: 0,
    recommendedNextTopic: firstLesson
      ? {
          topicName: firstLesson.title,
          courseId: firstCourse.id,
          lessonId: firstLesson.id,
          phaseTitle: firstPhase.title,
        }
      : null,
  };

  saveLearnerRoadmap(roadmap);

  // Update learner progress state with roadmap status
  const state = getLearnerState(userId);
  state.roadmapStatus = 'generated';
  state.nextTopic = roadmap.recommendedNextTopic
    ? {
        topicName: roadmap.recommendedNextTopic.topicName,
        courseId: roadmap.recommendedNextTopic.courseId,
        lessonId: roadmap.recommendedNextTopic.lessonId,
      }
    : undefined;
  saveLearnerState(state);

  return roadmap;
}

/**
 * Retrieves the user's roadmap from local storage
 */
export function getLearnerRoadmap(userId: string): PersonalizedRoadmap | null {
  // If demo account and nothing saved, generate demo roadmap
  if (userId === DEMO_USER_ID) {
    try {
      const stored = localStorage.getItem(`${ROADMAP_STORAGE_PREFIX}${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    const demoRoadmap = generatePersonalizedRoadmap(userId, 'Data Scientist', null, null);
    // Mark first 4 lessons completed for the demo account
    demoRoadmap.completedLessonsCount = 4;
    demoRoadmap.overallProgressPercentage = 68;
    demoRoadmap.phases[0].status = 'completed';
    demoRoadmap.phases[0].completionPercentage = 100;
    saveLearnerRoadmap(demoRoadmap);
    return demoRoadmap;
  }

  try {
    const raw = localStorage.getItem(`${ROADMAP_STORAGE_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading roadmap:', err);
  }

  return null;
}

/**
 * Saves roadmap to storage
 */
export function saveLearnerRoadmap(roadmap: PersonalizedRoadmap): void {
  try {
    localStorage.setItem(`${ROADMAP_STORAGE_PREFIX}${roadmap.userId}`, JSON.stringify(roadmap));
  } catch (err) {
    console.error('Failed to save roadmap:', err);
  }
}

/**
 * Marks a lesson as completed by the learner and recalculates overall progress
 */
export function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  lessonTitle: string
): LearnerProgressState {
  const state = getLearnerState(userId);

  if (!state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
  }

  // Update hours logged and streak
  state.hoursLogged = Number((state.hoursLogged + 0.5).toFixed(1));
  state.lastActiveDate = new Date().toISOString();
  if (state.streakDays === 0) state.streakDays = 1;

  // Add activity log
  const activityItem: LearningActivityItem = {
    id: `act_${Date.now()}`,
    title: `Completed Lesson: ${lessonTitle}`,
    timestamp: 'Just now',
    type: 'lesson',
  };
  state.learningActivity = [activityItem, ...state.learningActivity.slice(0, 9)];

  // Update roadmap lesson count and overall percentage
  const roadmap = getLearnerRoadmap(userId);
  if (roadmap) {
    roadmap.completedLessonsCount = state.completedLessons.length;
    const pct = roadmap.totalLessonsCount > 0
      ? Math.min(100, Math.round((roadmap.completedLessonsCount / roadmap.totalLessonsCount) * 100))
      : 0;

    roadmap.overallProgressPercentage = pct;
    state.overallProgress = pct;

    // Check phase completions
    roadmap.phases.forEach((phase) => {
      let phaseLessons = 0;
      let phaseDone = 0;
      phase.courses.forEach((c) => {
        c.lessons.forEach((l) => {
          phaseLessons++;
          if (state.completedLessons.includes(l.id)) phaseDone++;
        });
      });
      phase.completionPercentage = phaseLessons > 0 ? Math.round((phaseDone / phaseLessons) * 100) : 0;
      if (phase.completionPercentage === 100) {
        phase.status = 'completed';
      } else if (phase.completionPercentage > 0) {
        phase.status = 'in_progress';
      }
    });

    // Find next uncompleted lesson
    let foundNext = false;
    for (const phase of roadmap.phases) {
      for (const course of phase.courses) {
        for (const lesson of course.lessons) {
          if (!state.completedLessons.includes(lesson.id)) {
            roadmap.recommendedNextTopic = {
              topicName: lesson.title,
              courseId: course.id,
              lessonId: lesson.id,
              phaseTitle: phase.title,
            };
            state.nextTopic = {
              topicName: lesson.title,
              courseId: course.id,
              lessonId: lesson.id,
            };
            state.currentLevel = lesson.title;
            state.currentCourseId = course.id;
            foundNext = true;
            break;
          }
        }
        if (foundNext) break;
      }
      if (foundNext) break;
    }

    saveLearnerRoadmap(roadmap);
  } else {
    // If no roadmap exists yet, progress is strictly 0%
    state.overallProgress = 0;
  }

  saveLearnerState(state);
  return state;
}

/**
 * Records assessment completion and generates personalized roadmap
 */
export function recordAssessmentCompletion(
  userId: string,
  assessmentResult: AssessmentResult,
  profile: CompleteLearnerProfile | null
): PersonalizedRoadmap {
  const state = getLearnerState(userId);
  state.assessmentStatus = 'completed';

  if (!state.completedAssessments.includes(assessmentResult.id)) {
    state.completedAssessments.push(assessmentResult.id);
  }

  // Populate skill proficiencies from demonstrated assessment
  assessmentResult.skillEstimates.forEach((se) => {
    state.skillProficiency[se.skill] = se.demonstratedProficiency;
  });

  // Log activity
  const act: LearningActivityItem = {
    id: `act_${Date.now()}`,
    title: `Completed Diagnostic Assessment (${assessmentResult.totalScorePercentage}%)`,
    timestamp: 'Just now',
    type: 'assessment',
    details: `${assessmentResult.strongAreas.length} strengths, ${assessmentResult.weakAreas.length} gaps identified`,
  };
  state.learningActivity = [act, ...state.learningActivity];

  saveLearnerState(state);

  // Generate personalized roadmap
  return generatePersonalizedRoadmap(
    userId,
    assessmentResult.careerGoal,
    assessmentResult,
    profile
  );
}

/**
 * Resets state for testing purposes
 */
export function resetLearnerState(userId: string): void {
  try {
    localStorage.removeItem(`${STATE_STORAGE_PREFIX}${userId}`);
    localStorage.removeItem(`${ROADMAP_STORAGE_PREFIX}${userId}`);
  } catch {}
}
