const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy configuration
const proxyOptions = {
  target: 'http://localhost:3000', // Target server
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: { '^/api': '/data' }, // Rewrite path from /api to /data
  logLevel: 'debug',
};

// Apply proxy middleware for different endpoint paths
app.use('/api', createProxyMiddleware(proxyOptions));

// Error handling for the proxy server
app.use((err, req, res, next) => {
  console.error('Proxy error:', err);
  res.status(500).send('Something went wrong.');
});

// Start the Express server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
