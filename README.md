# Bitrix24 Webhook Handler

Bitrix24 Webhook Handler для создания БП через MCP

## 🚀 Автоматическое развертывание

Этот проект автоматически развернут на Vercel и готов к использованию с Bitrix24.

### 🔗 Webhook URL
После развертывания ваш webhook будет доступен по адресу:
`https://your-app.vercel.app/bitrix-webhook`

### 🧪 Тестирование

```bash
# Установите зависимости
npm install

# Запустите локально
npm start

# Протестируйте webhook
node test-webhook.js
```

### 📁 Структура проекта

- `index.js` - Основной сервер Express
- `package.json` - Зависимости Node.js
- `vercel.json` - Конфигурация для Vercel
- `test-webhook.js` - Скрипт для тестирования webhook
- `.devcontainer/` - Конфигурация для GitHub Codespaces

### 🔧 Настройка Bitrix24

1. Перейдите в ваш Bitrix24: https://crm.keyf1.space/
2. **Приложения** → **Разработчикам** → **Создать приложение**
3. **Тип**: Веб-приложение
4. **URL обработчика**: `https://your-app.vercel.app/bitrix-webhook`
5. **Права доступа**:
   - ✅ bizproc (Бизнес-процессы)
   - ✅ crm (CRM)
   - ✅ entity (Сущности)
   - ✅ user (Пользователи)

### 🎯 После настройки

Ваш MCP сервер сможет создавать и управлять бизнес-процессами в Bitrix24!

## 📄 Лицензия

MIT License
