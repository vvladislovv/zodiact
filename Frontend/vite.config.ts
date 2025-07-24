import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        // Mock API endpoints for portfolio stats and history
        server.middlewares.use('/user/portfolio/stats', (_req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            totalValue: 10000,
            change: 5.2,
            changePercent: 0.52,
            updatedAt: new Date().toISOString()
          }));
        });
        server.middlewares.use('/user/portfolio/history', (_req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Default to 30 days if query parsing is not directly supported
          let days = 30;
          // Attempt to parse query string if available
          if (_req._parsedUrl && _req._parsedUrl.query) {
            const query = _req._parsedUrl.query;
            const daysMatch = query.match(/days=(\d+)/);
            if (daysMatch && daysMatch[1]) {
              days = parseInt(daysMatch[1], 10);
            }
          }
          const history = Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: 10000 + Math.random() * 1000 - 500
          })).reverse();
          res.end(JSON.stringify(history));
        });
        // Mock API endpoint for user profile
        server.middlewares.use('/user/profile', (_req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Check for X-API-Key header
          const apiKey = _req.headers['x-api-key'];
          if (!apiKey || apiKey !== 'V1') {
            res.statusCode = 403;
            res.end(JSON.stringify({ detail: "Invalid API Key" }));
            return;
          }
          // Get user_id from query parameters
          let userId = 'unknown';
          if (_req._parsedUrl && _req._parsedUrl.query) {
            const query = _req._parsedUrl.query;
            const userIdMatch = query.match(/user_id=(\d+)/);
            if (userIdMatch && userIdMatch[1]) {
              userId = userIdMatch[1];
            }
          }
          res.end(JSON.stringify({
            user_id: userId,
            registrationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
            subscriptionStatus: 'active',
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
        });
        // Mock API endpoint for user subscription
        server.middlewares.use('/user/subscribe', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Simulate receiving a POST request body
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const data = body ? JSON.parse(body) : {};
            const plan = data.plan || 'monthly';
            const daysToAdd = plan === 'monthly' ? 30 : 365;
            res.end(JSON.stringify({
              status: 'success',
              subscriptionEndDate: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()
            }));
          });
        });
        // Mock API endpoint for cards list
        server.middlewares.use('/cards/list', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([
            { name: 'The Fool', positive: 'New beginnings, optimism', negative: 'Recklessness, fearlessness', aiInterpretation: 'A journey of self-discovery awaits.' },
            { name: 'The Magician', positive: 'Skill, creativity', negative: 'Manipulation, poor planning', aiInterpretation: 'Harness your talents for success.' },
            { name: 'The High Priestess', positive: 'Intuition, mystery', negative: 'Secrets, disconnectedness', aiInterpretation: 'Trust your inner voice.' },
            { name: 'The Empress', positive: 'Fertility, abundance', negative: 'Neglect, stagnation' },
            { name: 'The Emperor', positive: 'Authority, structure', negative: 'Rigidity, coldness' }
          ]));
        });
        // Mock API endpoint for card interpretation
        server.middlewares.use('/cards/interpret/', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          const cardName = req.url.split('/').pop() || 'Unknown';
          res.end(JSON.stringify({
            card: cardName,
            interpretation: `This is a detailed AI interpretation of ${cardName} in the context of your question. It suggests deep insights and guidance based on the card's symbolism.`
          }));
        });
        // Mock API endpoint for coffee fortune
        server.middlewares.use('/coffee/fortune', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Simulate receiving a POST request body
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const data = body ? JSON.parse(body) : {};
            const question = data.question || 'What does my future hold?';
            res.end(JSON.stringify({
              interpretation: `Based on the coffee grounds image, the AI interprets: "${question}" with a vision of upcoming changes and opportunities.`
            }));
          });
        });
        // Mock API endpoint for tarot draw
        server.middlewares.use('/tarot/draw', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Simulate receiving a POST request body
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const data = body ? JSON.parse(body) : {};
            const layoutType = data.layoutType || '3_cards';
            const cardsCount = layoutType === '3_cards' ? 3 : 1;
            const cards = [
              { name: 'The Fool', position: 'Past', interpretation: 'A past of new beginnings.' },
              { name: 'The Magician', position: 'Present', interpretation: 'Current skills and creativity.' },
              { name: 'The High Priestess', position: 'Future', interpretation: 'Future guided by intuition.' }
            ].slice(0, cardsCount);
            res.end(JSON.stringify({
              cards: cards,
              overallInterpretation: 'This reading suggests a journey from beginnings to intuitive insights.'
            }));
          });
        });
        // Mock API endpoint for tarot history
        server.middlewares.use('/tarot/history', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          const history = Array.from({ length: 5 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            question: `What does my future hold ${i + 1}?`,
            cards: ['The Fool', 'The Magician', 'The High Priestess'].slice(0, 3),
            interpretation: `Summary of reading ${i + 1}.`
          })).reverse();
          res.end(JSON.stringify(history));
        });
        // Mock API endpoint for AI prompt
        server.middlewares.use('/ai/prompt', (req: any, res: any) => {
          res.setHeader('Content-Type', 'application/json');
          // Simulate receiving a POST request body
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const data = body ? JSON.parse(body) : {};
            const prompt = data.prompt || 'Tell me about my tarot reading.';
            res.end(JSON.stringify({
              response: `AI response to: "${prompt}". This is a detailed interpretation or answer based on the provided context.`
            }));
          });
        });
      }
    }
  ],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/cards': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/coffee': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/tarot': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
})
