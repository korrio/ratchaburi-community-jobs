const db = require('../models/database');

// Enhanced sample data with updated schema fields
const enhancedSampleData = {
  serviceCategories: [
    { name: 'ทำความสะอาดทั่วไป', description: 'ทำความสะอาดบ้าน สำนักงาน', icon: '🧹' },
    { name: 'รับจ้างตัดหญ้า', description: 'ตัดหญ้า ดูแลสวน', icon: '🌱' },
    { name: 'รับจ้างเก็บผลไม้', description: 'เก็บผลไม้ งานเกษตร', icon: '🍎' },
    { name: 'ค้าขาย', description: 'ช่วยงานขาย พนักงานขาย', icon: '🛒' },
    { name: 'ช่างไฟฟ้า', description: 'ซ่อมไฟฟ้า ติดตั้งอุปกรณ์ไฟฟ้า', icon: '⚡' },
    { name: 'ช่างประปา', description: 'ซ่อมท่อประปา ติดตั้งอุปกรณ์ประปา', icon: '🚿' },
    { name: 'ช่างก่อสร้าง', description: 'งานก่อสร้าง ปรับปรุงบ้าน', icon: '🏗️' },
    { name: 'ช่างแอร์', description: 'ซ่อมแอร์ ติดตั้งแอร์', icon: '❄️' },
    { name: 'ช่างตัดผม', description: 'ตัดผม สระผม', icon: '✂️' },
    { name: 'งานขนส่ง', description: 'ขนส่งสินค้า รับจ้างขนของ', icon: '🚛' }
  ],
  
  serviceProviders: [
    // ดำเนินสะดวก - แพงพวย
    {
      name: 'เด็กชายธนวัฒน์ สอสะอาด',
      phone: '082-507-6933',
      line_id: 'thanawat_clean',
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '138 หมู่ 1 ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี 70130',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      description: 'รับจ้างทำความสะอาดบ้าน สำนักงาน มีประสบการณ์ 3 ปี',
      price_range: '80-120 บาทต่อชั่วโมง',
      available_days: 'จันทร์,อังคาร,พุธ,ศุกร์,เสาร์',
      available_hours: '08:00-16:00',
      rating: 4.5,
      total_jobs: 25
    },
    
    // ดำเนินสะดวก - ดำเนินสะดวก
    {
      name: 'นายสมชาย ใจดี',
      phone: '081-234-5678',
      line_id: 'somchai_electric',
      service_category_id: 5, // ช่างไฟฟ้า
      location: '456 หมู่ 2 ตำบลดำเนินสะดวก อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดำเนินสะดวก',
      description: 'ช่างไฟฟ้ามืออาชีพ ซ่อมไฟฟ้าบ้าน ติดตั้งอุปกรณ์ไฟฟ้า',
      price_range: '300-1500 บาท',
      available_days: 'จันทร์,อังคาร,พุธ,พฤหัสบดี,ศุกร์,เสาร์',
      available_hours: '08:00-18:00',
      rating: 4.8,
      total_jobs: 125
    },

    // เมืองราชบุรี - หน้าเมือง
    {
      name: 'นางสาวแพรวา หลายประเสริฐพร',
      phone: '082-372-8729',
      line_id: 'praewa_clean',
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '22/2 หมู่ 11 ตำบลหน้าเมือง อำเภอเมืองราชบุรี จังหวัดราชบุรี',
      district: 'เมืองราชบุรี',
      subdistrict: 'หน้าเมือง',
      description: 'ทำความสะอาดบ้าน สำนักงาน บริการดี ราคาย่อมเยา',
      price_range: '90-130 บาทต่อชั่วโมง',
      available_days: 'จันทร์,อังคาร,พฤหัสบดี,ศุกร์,เสาร์,อาทิตย์',
      available_hours: '07:00-15:00',
      rating: 4.4,
      total_jobs: 31
    },

    // ดำเนินสะดวก - ดอนตาเพชร
    {
      name: 'นายวิชัย นำชัย',
      phone: '082-345-6789',
      line_id: 'wichai_plumber',
      service_category_id: 6, // ช่างประปา
      location: '789 หมู่ 3 ตำบลดอนตาเพชร อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดอนตาเพชร',
      description: 'ช่างประปามืออาชีพ รับงานทุกขนาด ซ่อมท่อประปา ติดตั้งปั๊มน้ำ',
      price_range: '200-2000 บาท',
      available_days: 'ทุกวัน',
      available_hours: '07:00-19:00',
      rating: 4.6,
      total_jobs: 89
    },

    // บางแพ - หัวโพ
    {
      name: 'นางสาวศศิวิมล ทรัพย์ศิริ',
      phone: '095-015-9258',
      line_id: 'sasiwimol_grass',
      service_category_id: 2, // รับจ้างตัดหญ้า
      location: '25 หมู่ 8 ตำบลหัวโพ อำเภอบางแพ จังหวัดราชบุรี',
      district: 'บางแพ',
      subdistrict: 'หัวโพ',
      description: 'รับจ้างตัดหญ้า ดูแลสวน ประสบการณ์มากกว่า 5 ปี',
      price_range: '50-100 บาทต่อชั่วโมง',
      available_days: 'จันทร์,อังคาร,พุธ,ศุกร์,เสาร์,อาทิตย์',
      available_hours: '06:00-16:00',
      rating: 4.6,
      total_jobs: 52
    },

    // โพธาราม - คลองข่อย
    {
      name: 'นายภูริ ขยันการ',
      phone: '083-456-7890',
      line_id: 'phuris_fruits',
      service_category_id: 3, // รับจ้างเก็บผลไม้
      location: '111 หมู่ 5 ตำบลคลองข่อย อำเภอโพธาราม จังหวัดราชบุรี',
      district: 'โพธาราม',
      subdistrict: 'คลองข่อย',
      description: 'รับจ้างเก็บผลไม้ทุกชนิด มะม่วง มะพร้าว ทุเรียน',
      price_range: '70-150 บาทต่อชั่วโมง',
      available_days: 'จันทร์,อังคาร,พุธ,พฤหัสบดี,ศุกร์',
      available_hours: '05:00-14:00',
      rating: 4.3,
      total_jobs: 67
    }
  ],

  customers: [
    // ดำเนินสะดวก - ดอนคลัง (same district as some providers)
    {
      name: 'นางสาวตรีชฎา จีบฟัก',
      phone: '084-884-3915',
      line_id: 'treechada_home',
      location: '289 หมู่ 1 ตำบลดอนคลัง อำเภอดำเนินสะดวก จังหวัดราชบุรี 70130',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดอนคลัง',
      service_category_id: 1, // ทำความสะอาดทั่วไป
      job_description: 'ต้องการคนทำความสะอาดบ้านหลังใหญ่ 2 ชั้น',
      budget_range: '80-120 บาทต่อชั่วโมง',
      preferred_date: '2024-12-15', // วันอาทิตย์
      preferred_time: '09:00-15:00',
      urgency_level: 'medium',
      preferred_contact: 'phone'
    },

    // ดำเนินสะดวก - แพงพวย (same subdistrict as provider)
    {
      name: 'นายสุรพล เจริญสุข',
      phone: '081-567-8901',
      line_id: 'surapol_electric',
      location: '456 หมู่ 2 ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      service_category_id: 5, // ช่างไฟฟ้า
      job_description: 'ไฟฟ้าดับบ่อย ต้องการช่างมาตรวจสอบ',
      budget_range: '300-1500 บาท',
      preferred_date: '2024-12-16', // วันจันทร์
      preferred_time: '10:00-16:00',
      urgency_level: 'high',
      preferred_contact: 'line'
    },

    // เมืองราชบุรี - คุ้งน้ำวน (different district)
    {
      name: 'นายภาณุวัชร เล็บครุฑ',
      phone: '083-038-7220',
      line_id: 'panuwat_garden',
      location: '46 หมู่ 2 ตำบลคุ้งน้ำวน อำเภอเมืองราชบุรี จังหวัดราชบุรี 70000',
      district: 'เมืองราชบุรี',
      subdistrict: 'คุ้งน้ำวน',
      service_category_id: 2, // รับจ้างตัดหญ้า
      job_description: 'ต้องการตัดหญ้าในสวนบ้าน พื้นที่ประมาณ 500 ตรม.',
      budget_range: '50-100 บาทต่อชั่วโมง',
      preferred_date: '2024-12-17', // วันอังคาร
      preferred_time: '08:00-12:00',
      urgency_level: 'low',
      preferred_contact: 'phone'
    },

    // บางแพ - หัวโพ (same as grass cutting provider)
    {
      name: 'นางสาวธัญญเรศ เกษมศรี',
      phone: '098-398-9919',
      line_id: 'thanyares_grass',
      location: '87/1 หมู่ 6 ตำบลหัวโพ อำเภอบางแพ จังหวัดราชบุรี 70160',
      district: 'บางแพ',
      subdistrict: 'หัวโพ',
      service_category_id: 2, // รับจ้างตัดหญ้า
      job_description: 'ต้องการตัดหญ้าหลังบ้าน และดูแลต้นไม้',
      budget_range: '60-120 บาทต่อชั่วโมง',
      preferred_date: '2024-12-18', // วันพุธ
      preferred_time: '07:00-11:00',
      urgency_level: 'medium',
      preferred_contact: 'both'
    },

    // โพธาราม - คลองข่อย (different district)
    {
      name: 'นางสาววนิดา เสือกลั่น',
      phone: '083-493-9172',
      line_id: 'vanida_fruits',
      location: '56/1 หมู่ 2 ตำบลคลองข่อย อำเภอโพธาราม จังหวัดราชบุรี 70120',
      district: 'โพธาราม',
      subdistrict: 'คลองข่อย',
      service_category_id: 3, // รับจ้างเก็บผลไม้
      job_description: 'ต้องการคนเก็บมะม่วงและทุเรียน ในสวนหลังบ้าน',
      budget_range: '80-150 บาทต่อชั่วโมง',
      preferred_date: '2024-12-19', // วันพฤหัสบดี
      preferred_time: '06:00-12:00',
      urgency_level: 'high',
      preferred_contact: 'phone'
    },

    // ดำเนินสะดวก - ดอนตาเพชร (same subdistrict as plumber)
    {
      name: 'นายอนุพงษ์ น้ำใส',
      phone: '082-678-9012',
      line_id: 'anupong_water',
      location: '321 หมู่ 4 ตำบลดอนตาเพชร อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดอนตาเพชร',
      service_category_id: 6, // ช่างประปา
      job_description: 'ท่อน้ำแตก ต้องการช่างมาซ่อมด่วน',
      budget_range: '200-2000 บาท',
      preferred_date: '2024-12-20', // วันศุกร์
      preferred_time: '08:00-18:00',
      urgency_level: 'high',
      preferred_contact: 'phone'
    }
  ]
};

