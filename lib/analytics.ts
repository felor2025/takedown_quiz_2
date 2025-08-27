// Аналитика и трекинг событий квиза

export type AnalyticsEvent = 
  | 'quiz_start'
  | 'quiz_step'
  | 'quiz_completed'
  | 'signup_click'
  | 'lead_sent';

export type QuizStep = 
  | 'platform'
  | 'status'
  | 'where'
  | 'income'
  | 'usernames'
  | 'email';

interface BaseEventData {
  timestamp: number;
  url: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

interface QuizStepEventData extends BaseEventData {
  step: QuizStep;
  stepNumber: number;
}

interface QuizCompletedEventData extends BaseEventData {
  quizData: any;
  heuristicsOutput: any;
}

interface SignupClickEventData extends BaseEventData {
  quizSummary: string;
}

interface LeadSentEventData extends BaseEventData {
  email: string;
  hasUsername: boolean;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Получает UTM параметры из URL или localStorage
 */
export function getUTMParams(): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Попытка получить из localStorage (персистентность)
  try {
    const storedUTM = localStorage.getItem('quiz_utm');
    if (storedUTM) {
      Object.assign(params, JSON.parse(storedUTM));
    }
  } catch (error) {
    console.warn('Failed to parse stored UTM:', error);
  }
  
  // Проверка текущих URL параметров
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        params[param.replace('utm_', '')] = value;
      }
    });
    
    // Сохранить UTM параметры в localStorage для персистентности
    if (Object.keys(params).length > 0) {
      try {
        localStorage.setItem('quiz_utm', JSON.stringify(params));
      } catch (error) {
        console.warn('Failed to store UTM params:', error);
      }
    }
  }
  
  return params;
}

/**
 * Создает базовые данные события
 */
function createBaseEventData(): BaseEventData {
  const utmParams = getUTMParams();
  return {
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    utmSource: utmParams.source,
    utmMedium: utmParams.medium,
    utmCampaign: utmParams.campaign,
    utmTerm: utmParams.term,
    utmContent: utmParams.content,
  };
}

/**
 * Отправляет событие в аналитику
 */
function sendEvent(eventName: AnalyticsEvent, eventData: any) {
  // Console.log для отладки
  console.log(`Analytics Event: ${eventName}`, eventData);
  
  // Google Analytics / GTM
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  // Google Tag Manager
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
}

/**
 * Трекинг событий квиза
 */
export const trackEvent = {
  quizStart: () => {
    const eventData = createBaseEventData();
    sendEvent('quiz_start', eventData);
  },
  
  quizStep: (step: QuizStep, stepNumber: number) => {
    const eventData: QuizStepEventData = {
      ...createBaseEventData(),
      step,
      stepNumber,
    };
    sendEvent('quiz_step', eventData);
  },
  
  quizCompleted: (quizData: any, heuristicsOutput: any) => {
    const eventData: QuizCompletedEventData = {
      ...createBaseEventData(),
      quizData,
      heuristicsOutput,
    };
    sendEvent('quiz_completed', eventData);
  },
  
  signupClick: (quizSummary: string) => {
    const eventData: SignupClickEventData = {
      ...createBaseEventData(),
      quizSummary,
    };
    sendEvent('signup_click', eventData);
  },
  
  leadSent: (email: string, hasUsername: boolean) => {
    const eventData: LeadSentEventData = {
      ...createBaseEventData(),
      email,
      hasUsername,
    };
    sendEvent('lead_sent', eventData);
  },
};

/**
 * Создает URL для регистрации с UTM параметрами и сводкой квиза
 */
export function createSignupURL(quizSummary: any): string {
  const baseURL = process.env.NEXT_PUBLIC_SIGNUP_URL || 'https://takedown.co/signup';
  const url = new URL(baseURL);
  
  // Добавить UTM параметры
  const utmParams = getUTMParams();
  Object.entries(utmParams).forEach(([key, value]) => {
    url.searchParams.set(`utm_${key}`, value);
  });
  
  // Добавить сводку квиза
  url.searchParams.set('q', encodeURIComponent(JSON.stringify(quizSummary)));
  
  return url.toString();
}

/**
 * Получает URL для мгновенной проверки
 */
export function getInstantCheckURL(): string {
  return process.env.NEXT_PUBLIC_INSTANT_CHECK_URL || '/#instant-check';
}
