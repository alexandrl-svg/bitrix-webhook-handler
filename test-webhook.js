#!/usr/bin/env node

import axios from 'axios';

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-app.vercel.app';

async function testWebhook() {
  console.log('🧪 Тестирование webhook...');
  console.log(`📡 URL: ${WEBHOOK_URL}`);

  try {
    // 1. Проверяем health
    console.log('\n📤 1. Проверка health...');
    const healthResponse = await axios.get(`${WEBHOOK_URL}/health`);
    console.log('📥 Health:', JSON.stringify(healthResponse.data, null, 2));

    // 2. Получаем шаблоны БП
    console.log('\n📤 2. Получение шаблонов БП...');
    const templatesResponse = await axios.get(`${WEBHOOK_URL}/api/bp-templates`);
    console.log('📥 Templates:', JSON.stringify(templatesResponse.data, null, 2));

    // 3. Тестируем создание БП
    console.log('\n📤 3. Тестирование создания БП...');
    const createBpResponse = await axios.post(`${WEBHOOK_URL}/api/create-bp`, {
      name: 'Тестовый БП из GitHub',
      description: 'БП создан через GitHub приложение',
      documentType: ['crm', 'deal'],
      template: [{
        "Type": "SequentialWorkflowActivity",
        "Name": "Template",
        "Activated": "Y",
        "Properties": {
          "Title": "Тестовый процесс"
        },
        "Children": []
      }]
    });
    console.log('📥 Create BP:', JSON.stringify(createBpResponse.data, null, 2));

    console.log('\n✅ Все тесты прошли успешно!');
    console.log(`🎯 Webhook готов к использованию: ${WEBHOOK_URL}/bitrix-webhook`);

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.response?.data || error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Возможные решения:');
      console.log('1. Убедитесь, что приложение развернуто');
      console.log('2. Проверьте URL в переменной WEBHOOK_URL');
      console.log('3. Дождитесь завершения деплоя (может занять несколько минут)');
    }
  }
}

// Запуск тестов
if (process.argv[2]) {
  process.env.WEBHOOK_URL = process.argv[2];
}

testWebhook().catch(console.error);
