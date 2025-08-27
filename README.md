# Quiz Landing Page - Takedown.co

Высококонверсионная квиз-лендинг для привлечения solo creators и funnel к регистрации на Takedown.co.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск development сервера
npm run dev

# Сборка для production
npm run build
npm start
```

Откройте [http://localhost:3005/quiz](http://localhost:3005/quiz) для просмотра квиза.

> **Примечание:** Сервер может запуститься на другом порту, если 3000 занят. Проверьте вывод в терминале.

## ⚙️ Конфигурация

Создайте файл `.env.local` с необходимыми переменными:

```env
# Обязательно: URL для перенаправления на регистрацию
NEXT_PUBLIC_SIGNUP_URL=https://takedown.co/signup

# Опционально: URL для функции мгновенной проверки
NEXT_PUBLIC_INSTANT_CHECK_URL=https://takedown.co/#instant-check

# Опционально: Google Tag Manager ID для аналитики
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 📊 Структура квиза

### 6 шагов квиза:
1. **Платформа** - OnlyFans, Fansly, Other
2. **Статус утечек** - Yes, No, Not sure
3. **Места появления** - Multiple checkboxes
4. **Доходы** - 4 диапазона ($0-1k, $1-5k, $5-10k, $10k+)
5. **Количество username'ов** - 1, 2-10, 10+
6. **Email capture** - Обязательное поле + опциональный username

### Результаты:
- **Estimated Loss** - 15-20% от медианы дохода
- **Expected Removals** - Консервативная оценка на основе ответов
- **Персонализированные рекомендации**

## 🎯 A/B тестирование

### Поддерживаемые варианты:

**Hero заголовки:**
- `/quiz` - "Check how much you can recover."
- `/quiz?ab=hero_b` - "See what we can remove — fast."

**CTA на результатах:**
- Стандартный: "Start Free — No Card"
- `?ab=cta_signup` - "Create account to see full report and start removals"

## 📈 Аналитика и события

### Отслеживаемые события:
- `quiz_start` - Начало квиза
- `quiz_step` - Переход между шагами
- `quiz_completed` - Завершение квиза
- `signup_click` - Клик на регистрацию
- `lead_sent` - Отправка email отчета

### UTM персистентность:
Все UTM параметры сохраняются в localStorage и передаются:
- В signup URL
- В события аналитики
- В API лидов

## 🔧 Кастомизация хеуристик

### Файл `lib/heuristics.ts`

```typescript
// Изменение диапазонов доходов
const INCOME_MIDPOINTS = {
  '0-1k': 500,    // Изменить медиану
  '1-5k': 3000,   // для каждого диапазона
  '5-10k': 7500,
  '10k+': 12500,
}

// Настройка процентов потерь
export function computeEstimatedLoss(incomeBucket) {
  const midpoint = INCOME_MIDPOINTS[incomeBucket]
  return {
    min: Math.round(midpoint * 0.15), // 15% минимум
    max: Math.round(midpoint * 0.20), // 20% максимум
  }
}
```

### Логика расчета удалений:

```typescript
export function computeExpectedRemovals(answers) {
  let base = 6 // Базовое количество
  let bonus = 0
  
  // Бонусы за разные факторы:
  if (answers.status === 'Yes') bonus += 4
  if (answers.where.includes('Websites')) bonus += 3
  if (answers.where.includes('Search (Google)')) bonus += 2
  // ... etc
  
  // Множители для username'ов:
  let multiplier = 1.0
  if (answers.usernames === '2-10') multiplier = 1.4
  if (answers.usernames === '10+') multiplier = 1.8
}
```

## 🎨 Дизайн-система

### Цвета:
```css
:root {
  --background: #0E0E12;  /* Основной фон */
  --card: #17171D;        /* Фон карточек */
  --primary: #5A31F4;     /* Брендовый фиолетовый */
  --accent: #34D399;      /* Акцент/успех */
  --text: #F8F9FA;        /* Основной текст */
  --border: #2D2D35;      /* Границы */
  --muted: #9CA3AF;       /* Приглушенный текст */
}
```

### Компоненты:
- **Card** - radius 16px, тень `0 8px 24px rgba(0,0,0,.35)`
- **RadioPill** - высота 48-56px, закругленные, активное состояние с border и fill
- **Progress** - тонкая полоса сверху + проценты

