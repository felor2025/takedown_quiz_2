'use client'

import { useState } from 'react'

export default function QuizSimplePage() {
  const [currentStep, setCurrentStep] = useState(0)

  console.log('QuizSimplePage rendered, currentStep:', currentStep)

  const handleStartQuiz = () => {
    console.log('Start quiz clicked!')
    setCurrentStep(1)
  }

  if (currentStep === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0E0E12', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
          Check how much you can recover
        </h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', textAlign: 'center' }}>
          Answer a few quick questions — get your estimate and start free
        </p>

        <button 
          onClick={handleStartQuiz}
          style={{
            backgroundColor: '#5A31F4',
            color: 'white',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(90, 49, 244, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#4A28D4'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#5A31F4'
          }}
        >
          Start the quiz →
        </button>

        <div style={{ marginTop: '2rem', fontSize: '14px', color: '#9CA3AF' }}>
          Debug: Step {currentStep} | {new Date().toLocaleTimeString()}
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0E0E12', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Quiz Step {currentStep}
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Success! Buttons are working correctly.
      </p>

      <button 
        onClick={() => setCurrentStep(0)}
        style={{
          backgroundColor: '#6B7280',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back to Start
      </button>

      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#9CA3AF' }}>
        Debug: Step {currentStep} | {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
