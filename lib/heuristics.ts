// Хеуристики для расчета потерь и ожидаемых удалений

export interface QuizAnswers {
  platform: 'OnlyFans' | 'Fansly' | 'Other';
  status: 'Yes' | 'No' | 'Not sure';
  where: string[];
  income: '0-1k' | '1-5k' | '5-10k' | '10k+';
  usernames: '1' | '2-10' | '10+';
  email: string;
  username?: string;
}

export interface EstimatedLoss {
  min: number;
  max: number;
}

export interface ExpectedRemovals {
  min: number;
  max: number;
  rationale: string;
}

// Конфигурация доходных бакетов
const INCOME_MIDPOINTS = {
  '0-1k': 500,
  '1-5k': 3000,
  '5-10k': 7500,
  '10k+': 12500,
} as const;

/**
 * Вычисляет оценочные потери на основе дохода
 * Возвращает диапазон 15-20% от медианы дохода
 */
export function computeEstimatedLoss(incomeBucket: QuizAnswers['income']): EstimatedLoss {
  const midpoint = INCOME_MIDPOINTS[incomeBucket];
  return {
    min: Math.round(midpoint * 0.15),
    max: Math.round(midpoint * 0.20),
  };
}

/**
 * Вычисляет ожидаемое количество удалений на основе ответов квиза
 * Консервативная взвешенная сумма с учетом всех факторов
 */
export function computeExpectedRemovals(answers: QuizAnswers): ExpectedRemovals {
  let base = 6; // базовое минимальное количество
  let bonus = 0;
  const factors: string[] = [];

  // Бонус за статус утечек
  if (answers.status === 'Yes') {
    bonus += 4;
    factors.push('confirmed leaks detected');
  } else if (answers.status === 'Not sure') {
    bonus += 2;
    factors.push('potential leaks');
  }

  // Бонус за места появления утечек
  if (answers.where) {
    if (answers.where.includes('Websites')) {
      bonus += 3;
      factors.push('website presence');
    }
    if (answers.where.includes('Search (Google)')) {
      bonus += 2;
      factors.push('search visibility');
    }
    if (answers.where.includes('Public channels (generic)')) {
      bonus += 2;
      factors.push('public channels');
    }
    if (answers.where.includes('Fake/impersonation profiles')) {
      bonus += 2;
      factors.push('impersonation risks');
    }
  }

  // Множитель для количества username'ов
  let multiplier = 1.0;
  if (answers.usernames === '2-10') {
    multiplier = 1.4;
    factors.push('multiple usernames');
  } else if (answers.usernames === '10+') {
    multiplier = 1.8;
    factors.push('extensive username portfolio');
  }

  const total = Math.round((base + bonus) * multiplier);
  
  // Зажимаем в разумные пределы
  const min = Math.max(6, Math.min(total - 2, 28));
  const max = Math.max(min + 4, Math.min(total + 6, 30));

  const rationale = factors.length > 0 
    ? `Based on ${factors.join(', ')}`
    : 'Conservative estimate for new protection setup';

  return {
    min,
    max,
    rationale,
  };
}

/**
 * Форматирует денежную сумму для отображения
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Генерирует персонализированное сообщение на основе результатов
 */
export function generatePersonalizedMessage(answers: QuizAnswers): string {
  const loss = computeEstimatedLoss(answers.income);
  const removals = computeExpectedRemovals(answers);

  if (loss.min === 0 && removals.min <= 8) {
    return "Not sure where to start? Run Instant Check — we'll scan common sources and show what we can remove.";
  }

  return `Based on your ${answers.platform} presence and ${answers.income.replace('-', '–')} income range, we estimate significant protection opportunities.`;
}
