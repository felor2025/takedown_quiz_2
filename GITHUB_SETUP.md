# 🔗 Настройка GitHub и загрузка кода

## ❌ Проблема с доступом

Обнаружена ошибка доступа к репозиторию:
```
remote: Permission to felor2025/takedown_quiz_2.git denied to Centozir.
```

## ✅ Решения

### Вариант 1: Получить права доступа
1. Свяжитесь с владельцем аккаунта `felor2025`
2. Попросите добавить вас как collaborator в репозиторий
3. После получения доступа выполните:
   ```bash
   git push -u origin master
   ```

### Вариант 2: Создать новый репозиторий
1. Зайдите на [github.com](https://github.com)
2. Создайте новый репозиторий `takedown_quiz_2`
3. Скопируйте URL нового репозитория
4. В терминале выполните:
   ```bash
   cd /Users/pavelshuklin/take_quiz
   git remote set-url origin https://github.com/ВАШ_АККАУНТ/takedown_quiz_2.git
   git push -u origin master
   ```

### Вариант 3: Использовать токен доступа (если есть права)
1. Создайте Personal Access Token в GitHub Settings
2. Используйте его вместо пароля:
   ```bash
   git push -u origin master
   # Введите username: felor2025
   # Введите password: ВАШ_ТОКЕН
   ```

## 📦 Что уже готово

Проект полностью подготовлен:
- ✅ Git репозиторий инициализирован
- ✅ Все файлы добавлены и закоммичены
- ✅ Настроена конфигурация для Netlify
- ✅ Главная страница теперь квиз (was `/quiz`, now `/`)
- ✅ Статический экспорт настроен

## 🚀 После загрузки в GitHub

1. Подключите репозиторий к Netlify
2. Deploy произойдет автоматически
3. Получите URL для тестирования

## 📋 Текущий статус

```bash
# В директории проекта уже выполнено:
git init ✅
git add -A ✅  
git commit -m "Initial commit..." ✅
git remote add origin https://github.com/felor2025/takedown_quiz_2.git ✅

# Осталось:
git push -u origin master ❌ (нужны права доступа)
```

## 🔧 Альтернативная загрузка

Если не получается через git, можно:
1. Создать zip архив проекта
2. Загрузить в Netlify через web-интерфейс
3. Указать build command: `npm run build`
4. Указать publish directory: `out`
