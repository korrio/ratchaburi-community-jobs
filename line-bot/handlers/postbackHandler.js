const messageHandler = require('./messageHandler');
const templates = require('../templates/messageTemplates');
const apiClient = require('../utils/apiClient');

class PostbackHandler {
  async handlePostback(event, client) {
    const userId = event.source.userId;
    const replyToken = event.replyToken;
    const postbackData = event.postback.data;
    
    // Parse postback data
    const params = new URLSearchParams(postbackData);
    const action = params.get('action');
    const id = params.get('id');
    const type = params.get('type');

    console.log('Postback received:', { action, id, type });

    switch (action) {
      case 'search_providers':
        return messageHandler.searchProviders(client, replyToken);
      
      case 'search_jobs':
        return messageHandler.searchJobs(client, replyToken);
      
      case 'auto_match':
        return messageHandler.autoMatch(client, replyToken);
      
      case 'register_provider':
        return messageHandler.registerProvider(client, replyToken);
      
      case 'register_customer':
        return messageHandler.registerCustomer(client, replyToken);
      
      case 'help':
        return messageHandler.sendHelpMessage(client, replyToken);
      
      case 'view_provider':
        return this.viewProviderDetail(client, replyToken, id);
      
      case 'view_customer':
        return this.viewCustomerDetail(client, replyToken, id);
      
      case 'view_match':
        return this.viewMatchDetail(client, replyToken, id);
      
      case 'contact_provider':
        return this.contactProvider(client, replyToken, id);
      
      case 'contact_customer':
        return this.contactCustomer(client, replyToken, id);
      
      case 'filter_category':
        return this.filterByCategory(client, replyToken, id, type);
      
      case 'filter_location':
        return this.filterByLocation(client, replyToken, params.get('district'), params.get('subdistrict'));
      
      case 'show_categories':
        return this.showCategories(client, replyToken);
      
      case 'show_locations':
        return this.showLocations(client, replyToken);
      
      default:
        return this.handleUnknownPostback(client, replyToken);
    }
  }

  async viewProviderDetail(client, replyToken, providerId) {
    try {
      const response = await apiClient.get(`/providers/${providerId}`);
      const provider = response.data.data;
      
      const detailMessage = templates.createProviderDetail(provider);
      return client.replyMessage(replyToken, detailMessage);
      
    } catch (error) {
      console.error('Error fetching provider detail:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดผู้ให้บริการได้'
      });
    }
  }

  async viewCustomerDetail(client, replyToken, customerId) {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      const customer = response.data.data;
      
      const detailMessage = templates.createCustomerDetail(customer);
      return client.replyMessage(replyToken, detailMessage);
      
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดงานได้'
      });
    }
  }

  async viewMatchDetail(client, replyToken, matchId) {
    try {
      const response = await apiClient.get(`/matches/${matchId}`);
      const match = response.data.data;
      
      const detailMessage = templates.createMatchDetail(match);
      return client.replyMessage(replyToken, detailMessage);
      
    } catch (error) {
      console.error('Error fetching match detail:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูรายละเอียดการจับคู่งานได้'
      });
    }
  }

  async contactProvider(client, replyToken, providerId) {
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
      
      return client.replyMessage(replyToken, contactMessage);
      
    } catch (error) {
      console.error('Error getting provider contact:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูข้อมูลติดต่อได้'
      });
    }
  }

  async contactCustomer(client, replyToken, customerId) {
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
      
      return client.replyMessage(replyToken, contactMessage);
      
    } catch (error) {
      console.error('Error getting customer contact:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูข้อมูลติดต่อได้'
      });
    }
  }

  async filterByCategory(client, replyToken, categoryId, type) {
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
        return client.replyMessage(replyToken, {
          type: 'text',
          text: 'ไม่พบรายการในหมวดหมู่นี้'
        });
      }

      const carousel = type === 'provider' 
        ? templates.createProviderCarousel(items)
        : templates.createJobCarousel(items);
        
      return client.replyMessage(replyToken, carousel);
      
    } catch (error) {
      console.error('Error filtering by category:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการกรอง'
      });
    }
  }

  async filterByLocation(client, replyToken, district, subdistrict) {
    // Implementation for location filtering
    return client.replyMessage(replyToken, {
      type: 'text',
      text: 'ฟีเจอร์การกรองตามพื้นที่กำลังพัฒนา'
    });
  }

  async showCategories(client, replyToken) {
    try {
      const response = await apiClient.get('/providers/categories');
      const categories = response.data.data;
      
      const categoryMessage = templates.createCategorySelection(categories);
      return client.replyMessage(replyToken, categoryMessage);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดูหมวดหมู่บริการได้'
      });
    }
  }

  async showLocations(client, replyToken) {
    const locationMessage = templates.createLocationSelection();
    return client.replyMessage(replyToken, locationMessage);
  }

  async handleUnknownPostback(client, replyToken) {
    return client.replyMessage(replyToken, {
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