const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import handlers
const messageHandler = require('./handlers/messageHandler');
const postbackHandler = require('./handlers/postbackHandler');
const followHandler = require('./handlers/followHandler');
const notificationService = require('./utils/notificationService');

// LINE Bot configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// Initialize LINE client
const client = new line.Client(config);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'LINE Bot'
  });
});

// LINE webhook endpoint
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Error handling webhook:', err);
      res.status(500).end();
    });
});

// Event handler
async function handleEvent(event) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    switch (event.type) {
      case 'message':
        if (event.message.type === 'text') {
          return messageHandler.handleTextMessage(event, client);
        }
        break;
      
      case 'postback':
        return postbackHandler.handlePostback(event, client);
      
      case 'follow':
        return followHandler.handleFollow(event, client);
      
      case 'unfollow':
        return followHandler.handleUnfollow(event, client);
      
      default:
        console.log('Unknown event type:', event.type);
        return Promise.resolve(null);
    }
  } catch (error) {
    console.error('Error handling event:', error);
    return Promise.resolve(null);
  }
}

// Rich Menu setup
async function setupRichMenu() {
  try {
    // Clean up existing rich menus
    try {
      const richMenus = await client.getRichMenuList();
      for (const menu of richMenus) {
        await client.deleteRichMenu(menu.richMenuId);
        console.log('Deleted existing rich menu:', menu.richMenuId);
      }
    } catch (cleanupError) {
      console.log('No existing rich menus to clean up');
    }

    const richMenuObject = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: false,
      name: 'Ratchaburi Community Jobs Menu',
      chatBarText: 'เมนูหลัก',
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=search_providers'
          }
        },
        {
          bounds: {
            x: 833,
            y: 0,
            width: 834,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=search_jobs'
          }
        },
        {
          bounds: {
            x: 1667,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=auto_match'
          }
        },
        {
          bounds: {
            x: 0,
            y: 843,
            width: 833,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=register_provider'
          }
        },
        {
          bounds: {
            x: 833,
            y: 843,
            width: 834,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=register_customer'
          }
        },
        {
          bounds: {
            x: 1667,
            y: 843,
            width: 833,
            height: 843
          },
          action: {
            type: 'postback',
            data: 'action=help'
          }
        }
      ]
    };

    // Create rich menu
    const richMenuId = await client.createRichMenu(richMenuObject);
    console.log('Rich menu created with ID:', richMenuId);

    // Upload rich menu image
    const imagePath = path.join(__dirname, 'public', 'richmenu.jpg');
    
    // Check if image exists
    if (fs.existsSync(imagePath)) {
      try {
        const imageBuffer = fs.readFileSync(imagePath);
        await client.setRichMenuImage(richMenuId, imageBuffer);
        console.log('Rich menu image uploaded');
      } catch (uploadError) {
        console.error('Error uploading rich menu image:', uploadError.message);
        // Try with PNG if JPG fails
        const pngPath = path.join(__dirname, 'public', 'richmenu.png');
        if (fs.existsSync(pngPath)) {
          const pngBuffer = fs.readFileSync(pngPath);
          await client.setRichMenuImage(richMenuId, pngBuffer);
          console.log('Rich menu image uploaded (PNG)');
        }
      }
    } else {
      console.log('Rich menu image not found at:', imagePath);
      console.log('Please add richmenu.jpg or richmenu.png (2500x1686) to the public directory');
    }

    // Set as default rich menu
    await client.setDefaultRichMenu(richMenuId);
    console.log('Rich menu set as default');

  } catch (error) {
    console.error('Error setting up rich menu:', error);
  }
}

// Schedule notifications (run every hour)
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled notification check...');
  notificationService.checkAndSendNotifications(client);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🤖 LINE Bot server running on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  
  // Setup rich menu on startup
  await setupRichMenu();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;