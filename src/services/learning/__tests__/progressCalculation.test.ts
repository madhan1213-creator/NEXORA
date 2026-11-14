/**
 * NEXORA Progress Calculation Test Suite
 *
 * Verifies all 5 required test conditions:
 * Test (a): 0/10 Python questions = 0%
 * Test (b): 5/10 Python questions = 50%
 * Test (c): 10/10 Python questions = 100% Python progress
 * Test (d): Python 100%, other topics 0% = Level 1 is NOT 100% (specifically 20%)
 * Test (e): All required Level 1 topics complete = Level 1 100%
 *
 * Additional verification:
 * - Duplicate submissions do not inflate progress
 * - Question completion != lesson completion != level completion
 * - Independent course progress calculation
 */

import {
  calculateTopicProgress,
  calculateLevelProgress,
  calculateCourseProgress,
  getTopicProgressReport,
  getLevel1ProgressBreakdown,
  LEVEL_1_PYTHON_QUESTIONS,
  LEVEL_1_NUMPY_QUESTIONS,
  LEVEL_1_PANDAS_QUESTIONS,
  LEVEL_1_STATISTICS_QUESTIONS,
  LEVEL_1_SQL_QUESTIONS,
} from '../progressCalculationService';

export function runProgressCalculationTests(): {
  total: number;
  passed: number;
  failed: number;
  results: { name: string; passed: boolean; message: string }[];
} {
  const results: { name: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, failureMessage: string) {
    if (condition) {
      results.push({ name: testName, passed: true, message: 'PASSED' });
    } else {
      results.push({ name: testName, passed: false, message: `FAILED: ${failureMessage}` });
    }
  }

  // ==========================================
  // Test (a): 0/10 Python questions = 0%
  // ==========================================
  {
    const completedQuestions: string[] = [];
    const pythonProgress = calculateTopicProgress('python', completedQuestions);
    assert(
      pythonProgress === 0,
      'Test (a): 0/10 Python questions = 0%',
      `Expected 0%, got ${pythonProgress}%`
    );
  }

  // ==========================================
  // Test (b): 5/10 Python questions = 50%
  // ==========================================
  {
    const completedQuestions = LEVEL_1_PYTHON_QUESTIONS.slice(0, 5); // 5 questions
    const pythonProgress = calculateTopicProgress('python', completedQuestions);
    assert(
      pythonProgress === 50,
      'Test (b): 5/10 Python questions = 50%',
      `Expected 50%, got ${pythonProgress}%`
    );
  }

  // ==========================================
  // Test (c): 10/10 Python questions = 100% Python progress
  // ==========================================
  {
    const completedQuestions = [...LEVEL_1_PYTHON_QUESTIONS]; // all 10 questions
    const pythonProgress = calculateTopicProgress('python', completedQuestions);
    const report = getTopicProgressReport('python', completedQuestions);

    assert(
      pythonProgress === 100 && report.isCompleted === true,
      'Test (c): 10/10 Python questions = 100% Python progress',
      `Expected 100% and isCompleted=true, got ${pythonProgress}%, isCompleted=${report.isCompleted}`
    );
  }

  // ==========================================
  // Test (d): Python 100%, other topics 0% = Level 1 is NOT 100% (specifically 20%)
  // ==========================================
  {
    // Completed all 10 Python questions, 0 for NumPy, 0 for Pandas, 0 for Statistics, 0 for SQL
    const completedQuestions = [...LEVEL_1_PYTHON_QUESTIONS];

    const pythonProgress = calculateTopicProgress('python', completedQuestions);
    const numpyProgress = calculateTopicProgress('numpy', completedQuestions);
    const pandasProgress = calculateTopicProgress('pandas', completedQuestions);
    const statsProgress = calculateTopicProgress('statistics', completedQuestions);
    const sqlProgress = calculateTopicProgress('sql', completedQuestions);

    const level1Progress = calculateLevelProgress('lvl-1', completedQuestions);
    const level1Report = getLevel1ProgressBreakdown(completedQuestions);

    const isOtherTopicsZero =
      numpyProgress === 0 &&
      pandasProgress === 0 &&
      statsProgress === 0 &&
      sqlProgress === 0;

    const isLevel1Not100 = level1Progress !== 100;
    const isLevel1Exactly20 = level1Progress === 20;

    assert(
      pythonProgress === 100 && isOtherTopicsZero && isLevel1Not100 && isLevel1Exactly20,
      'Test (d): Python 100%, other topics 0% = Level 1 is NOT 100% (Level 1 = 20%)',
      `Expected Python=100%, other topics=0%, Level 1=20%. Got: Python=${pythonProgress}%, NumPy=${numpyProgress}%, Pandas=${pandasProgress}%, Stats=${statsProgress}%, SQL=${sqlProgress}%, Level 1=${level1Progress}%`
    );
  }

  // ==========================================
  // Test (e): All required Level 1 topics complete = Level 1 100%
  // ==========================================
  {
    // All 5 topics completed (10 questions each = 50 total questions)
    const completedQuestions = [
      ...LEVEL_1_PYTHON_QUESTIONS,
      ...LEVEL_1_NUMPY_QUESTIONS,
      ...LEVEL_1_PANDAS_QUESTIONS,
      ...LEVEL_1_STATISTICS_QUESTIONS,
      ...LEVEL_1_SQL_QUESTIONS,
    ];

    const level1Progress = calculateLevelProgress('lvl-1', completedQuestions);
    const level1Report = getLevel1ProgressBreakdown(completedQuestions);

    assert(
      level1Progress === 100 && level1Report.isCompleted === true && level1Report.completedTopics === 5,
      'Test (e): All required Level 1 topics complete = Level 1 100%',
      `Expected Level 1=100%, isCompleted=true, completedTopics=5. Got: ${level1Progress}%, isCompleted=${level1Report.isCompleted}, completedTopics=${level1Report.completedTopics}`
    );
  }

  // ==========================================
  // Additional Test 1: Deduplication prevents progress inflation
  // ==========================================
  {
    // Submitting the same question 10 times should only count as 1/10 = 10%
    const duplicateQuestions = [
      LEVEL_1_PYTHON_QUESTIONS[0],
      LEVEL_1_PYTHON_QUESTIONS[0],
      LEVEL_1_PYTHON_QUESTIONS[0],
      LEVEL_1_PYTHON_QUESTIONS[0],
      LEVEL_1_PYTHON_QUESTIONS[0],
      LEVEL_1_PYTHON_QUESTIONS[0],
    ];
    const progress = calculateTopicProgress('python', duplicateQuestions);
    assert(
      progress === 10,
      'Deduplication: Duplicate question submissions do not inflate progress',
      `Expected 10% from 1 unique question submitted 6 times, got ${progress}%`
    );
  }

  // ==========================================
  // Additional Test 2: Independent Course Progress
  // ==========================================
  {
    // Course ds-course-101 has 3 lessons: 'ds-les-1', 'ds-les-2', 'ds-les-3'
    // 1 completed lesson = 33%
    const courseProgress = calculateCourseProgress('ds-course-101', ['ds-les-1']);
    // Course ds-course-102 has 2 lessons: 0 completed = 0%
    const course2Progress = calculateCourseProgress('ds-course-102', ['ds-les-1']);

    assert(
      courseProgress === 33 && course2Progress === 0,
      'Course Independence: Progress is strictly isolated to the specific course',
      `Expected ds-course-101=33%, ds-course-102=0%. Got: ${courseProgress}%, ${course2Progress}%`
    );
  }

  // ==========================================
  // Additional Test 3: Incomplete topics never automatically become 100%
  // ==========================================
  {
    const completedQuestions = [...LEVEL_1_PYTHON_QUESTIONS]; // only Python
    const numpyReport = getTopicProgressReport('numpy', completedQuestions);
    const pandasReport = getTopicProgressReport('pandas', completedQuestions);

    assert(
      numpyReport.percentage === 0 &&
      pandasReport.percentage === 0 &&
      !numpyReport.isCompleted &&
      !pandasReport.isCompleted,
      'Topic Independence: Incomplete topics never automatically become 100%',
      `Expected NumPy and Pandas to remain 0% and isCompleted=false. Got: NumPy=${numpyReport.percentage}%, Pandas=${pandasReport.percentage}%`
    );
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}

// Auto-run when executed directly via node --experimental-strip-types
const isMain = typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('progressCalculation');
if (isMain) {
  const summary = runProgressCalculationTests();
  console.log(`\n========================================`);
  console.log(`NEXORA PROGRESS ENGINE TEST RESULTS`);
  console.log(`Passed: ${summary.passed}/${summary.total}`);
  console.log(`Failed: ${summary.failed}/${summary.total}`);
  console.log(`========================================\n`);

  for (const r of summary.results) {
    console.log(`${r.passed ? '✓' : '✗'} ${r.name}`);
    if (!r.passed) {
      console.error(`  ${r.message}`);
    }
  }

  if (summary.failed > 0) {
    process.exit(1);
  }
}
