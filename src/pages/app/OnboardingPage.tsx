import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  GraduationCap,
  Code2,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Edit2,
  AlertCircle,
  Plus,
  X,
  Compass,
  Cpu,
  Shield,
  Layers,
  Terminal,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { saveLearnerProfile } from '@/services/onboarding/onboardingService';
import { CompleteLearnerProfile, SelectedSkill, SkillProficiency } from '@/types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Defined career options
const CAREER_OPTIONS = [
  {
    id: 'Data Scientist',
    title: 'Data Scientist',
    category: 'AI & Data',
    salary: '$145k – $210k',
    desc: 'Extract predictive statistical insights, build statistical pipelines, and train analytical ML models.',
    icon: Database,
  },
  {
    id: 'AI Engineer',
    title: 'AI Engineer',
    category: 'AI & Data',
    salary: '$165k – $260k',
    desc: 'Build production LLM inference pipelines, fine-tune model architectures, and manage vector indices.',
    icon: Cpu,
  },
  {
    id: 'Machine Learning Engineer',
    title: 'Machine Learning Engineer',
    category: 'AI & Data',
    salary: '$155k – $230k',
    desc: 'Design, optimize, and deploy scalable ML models, feature stores, and automated training workflows.',
    icon: Terminal,
  },
  {
    id: 'Full Stack Developer',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    salary: '$130k – $185k',
    desc: 'Architect fluid client interfaces integrated with resilient serverless backends and SQL data layers.',
    icon: Code2,
  },
  {
    id: 'Cloud Engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Systems',
    salary: '$140k – $205k',
    desc: 'Provision automated infrastructure-as-code and orchestrate resilient multi-cluster Kubernetes topologies.',
    icon: Layers,
  },
  {
    id: 'Cybersecurity Specialist',
    title: 'Cybersecurity Specialist',
    category: 'Cybersecurity',
    salary: '$135k – $195k',
    desc: 'Perform boundary penetration testing, threat modeling, and enforce Zero-Trust cryptographic protocols.',
    icon: Shield,
  },
];

// Preset core skills
const CORE_SKILLS = [
  'C',
  'C++',
  'Python',
  'Java',
  'JavaScript',
  'SQL',
  'Mathematics',
  'Statistics',
  'HTML/CSS',
];

