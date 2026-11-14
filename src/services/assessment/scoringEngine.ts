import {
  AssessmentQuestion,
  DifficultyLevel,
  LearnerResponse,
  SkillProficiencyEstimate,
  AssessmentResult,
  AssessmentSession,
} from '@/types/assessment';
import { CompleteLearnerProfile, SkillProficiency } from '@/types';
import { QUESTIONS_BANK, ASSESSMENT_BLUEPRINTS } from '@/data/assessmentData';

/**
 * Normalizes strings for robust code output matching
 */
export function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Deterministically evaluates a learner's answer against a question's correct answer key
 */
export function evaluateAnswer(
  question: AssessmentQuestion,
  answer: string | string[]
): { isCorrect: boolean; awardedMarks: number } {
  if (answer === undefined || answer === null || answer === '') {
    return { isCorrect: false, awardedMarks: 0 };
  }

  switch (question.type) {
    case 'multiple_choice':
    case 'true_false':
    case 'scenario': {
      const isCorrect = String(answer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
      return {
        isCorrect,
        awardedMarks: isCorrect ? question.marks : 0,
      };
    }

    case 'multiple_select': {
      const learnerArr = Array.isArray(answer)
        ? answer.map((s) => String(s).trim().toLowerCase())
        : [String(answer).trim().toLowerCase()];
      const correctArr = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.map((s) => String(s).trim().toLowerCase())
        : [String(question.correctAnswer).trim().toLowerCase()];

      const correctSet = new Set(correctArr);
      const learnerSet = new Set(learnerArr);

      // Check for exact set equality
      if (learnerSet.size === correctSet.size && [...learnerSet].every((id) => correctSet.has(id))) {
        return { isCorrect: true, awardedMarks: question.marks };
      }

      // Proportional partial marks if no wrong options selected
      const incorrectSelections = learnerArr.filter((id) => !correctSet.has(id));
      const correctSelections = learnerArr.filter((id) => correctSet.has(id));

      if (incorrectSelections.length === 0 && correctSelections.length > 0) {
        const ratio = correctSelections.length / correctArr.length;
        const awarded = Math.round(question.marks * ratio);
        return { isCorrect: false, awardedMarks: awarded };
      }

      return { isCorrect: false, awardedMarks: 0 };
    }

    case 'code_output': {
      const normLearner = normalizeOutput(String(answer));
      const normCorrect = normalizeOutput(String(question.correctAnswer));
      const isCorrect = normLearner === normCorrect;
      return {
        isCorrect,
        awardedMarks: isCorrect ? question.marks : 0,
      };
    }

    case 'short_code': {
      const normLearner = normalizeOutput(String(answer));
      const normCorrect = normalizeOutput(String(question.correctAnswer));
      // Exact code match or structural evaluation
      const isCorrect = normLearner === normCorrect;
      return {
        isCorrect,
        awardedMarks: isCorrect ? question.marks : 0,
      };
    }

    default: {
      const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();
      return {
        isCorrect,
        awardedMarks: isCorrect ? question.marks : 0,
      };
    }
  }
}

/**
 * Calculates adaptive difficulty adjustment based on recent answer history
 */
export function calculateNextAdaptiveDifficulty(
  currentDifficulty: DifficultyLevel,
  recentResponses: { isCorrect: boolean; difficulty: DifficultyLevel }[]
): DifficultyLevel {
  if (recentResponses.length === 0) return currentDifficulty;

  const lastTwo = recentResponses.slice(-2);
  const consecutiveCorrect = lastTwo.length === 2 && lastTwo.every((r) => r.isCorrect);
  const consecutiveWrong = lastTwo.length === 2 && lastTwo.every((r) => !r.isCorrect);

  if (consecutiveCorrect) {
    if (currentDifficulty === 'beginner') return 'intermediate';
    if (currentDifficulty === 'intermediate') return 'advanced';
    return 'advanced';
  }

  if (consecutiveWrong) {
    if (currentDifficulty === 'advanced') return 'intermediate';
    if (currentDifficulty === 'intermediate') return 'beginner';
    return 'beginner';
  }

  return currentDifficulty;
}

/**
 * Computes complete deterministic diagnostic results
 */
export function computeDiagnosticResults(
  session: AssessmentSession,
  profile: CompleteLearnerProfile | null
): AssessmentResult {
  const evaluatedResponses: LearnerResponse[] = [];
  let totalMarksAwarded = 0;
  let totalPossibleMarks = 0;

  const difficultyStats: Record<DifficultyLevel, { attempted: number; correct: number; totalMarks: number; awardedMarks: number }> = {
    beginner: { attempted: 0, correct: 0, totalMarks: 0, awardedMarks: 0 },
    intermediate: { attempted: 0, correct: 0, totalMarks: 0, awardedMarks: 0 },
    advanced: { attempted: 0, correct: 0, totalMarks: 0, awardedMarks: 0 },
  };

  const domainStats: Record<string, { attempted: number; correct: number; totalMarks: number; awardedMarks: number }> = {};
  const skillStats: Record<string, { attempted: number; correct: number; totalMarks: number; awardedMarks: number; missingPrereqs: Set<string> }> = {};

  const missingPrerequisitesSet = new Set<string>();
  const recommendedRevisionTopicsSet = new Set<string>();

  // Evaluate each question in the session
  session.questionIds.forEach((qId) => {
    const question = QUESTIONS_BANK.find((q) => q.id === qId);
    if (!question) return;

    const answer = session.responses[qId];
    const { isCorrect, awardedMarks } = evaluateAnswer(question, answer);

    totalMarksAwarded += awardedMarks;
    totalPossibleMarks += question.marks;

    // Track difficulty stats
    const diff = question.difficulty;
    difficultyStats[diff].attempted += 1;
    difficultyStats[diff].totalMarks += question.marks;
    difficultyStats[diff].awardedMarks += awardedMarks;
    if (isCorrect) difficultyStats[diff].correct += 1;

    // Track domain stats
    const domain = question.careerDomain;
    if (!domainStats[domain]) {
      domainStats[domain] = { attempted: 0, correct: 0, totalMarks: 0, awardedMarks: 0 };
    }
    domainStats[domain].attempted += 1;
    domainStats[domain].totalMarks += question.marks;
    domainStats[domain].awardedMarks += awardedMarks;
    if (isCorrect) domainStats[domain].correct += 1;

    // Track skill stats
    const skill = question.skill;
    if (!skillStats[skill]) {
      skillStats[skill] = { attempted: 0, correct: 0, totalMarks: 0, awardedMarks: 0, missingPrereqs: new Set() };
    }
    skillStats[skill].attempted += 1;
    skillStats[skill].totalMarks += question.marks;
    skillStats[skill].awardedMarks += awardedMarks;
    if (isCorrect) {
      skillStats[skill].correct += 1;
    } else {
      // Flag missing prerequisites and revision topics
      if (question.prerequisites && question.prerequisites.length > 0) {
        question.prerequisites.forEach((p) => {
          missingPrerequisitesSet.add(p);
          skillStats[skill].missingPrereqs.add(p);
        });
      }
      recommendedRevisionTopicsSet.add(question.topic);
    }

    evaluatedResponses.push({
      questionId: qId,
      answer: answer || '',
      isCorrect,
      timeSpentSeconds: 0,
      awardedMarks,
      maxMarks: question.marks,
    });
  });

  // Calculate overall percentage
  const totalScorePercentage = totalPossibleMarks > 0
    ? Math.round((totalMarksAwarded / totalPossibleMarks) * 100)
    : 0;

  // Compile difficulty breakdown
  const difficultyBreakdown: Record<DifficultyLevel, { attempted: number; correct: number; percentage: number }> = {
    beginner: {
      attempted: difficultyStats.beginner.attempted,
      correct: difficultyStats.beginner.correct,
      percentage: difficultyStats.beginner.totalMarks > 0
        ? Math.round((difficultyStats.beginner.awardedMarks / difficultyStats.beginner.totalMarks) * 100)
        : 0,
    },
    intermediate: {
      attempted: difficultyStats.intermediate.attempted,
      correct: difficultyStats.intermediate.correct,
      percentage: difficultyStats.intermediate.totalMarks > 0
        ? Math.round((difficultyStats.intermediate.awardedMarks / difficultyStats.intermediate.totalMarks) * 100)
        : 0,
    },
    advanced: {
      attempted: difficultyStats.advanced.attempted,
      correct: difficultyStats.advanced.correct,
      percentage: difficultyStats.advanced.totalMarks > 0
        ? Math.round((difficultyStats.advanced.awardedMarks / difficultyStats.advanced.totalMarks) * 100)
        : 0,
    },
  };

  // Compile domain breakdown
  const domainBreakdown: Record<string, { attempted: number; correct: number; percentage: number }> = {};
  Object.keys(domainStats).forEach((domain) => {
    const s = domainStats[domain];
    domainBreakdown[domain] = {
      attempted: s.attempted,
      correct: s.correct,
      percentage: s.totalMarks > 0 ? Math.round((s.awardedMarks / s.totalMarks) * 100) : 0,
    };
  });

  // Compile skill proficiency estimates, cross-referenced with onboarding self-reported profile
  const strongAreas: string[] = [];
  const weakAreas: string[] = [];
  const skillEstimates: SkillProficiencyEstimate[] = [];

  // Determine user's target blueprint skills
  const blueprint = ASSESSMENT_BLUEPRINTS[session.careerGoal] || Object.values(ASSESSMENT_BLUEPRINTS)[0];
  const blueprintSkills = new Set(blueprint.domains.map((d) => d.skill));
  Object.keys(skillStats).forEach((s) => blueprintSkills.add(s));

  blueprintSkills.forEach((skillName) => {
    // Find self-reported proficiency from profile
    let selfReported: SkillProficiency | 'untested' = 'untested';
    if (profile && profile.skills) {
      const match = profile.skills.find((s) => s.skill.toLowerCase() === skillName.toLowerCase());
      if (match) {
        selfReported = match.proficiency;
      }
    }

    const stat = skillStats[skillName];
    if (!stat || stat.attempted === 0) {
      skillEstimates.push({
        skill: skillName,
        selfReportedProficiency: selfReported,
        demonstratedProficiency: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        level: 'Novice',
        status: 'not_assessed',
        missingPrerequisites: [],
      });
      return;
    }

    const demonstratedPct = stat.totalMarks > 0
      ? Math.round((stat.awardedMarks / stat.totalMarks) * 100)
      : 0;

    let level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' = 'Novice';
    if (demonstratedPct >= 90) level = 'Advanced';
    else if (demonstratedPct >= 70) level = 'Proficient';
    else if (demonstratedPct >= 45) level = 'Developing';
    else level = 'Novice';

    let status: 'strong' | 'developing' | 'weak' | 'not_assessed' = 'developing';
    if (demonstratedPct >= 75) {
      status = 'strong';
      strongAreas.push(skillName);
    } else if (demonstratedPct < 50) {
      status = 'weak';
      weakAreas.push(skillName);
    }

    skillEstimates.push({
      skill: skillName,
      selfReportedProficiency: selfReported,
      demonstratedProficiency: demonstratedPct,
      questionsAttempted: stat.attempted,
      questionsCorrect: stat.correct,
      level,
      status,
      missingPrerequisites: Array.from(stat.missingPrereqs),
    });
  });

  return {
    id: `result_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: session.userId,
    blueprintId: session.blueprintId,
    careerGoal: session.careerGoal,
    completedAt: new Date().toISOString(),
    totalScorePercentage,
    totalMarksAwarded,
    totalPossibleMarks,
    timeSpentSeconds: session.timeElapsedSeconds,
    difficultyBreakdown,
    domainBreakdown,
    skillEstimates,
    strongAreas,
    weakAreas,
    missingPrerequisites: Array.from(missingPrerequisitesSet),
    recommendedRevisionTopics: Array.from(recommendedRevisionTopicsSet),
    responses: evaluatedResponses,
  };
}
