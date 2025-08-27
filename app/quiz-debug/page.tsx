'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function QuizDebugPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const handleStartQuiz = () => {
    console.log('Start quiz clicked!')
    setClickCount(prev => prev + 1)
    setCurrentStep(1)
    alert('Button clicked! Step: ' + currentStep + ', Clicks: ' + (clickCount + 1))
  }

  const handleNext = () => {
    console.log('Next clicked!')
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    console.log('Back clicked!')
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  if (currentStep === 0) {
    return (
      <main className="min-h-screen bg-background text-text p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 text-white">Debug Quiz Page</h1>
          
          <div className="space-y-4">
            <p className="text-white">Current Step: {currentStep}</p>
            <p className="text-white">Click Count: {clickCount}</p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Простая кнопка без лишних стилей */}
            <button 
              onClick={handleStartQuiz}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              style={{ backgroundColor: '#3B82F6', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none' }}
            >
              Simple Button - Start Quiz
            </button>

            {/* shadcn/ui кнопка */}
            <Button 
              onClick={handleStartQuiz}
              size="lg"
            >
              ShadCN Button - Start Quiz
            </Button>

            {/* Inline onClick */}
            <button 
              onClick={() => {
                console.log('Inline onClick works!')
                handleStartQuiz()
              }}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 block w-full"
            >
              Inline onClick - Start Quiz
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded text-left">
            <h3 className="text-white font-bold mb-2">Debug Info:</h3>
            <pre className="text-green-400 text-sm">
              {JSON.stringify({
                currentStep,
                clickCount,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">Quiz Step {currentStep}</h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-white">You are on step {currentStep}</p>
          <p className="text-white">Buttons are working!</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded text-left">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <pre className="text-green-400 text-sm">
            {JSON.stringify({
              currentStep,
              clickCount,
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  )
}
