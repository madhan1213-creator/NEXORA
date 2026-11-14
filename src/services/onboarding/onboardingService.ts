import { CompleteLearnerProfile } from '@/types';
import { supabase, isSupabaseConfigured } from '@/services/auth/supabaseClient';

const DEV_PROFILE_STORAGE_KEY_PREFIX = 'skillpath_dev_learner_profile_';

/**
 * Saves a learner profile either to Supabase (if configured)
 * or to dedicated, isolated development storage.
 */
export async function saveLearnerProfile(
  profile: CompleteLearnerProfile
): Promise<{ success: boolean; data?: CompleteLearnerProfile; error?: string }> {
  try {
    // 1. Supabase PostgreSQL Persistence (if credentials present)
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('learner_profiles')
        .upsert(
          {
            user_id: profile.userId,
            career_goal: profile.careerGoal,
            custom_career_goal: profile.customCareerGoal,
            education: profile.education,
            skills: profile.skills,
            preferences: profile.preferences,
            is_onboarding_completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: profile };
    }

    // 2. Development-Only Isolated Storage (clearly marked, not mock data)
    const storageKey = `${DEV_PROFILE_STORAGE_KEY_PREFIX}${profile.userId}`;
    const finalizedProfile: CompleteLearnerProfile = {
      ...profile,
      isOnboardingCompleted: true,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(finalizedProfile));
    return { success: true, data: finalizedProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save learner profile' };
  }
}

/**
 * Retrieves the learner profile for a given user ID.
 */
export async function getLearnerProfile(
  userId: string
): Promise<CompleteLearnerProfile | null> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('learner_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        userId: data.user_id,
        careerGoal: data.career_goal,
        customCareerGoal: data.custom_career_goal,
        education: data.education,
        skills: data.skills,
        preferences: data.preferences,
        isOnboardingCompleted: data.is_onboarding_completed,
        completedAt: data.completed_at,
      };
    }

    const storageKey = `${DEV_PROFILE_STORAGE_KEY_PREFIX}${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;
    return JSON.parse(saved) as CompleteLearnerProfile;
  } catch {
    return null;
  }
}
