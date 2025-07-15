const messageHandler = require('./messageHandler');
const templates = require('../templates/messageTemplates');
const apiClient = require('../utils/apiClient');

class PostbackHandler {
  async handlePostback(event, client) {
    const userId = event.source.userId;
    const postbackData = event.postback.data;
    
    // Parse postback data
    const params = new URLSearchParams(postbackData);
    const action = params.get('action');
    const id = params.get('id');
    const type = params.get('type');

    console.log('Postback received:', { action, id, type });

    switch (action) {
      case 'search_providers':
        return messageHandler.searchProviders(client, userId);
      
      case 'search_jobs':
        return messageHandler.searchJobs(client, userId);
      
      case 'auto_match':
        return messageHandler.autoMatch(client, userId);
      
      case 'register_provider':
        return messageHandler.registerProvider(client, userId);
      
      case 'register_customer':
        return messageHandler.registerCustomer(client, userId);
      
      case 'help':
        return messageHandler.sendHelpMessage(client, userId);
      
      case 'view_provider':
        return this.viewProviderDetail(client, userId, id);
      
      case 'view_customer':
        return this.viewCustomerDetail(client, userId, id);
      
      case 'view_match':
        return this.viewMatchDetail(client, userId, id);
      
      case 'contact_provider':
        return this.contactProvider(client, userId, id);
      
      case 'contact_customer':
        return this.contactCustomer(client, userId, id);
      
      case 'filter_category':
        return this.filterByCategory(client, userId, id, type);
      
      case 'filter_location':
        return this.filterByLocation(client, userId, params.get('district'), params.get('subdistrict'));
      
      case 'show_categories':
        return this.showCategories(client, userId);
      
      case 'show_locations':
        return this.showLocations(client, userId);
      
      default:
        return this.handleUnknownPostback(client, userId);
    }
  }

  async viewProviderDetail(client, userId, providerId) {
    try {
      const response = await apiClient.get(`/providers/${providerId}`);
      const provider = response.data.data;
      
      const detailMessage = templates.createProviderDetail(provider);
      return client.replyToken(userId, detailMessage);
      
    } catch (error) {
      console.error('Error fetching provider detail:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดผู้ให้บริการได้'
      });
    }
  }

  async viewCustomerDetail(client, userId, customerId) {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      const customer = response.data.data;
      
      const detailMessage = templates.createCustomerDetail(customer);
      return client.replyToken(userId, detailMessage);
      
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดงานได้'
      });
    }
  }

  async viewMatchDetail(client, userId, matchId) {
    try {
      const response = await apiClient.get(`/matches/${matchId}`);
      const match = response.data.data;
      
      const detailMessage = templates.createMatchDetail(match);
      return client.replyToken(userId, detailMessage);
      
    } catch (error) {
      console.error('Error fetching match detail:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดการจับคู่งานได้'
      });
    }
  }

  async contactProvider(client, userId, providerId) {
    try {
      const response = await apiClient.get(`/providers/${providerId}`);
      const provider = response.data.data;
      
      const contactMessage = {
        type: 'text',
        text: `📞 ติดต่อ ${provider.name}\n\n` +
              `📱 โทรศัพท์: ${provider.phone}\n` +
              `${provider.line_id ? `💬 LINE: ${provider.line_id}\n` : ''}` +
              `📍 ที่อยู่: ${provider.location}\n` +
              `🏘️ พื้นที่: ${provider.subdistrict}, ${provider.district}\n\n` +
              `💰 ราคา: ${provider.price_range || 'ติดต่อสอบถาม'}\n` +
              `⏰ เวลาทำการ: ${provider.available_hours || 'ติดต่อสอบถาม'}`,
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'ดูผู้ให้บริการอื่น',
                data: 'action=search_providers'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'เมนูหลัก',
                data: 'action=help'
              }
            }
          ]
        }
      };
      
      return client.replyToken(userId, contactMessage);
      
    } catch (error) {
      console.error('Error getting provider contact:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูข้อมูลติดต่อได้'
      });
    }
  }

  async contactCustomer(client, userId, customerId) {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      const customer = response.data.data;
      
      const contactMessage = {
        type: 'text',
        text: `📞 ติดต่อ ${customer.name}\n\n` +
              `📱 โทรศัพท์: ${customer.phone}\n` +
              `${customer.line_id ? `💬 LINE: ${customer.line_id}\n` : ''}` +
              `📍 ที่อยู่: ${customer.location}\n` +
              `🏘️ พื้นที่: ${customer.subdistrict}, ${customer.district}\n\n` +
              `💼 งาน: ${customer.job_description}\n` +
              `💰 งบประมาณ: ${customer.budget_range || 'ติดต่อสอบถาม'}\n` +
              `⚡ ความเร่งด่วน: ${this.getUrgencyText(customer.urgency_level)}`,
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'ดูงานอื่น',
                data: 'action=search_jobs'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'เมนูหลัก',
                data: 'action=help'
              }
            }
          ]
        }
      };
      
      return client.replyToken(userId, contactMessage);
      
    } catch (error) {
      console.error('Error getting customer contact:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูข้อมูลติดต่อได้'
      });
    }
  }

  async filterByCategory(client, userId, categoryId, type) {
    try {
      const endpoint = type === 'provider' ? '/providers' : '/customers';
      const response = await apiClient.get(endpoint, {
        params: {
          category_id: categoryId,
          limit: 10,
          sort_by: type === 'provider' ? 'rating' : 'created_at',
          order: 'DESC'
        }
      });

      const items = response.data.data;
      
      if (items.length === 0) {
        return client.replyToken(userId, {
          type: 'text',
          text: 'ไม่พบรายการในหมวดหมู่นี้'
        });
      }

      const carousel = type === 'provider' 
        ? templates.createProviderCarousel(items)
        : templates.createJobCarousel(items);
        
      return client.replyToken(userId, carousel);
      
    } catch (error) {
      console.error('Error filtering by category:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการกรอง'
      });
    }
  }

  async filterByLocation(client, userId, district, subdistrict) {
    // Implementation for location filtering
    return client.replyToken(userId, {
      type: 'text',
      text: 'ฟีเจอร์การกรองตามพื้นที่กำลังพัฒนา'
    });
  }

  async showCategories(client, userId) {
    try {
      const response = await apiClient.get('/providers/categories');
      const categories = response.data.data;
      
      const categoryMessage = templates.createCategorySelection(categories);
      return client.replyToken(userId, categoryMessage);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      return client.replyToken(userId, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูหมวดหมู่บริการได้'
      });
    }
  }

  async showLocations(client, userId) {
    const locationMessage = templates.createLocationSelection();
    return client.replyToken(userId, locationMessage);
  }

  async handleUnknownPostback(client, userId) {
    return client.replyToken(userId, {
      type: 'text',
      text: 'ขออภัย ไม่เข้าใจคำสั่ง กรุณาเลือกจากเมนูด้านล่าง'
    });
  }

  getUrgencyText(urgencyLevel) {
    switch (urgencyLevel) {
      case 'high': return 'เร่งด่วน 🔴';
      case 'medium': return 'ปานกลาง 🟡';
      case 'low': return 'ไม่เร่งด่วน 🟢';
      default: return 'ไม่ระบุ';
    }
  }
}

module.exports = new PostbackHandler();