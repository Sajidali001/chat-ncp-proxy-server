const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('.'));

// In-memory storage for API keys and rate limits (in production, use a database)
const clientApiKeys = new Map();
const clientRateLimits = new Map(); // Store rate limits for each client
const clientUsage = new Map(); // Store usage statistics for each client

// Rate limiting data structure
const rateLimitData = new Map(); // Store timestamps of requests for each client

// Middleware to authenticate clients
const authenticateClient = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const clientApiKey = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!clientApiKey) {
    return res.status(401).json({ error: 'Access denied. No API key provided.' });
  }

  // Check if the client API key exists
  if (!clientApiKeys.has(clientApiKey)) {
    return res.status(403).json({ error: 'Invalid API key.' });
  }

  // Attach client info to request
  req.clientId = clientApiKeys.get(clientApiKey);
  req.clientApiKey = clientApiKey;
  next();
};

// Rate limiting middleware
const rateLimitMiddleware = (req, res, next) => {
  const clientApiKey = req.clientApiKey;
  const now = Date.now();
  const limits = clientRateLimits.get(clientApiKey) || { perMinute: 10, perDay: 1000 };
  
  // Initialize rate limit data for this client if not exists
  if (!rateLimitData.has(clientApiKey)) {
    rateLimitData.set(clientApiKey, {
      minuteRequests: [],
      dayRequests: []
    });
  }
  
  const clientData = rateLimitData.get(clientApiKey);
  
  // Filter requests within the current minute and day
  const oneMinuteAgo = now - 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  
  clientData.minuteRequests = clientData.minuteRequests.filter(timestamp => timestamp > oneMinuteAgo);
  clientData.dayRequests = clientData.dayRequests.filter(timestamp => timestamp > oneDayAgo);
  
  // Check minute limit
  if (clientData.minuteRequests.length >= limits.perMinute) {
    return res.status(429).json({
      error: `Rate limit exceeded. Maximum ${limits.perMinute} requests per minute allowed.`
    });
  }
  
  // Check day limit
  if (clientData.dayRequests.length >= limits.perDay) {
    return res.status(429).json({
      error: `Rate limit exceeded. Maximum ${limits.perDay} requests per day allowed.`
    });
  }
  
  // Add current request to tracking
  clientData.minuteRequests.push(now);
  clientData.dayRequests.push(now);
  
  next();
};

// Endpoint to register a new client (admin only)
app.post('/admin/register-client', (req, res) => {
  const { adminKey, clientName, clientApiKey, rateLimits } = req.body;
  
  // In a real implementation, you would have a proper admin authentication
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Access denied. Invalid admin key.' });
  }
  
  if (!clientName || !clientApiKey) {
    return res.status(400).json({ error: 'Client name and API key are required.' });
  }
  
  // Check if client API key already exists
  if (clientApiKeys.has(clientApiKey)) {
    return res.status(409).json({ 
      error: `Client with API key ${clientApiKey} already exists.`,
      existingClient: clientApiKeys.get(clientApiKey)
    });
  }
  
  // Store the client API key
  clientApiKeys.set(clientApiKey, clientName);
  
  // Store rate limits (default to 10 per minute, 1000 per day if not specified)
  const limits = rateLimits || { perMinute: 10, perDay: 1000 };
  clientRateLimits.set(clientApiKey, limits);
  
  // Initialize usage statistics
  clientUsage.set(clientApiKey, {
    name: clientName,
    requests: 0,
    lastRequest: null,
    rateLimits: limits
  });
  
  res.status(201).json({ 
    message: `Client ${clientName} registered successfully.`,
    clientApiKey: clientApiKey,
    rateLimits: limits
  });
});

// Get client statistics (admin only)
app.get('/admin/client-stats', (req, res) => {
  const { adminKey } = req.query;
  
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Access denied. Invalid admin key.' });
  }
  
  const stats = [];
  for (const [apiKey, name] of clientApiKeys) {
    const usage = clientUsage.get(apiKey);
    const limits = clientRateLimits.get(apiKey);
    const rateData = rateLimitData.get(apiKey);
    
    stats.push({
      name,
      apiKey,
      usage: usage ? usage.requests : 0,
      lastRequest: usage ? usage.lastRequest : null,
      rateLimits: limits,
      currentMinuteRequests: rateData ? rateData.minuteRequests.length : 0,
      currentDayRequests: rateData ? rateData.dayRequests.length : 0
    });
  }
  
  res.status(200).json({ clients: stats });
});

// Get client's own statistics
app.get('/client/stats', authenticateClient, (req, res) => {
  const apiKey = req.clientApiKey;
  const name = clientApiKeys.get(apiKey);
  const usage = clientUsage.get(apiKey);
  const limits = clientRateLimits.get(apiKey);
  const rateData = rateLimitData.get(apiKey);
  
  const stats = {
    name,
    apiKey,
    usage: usage ? usage.requests : 0,
    lastRequest: usage ? usage.lastRequest : null,
    rateLimits: limits,
    currentMinuteRequests: rateData ? rateData.minuteRequests.length : 0,
    currentDayRequests: rateData ? rateData.dayRequests.length : 0
  };
  
  res.status(200).json(stats);
});

