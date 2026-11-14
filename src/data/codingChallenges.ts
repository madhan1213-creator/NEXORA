import { CodingChallenge, TestCase } from '@/types';

export interface VerificationCriterion {
  id: string;
  label: string;
  check: (code: string) => { passed: boolean; message: string };
}

export interface ExtendedCodingChallenge extends CodingChallenge {
  track: string;
  trackRole: string;
  levelBadge: string;
  estimatedMinutes: number;
  inputSpec: { name: string; type: string; desc: string }[];
  outputSpec: { type: string; desc: string };
  mathFormula?: string;
  verificationCriteria: VerificationCriterion[];
}

export const codingChallenges: ExtendedCodingChallenge[] = [
  // =========================================================================
  // 1. BEGINNER DATA SCIENCE: MISSING VALUE IMPUTATION
  // =========================================================================
  {
    id: 'challenge-python-basics',
    title: 'Data Cleaning: Missing Value Imputation',
    difficulty: 'Easy',
    levelBadge: 'Beginner',
    track: 'Data Science & Analytics',
    trackRole: 'Data Scientist',
    category: 'Python Fundamentals & Data Hygiene',
    estimatedMinutes: 15,
    description:
      'In real-world data science, raw datasets regularly contain corrupted, missing, or null entries (represented as None or float(\'nan\')). Your task is to write a robust Python function impute_missing_values(data, strategy=\'mean\') that inspects an input sequence of numbers and replaces missing entries according to the chosen strategy without mutating the original list.\n\nSupported strategies:\n• \'mean\': Replace missing elements with the arithmetic mean of all valid numeric values, rounded to 2 decimal places.\n• \'zero\': Replace missing elements with 0.0.\n\nIf the input list contains only missing values, all entries must be filled with 0.0.',
    mathFormula: 'mean = sum(valid_x) / len(valid_x)',
    inputSpec: [
      {
        name: 'data',
        type: 'List[Optional[float]]',
        desc: 'Sequence of numeric values with potential None or NaN values.',
      },
      {
        name: 'strategy',
        type: 'str',
        desc: '\'mean\' (default) to replace with average, or \'zero\' to replace with 0.0.',
      },
    ],
    outputSpec: {
      type: 'List[float]',
      desc: 'New list of floats with all missing values replaced according to the specified strategy.',
    },
    starterCode: {
      python: `def impute_missing_values(data, strategy='mean'):
    """
    Impute missing entries (None or float('nan')) in a sequence of numbers.

    Parameters:
        data (list): List of numbers with potential None or float('nan') values.
        strategy (str): Either 'mean' (default) or 'zero'.

    Returns:
        list: A new list with all missing values replaced according to the strategy.
    """
    # Step 1: Filter out valid numeric elements (exclude None and NaN)
    # Hint: float('nan') != float('nan') is True in standard Python
    valid_nums = [x for x in data if x is not None and not (isinstance(x, float) and x != x)]
    
    # Step 2: Determine replacement value
    if not valid_nums or strategy == 'zero':
        fill_val = 0.0
    elif strategy == 'mean':
        fill_val = round(sum(valid_nums) / len(valid_nums), 2)
    else:
        fill_val = 0.0

    # Step 3: Construct and return the cleaned list
    cleaned = []
    for item in data:
        if item is None or (isinstance(item, float) and item != item):
            cleaned.append(fill_val)
        else:
            cleaned.append(float(item))
            
    return cleaned
`,
    },
    testCases: [
      {
        id: 'tc-py-1',
        input: "data = [10.0, None, 20.0, 30.0], strategy = 'mean'",
        expectedOutput: '[10.0, 20.0, 20.0, 30.0] (Mean of 10, 20, 30 is 20.0)',
        isHidden: false,
        explanation: 'The valid values [10.0, 20.0, 30.0] sum to 60.0 with count 3, producing an imputation mean of 20.0.',
      },
      {
        id: 'tc-py-2',
        input: "data = [5.0, None, 15.0], strategy = 'zero'",
        expectedOutput: '[5.0, 0.0, 15.0] (Zero strategy fills missing with 0.0)',
        isHidden: false,
        explanation: 'When strategy is \'zero\', all null/None entries are replaced with 0.0 directly.',
      },
      {
        id: 'tc-py-3',
        input: "data = [None, None, 4.0], strategy = 'mean'",
        expectedOutput: '[4.0, 4.0, 4.0] (Single valid value serves as the mean)',
        isHidden: false,
        explanation: 'When only one valid element exists, its value is the mean for all missing entries.',
      },
      {
        id: 'tc-py-4',
        input: "data = [None, None], strategy = 'mean'",
        expectedOutput: '[0.0, 0.0] (Empty valid pool fallback to 0.0)',
        isHidden: false,
        explanation: 'When no valid numbers exist, fallback safely to 0.0 to avoid zero-division errors.',
      },
    ],
    hints: [
      'In Python, float(\'nan\') != float(\'nan\') evaluates to True, which is a convenient way to detect NaNs.',
      'Compute the mean before iterating over the list to construct the cleaned output array.',
      'Remember to check strategy == \'zero\' or when no valid entries exist to avoid ZeroDivisionError.',
    ],
    timeLimitMs: 2000,
    verificationCriteria: [
      {
        id: 'vc-func',
        label: "Function Signature: 'def impute_missing_values(data, strategy='mean')'",
        check: (code: string) => {
          const hasDef = /def\s+impute_missing_values\s*\(/.test(code);
          return {
            passed: hasDef,
            message: hasDef
              ? 'Found valid function definition impute_missing_values.'
              : "Missing function declaration: 'def impute_missing_values(data, strategy=...)'",
          };
        },
      },
      {
        id: 'vc-null-check',
        label: 'Missing Value Detection (None / NaN checks)',
        check: (code: string) => {
          const hasNone = code.includes('None');
          const hasNan = code.includes('isnan') || code.includes('!=') || code.includes('nan');
          const passed = hasNone && hasNan;
          return {
            passed,
            message: passed
              ? 'Properly inspects for None and NaN floating-point values.'
              : 'Ensure you check for both None and NaN/unassigned numeric values.',
          };
        },
      },
      {
        id: 'vc-mean',
        label: "Mean Strategy Calculation: 'sum(...) / len(...)' or 'mean()'",
        check: (code: string) => {
          const hasMeanCalc = (code.includes('sum(') && code.includes('len(')) || code.includes('mean');
          return {
            passed: hasMeanCalc,
            message: hasMeanCalc
              ? 'Arithmetic mean calculation logic detected.'
              : 'Missing arithmetic mean calculation (e.g. sum(valid) / len(valid)).',
          };
        },
      },
      {
        id: 'vc-zero',
        label: "Strategy Support: Handling 'zero' fallback",
        check: (code: string) => {
          const hasZeroCheck = code.includes("'zero'") || code.includes('"zero"') || code.includes('0.0');
          return {
            passed: hasZeroCheck,
            message: hasZeroCheck
              ? "Strategy check for 'zero' branch confirmed."
              : "Missing logic to support strategy == 'zero'.",
          };
        },
      },
      {
        id: 'vc-return',
        label: 'Return Cleaned Array Statement',
        check: (code: string) => {
          const hasReturn = /return\s+\w+/.test(code);
          return {
            passed: hasReturn,
            message: hasReturn
              ? 'Returns the imputed list result.'
              : 'Missing return statement returning the cleaned list.',
          };
        },
      },
    ],
  },

  // =========================================================================
  // 2. BEGINNER / INTERMEDIATE NUMPY: MIN-MAX FEATURE SCALING
  // =========================================================================
  {
    id: 'challenge-numpy-vectorization',
    title: 'NumPy Vectorization: Min-Max Feature Normalization',
    difficulty: 'Easy',
    levelBadge: 'Beginner',
    track: 'Data Science & Machine Learning',
    trackRole: 'Data Scientist',
    category: 'NumPy & Vectorized Math',
    estimatedMinutes: 20,
    description:
      'Machine learning algorithms sensitive to distance metrics (such as K-Nearest Neighbors, SVMs, and Gradient Descent optimizers) require features to be normalized to a consistent [0.0, 1.0] boundary.\n\nImplement min_max_scale(matrix, axis=0, eps=1e-8) using vectorized NumPy operations. Avoid slow iterative for loops so the function can process thousands of samples instantaneously.\n\nFormula:\nX_scaled = (X - min(X)) / (max(X) - min(X) + eps)',
    mathFormula: 'X_scaled = (X - np.min(X, axis=axis)) / (np.max(X, axis=axis) - np.min(X, axis=axis) + eps)',
    inputSpec: [
      {
        name: 'matrix',
        type: 'np.ndarray or List[List[float]]',
        desc: '2D array of shape (n_samples, n_features).',
      },
      {
        name: 'axis',
        type: 'int',
        desc: 'Axis along which to compute min and max (0 for column/feature-wise).',
      },
      {
        name: 'eps',
        type: 'float',
        desc: 'Small epsilon (1e-8) to prevent zero division when feature variance is zero.',
      },
    ],
    outputSpec: {
      type: 'np.ndarray',
      desc: 'Normalized NumPy array where values lie in [0.0, 1.0].',
    },
    starterCode: {
      python: `import numpy as np

def min_max_scale(matrix, axis=0, eps=1e-8):
    """
    Applies Min-Max feature normalization to a 2D array along the specified axis.

    Parameters:
        matrix: 2D array-like of shape (n_samples, n_features)
        axis: Axis for min/max computation (0 for column-wise)
        eps: Small float to prevent division by zero

    Returns:
        np.ndarray: Scaled array with elements bounded in [0.0, 1.0]
    """
    # 1. Convert input safely to float NumPy array
    X = np.asarray(matrix, dtype=float)
    
    # 2. Compute minimum and maximum along specified axis with keepdims=True
    x_min = np.min(X, axis=axis, keepdims=True)
    x_max = np.max(X, axis=axis, keepdims=True)
    
    # 3. Vectorized scaling formula
    scaled = (X - x_min) / (x_max - x_min + eps)
    
    return np.round(scaled, 4)
`,
    },
    testCases: [
      {
        id: 'tc-np-1',
        input: 'matrix = [[10, 200], [20, 400], [30, 200]], axis = 0',
        expectedOutput: '[[0.0, 0.0], [0.5, 1.0], [1.0, 0.0]]',
        isHidden: false,
        explanation: 'Column 0 ranges 10 to 30 -> scaled to [0.0, 0.5, 1.0]. Column 1 ranges 200 to 400 -> scaled to [0.0, 1.0, 0.0].',
      },
      {
        id: 'tc-np-2',
        input: 'matrix = [[5, 5], [5, 5]], axis = 0',
        expectedOutput: '[[0.0, 0.0], [0.0, 0.0]] (Zero-variance safe)',
        isHidden: false,
        explanation: 'Epsilon prevents zero division when max == min on identical column entries.',
      },
      {
        id: 'tc-np-3',
        input: 'matrix = [[0, 100], [50, 50], [100, 0]], axis = 0',
        expectedOutput: '[[0.0, 1.0], [0.5, 0.5], [1.0, 0.0]]',
        isHidden: false,
        explanation: 'Correctly preserves inverse feature directions across multiple columns.',
      },
    ],
    hints: [
      'Use np.min(X, axis=axis, keepdims=True) so the resulting shape is broadcastable with X.',
      'Add eps to the denominator: (x_max - x_min + eps) to safeguard against zero-variance constant features.',
      'Avoid Python for-loops to leverage NumPy SIMD parallel performance.',
    ],
    timeLimitMs: 2000,
    verificationCriteria: [
      {
        id: 'vc-np-import',
        label: 'NumPy Import: import numpy as np',
        check: (code: string) => {
          const hasNumpy = code.includes('numpy') || code.includes('np.');
          return {
            passed: hasNumpy,
            message: hasNumpy
              ? 'NumPy library imported and referenced.'
              : 'Missing NumPy import (e.g. import numpy as np).',
          };
        },
      },
      {
        id: 'vc-np-minmax',
        label: 'Vectorized Min & Max Reduction: np.min and np.max',
        check: (code: string) => {
          const hasMin = code.includes('.min') || code.includes('np.min');
          const hasMax = code.includes('.max') || code.includes('np.max');
          const passed = hasMin && hasMax;
          return {
            passed,
            message: passed
              ? 'Found np.min and np.max reduction operations.'
              : 'Missing np.min(...) and np.max(...) vector operations.',
          };
        },
      },
      {
        id: 'vc-np-keepdims',
        label: 'Broadcasting Dimension Preservation: keepdims=True or reshape',
        check: (code: string) => {
          const hasKeepdims = code.includes('keepdims') || code.includes('reshape') || code.includes('[:, None]');
          return {
            passed: hasKeepdims,
            message: hasKeepdims
              ? 'Dimensions preserved for 2D broadcasting.'
              : 'Ensure keepdims=True is passed to preserve dimensionality during broadcasting.',
          };
        },
      },
      {
        id: 'vc-np-formula',
        label: 'Vectorized Scaling Quotient: (X - min) / (max - min)',
        check: (code: string) => {
          const hasQuotient = code.includes('/') || code.includes('divide');
          return {
            passed: hasQuotient,
            message: hasQuotient
              ? 'Scaling normalization division confirmed.'
              : 'Missing division by range: (X - min) / (max - min + eps).',
          };
        },
      },
      {
        id: 'vc-np-return',
        label: 'Return Scaled Array',
        check: (code: string) => {
          const hasReturn = /return\s+/.test(code);
          return {
            passed: hasReturn,
            message: hasReturn ? 'Returns normalized array.' : 'Missing return statement.',
          };
        },
      },
    ],
  },

  // =========================================================================
  // 3. INTERMEDIATE DATA SCIENCE: TUKEY IQR OUTLIER DETECTION
  // =========================================================================
  {
    id: 'challenge-pandas-stats',
    title: 'Descriptive Statistics: Tukey IQR Outlier Bounds',
    difficulty: 'Medium',
    levelBadge: 'Intermediate',
    track: 'Data Science & Statistics',
    trackRole: 'Data Scientist',
    category: 'Exploratory Data Analysis & Statistics',
    estimatedMinutes: 25,
    description:
      'Statistical data quality requires identifying anomalous outliers that skew predictive distributions and regression coefficients. Implement calculate_iqr_bounds(values, factor=1.5) using standard Tukey fencing.\n\nFormulas:\n• IQR = Q_3 - Q_1\n• Lower Bound = Q_1 - (factor * IQR)\n• Upper Bound = Q_3 + (factor * IQR)\n\nReturn a structured dictionary containing quartile metrics and a list of detected outlier values.',
    mathFormula: 'IQR = Q3 - Q1; Lower = Q1 - 1.5*IQR; Upper = Q3 + 1.5*IQR',
    inputSpec: [
      {
        name: 'values',
        type: 'List[float] or 1D np.ndarray',
        desc: 'Sequence of numerical observations.',
      },
      {
        name: 'factor',
        type: 'float',
        desc: 'Multiplier for IQR threshold (standard default is 1.5 for Tukey fences).',
      },
    ],
    outputSpec: {
      type: 'dict',
      desc: "{'q1': float, 'q3': float, 'iqr': float, 'lower_bound': float, 'upper_bound': float, 'outliers': list}",
    },
    starterCode: {
      python: `import numpy as np

def calculate_iqr_bounds(values, factor=1.5):
    """
    Computes quartiles, Interquartile Range (IQR), and Tukey outlier bounds.

    Parameters:
        values (list or np.ndarray): 1D array of numerical observations.
        factor (float): Multiplier for IQR threshold (default 1.5).

    Returns:
        dict: {
            'q1': float,
            'q3': float,
            'iqr': float,
            'lower_bound': float,
            'upper_bound': float,
            'outliers': list of float
        }
    """
    arr = np.asarray(values, dtype=float)
    if len(arr) == 0:
        return {'q1': 0.0, 'q3': 0.0, 'iqr': 0.0, 'lower_bound': 0.0, 'upper_bound': 0.0, 'outliers': []}
        
    # 1. Compute 25th (Q1) and 75th (Q3) percentiles
    q1 = float(np.percentile(arr, 25))
    q3 = float(np.percentile(arr, 75))
    iqr = round(q3 - q1, 2)
    
    # 2. Compute Tukey fences
    lower_bound = round(q1 - (factor * iqr), 2)
    upper_bound = round(q3 + (factor * iqr), 2)
    
    # 3. Identify elements falling outside the fence
    outliers = [float(x) for x in arr if x < lower_bound or x > upper_bound]
    
    return {
        'q1': round(q1, 2),
        'q3': round(q3, 2),
        'iqr': iqr,
        'lower_bound': lower_bound,
        'upper_bound': upper_bound,
        'outliers': outliers
    }
`,
    },
    testCases: [
      {
        id: 'tc-stat-1',
        input: 'values = [10, 12, 14, 15, 16, 18, 95], factor = 1.5',
        expectedOutput: "iqr: 4.0, lower_bound: 7.0, upper_bound: 23.0, outliers: [95.0]",
        isHidden: false,
        explanation: 'Value 95.0 lies well beyond the upper Tukey fence of 23.0.',
      },
      {
        id: 'tc-stat-2',
        input: 'values = [2, 4, 6, 8, 10], factor = 1.5',
        expectedOutput: "outliers: [] (All values within normal distribution fences)",
        isHidden: false,
        explanation: 'Uniformly spaced observations contain zero anomalous outliers.',
      },
      {
        id: 'tc-stat-3',
        input: 'values = [-50, 10, 12, 14, 16, 200], factor = 1.5',
        expectedOutput: "outliers: [-50.0, 200.0] (Both lower and upper outliers detected)",
        isHidden: false,
        explanation: 'Flags both extremely negative and extremely high outliers simultaneously.',
      },
    ],
    hints: [
      'Use np.percentile(arr, 25) and np.percentile(arr, 75) to retrieve Q1 and Q3 accurately.',
      'IQR is strictly Q3 - Q1.',
      'Lower bound is Q1 - (factor * IQR); Upper bound is Q3 + (factor * IQR).',
    ],
    timeLimitMs: 2000,
    verificationCriteria: [
      {
        id: 'vc-stat-percentile',
        label: 'Percentile / Quartile Calculation: np.percentile or quantile',
        check: (code: string) => {
          const hasPercentile = code.includes('percentile') || code.includes('quantile');
          return {
            passed: hasPercentile,
            message: hasPercentile
              ? 'Quartile percentile extraction verified.'
              : 'Missing np.percentile(arr, 25) or quantile calculations.',
          };
        },
      },
      {
        id: 'vc-stat-iqr',
        label: 'Interquartile Range Math: q3 - q1',
        check: (code: string) => {
          const hasIqr = code.includes('q3') && code.includes('q1') && code.includes('-');
          return {
            passed: hasIqr,
            message: hasIqr
              ? 'IQR computation (q3 - q1) confirmed.'
              : 'Missing IQR subtraction calculation (q3 - q1).',
          };
        },
      },
      {
        id: 'vc-stat-bounds',
        label: 'Tukey Fences: lower_bound and upper_bound computation',
        check: (code: string) => {
          const hasBounds = code.includes('lower_bound') && code.includes('upper_bound');
          return {
            passed: hasBounds,
            message: hasBounds
              ? 'Tukey fence bounds defined.'
              : 'Missing lower_bound and upper_bound calculations using factor.',
          };
        },
      },
      {
        id: 'vc-stat-dict',
        label: 'Return Dictionary with Required Keys',
        check: (code: string) => {
          const hasOutliers = code.includes("'outliers'") || code.includes('"outliers"');
          const hasIqrKey = code.includes("'iqr'") || code.includes('"iqr"');
          const passed = hasOutliers && hasIqrKey;
          return {
            passed,
            message: passed
              ? 'Structured dictionary return structure verified.'
              : "Returned dictionary must include 'iqr' and 'outliers' keys.",
          };
        },
      },
    ],
  },

  // =========================================================================
  // 4. ADVANCED AI / MACHINE LEARNING: SCALED DOT-PRODUCT ATTENTION
  // =========================================================================
  {
    id: 'challenge-attention-head',
    title: 'Scaled Dot-Product Attention in Pure PyTorch',
    difficulty: 'Hard',
    levelBadge: 'Advanced',
    track: 'AI Engineer & Deep Learning',
    trackRole: 'AI Engineer',
    category: 'Deep Learning & Transformer Architecture',
    estimatedMinutes: 45,
    description:
      'Attention is the cornerstone mathematical operation behind modern Large Language Models and Vision Transformers. Implement the canonical Scaled Dot-Product Attention equation:\n\nAttention(Q, K, V) = softmax( (Q @ K^T) / sqrt(d_k) + M ) @ V\n\nWhen a boolean mask is provided, masked positions (where mask == 0) must be assigned -1e9 prior to softmax to ensure zero attention weight.',
    mathFormula: 'Attention(Q, K, V) = softmax((Q @ K^T) / sqrt(d_k)) @ V',
    inputSpec: [
      {
        name: 'Q',
        type: 'np.ndarray',
        desc: 'Query tensor of shape (..., seq_len_q, d_k).',
      },
      {
        name: 'K',
        type: 'np.ndarray',
        desc: 'Key tensor of shape (..., seq_len_k, d_k).',
      },
      {
        name: 'V',
        type: 'np.ndarray',
        desc: 'Value tensor of shape (..., seq_len_v, d_v) where seq_len_k == seq_len_v.',
      },
      {
        name: 'mask',
        type: 'Optional[np.ndarray]',
        desc: 'Boolean attention mask broadcastable to (..., seq_len_q, seq_len_k).',
      },
    ],
    outputSpec: {
      type: 'Tuple[np.ndarray, np.ndarray]',
      desc: '(output, attention_weights) weighted values and softmax probabilities.',
    },
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
    
    # 2. Apply mask if present (mask == 0 -> -1e9)
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
        id: 'tc-att-1',
        input: 'Q=[[1, 0]], K=[[1, 0], [0, 1]], V=[[10, 20], [30, 40]]',
        expectedOutput: 'Output shape: (1, 2), First weight > 0.70',
        isHidden: false,
        explanation: 'Query vector [1, 0] matches Key 0 perfectly, concentrating softmax weight on Value 0.',
      },
      {
        id: 'tc-att-2',
        input: 'Batch shape (2, 4, 16), with causal mask',
        expectedOutput: 'All upper triangle attention weights strictly 0.0',
        isHidden: false,
        explanation: 'Causal masking ensures each token attends only to prior positions in autoregressive generation.',
      },
    ],
    hints: [
      'Remember to divide by the square root of key dimension d_k before taking the exponent to prevent vanishing gradients.',
      'Use np.swapaxes(K, -1, -2) to transpose the last two dimensions safely for arbitrary batch sizes.',
      'Subtract max(scores) before exp() for numerical stability to avoid floating-point overflow.',
    ],
    timeLimitMs: 2000,
    verificationCriteria: [
      {
        id: 'vc-att-scaling',
        label: 'Scaling Factor: Division by sqrt(d_k) or ** 0.5',
        check: (code: string) => {
          const hasSqrt = code.includes('sqrt') || code.includes('** 0.5') || code.includes('**0.5');
          return {
            passed: hasSqrt,
            message: hasSqrt
              ? 'Found division by sqrt(d_k) scaling factor.'
              : 'Missing scaling by sqrt(d_k) prior to exponentiation.',
          };
        },
      },
      {
        id: 'vc-att-matmul',
        label: 'Matrix Products: Q @ K^T and attention_weights @ V',
        check: (code: string) => {
          const hasMatmul = code.includes('matmul') || code.includes('@') || code.includes('bmm');
          return {
            passed: hasMatmul,
            message: hasMatmul
              ? 'Tensor projection dot-products verified.'
              : 'Missing Q @ K^T or attention_weights @ V matrix multiplication.',
          };
        },
      },
      {
        id: 'vc-att-softmax',
        label: 'Softmax Normalization: exp() and sum(exp())',
        check: (code: string) => {
          const hasSoftmax = code.toLowerCase().includes('softmax') || (code.includes('exp') && code.includes('sum'));
          return {
            passed: hasSoftmax,
            message: hasSoftmax
              ? 'Softmax probability normalization confirmed.'
              : 'Missing softmax probability normalization over attention scores.',
          };
        },
      },
      {
        id: 'vc-att-return',
        label: 'Return Output and Attention Weights',
        check: (code: string) => {
          const hasReturn = /return\s+output/.test(code) || /return\s+/.test(code);
          return {
            passed: hasReturn,
            message: hasReturn
              ? 'Returns transformed output representations.'
              : 'Missing return statement.',
          };
        },
      },
    ],
  },
];

// Helper to look up challenge by ID with fallback to beginner challenge
export function getChallengeById(id?: string): ExtendedCodingChallenge {
  if (!id) return codingChallenges[0];
  const found = codingChallenges.find((c) => c.id === id);
  return found || codingChallenges[0];
}

// Backward-compatible mockCodingChallenge pointing to beginner challenge
export const mockCodingChallenge = codingChallenges[0];
