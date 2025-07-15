const axios = require('axios');
const { FlexMessage, TextMessage, QuickReply } = require('@line/bot-sdk');
const templates = require('../templates/messageTemplates');
const apiClient = require('../utils/apiClient');

class MessageHandler {
  async handleTextMessage(event, client) {
    const userMessage = event.message.text.toLowerCase().trim();
    const replyToken = event.replyToken;

    // Command matching
    const commands = {
      'สวัสดี': () => this.sendWelcomeMessage(client, replyToken),
      'ค้นหาผู้ให้บริการ': () => this.searchProviders(client, replyToken),
      'ค้นหางาน': () => this.searchJobs(client, replyToken),
      'จับคู่งาน': () => this.autoMatch(client, replyToken),
      'ลงทะเบียนผู้ให้บริการ': () => this.registerProvider(client, replyToken),
      'ลงทะเบียนงาน': () => this.registerCustomer(client, replyToken),
      'ช่วยเหลือ': () => this.sendHelpMessage(client, replyToken),
      'help': () => this.sendHelpMessage(client, replyToken),
      'เริ่มต้น': () => this.sendWelcomeMessage(client, replyToken),
      'start': () => this.sendWelcomeMessage(client, replyToken),
    };

    // Check for exact command match
    if (commands[userMessage]) {
      return commands[userMessage]();
    }

    // Check for partial matches or keywords
    if (userMessage.includes('ช่าง') || userMessage.includes('บริการ')) {
      return this.searchProviders(client, replyToken, userMessage);
    }

    if (userMessage.includes('งาน') || userMessage.includes('จ้าง')) {
      return this.searchJobs(client, replyToken, userMessage);
    }

    if (userMessage.includes('ติดต่อ') || userMessage.includes('สอบถาม')) {
      return this.sendContactInfo(client, replyToken);
    }

    // Default response with quick replies
    return this.sendDefaultResponse(client, replyToken);
  }

  async sendWelcomeMessage(client, replyToken) {
    const welcomeMessage = templates.createWelcomeMessage();
    return client.replyMessage(replyToken, welcomeMessage);
  }

  async searchProviders(client, replyToken, query = '') {
    try {
      const response = await apiClient.get('/providers', {
        params: {
          limit: 5,
          search: query,
          sort_by: 'rating',
          order: 'DESC'
        }
      });

      const providers = response.data.data;
      
      if (providers.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: 'ไม่พบผู้ให้บริการที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง'
        });
      }

      const providerCards = templates.createProviderCarousel(providers);
      return client.replyMessage(replyToken, providerCards);

    } catch (error) {
      console.error('Error searching providers:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async searchJobs(client, replyToken, query = '') {
    try {
      const response = await apiClient.get('/customers', {
        params: {
          limit: 5,
          search: query,
          sort_by: 'created_at',
          order: 'DESC'
        }
      });

      const customers = response.data.data;
      
      if (customers.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: 'ไม่พบงานที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง'
        });
      }

      const jobCards = templates.createJobCarousel(customers);
      return client.replyMessage(replyToken, jobCards);

    } catch (error) {
      console.error('Error searching jobs:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async autoMatch(client, replyToken) {
    try {
      const response = await apiClient.get('/auto-matches', {
        params: { limit: 10 }
      });

      const matches = response.data.data;
      
      if (matches.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: 'ยังไม่มีการจับคู่งานในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง'
        });
      }

      const matchCards = templates.createMatchCarousel(matches);
      return client.replyMessage(replyToken, matchCards);

    } catch (error) {
      console.error('Error getting auto matches:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async registerProvider(client, replyToken) {
    const message = {
      type: 'text',
      text: '📝 การลงทะเบียนผู้ให้บริการ\n\n' +
            'สำหรับการลงทะเบียนผู้ให้บริการ กรุณาเข้าไปที่เว็บไซต์ของเรา:\n' +
            '🌐 https://ratchaburi-community-jobs.vercel.app/providers/register\n\n' +
            'หรือติดต่อเจ้าหน้าที่ได้ที่:\n' +
            '📞 0X-XXX-XXXX\n' +
            '📧 support@ratchaburicommunity.co.th',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ดูผู้ให้บริการ',
              data: 'action=search_providers'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ช่วยเหลือ',
              data: 'action=help'
            }
          }
        ]
      }
    };

    return client.replyMessage(replyToken, message);
  }

  async registerCustomer(client, replyToken) {
    const message = {
      type: 'text',
      text: '📝 การลงทะเบียนผู้ต้องการจ้างงาน\n\n' +
            'สำหรับการโพสต์งานที่ต้องการจ้าง กรุณาเข้าไปที่เว็บไซต์ของเรา:\n' +
            '🌐 https://ratchaburi-community-jobs.vercel.app/customers/register\n\n' +
            'หรือติดต่อเจ้าหน้าที่ได้ที่:\n' +
            '📞 0X-XXX-XXXX\n' +
            '📧 support@ratchaburicommunity.co.th',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ดูงานที่ต้องการจ้าง',
              data: 'action=search_jobs'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ช่วยเหลือ',
              data: 'action=help'
            }
          }
        ]
      }
    };

    return client.replyMessage(replyToken, message);
  }

  async sendHelpMessage(client, replyToken) {
    const helpMessage = templates.createHelpMessage();
    return client.replyMessage(replyToken, helpMessage);
  }

  async sendContactInfo(client, replyToken) {
    const contactMessage = {
      type: 'text',
      text: '📞 ติดต่อเรา\n\n' +
            'ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย\n' +
            'อำเภอดำเนินสะดวก จังหวัดราชบุรี\n\n' +
            '📞 โทรศัพท์: 0X-XXX-XXXX\n' +
            '📧 อีเมล: support@ratchaburicommunity.co.th\n' +
            '💬 LINE Official: @ratchaburi_community\n\n' +
            '⏰ เวลาทำการ: จันทร์-ศุกร์ 08:00-16:30 น.'
    };

    return client.replyMessage(replyToken, contactMessage);
  }

  async sendDefaultResponse(client, replyToken) {
    const message = {
      type: 'text',
      text: '🤖 ไม่เข้าใจคำสั่ง กรุณาเลือกจากเมนูด้านล่างหรือพิมพ์:\n\n' +
            '• "ค้นหาผู้ให้บริการ" - ค้นหาช่างและผู้ให้บริการ\n' +
            '• "ค้นหางาน" - ค้นหางานที่ต้องการจ้าง\n' +
            '• "จับคู่งาน" - ดูการจับคู่งานอัตโนมัติ\n' +
            '• "ลงทะเบียนผู้ให้บริการ" - ลงทะเบียนเป็นผู้ให้บริการ\n' +
            '• "ลงทะเบียนงาน" - โพสต์งานที่ต้องการจ้าง\n' +
            '• "ช่วยเหลือ" - ดูคำแนะนำการใช้งาน',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ค้นหาผู้ให้บริการ',
              data: 'action=search_providers'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ค้นหางาน',
              data: 'action=search_jobs'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'จับคู่งาน',
              data: 'action=auto_match'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ช่วยเหลือ',
              data: 'action=help'
            }
          }
        ]
      }
    };

    return client.replyMessage(replyToken, message);
  }
}

module.exports = new MessageHandler();