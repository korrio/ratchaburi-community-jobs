const templates = require('../templates/messageTemplates');

class FollowHandler {
  async handleFollow(event, client) {
    const userId = event.source.userId;
    
    try {
      // Get user profile
      const profile = await client.getProfile(userId);
      const displayName = profile.displayName;
      
      // Send welcome message
      const welcomeMessage = templates.createWelcomeMessage(displayName);
      
      await client.replyMessage(event.replyToken, welcomeMessage);
      
      // Log the follow event
      console.log(`User ${displayName} (${userId}) started following the bot`);
      
      // You can add user to database here if needed
      // await this.addUserToDatabase(userId, profile);
      
    } catch (error) {
      console.error('Error handling follow event:', error);
      
      // Send default welcome message if profile fetch fails
      const defaultWelcome = templates.createWelcomeMessage();
      await client.replyMessage(event.replyToken, defaultWelcome);
    }
  }

  async handleUnfollow(event, client) {
    const userId = event.source.userId;
    
    try {
      // Log the unfollow event
      console.log(`User ${userId} unfollowed the bot`);
      
      // You can remove user from database here if needed
      // await this.removeUserFromDatabase(userId);
      
    } catch (error) {
      console.error('Error handling unfollow event:', error);
    }
  }

  async addUserToDatabase(userId, profile) {
    // Implementation for adding user to database
    // This would connect to your backend API to store user information
    try {
      // Example implementation:
      // await apiClient.post('/users', {
      //   line_id: userId,
      //   display_name: profile.displayName,
      //   picture_url: profile.pictureUrl,
      //   status_message: profile.statusMessage
      // });
      
      console.log('User added to database:', userId);
    } catch (error) {
      console.error('Error adding user to database:', error);
    }
  }

  async removeUserFromDatabase(userId) {
    // Implementation for removing user from database
    try {
      // Example implementation:
      // await apiClient.delete(`/users/${userId}`);
      
      console.log('User removed from database:', userId);
    } catch (error) {
      console.error('Error removing user from database:', error);
    }
  }
}

module.exports = new FollowHandler();