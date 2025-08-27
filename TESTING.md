# 🧪 Тестирование квиза

## Быстрая проверка

1. **Запуск:** `npm run dev`
2. **Открыть:** http://localhost:3005/quiz (или другой порт из вывода)
3. **Проверить:** Hero секция должна отображаться с анимированными элементами

## Тестовые сценарии

### Hero Section
- ✅ Заголовок с градиентом отображается
- ✅ Badge "Free Protection Analysis" мигает
- ✅ Кнопка "Start the quiz" имеет hover эффект с scale
- ✅ ProofStrip показывает "живые" метрики
- ✅ Фоновые gradient orbs анимируются

### Квиз флоу
1. **Клик "Start the quiz"** → переход к Step 1
2. **Пройти все 6 шагов:**
   - Platform (OnlyFans/Fansly/Other)
   - Leak status (Yes/No/Not sure)
   - Where leaks appear (checkboxes)
   - Income range ($0-1k до $10k+)
   - Number of usernames (1, 2-10, 10+)
   - Email capture + optional username
3. **Результат** → показывает персонализированные расчеты

### A/B тестирование
- `/quiz` - "Check how much you can recover"
- `/quiz?ab=hero_b` - "See what we can remove — fast"

### Mobile UI
- Sticky footer появляется на мобильных
- Back button в footer для шагов > 1
- Progress bar отображается корректно

### API тестирование
```bash
# Проверка API лидов (только dev)
curl http://localhost:3005/api/lead

# Отправка тестового лида
curl -X POST http://localhost:3005/api/lead \
  -H "Content-Type: application/json" \
  -d '{"answers":{"email":"test@example.com","platform":"OnlyFans"},"estimatedLoss":{"min":100,"max":200},"expectedRemovals":{"min":5,"max":10},"timestamp":1640995200000}'
```

### Аналитика (dev)
Проверить console в браузере - должны появляться события:
- `quiz_start` при загрузке
- `quiz_step` при переходах
- `quiz_completed` при завершении

## Проблемы и решения

### "Start quiz" не работает
- ✅ **Исправлено:** currentStep теперь начинается с 0 (Hero)
- Убедитесь что JavaScript загружен без ошибок

### Next.js предупреждения
- ✅ **Исправлено:** удалена устаревшая опция `experimental.appDir`

### Стили не применяются
- Проверьте что Tailwind CSS компилируется без ошибок
- Убедитесь что кастомные цвета в `tailwind.config.ts` применились

## Производительность

### Lighthouse проверка
```bash
npm run build
npm start
# Затем проверить с Lighthouse на /quiz
```

**Ожидаемые показатели:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >85

### Bundle анализ
```bash
npm run build
npx @next/bundle-analyzer
```

## Готовность к production

- [ ] Переменные окружения настроены
- [ ] API endpoints протестированы
- [ ] Mobile UI проверен
- [ ] Analytics events работают
- [ ] A/B тестирование функционирует
- [ ] UTM параметры персистят
- [ ] Email capture работает
- [ ] Результаты отображаются корректно

## Получение помощи

Если что-то не работает:
1. Проверьте console на ошибки JavaScript
2. Убедитесь что сервер запущен (`npm run dev`)
3. Проверьте Network tab для API вызовов
4. Очистите localStorage если есть проблемы с прогрессом
