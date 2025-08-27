'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio-group'
import { StepShell } from '@/components/quiz/StepShell'
import { RadioPill } from '@/components/quiz/RadioPill'
import { SelectCard } from '@/components/quiz/SelectCard'
import { MultiSelectCard } from '@/components/quiz/MultiSelectCard'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { ProofStrip } from '@/components/quiz/ProofStrip'
import { Result } from '@/components/quiz/Result'
import { QuizAnswers } from '@/lib/heuristics'
import { trackEvent, getInstantCheckURL } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Monitor, Users, Search, DollarSign, User, Mail } from 'lucide-react'

const TOTAL_STEPS = 6

interface ValidationErrors {
  [key: string]: string
}

// Отдельный компонент для debug информации - избегаем ошибок гидрации
const DebugInfo = ({ currentStep, showResult, answersCount }: { 
  currentStep: number
  showResult: boolean
  answersCount: number
}) => {
  const [mounted, setMounted] = useState(false)
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setMounted(true)
    setTimestamp(new Date().toLocaleTimeString())
    
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left max-w-md mx-auto">
        <h4 className="text-white font-bold mb-2">Debug Info:</h4>
        <div className="text-xs text-green-400 space-y-1">
          <div>Current Step: {currentStep}</div>
          <div>Show Result: {String(showResult)}</div>
          <div>Has Answers: {answersCount}</div>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left max-w-md mx-auto">
      <h4 className="text-white font-bold mb-2">Debug Info:</h4>
      <div className="text-xs text-green-400 space-y-1">
        <div>Current Step: {currentStep}</div>
        <div>Show Result: {String(showResult)}</div>
        <div>Has Answers: {answersCount}</div>
        <div>Timestamp: {timestamp}</div>
      </div>
    </div>
  )
}