const PROFICIENCY_OPTIONS: { id: SkillProficiency; label: string; desc: string; color: string }[] = [
  { id: 'no_experience', label: 'No experience', desc: 'Never written or studied', color: 'bg-neutral-100 text-neutral-600' },
  { id: 'beginner', label: 'Beginner', desc: 'Basic syntax & concepts', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Built projects & debugged', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'advanced', label: 'Advanced', desc: 'Production / deep theory', color: 'bg-brand-50 text-brand-900 border-brand-300 font-bold' },
];

export const OnboardingPage: React.FC = () => {
  const { user, completeOnboardingSession } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Career Goal
  const [selectedCareer, setSelectedCareer] = useState<string>('Data Scientist');
  const [isCustomCareer, setIsCustomCareer] = useState(false);
  const [customCareerText, setCustomCareerText] = useState('');

  // Step 2: Education
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree");
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [currentYear, setCurrentYear] = useState('3rd Year (Junior)');
  const [experienceBackground, setExperienceBackground] = useState('University CS coursework');

  // Step 3: Skills
  const [skills, setSkills] = useState<SelectedSkill[]>([
    { skill: 'Python', proficiency: 'intermediate' },
    { skill: 'SQL', proficiency: 'beginner' },
    { skill: 'Mathematics', proficiency: 'intermediate' },
    { skill: 'C++', proficiency: 'no_experience' },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 4: Preferences
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [learningStyle, setLearningStyle] = useState('Hands-on Coding Labs');
  const [previousCourses, setPreviousCourses] = useState('CS50: Introduction to Computer Science');
  const [completedProjects, setCompletedProjects] = useState('Built a CLI tool in Python and a responsive landing page');

  // Skill toggle helpers
  const handleSkillToggle = (skillName: string) => {
    const existing = skills.find((s) => s.skill.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      setSkills(skills.filter((s) => s.skill.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSkills([...skills, { skill: skillName, proficiency: 'beginner' }]);
    }
  };

  const handleProficiencyChange = (skillName: string, proficiency: SkillProficiency) => {
    setSkills(
      skills.map((s) =>
        s.skill.toLowerCase() === skillName.toLowerCase() ? { ...s, proficiency } : s
      )
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.skill.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { skill: trimmed, proficiency: 'beginner' }]);
    }
    setCustomSkillInput('');
  };

  // Final submission
  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const activeCareerGoal = isCustomCareer && customCareerText.trim()
      ? customCareerText.trim()
      : selectedCareer;

    const completeProfile: CompleteLearnerProfile = {
      userId: user?.id || `usr_dev_${Date.now()}`,
      careerGoal: activeCareerGoal,
      customCareerGoal: isCustomCareer ? customCareerText.trim() : undefined,
      education: {
        level: educationLevel,
        fieldOfStudy,
        currentYear,
        experienceBackground,
      },
      skills,
      preferences: {
        language: preferredLanguage,
        dailyStudyHours: dailyHours,
        style: learningStyle,
        previousCourses,
        completedProjects,
      },
      isOnboardingCompleted: true,
      completedAt: new Date().toISOString(),
    };

    const saveResult = await saveLearnerProfile(completeProfile);

    if (!saveResult.success) {
      setIsSubmitting(false);
      setErrorMessage(saveResult.error || 'Failed to save learner profile.');
      return;
    }

    // Complete session state
    await completeOnboardingSession(completeProfile);
    setIsSubmitting(false);

    // Explicit completion requirement: Redirect to /app/assessments
    navigate('/app/assessments');
  };

  const stepLabels = [
    '1. Career Goal',
    '2. Education',
    '3. Skills',
    '4. Preferences',
    '5. Review',
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 font-sans text-neutral-900">
      {/* Wizard Header */}
      <div className="text-center space-y-2 mb-8">
        <Badge variant="brand" className="font-mono uppercase text-[10px]">
          Step {step} of 5 // Personalized Learner Calibration
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-neutral-950 tracking-tight">
          Welcome, {user?.fullName || 'Learner'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
          Let’s map your background, current skill baseline, and study preferences to prepare your upcoming diagnostic assessment.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="mb-10">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-medium mb-3">
          {stepLabels.map((label, idx) => (
            <span
              key={label}
              className={`truncate transition-colors ${
                step === idx + 1
                  ? 'text-brand-700 font-bold'
                  : step > idx + 1
                  ? 'text-neutral-800'
                  : 'text-neutral-400'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex h-2 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
          <motion.div
            className="bg-brand-500 rounded-full h-full"
            initial={false}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: CAREER GOAL */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-neutral-950 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-600" />
                Select Your Desired Career Goal
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Choose the primary technical role you are working toward.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAREER_OPTIONS.map((c) => {
              const Icon = c.icon;
              const isSelected = !isCustomCareer && selectedCareer === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCareer(c.id);
                    setIsCustomCareer(false);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/30 shadow-card ring-1 ring-brand-500/20'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-brand-500 text-neutral-950 font-bold' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {c.salary}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-neutral-950 mb-1">{c.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">{c.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">{c.category}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-medium">Select</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Option to specify custom career goal */}
          <Card className={`p-4 border-2 transition-all ${
            isCustomCareer ? 'border-brand-500 bg-brand-50/20' : 'border-dashed border-neutral-300 bg-neutral-50/50'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                id="customCareerRadio"
                checked={isCustomCareer}
                onChange={() => setIsCustomCareer(true)}
                className="w-4 h-4 accent-brand-500"
              />
              <label htmlFor="customCareerRadio" className="text-xs font-semibold text-neutral-900 cursor-pointer">
                Have a different career destination? (Custom Track)
              </label>
            </div>
            {isCustomCareer && (
              <div className="pt-2">
                <Input
                  placeholder="e.g. Embedded AI Firmware Engineer, Robotics Systems Architect..."
                  value={customCareerText}
                  onChange={(e) => setCustomCareerText(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>
            )}
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold shadow-sm"
            >
              Continue to Education
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: CURRENT EDUCATION */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-950 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              Current Academic & Learning Background
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Helps calibrate the starting level of your future diagnostic assessment.
            </p>
          </div>

          <Card className="p-6 space-y-6">
            {/* Education Level */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Current / Highest Level of Education
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "Bachelor's Degree",
                  "Master's Degree",
                  "PhD / Doctorate",
                  "Associate Degree",
                  "High School Diploma",
                  "Self-Taught / Bootcamp",
                ].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEducationLevel(lvl)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                      educationLevel === lvl
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Field of Study / Major
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Computer Science',
                  'Data Science & AI',
                  'Software Engineering',
                  'Electrical / Electronics',
                  'Mathematics & Stats',
                  'Other / Non-Technical',
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFieldOfStudy(f)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                      fieldOfStudy === f
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Year */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Academic Standing / Current Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  '1st Year (Freshman)',
                  '2nd Year (Sophomore)',
                  '3rd Year (Junior)',
                  '4th Year (Senior)',
                  'Recent Graduate',
                  'Working Professional',
                ].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setCurrentYear(yr)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                      currentYear === yr
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Learning Experience */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Previous Learning Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'University CS coursework & labs',
                  'Self-taught with documentation & YouTube',
                  'Online certifications (Coursera, edX, etc.)',
                  'Industry internship or software job',
                ].map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperienceBackground(exp)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                      experienceBackground === exp
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold shadow-sm"
            >
              Continue to Existing Skills
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: EXISTING SKILLS & PROFICIENCY */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-950 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-600" />
              Select Existing Skills & Proficiency
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select languages, libraries, and fundamentals you've had exposure to, then calibrate your self-assessed proficiency.
            </p>
          </div>

          {/* Core Skills Selector */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Quick Pick Core Languages & Fundamentals
            </label>
            <div className="flex flex-wrap gap-2">
              {CORE_SKILLS.map((skillName) => {
                const isSelected = skills.some((s) => s.skill.toLowerCase() === skillName.toLowerCase());
                return (
                  <button
                    key={skillName}
                    type="button"
                    onClick={() => handleSkillToggle(skillName)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    <span>{skillName}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <Input
                placeholder="Add other skill (e.g. PyTorch, Docker)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="text-xs py-1.5"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCustomSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>
          </div>

          {/* Calibrate Proficiency Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase text-neutral-500 tracking-wider">
              Calibrate Selected Skills ({skills.length} Selected)
            </h3>

            {skills.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                No skills selected yet. Click any skill above to add it.
              </div>
            ) : (
              <div className="space-y-2.5">
                {skills.map((s) => (
                  <Card key={s.skill} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-sm text-neutral-950 w-28 truncate">
                        {s.skill}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSkillToggle(s.skill)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                        title="Remove skill"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 4 Proficiency Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 flex-1 max-w-lg">
                      {PROFICIENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleProficiencyChange(s.skill, opt.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                            s.proficiency === opt.id
                              ? `${opt.color} shadow-sm ring-1 ring-neutral-400/20`
                              : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold shadow-sm"
            >
              Continue to Preferences
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: LEARNING PREFERENCES */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Learning Preferences & Study Commitments
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Calibrate your study rhythm, primary language, and learning modality.
            </p>
          </div>

          <Card className="p-6 space-y-6">
            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Preferred Instruction Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['English', 'Spanish', 'Mandarin', 'Hindi', 'French', 'German', 'Japanese', 'Other'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLanguage(lang)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      preferredLanguage === lang
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Study Hours */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                  Available Study Hours Per Day
                </label>
                <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                  {dailyHours} {dailyHours === 1 ? 'Hour' : 'Hours'} / Day
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { hrs: 1, label: '1 Hour / day', note: 'Steady Pace' },
                  { hrs: 2, label: '2 Hours / day', note: 'Recommended Sprint' },
                  { hrs: 3, label: '3-4 Hours / day', note: 'Accelerated Track' },
                  { hrs: 5, label: '5+ Hours / day', note: 'Full-time Immersive' },
                ].map((item) => (
                  <button
                    key={item.hrs}
                    type="button"
                    onClick={() => setDailyHours(item.hrs)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      dailyHours === item.hrs
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Learning Style */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2.5">
                Preferred Learning Modality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'Hands-on Coding Labs', desc: 'In-browser IDE with unit-tested code execution' },
                  { id: 'Visual Concept Breakdowns', desc: 'Diagrams, mathematical intuition & flowcharts' },
                  { id: 'Problem-solving Challenges', desc: 'Algorithmic puzzle solving and edge cases' },
                  { id: 'Structured Reading & Docs', desc: 'Thorough technical documentation and RFC specs' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setLearningStyle(style.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      learningStyle === style.id
                        ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-bold shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs font-semibold">{style.id}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Courses */}
            <div>
              <Input
                label="Completed Courses / Certifications"
                placeholder="e.g. CS50, Coursera Machine Learning, FreeCodeCamp, None..."
                value={previousCourses}
                onChange={(e) => setPreviousCourses(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Completed Projects */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                Previous Technical Projects / Highlights
              </label>
              <textarea
                rows={2}
                placeholder="Describe 1-2 projects you've worked on, or links to your GitHub profile..."
                value={completedProjects}
                onChange={(e) => setCompletedProjects(e.target.value)}
                className="w-full bg-white text-neutral-900 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 leading-relaxed"
              />
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(5)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold shadow-sm"
            >
              Review Complete Profile
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: REVIEW & COMPLETE */}
      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Review Your Learner Profile
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Confirm your answers. You can edit any section before initializing your diagnostic assessment.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. Career Destination Review */}
            <Card className="p-5 border border-neutral-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                  1. Target Career Goal
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-950">
                    {isCustomCareer && customCareerText.trim() ? customCareerText : selectedCareer}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Calibrates required competency targets and assessment weighting.
                  </p>
                </div>
                <Badge variant="brand" className="font-mono text-xs">
                  Target Destination
                </Badge>
              </div>
            </Card>

            {/* 2. Education Review */}
            <Card className="p-5 border border-neutral-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                  2. Academic Background
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Level</span>
                  <span className="font-semibold text-neutral-900">{educationLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Field of Study</span>
                  <span className="font-semibold text-neutral-900">{fieldOfStudy}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Standing</span>
                  <span className="font-semibold text-neutral-900">{currentYear}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Experience</span>
                  <span className="font-semibold text-neutral-900">{experienceBackground}</span>
                </div>
              </div>
            </Card>

            {/* 3. Existing Skills Review */}
            <Card className="p-5 border border-neutral-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                  3. Self-Assessed Skills ({skills.length})
                </span>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <span
                    key={s.skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs text-neutral-800"
                  >
                    <span className="font-semibold">{s.skill}</span>
                    <span className="text-[10px] font-mono uppercase text-brand-800 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
                      {s.proficiency.replace('_', ' ')}
                    </span>
                  </span>
                ))}
              </div>
            </Card>

            {/* 4. Learning Preferences Review */}
            <Card className="p-5 border border-neutral-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                  4. Learning Preferences & Pacing
                </span>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Commitment</span>
                  <span className="font-semibold text-neutral-900">{dailyHours} Hours / Day</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Modality</span>
                  <span className="font-semibold text-neutral-900">{learningStyle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Language</span>
                  <span className="font-semibold text-neutral-900">{preferredLanguage}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Submission Notice */}
          <div className="p-4 rounded-2xl bg-brand-50/80 border border-brand-200/80 text-xs text-brand-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-semibold">Ready for Diagnostic Assessment:</strong>
              <p className="leading-relaxed">
                Saving will mark your onboarding as complete and route you directly to <strong>/app/assessments</strong> to calibrate your benchmark without generating fake roadmaps.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(4)}
              disabled={isSubmitting}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitProfile}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold shadow-electric text-sm px-6"
            >
              Save Profile & Launch Diagnostic Assessment
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
