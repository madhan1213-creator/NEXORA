import { CareerPath, Course, SkillNode, RoadmapMilestone, ProgressSummary, CodingChallenge } from '@/types';

export const mockCareers: CareerPath[] = [
  {
    id: 'ai-specialist',
    slug: 'ai-specialist',
    title: 'AI & Data Specialist',
    category: 'AI & Data',
    shortDescription: 'Master LLMs, neural architectures, vector embeddings, and autonomous agent pipelines.',
    longDescription: 'Design, fine-tune, and deploy production-grade machine learning models, retrieval-augmented generation (RAG) engines, and transformer architectures.',
    averageSalary: '$145,000 / yr',
    marketDemand: 'Explosive',
    growthRate: '+38% YoY',
    iconName: 'BrainCircuit',
    requiredSkills: [
      { skillId: 'python-advanced', name: 'Python & Metaprogramming', targetProficiency: 90, category: 'core' },
      { skillId: 'llm-rag', name: 'LLM Fine-Tuning & RAG Pipelines', targetProficiency: 85, category: 'core' },
      { skillId: 'pytorch', name: 'PyTorch & Transformer Architectures', targetProficiency: 80, category: 'advanced' },
      { skillId: 'vector-dbs', name: 'Vector Databases & Embeddings', targetProficiency: 85, category: 'tooling' },
      { skillId: 'mlops', name: 'vLLM, TensorRT & MLOps Serving', targetProficiency: 75, category: 'advanced' },
    ],
  },
  {
    id: 'fullstack-engineer',
    slug: 'fullstack-engineer',
    title: 'Modern Full-Stack Architect',
    category: 'Software Engineering',
    shortDescription: 'Build ultra-responsive web applications with TypeScript, React, Next.js, Node.js, and SQL.',
    longDescription: 'End-to-end web architecture from fluid client interfaces to scalable backend microservices, caching layers, and database optimization.',
    averageSalary: '$135,000 / yr',
    marketDemand: 'High',
    growthRate: '+22% YoY',
    iconName: 'Code2',
    requiredSkills: [
      { skillId: 'react-ts', name: 'React, TypeScript & State Machines', targetProficiency: 90, category: 'core' },
      { skillId: 'backend-api', name: 'Node.js & High-Throughput REST/GraphQL', targetProficiency: 85, category: 'core' },
      { skillId: 'sql-db', name: 'PostgreSQL & Distributed Transactions', targetProficiency: 80, category: 'core' },
      { skillId: 'sys-design', name: 'Distributed Systems & Microservices', targetProficiency: 75, category: 'advanced' },
    ],
  },
  {
    id: 'cloud-devops',
    slug: 'cloud-devops',
    title: 'Cloud & Infrastructure Engineer',
    category: 'Cloud & Systems',
    shortDescription: 'Orchestrate resilient Kubernetes clusters, Terraform IaC, and zero-downtime CI/CD.',
    longDescription: 'Design resilient multi-cloud architectures, automate infrastructure provisioning, and guarantee 99.99% availability for enterprise systems.',
    averageSalary: '$140,000 / yr',
    marketDemand: 'Very High',
    growthRate: '+28% YoY',
    iconName: 'CloudCog',
    requiredSkills: [
      { skillId: 'k8s', name: 'Kubernetes & Container Orchestration', targetProficiency: 85, category: 'core' },
      { skillId: 'iac', name: 'Terraform & CloudFormation', targetProficiency: 85, category: 'core' },
      { skillId: 'ci-cd', name: 'Automated CI/CD & Security Gates', targetProficiency: 80, category: 'core' },
      { skillId: 'observability', name: 'Prometheus, OpenTelemetry & Logging', targetProficiency: 75, category: 'tooling' },
    ],
  },
];

