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