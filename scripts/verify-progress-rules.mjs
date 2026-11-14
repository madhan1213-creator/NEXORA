/**
 * NEXORA Progress Calculation Engine Verification Script
 *
 * Direct verification of all 5 user-required test cases and edge cases.
 */

// ==========================================
// CANONICAL DEFINITIONS & WEIGHTS
// ==========================================

const LEVEL_1_PYTHON_QUESTIONS = [
  'py_q_01', 'py_q_02', 'py_q_03', 'py_q_04', 'py_q_05',
  'py_q_06', 'py_q_07', 'py_q_08', 'py_q_09', 'py_q_10',
];

const LEVEL_1_NUMPY_QUESTIONS = [
  'np_q_01', 'np_q_02', 'np_q_03', 'np_q_04', 'np_q_05',
  'np_q_06', 'np_q_07', 'np_q_08', 'np_q_09', 'np_q_10',
];

const LEVEL_1_PANDAS_QUESTIONS = [
  'pd_q_01', 'pd_q_02', 'pd_q_03', 'pd_q_04', 'pd_q_05',
  'pd_q_06', 'pd_q_07', 'pd_q_08', 'pd_q_09', 'pd_q_10',
];

const LEVEL_1_STATISTICS_QUESTIONS = [
  'stat_q_01', 'stat_q_02', 'stat_q_03', 'stat_q_04', 'stat_q_05',
  'stat_q_06', 'stat_q_07', 'stat_q_08', 'stat_q_09', 'stat_q_10',
];

const LEVEL_1_SQL_QUESTIONS = [
  'sql_q_01', 'sql_q_02', 'sql_q_03', 'sql_q_04', 'sql_q_05',
  'sql_q_06', 'sql_q_07', 'sql_q_08', 'sql_q_09', 'sql_q_10',
];

const LEVEL_1_TOPICS = [
  { id: 'python', name: 'Python Fundamentals & Logic', skill: 'Python', weight: 20, totalQuestions: 10, questionIds: LEVEL_1_PYTHON_QUESTIONS },
  { id: 'numpy', name: 'NumPy & Vectorized Math', skill: 'NumPy', weight: 20, totalQuestions: 10, questionIds: LEVEL_1_NUMPY_QUESTIONS },
  { id: 'pandas', name: 'Pandas & Data Manipulation', skill: 'Pandas', weight: 20, totalQuestions: 10, questionIds: LEVEL_1_PANDAS_QUESTIONS },
  { id: 'statistics', name: 'Statistical Inference & Probability', skill: 'Statistics', weight: 20, totalQuestions: 10, questionIds: LEVEL_1_STATISTICS_QUESTIONS },
  { id: 'sql', name: 'Relational Schemas & SQL', skill: 'SQL', weight: 20, totalQuestions: 10, questionIds: LEVEL_1_SQL_QUESTIONS },
];

const COURSE_LESSONS_MAP = {
  'ds-course-101': ['ds-les-1', 'ds-les-2', 'ds-les-3'],
  'ds-course-102': ['ds-les-4', 'ds-les-5'],
  'ds-course-201': ['ds-les-6', 'ds-les-7'],
  'ds-course-301': ['ds-les-8'],
};

// ==========================================
// CALCULATION LOGIC UNDER TEST
// ==========================================

function getTopicIdForQuestion(questionId) {
  const qLower = questionId.toLowerCase().trim();
  if (LEVEL_1_PYTHON_QUESTIONS.includes(questionId) || qLower.startsWith('py_') || qLower.startsWith('ds_py_') || qLower.includes('python')) return 'python';
  if (LEVEL_1_NUMPY_QUESTIONS.includes(questionId) || qLower.startsWith('np_') || qLower.startsWith('ds_np_') || qLower.includes('numpy')) return 'numpy';
  if (LEVEL_1_PANDAS_QUESTIONS.includes(questionId) || qLower.startsWith('pd_') || qLower.startsWith('ds_pd_') || qLower.includes('pandas')) return 'pandas';
  if (LEVEL_1_STATISTICS_QUESTIONS.includes(questionId) || qLower.startsWith('stat_') || qLower.startsWith('ds_stat_') || qLower.includes('stat')) return 'statistics';
  if (LEVEL_1_SQL_QUESTIONS.includes(questionId) || qLower.startsWith('sql_') || qLower.startsWith('ds_sql_') || qLower.includes('sql')) return 'sql';
  return null;
}