export const mockSkills: SkillNode[] = [
  { id: 'python', name: 'Python & Data Structures', category: 'algorithmic', currentLevel: 85, targetLevel: 90, marketAverage: 65, status: 'mastered' },
  { id: 'sql', name: 'SQL & Data Modeling', category: 'data', currentLevel: 62, targetLevel: 80, marketAverage: 60, status: 'proficient' },
  { id: 'stats', name: 'Statistical Inference & Probability', category: 'ai_ml', currentLevel: 45, targetLevel: 75, marketAverage: 50, status: 'developing' },
  { id: 'transformers', name: 'Transformers & LLM Tuning', category: 'ai_ml', currentLevel: 30, targetLevel: 85, marketAverage: 40, status: 'developing' },
  { id: 'distributed', name: 'Distributed Systems Design', category: 'architecture', currentLevel: 55, targetLevel: 80, marketAverage: 45, status: 'developing' },
  { id: 'security', name: 'AppSec & Zero-Trust Auth', category: 'systems', currentLevel: 40, targetLevel: 70, marketAverage: 50, status: 'developing' },
];

export const mockMilestones: RoadmapMilestone[] = [
  {
    id: 'm1',
    number: 1,
    title: 'Foundations: Python Architecture & Metaprogramming',
    description: 'Master advanced memory management, generators, decorators, and high-performance I/O.',
    estimatedWeeks: 2,
    status: 'completed',
    completionPercentage: 100,
    skillsCovered: ['Python Advanced', 'AsyncIO', 'Memory Profiling'],
    associatedCourseIds: ['course-python-adv'],
  },
  {
    id: 'm2',
    number: 2,
    title: 'Data Modeling & Vector Foundations',
    description: 'Schema normalization, vector distance metrics (Cosine, Euclidean), and embedding indexation.',
    estimatedWeeks: 3,
    status: 'completed',
    completionPercentage: 100,
    skillsCovered: ['PostgreSQL', 'pgvector', 'High-Dimensional Embeddings'],
    associatedCourseIds: ['course-vector-db'],
  },
  {
    id: 'm3',
    number: 3,
    title: 'Neural Networks & Transformer Deep Dive',
    description: 'Implement multi-head self-attention mechanisms, causal masking, and backward passes from scratch.',
    estimatedWeeks: 4,
    status: 'in_progress',
    completionPercentage: 68,
    skillsCovered: ['PyTorch', 'Self-Attention', 'Transformer Blocks'],
    associatedCourseIds: ['course-transformers-101'],
    capstoneChallengeId: 'challenge-attention-head',
  },
  {
    id: 'm4',
    number: 4,
    title: 'RAG Architecture & Distributed Inference',
    description: 'Orchestrate hybrid search, rerankers, vLLM inference streaming, and autonomous tool calling.',
    estimatedWeeks: 3,
    status: 'locked',
    completionPercentage: 0,
    skillsCovered: ['RAG Evaluation', 'vLLM', 'Agent Orchestration'],
    associatedCourseIds: ['course-rag-production'],
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-transformers-101',
    title: 'Attention Mechanisms & Transformer Engineering',
    slug: 'transformers-engineering',
    description: 'Master modern decoder architectures, positional encodings, flash-attention, and KV-cache optimizations.',
    estimatedHours: 18,
    difficulty: 'advanced',
    levelsCount: 4,
    topics: ['Self-Attention', 'Rotary Position Embeddings', 'FlashAttention-2', 'KV Caching'],
    prerequisites: ['course-python-adv'],
    levels: [
      {
        id: 'lvl-1',
        courseId: 'course-transformers-101',
        levelNumber: 1,
        title: 'Level 1: Matrix Calculus & Scaled Dot-Product Attention',
        summary: 'Derive Q, K, V projections and understand softmax temperature scaling.',
        modules: [
          { id: 'mod-1', title: 'Why Dot Product Scales With Dimension', type: 'concept', estimatedMinutes: 20, isCompleted: false },
          { id: 'mod-2', title: 'Writing Scaled Dot Product in Pure PyTorch', type: 'code_challenge', estimatedMinutes: 35, isCompleted: false },
          { id: 'mod-3', title: 'Attention Temperature Quiz', type: 'quiz', estimatedMinutes: 15, isCompleted: false },
        ],
      },
      {
        id: 'lvl-2',
        courseId: 'course-transformers-101',
        levelNumber: 2,
        title: 'Level 2: Multi-Head Splitting & Causal Masking',
        summary: 'Parallelize attention across multiple heads and enforce autoregressive causality.',
        modules: [
          { id: 'mod-4', title: 'Head Tensor Reshaping Dynamics', type: 'concept', estimatedMinutes: 25, isCompleted: false },
          { id: 'mod-5', title: 'Implement Causal Lower-Triangular Masking', type: 'code_challenge', estimatedMinutes: 45, isCompleted: false },
          { id: 'mod-6', title: 'Attention Weights Inspection Lab', type: 'interactive_lab', estimatedMinutes: 30, isCompleted: false },
        ],
      },
      {
        id: 'lvl-3',
        courseId: 'course-transformers-101',
        levelNumber: 3,
        title: 'Level 3: Positional Encodings: Sinusoidal vs RoPE',
        summary: 'Rotary Position Embeddings (RoPE) and length extrapolation.',
        modules: [
          { id: 'mod-7', title: 'RoPE Complex Multiplication Intuition', type: 'concept', estimatedMinutes: 30, isCompleted: false },
          { id: 'mod-8', title: 'Coding RoPE in 20 Lines of Python', type: 'code_challenge', estimatedMinutes: 40, isCompleted: false },
        ],
      },
    ],
  },
  {
    id: 'course-vector-db',
    title: 'Vector Databases, HNSW & Semantic Search',
    slug: 'vector-databases-hnsw',
    description: 'Learn vector index structures, Hierarchical Navigable Small World graphs, and filtering at scale.',
    estimatedHours: 12,
    difficulty: 'intermediate',
    levelsCount: 3,
    topics: ['Embeddings', 'HNSW', 'Cosine Similarity', 'Hybrid Search'],
    prerequisites: [],
    levels: [],
  },
];

