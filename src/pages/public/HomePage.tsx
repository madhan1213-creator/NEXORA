import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Radar,
  Terminal,
  Bot,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Code2,
  Target,
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Play,
  HelpCircle,
  FileCode2,
  DollarSign,
  Lock,
  Flame,
  Clock,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, useReducedMotion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeAssessmentTab, setActiveAssessmentTab] = useState<'quiz' | 'coding' | 'capstone'>('coding');
  const [activeCareerCategory, setActiveCareerCategory] = useState<'All' | 'AI & Data' | 'Engineering' | 'Systems'>('All');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  const careerPaths = [
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      category: 'AI & Data',
      salary: '$145k – $210k',
      demand: 'High Demand',
      description: 'Design predictive statistical pipelines and extract core insights from distributed telemetry datasets.',
      skills: ['Python', 'PyTorch', 'Pandas', 'Bayesian Inference'],
      matchRate: '94% Market Match',
    },
    {
      id: 'ai-engineer',
      title: 'AI Engineer',
      category: 'AI & Data',
      salary: '$165k – $260k',
      demand: 'Surging Demand',
      description: 'Build production LLM inference pipelines, fine-tune model architectures, and manage vector indices.',
      skills: ['vLLM', 'Transformers', 'Qdrant', 'RAG Architectures'],
      matchRate: '98% Market Match',
    },
    {
      id: 'full-stack',
      title: 'Full Stack Architect',
      category: 'Engineering',
      salary: '$130k – $185k',
      demand: 'High Demand',
      description: 'Architect reactive client frontends integrated with scalable, distributed serverless cloud backends.',
      skills: ['TypeScript', 'React / Next.js', 'PostgreSQL', 'GraphQL APIs'],
      matchRate: '92% Market Match',
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps Engineer',
      category: 'Systems',
      salary: '$140k – $205k',
      demand: 'High Demand',
      description: 'Provision automated infrastructure-as-code and orchestrate resilient global Kubernetes topologies.',
      skills: ['Kubernetes', 'Terraform', 'CI/CD Pipelines', 'AWS / GCP'],
      matchRate: '90% Market Match',
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Specialist',
      category: 'Systems',
      salary: '$135k – $195k',
      demand: 'Critical Need',
      description: 'Fortify enterprise boundary networks, perform penetration audits, and implement Zero-Trust policies.',
      skills: ['Zero-Trust Auth', 'Threat Modeling', 'SIEM Telemetry', 'Cryptography'],
      matchRate: '88% Market Match',
    },
    {
      id: 'systems-perf',
      title: 'Systems & Performance Engineer',
      category: 'Engineering',
      salary: '$150k – $220k',
      demand: 'Very High',
      description: 'Design low-latency distributed primitives, optimize memory caches, and audit CPU instruction throughput.',
      skills: ['Rust / C++', 'Linux Kernel', 'Async I/O', 'Memory Profiling'],
      matchRate: '95% Market Match',
    },
  ];

  const filteredCareers = activeCareerCategory === 'All'
    ? careerPaths
    : careerPaths.filter((c) => c.category === activeCareerCategory);

  return (
    <div className="space-y-28 pb-24 overflow-hidden font-sans selection:bg-brand-500 selection:text-neutral-950">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle ambient electric green glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge Pill */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900 text-white mb-8 border border-neutral-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider text-brand-400 uppercase">
                NEXORA INTELLIGENCE
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="text-xs text-neutral-300 font-medium">Learn Smarter. Build Your Future.</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-neutral-950 max-w-4xl mx-auto leading-[1.08]"
          >
            Your Future Starts With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-brand-500">
              What You Learn Today.
            </span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
          >
            Nexora helps you discover your career path, identify skill gaps, and follow a personalized learning journey built around your actual abilities.
          </motion.p>

          {/* Call to Actions requested explicitly: Primary: "Build My Learning Path", Secondary: "Explore Careers" */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-electric font-semibold text-base px-8 h-12"
              >
                Build My Learning Path
              </Button>
            </Link>
            <Link to="/careers" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Compass className="w-4 h-4 text-brand-600" />}
                className="w-full sm:w-auto text-base px-6 h-12"
              >
                Explore Careers
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Sophisticated Sample Dashboard Preview (Explicitly labeled as Sample Learner Dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="rounded-3xl bg-neutral-950 p-2 sm:p-4 shadow-2xl border border-neutral-800 text-left relative overflow-hidden">
            {/* Sample Dashboard Watermark / Header Pill */}
            <div className="px-4 py-3 bg-neutral-900 rounded-2xl flex flex-wrap items-center justify-between border border-neutral-800 gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="ml-2 text-xs font-mono text-neutral-400">
                  Nexora Cockpit [Interactive Sample Preview]
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3 h-3 text-brand-400" />
                  Sample Learner Dashboard
                </span>
              </div>
            </div>

            {/* Dashboard Interior */}
            <div className="p-4 sm:p-6 bg-neutral-900/60 rounded-2xl border border-neutral-800/80 space-y-6 text-white">
              {/* User / Target Career Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-brand-500 text-neutral-950 font-display font-bold text-lg flex items-center justify-center">
                    DS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-white">
                        Sample Profile: Alex Chen
                      </h3>
                      <Badge variant="brand" className="text-[9px] font-mono uppercase py-0">
                        Pro Cohort
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Target Career: <strong className="text-white font-medium">Data Scientist</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                    Current Level: <strong className="text-brand-300">Level 3 (Advanced)</strong>
                  </span>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30 font-bold">
                    Readiness: 68%
                  </span>
                </div>
              </div>

              {/* Bento Grid: Readiness Ring + Recommended Next Course */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Skill Readiness Gauge (4 cols) */}
                <div className="lg:col-span-4 p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                    Verified Skill Readiness
                  </span>

                  <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#242c27" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#16e66b"
                        strokeWidth="8"
                        strokeDasharray="264"
                        strokeDashoffset="84" // 68%
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-display font-extrabold text-white leading-none">
                        68%
                      </span>
                      <span className="text-[11px] font-mono text-brand-400 mt-1 font-semibold">
                        +12% in Sprint 02
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-1">
                    Market Threshold: <strong className="text-neutral-200">82%</strong> for Tier-1 Placement
                  </p>
                </div>

                {/* 2. Recommended Next Course & Competencies (8 cols) */}
                <div className="lg:col-span-8 p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Recommended Next Course
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      High Priority Delta
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-white">
                        Attention Mechanisms & Transformer Engineering
                      </h4>
                      <span className="text-xs font-mono text-brand-400">18 Hours</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Master scaled dot-product calculus, multi-head tensors, and causal masking in pure PyTorch.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        Self-Attention
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        RoPE Embeddings
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        KV Caching
                      </span>
                    </div>
                  </div>

                  {/* Competency preview bars */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-neutral-300">Python & Algorithmic Foundations</span>
                        <span className="text-brand-400 font-bold">85% (Target Met)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-neutral-300">Transformer Fine-Tuning & Quantization</span>
                        <span className="text-amber-400 font-bold">30% (Critical Gap)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Personalized Roadmap Preview Strip */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Personalized Roadmap Sequence
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Phase 3 of 4 Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      <span className="text-neutral-200 font-medium">M1: Data Wrangling</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-400">Done</span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      <span className="text-neutral-200 font-medium">M2: Algorithmic Logic</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-400">Done</span>
                  </div>

                  <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shrink-0" />
                      <span className="text-white font-semibold">M3: Deep Neural Nets</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-300 font-bold">68% Active</span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>M4: Distributed Compute</span>
                    </div>
                    <span className="text-[10px] font-mono">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUSTED LEARNING OUTCOMES / PLATFORM VALUE                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="brand" className="font-mono uppercase mb-3">
            System Rigor
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
            Engineered for Verifiable Competency
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            Every learning module, assessment rubric, and roadmap recommendation is built on empirical computer science principles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border border-neutral-200/90 hoverEffect">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 font-bold">
              <Radar className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-neutral-950 mb-1">
              Empirical Diagnostics
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Stress-test algorithms, distributed systems, and matrix math without guesswork or generic quizzes.
            </p>
          </Card>

          <Card className="p-6 border border-neutral-200/90 hoverEffect">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-neutral-950 mb-1">
              Strict Prerequisite Trees
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Never hit a brick wall attempting advanced concepts without mastering the prerequisite mathematical foundations first.
            </p>
          </Card>

          <Card className="p-6 border border-neutral-200/90 hoverEffect">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-neutral-950 mb-1">
              Deterministic Code Sandbox
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              In-browser runtimes with unit test assertions, execution time benchmarking, and zero manual grading latency.
            </p>
          </Card>

          <Card className="p-6 border border-neutral-200/90 hoverEffect">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-neutral-950 mb-1">
              Decoupled Curriculum
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our curriculum engine enforces vetted course roadmaps, while the AI recommendation engine guides pacing and next actions.
            </p>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE PROBLEM WITH TRADITIONAL LEARNING                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="error" className="font-mono uppercase mb-3">
            The Learning Dilemma
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
            Why Self-Directed Tech Learning Breaks Down
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            Engineers waste hundreds of hours consuming disconnected content without building the foundational competencies top engineering teams evaluate.
          </p>
        </motion.div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-7 border border-neutral-200/90 hoverEffect">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Problem 01
            </span>
            <h3 className="text-lg font-display font-bold text-neutral-950 mb-2">
              Unclear Career Direction
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Students follow generic bootcamps without knowing the exact technical criteria hiring managers evaluate in pull requests and architecture reviews.
            </p>
          </Card>

          <Card className="p-7 border border-neutral-200/90 hoverEffect">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <Radar className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Problem 02
            </span>
            <h3 className="text-lg font-display font-bold text-neutral-950 mb-2">
              Invisible Skill Gaps
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Spending months building beginner toy apps while completely missing the 3 critical systems-design competencies that gate senior appointments.
            </p>
          </Card>

          <Card className="p-7 border border-neutral-200/90 hoverEffect">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <Terminal className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Problem 03
            </span>
            <h3 className="text-lg font-display font-bold text-neutral-950 mb-2">
              Passive Tutorial Hell
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Watching 40-hour video playlists with zero automated test feedback, failing to retain the muscle memory required to write production code from scratch.
            </p>
          </Card>
        </div>

        {/* Visual Transformation Graphic: Chaotic Loop vs Linear Vector */}
        <div className="w-full rounded-2xl bg-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/10 to-transparent pointer-events-none" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 mb-2 inline-block">
            The Transformation
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold mb-8 max-w-xl mx-auto">
            Nexora turns fragmented effort into a linear, verified trajectory.
          </h3>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
            <div className="flex-1 w-full flex flex-col items-center">
              <svg className="w-full h-16 text-neutral-500" fill="none" viewBox="0 0 200 60">
                <path d="M10 30 Q 40 5 60 40 T 110 20 T 150 50 T 190 30" opacity="0.5" stroke="currentColor" strokeDasharray="3 3" strokeWidth="2" />
              </svg>
              <span className="text-xs font-mono text-neutral-400 mt-2">Chaotic Learning Loop</span>
            </div>

            <div className="w-12 h-12 rounded-full bg-brand-500 text-neutral-950 flex items-center justify-center shrink-0 shadow-electric">
              <Zap className="w-6 h-6 fill-current" />
            </div>

            <div className="flex-1 w-full flex flex-col items-center">
              <div className="w-full h-16 flex items-center">
                <div className="w-full h-2 bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-400 rounded-full shadow-electric" />
              </div>
              <span className="text-xs font-mono text-brand-400 font-bold mt-2">Linear Verified Vector</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW NEXORA WORKS — 5 STEPS                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="how-it-works">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="brand" className="font-mono uppercase mb-3">
            Algorithmic Method
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
            How Nexora Works
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            A 5-step scientific methodology that converts your technical ambition into demonstrable competency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Target Role Selection',
              desc: 'Select from 50+ industry archetypes such as AI Engineer, Full Stack Architect, or Data Scientist.',
              icon: Target,
            },
            {
              step: '02',
              title: 'Diagnostic Assessment',
              desc: 'Take an adaptive technical test evaluating your algorithms, systems design, and mathematical baseline.',
              icon: Radar,
            },
            {
              step: '03',
              title: 'Automated Gap Mapping',
              desc: 'Our engine contrasts your skills against enterprise specs, highlighting critical missing vectors.',
              icon: Cpu,
            },
            {
              step: '04',
              title: 'Dynamic Roadmap',
              desc: 'Execute sequenced milestones with strict prerequisite enforcement and adaptive pacing.',
              icon: Compass,
            },
            {
              step: '05',
              title: 'Verified Code Execution',
              desc: 'Graduate with running, test-evaluated code repositories and demonstrable system builds.',
              icon: Award,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} className="p-6 border border-neutral-200/90 hoverEffect flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-sm font-bold text-neutral-400">{s.step}</span>
                  </div>
                  <h3 className="text-base font-display font-bold text-neutral-950 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{s.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PERSONALIZED SKILL-GAP ANALYSIS PREVIEW                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="brand" className="font-mono uppercase text-[10px]">
              Multi-Vector Audit
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
              Personalized Skill-Gap Analysis
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Know exactly where you stand against industry standards across coding mechanics, system architecture, and mathematical fundamentals.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Python Metaprogramming (85% Match)</strong>
                  <span className="text-neutral-600">Production ready. Generators, decorators, and high-performance I/O passed.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <Radar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-950 block">Transformer Fine-Tuning (-55% Gap)</strong>
                  <span className="text-amber-800">Requires focus. Missing multi-head causal attention and RoPE extrapolation.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/app/skill-analysis">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Full Competency Radar
                </Button>
              </Link>
            </div>
          </div>

          {/* Radar Chart SVG Widget */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-white border border-neutral-200/90 shadow-card">
              <div className="flex items-center justify-between w-full border-b border-neutral-100 pb-3 mb-2">
                <span className="text-xs font-mono uppercase text-neutral-500 font-semibold">
                  Competency Radar (Sample Profile)
                </span>
                <span className="text-xs font-mono text-brand-700 font-bold bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Target: Data Scientist
                </span>
              </div>

              <div className="relative w-72 h-72 my-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Grid Web */}
                  <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <polygon points="100,50 145,75 145,125 100,150 55,125 55,75" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="100" y1="100" x2="100" y2="20" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="170" y2="60" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="170" y2="140" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="100" y2="180" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="30" y2="140" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="30" y2="60" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Market Standard Area */}
                  <polygon
                    points="100,30 155,70 150,135 100,160 45,130 40,65"
                    fill="#f8fafc"
                    fillOpacity="0.8"
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />

                  {/* Learner Score Area */}
                  <polygon
                    points="100,40 140,75 160,130 100,140 60,120 50,80"
                    fill="#16e66b"
                    fillOpacity="0.3"
                    stroke="#16e66b"
                    strokeWidth="2.5"
                  />
                  <circle cx="100" cy="40" r="3.5" fill="#0ebd55" />
                  <circle cx="140" cy="75" r="3.5" fill="#0ebd55" />
                  <circle cx="160" cy="130" r="3.5" fill="#0ebd55" />
                  <circle cx="100" cy="140" r="3.5" fill="#0ebd55" />
                  <circle cx="60" cy="120" r="3.5" fill="#0ebd55" />
                  <circle cx="50" cy="80" r="3.5" fill="#0ebd55" />
                </svg>
              </div>

              <div className="flex items-center gap-6 text-xs text-neutral-500 pt-2 border-t border-neutral-100 w-full justify-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-brand-500/40 border border-brand-500" />
                  Learner Level (68%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-neutral-200 border border-dashed border-neutral-400" />
                  Market Target (82%)
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DYNAMIC LEARNING ROADMAP PREVIEW                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="brand" className="font-mono uppercase mb-3">
            Fluid Trajectory
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
            Dynamic Learning Roadmap
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            A fluid milestone sequence that automatically recalibrates after every diagnostic quiz, pull-request submission, and sandbox run.
          </p>
        </motion.div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            {
              phase: '01',
              title: 'Foundations: Python Architecture & Metaprogramming',
              desc: 'Master memory management, generators, decorators, and high-performance async I/O.',
              status: 'Completed',
              duration: '2 Weeks',
              badge: 'success',
            },
            {
              phase: '02',
              title: 'Data Modeling & Vector Indexing',
              desc: 'Schema normalization, vector distance metrics (Cosine, Euclidean), and embedding stores.',
              status: 'Completed',
              duration: '3 Weeks',
              badge: 'success',
            },
            {
              phase: '03',
              title: 'Neural Networks & Transformer Deep Dive',
              desc: 'Implement multi-head self-attention mechanisms, causal masking, and backward passes from scratch.',
              status: 'Active Sprint (68%)',
              duration: '4 Weeks',
              badge: 'brand',
            },
            {
              phase: '04',
              title: 'RAG Architecture & Distributed Inference',
              desc: 'Orchestrate hybrid search, rerankers, vLLM inference streaming, and autonomous tool calling.',
              status: 'Locked Milestone',
              duration: '3 Weeks',
              badge: 'neutral',
            },
          ].map((m) => (
            <Card
              key={m.phase}
              className={`p-6 border transition-all ${
                m.badge === 'brand'
                  ? 'border-brand-500 shadow-card bg-white ring-1 ring-brand-500/20'
                  : 'border-neutral-200/90 bg-neutral-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-950 text-white">
                      PHASE {m.phase}
                    </span>
                    <Badge variant={m.badge as any} className="text-[10px]">
                      {m.status}
                    </Badge>
                    <span className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {m.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold text-neutral-950">{m.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
                </div>

                <div className="shrink-0">
                  {m.badge === 'brand' ? (
                    <Link to="/app/code-challenge/challenge-attention-head">
                      <Button variant="primary" size="sm" className="text-xs font-semibold shadow-sm">
                        Launch Current Lab →
                      </Button>
                    </Link>
                  ) : m.badge === 'success' ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Passed
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Prerequisite Pending
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THREE ASSESSMENT MODES: QUIZ, CODING, REAL-WORLD PROJECTS              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="brand" className="font-mono uppercase mb-3">
            Multi-Modal Evaluation
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
            Three Rigorous Assessment Modes
          </h2>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            Multiple-choice tests verify concept knowledge. Writing runnable code validates real-world execution.
          </p>
        </motion.div>

        {/* Interactive Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-neutral-100 border border-neutral-200 flex gap-1">
            {[
              { id: 'quiz', label: '1. Diagnostic Quizzes', icon: HelpCircle },
              { id: 'coding', label: '2. Code Sandbox Labs', icon: Terminal },
              { id: 'capstone', label: '3. Real-World Projects', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAssessmentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeAssessmentTab === tab.id
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Showcase Card */}
        <Card className="p-6 sm:p-10 border border-neutral-200/90 bg-white max-w-4xl mx-auto shadow-card">
          {activeAssessmentTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                  Mode 01 // Conceptual Diagnostic
                </span>
                <Badge variant="brand" className="text-[10px] font-mono">
                  10 Questions • 15 Mins
                </Badge>
              </div>
              <h3 className="font-display font-bold text-xl text-neutral-950">
                Matrix Calculus & Softmax Temperature Scaling
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Evaluates theoretical mathematical mechanics before allowing code implementation. Tests why attention dot products grow large in high-dimensional vector spaces and why scaling by the square root of key dimension stabilizes gradients.
              </p>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                <p className="font-semibold text-neutral-900">Sample Diagnostic Question:</p>
                <p className="text-neutral-600 italic">
                  "When the key dimension d_k is 512, what is the exact scaling factor applied to raw logits prior to exponentiation?"
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2 rounded bg-white border border-neutral-200 font-mono text-neutral-700">A) 1 / 512</div>
                  <div className="p-2 rounded bg-brand-50 border border-brand-400 font-mono text-brand-900 font-bold">B) 1 / sqrt(512) ≈ 0.0442 [Correct]</div>
                </div>
              </div>
            </div>
          )}

          {activeAssessmentTab === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                  Mode 02 // Browser In-Memory Code Sandbox
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-800 border border-brand-500/30 font-bold">
                  Automated Unit Tests
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-neutral-950">
                Live IDE Sandbox: Implement Scaled Dot-Product Attention
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Deploy actual production code inside an in-browser sandbox. Code is evaluated against automated unit tests and time limits.
              </p>

              <div className="rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-200 overflow-x-auto border border-neutral-800">
                <div className="text-neutral-400 mb-2"># solution.py [Evaluated in 14ms]</div>
                <code className="text-brand-300">
                  def scaled_dot_product_attention(Q, K, V, mask=None):<br />
                  &nbsp;&nbsp;d_k = Q.shape[-1]<br />
                  &nbsp;&nbsp;scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)<br />
                  &nbsp;&nbsp;if mask is not None: scores = np.where(mask == 0, -1e9, scores)<br />
                  &nbsp;&nbsp;attention_weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)<br />
                  &nbsp;&nbsp;return np.matmul(attention_weights, V), attention_weights
                </code>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-brand-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  All 12 Invariance Assertions Passed
                </span>
                <Link to="/app/code-challenge/challenge-attention-head">
                  <Button variant="primary" size="sm" className="text-xs font-semibold shadow-sm">
                    Open Sandbox Environment →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeAssessmentTab === 'capstone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                  Mode 03 // Real-World Production Capstones
                </span>
                <Badge variant="brand" className="text-[10px] font-mono">
                  Portfolio Verified
                </Badge>
              </div>
              <h3 className="font-display font-bold text-xl text-neutral-950">
                Multi-Component Capstone: Deploy Fine-Tuned LLaMA-3 with vLLM
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Connect multiple components into a working microservice: model quantization, KV cache optimization, FastAPI streaming, and Prometheus telemetry.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
                  <span className="font-mono text-neutral-400 block text-[10px] uppercase">Deliverable 1</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Docker Container</span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
                  <span className="font-mono text-neutral-400 block text-[10px] uppercase">Deliverable 2</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Streaming REST API</span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
                  <span className="font-mono text-neutral-400 block text-[10px] uppercase">Deliverable 3</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">Benchmarking Test Report</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 8. AI MENTOR AND PERSONALIZED RECOMMENDATIONS                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="brand" className="font-mono uppercase text-[10px]">
              Continuous Companion
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
              Context-Aware AI Career Mentor
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              An intelligent mentor attached directly to your sandbox context. Ask mathematical proofs, architectural trade-offs, or challenge debugging questions at any hour.
            </p>

            <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200 text-xs text-brand-950 leading-relaxed">
              <strong className="block mb-1">Architectural Integrity Guarantee:</strong>
              The AI mentor never hallucinates new curricula or skips prerequisites. The curriculum engine strictly governs verified course structures, while the recommendation engine determines your next optimal sprint.
            </div>

            <div className="pt-2">
              <Link to="/app/ai-mentor">
                <Button variant="primary" size="sm" className="font-semibold shadow-sm">
                  Chat With AI Mentor →
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Chat Sample Preview */}
          <div className="lg:col-span-7">
            <Card className="p-6 bg-neutral-950 text-white border border-neutral-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-500 text-neutral-950 flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Nexora AI Mentor</div>
                    <div className="text-[10px] text-brand-400 font-mono">Context: Scaled Dot-Product Lab</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  Streaming Active
                </span>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 max-w-md ml-auto">
                  <p className="font-medium text-white mb-0.5">Learner:</p>
                  "Why do we divide by sqrt(d_k) before taking the softmax in attention?"
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-200 max-w-lg space-y-2">
                  <p className="font-medium text-brand-400">AI Mentor:</p>
                  <p>
                    For large values of <code>d_k</code>, the dot products grow large in magnitude, which pushes the softmax function into regions with extremely small gradients (vanishing gradient problem).
                  </p>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-brand-300">
                    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Dividing by <code>sqrt(d_k)</code> maintains unit variance across logit scores.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. EXPLORE CAREER PATHS                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="careers">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <Badge variant="brand" className="font-mono uppercase mb-3">
              Market Pathways
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-950 tracking-tight">
              High-Growth Tech Career Paths
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
              Calibrated against enterprise hiring requirements, compensation metrics, and required competency vectors.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {['All', 'AI & Data', 'Engineering', 'Systems'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCareerCategory(cat as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCareerCategory === cat
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 6-Card Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((c) => (
            <Card key={c.id} className="p-6 border border-neutral-200/90 hoverEffect flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-neutral-950 bg-neutral-100 px-2.5 py-1 rounded-md">
                    {c.salary}
                  </span>
                  <Badge variant="brand" className="text-[10px] uppercase font-mono">
                    {c.demand}
                  </Badge>
                </div>

                <h3 className="font-display font-bold text-xl text-neutral-950 mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                  {c.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {c.skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Link to="/careers" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Full Pathway
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-950 text-white p-8 sm:p-14 lg:p-16 border border-neutral-800 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle electric green ambient halo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 rounded-full blur-[130px] pointer-events-none" />

          <Badge variant="brand" className="font-mono uppercase text-[10px] mb-6">
            Autonomous Acceleration
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight max-w-2xl mx-auto mb-6">
            Your Future Doesn't Build Itself.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Start building the skills that move your career forward. Begin your technical diagnostic and get your personalized learning path today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-bold text-base px-8 h-12 shadow-electric"
              >
                Build My Learning Path
              </Button>
            </Link>
            <Link to="/careers" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-6 h-12 bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800"
              >
                Explore All 6 Pathways
              </Button>
            </Link>
          </div>

          {/* Value guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              Free diagnostic assessment
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-700 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              No credit card required
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-700 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              Instant skill gap report
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