function calculateTopicProgress(topicId, completedQuestionIds = []) {
  const topic = LEVEL_1_TOPICS.find((t) => t.id === topicId);
  if (!topic) return 0;

  const uniqueQuestions = new Set(completedQuestionIds);
  let completedCount = 0;
  for (const qId of uniqueQuestions) {
    if (topic.questionIds.includes(qId) || getTopicIdForQuestion(qId) === topic.id) {
      completedCount++;
    }
  }

  if (topic.totalQuestions <= 0) return 0;
  return Math.min(100, Math.round((completedCount / topic.totalQuestions) * 100));
}

function getTopicProgressReport(topicId, completedQuestionIds = []) {
  const topic = LEVEL_1_TOPICS.find((t) => t.id === topicId);
  const percentage = calculateTopicProgress(topicId, completedQuestionIds);
  const uniqueQuestions = new Set(completedQuestionIds);
  let completedCount = 0;
  for (const qId of uniqueQuestions) {
    if (topic && (topic.questionIds.includes(qId) || getTopicIdForQuestion(qId) === topic.id)) {
      completedCount++;
    }
  }
  return {
    topicId,
    percentage,
    completedQuestions: completedCount,
    totalQuestions: topic ? topic.totalQuestions : 10,
    isCompleted: percentage === 100,
  };
}

function calculateLevelProgress(levelId = 'lvl-1', completedQuestionIds = []) {
  if (levelId === 'lvl-1' || levelId === 'level-1') {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const topic of LEVEL_1_TOPICS) {
      const topicPct = calculateTopicProgress(topic.id, completedQuestionIds);
      weightedSum += topicPct * topic.weight;
      totalWeight += topic.weight;
    }

    if (totalWeight <= 0) return 0;
    return Math.min(100, Math.round(weightedSum / totalWeight));
  }
  return 0;
}

function getLevel1ProgressBreakdown(completedQuestionIds = []) {
  const topics = LEVEL_1_TOPICS.map((t) => getTopicProgressReport(t.id, completedQuestionIds));
  const percentage = calculateLevelProgress('lvl-1', completedQuestionIds);
  const completedTopicsCount = topics.filter((t) => t.isCompleted).length;
  return {
    levelId: 'lvl-1',
    levelNumber: 1,
    title: 'Level 1: Foundations of Scientific Computing & Data',
    topics,
    percentage,
    isCompleted: percentage === 100,
    totalTopics: LEVEL_1_TOPICS.length,
    completedTopics: completedTopicsCount,
  };
}

function calculateCourseProgress(courseId, completedLessonIds = []) {
  const requiredLessons = COURSE_LESSONS_MAP[courseId];
  if (!requiredLessons || requiredLessons.length === 0) return 0;
  const completedSet = new Set(completedLessonIds);
  let count = 0;
  for (const l of requiredLessons) {
    if (completedSet.has(l)) count++;
  }
  return Math.min(100, Math.round((count / requiredLessons.length) * 100));
}

// ==========================================
// TEST SUITE EXECUTION
// ==========================================

console.log('====================================================');
console.log('NEXORA PROGRESS ENGINE - AUTOMATED RULE VERIFICATION');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    const result = fn();
    if (result.passed) {
      passCount++;
      console.log(`✓ [PASS] ${name}`);
      if (result.details) console.log(`   └─ ${result.details}`);
    } else {
      failCount++;
      console.error(`✗ [FAIL] ${name}`);
      console.error(`   └─ ${result.reason}`);
    }
  } catch (err) {
    failCount++;
    console.error(`✗ [ERROR] ${name}: ${err.message}`);
  }
}

// Test (a): 0/10 Python questions = 0%
runTest('Test (a): 0/10 Python questions = 0%', () => {
  const completed = [];
  const pct = calculateTopicProgress('python', completed);
  return {
    passed: pct === 0,
    details: `0 questions answered -> Python Progress: ${pct}%`,
    reason: `Expected 0%, got ${pct}%`,
  };
});

// Test (b): 5/10 Python questions = 50%
runTest('Test (b): 5/10 Python questions = 50%', () => {
  const completed = LEVEL_1_PYTHON_QUESTIONS.slice(0, 5);
  const pct = calculateTopicProgress('python', completed);
  return {
    passed: pct === 50,
    details: `5/10 questions answered -> Python Progress: ${pct}%`,
    reason: `Expected 50%, got ${pct}%`,
  };
});

// Test (c): 10/10 Python questions = 100% Python progress
runTest('Test (c): 10/10 Python questions = 100% Python progress', () => {
  const completed = [...LEVEL_1_PYTHON_QUESTIONS];
  const pct = calculateTopicProgress('python', completed);
  const report = getTopicProgressReport('python', completed);
  return {
    passed: pct === 100 && report.isCompleted === true,
    details: `10/10 questions answered -> Python Progress: ${pct}%, isCompleted: ${report.isCompleted}`,
    reason: `Expected 100% and isCompleted=true, got ${pct}%`,
  };
});

// Test (d): Python 100%, other topics 0% = Level 1 is NOT 100% (specifically 20%)
runTest('Test (d): Python 100%, other topics 0% = Level 1 is NOT 100% (specifically 20%)', () => {
  const completed = [...LEVEL_1_PYTHON_QUESTIONS];

  const py = calculateTopicProgress('python', completed);
  const np = calculateTopicProgress('numpy', completed);
  const pd = calculateTopicProgress('pandas', completed);
  const stat = calculateTopicProgress('statistics', completed);
  const sql = calculateTopicProgress('sql', completed);

  const l1 = calculateLevelProgress('lvl-1', completed);
  const l1Breakdown = getLevel1ProgressBreakdown(completed);

  const passed =
    py === 100 &&
    np === 0 &&
    pd === 0 &&
    stat === 0 &&
    sql === 0 &&
    l1 === 20 &&
    l1 !== 100 &&
    l1Breakdown.isCompleted === false;

  return {
    passed,
    details: `Python=${py}%, NumPy=${np}%, Pandas=${pd}%, Stats=${stat}%, SQL=${sql}% -> Level 1 Progress = ${l1}% (Strictly 20%, NOT 100%)`,
    reason: `Expected Python 100%, other topics 0%, Level 1 20%. Got: Python=${py}%, Level 1=${l1}%`,
  };
});

// Test (e): All required Level 1 topics complete = Level 1 100%
runTest('Test (e): All required Level 1 topics complete = Level 1 100%', () => {
  const completed = [
    ...LEVEL_1_PYTHON_QUESTIONS,
    ...LEVEL_1_NUMPY_QUESTIONS,
    ...LEVEL_1_PANDAS_QUESTIONS,
    ...LEVEL_1_STATISTICS_QUESTIONS,
    ...LEVEL_1_SQL_QUESTIONS,
  ];

  const l1 = calculateLevelProgress('lvl-1', completed);
  const l1Breakdown = getLevel1ProgressBreakdown(completed);

  const passed =
    l1 === 100 &&
    l1Breakdown.isCompleted === true &&
    l1Breakdown.completedTopics === 5;

  return {
    passed,
    details: `All 5 topics completed (50/50 questions) -> Level 1 Progress = ${l1}%, isCompleted: ${l1Breakdown.isCompleted}`,
    reason: `Expected Level 1=100%, got ${l1}%`,
  };
});

// Deduplication Test
runTest('Deduplication: Duplicate question submissions do not inflate progress', () => {
  const duplicates = [
    'py_q_01', 'py_q_01', 'py_q_01', 'py_q_01',
    'py_q_01', 'py_q_01', 'py_q_01', 'py_q_01',
  ];
  const pct = calculateTopicProgress('python', duplicates);
  return {
    passed: pct === 10,
    details: `8 duplicate submissions of py_q_01 -> Progress: ${pct}% (strictly 10%)`,
    reason: `Expected 10%, got ${pct}%`,
  };
});

// Course Independence Test
runTest('Course Independence: Course progress calculated strictly from its own lessons', () => {
  const c1 = calculateCourseProgress('ds-course-101', ['ds-les-1']);
  const c2 = calculateCourseProgress('ds-course-102', ['ds-les-1']);
  return {
    passed: c1 === 33 && c2 === 0,
    details: `ds-course-101 (1/3 lessons) = ${c1}%, ds-course-102 (0/2 lessons) = ${c2}%`,
    reason: `Expected c1=33%, c2=0%, got c1=${c1}%, c2=${c2}%`,
  };
});

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL LEARNING PROGRESS CALCULATION RULES VERIFIED SUCCESSFULLY.');
}