export const mockCodingChallenge: CodingChallenge = {
  id: 'challenge-attention-head',
  title: 'Implement Scaled Dot-Product Attention',
  difficulty: 'Medium',
  category: 'Deep Learning Mechanics',
  description: `Given three matrices: queries ($Q$), keys ($K$), and values ($V$), compute the scaled dot-product attention:
  
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$

Implement the function \`scaled_dot_product_attention(Q, K, V, mask=None)\`.
When a boolean mask is provided, masked positions (where \`mask == 0\`) must be assigned $-\\infty$ (-1e9) prior to softmax.`,
  starterCode: {
    python: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: shape (..., seq_len_q, d_k)
    K: shape (..., seq_len_k, d_k)
    V: shape (..., seq_len_v, d_v) where seq_len_k == seq_len_v
    mask: boolean array broadcastable to (..., seq_len_q, seq_len_k)
    
    Returns:
        output: weighted values
        attention_weights: softmax probabilities
    """
    d_k = Q.shape[-1]
    
    # 1. Compute raw attention scores
    scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)
    
    # 2. Apply mask if present
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
        
    # 3. Softmax over last dimension
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    # 4. Multiply with values
    output = np.matmul(attention_weights, V)
    return output, attention_weights
`,
  },
  testCases: [
    {
      id: 'tc-1',
      input: 'Q=[[1, 0]], K=[[1, 0], [0, 1]], V=[[10, 20], [30, 40]]',
      expectedOutput: 'Output shape: (1, 2), First weight > 0.70',
      isHidden: false,
    },
    {
      id: 'tc-2',
      input: 'Batch shape (2, 4, 16), with causal mask',
      expectedOutput: 'All upper triangle attention weights strictly 0.0',
      isHidden: false,
    },
  ],
  hints: [
    'Remember to divide by the square root of key dimension d_k before taking the exponent.',
    'Use np.swapaxes(K, -1, -2) to transpose the last two dimensions safely for arbitrary batch sizes.',
  ],
  timeLimitMs: 2000,
};

export const mockProgress: ProgressSummary = {
  hoursLoggedThisWeek: 18.6,
  totalXP: 4850,
  streakDays: 14,
  completedMilestones: 2,
  totalMilestones: 4,
  weeklyVelocity: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 3.8 },
    { day: 'Sun', hours: 2.0 },
  ],
};
