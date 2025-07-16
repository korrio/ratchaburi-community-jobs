class MessageTemplates {
  createWelcomeMessage(displayName = '') {
    const greeting = displayName ? `สวัสดี ${displayName}! ` : 'สวัสดี! ';
    
    return {
      type: 'flex',
      altText: 'ยินดีต้อนรับสู่ราชบุรีงานชุมชน',
      contents: {
        type: 'bubble',
        // hero: {
        //   type: 'image',
        //   url: 'https://placehold.co/1040x585/0ea5e9/ffffff?text=ratchaburi%20community',
        //   size: 'full',
        //   aspectRatio: '20:13',
        //   aspectMode: 'cover'
        // },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `${greeting}ยินดีต้อนรับสู่`,
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'text',
              text: 'ราชบุรีงานชุมชน',
              weight: 'bold',
              size: 'xxl',
              color: '#1e293b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: 'แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชนราชบุรี',
              size: 'sm',
              color: '#64748b',
              margin: 'lg',
              wrap: true
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: '🔍 ค้นหาผู้ให้บริการ\n💼 ค้นหางานที่ต้องการจ้าง\n🤝 จับคู่งานอัตโนมัติ\n📝 ลงทะเบียนผู้ให้บริการหรือโพสต์งาน',
              size: 'sm',
              color: '#374151',
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
                type: 'postback',
                label: 'ค้นหาผู้ให้บริการ',
                data: 'action=search_providers'
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'ค้นหางานที่ต้องการจ้าง',
                data: 'action=search_jobs'
              }
            }
          ]
        }
      }
    };
  }

  createHelpMessage() {
    return {
      type: 'flex',
      altText: 'คำแนะนำการใช้งาน',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'คำแนะนำการใช้งาน',
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: '📱 วิธีการใช้งาน:',
              weight: 'bold',
              margin: 'lg',
              size: 'md'
            },
            {
              type: 'text',
              text: '• ใช้เมนูด้านล่างเพื่อเลือกฟีเจอร์\n• พิมพ์คำสั่งในแชท\n• กดปุ่มใน Rich Menu',
              size: 'sm',
              color: '#64748b',
              margin: 'sm',
              wrap: true
            },
            {
              type: 'text',
              text: '💬 คำสั่งที่ใช้ได้:',
              weight: 'bold',
              margin: 'lg',
              size: 'md'
            },
            {
              type: 'text',
              text: '• "ค้นหาผู้ให้บริการ" - ค้นหาช่างและผู้ให้บริการ\n• "ค้นหางาน" - ค้นหางานที่ต้องการจ้าง\n• "จับคู่งาน" - ดูการจับคู่งานอัตโนมัติ\n• "ลงทะเบียนผู้ให้บริการ"\n• "ลงทะเบียนงาน"\n• "ติดต่อ" - ดูข้อมูลติดต่อ',
              size: 'sm',
              color: '#64748b',
              margin: 'sm',
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
                type: 'postback',
                label: 'เริ่มใช้งาน',
                data: 'action=search_providers'
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'uri',
                label: 'เปิดเว็บไซต์',
                uri: 'https://ratchaburi-community-jobs.vercel.app'
              }
            }
          ]
        }
      }
    };
  }

  createProviderCarousel(providers) {
    const bubbles = providers.map(provider => ({
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://placehold.co/1040x585/f1f5f9/334155?text=avatar',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: provider.name,
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: `${provider.category_icon || '🔧'} ${provider.category_name || 'บริการทั่วไป'}`,
            size: 'sm',
            color: '#0ea5e9',
            margin: 'xs'
          },
          {
            type: 'text',
            text: `⭐ ${provider.rating}/5 (${provider.total_jobs} งาน)`,
            size: 'sm',
            color: '#f59e0b',
            margin: 'sm'
          },
          {
            type: 'text',
            text: `📍 ${provider.district}, ${provider.subdistrict}`,
            size: 'sm',
            color: '#64748b',
            margin: 'sm'
          },
          {
            type: 'text',
            text: provider.description || 'ไม่มีรายละเอียด',
            size: 'sm',
            color: '#374151',
            margin: 'sm',
            wrap: true,
            maxLines: 2
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
              data: `action=view_provider&id=${provider.id}`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: 'ติดต่อ',
              data: `action=contact_provider&id=${provider.id}`
            }
          }
        ]
      }
    }));

    return {
      type: 'flex',
      altText: 'รายการผู้ให้บริการ',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }

  createJobCarousel(customers) {
    const bubbles = customers.map(customer => ({
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://placehold.co/1040x585/fef3c7/92400e?text=JOB',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: customer.name,
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: `${customer.category_icon || '💼'} ${customer.category_name || 'งานทั่วไป'}`,
            size: 'sm',
            color: '#0ea5e9',
            margin: 'xs'
          },
          {
            type: 'text',
            text: this.getUrgencyBadge(customer.urgency_level),
            size: 'sm',
            margin: 'sm'
          },
          {
            type: 'text',
            text: `📍 ${customer.district}, ${customer.subdistrict}`,
            size: 'sm',
            color: '#64748b',
            margin: 'sm'
          },
          {
            type: 'text',
            text: customer.job_description || 'ไม่มีรายละเอียด',
            size: 'sm',
            color: '#374151',
            margin: 'sm',
            wrap: true,
            maxLines: 2
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
            color: '#16a34a',
            action: {
              type: 'postback',
              label: '🤝 รับงาน',
              data: `action=accept_job&customer_id=${customer.id}`
            }
          },
          {
            type: 'box',
            layout: 'horizontal',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'secondary',
                height: 'sm',
                flex: 1,
                action: {
                  type: 'postback',
                  label: 'ดูรายละเอียด',
                  data: `action=view_customer&id=${customer.id}`
                }
              },
              {
                type: 'button',
                style: 'secondary',
                height: 'sm',
                flex: 1,
                action: {
                  type: 'postback',
                  label: 'ติดต่อ',
                  data: `action=contact_customer&id=${customer.id}`
                }
              }
            ]
          }
        ]
      }
    }));

    return {
      type: 'flex',
      altText: 'รายการงานที่ต้องการจ้าง',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }

  createMatchCarousel(matches) {
    const bubbles = matches.map(match => ({
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'การจับคู่งาน',
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
            text: '👨‍💼 ผู้ให้บริการ',
            weight: 'bold',
            size: 'sm',
            margin: 'md'
          },
          {
            type: 'text',
            text: match.provider_name || 'ไม่ระบุ',
            size: 'sm',
            color: '#374151',
            margin: 'xs'
          },
          {
            type: 'text',
            text: '🏠 ผู้ต้องการจ้าง',
            weight: 'bold',
            size: 'sm',
            margin: 'md'
          },
          {
            type: 'text',
            text: match.customer_name || 'ไม่ระบุ',
            size: 'sm',
            color: '#374151',
            margin: 'xs'
          },
          {
            type: 'text',
            text: `🎯 ความแม่นยำ: ${Math.round(match.match_score * 100)}%`,
            size: 'sm',
            color: '#059669',
            margin: 'md'
          },
          {
            type: 'text',
            text: `📊 สถานะ: ${this.getMatchStatusText(match.status)}`,
            size: 'sm',
            color: '#64748b',
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
    }));

    return {
      type: 'flex',
      altText: 'การจับคู่งาน',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }

  createProviderDetail(provider) {
    return {
      type: 'flex',
      altText: `รายละเอียด ${provider.name}`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: provider.name,
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'text',
              text: `${provider.category_icon || '🔧'} ${provider.category_name || 'บริการทั่วไป'}`,
              size: 'md',
              color: '#64748b',
              margin: 'sm'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `⭐ คะแนน: ${provider.rating}/5`,
              size: 'sm',
              color: '#f59e0b',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `📊 งานที่ทำ: ${provider.total_jobs} งาน`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `📍 ที่อยู่: ${provider.location}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs',
              wrap: true
            },
            {
              type: 'text',
              text: `🏘️ พื้นที่: ${provider.subdistrict}, ${provider.district}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `💰 ราคา: ${provider.price_range || 'ติดต่อสอบถาม'}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `⏰ เวลาทำการ: ${provider.available_hours || 'ติดต่อสอบถาม'}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `📝 รายละเอียด: ${provider.description || 'ไม่มีรายละเอียด'}`,
              size: 'sm',
              color: '#374151',
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
                type: 'postback',
                label: 'ติดต่อ',
                data: `action=contact_provider&id=${provider.id}`
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'ดูผู้ให้บริการอื่น',
                data: 'action=search_providers'
              }
            }
          ]
        }
      }
    };
  }

  createCustomerDetail(customer) {
    return {
      type: 'flex',
      altText: `รายละเอียดงาน ${customer.name}`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: customer.name,
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'text',
              text: `${customer.category_icon || '💼'} ${customer.category_name || 'งานทั่วไป'}`,
              size: 'md',
              color: '#64748b',
              margin: 'sm'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: this.getUrgencyBadge(customer.urgency_level),
              size: 'sm',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `📍 ที่อยู่: ${customer.location}`,
              size: 'sm',
              color: '#64748b',
              margin: 'sm',
              wrap: true
            },
            {
              type: 'text',
              text: `🏘️ พื้นที่: ${customer.subdistrict}, ${customer.district}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `💰 งบประมาณ: ${customer.budget_range || 'ติดต่อสอบถาม'}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `📞 ติดต่อ: ${customer.preferred_contact === 'phone' ? 'โทรศัพท์' : customer.preferred_contact === 'line' ? 'LINE' : 'ทั้งสองช่องทาง'}`,
              size: 'sm',
              color: '#64748b',
              margin: 'xs'
            },
            {
              type: 'text',
              text: `📝 รายละเอียดงาน: ${customer.job_description}`,
              size: 'sm',
              color: '#374151',
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
                type: 'postback',
                label: 'ติดต่อ',
                data: `action=contact_customer&id=${customer.id}`
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
  }

  createMatchDetail(match) {
    return {
      type: 'flex',
      altText: 'รายละเอียดการจับคู่งาน',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'การจับคู่งาน',
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'text',
              text: `🎯 ความแม่นยำ: ${Math.round(match.match_score * 100)}%`,
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
              text: '👨‍💼 ผู้ให้บริการ',
              weight: 'bold',
              size: 'md',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `${match.provider_name || 'ไม่ระบุ'} (${match.provider_phone || 'ไม่ระบุ'})`,
              size: 'sm',
              color: '#374151',
              margin: 'xs',
              wrap: true
            },
            {
              type: 'text',
              text: '🏠 ผู้ต้องการจ้าง',
              weight: 'bold',
              size: 'md',
              margin: 'md'
            },
            {
              type: 'text',
              text: `${match.customer_name || 'ไม่ระบุ'} (${match.customer_phone || 'ไม่ระบุ'})`,
              size: 'sm',
              color: '#374151',
              margin: 'xs',
              wrap: true
            },
            {
              type: 'text',
              text: '💼 งาน',
              weight: 'bold',
              size: 'md',
              margin: 'md'
            },
            {
              type: 'text',
              text: match.job_description || 'ไม่มีรายละเอียด',
              size: 'sm',
              color: '#374151',
              margin: 'xs',
              wrap: true
            },
            {
              type: 'text',
              text: `📊 สถานะ: ${this.getMatchStatusText(match.status)}`,
              size: 'sm',
              color: '#64748b',
              margin: 'md'
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
                label: 'ดูการจับคู่งานอื่น',
                data: 'action=auto_match'
              }
            }
          ]
        }
      }
    };
  }

  getUrgencyBadge(urgencyLevel) {
    switch (urgencyLevel) {
      case 'high':
        return '⚡ เร่งด่วน';
      case 'medium':
        return '🟡 ปานกลาง';
      case 'low':
        return '🟢 ไม่เร่งด่วน';
      default:
        return '⚪ ไม่ระบุ';
    }
  }

  createJobAcceptanceConfirmation(customer, provider) {
    return {
      type: 'flex',
      altText: 'ยืนยันการรับงาน',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🤝 ยืนยันการรับงาน',
              weight: 'bold',
              size: 'xl',
              color: '#0ea5e9'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: '📋 รายละเอียดงาน',
              weight: 'bold',
              size: 'md',
              margin: 'lg'
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
              text: `🏘️ พื้นที่: ${customer.subdistrict}, ${customer.district}`,
              size: 'sm',
              color: '#374151',
              margin: 'xs'
            },
            {
              type: 'separator',
              margin: 'md'
            },
            {
              type: 'text',
              text: `💼 งาน: ${customer.job_description}`,
              size: 'sm',
              color: '#374151',
              margin: 'sm',
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
              type: 'text',
              text: this.getUrgencyBadge(customer.urgency_level),
              size: 'sm',
              margin: 'xs'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: '⚠️ หลังจากยืนยันแล้ว ระบบจะส่งข้อมูลติดต่อให้ลูกค้าทราบ และคุณต้องติดต่อลูกค้าเพื่อนัดหมายทำงาน',
              size: 'xs',
              color: '#ef4444',
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
              color: '#16a34a',
              action: {
                type: 'postback',
                label: '✅ ยืนยันรับงาน',
                data: `action=confirm_accept_job&customer_id=${customer.id}&provider_id=${provider.id}`
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'postback',
                label: '❌ ยกเลิก',
                data: 'action=cancel_accept_job'
              }
            }
          ]
        }
      }
    };
  }

  createJobProgressUpdate(jobData, stage) {
    const stageInfo = this.getJobStageInfo(stage);
    const match = jobData.match;

    return {
      type: 'flex',
      altText: `อัพเดทสถานะงาน: ${stageInfo.name}`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `✅ ${stageInfo.name}`,
              weight: 'bold',
              size: 'xl',
              color: stageInfo.color
            },
            {
              type: 'text',
              text: `🎯 สถานะ: ${stageInfo.description}`,
              size: 'sm',
              color: '#64748b',
              margin: 'sm',
              wrap: true
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `📋 งาน: ${match.job_description}`,
              size: 'sm',
              color: '#374151',
              margin: 'lg',
              wrap: true
            },
            {
              type: 'text',
              text: `👤 ลูกค้า: ${match.customer_name}`,
              size: 'sm',
              color: '#374151',
              margin: 'sm'
            },
            {
              type: 'text',
              text: `📞 โทร: ${match.customer_phone}`,
              size: 'sm',
              color: '#374151',
              margin: 'xs'
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: this.getNextActionButtons(stage, match.id)
        }
      }
    };
  }

  createMyJobsCarousel(jobs) {
    const bubbles = jobs.map(job => ({
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: job.customer_name,
            weight: 'bold',
            size: 'lg'
          },
          {
            type: 'text',
            text: this.getJobStageInfo(job.job_progress).name,
            size: 'sm',
            color: this.getJobStageInfo(job.job_progress).color,
            margin: 'xs'
          },
          {
            type: 'separator',
            margin: 'md'
          },
          {
            type: 'text',
            text: job.job_description,
            size: 'sm',
            color: '#374151',
            margin: 'md',
            wrap: true,
            maxLines: 2
          },
          {
            type: 'text',
            text: `📞 ${job.customer_phone}`,
            size: 'sm',
            color: '#64748b',
            margin: 'sm'
          },
          {
            type: 'text',
            text: `💰 ${job.budget_range || 'ติดต่อสอบถาม'}`,
            size: 'sm',
            color: '#64748b',
            margin: 'xs'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: this.getJobActionButtons(job.job_progress, job.id)
      }
    }));

    return {
      type: 'flex',
      altText: 'งานของฉัน',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }

  getJobStageInfo(stage) {
    const stages = {
      'pending': { name: 'รอการตอบกลับ', color: '#6b7280', description: 'รอการตอบรับงาน' },
      'accepted': { name: 'รับงานแล้ว', color: '#3b82f6', description: 'งานถูกรับแล้ว รอการเดินทาง' },
      'arrived': { name: 'ถึงหน้างาน', color: '#f59e0b', description: 'มาถึงสถานที่ทำงานแล้ว' },
      'started': { name: 'เริ่มดำเนินงาน', color: '#f97316', description: 'กำลังดำเนินงานอยู่' },
      'completed': { name: 'เสร็จงาน', color: '#8b5cf6', description: 'งานเสร็จแล้ว รอ feedback ลูกค้า' },
      'closed': { name: 'ปิดงาน', color: '#16a34a', description: 'งานปิดสมบูรณ์แล้ว' }
    };
    return stages[stage] || stages['pending'];
  }

  getNextActionButtons(stage, matchId) {
    const baseButtons = [
      {
        type: 'button',
        style: 'secondary',
        height: 'sm',
        action: {
          type: 'postback',
          label: '📋 ดูงานของฉัน',
          data: 'action=view_my_jobs'
        }
      }
    ];

    switch (stage) {
      case 'accepted':
        return [
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
          ...baseButtons
        ];
      
      case 'arrived':
        return [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f97316',
            action: {
              type: 'postback',
              label: '🔧 เริ่มดำเนินงาน',
              data: `action=update_progress&match_id=${matchId}&stage=started`
            }
          },
          ...baseButtons
        ];
      
      case 'started':
        return [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#8b5cf6',
            action: {
              type: 'postback',
              label: '🎉 เสร็จงานแล้ว',
              data: `action=update_progress&match_id=${matchId}&stage=completed`
            }
          },
          ...baseButtons
        ];
      
      default:
        return baseButtons;
    }
  }

  getJobActionButtons(stage, matchId) {
    switch (stage) {
      case 'accepted':
        return [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f59e0b',
            action: {
              type: 'postback',
              label: '🚗 ถึงหน้างาน',
              data: `action=update_progress&match_id=${matchId}&stage=arrived`
            }
          }
        ];
      
      case 'arrived':
        return [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f97316',
            action: {
              type: 'postback',
              label: '🔧 เริ่มทำงาน',
              data: `action=update_progress&match_id=${matchId}&stage=started`
            }
          }
        ];
      
      case 'started':
        return [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#8b5cf6',
            action: {
              type: 'postback',
              label: '🎉 เสร็จงาน',
              data: `action=update_progress&match_id=${matchId}&stage=completed`
            }
          }
        ];
      
      case 'completed':
        return [
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '⏳ รอ feedback ลูกค้า',
              data: `action=view_job_status&match_id=${matchId}`
            }
          }
        ];
      
      case 'closed':
        return [
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '✅ งานปิดแล้ว',
              data: `action=view_job_status&match_id=${matchId}`
            }
          }
        ];
      
      default:
        return [
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: 'ดูรายละเอียด',
              data: `action=view_job_status&match_id=${matchId}`
            }
          }
        ];
    }
  }

  getMatchStatusText(status) {
    switch (status) {
      case 'pending':
        return 'รอการตอบกลับ';
      case 'accepted':
        return 'ตอบรับแล้ว';
      case 'rejected':
        return 'ปฏิเสธ';
      case 'completed':
        return 'สำเร็จ';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return 'ไม่ระบุ';
    }
  }
}

module.exports = new MessageTemplates();