// Endpoint to delete a client (admin only)
app.delete('/admin/client/:clientApiKey', (req, res) => {
  const { adminKey } = req.query;
  const { clientApiKey } = req.params;
  
  // In a real implementation, you would have a proper admin authentication
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Access denied. Invalid admin key.' });
  }
  
  // Check if client exists
  if (!clientApiKeys.has(clientApiKey)) {
    return res.status(404).json({ error: 'Client not found.' });
  }
  
  // Get client name for response
  const clientName = clientApiKeys.get(clientApiKey);
  
  // Delete client data from all collections
  clientApiKeys.delete(clientApiKey);
  clientRateLimits.delete(clientApiKey);
  clientUsage.delete(clientApiKey);
  rateLimitData.delete(clientApiKey);
  
  res.status(200).json({ 
    message: `Client ${clientName} deleted successfully.`
  });
});

// Serve client portal
app.get('/client-portal', (req, res) => {
  res.sendFile(__dirname + '/client-portal.html');
});

// Generic proxy endpoint - forwards requests to upstream API
app.use('/v1/*', authenticateClient, rateLimitMiddleware, async (req, res) => {
  try {
    // Increment usage counter
    const usage = clientUsage.get(req.clientApiKey);
    if (usage) {
      usage.requests += 1;
      usage.lastRequest = Date.now();
    }
    
    // Extract the endpoint path
    const endpoint = req.params[0];
    const method = req.method;
    
    // Forward the request to upstream API
    const response = await axios({
      method: method,
      url: `${process.env.A4F_BASE_URL.replace('/chat/completions', '')}/${endpoint}`,
      data: req.body,
      headers: {
        'Authorization': `Bearer ${process.env.A4F_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: req.query,
      // For image data and streaming, we need to handle it appropriately
      responseType: (endpoint.startsWith('images/serve/') || endpoint.includes('audio') || endpoint.includes('tts')) ? 'stream' : 'json'
    });
    
    // Handle image serving endpoint specially
    if (endpoint.startsWith('images/serve/')) {
      // Stream the image data directly to the client
      res.status(response.status);
      
      // Copy relevant headers from upstream API response but exclude conflicting headers
      Object.keys(response.headers).forEach(header => {
        // Skip headers that can cause conflicts
        if (header.toLowerCase() !== 'content-length' && 
            header.toLowerCase() !== 'transfer-encoding') {
          res.setHeader(header, response.headers[header]);
        }
      });
      
      // Pipe the image stream to the response
      response.data.pipe(res);
      return;
    }
    
    // Handle JSON responses (including image generation responses)
    if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
      let responseData = response.data;
      
      // If this is an image generation response, we need to modify the URLs
      if (endpoint === 'images/generations' && responseData.data) {
        // Transform upstream API URLs to our proxy URLs
        const transformedData = {
          ...responseData,
          data: responseData.data.map(item => {
            if (item.url && item.url.startsWith('https://api.')) {
              // Extract the image ID from the upstream API URL
              const imageId = item.url.split('/').pop();
              // Replace with our proxy URL
              return {
                ...item,
                url: `http://192.168.1.249:7000/v1/images/serve/${imageId}`
              };
            }
            return item;
          })
        };
        res.status(response.status).json(transformedData);
      } else {
        res.status(response.status).json(responseData);
      }
    } else {
      // For other response types, stream them
      res.status(response.status);
      
      // Copy relevant headers from upstream API response but exclude conflicting headers
      Object.keys(response.headers).forEach(header => {
        // Skip headers that can cause conflicts
        if (header.toLowerCase() !== 'content-length' && 
            header.toLowerCase() !== 'transfer-encoding') {
          res.setHeader(header, response.headers[header]);
        }
      });
      
      // Pipe the response data to the client
      response.data.pipe(res);
    }
    
  } catch (error) {
    console.error(`Error forwarding request to the upstream API: ${error.message}`);
    
    if (error.response) {
      // Forward the error response from upstream API but hide original URLs
      const errorData = error.response.data;
      
      // Remove any URLs or references to the original API
      if (errorData.error && typeof errorData.error === 'object') {
        // Create a clean error message without URLs
        const cleanErrorMessage = errorData.error.message 
          ? errorData.error.message.replace(/https?:\/\/[^\s]+/g, 'the service')
          : 'Request failed';
        
        res.status(error.response.status).json({
          error: {
            message: cleanErrorMessage,
            type: errorData.error.type || 'api_error',
            code: errorData.error.code || 'api_error'
          }
        });
      } else if (typeof errorData.error === 'string') {
        // Handle string error messages
        const cleanErrorMessage = errorData.error.replace(/https?:\/\/[^\s]+/g, 'the service');
        res.status(error.response.status).json({
          error: cleanErrorMessage
        });
      } else {
        // Generic error response
        res.status(error.response.status).json({
          error: 'Request failed'
        });
      }
    } else {
      // Handle network or other errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Proxy server is running' });
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chat NCP Proxy Server is running on port ${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});