export default function Home() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [currentStep, setCurrentStep] = useState(0) // Начинаем с Hero (0)
  const [showResult, setShowResult] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  
  // A/B тестирование заголовков - только на клиенте
  const heroVariant = searchParams?.get('ab') === 'hero_b' ? 'b' : 'a'
  
  // Инициализация searchParams на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search))
    }
  }, [])
  
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({
    platform: undefined,
    status: undefined,
    where: [],
    income: undefined,
    usernames: undefined,
    email: '',
    username: '',
  })

  // Загрузка сохраненного прогресса из localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quiz_progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setAnswers(parsed.answers || {})
        setCurrentStep(parsed.currentStep || 0) // Если есть прогресс, показываем его, иначе Hero
      } catch (error) {
        console.warn('Failed to load saved progress:', error)
      }
    } else {
      // Трекинг начала квиза только при первом посещении (нет сохраненного прогресса)
      trackEvent.quizStart()
    }
  }, [])

  // Сохранение прогресса в localStorage
  useEffect(() => {
    if (currentStep > 0 || Object.keys(answers).some(key => answers[key as keyof QuizAnswers])) {
      localStorage.setItem('quiz_progress', JSON.stringify({
        answers,
        currentStep,
        timestamp: Date.now()
      }))
    }
  }, [answers, currentStep])

  const updateAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
    // Очистка ошибок при изменении ответа
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}
    
    // Шаг 0 (Hero) всегда валиден
    if (step === 0) {
      return true
    }
    
    switch (step) {
      case 1:
        if (!answers.platform) {
          newErrors.platform = 'Please choose an option to continue.'
        }
        break
      case 2:
        if (!answers.status) {
          newErrors.status = 'Please choose an option to continue.'
        }
        break
      case 3:
        if (!answers.where || answers.where.length === 0) {
          newErrors.where = 'Please choose at least one option to continue.'
        }
        break
      case 4:
        if (!answers.income) {
          newErrors.income = 'Please choose an option to continue.'
        }
        break
      case 5:
        if (!answers.usernames) {
          newErrors.usernames = 'Please choose an option to continue.'
        }
        break
      case 6:
        if (!answers.email) {
          newErrors.email = 'Enter a valid email.'
        } else if (!/\S+@\S+\.\S+/.test(answers.email)) {
          newErrors.email = 'Enter a valid email.'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return
    }

    // Трекинг шага (только для реальных шагов квиза, не для Hero)
    if (currentStep > 0) {
      const stepNames = ['platform', 'status', 'where', 'income', 'usernames', 'email'] as const
      trackEvent.quizStep(stepNames[currentStep - 1], currentStep)
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Завершение квиза
      trackEvent.quizCompleted(answers, { step: 'completed' })
      localStorage.removeItem('quiz_progress') // Очистка сохраненного прогресса
      setShowResult(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else if (currentStep === 1) {
      setCurrentStep(0) // Возврат к Hero
    }
  }

  const handleWhereChange = (option: string, checked: boolean) => {
    const currentWhere = answers.where || []
    if (checked) {
      updateAnswer('where', [...currentWhere, option])
    } else {
      updateAnswer('where', currentWhere.filter(item => item !== option))
    }
  }

  // Hero компонент
  const Hero = () => (
    <div className="relative text-center mb-12 max-w-4xl mx-auto">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm text-accent font-medium">Free Protection Analysis</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent leading-tight">
          {heroVariant === 'b' 
            ? (
              <>
                See what we can<br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">remove — fast</span>
              </>
            )
            : (
              <>
                Check how much<br/>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">you can recover</span>
              </>
            )
          }
        </h1>
        
        <p className="text-xl md:text-2xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Answer a few quick questions — get your{' '}
          <span className="text-accent font-semibold">personalized estimate</span> and start free 
          <span className="text-muted/80"> (no card needed)</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button 
            onClick={() => {
              console.log('Start quiz clicked!')
              setCurrentStep(1)
            }}
            className="inline-flex items-center justify-center h-14 px-8 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            type="button"
          >
            <span>Start the quiz</span>
            <div className="ml-2 text-xl">→</div>
          </button>
          <button 
            onClick={() => {
              console.log('Skip to Instant Check clicked!')
              window.open(getInstantCheckURL(), '_blank')
            }}
            className="px-6 py-3 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors underline-offset-4 hover:underline"
            type="button"
          >
            Skip to Instant Check
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Takes 2 minutes</span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>No legal jargon</span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Instant results</span>
          </div>
        </div>

        {/* Debug Info - исправлено для предотвращения ошибок гидрации */}
        {process.env.NODE_ENV === 'development' && (
          <DebugInfo 
            currentStep={currentStep}
            showResult={showResult}
            answersCount={Object.keys(answers).length}
          />
        )}
      </div>
    </div>
  )

  // Sticky mobile footer (только для шагов квиза, не для Hero)
  const StickyFooter = () => {
    if (currentStep === 0) return null // Не показываем на Hero секции
    
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 p-4 z-50 shadow-2xl">
        <div className="max-w-sm mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} className="mb-3" />
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button 
                onClick={() => {
                  console.log('Mobile Back clicked!')
                  handleBack()
                }}
                className="flex items-center justify-center px-4 py-3 bg-card border border-border text-text rounded-lg hover:bg-card/80"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => {
                console.log('Mobile Next clicked!')
                handleNext()
              }}
              className="flex-1 flex items-center justify-center py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              type="button"
            >
              {currentStep < TOTAL_STEPS ? 'Next' : 'Submit'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showResult && answers.email) {
    return (
      <main className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <Result answers={answers as QuizAnswers} />
        </div>
      </main>
    )
  }

  if (currentStep === 0) {
    return (
      <main className="min-h-screen bg-background text-text relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <Hero />
          <ProofStrip className="max-w-5xl mx-auto" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Progress (только для шагов квиза) */}
        {currentStep > 0 && (
          <div className="hidden lg:block max-w-2xl mx-auto mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1 - Platform */}
          {currentStep === 1 && (
            <StepShell key="step1" title="Where should we start?">
              <div className="space-y-3">
                <SelectCard
                  value="OnlyFans"
                  isSelected={answers.platform === 'OnlyFans'}
                  onClick={() => updateAnswer('platform', 'OnlyFans')}
                  icon={<Monitor size={20} />}
                  title="OnlyFans"
                  description="Content creation platform"
                />
                <SelectCard
                  value="Fansly"
                  isSelected={answers.platform === 'Fansly'}
                  onClick={() => updateAnswer('platform', 'Fansly')}
                  icon={<Users size={20} />}
                  title="Fansly"
                  description="Creator monetization platform"
                />
                <SelectCard
                  value="Other"
                  isSelected={answers.platform === 'Other'}
                  onClick={() => updateAnswer('platform', 'Other')}
                  icon={<Monitor size={20} />}
                  title="Other platform"
                  description="Different content platform"
                />
              </div>
              {errors.platform && (
                <p className="text-red-400 text-sm mt-4">{errors.platform}</p>
              )}
            </StepShell>
          )}

          {/* Step 2 - Leak Status */}
          {currentStep === 2 && (
            <StepShell key="step2" title="Have you seen stolen links of your content?">
              <div className="space-y-3">
                <SelectCard
                  value="Yes"
                  isSelected={answers.status === 'Yes'}
                  onClick={() => updateAnswer('status', 'Yes')}
                  icon={<Search size={20} />}
                  title="Yes"
                  description="I've found stolen content"
                />
                <SelectCard
                  value="No"
                  isSelected={answers.status === 'No'}
                  onClick={() => updateAnswer('status', 'No')}
                  icon={<Users size={20} />}
                  title="No"
                  description="Haven't seen any leaks yet"
                />
                <SelectCard
                  value="Not sure"
                  isSelected={answers.status === 'Not sure'}
                  onClick={() => updateAnswer('status', 'Not sure')}
                  icon={<Monitor size={20} />}
                  title="Not sure"
                  description="Need help finding out"
                />
              </div>
              {errors.status && (
                <p className="text-red-400 text-sm mt-4">{errors.status}</p>
              )}
            </StepShell>
          )}

          {/* Step 3 - Where Leaks Appear */}
          {currentStep === 3 && (
            <StepShell key="step3" title="Where do they show up most?">
              <div className="space-y-3">
                <MultiSelectCard
                  value="Websites"
                  isSelected={answers.where?.includes('Websites') || false}
                  onClick={() => handleWhereChange('Websites', !answers.where?.includes('Websites'))}
                  icon={<Monitor size={20} />}
                  title="Adult websites & forums"
                  description="PornHub, Reddit, tube sites"
                />
                <MultiSelectCard
                  value="Search (Google)"
                  isSelected={answers.where?.includes('Search (Google)') || false}
                  onClick={() => handleWhereChange('Search (Google)', !answers.where?.includes('Search (Google)'))}
                  icon={<Search size={20} />}
                  title="Google search results"
                  description="My content shows up in searches"
                />
                <MultiSelectCard
                  value="Public channels (generic)"
                  isSelected={answers.where?.includes('Public channels (generic)') || false}
                  onClick={() => handleWhereChange('Public channels (generic)', !answers.where?.includes('Public channels (generic)'))}
                  icon={<Users size={20} />}
                  title="Telegram/Discord channels"
                  description="Public sharing channels"
                />
                <MultiSelectCard
                  value="Fake/impersonation profiles"
                  isSelected={answers.where?.includes('Fake/impersonation profiles') || false}
                  onClick={() => handleWhereChange('Fake/impersonation profiles', !answers.where?.includes('Fake/impersonation profiles'))}
                  icon={<User size={20} />}
                  title="Not sure where to look"
                  description="I need help finding leaks"
                />
              </div>
              {errors.where && (
                <p className="text-red-400 text-sm mt-4">{errors.where}</p>
              )}
            </StepShell>
          )}

          {/* Step 4 - Income Range */}
          {currentStep === 4 && (
            <StepShell key="step4" title="Roughly, what's your monthly income from content?">
              <div className="space-y-3">
                <SelectCard
                  value="0-1k"
                  isSelected={answers.income === '0-1k'}
                  onClick={() => updateAnswer('income', '0-1k')}
                  icon={<DollarSign size={20} />}
                  title="$0 – $1,000"
                  description="Starting out"
                />
                <SelectCard
                  value="1-5k"
                  isSelected={answers.income === '1-5k'}
                  onClick={() => updateAnswer('income', '1-5k')}
                  icon={<DollarSign size={20} />}
                  title="$1,000 – $5,000"
                  description="Growing audience"
                />
                <SelectCard
                  value="5-10k"
                  isSelected={answers.income === '5-10k'}
                  onClick={() => updateAnswer('income', '5-10k')}
                  icon={<DollarSign size={20} />}
                  title="$5,000 – $10,000"
                  description="Established creator"
                />
                <SelectCard
                  value="10k+"
                  isSelected={answers.income === '10k+'}
                  onClick={() => updateAnswer('income', '10k+')}
                  icon={<DollarSign size={20} />}
                  title="$10,000+"
                  description="Top tier creator"
                />
              </div>
              <p className="text-sm text-muted mt-6 text-center">
                Used only to estimate potential loss (we don't publish your data).
              </p>
              {errors.income && (
                <p className="text-red-400 text-sm mt-4">{errors.income}</p>
              )}
            </StepShell>
          )}

          {/* Step 5 - Number of Usernames */}
          {currentStep === 5 && (
            <StepShell key="step5" title="How many usernames do you want to protect?">
              <div className="space-y-3">
                <SelectCard
                  value="1"
                  isSelected={answers.usernames === '1'}
                  onClick={() => updateAnswer('usernames', '1')}
                  icon={<User size={20} />}
                  title="1 username"
                  description="Single brand protection"
                />
                <SelectCard
                  value="2-10"
                  isSelected={answers.usernames === '2-10'}
                  onClick={() => updateAnswer('usernames', '2-10')}
                  icon={<Users size={20} />}
                  title="2 – 10 usernames"
                  description="Multiple brands/accounts"
                />
                <SelectCard
                  value="10+"
                  isSelected={answers.usernames === '10+'}
                  onClick={() => updateAnswer('usernames', '10+')}
                  icon={<Users size={20} />}
                  title="10+ usernames"
                  description="Large scale protection"
                />
              </div>
              {errors.usernames && (
                <p className="text-red-400 text-sm mt-4">{errors.usernames}</p>
              )}
            </StepShell>
          )}

          {/* Step 6 - Email Capture */}
          {currentStep === 6 && (
            <StepShell key="step6" title="Almost done! We'll send your personalized report.">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                    <Mail size={18} />
                    Email address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={answers.email || ''}
                    onChange={(e) => updateAnswer('email', e.target.value)}
                    className={cn(
                      'h-14 text-base rounded-xl border-2',
                      errors.email 
                        ? 'border-red-400 focus-visible:ring-red-400' 
                        : 'border-border focus-visible:border-primary focus-visible:ring-primary'
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                    <User size={18} />
                    Username or profile link (optional)
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="@username or profile URL"
                    value={answers.username || ''}
                    onChange={(e) => updateAnswer('username', e.target.value)}
                    className="h-14 text-base rounded-xl border-2 border-border focus-visible:border-primary focus-visible:ring-primary"
                  />
                </div>

                <div className="p-6 bg-card/50 rounded-2xl border border-border space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      required
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <button type="button" className="text-primary hover:underline">Terms</button>
                      {' '}and acknowledge the{' '}
                      <button type="button" className="text-primary hover:underline">Privacy Policy</button>.
                    </Label>
                  </div>
                  <p className="text-sm text-muted">
                    We only use what's needed to detect copies. We don't publish your content.
                  </p>
                </div>
              </div>
            </StepShell>
          )}
        </AnimatePresence>

        {/* Desktop Navigation (только для шагов квиза) */}
        {currentStep > 0 && (
          <div className="hidden lg:flex items-center justify-between max-w-2xl mx-auto mt-8">
            <button
              onClick={() => {
                console.log('Back clicked!')
                handleBack()
              }}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 bg-card border border-border text-text rounded-lg hover:bg-card/80 disabled:opacity-50"
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              onClick={() => {
                console.log('Next clicked!')
                handleNext()
              }}
              className="flex items-center justify-center px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
              type="button"
            >
              {currentStep < TOTAL_STEPS ? 'Next' : 'Submit'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        <StickyFooter />
        
        {/* Bottom spacing for mobile footer (только для шагов квиза) */}
        {currentStep > 0 && <div className="lg:hidden h-24" />}
      </div>
    </main>
  )
}
