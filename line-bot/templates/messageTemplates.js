class MessageTemplates {
  createWelcomeMessage(displayName = '') {
    const greeting = displayName ? `สวัสดี ${displayName}! ` : 'สวัสดี! ';
    
    return {
      type: 'flex',
      altText: 'ยินดีต้อนรับสู่ราชบุรีงานชุมชน',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: 'https://via.placeholder.com/1040x585/0ea5e9/ffffff?text=ราชบุรีงานชุมชน',
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
        url: 'https://via.placeholder.com/1040x585/f1f5f9/334155?text=' + encodeURIComponent(provider.category_icon || '🔧'),
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
        url: 'https://via.placeholder.com/1040x585/fef3c7/92400e?text=' + encodeURIComponent(customer.category_icon || '💼'),
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
            color: '#0ea5e9',
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
            action: {
              type: 'postback',
              label: 'ติดต่อ',
              data: `action=contact_customer&id=${customer.id}`
            }
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