const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database setup
const dbPath = path.join(__dirname, '../data/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create questionnaire tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS provider_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      payment_received BOOLEAN DEFAULT 0,
      payment_amount DECIMAL(10,2),
      payment_method TEXT,
      job_completion_date DATE,
      actual_hours_worked DECIMAL(5,2),
      difficulty_level TEXT CHECK(difficulty_level IN ('easy', 'medium', 'hard')),
      customer_satisfaction INTEGER CHECK(customer_satisfaction >= 1 AND customer_satisfaction <= 5),
      would_work_again BOOLEAN DEFAULT 1,
      additional_services_offered TEXT,
      challenges_faced TEXT,
      suggestions_for_improvement TEXT,
      overall_experience INTEGER CHECK(overall_experience >= 1 AND overall_experience <= 5),
      recommendation_likelihood INTEGER CHECK(recommendation_likelihood >= 1 AND recommendation_likelihood <= 5),
      feedback_for_platform TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (match_id) REFERENCES job_matches(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS customer_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      service_rating INTEGER CHECK(service_rating >= 1 AND service_rating <= 5),
      service_quality INTEGER CHECK(service_quality >= 1 AND service_quality <= 5),
      timeliness INTEGER CHECK(timeliness >= 1 AND timeliness <= 5),
      communication INTEGER CHECK(communication >= 1 AND communication <= 5),
      professionalism INTEGER CHECK(professionalism >= 1 AND professionalism <= 5),
      value_for_money INTEGER CHECK(value_for_money >= 1 AND value_for_money <= 5),
      overall_satisfaction INTEGER CHECK(overall_satisfaction >= 1 AND overall_satisfaction <= 5),
      would_recommend BOOLEAN DEFAULT 1,
      would_hire_again BOOLEAN DEFAULT 1,
      completion_time TEXT CHECK(completion_time IN ('faster', 'on_time', 'slower')),
      price_fairness TEXT CHECK(price_fairness IN ('cheap', 'fair', 'expensive')),
      service_exceeded_expectations BOOLEAN DEFAULT 1,
      positive_feedback TEXT,
      areas_for_improvement TEXT,
      additional_services_received TEXT,
      problems_encountered TEXT,
      recommendation_reason TEXT,
      overall_experience_description TEXT,
      favorite_aspect TEXT,
      suggestion_for_provider TEXT,
      platform_feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (match_id) REFERENCES job_matches(id)
    )
  `);
});

// Submit provider questionnaire
router.post('/:matchId/provider-questionnaire', (req, res) => {
  const { matchId } = req.params;
  const data = req.body;
  
  const query = `
    INSERT OR REPLACE INTO provider_questionnaires (
      match_id, payment_received, payment_amount, payment_method, job_completion_date,
      actual_hours_worked, difficulty_level, customer_satisfaction, would_work_again,
      additional_services_offered, challenges_faced, suggestions_for_improvement,
      overall_experience, recommendation_likelihood, feedback_for_platform, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  
  const params = [
    matchId,
    data.payment_received ? 1 : 0,
    data.payment_amount || null,
    data.payment_method || null,
    data.job_completion_date || null,
    data.actual_hours_worked || null,
    data.difficulty_level || null,
    data.customer_satisfaction || null,
    data.would_work_again ? 1 : 0,
    data.additional_services_offered || null,
    data.challenges_faced || null,
    data.suggestions_for_improvement || null,
    data.overall_experience || null,
    data.recommendation_likelihood || null,
    data.feedback_for_platform || null
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error submitting provider questionnaire:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการบันทึกแบบสอบถาม' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'บันทึกแบบสอบถามสำเร็จ',
      data: { id: this.lastID }
    });
  });
});

// Submit customer questionnaire
router.post('/:matchId/customer-questionnaire', (req, res) => {
  const { matchId } = req.params;
  const data = req.body;
  
  const query = `
    INSERT OR REPLACE INTO customer_questionnaires (
      match_id, service_rating, service_quality, timeliness, communication,
      professionalism, value_for_money, overall_satisfaction, would_recommend,
      would_hire_again, completion_time, price_fairness, service_exceeded_expectations,
      positive_feedback, areas_for_improvement, additional_services_received,
      problems_encountered, recommendation_reason, overall_experience_description,
      favorite_aspect, suggestion_for_provider, platform_feedback, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  
  const params = [
    matchId,
    data.service_rating || null,
    data.service_quality || null,
    data.timeliness || null,
    data.communication || null,
    data.professionalism || null,
    data.value_for_money || null,
    data.overall_satisfaction || null,
    data.would_recommend ? 1 : 0,
    data.would_hire_again ? 1 : 0,
    data.completion_time || null,
    data.price_fairness || null,
    data.service_exceeded_expectations ? 1 : 0,
    data.positive_feedback || null,
    data.areas_for_improvement || null,
    data.additional_services_received || null,
    data.problems_encountered || null,
    data.recommendation_reason || null,
    data.overall_experience_description || null,
    data.favorite_aspect || null,
    data.suggestion_for_provider || null,
    data.platform_feedback || null
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error submitting customer questionnaire:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการบันทึกแบบประเมิน' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'บันทึกแบบประเมินสำเร็จ',
      data: { id: this.lastID }
    });
  });
});

// Get provider questionnaire
router.get('/:matchId/provider-questionnaire', (req, res) => {
  const { matchId } = req.params;
  
  const query = `
    SELECT * FROM provider_questionnaires 
    WHERE match_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;
  
  db.get(query, [matchId], (err, row) => {
    if (err) {
      console.error('Error fetching provider questionnaire:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' 
      });
    }
    
    res.json({ 
      success: true, 
      data: row || null
    });
  });
});

// Get customer questionnaire
router.get('/:matchId/customer-questionnaire', (req, res) => {
  const { matchId } = req.params;
  
  const query = `
    SELECT * FROM customer_questionnaires 
    WHERE match_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;
  
  db.get(query, [matchId], (err, row) => {
    if (err) {
      console.error('Error fetching customer questionnaire:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' 
      });
    }
    
    res.json({ 
      success: true, 
      data: row || null
    });
  });
});

// Direct access to provider questionnaire form
router.get('/provider/:matchId', (req, res) => {
  const { matchId } = req.params;
  const { name, job, phone } = req.query;
  
  // Create HTML form for provider questionnaire
  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แบบสอบถามผู้ให้บริการ - JOB ชุมชน</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .star-rating { display: flex; align-items: center; }
        .star { cursor: pointer; color: #d1d5db; font-size: 1.5rem; transition: color 0.2s; }
        .star.active { color: #fbbf24; }
        .star:hover { color: #fbbf24; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">แบบสอบถามผู้ให้บริการ</h1>
                <div class="text-2xl font-bold text-blue-600">JOB ชุมชน</div>
                <p class="text-gray-600 mt-4">กรุณากรอกข้อมูลหลังการทำงานเสร็จสิ้น</p>
            </div>

            <!-- Job Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-medium text-gray-900 mb-2">ข้อมูลงาน</h3>
                <p class="text-sm text-gray-600">รหัสงาน: ${matchId}</p>
                ${name ? `<p class="text-sm text-gray-600">ลูกค้า: ${decodeURIComponent(name)}</p>` : ''}
                ${job ? `<p class="text-sm text-gray-600">รายละเอียด: ${decodeURIComponent(job)}</p>` : ''}
                ${phone ? `<p class="text-sm text-gray-600">โทร: ${decodeURIComponent(phone)}</p>` : ''}
            </div>

            <form id="providerForm" onsubmit="submitForm(event)">
                <!-- Payment Information -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">💰 ข้อมูลการชำระเงิน</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="payment_received" name="payment_received" class="h-4 w-4 text-blue-600 rounded">
                            <label for="payment_received" class="ml-2 text-sm text-gray-900">ได้รับเงินค่าจ้างแล้ว</label>
                        </div>
                        <div id="paymentDetails" class="hidden space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">จำนวนเงินที่ได้รับ (บาท)</label>
                                <input type="number" name="payment_amount" min="0" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">วิธีการชำระเงิน</label>
                                <select name="payment_method" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option value="">เลือกวิธีการชำระเงิน</option>
                                    <option value="cash">เงินสด</option>
                                    <option value="bank_transfer">โอนเงิน</option>
                                    <option value="mobile_banking">แอปธนาคาร</option>
                                    <option value="promptpay">พร้อมเพย์</option>
                                    <option value="other">อื่นๆ</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Job Information -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">⏰ ข้อมูลการทำงาน</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">วันที่ทำงานเสร็จ</label>
                            <input type="date" name="job_completion_date" required class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">จำนวนชั่วโมงที่ทำงานจริง</label>
                            <input type="number" name="actual_hours_worked" min="0" step="0.5" required class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ระดับความยากของงาน</label>
                            <select name="difficulty_level" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                <option value="easy">ง่าย</option>
                                <option value="medium" selected>ปานกลาง</option>
                                <option value="hard">ยาก</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Customer Satisfaction -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">👥 ความพึงพอใจของลูกค้า</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ความพึงพอใจของลูกค้า (1-5 ดาว)</label>
                            <div class="star-rating">
                                <input type="hidden" name="customer_satisfaction" value="5">
                                <span class="star active" data-rating="1" data-field="customer_satisfaction">⭐</span>
                                <span class="star active" data-rating="2" data-field="customer_satisfaction">⭐</span>
                                <span class="star active" data-rating="3" data-field="customer_satisfaction">⭐</span>
                                <span class="star active" data-rating="4" data-field="customer_satisfaction">⭐</span>
                                <span class="star active" data-rating="5" data-field="customer_satisfaction">⭐</span>
                                <span class="ml-2 text-sm text-gray-600" id="customer_satisfaction_text">5 ดาว</span>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="would_work_again" name="would_work_again" checked class="h-4 w-4 text-blue-600 rounded">
                            <label for="would_work_again" class="ml-2 text-sm text-gray-900">ยินดีทำงานกับลูกค้ารายนี้อีก</label>
                        </div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">💬 ข้อมูลเพิ่มเติม</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">บริการเพิ่มเติมที่เสนอ</label>
                            <textarea name="additional_services_offered" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="บริการหรือคำแนะนำเพิ่มเติมที่เสนอให้ลูกค้า..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ปัญหาหรือความท้าทายที่พบ</label>
                            <textarea name="challenges_faced" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ปัญหาหรือความยากลำบากที่พบระหว่างการทำงาน..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ข้อเสนอแนะเพื่อปรับปรุง</label>
                            <textarea name="suggestions_for_improvement" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ข้อเสนอแนะเพื่อปรับปรุงกระบวนการทำงาน..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Overall Experience -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">⚡ ประสบการณ์โดยรวม</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ประสบการณ์โดยรวม (1-5 ดาว)</label>
                            <div class="star-rating">
                                <input type="hidden" name="overall_experience" value="5">
                                <span class="star active" data-rating="1" data-field="overall_experience">⭐</span>
                                <span class="star active" data-rating="2" data-field="overall_experience">⭐</span>
                                <span class="star active" data-rating="3" data-field="overall_experience">⭐</span>
                                <span class="star active" data-rating="4" data-field="overall_experience">⭐</span>
                                <span class="star active" data-rating="5" data-field="overall_experience">⭐</span>
                                <span class="ml-2 text-sm text-gray-600" id="overall_experience_text">5 ดาว</span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ความน่าจะเป็นที่จะแนะนำแพลตฟอร์มนี้ (1-5 ดาว)</label>
                            <div class="star-rating">
                                <input type="hidden" name="recommendation_likelihood" value="5">
                                <span class="star active" data-rating="1" data-field="recommendation_likelihood">⭐</span>
                                <span class="star active" data-rating="2" data-field="recommendation_likelihood">⭐</span>
                                <span class="star active" data-rating="3" data-field="recommendation_likelihood">⭐</span>
                                <span class="star active" data-rating="4" data-field="recommendation_likelihood">⭐</span>
                                <span class="star active" data-rating="5" data-field="recommendation_likelihood">⭐</span>
                                <span class="ml-2 text-sm text-gray-600" id="recommendation_likelihood_text">5 ดาว</span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ข้อเสนอแนะสำหรับแพลตฟอร์ม</label>
                            <textarea name="feedback_for_platform" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ข้อเสนอแนะเพื่อปรับปรุงแพลตฟอร์ม..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <button type="submit" id="submitBtn" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg">
                        ส่งแบบสอบถาม
                    </button>
                </div>
            </form>

            <div id="successMessage" class="hidden text-center py-8">
                <div class="text-green-600 text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">ขอบคุณสำหรับข้อมูล!</h2>
                <p class="text-gray-600">แบบสอบถามได้รับการบันทึกเรียบร้อยแล้ว</p>
            </div>
        </div>
    </div>

    <script>
        // Payment checkbox toggle
        document.getElementById('payment_received').addEventListener('change', function() {
            const paymentDetails = document.getElementById('paymentDetails');
            if (this.checked) {
                paymentDetails.classList.remove('hidden');
            } else {
                paymentDetails.classList.add('hidden');
            }
        });

        // Star rating functionality
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                const field = this.dataset.field;
                const stars = document.querySelectorAll(\`[data-field="\${field}"]\`);
                const hiddenInput = document.querySelector(\`input[name="\${field}"]\`);
                const textSpan = document.getElementById(\`\${field}_text\`);
                
                hiddenInput.value = rating;
                textSpan.textContent = \`\${rating} ดาว\`;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });

        // Form submission
        async function submitForm(event) {
            event.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const form = document.getElementById('providerForm');
            const successMessage = document.getElementById('successMessage');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังส่ง...';
            
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (key === 'payment_received' || key === 'would_work_again') {
                    data[key] = true;
                } else if (key.includes('rating') || key.includes('experience') || key.includes('satisfaction') || key.includes('likelihood')) {
                    data[key] = parseInt(value);
                } else if (key === 'payment_amount' || key === 'actual_hours_worked') {
                    data[key] = parseFloat(value) || null;
                } else {
                    data[key] = value || null;
                }
            }
            
            // Add unchecked checkboxes
            if (!formData.has('payment_received')) data.payment_received = false;
            if (!formData.has('would_work_again')) data.would_work_again = false;
            
            try {
                const response = await fetch(\`/api/questionnaires/${matchId}/provider-questionnaire\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    form.style.display = 'none';
                    successMessage.classList.remove('hidden');
                } else {
                    alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (result.error || 'ไม่ทราบสาเหตุ'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ส่งแบบสอบถาม';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
                submitBtn.disabled = false;
                submitBtn.textContent = 'ส่งแบบสอบถาม';
            }
        }
    </script>
</body>
</html>
  `;

  res.send(html);
});

// Direct access to customer questionnaire form
router.get('/customer/:matchId', (req, res) => {
  const { matchId } = req.params;
  const { name, job, category } = req.query;
  
  // Create HTML form for customer questionnaire
  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แบบประเมินการให้บริการ - JOB ชุมชน</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .star-rating { display: flex; align-items: center; }
        .star { cursor: pointer; color: #d1d5db; font-size: 1.5rem; transition: color 0.2s; }
        .star.active { color: #fbbf24; }
        .star:hover { color: #fbbf24; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">แบบประเมินการให้บริการ</h1>
                <div class="text-2xl font-bold text-blue-600">JOB ชุมชน</div>
                <p class="text-gray-600 mt-4">กรุณาให้คะแนนและประเมินการให้บริการ</p>
            </div>

            <!-- Service Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-medium text-gray-900 mb-2">ข้อมูลการให้บริการ</h3>
                <p class="text-sm text-gray-600">รหัสงาน: ${matchId}</p>
                ${name ? `<p class="text-sm text-gray-600">ผู้ให้บริการ: ${decodeURIComponent(name)}</p>` : ''}
                ${category ? `<p class="text-sm text-gray-600">ประเภทงาน: ${decodeURIComponent(category)}</p>` : ''}
                ${job ? `<p class="text-sm text-gray-600">รายละเอียด: ${decodeURIComponent(job)}</p>` : ''}
            </div>

            <form id="customerForm" onsubmit="submitForm(event)">
                <!-- Service Rating Section -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">⭐ คะแนนการให้บริการ</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            ${createStarRating('service_rating', 'คะแนนโดยรวม')}
                            ${createStarRating('service_quality', 'คุณภาพการให้บริการ')}
                            ${createStarRating('timeliness', 'ความตรงต่อเวลา')}
                            ${createStarRating('communication', 'การสื่อสาร')}
                        </div>
                        <div class="space-y-4">
                            ${createStarRating('professionalism', 'ความเป็นมืออาชีพ')}
                            ${createStarRating('value_for_money', 'ความคุ้มค่าของเงิน')}
                            ${createStarRating('overall_satisfaction', 'ความพึงพอใจโดยรวม')}
                        </div>
                    </div>
                </div>

                <!-- Service Assessment -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">✅ การประเมินบริการ</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาการทำงาน</label>
                            <select name="completion_time" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                <option value="faster">เร็วกว่าที่คาด</option>
                                <option value="on_time" selected>ตรงเวลาที่กำหนด</option>
                                <option value="slower">ช้ากว่าที่คาด</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ความเหมาะสมของราคา</label>
                            <select name="price_fairness" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                <option value="cheap">ถูกกว่าที่คาด</option>
                                <option value="fair" selected>เหมาะสมกับคุณภาพ</option>
                                <option value="expensive">แพงกว่าที่คาด</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-6 space-y-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="service_exceeded_expectations" name="service_exceeded_expectations" checked class="h-4 w-4 text-blue-600 rounded">
                            <label for="service_exceeded_expectations" class="ml-2 text-sm text-gray-900">การให้บริการเกินความคาดหวัง</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="would_recommend" name="would_recommend" checked class="h-4 w-4 text-blue-600 rounded">
                            <label for="would_recommend" class="ml-2 text-sm text-gray-900">จะแนะนำให้คนอื่นใช้บริการ</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="would_hire_again" name="would_hire_again" checked class="h-4 w-4 text-blue-600 rounded">
                            <label for="would_hire_again" class="ml-2 text-sm text-gray-900">จะจ้างผู้ให้บริการรายนี้อีก</label>
                        </div>
                    </div>
                </div>

                <!-- Detailed Feedback -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">💬 ความคิดเห็นรายละเอียด</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">สิ่งที่ประทับใจมากที่สุด</label>
                            <textarea name="positive_feedback" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="สิ่งที่ผู้ให้บริการทำได้ดีมาก..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">จุดที่ควรปรับปรุง</label>
                            <textarea name="areas_for_improvement" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="สิ่งที่ควรปรับปรุงหรือพัฒนาเพิ่มเติม..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">บริการเพิ่มเติมที่ได้รับ</label>
                            <textarea name="additional_services_received" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="บริการหรือคำแนะนำเพิ่มเติมที่ได้รับ..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ปัญหาที่พบ (ถ้ามี)</label>
                            <textarea name="problems_encountered" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ปัญหาหรือความไม่สะดวกที่พบ..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Experience and Recommendation -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">❤️ ประสบการณ์และคำแนะนำ</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">เหตุผลที่จะแนะนำ</label>
                            <textarea name="recommendation_reason" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="เหตุผลที่จะแนะนำผู้ให้บริการรายนี้..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">อธิบายประสบการณ์โดยรวม</label>
                            <textarea name="overall_experience_description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="อธิบายประสบการณ์การใช้บริการโดยรวม..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">สิ่งที่ชอบมากที่สุด</label>
                            <textarea name="favorite_aspect" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="สิ่งที่ชอบมากที่สุดในการให้บริการ..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ข้อเสนอแนะสำหรับผู้ให้บริการ</label>
                            <textarea name="suggestion_for_provider" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ข้อเสนอแนะเพื่อปรับปรุงการให้บริการ..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ข้อเสนอแนะสำหรับแพลตฟอร์ม</label>
                            <textarea name="platform_feedback" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="ข้อเสนอแนะเพื่อปรับปรุงแพลตฟอร์ม..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <button type="submit" id="submitBtn" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg">
                        ส่งแบบประเมิน
                    </button>
                </div>
            </form>

            <div id="successMessage" class="hidden text-center py-8">
                <div class="text-green-600 text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">ขอบคุณสำหรับการประเมิน!</h2>
                <p class="text-gray-600">แบบประเมินได้รับการบันทึกเรียบร้อยแล้ว</p>
            </div>
        </div>
    </div>

    <script>
        // Star rating functionality
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                const field = this.dataset.field;
                const stars = document.querySelectorAll(\`[data-field="\${field}"]\`);
                const hiddenInput = document.querySelector(\`input[name="\${field}"]\`);
                const textSpan = document.getElementById(\`\${field}_text\`);
                
                hiddenInput.value = rating;
                textSpan.textContent = \`\${rating} ดาว\`;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });

        // Form submission
        async function submitForm(event) {
            event.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const form = document.getElementById('customerForm');
            const successMessage = document.getElementById('successMessage');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังส่ง...';
            
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (key === 'service_exceeded_expectations' || key === 'would_recommend' || key === 'would_hire_again') {
                    data[key] = true;
                } else if (key.includes('rating') || key.includes('quality') || key.includes('timeliness') || 
                          key.includes('communication') || key.includes('professionalism') || 
                          key.includes('money') || key.includes('satisfaction')) {
                    data[key] = parseInt(value);
                } else {
                    data[key] = value || null;
                }
            }
            
            // Add unchecked checkboxes
            if (!formData.has('service_exceeded_expectations')) data.service_exceeded_expectations = false;
            if (!formData.has('would_recommend')) data.would_recommend = false;
            if (!formData.has('would_hire_again')) data.would_hire_again = false;
            
            try {
                const response = await fetch(\`/api/questionnaires/${matchId}/customer-questionnaire\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    form.style.display = 'none';
                    successMessage.classList.remove('hidden');
                } else {
                    alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (result.error || 'ไม่ทราบสาเหตุ'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ส่งแบบประเมิน';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
                submitBtn.disabled = false;
                submitBtn.textContent = 'ส่งแบบประเมิน';
            }
        }

        function createStarRating(field, label) {
            return \`
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">\${label}</label>
                    <div class="star-rating">
                        <input type="hidden" name="\${field}" value="5">
                        <span class="star active" data-rating="1" data-field="\${field}">⭐</span>
                        <span class="star active" data-rating="2" data-field="\${field}">⭐</span>
                        <span class="star active" data-rating="3" data-field="\${field}">⭐</span>
                        <span class="star active" data-rating="4" data-field="\${field}">⭐</span>
                        <span class="star active" data-rating="5" data-field="\${field}">⭐</span>
                        <span class="ml-2 text-sm text-gray-600" id="\${field}_text">5 ดาว</span>
                    </div>
                </div>
            \`;
        }
    </script>
</body>
</html>
  `;

  // Helper function to create star rating HTML
  function createStarRating(field, label) {
    return `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>
            <div class="star-rating">
                <input type="hidden" name="${field}" value="5">
                <span class="star active" data-rating="1" data-field="${field}">⭐</span>
                <span class="star active" data-rating="2" data-field="${field}">⭐</span>
                <span class="star active" data-rating="3" data-field="${field}">⭐</span>
                <span class="star active" data-rating="4" data-field="${field}">⭐</span>
                <span class="star active" data-rating="5" data-field="${field}">⭐</span>
                <span class="ml-2 text-sm text-gray-600" id="${field}_text">5 ดาว</span>
            </div>
        </div>
    `;
  }

  res.send(html);
});

// Get questionnaire statistics
router.get('/stats', (req, res) => {
  const queries = {
    providerStats: `
      SELECT 
        COUNT(*) as total_responses,
        AVG(overall_experience) as avg_experience,
        AVG(recommendation_likelihood) as avg_recommendation,
        AVG(customer_satisfaction) as avg_customer_satisfaction,
        COUNT(CASE WHEN payment_received = 1 THEN 1 END) as payments_received,
        COUNT(CASE WHEN would_work_again = 1 THEN 1 END) as would_work_again,
        AVG(actual_hours_worked) as avg_hours_worked,
        COUNT(CASE WHEN difficulty_level = 'easy' THEN 1 END) as easy_jobs,
        COUNT(CASE WHEN difficulty_level = 'medium' THEN 1 END) as medium_jobs,
        COUNT(CASE WHEN difficulty_level = 'hard' THEN 1 END) as hard_jobs
      FROM provider_questionnaires
    `,
    customerStats: `
      SELECT 
        COUNT(*) as total_responses,
        AVG(service_rating) as avg_service_rating,
        AVG(service_quality) as avg_service_quality,
        AVG(timeliness) as avg_timeliness,
        AVG(communication) as avg_communication,
        AVG(professionalism) as avg_professionalism,
        AVG(value_for_money) as avg_value_for_money,
        AVG(overall_satisfaction) as avg_overall_satisfaction,
        COUNT(CASE WHEN would_recommend = 1 THEN 1 END) as would_recommend,
        COUNT(CASE WHEN would_hire_again = 1 THEN 1 END) as would_hire_again,
        COUNT(CASE WHEN service_exceeded_expectations = 1 THEN 1 END) as exceeded_expectations,
        COUNT(CASE WHEN completion_time = 'faster' THEN 1 END) as completed_faster,
        COUNT(CASE WHEN completion_time = 'on_time' THEN 1 END) as completed_on_time,
        COUNT(CASE WHEN completion_time = 'slower' THEN 1 END) as completed_slower,
        COUNT(CASE WHEN price_fairness = 'cheap' THEN 1 END) as price_cheap,
        COUNT(CASE WHEN price_fairness = 'fair' THEN 1 END) as price_fair,
        COUNT(CASE WHEN price_fairness = 'expensive' THEN 1 END) as price_expensive
      FROM customer_questionnaires
    `,
    recentFeedback: `
      SELECT 
        'provider' as type,
        match_id,
        feedback_for_platform as feedback,
        created_at
      FROM provider_questionnaires
      WHERE feedback_for_platform IS NOT NULL AND feedback_for_platform != ''
      UNION ALL
      SELECT 
        'customer' as type,
        match_id,
        platform_feedback as feedback,
        created_at
      FROM customer_questionnaires
      WHERE platform_feedback IS NOT NULL AND platform_feedback != ''
      ORDER BY created_at DESC
      LIMIT 10
    `
  };
  
  const results = {};
  let completed = 0;
  
  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, row) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        results[key] = null;
      } else {
        results[key] = row;
      }
      
      completed++;
      if (completed === Object.keys(queries).length) {
        res.json({
          success: true,
          data: results
        });
      }
    });
  });
});

module.exports = router;