async function seedEnhancedDatabase() {
  try {
    console.log('🌱 Starting enhanced database seeding...');

    // Temporarily disable foreign key constraints for cleanup
    console.log('🧹 Clearing existing data...');
    await db.run('PRAGMA foreign_keys = OFF');
    
    // Clear existing data first (in proper order due to foreign keys)
    await db.run('DELETE FROM job_matches');
    await db.run('DELETE FROM customers'); 
    await db.run('DELETE FROM service_providers');
    await db.run('DELETE FROM service_categories');
    
    // Reset auto-increment counters
    await db.run('DELETE FROM sqlite_sequence WHERE name IN ("service_categories", "service_providers", "customers", "job_matches")');
    
    // Re-enable foreign key constraints
    await db.run('PRAGMA foreign_keys = ON');
    
    // Insert service categories first (required for foreign keys)
    console.log('📝 Inserting service categories...');
    for (const category of enhancedSampleData.serviceCategories) {
      await db.run(
        'INSERT INTO service_categories (name, description, icon) VALUES (?, ?, ?)',
        [category.name, category.description, category.icon]
      );
    }

    // Get category mappings and verify they exist
    const categories = await db.all('SELECT id, name FROM service_categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    console.log('📋 Category mappings:', categoryMap);
    
    console.log('👨‍💼 Inserting enhanced service providers...');
    for (const provider of enhancedSampleData.serviceProviders) {
      // Map old category IDs to new ones
      let categoryId;
      switch (provider.service_category_id) {
        case 1: categoryId = categoryMap['ทำความสะอาดทั่วไป']; break;
        case 2: categoryId = categoryMap['รับจ้างตัดหญ้า']; break;
        case 3: categoryId = categoryMap['รับจ้างเก็บผลไม้']; break;
        case 4: categoryId = categoryMap['ค้าขาย']; break;
        case 5: categoryId = categoryMap['ช่างไฟฟ้า']; break;
        case 6: categoryId = categoryMap['ช่างประปา']; break;
        case 7: categoryId = categoryMap['ช่างก่อสร้าง']; break;
        case 8: categoryId = categoryMap['ช่างแอร์']; break;
        case 9: categoryId = categoryMap['ช่างตัดผม']; break;
        case 10: categoryId = categoryMap['งานขนส่ง']; break;
        default: categoryId = categoryMap['ทำความสะอาดทั่วไป'];
      }
      
      if (!categoryId) {
        console.log(`⚠️ Warning: Could not find category for provider ${provider.name}`);
        continue;
      }
      
      console.log(`   Inserting provider: ${provider.name} (Category ID: ${categoryId})`);
      await db.run(
        `INSERT INTO service_providers (
          name, phone, line_id, service_category_id, location, district, subdistrict,
          description, price_range, available_days, available_hours, rating, total_jobs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          provider.name, provider.phone, provider.line_id, categoryId,
          provider.location, provider.district, provider.subdistrict, provider.description,
          provider.price_range, provider.available_days, provider.available_hours,
          provider.rating, provider.total_jobs
        ]
      );
    }

    // Insert enhanced customers
    console.log('🏠 Inserting enhanced customers...');
    for (const customer of enhancedSampleData.customers) {
      // Map old category IDs to new ones
      let categoryId;
      switch (customer.service_category_id) {
        case 1: categoryId = categoryMap['ทำความสะอาดทั่วไป']; break;
        case 2: categoryId = categoryMap['รับจ้างตัดหญ้า']; break;
        case 3: categoryId = categoryMap['รับจ้างเก็บผลไม้']; break;
        case 4: categoryId = categoryMap['ค้าขาย']; break;
        case 5: categoryId = categoryMap['ช่างไฟฟ้า']; break;
        case 6: categoryId = categoryMap['ช่างประปา']; break;
        default: categoryId = categoryMap['ทำความสะอาดทั่วไป'];
      }
      
      if (!categoryId) {
        console.log(`⚠️ Warning: Could not find category for customer ${customer.name}`);
        continue;
      }
      
      console.log(`   Inserting customer: ${customer.name} (Category ID: ${categoryId})`);
      await db.run(
        `INSERT INTO customers (
          name, phone, line_id, location, district, subdistrict, service_category_id,
          job_description, budget_range, preferred_date, preferred_time, urgency_level, preferred_contact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.name, customer.phone, customer.line_id, customer.location,
          customer.district, customer.subdistrict, categoryId,
          customer.job_description, customer.budget_range, customer.preferred_date,
          customer.preferred_time, customer.urgency_level, customer.preferred_contact
        ]
      );
    }

    // Create strategic matches for testing
    console.log('🤝 Creating strategic test matches...');
    
    // Get actual provider and customer IDs with their details
    const providers = await db.all(`
      SELECT p.id, p.name, p.district, p.subdistrict, p.price_range, p.available_days, p.available_hours, 
             c.name as category_name
      FROM service_providers p 
      JOIN service_categories c ON p.service_category_id = c.id
      ORDER BY p.id
    `);
    
    const customers = await db.all(`
      SELECT cu.id, cu.name, cu.district, cu.subdistrict, cu.budget_range, cu.preferred_date, cu.preferred_time,
             c.name as category_name
      FROM customers cu 
      JOIN service_categories c ON cu.service_category_id = c.id
      ORDER BY cu.id
    `);
    
    console.log(`Found ${providers.length} providers and ${customers.length} customers`);
    
    if (providers.length >= 3 && customers.length >= 3) {
      // Create diverse matches with different match qualities
      const matches = [
        // Perfect match: Same district + same subdistrict + overlapping price + available time
        { 
          provider_id: providers.find(p => p.district === 'ดำเนินสะดวก' && p.subdistrict === 'แพงพวย')?.id || providers[0].id,
          customer_id: customers.find(c => c.district === 'ดำเนินสะดวก' && c.subdistrict === 'แพงพวย')?.id || customers[0].id,
          match_score: 0.95, 
          status: 'accepted',
          job_progress: 'started'
        },
        
        // Good match: Same district, different subdistrict
        { 
          provider_id: providers.find(p => p.district === 'ดำเนินสะดวก' && p.category_name === 'ทำความสะอาดทั่วไป')?.id || providers[0].id,
          customer_id: customers.find(c => c.district === 'ดำเนินสะดวก' && c.category_name === 'ทำความสะอาดทั่วไป')?.id || customers[0].id,
          match_score: 0.85, 
          status: 'completed',
          job_progress: 'completed'
        },
        
        // Medium match: Different district but same service
        { 
          provider_id: providers.find(p => p.category_name === 'รับจ้างตัดหญ้า')?.id || providers[1].id,
          customer_id: customers.find(c => c.category_name === 'รับจ้างตัดหญ้า')?.id || customers[1].id,
          match_score: 0.70, 
          status: 'pending',
          job_progress: 'pending'
        },
        
        // Lower match: Cross-district, different price range
        { 
          provider_id: providers.find(p => p.district === 'โพธาราม')?.id || providers[2].id,
          customer_id: customers.find(c => c.district === 'เมืองราชบุรี')?.id || customers[2].id,
          match_score: 0.60, 
          status: 'rejected',
          job_progress: null
        },
        
        // Perfect service match: Same subdistrict + same service type
        { 
          provider_id: providers.find(p => p.category_name === 'ช่างประปา')?.id || providers[3].id,
          customer_id: customers.find(c => c.category_name === 'ช่างประปา')?.id || customers[3].id,
          match_score: 0.90, 
          status: 'accepted',
          job_progress: 'arrived'
        },
        
        // Another good match for grass cutting
        { 
          provider_id: providers.find(p => p.category_name === 'รับจ้างตัดหญ้า' && p.district === 'บางแพ')?.id || providers[4].id,
          customer_id: customers.find(c => c.category_name === 'รับจ้างตัดหญ้า' && c.district === 'บางแพ')?.id || customers[4].id,
          match_score: 0.88, 
          status: 'accepted',
          job_progress: 'closed'
        }
      ];
      
      for (const match of matches) {
        await db.run(
          `INSERT INTO job_matches (provider_id, customer_id, match_score, status, job_progress)
           VALUES (?, ?, ?, ?, ?)`,
          [match.provider_id, match.customer_id, match.match_score, match.status, match.job_progress]
        );
        console.log(`✅ Created strategic match: Provider ${match.provider_id} <-> Customer ${match.customer_id} (Score: ${match.match_score}, Status: ${match.status}, Progress: ${match.job_progress})`);
      }
    } else {
      console.log('⚠️ Skipping matches creation - insufficient providers or customers');
    }

    console.log('✅ Enhanced database seeding completed successfully!');
    
    // Display comprehensive summary
    const finalProviderCount = await db.get('SELECT COUNT(*) as count FROM service_providers');
    const finalCustomerCount = await db.get('SELECT COUNT(*) as count FROM customers');
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM service_categories');
    const matchCount = await db.get('SELECT COUNT(*) as count FROM job_matches');
    
    // Show match statistics by status and progress
    const statusStats = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM job_matches 
      GROUP BY status
    `);
    
    const progressStats = await db.all(`
      SELECT job_progress, COUNT(*) as count 
      FROM job_matches 
      WHERE job_progress IS NOT NULL
      GROUP BY job_progress
    `);

    console.log('\n📊 Enhanced Database Summary:');
    console.log(`   - Service Categories: ${categoryCount.count}`);
    console.log(`   - Service Providers: ${finalProviderCount.count}`);
    console.log(`   - Customers: ${finalCustomerCount.count}`);
    console.log(`   - Job Matches: ${matchCount.count}`);
    
    console.log('\n📈 Match Status Distribution:');
    statusStats.forEach(stat => {
      console.log(`   - ${stat.status}: ${stat.count}`);
    });
    
    console.log('\n🔄 Job Progress Distribution:');
    progressStats.forEach(stat => {
      console.log(`   - ${stat.job_progress}: ${stat.count}`);
    });

    return {
      success: true,
      message: 'Enhanced database seeded successfully',
      data: {
        categories: categoryCount.count,
        providers: finalProviderCount.count,
        customers: finalCustomerCount.count,
        matches: matchCount.count,
        statusStats: statusStats,
        progressStats: progressStats
      }
    };

  } catch (error) {
    console.error('❌ Error seeding enhanced database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedEnhancedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedEnhancedDatabase };