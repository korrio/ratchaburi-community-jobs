const db = require('../models/database');

// Sample data for seeding
const sampleData = {
  serviceCategories: [
    { name: 'ช่างไฟฟ้า', description: 'ซ่อมไฟฟ้า ติดตั้งอุปกรณ์ไฟฟ้า', icon: '⚡' },
    { name: 'ช่างประปา', description: 'ซ่อมท่อประปา ติดตั้งอุปกรณ์ประปา', icon: '🚿' },
    { name: 'ช่างก่อสร้าง', description: 'งานก่อสร้าง ปรับปรุงบ้าน', icon: '🏗️' },
    { name: 'ช่างแอร์', description: 'ซ่อมแอร์ ติดตั้งแอร์', icon: '❄️' },
    { name: 'ช่างตัดผม', description: 'ตัดผม สระผม', icon: '✂️' },
    { name: 'คนทำความสะอาด', description: 'ทำความสะอาดบ้าน สำนักงาน', icon: '🧹' },
    { name: 'ช่างซ่อมรถ', description: 'ซ่อมรถยนต์ รถจักรยานยนต์', icon: '🔧' },
    { name: 'ช่างเชื่อม', description: 'งานเชื่อม ประดิษฐ์โลหะ', icon: '🔥' },
    { name: 'ช่างทาสี', description: 'ทาสีบ้าน ทาสีอาคาร', icon: '🎨' },
    { name: 'คนสวน', description: 'ตัดหญ้า ดูแลสวน', icon: '🌱' }
  ],
  
  serviceProviders: [
    {
      name: 'สมชาย ใจดี',
      phone: '081-234-5678',
      line_id: 'somchai_electric',
      service_category_id: 1,
      location: '123 หมู่ 1',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      description: 'ช่างไฟฟ้ามืองาน 15 ปี ให้บริการดี รวดเร็ว',
      price_range: '300-1500 บาท',
      available_days: 'จันทร์-เสาร์',
      available_hours: '08:00-18:00',
      rating: 4.8,
      total_jobs: 125
    },
    {
      name: 'นาย วิชัย นำชัย',
      phone: '082-345-6789',
      line_id: 'vichai_plumber',
      service_category_id: 2,
      location: '456 หมู่ 2',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดำเนินสะดวก',
      description: 'ช่างประปามืออาชีพ รับงานทุกขนาด',
      price_range: '200-2000 บาท',
      available_days: 'ทุกวัน',
      available_hours: '07:00-19:00',
      rating: 4.6,
      total_jobs: 89
    },
    {
      name: 'บริษัท ก่อสร้าง ABC',
      phone: '083-456-7890',
      line_id: 'abc_construction',
      service_category_id: 3,
      location: '789 หมู่ 3',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ศิลาอาสน์',
      description: 'รับงานก่อสร้างทุกประเภท ทีมงานมืออาชีพ',
      price_range: '5000-500000 บาท',
      available_days: 'จันทร์-เสาร์',
      available_hours: '08:00-17:00',
      rating: 4.9,
      total_jobs: 67
    },
    {
      name: 'ศูนย์ซ่อมแอร์ รุ่งเรือง',
      phone: '084-567-8901',
      line_id: 'rungrieng_aircon',
      service_category_id: 4,
      location: '321 หมู่ 4',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดอนตาเพชร',
      description: 'ซ่อมแอร์ทุกยี่ห้อ ติดตั้งแอร์ใหม่',
      price_range: '300-3000 บาท',
      available_days: 'ทุกวัน',
      available_hours: '08:00-20:00',
      rating: 4.7,
      total_jobs: 156
    },
    {
      name: 'ร้านตัดผม สไตล์ดี',
      phone: '085-678-9012',
      line_id: 'style_barber',
      service_category_id: 5,
      location: '654 หมู่ 5',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      description: 'ตัดผมทุกสไตล์ บริการดี ราคาถูก',
      price_range: '50-300 บาท',
      available_days: 'ทุกวัน',
      available_hours: '09:00-21:00',
      rating: 4.5,
      total_jobs: 234
    }
  ],

  customers: [
    {
      name: 'นางสาว สุดา หวานใจ',
      phone: '086-789-0123',
      line_id: 'suda_sweet',
      location: '111 หมู่ 1',
      district: 'ดำเนินสะดวก',
      subdistrict: 'แพงพวย',
      service_category_id: 1,
      job_description: 'ต้องการติดตั้งไฟประดับสวน',
      budget_range: '2000-5000 บาท',
      urgency_level: 'medium'
    },
    {
      name: 'นาย ประยุทธ์ กล้าหาญ',
      phone: '087-890-1234',
      line_id: 'prayut_brave',
      location: '222 หมู่ 2',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ดำเนินสะดวก',
      service_category_id: 2,
      job_description: 'ท่อประปาแตก ต้องการซ่อมด่วน',
      budget_range: '500-1500 บาท',
      urgency_level: 'high'
    },
    {
      name: 'นางสาว มาลี ใจบุญ',
      phone: '088-901-2345',
      line_id: 'malee_kind',
      location: '333 หมู่ 3',
      district: 'ดำเนินสะดวก',
      subdistrict: 'ศิลาอาสน์',
      service_category_id: 6,
      job_description: 'ต้องการคนทำความสะอาดบ้าน 2 ชั้น',
      budget_range: '800-1200 บาท',
      urgency_level: 'low'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert service categories
    console.log('📝 Inserting service categories...');
    for (const category of sampleData.serviceCategories) {
      await db.run(
        'INSERT OR IGNORE INTO service_categories (name, description, icon) VALUES (?, ?, ?)',
        [category.name, category.description, category.icon]
      );
    }

    // Insert service providers
    console.log('👨‍💼 Inserting service providers...');
    for (const provider of sampleData.serviceProviders) {
      await db.run(
        `INSERT INTO service_providers (
          name, phone, line_id, service_category_id, location, district, subdistrict,
          description, price_range, available_days, available_hours, rating, total_jobs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          provider.name, provider.phone, provider.line_id, provider.service_category_id,
          provider.location, provider.district, provider.subdistrict, provider.description,
          provider.price_range, provider.available_days, provider.available_hours,
          provider.rating, provider.total_jobs
        ]
      );
    }

    // Insert customers
    console.log('🏠 Inserting customers...');
    for (const customer of sampleData.customers) {
      await db.run(
        `INSERT INTO customers (
          name, phone, line_id, location, district, subdistrict, service_category_id,
          job_description, budget_range, urgency_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.name, customer.phone, customer.line_id, customer.location,
          customer.district, customer.subdistrict, customer.service_category_id,
          customer.job_description, customer.budget_range, customer.urgency_level
        ]
      );
    }

    // Create some sample matches
    console.log('🤝 Creating sample matches...');
    await db.run(
      `INSERT INTO job_matches (provider_id, customer_id, match_score, status)
       VALUES (1, 1, 0.85, 'accepted')`,
      []
    );
    
    await db.run(
      `INSERT INTO job_matches (provider_id, customer_id, match_score, status)
       VALUES (2, 2, 0.92, 'pending')`,
      []
    );

    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    const providerCount = await db.get('SELECT COUNT(*) as count FROM service_providers');
    const customerCount = await db.get('SELECT COUNT(*) as count FROM customers');
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM service_categories');
    const matchCount = await db.get('SELECT COUNT(*) as count FROM job_matches');

    console.log('\n📊 Database Summary:');
    console.log(`   - Service Categories: ${categoryCount.count}`);
    console.log(`   - Service Providers: ${providerCount.count}`);
    console.log(`   - Customers: ${customerCount.count}`);
    console.log(`   - Job Matches: ${matchCount.count}`);

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categoryCount.count,
        providers: providerCount.count,
        customers: customerCount.count,
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