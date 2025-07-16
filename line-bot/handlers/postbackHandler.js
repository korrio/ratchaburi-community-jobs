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
        return messageHandler.searchJobs(client, replyToken, '', userId);
      
      case 'search_all_jobs':
        return messageHandler.searchJobs(client, replyToken, '', null); // Pass null to get all jobs
      
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
      
      case 'accept_job':
        return this.acceptJob(client, replyToken, params.get('customer_id'), userId);
      
      case 'confirm_accept_job':
        return this.confirmAcceptJob(client, replyToken, params.get('customer_id'), params.get('provider_id'));
      
      case 'cancel_accept_job':
        return this.cancelAcceptJob(client, replyToken);
      
      case 'update_progress':
        return this.updateJobProgress(client, replyToken, params.get('match_id'), params.get('stage'));
      
      case 'view_my_jobs':
        return this.viewMyJobs(client, replyToken, userId);
      
      case 'complete_job':
        return this.completeJob(client, replyToken, params.get('match_id'), params);
      
      case 'submit_customer_feedback':
        return this.submitCustomerFeedback(client, replyToken, params);
      
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

  async acceptJob(client, replyToken, customerId, lineUserId) {
    try {
      // First, check if the user is registered as a provider
      const providersResponse = await apiClient.get('/providers', {
        params: { line_id: lineUserId, limit: 1 }
      });
      
      const providers = providersResponse.data.data;
      
      if (!providers || providers.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: '❌ คุณยังไม่ได้ลงทะเบียนเป็นผู้ให้บริการ\n\nกรุณาลงทะเบียนก่อนรับงาน:\n🌐 https://ratchaburi-community-jobs.vercel.app/providers/register\n\nหรือติดต่อเจ้าหน้าที่: 📞 0X-XXX-XXXX',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ลงทะเบียนผู้ให้บริการ',
                  data: 'action=register_provider'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ดูงานอื่น',
                  data: 'action=search_jobs'
                }
              }
            ]
          }
        });
      }

      const provider = providers[0];

      // Get customer details
      const customerResponse = await apiClient.get(`/customers/${customerId}`);
      const customer = customerResponse.data.data;

      // Check if there's already a match between this provider and customer
      const existingMatchResponse = await apiClient.get('/matches', {
        params: {
          provider_id: provider.id,
          customer_id: customerId,
          limit: 1
        }
      });

      const existingMatches = existingMatchResponse.data.data;
      
      if (existingMatches && existingMatches.length > 0) {
        const match = existingMatches[0];
        return client.replyMessage(replyToken, {
          type: 'text',
          text: `⚠️ คุณเคยจับคู่กับงานนี้แล้ว\n\nสถานะปัจจุบัน: ${this.getMatchStatusText(match.status)}\n\nหากต้องการข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่`,
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ดูงานอื่น',
                  data: 'action=search_jobs'
                }
              }
            ]
          }
        });
      }

      // Create confirmation message
      const confirmMessage = templates.createJobAcceptanceConfirmation(customer, provider);
      return client.replyMessage(replyToken, confirmMessage);

    } catch (error) {
      console.error('Error in acceptJob:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการรับงาน กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async confirmAcceptJob(client, replyToken, customerId, providerId) {
    try {
      // Create a match between provider and customer
      const matchResponse = await apiClient.post('/matches', {
        provider_id: providerId,
        customer_id: customerId
      });

      if (matchResponse.data.success) {
        const matchId = matchResponse.data.data.id;
        
        // Update match status to accepted
        await apiClient.put(`/matches/${matchId}/status`, {
          status: 'accepted',
          provider_response: 'รับงานผ่าน LINE Bot'
        });

        // Get customer details for contact info
        const customerResponse = await apiClient.get(`/customers/${customerId}`);
        const customer = customerResponse.data.data;

        // Update job progress to accepted
        await apiClient.post(`/job-progress/${matchId}/update`, {
          stage: 'accepted',
          notes: 'งานถูกรับผ่าน LINE Bot'
        });

        const successMessage = {
          type: 'flex',
          altText: 'รับงานสำเร็จ',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '✅ รับงานสำเร็จ!',
                  weight: 'bold',
                  size: 'xl',
                  color: '#16a34a'
                },
                {
                  type: 'text',
                  text: '🎯 สถานะ: รับงานแล้ว',
                  size: 'sm',
                  color: '#059669',
                  margin: 'sm'
                },
                {
                  type: 'separator',
                  margin: 'lg'
                },
                {
                  type: 'text',
                  text: `📋 งาน: ${customer.job_description}`,
                  size: 'sm',
                  color: '#374151',
                  margin: 'lg',
                  wrap: true
                },
                {
                  type: 'text',
                  text: `👤 ลูกค้า: ${customer.name}`,
                  size: 'sm',
                  color: '#374151',
                  margin: 'sm'
                },
                {
                  type: 'text',
                  text: `📞 โทร: ${customer.phone}`,
                  size: 'sm',
                  color: '#374151',
                  margin: 'xs'
                },
                {
                  type: 'text',
                  text: `📍 ที่อยู่: ${customer.location}`,
                  size: 'sm',
                  color: '#374151',
                  margin: 'xs',
                  wrap: true
                },
                {
                  type: 'text',
                  text: `💰 งบประมาณ: ${customer.budget_range || 'ติดต่อสอบถาม'}`,
                  size: 'sm',
                  color: '#374151',
                  margin: 'xs'
                },
                {
                  type: 'separator',
                  margin: 'lg'
                },
                {
                  type: 'text',
                  text: '📝 ขั้นตอนต่อไป: ติดต่อลูกค้าและเดินทางไปยังสถานที่',
                  size: 'sm',
                  color: '#64748b',
                  margin: 'lg',
                  wrap: true
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
                    type: 'tel',
                    label: `📞 โทรหาลูกค้า`,
                    uri: `tel:${customer.phone}`
                  }
                },
                {
                  type: 'button',
                  style: 'primary',
                  height: 'sm',
                  color: '#f59e0b',
                  action: {
                    type: 'postback',
                    label: '🚗 ถึงหน้างานแล้ว',
                    data: `action=update_progress&match_id=${matchId}&stage=arrived`
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  height: 'sm',
                  action: {
                    type: 'postback',
                    label: 'ดูงานอื่น',
                    data: 'action=search_jobs'
                  }
                }
              ]
            }
          }
        };

        return client.replyMessage(replyToken, successMessage);
      } else {
        throw new Error('Failed to create match');
      }

    } catch (error) {
      console.error('Error confirming job acceptance:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการรับงาน กรุณาลองใหม่อีกครั้งหรือติดต่อเจ้าหน้าที่'
      });
    }
  }

  async cancelAcceptJob(client, replyToken) {
    return client.replyMessage(replyToken, {
      type: 'text',
      text: '❌ ยกเลิกการรับงาน\n\nคุณสามารถดูงานอื่นๆ ได้ตามปกติ',
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
    });
  }

  getMatchStatusText(status) {
    switch (status) {
      case 'pending': return 'รอการตอบกลับ';
      case 'accepted': return 'ตอบรับแล้ว';
      case 'rejected': return 'ปฏิเสธ';
      case 'completed': return 'สำเร็จ';
      case 'cancelled': return 'ยกเลิก';
      default: return 'ไม่ระบุ';
    }
  }

  async updateJobProgress(client, replyToken, matchId, stage) {
    try {
      // Update progress via API
      await apiClient.post(`/job-progress/${matchId}/update`, {
        stage: stage,
        notes: `อัพเดทผ่าน LINE Bot`
      });

      // Get updated job details
      const progressResponse = await apiClient.get(`/job-progress/${matchId}`);
      const jobData = progressResponse.data.data;

      const progressMessage = templates.createJobProgressUpdate(jobData, stage);
      return client.replyMessage(replyToken, progressMessage);

    } catch (error) {
      console.error('Error updating job progress:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async viewMyJobs(client, replyToken, lineUserId) {
    try {
      // Get provider info
      const providersResponse = await apiClient.get('/providers', {
        params: { line_id: lineUserId, limit: 1 }
      });
      
      const providers = providersResponse.data.data;
      
      if (!providers || providers.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: '❌ คุณยังไม่ได้ลงทะเบียนเป็นผู้ให้บริการ',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ลงทะเบียนผู้ให้บริการ',
                  data: 'action=register_provider'
                }
              }
            ]
          }
        });
      }

      const provider = providers[0];

      // Get active jobs for this provider
      const jobsResponse = await apiClient.get('/job-progress', {
        params: {
          provider_id: provider.id,
          limit: 10
        }
      });

      const jobs = jobsResponse.data.data;
      
      if (jobs.length === 0) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: '📋 คุณยังไม่มีงานที่กำลังดำเนินการ',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: 'ค้นหางานใหม่',
                  data: 'action=search_jobs'
                }
              }
            ]
          }
        });
      }

      const jobCarousel = templates.createMyJobsCarousel(jobs);
      return client.replyMessage(replyToken, jobCarousel);

    } catch (error) {
      console.error('Error fetching my jobs:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูลงาน กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async completeJob(client, replyToken, matchId, params) {
    try {
      const actualDuration = params.get('duration') || '';
      const finalCost = params.get('cost') || '';

      // Update job to completed status
      await apiClient.post(`/job-progress/${matchId}/update`, {
        stage: 'completed',
        notes: 'งานเสร็จสิ้น รอลูกค้าให้ feedback',
        actual_duration: actualDuration,
        final_cost: parseFloat(finalCost) || null
      });

      // Get job details for customer notification
      const progressResponse = await apiClient.get(`/job-progress/${matchId}`);
      const jobData = progressResponse.data.data;

      const completionMessage = {
        type: 'flex',
        altText: 'งานเสร็จสิ้น',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🎉 งานเสร็จสิ้น!',
                weight: 'bold',
                size: 'xl',
                color: '#16a34a'
              },
              {
                type: 'text',
                text: '🎯 สถานะ: รอลูกค้าให้ feedback',
                size: 'sm',
                color: '#8b5cf6',
                margin: 'sm'
              },
              {
                type: 'separator',
                margin: 'lg'
              },
              {
                type: 'text',
                text: `📋 งาน: ${jobData.match.job_description}`,
                size: 'sm',
                color: '#374151',
                margin: 'lg',
                wrap: true
              },
              {
                type: 'text',
                text: `👤 ลูกค้า: ${jobData.match.customer_name}`,
                size: 'sm',
                color: '#374151',
                margin: 'sm'
              },
              {
                type: 'separator',
                margin: 'lg'
              },
              {
                type: 'text',
                text: '📝 ระบบจะแจ้งให้ลูกค้าทราบและขอ feedback\nหลังจากลูกค้าให้คะแนนแล้ว คุณสามารถกรอกแบบสอบถามเพื่อปิดงานได้',
                size: 'sm',
                color: '#64748b',
                margin: 'lg',
                wrap: true
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
                action: {
                  type: 'postback',
                  label: '📋 ดูงานของฉัน',
                  data: 'action=view_my_jobs'
                }
              },
              {
                type: 'button',
                style: 'secondary',
                height: 'sm',
                action: {
                  type: 'postback',
                  label: 'ค้นหางานใหม่',
                  data: 'action=search_jobs'
                }
              }
            ]
          }
        }
      };

      return client.replyMessage(replyToken, completionMessage);

    } catch (error) {
      console.error('Error completing job:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async submitCustomerFeedback(client, replyToken, params) {
    try {
      const matchId = params.get('match_id');
      const serviceRating = parseInt(params.get('service_rating'));
      const qualityRating = parseInt(params.get('quality_rating'));
      const timelinessRating = parseInt(params.get('timeliness_rating'));
      const overallRating = parseInt(params.get('overall_rating'));
      const feedbackText = params.get('feedback_text') || '';

      await apiClient.post(`/job-progress/${matchId}/customer-feedback`, {
        service_rating: serviceRating,
        quality_rating: qualityRating,
        timeliness_rating: timelinessRating,
        overall_rating: overallRating,
        feedback_text: feedbackText,
        would_recommend: true,
        would_hire_again: true
      });

      const thankYouMessage = {
        type: 'text',
        text: '🙏 ขขอบคุณสำหรับ feedback ของคุณ!\n\nระบบจะแจ้งให้ผู้ให้บริการทราบและดำเนินการปิดงานต่อไป',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'ค้นหางานใหม่',
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

      return client.replyMessage(replyToken, thankYouMessage);

    } catch (error) {
      console.error('Error submitting customer feedback:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'ขออภัย เกิดข้อผิดพลาดในการส่ง feedback กรุณาลองใหม่อีกครั้ง'
      });
    }
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