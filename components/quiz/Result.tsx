'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProofStrip } from './ProofStrip'
import { 
  QuizAnswers, 
  computeEstimatedLoss, 
  computeExpectedRemovals,
  formatCurrency,
  generatePersonalizedMessage
} from '@/lib/heuristics'
import { trackEvent, createSignupURL, getInstantCheckURL } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface ResultProps {
  answers: QuizAnswers
  className?: string
}

const slideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 }
}

export function Result({ answers, className }: ResultProps) {
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const loss = computeEstimatedLoss(answers.income)
  const removals = computeExpectedRemovals(answers)
  const personalizedMessage = generatePersonalizedMessage(answers)

  const handleSignupClick = () => {
    const quizSummary = {
      platform: answers.platform,
      income: answers.income,
      estimatedLoss: `$${formatCurrency(loss.min)}–${formatCurrency(loss.max)}`,
      expectedRemovals: `${removals.min}–${removals.max}`,
      email: answers.email,
      timestamp: Date.now()
    }
    
    trackEvent.signupClick(JSON.stringify(quizSummary))
    
    const signupURL = createSignupURL(quizSummary)
    window.open(signupURL, '_blank')
  }

  const handleEmailReport = async () => {
    setIsEmailSending(true)
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          estimatedLoss: loss,
          expectedRemovals: removals,
          timestamp: Date.now(),
        }),
      })

      if (response.ok) {
        setEmailSent(true)
        trackEvent.leadSent(answers.email, !!answers.username)
        setTimeout(() => setEmailSent(false), 3000)
      }
    } catch (error) {
      console.error('Failed to send email report:', error)
    } finally {
      setIsEmailSending(false)
    }
  }

  const handleInstantCheck = () => {
    const instantCheckURL = getInstantCheckURL()
    if (instantCheckURL.startsWith('#')) {
      // Anchor link
      window.location.href = instantCheckURL
    } else {
      window.open(instantCheckURL, '_blank')
    }
  }

  // Проверка на пустое состояние
  const isEmpty = loss.min === 0 && removals.min <= 8

  if (isEmpty) {
    return (
      <motion.div
        variants={slideVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn('w-full max-w-2xl mx-auto', className)}
      >
        <Card className="shadow-card text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Not sure where to start?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted text-lg">
              Run Instant Check — we'll scan common sources and show what we can remove.
            </p>
            <Button 
              onClick={handleInstantCheck}
              size="xl"
              className="w-full"
            >
              Run Instant Check
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('w-full max-w-4xl mx-auto space-y-6', className)}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Your estimate is ready</h1>
        <p className="text-muted text-lg">{personalizedMessage}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Estimated Loss Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Estimated Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {formatCurrency(loss.min)}–{formatCurrency(loss.max)}
            </div>
            <p className="text-sm text-muted">per month (estimated)</p>
          </CardContent>
        </Card>

        {/* Expected Removals Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Expected Removals in First 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
              ~{removals.min}–{removals.max} links
            </div>
            <p className="text-sm text-muted">{removals.rationale}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Points */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Formal notices sent to sites/hosts/search (DMCA where applicable)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>First removals ≤24h — live proof</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>$39/username — Unlimited takedowns</span>
            </li>
          </ul>

          <ProofStrip variant="compact" className="mb-6 justify-center" />

          <div className="space-y-4">
            <Button 
              onClick={handleSignupClick}
              size="xl"
              className="w-full"
            >
              Start Free — No Card
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