### Анимации:
- Переходы между шагами: fade + slide (y=12px)
- Длительность: 150-200ms, ease-out
- Без резких движений, subtle эффекты

## 🔗 API Endpoints

### `POST /api/lead`
Сохраняет данные лидов (in-memory для demo).

**Request:**
```json
{
  "answers": { ... },
  "estimatedLoss": { "min": 450, "max": 600 },
  "expectedRemovals": { "min": 8, "max": 12 },
  "timestamp": 1640995200000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead captured successfully",
  "leadId": 123
}
```

### `GET /api/lead` (dev only)
Показывает статистику лидов в development режиме.

## 📱 Мобильная версия

### Sticky footer:
- Прогресс-бар + основная CTA кнопка
- Скрывается на desktop (lg+)
- Z-index 50 для overlay

### Адаптивность:
- Большие tap targets (48-56px)
- Оптимизированные размеры текста
- Корректные отступы на всех устройствах

## ♿ Accessibility

### Реализовано:
- Semantic HTML элементы
- ARIA labels для всех form controls
- aria-live для прогресса и уведомлений
- Keyboard navigation
- Focus visible states
- Screen reader support

### Форма:
- Правильные labels для всех inputs
- Required field индикация
- Валидация с понятными сообщениями

## 🚀 Production deployment

### Интеграции для production:

1. **CRM подключение** (`/api/lead`):
```typescript
// Замените in-memory storage на:
await hubspotClient.contacts.create(leadData)
// или
await salesforceClient.sobjects.Lead.create(leadData)
```

2. **Email marketing**:
```typescript
await mailchimpClient.lists.members.create(leadData)
// или
await sendgridClient.send(emailTemplate)
```

3. **База данных**:
```typescript
await prisma.lead.create({ data: leadData })
// или
await mongoose.Lead.create(leadData)
```

4. **Analytics**:
```typescript
// Google Analytics 4
gtag('event', 'quiz_completed', { ... })

// Mixpanel
mixpanel.track('quiz_completed', { ... })
```

## 📊 Метрики для мониторинга

### Конверсионные показатели:
- **Completion Rate** - % завершивших квиз
- **Step Drop-off** - На каком шаге уходят
- **Signup Conversion** - % кликов на "Start Free"
- **Email Capture Rate** - % заполнивших email

### Технические метрики:
- **Page Load Time** - Время загрузки
- **API Response Time** - Время ответа /api/lead
- **Error Rate** - Количество ошибок
- **Mobile vs Desktop** - Конверсия по устройствам

## 🐛 Debugging

### Полезные команды:
```bash
# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Анализ bundle size
npm run build && npx @next/bundle-analyzer
```

### Логи событий:
События аналитики дублируются в `console.log` для отладки.

### localStorage данные:
- `quiz_progress` - Сохраненный прогресс
- `quiz_utm` - UTM параметры

## ✅ Исправленные проблемы

### Версия 1.1 - Улучшенный UI/UX
- **Исправлена логика отображения квиза** - теперь Hero секция показывается правильно
- **Обновлен Next.js config** - удалена устаревшая опция `experimental.appDir`
- **Улучшен дизайн Hero секции:**
  - Градиентные заголовки с анимацией
  - Фоновые gradient orbs с blur эффектами
  - Badge с "Free Protection Analysis"
  - Улучшенная типографика и spacing
  - Hover эффекты на кнопках с scale transform
- **Обновлен ProofStrip:**
  - Добавлены hover эффекты
  - Gradients и улучшенная анимация
  - Мигающие индикаторы активности
- **Улучшен мобильный интерфейс:**
  - Backdrop blur в sticky footer
  - Кнопка "Back" в мобильном footer
  - Улучшенные переходы и анимации
- **Добавлены кастомные стили:**
  - Кастомные scrollbar стили
  - Focus states для accessibility
  - Smooth scrolling

## 📋 TODO для production

- [ ] Подключить реальную CRM/Email систему
- [ ] Настроить мониторинг ошибок (Sentry)
- [ ] Добавить rate limiting для API
- [ ] Настроить CDN для статических ресурсов
- [ ] Implement proper SEO meta tags
- [ ] Add favicon и touch icons
- [ ] Настроить CSP headers
- [ ] Добавить sitemap.xml

## 🤝 Contributing

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 License

MIT License - смотрите [LICENSE](LICENSE) файл для деталей.
