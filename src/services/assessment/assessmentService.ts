import {
  AssessmentBlueprint,
  AssessmentQuestion,
  AssessmentResult,
  AssessmentSession,
  DifficultyLevel,
} from '@/types/assessment';
import { CompleteLearnerProfile } from '@/types';
import { ASSESSMENT_BLUEPRINTS, QUESTIONS_BANK } from '@/data/assessmentData';
import { computeDiagnosticResults } from './scoringEngine';
import { supabase } from '@/services/auth/supabaseClient';

const SESSION_STORAGE_PREFIX = 'skillpath_assessment_session_';
const RESULTS_STORAGE_PREFIX = 'skillpath_assessment_results_';

/**
 * Returns the assessment blueprint for a given career goal
 */
export function getBlueprintForCareer(careerGoal: string): AssessmentBlueprint {
  if (ASSESSMENT_BLUEPRINTS[careerGoal]) {
    return ASSESSMENT_BLUEPRINTS[careerGoal];
  }
  // Fallback to Data Scientist if career not explicitly matched
  return ASSESSMENT_BLUEPRINTS['Data Scientist'];
}

/**
 * Selects an initial balanced set of questions for a diagnostic assessment
 * covering each domain in the blueprint with varying difficulty tiers.
 */
export function selectBlueprintQuestions(
  careerGoal: string,
  profile: CompleteLearnerProfile | null
): string[] {
  const blueprint = getBlueprintForCareer(careerGoal);
  const selectedQuestionIds: string[] = [];

  // Filter questions matching any domain or skill in this blueprint
  const candidateQuestions = QUESTIONS_BANK.filter((q) => {
    return blueprint.domains.some(
      (d) => d.domain.toLowerCase() === q.careerDomain.toLowerCase() || d.skill.toLowerCase() === q.skill.toLowerCase()
    );
  });

  // Ensure every domain gets at least 1-2 questions
  blueprint.domains.forEach((d) => {
    const domainQuestions = candidateQuestions.filter(
      (q) => q.careerDomain.toLowerCase() === d.domain.toLowerCase() || q.skill.toLowerCase() === d.skill.toLowerCase()
    );

    // Pick a beginner or intermediate question
    const beginnerQ = domainQuestions.find((q) => q.difficulty === 'beginner' && !selectedQuestionIds.includes(q.id));
    if (beginnerQ) selectedQuestionIds.push(beginnerQ.id);

    const interQ = domainQuestions.find((q) => q.difficulty === 'intermediate' && !selectedQuestionIds.includes(q.id));
    if (interQ) selectedQuestionIds.push(interQ.id);
  });

  // If we haven't reached target total (e.g., 10), fill with advanced or remaining questions
  if (selectedQuestionIds.length < blueprint.totalQuestions) {
    const remaining = candidateQuestions.filter((q) => !selectedQuestionIds.includes(q.id));
    for (const q of remaining) {
      if (selectedQuestionIds.length >= blueprint.totalQuestions) break;
      selectedQuestionIds.push(q.id);
    }
  }

  // Cap at blueprint.totalQuestions
  return selectedQuestionIds.slice(0, blueprint.totalQuestions);
}

/**
 * Retrieves the currently active assessment session from local storage or returns null
 */
export function getActiveSession(userId: string): AssessmentSession | null {
  try {
    const raw = localStorage.getItem(`${SESSION_STORAGE_PREFIX}${userId}`);
    if (!raw) return null;
    const session: AssessmentSession = JSON.parse(raw);
    if (session && !session.isCompleted) {
      return session;
    }
    return null;
  } catch (err) {
    console.error('Error reading assessment session from storage:', err);
    return null;
  }
}

/**
 * Creates and initializes a new assessment session
 */
export function createSession(
  userId: string,
  careerGoal: string,
  profile: CompleteLearnerProfile | null
): AssessmentSession {
  const blueprint = getBlueprintForCareer(careerGoal);
  const questionIds = selectBlueprintQuestions(careerGoal, profile);

  const newSession: AssessmentSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    careerGoal,
    blueprintId: blueprint.careerId,
    startedAt: new Date().toISOString(),
    currentQuestionIndex: 0,
    currentDifficulty: 'beginner',
    questionIds,
    responses: {},
    flaggedQuestionIds: [],
    timeElapsedSeconds: 0,
    isCompleted: false,
  };

  saveSession(newSession);
  return newSession;
}

/**
 * Saves in-flight session progress to storage
 */
export function saveSession(session: AssessmentSession): void {
  try {
    localStorage.setItem(`${SESSION_STORAGE_PREFIX}${session.userId}`, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save assessment session:', err);
  }
}

/**
 * Clears active session upon completion or manual discard
 */
export function clearSession(userId: string): void {
  try {
    localStorage.removeItem(`${SESSION_STORAGE_PREFIX}${userId}`);
  } catch (err) {
    console.error('Failed to clear assessment session:', err);
  }
}

/**
 * Evaluates, saves, and finalizes the diagnostic assessment
 */
export async function submitAndEvaluateSession(
  session: AssessmentSession,
  profile: CompleteLearnerProfile | null
): Promise<AssessmentResult> {
  // Compute deterministic score
  const result = computeDiagnosticResults(session, profile);

  // Mark session as completed
  session.isCompleted = true;
  session.resultId = result.id;
  saveSession(session);

  // Persist result locally
  try {
    const existing = getAllAssessmentResults(session.userId);
    const updated = [result, ...existing];
    localStorage.setItem(`${RESULTS_STORAGE_PREFIX}${session.userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist assessment results locally:', err);
  }

  // Attempt Supabase persistence if configured
  if (supabase) {
    try {
      await supabase.from('assessment_results').insert([
        {
          id: result.id,
          user_id: result.userId,
          career_goal: result.careerGoal,
          blueprint_id: result.blueprintId,
          total_score_percentage: result.totalScorePercentage,
          total_marks_awarded: result.totalMarksAwarded,
          total_possible_marks: result.totalPossibleMarks,
          time_spent_seconds: result.timeSpentSeconds,
          difficulty_breakdown: result.difficultyBreakdown,
          domain_breakdown: result.domainBreakdown,
          skill_estimates: result.skillEstimates,
          strong_areas: result.strongAreas,
          weak_areas: result.weakAreas,
          missing_prerequisites: result.missingPrerequisites,
          recommended_revision_topics: result.recommendedRevisionTopics,
          completed_at: result.completedAt,
        },
      ]);
    } catch (err) {
      console.warn('Supabase assessment insertion skipped/not configured:', err);
    }
  }

  // Clear in-flight active session
  clearSession(session.userId);

  return result;
}

/**
 * Retrieves all previous assessment results for the user
 */
export function getAllAssessmentResults(userId: string): AssessmentResult[] {
  try {
    const raw = localStorage.getItem(`${RESULTS_STORAGE_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load assessment results:', err);
    return [];
  }
}

/**
 * Retrieves the most recent assessment result for the user
 */
export function getLatestAssessmentResult(userId: string): AssessmentResult | null {
  const all = getAllAssessmentResults(userId);
  return all.length > 0 ? all[0] : null;
}
