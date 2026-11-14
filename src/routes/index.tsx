import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute, PublicAuthRoute } from '@/components/common/RouteGuards';

// Public Pages
import { HomePage } from '@/pages/public/HomePage';
import { CareersPage } from '@/pages/public/CareersPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { FeaturesPage } from '@/pages/public/FeaturesPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { FaqPage } from '@/pages/public/FaqPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// App Pages
import { OnboardingPage } from '@/pages/app/OnboardingPage';
import { DashboardPage } from '@/pages/app/DashboardPage';
import { RoadmapPage } from '@/pages/app/RoadmapPage';
import { SkillAnalysisPage } from '@/pages/app/SkillAnalysisPage';
import { LearningPage } from '@/pages/app/LearningPage';
import { CourseDetailPage } from '@/pages/app/CourseDetailPage';
import { CourseLevelDetailPage } from '@/pages/app/CourseLevelDetailPage';
import { AssessmentsPage } from '@/pages/app/AssessmentsPage';
import { CodeChallengePage } from '@/pages/app/CodeChallengePage';
import { AiMentorPage } from '@/pages/app/AiMentorPage';
import { ProgressPage } from '@/pages/app/ProgressPage';
import { ProfilePage } from '@/pages/app/ProfilePage';
import { SettingsPage } from '@/pages/app/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ================================================= */}
      {/* 1. PUBLIC WEBSITE ROUTES                          */}
      {/* ================================================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Route>

      {/* ================================================= */}
      {/* 2. AUTHENTICATION ROUTES (with PublicAuthRoute)   */}
      {/* ================================================= */}
      <Route element={<PublicAuthRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* ================================================= */}
      {/* 3. PROTECTED APPLICATION ROUTES                   */}
      {/* ================================================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          {/* Default redirect /app -> /app/dashboard */}
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="skill-analysis" element={<SkillAnalysisPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="courses/:courseId/levels/:levelId" element={<CourseLevelDetailPage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="code-challenge" element={<Navigate to="/app/code-challenge/challenge-python-basics" replace />} />
          <Route path="code-challenge/:challengeId" element={<CodeChallengePage />} />
          <Route path="ai-mentor" element={<AiMentorPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ================================================= */}
      {/* 4. NOT FOUND FALLBACK                             */}
      {/* ================================================= */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
