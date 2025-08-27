# 🚀 Развертывание на Netlify

## ✅ Проект готов к развертыванию

Проект полностью подготовлен для развертывания на Netlify с настроенным статическим экспортом Next.js.

## 📋 Инструкции по развертыванию

### 1. Загрузка в GitHub

```bash
# Если у вас нет прав доступа к репозиторию felor2025/takedown_quiz_2
# Создайте новый репозиторий на GitHub или получите права доступа

# Затем выполните:
git remote set-url origin https://github.com/ВАШ_АККАУНТ/takedown_quiz_2.git
git push -u origin master
```

**Альтернативный способ:**
1. Создайте новый репозиторий на GitHub
2. Скопируйте его URL
3. Выполните:
   ```bash
   git remote set-url origin НОВЫЙ_URL
   git push -u origin master
   ```

### 2. Развертывание на Netlify

#### Способ 1: Через Git (Рекомендуемый)
1. Зайдите в [netlify.com](https://netlify.com)
2. Нажмите "Import from Git"
3. Выберите ваш GitHub репозиторий
4. Настройки будут применены автоматически из `netlify.toml`

#### Способ 2: Ручная загрузка
```bash
# Соберите проект локально
npm run build

# Загрузите папку `out` в Netlify через web-интерфейс
```

## ⚙️ Конфигурация Netlify

Проект уже настроен с `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
```

### Переменные окружения

В Netlify Dashboard добавьте переменные:

```
NEXT_PUBLIC_SIGNUP_URL=https://takedown.co/signup
NEXT_PUBLIC_INSTANT_CHECK_URL=https://takedown.co/#instant-check
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  // опционально
```

## 🔧 Настройки проекта

### ✅ Что уже настроено:

1. **Static Export**: `output: 'export'` в `next.config.js`
2. **Build Command**: `npm run build`
3. **Publish Directory**: `out`
4. **Redirects**: SPA routing настроен
5. **Security Headers**: добавлены в `netlify.toml`

### 📁 Структура после сборки:

```
out/
├── index.html          // Главная страница (квиз)
├── _next/
│   ├── static/
│   └── chunks/
├── api/
│   └── lead/           // API endpoint
└── quiz-*              // Тестовые страницы
```

## 🌐 Домен

После развертывания:
1. Netlify предоставит URL типа `app-name-123.netlify.app`
2. Можно подключить собственный домен через Netlify Dashboard
3. SSL сертификат подключится автоматически

## 🧪 Тестирование

После развертывания проверьте:

- ✅ Главная страница загружается
- ✅ Квиз работает корректно
- ✅ Переходы между шагами работают
- ✅ A/B тестирование: `?ab=hero_b`
- ✅ Мобильная версия адаптивна
- ✅ API endpoint `/api/lead` работает

## 🔥 Быстрое развертывание

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/felor2025/takedown_quiz_2)

## 📊 Аналитика

После развертывания добавьте в Netlify переменные для аналитики:
- `NEXT_PUBLIC_GTM_ID` для Google Tag Manager
- `NEXT_PUBLIC_GA_ID` для Google Analytics

## 🛠️ Локальная проверка сборки

```bash
# Соберите проект
npm run build

# Запустите локальный сервер для тестирования
npx serve out

# Откройте http://localhost:3000
```

## 📝 Заметки

- Проект использует статический экспорт, поэтому серверные функции Next.js недоступны
- API routes конвертируются в serverless functions
- localStorage работает корректно для сохранения прогресса
- Все изображения оптимизированы для статического хостинга

## 🔄 Автообновления

После настройки Git integration в Netlify:
- Каждый push в main/master ветку запускает автосборку
- Deploy previews создаются для PR
- Функция Rollbacks доступна из Dashboard
