const apiClient = require('./apiClient');

class NotificationService {
  async checkAndSendNotifications(lineClient) {
    try {
      // Check for new matches that need notification
      await this.notifyNewMatches(lineClient);
      
      // Check for match status updates
      await this.notifyMatchUpdates(lineClient);
      
      // Check for pending matches that need follow-up
      await this.notifyPendingMatches(lineClient);
      
      console.log('Notification check completed');
    } catch (error) {
      console.error('Error in notification service:', error);
    }
  }

  async notifyNewMatches(lineClient) {
    try {
      // Get recent matches (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const response = await apiClient.get('/matches', {
        params: {
          status: 'pending',
          limit: 50
        }
      });

      const matches = response.data.data || [];
      const recentMatches = matches.filter(match => 
        new Date(match.match_date) > new Date(oneHourAgo)
      );

      for (const match of recentMatches) {
        await this.sendNewMatchNotification(lineClient, match);
      }
    } catch (error) {
      console.error('Error notifying new matches:', error);
    }
  }

  async notifyMatchUpdates(lineClient) {
    try {
      // Get recently updated matches
      const response = await apiClient.get('/matches', {
        params: {
          limit: 50
        }
      });

      const matches = response.data.data || [];
      const updatedMatches = matches.filter(match => 
        match.response_date && 
        new Date(match.response_date) > new Date(Date.now() - 60 * 60 * 1000)
      );

      for (const match of updatedMatches) {
        await this.sendMatchUpdateNotification(lineClient, match);
      }
    } catch (error) {
      console.error('Error notifying match updates:', error);
    }
  }

  async notifyPendingMatches(lineClient) {
    try {
      // Get matches pending for more than 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const response = await apiClient.get('/matches', {
        params: {
          status: 'pending',
          limit: 50
        }
      });

      const matches = response.data.data || [];
      const oldPendingMatches = matches.filter(match => 
        new Date(match.match_date) < new Date(oneDayAgo)
      );

      for (const match of oldPendingMatches) {
        await this.sendPendingMatchReminder(lineClient, match);
      }
    } catch (error) {
      console.error('Error notifying pending matches:', error);
    }
  }

  async sendNewMatchNotification(lineClient, match) {
    // In a real implementation, you would have user LINE IDs stored
    // For now, we'll just log the notification
    console.log(`New match notification: ${match.provider_name} <-> ${match.customer_name}`);
    
    // Example notification message
    const message = {
      type: 'flex',
      altText: 'มีการจับคู่งานใหม่',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🎉 มีการจับคู่งานใหม่!',
              weight: 'bold',
              size: 'lg',
              color: '#0ea5e9'
            },
            {
              type: 'separator',
              margin: 'md'
            },
            {
              type: 'text',
              text: `👨‍💼 ผู้ให้บริการ: ${match.provider_name}`,
              size: 'sm',
              margin: 'md'
            },
            {
              type: 'text',
              text: `🏠 ผู้ต้องการจ้าง: ${match.customer_name}`,
              size: 'sm',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `🎯 ความแม่นยำ: ${Math.round(match.match_score * 100)}%`,
              size: 'sm',
              margin: 'xs'
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              height: 'sm',
              color: '#0ea5e9',
              action: {
                type: 'postback',
                label: 'ดูรายละเอียด',
                data: `action=view_match&id=${match.id}`
              }
            }
          ]
        }
      }
    };

    // In a real implementation, you would send to specific users
    // await lineClient.pushMessage(userLineId, message);
  }

  async sendMatchUpdateNotification(lineClient, match) {
    console.log(`Match update notification: Match ${match.id} status changed to ${match.status}`);
    
    // Implementation for match status update notifications
    // Similar to sendNewMatchNotification but for status changes
  }

  async sendPendingMatchReminder(lineClient, match) {
    console.log(`Pending match reminder: Match ${match.id} has been pending for over 24 hours`);
    
    // Implementation for pending match reminders
    // Send reminder to both provider and customer
  }

  async sendDailySummary(lineClient) {
    try {
      // Get daily statistics
      const statsResponse = await apiClient.get('/matches/stats');
      const stats = statsResponse.data.data;

      const summaryMessage = {
        type: 'flex',
        altText: 'สรุปรายวัน',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '📊 สรุปรายวัน',
                weight: 'bold',
                size: 'xl',
                color: '#0ea5e9'
              },
              {
                type: 'separator',
                margin: 'md'
              },
              {
                type: 'text',
                text: `📈 การจับคู่งานทั้งหมด: ${stats.total_matches}`,
                size: 'sm',
                margin: 'md'
              },
              {
                type: 'text',
                text: `✅ งานสำเร็จ: ${stats.completed_matches}`,
                size: 'sm',
                margin: 'xs'
              },
              {
                type: 'text',
                text: `⏳ รอการตอบกลับ: ${stats.pending_matches}`,
                size: 'sm',
                margin: 'xs'
              },
              {
                type: 'text',
                text: `⭐ คะแนนเฉลี่ย: ${stats.avg_rating.toFixed(1)}/5`,
                size: 'sm',
                margin: 'xs'
              }
            ]
          }
        }
      };

      // Send to admin users or broadcast to all users
      // await lineClient.broadcast(summaryMessage);
      
      console.log('Daily summary prepared');
    } catch (error) {
      console.error('Error sending daily summary:', error);
    }
  }
}

module.exports = new NotificationService();