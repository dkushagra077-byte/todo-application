const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Todo Backend Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
