const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування підключення до PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mydb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Функція для перевірки підключення до БД
async function connectToDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    // Виконуємо тестовий запит
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📅 Database time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].pg_version);
    
    // Створюємо тестову таблицю якщо не існує
    await client.query(
      'CREATE TABLE IF NOT EXISTS visits (' +
      'id SERIAL PRIMARY KEY, ' +
      'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
      'ip_address VARCHAR(50)' +
      ')'
    );
    console.log('📊 Table "visits" is ready');
    
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message);
  }
}

// Підключаємося до БД при старті
connectToDatabase();

// Основний endpoint
app.get('/', async (req, res) => {
  try {
    // Записуємо візит
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await pool.query('INSERT INTO visits (ip_address) VALUES ($1)', [ip]);
    
    // Отримуємо кількість візитів
    const result = await pool.query('SELECT COUNT(*) as total FROM visits');
    const totalVisits = result.rows[0].total;
    
    res.send(
      '<h1>🚀 Node.js + PostgreSQL App</h1>' +
      '<p>✅ Successfully connected to database!</p>' +
      '<p>📊 Total visits: <strong>' + totalVisits + '</strong></p>' +
      '<p>🕒 Current time: ' + new Date().toLocaleString() + '</p>' +
      '<p>🐳 Running in Docker container</p>'
    );
  } catch (err) {
    res.status(500).send(
      '<h1>❌ Database Error</h1>' +
      '<p>' + err.message + '</p>'
    );
  }
});

// Endpoint для перевірки БД
app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    res.json({
      success: true,
      connected: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      connected: false,
      error: err.message
    });
  }
});

// Endpoint для статистики
app.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total_visits, ' +
      'COUNT(DISTINCT ip_address) as unique_visitors, ' +
      'MAX(timestamp) as last_visit ' +
      'FROM visits'
    );
    res.json({
      success: true,
      stats: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log('🚀 Server is running on port ' + PORT);
  console.log('📍 Environment: ' + (process.env.NODE_ENV || 'development'));
});
