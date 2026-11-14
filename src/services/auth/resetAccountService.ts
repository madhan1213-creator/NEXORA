import { User } from '@/types';
import { createFreshLearnerState, saveLearnerState } from '@/services/learning/learnerService';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface ResetAccountSummary {
  userId: string;
  userEmail: string;
  clearedStorageKeys: string[];
  preservedAccountsCount: number;
}

/**
 * Resets the currently logged-in test account to a completely fresh first-time learner state.
 *
 * Guarantees:
 * 1. Strictly disabled in production mode (import.meta.env.DEV check).
 * 2. Only data belonging to this specific user ID is reset.
 * 3. Other registered users' data in dev storage are preserved intact.
 * 4. Does not touch or modify production data.
 * 5. Preserves user code IDE drafts and unrelated keys.
 * 6. Clears onboarding profile, diagnostic assessments, personalized roadmap,
 *    completed courses/lessons, hours, streak, XP, and activity history.
 */
export async function resetTestAccountData(user: User): Promise<ResetAccountSummary> {
  // Hard Production Safeguard: Never execute account reset in production environments
  if (!import.meta.env.DEV) {
    console.warn('[NEXORA Security] Blocked reset attempt: Development account reset is strictly disabled in production builds.');
    return {
      userId: user.id,
      userEmail: user.email,
      clearedStorageKeys: [],
      preservedAccountsCount: 0,
    };
  }

  const userId = user.id;
  const clearedKeys: string[] = [];

  // 1. Remove Onboarding Profile for this user
  const profileKey = `skillpath_dev_learner_profile_${userId}`;
  if (localStorage.getItem(profileKey) !== null) {
    localStorage.removeItem(profileKey);
    clearedKeys.push(profileKey);
  }

  // 2. Remove Personalized Career Roadmap for this user
  const roadmapKey = `skillpath_roadmap_${userId}`;
  if (localStorage.getItem(roadmapKey) !== null) {
    localStorage.removeItem(roadmapKey);
    clearedKeys.push(roadmapKey);
  }

  // 3. Remove Active Assessment In-Flight Session for this user
  const sessionKey = `skillpath_assessment_session_${userId}`;
  if (localStorage.getItem(sessionKey) !== null) {
    localStorage.removeItem(sessionKey);
    clearedKeys.push(sessionKey);
  }

  // 4. Remove Historical Assessment Results for this user
  const resultsKey = `skillpath_assessment_results_${userId}`;
  if (localStorage.getItem(resultsKey) !== null) {
    localStorage.removeItem(resultsKey);
    clearedKeys.push(resultsKey);
  }

  // 5. Re-initialize Learner Progress State to a genuinely fresh 0% baseline
  const freshState = createFreshLearnerState(userId);
  freshState.overallProgress = 0;
  freshState.completedCourses = [];
  freshState.completedLessons = [];
  freshState.completedAssessments = [];
  freshState.completedQuestions = [];
  freshState.topicProgress = {
    python: 0,
    numpy: 0,
    pandas: 0,
    statistics: 0,
    sql: 0,
  };
  freshState.levelProgress = { 'lvl-1': 0 };
  freshState.courseProgress = {};
  freshState.assessmentStatus = 'not_started';
  freshState.roadmapStatus = 'not_generated';
  freshState.hoursLogged = 0;
  freshState.streakDays = 0;
  freshState.learningActivity = [];
  freshState.achievements = [];
  freshState.skillProficiency = {};
  saveLearnerState(freshState);
  clearedKeys.push(`skillpath_learner_state_${userId}`);

  // Note: Code IDE challenge drafts and user settings are preserved as required.

  // 6. Update dev registered users list WITHOUT touching any other user
  let preservedCount = 0;
  try {
    const rawUsers = localStorage.getItem('skillpath_dev_registered_users');
    if (rawUsers) {
      const users = JSON.parse(rawUsers);
      if (Array.isArray(users)) {
        preservedCount = users.filter((u: any) => u.id !== userId).length;
        const targetIdx = users.findIndex((u: any) => u.id === userId);
        if (targetIdx !== -1) {
          users[targetIdx].isProfileComplete = false;
          localStorage.setItem('skillpath_dev_registered_users', JSON.stringify(users));
        }
      }
    }
  } catch (e) {
    console.error('Error updating dev registered users list:', e);
  }

  // 7. If Supabase is connected in a local dev test environment, reset ONLY this user's records
  if (import.meta.env.DEV && isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('learner_profiles')
        .update({
          is_onboarding_completed: false,
          overall_progress: 0,
          completed_courses: [],
          completed_lessons: [],
          completed_assessments: [],
          assessment_status: 'not_started',
          roadmap_status: 'not_generated',
          hours_logged: 0,
          streak_days: 0,
        })
        .eq('user_id', userId);

      await supabase.from('assessment_results').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase test reset skipped/not configured:', err);
    }
  }

  return {
    userId,
    userEmail: user.email,
    clearedStorageKeys: clearedKeys,
    preservedAccountsCount: preservedCount,
  };
}
