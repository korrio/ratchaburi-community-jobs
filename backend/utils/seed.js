const db = require('../models/database');

// Sample data for seeding
const sampleData = {
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
    { name: 'ช่างซ่อมรถ', description: 'ซ่อมรถยนต์ รถจักรยานยนต์', icon: '🔧' }
  ],
  
  serviceProviders: [
    {
      name: 'เด็กชายธนวัฒน์ สอสะอาด',
      phone: '082-5076933',
      line_id: null,
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '138 หมู่ 1 ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี 70130',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      description: 'รับจ้างตัดหญ้า ทำความสะอาดทั่วไป รับจ้างเก็บผลไม้',
      price_range: '100 บาทต่อชั่วโมง',
      available_days: 'จันทร์, อังคาร, พุธ, ศุกร์, เสาร์, อาทิตย์',
      available_hours: 'จันทร์ 09:00-15:00, อังคาร พุธ ศุกร์ เสาร์ อาทิตย์ 08:00-12:00',
      rating: 4.5,
      total_jobs: 25
    },
    {
      name: 'นายธนาธิป น่วมวัตร',
      phone: '081-5474765',
      line_id: null,
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '56 หมู่ 4 ตำบลท่านัด อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ท่านัด',
      description: 'รับจ้างตัดหญ้า ทำความสะอาดทั่วไป ค้าขาย',
      price_range: '100 บาทต่อชั่วโมง',
      available_days: 'ทุกวันยกเว้นวันพฤหัสบดี',
      available_hours: '13:00-17:00',
      rating: 4.3,
      total_jobs: 18
    },
    {
      name: 'นางสาวศศิวิมล ทรัพย์ศิริ',
      phone: '095-0159258',
      line_id: null,
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '25 หมู่ 8 ตำบลสี่หมื่น อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'สี่หมื่น',
      description: 'ทำความสะอาดทั่วไป รับจ้างเก็บผลไม้',
      price_range: '100 บาทต่อชั่วโมง',
      available_days: 'ทุกวันยกเว้นวันพฤหัสบดี',
      available_hours: '08:00-17:00',
      rating: 4.6,
      total_jobs: 32
    },
    {
      name: 'นางสาวแพรวา หลายประเสริฐพร',
      phone: '082-3728729',
      line_id: null,
      service_category_id: 1, // ทำความสะอาดทั่วไป
      location: '22/2 หมู่ 11 ตำบลบางป่า อำเภอเมือง จังหวัดราชบุรี',
      district: 'เมืองราชบุรี',
      subdistrict: 'บางป่า',
      description: 'ทำความสะอาดทั่วไป รับจ้างเก็บผลไม้ ค้าขาย',
      price_range: '100 บาทต่อชั่วโมง',
      available_days: 'ทุกวันยกเว้นวันพุธ',
      available_hours: '07:00-12:00',
      rating: 4.4,
      total_jobs: 21
    },
    // Additional providers for other categories
    {
      name: 'นายสมชาย ใจดี',
      phone: '081-234-5678',
      line_id: null,
      service_category_id: 5, // ช่างไฟฟ้า
      location: '123 หมู่ 1 ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      description: 'ช่างไฟฟ้ามืออาชีพ ซ่อมไฟฟ้าบ้าน ติดตั้งอุปกรณ์ไฟฟ้า',
      price_range: '300-1500 บาท',
      available_days: 'จันทร์-เสาร์',
      available_hours: '08:00-18:00',
      rating: 4.8,
      total_jobs: 125
    },
    {
      name: 'นายวิชัย นำชัย',
      phone: '082-345-6789',
      line_id: null,
      service_category_id: 6, // ช่างประปา
      location: '456 หมู่ 2 ตำบลดำเนินสะดวก อำเภอดำเนินสะดวก จังหวัดราชบุรี',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดำเนินสะดวก',
      description: 'ช่างประปามืออาชีพ รับงานทุกขนาด ซ่อมท่อประปา',
      price_range: '200-2000 บาท',
      available_days: 'ทุกวัน',
      available_hours: '07:00-19:00',
      rating: 4.6,
      total_jobs: 89
    }
  ],

  customers: [
    {
      name: 'นางสาวตรีชฎา จีบฟัก',
      phone: '084-8843915',
      line_id: null,
      location: '289 หมู่ 1 ตำบลดอนคลัง อำเภอดำเนินสะดวก จังหวัดราชบุรี 70130',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดอนคลัง',
      service_category_id: 2, // รับจ้างตัดหญ้า
      job_description: 'ต้องการคนตัดหญ้า',
      budget_range: '100 บาทต่อชั่วโมง',
      urgency_level: 'medium',
      preferred_contact: 'phone'
    },
    {
      name: 'นางสาววนิดา เสือกลั่น',
      phone: '083-4939172',
      line_id: null,
      location: '56/1 หมู่ 2 ตำบลคลองข่อย อำเภอโพธาราม จังหวัดราชบุรี 70120',
      district: 'โพธาราม',
      subdistrict: 'คลองข่อย',
      service_category_id: 4, // ค้าขาย
      job_description: 'ต้องการคนช่วยขายของ',
      budget_range: '100 บาทต่อชั่วโมง',
      urgency_level: 'medium',
      preferred_contact: 'phone'
    },
    {
      name: 'นางสาวธัญญเรศ เกษมศรี',
      phone: '098-3989919',
      line_id: null,
      location: '87/1 หมู่ 6 ตำบลหัวโพ อำเภอบางแพ จังหวัดราชบุรี 70160',
      district: 'บางแพ',
      subdistrict: 'หัวโพ',
      service_category_id: 1, // ทำความสะอาดทั่วไป
      job_description: 'ต้องการคนทำความสะอาดบ้าน',
      budget_range: '100 บาทต่อชั่วโมง',
      urgency_level: 'medium',
      preferred_contact: 'phone'
    },
    {
      name: 'นายภาณุวัชร เล็บครุฑ',
      phone: '083-0387220',
      line_id: null,
      location: '46 หมู่ 2 ตำบลคุ้งน้ำวน อำเภอเมือง จังหวัดราชบุรี 70000',
      district: 'เมืองราชบุรี',
      subdistrict: 'คุ้งน้ำวน',
      service_category_id: 3, // รับจ้างเก็บผลไม้
      job_description: 'รับจ้างเก็บเนื้อมะพร้าว',
      budget_range: '100 บาทต่อชั่วโมง',
      urgency_level: 'medium',
      preferred_contact: 'phone'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await db.run('DELETE FROM job_matches');
    await db.run('DELETE FROM service_providers');
    await db.run('DELETE FROM customers');
    await db.run('DELETE FROM service_categories');
    
    // Insert service categories
    console.log('📝 Inserting service categories...');
    for (const category of sampleData.serviceCategories) {
      await db.run(
        'INSERT INTO service_categories (name, description, icon) VALUES (?, ?, ?)',
        [category.name, category.description, category.icon]
      );
    }

    // Get category mappings
    const categories = await db.all('SELECT id, name FROM service_categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    console.log('👨‍💼 Inserting service providers...');
    for (const provider of sampleData.serviceProviders) {
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
        case 10: categoryId = categoryMap['ช่างซ่อมรถ']; break;
        default: categoryId = categoryMap['ทำความสะอาดทั่วไป'];
      }
      
      if (!categoryId) {
        console.log(`⚠️ Warning: Could not find category for provider ${provider.name}`);
        continue;
      }
      
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

    // Insert customers with proper category mapping
    console.log('🏠 Inserting customers...');
    for (const customer of sampleData.customers) {
      // Map old category IDs to new ones
      let categoryId;
      switch (customer.service_category_id) {
        case 1: categoryId = categoryMap['ทำความสะอาดทั่วไป']; break;
        case 2: categoryId = categoryMap['รับจ้างตัดหญ้า']; break;
        case 3: categoryId = categoryMap['รับจ้างเก็บผลไม้']; break;
        case 4: categoryId = categoryMap['ค้าขาย']; break;
        default: categoryId = categoryMap['ทำความสะอาดทั่วไป'];
      }
      
      if (!categoryId) {
        console.log(`⚠️ Warning: Could not find category for customer ${customer.name}`);
        continue;
      }
      
      await db.run(
        `INSERT INTO customers (
          name, phone, line_id, location, district, subdistrict, service_category_id,
          job_description, budget_range, urgency_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.name, customer.phone, customer.line_id, customer.location,
          customer.district, customer.subdistrict, categoryId,
          customer.job_description, customer.budget_range, customer.urgency_level
        ]
      );
    }

    // Create some sample matches
    console.log('🤝 Creating sample matches...');
    
    // Get actual provider and customer IDs
    const providers = await db.all('SELECT id, name FROM service_providers ORDER BY id LIMIT 6');
    const customers = await db.all('SELECT id, name FROM customers ORDER BY id LIMIT 4');
    
    console.log(`Found ${providers.length} providers and ${customers.length} customers`);
    
    if (providers.length >= 3 && customers.length >= 3) {
      // Create matches using actual IDs
      const matches = [
        { provider_id: providers[0].id, customer_id: customers[0].id, match_score: 0.85, status: 'accepted' },
        { provider_id: providers[1].id, customer_id: customers[1].id, match_score: 0.75, status: 'pending' },
        { provider_id: providers[2].id, customer_id: customers[2].id, match_score: 0.70, status: 'completed' }
      ];
      
      for (const match of matches) {
        await db.run(
          `INSERT INTO job_matches (provider_id, customer_id, match_score, status)
           VALUES (?, ?, ?, ?)`,
          [match.provider_id, match.customer_id, match.match_score, match.status]
        );
        console.log(`✅ Created match: Provider ${match.provider_id} <-> Customer ${match.customer_id}`);
      }
    } else {
      console.log('⚠️ Skipping matches creation - insufficient providers or customers');
    }

    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    const finalProviderCount = await db.get('SELECT COUNT(*) as count FROM service_providers');
    const finalCustomerCount = await db.get('SELECT COUNT(*) as count FROM customers');
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM service_categories');
    const matchCount = await db.get('SELECT COUNT(*) as count FROM job_matches');

    console.log('\n📊 Database Summary:');
    console.log(`   - Service Categories: ${categoryCount.count}`);
    console.log(`   - Service Providers: ${finalProviderCount.count}`);
    console.log(`   - Customers: ${finalCustomerCount.count}`);
    console.log(`   - Job Matches: ${matchCount.count}`);

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categoryCount.count,
        providers: finalProviderCount.count,
        customers: finalCustomerCount.count,
        matches: matchCount.count
      }
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedDatabase };