'use client'

import { useState } from 'react'
import { Monitor, Users, Search, DollarSign, User, Mail, ArrowRight } from 'lucide-react'
import { SelectCard } from '@/components/quiz/SelectCard'
import { MultiSelectCard } from '@/components/quiz/MultiSelectCard'
import { ProgressBar } from '@/components/quiz/ProgressBar'

export default function QuizNewDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState('')
  const [selectedLeaks, setSelectedLeaks] = useState<string[]>([])
  
  const handleLeakChange = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedLeaks(prev => [...prev, option])
    } else {
      setSelectedLeaks(prev => prev.filter(item => item !== option))
    }
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-lg mx-auto mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={6} />
        </div>

        {/* Step Content */}
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
              {currentStep === 1 && "Where should we start?"}
              {currentStep === 2 && "Where do you find leaked content?"}
            </h1>
          </div>
          
          <div className="space-y-4">
            {currentStep === 1 && (
              <>
                <SelectCard
                  value="OnlyFans"
                  isSelected={platform === 'OnlyFans'}
                  onClick={() => setPlatform('OnlyFans')}
                  icon={<Monitor size={20} />}
                  title="OnlyFans"
                  description="Content creation platform"
                />
                <SelectCard
                  value="Fansly"
                  isSelected={platform === 'Fansly'}
                  onClick={() => setPlatform('Fansly')}
                  icon={<Users size={20} />}
                  title="Fansly"
                  description="Creator monetization platform"
                />
                <SelectCard
                  value="Other"
                  isSelected={platform === 'Other'}
                  onClick={() => setPlatform('Other')}
                  icon={<Monitor size={20} />}
                  title="Other platform"
                  description="Different content platform"
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <MultiSelectCard
                  value="websites"
                  isSelected={selectedLeaks.includes('websites')}
                  onClick={() => handleLeakChange('websites', !selectedLeaks.includes('websites'))}
                  icon={<Monitor size={20} />}
                  title="Adult websites & forums"
                  description="PornHub, Reddit, tube sites"
                />
                <MultiSelectCard
                  value="search"
                  isSelected={selectedLeaks.includes('search')}
                  onClick={() => handleLeakChange('search', !selectedLeaks.includes('search'))}
                  icon={<Search size={20} />}
                  title="Google search results"
                  description="My content shows up in searches"
                />
                <MultiSelectCard
                  value="channels"
                  isSelected={selectedLeaks.includes('channels')}
                  onClick={() => handleLeakChange('channels', !selectedLeaks.includes('channels'))}
                  icon={<Users size={20} />}
                  title="Telegram/Discord channels"
                  description="Public sharing channels"
                />
                <MultiSelectCard
                  value="unsure"
                  isSelected={selectedLeaks.includes('unsure')}
                  onClick={() => handleLeakChange('unsure', !selectedLeaks.includes('unsure'))}
                  icon={<User size={20} />}
                  title="Not sure where to look"
                  description="I need help finding leaks"
                />
                <p className="text-center text-sm text-muted mt-6">
                  Select all that apply. This helps us prioritize removal efforts.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-lg mx-auto mt-8 px-4">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 bg-card border border-border text-text rounded-lg hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Back
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            className="flex items-center justify-center px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
            type="button"
          >
            Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left max-w-lg mx-auto">
          <h4 className="text-white font-bold mb-2">Demo Info:</h4>
          <div className="text-xs text-green-400 space-y-1">
            <div>Current Step: {currentStep}</div>
            <div>Platform: {platform || 'none'}</div>
            <div>Selected Leaks: {selectedLeaks.length} items</div>
            <div>Leaks: {selectedLeaks.join(', ') || 'none'}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
