const express = require('express');
const app = express();

app.get('/user/portfolio/stats', (req, res) => {
  res.json({
    totalValue: 10000,
    change: 5.2,
    changePercent: 0.52,
    updatedAt: new Date().toISOString()
  });
});

app.get('/user/portfolio/history', (req, res) => {
  const days = req.query.days || 30;
  const history = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 10000 + Math.random() * 1000 - 500
  })).reverse();
  res.json(history);
});

module.exports = app;
