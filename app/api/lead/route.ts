import { NextRequest, NextResponse } from 'next/server'
import { QuizAnswers, EstimatedLoss, ExpectedRemovals } from '@/lib/heuristics'
import { getUTMParams } from '@/lib/analytics'

interface LeadData {
  answers: QuizAnswers
  estimatedLoss: EstimatedLoss
  expectedRemovals: ExpectedRemovals
  timestamp: number
  utmParams?: Record<string, string>
}

// In-memory storage для демонстрации (в продакшене использовать базу данных)
const leads: LeadData[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация входящих данных
    if (!body.answers?.email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      )
    }

    // Создание записи лида
    const leadData: LeadData = {
      answers: body.answers,
      estimatedLoss: body.estimatedLoss,
      expectedRemovals: body.expectedRemovals,
      timestamp: body.timestamp || Date.now(),
      utmParams: getUTMParams(),
    }

    // Сохранение в памяти (для демонстрации)
    leads.push(leadData)

    // Логирование для отладки
    console.log('New lead captured:', {
      email: leadData.answers.email,
      platform: leadData.answers.platform,
      income: leadData.answers.income,
      estimatedLoss: `$${leadData.estimatedLoss.min}-${leadData.estimatedLoss.max}`,
      timestamp: new Date(leadData.timestamp).toISOString(),
      utmSource: leadData.utmParams?.source,
      totalLeads: leads.length
    })

    // В продакшене здесь была бы интеграция с:
    // - CRM системой (HubSpot, Salesforce)
    // - Email marketing (Mailchimp, SendGrid)
    // - Analytics (Mixpanel, Amplitude)
    // - Database (PostgreSQL, MongoDB)

    return NextResponse.json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: leads.length
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture lead' }, 
      { status: 500 }
    )
  }
}

// GET endpoint для статистики (только для разработки)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  return NextResponse.json({
    totalLeads: leads.length,
    leads: leads.slice(-10), // Последние 10 лидов
    stats: {
      platforms: leads.reduce((acc, lead) => {
        acc[lead.answers.platform] = (acc[lead.answers.platform] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      incomeRanges: leads.reduce((acc, lead) => {
        acc[lead.answers.income] = (acc[lead.answers.income] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  })
}
