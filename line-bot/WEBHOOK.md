# LINE Bot Webhook Configuration

## Webhook URLs

### Development/Testing
- **Local**: `http://localhost:4000/webhook`
- **With ngrok**: `https://your-subdomain.ngrok.io/webhook`
- **Test endpoint**: `http://localhost:4000/webhook/test` (no signature validation)

### Production
- **Heroku**: `https://your-app-name.herokuapp.com/webhook`
- **Railway**: `https://your-app-name.railway.app/webhook`
- **Custom domain**: `https://your-domain.com/webhook`

## Setup Instructions

### 1. Create LINE Channel
1. Go to [LINE Developer Console](https://developers.line.biz/)
2. Create a new provider (if needed)
3. Create a new Messaging API channel
4. Note down the Channel Secret and Channel Access Token

### 2. Configure Environment Variables
```bash
# In line-bot/.env
LINE_CHANNEL_ACCESS_TOKEN=your-channel-access-token
LINE_CHANNEL_SECRET=your-channel-secret
```

### 3. Expose Local Server (Development)
```bash
# Option 1: Using ngrok
ngrok http 4000

# Option 2: Using localtunnel
lt --port 4000 --subdomain ratchaburi-jobs
```

### 4. Configure Webhook in LINE Console
1. Go to your channel in LINE Developer Console
2. Navigate to **Messaging API** tab
3. Set **Webhook URL** to your public URL
4. Enable **Use webhook**
5. Click **Verify** to test the webhook

### 5. Test the Webhook

#### Test without signature (development only):
```bash
curl -X POST http://localhost:4000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'
```

#### Test with LINE signature (production):
The webhook will automatically receive requests from LINE when:
- Users send messages to your bot
- Users follow/unfollow your bot
- Users click on rich menu items
- Users interact with postback buttons

## Webhook Events

The bot handles these LINE webhook events:

### Message Events
- **Text messages**: User sends text to the bot
- **Postback**: User clicks buttons or rich menu items
- **Follow**: User adds the bot as a friend
- **Unfollow**: User blocks or removes the bot

### Event Structure
```json
{
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "text": "Hello"
      },
      "source": {
        "type": "user",
        "userId": "U1234567890"
      },
      "timestamp": 1234567890123,
      "replyToken": "reply-token-here"
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **SignatureValidationFailed**: 
   - Check that LINE_CHANNEL_SECRET is correct
   - Ensure webhook URL is accessible from internet
   - Use test endpoint for development testing

2. **401 Unauthorized**:
   - Verify LINE_CHANNEL_ACCESS_TOKEN is correct
   - Check token permissions in LINE console

3. **Webhook verification failed**:
   - Ensure server is running and accessible
   - Check firewall/proxy settings
   - Verify SSL certificate (for HTTPS URLs)

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=line-bot:* npm start
```

### Health Check
Check if the bot is running:
```bash
curl http://localhost:4000/health
```

## Security Notes

- **Never commit** your LINE credentials to version control
- **Use HTTPS** in production
- **Validate signatures** on all webhook requests
- **Rate limit** your webhook endpoint
- **Monitor** webhook traffic for suspicious activity

## LINE Bot Features

### Rich Menu
- 2500x1686 pixels image
- 6 clickable areas (2x3 grid)
- Supports JPG and PNG formats
- Max file size: 1MB

### Supported Message Types
- Text messages
- Flex messages (cards, carousels)
- Quick replies
- Postback actions
- Rich menu interactions

### Rate Limits
- Push messages: 500 per month (free tier)
- Reply messages: Unlimited
- Rich menu: Up to 1000 per bot

## Resources

- [LINE Messaging API Documentation](https://developers.line.biz/en/reference/messaging-api/)
- [LINE Bot SDK for Node.js](https://github.com/line/line-bot-sdk-nodejs)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)
- [Rich Menu Creator](https://developers.line.biz/console/)