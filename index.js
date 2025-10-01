#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Конфигурация Bitrix24
const BITRIX_CONFIG = {
  domain: process.env.BITRIX_DOMAIN || 'crm.keyf1.space',
  accessToken: process.env.BITRIX_ACCESS_TOKEN || '2fv141bezst3ancq',
  userId: process.env.BITRIX_USER_ID || '27',
  webhookUrl: process.env.BITRIX_WEBHOOK_URL || 'https://crm.keyf1.space/rest/27/2fv141bezst3ancq/'
};

// Обработчик для входящих webhook от Bitrix24
app.post('/bitrix-webhook', async (req, res) => {
  console.log('📥 Получен webhook от Bitrix24:');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Проверяем различные варианты токенов авторизации
    const authToken = req.body?.auth?.application_token || 
                     req.body?.auth?.access_token ||
                     req.headers?.authorization?.replace('Bearer ', '') ||
                     req.body?.token;
    
    console.log('🔑 Токен авторизации:', authToken ? 'Найден' : 'Отсутствует');
    
    // Временно отключаем проверку токена для тестирования
    if (!authToken) {
      console.log('⚠️ Отсутствует токен авторизации, но продолжаем обработку для тестирования');
    }
    
    // Обрабатываем данные
    const data = req.body?.data;
    if (data) {
      console.log('📊 Данные события:', data);
      
      // Здесь можно добавить логику обработки
      // Например, создание БП, отправка уведомлений и т.д.
    }
    
    // Отвечаем Bitrix24
    res.json({ 
      result: 'OK',
      message: 'Webhook обработан успешно',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Ошибка обработки webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API для создания БП через MCP
app.post('/api/create-bp', async (req, res) => {
  try {
    console.log('🚀 Создание БП через API...');
    
    const { name, description, documentType, template } = req.body;
    
    if (!name || !description || !documentType || !template) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, description, documentType, template' 
      });
    }
    
    // Создаем БП через Bitrix24 API
    const response = await axios.post(`${BITRIX_CONFIG.webhookUrl}bizproc.workflow.template.add`, {
      name,
      description,
      documentType,
      template,
      autoExecute: 'N'
    });
    
    console.log('✅ БП создан:', response.data);
    res.json({ 
      success: true, 
      result: response.data,
      message: `БП "${name}" успешно создан`
    });
    
  } catch (error) {
    console.error('❌ Ошибка создания БП:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create BP',
      details: error.response?.data || error.message
    });
  }
});

// API для получения шаблонов БП
app.get('/api/bp-templates', async (req, res) => {
  try {
    console.log('📋 Получение шаблонов БП...');
    
    const response = await axios.post(`${BITRIX_CONFIG.webhookUrl}bizproc.workflow.template.list`, {
      select: ['ID', 'NAME', 'DESCRIPTION', 'DOCUMENT_TYPE']
    });
    
    res.json({ 
      success: true, 
      result: response.data 
    });
    
  } catch (error) {
    console.error('❌ Ошибка получения БП:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get BP templates',
      details: error.response?.data || error.message
    });
  }
});

// Обработчик для проверки работоспособности
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Bitrix24 Webhook Handler работает',
    config: {
      domain: BITRIX_CONFIG.domain,
      userId: BITRIX_CONFIG.userId
    }
  });
});

// Обработка POST запросов на корневой путь (для Bitrix24)
app.post('/', async (req, res) => {
  console.log('📥 Получен POST запрос на корневой путь от Bitrix24:');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Проверяем различные варианты токенов авторизации
    const authToken = req.body?.auth?.application_token || 
                     req.body?.auth?.access_token ||
                     req.headers?.authorization?.replace('Bearer ', '') ||
                     req.body?.token;
    
    console.log('🔑 Токен авторизации:', authToken ? 'Найден' : 'Отсутствует');
    
    // Временно отключаем проверку токена для тестирования
    if (!authToken) {
      console.log('⚠️ Отсутствует токен авторизации, но продолжаем обработку для тестирования');
    }
    
    // Обрабатываем данные
    const data = req.body?.data;
    if (data) {
      console.log('📊 Данные события:', data);
      
      // Здесь можно добавить логику обработки
      // Например, создание БП, отправка уведомлений и т.д.
    }
    
    // Отвечаем Bitrix24
    res.json({ 
      result: 'OK',
      message: 'Webhook обработан успешно',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Ошибка обработки webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Главная страница
app.get('/', (req, res) => {
  res.json({
    name: 'Bitrix24 Webhook Handler',
    version: '1.0.0',
    description: 'Обработчик webhook для Bitrix24 с поддержкой создания БП',
    endpoints: {
      'POST /': 'Входящий webhook от Bitrix24 (корневой путь)',
      'POST /bitrix-webhook': 'Входящий webhook от Bitrix24',
      'POST /api/create-bp': 'Создание БП через API',
      'GET /api/bp-templates': 'Получение шаблонов БП',
      'GET /health': 'Проверка работоспособности'
    },
    github: 'https://github.com/your-username/bitrix-webhook-handler'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Bitrix24 Webhook Handler запущен на порту ${PORT}`);
  console.log(`📡 URL для Bitrix24: https://your-app.vercel.app/bitrix-webhook`);
  console.log(`🔍 Проверка: https://your-app.vercel.app/health`);
  console.log(`📊 API: https://your-app.vercel.app/api/bp-templates`);
});

export default app;
