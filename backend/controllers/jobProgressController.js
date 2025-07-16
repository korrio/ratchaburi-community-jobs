const db = require('../models/database');
const Joi = require('joi');

// Job progress stages
const JOB_STAGES = {
  ACCEPTED: 'accepted',           // 1. รับงานแล้ว
  ARRIVED: 'arrived',             // 2. ถึงหน้างาน
  STARTED: 'started',             // 3. เริ่มดำเนินงาน
  COMPLETED: 'completed',         // 4. เสร็จงาน (รอ feedback ลูกค้า)
  CLOSED: 'closed'                // 5. ปิดงาน (ผู้ให้บริการกรอกแบบสอบถาม)
};

// Validation schemas
const progressUpdateSchema = Joi.object({
  stage: Joi.string().valid(...Object.values(JOB_STAGES)).required(),
  notes: Joi.string().optional().allow(''),
  location_info: Joi.string().optional().allow(''),
  estimated_duration: Joi.string().optional().allow(''),
  actual_duration: Joi.string().optional().allow(''),
  final_cost: Joi.number().optional()
});

const customerFeedbackSchema = Joi.object({
  service_rating: Joi.number().integer().min(1).max(5).required(),
  quality_rating: Joi.number().integer().min(1).max(5).required(),
  timeliness_rating: Joi.number().integer().min(1).max(5).required(),
  overall_rating: Joi.number().integer().min(1).max(5).required(),
  feedback_text: Joi.string().optional().allow(''),
  would_recommend: Joi.boolean().optional(),
  would_hire_again: Joi.boolean().optional()
});

// Helper function to get stage statistics
async function getStageStatistics() {
  try {
    const stats = await db.all(`
      SELECT 
        job_progress,
        COUNT(*) as count
      FROM job_matches 
      WHERE job_progress IS NOT NULL
      GROUP BY job_progress
    `);

    const result = {
      total_jobs: stats.reduce((sum, stat) => sum + stat.count, 0),
      accepted: 0,
      arrived: 0,
      started: 0,
      completed: 0,
      closed: 0
    };

    stats.forEach(stat => {
      switch(stat.job_progress) {
        case JOB_STAGES.ACCEPTED:
          result.accepted = stat.count;
          break;
        case JOB_STAGES.ARRIVED:
          result.arrived = stat.count;
          break;
        case JOB_STAGES.STARTED:
          result.started = stat.count;
          break;
        case JOB_STAGES.COMPLETED:
          result.completed = stat.count;
          break;
        case JOB_STAGES.CLOSED:
          result.closed = stat.count;
          break;
      }
    });

    return result;
  } catch (error) {
    console.error('Error getting stage statistics:', error);
    return { 
      total_jobs: 0, 
      accepted: 0,
      arrived: 0,
      started: 0,
      completed: 0,
      closed: 0
    };
  }
}

class JobProgressController {

  // Update job progress to next stage
  async updateJobProgress(req, res) {
    try {
      const { matchId } = req.params;
      const { error, value } = progressUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Check if match exists
      const match = await db.get('SELECT * FROM job_matches WHERE id = ?', [matchId]);
      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Job match not found'
        });
      }

      const { stage, notes, location_info, estimated_duration, actual_duration, final_cost } = value;

      // Update job_matches table with progress and timestamps
      let updateFields = ['job_progress = ?'];
      let updateValues = [stage];

      switch (stage) {
        case JOB_STAGES.ACCEPTED:
          updateFields.push('response_date = CURRENT_TIMESTAMP');
          break;
        case JOB_STAGES.ARRIVED:
          updateFields.push('arrival_time = CURRENT_TIMESTAMP');
          break;
        case JOB_STAGES.STARTED:
          updateFields.push('start_time = CURRENT_TIMESTAMP');
          if (estimated_duration) {
            updateFields.push('estimated_duration = ?');
            updateValues.push(estimated_duration);
          }
          break;
        case JOB_STAGES.COMPLETED:
          updateFields.push('completion_date = CURRENT_TIMESTAMP');
          if (actual_duration) {
            updateFields.push('actual_duration = ?');
            updateValues.push(actual_duration);
          }
          if (final_cost) {
            updateFields.push('final_cost = ?');
            updateValues.push(final_cost);
          }
          break;
        case JOB_STAGES.CLOSED:
          updateFields.push('final_close_date = CURRENT_TIMESTAMP');
          break;
      }

      updateValues.push(matchId);

      const updateSql = `UPDATE job_matches SET ${updateFields.join(', ')} WHERE id = ?`;
      await db.run(updateSql, updateValues);

      // Insert progress tracking record
      await db.run(
        'INSERT INTO job_progress_tracking (match_id, stage, status, notes, location_info, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
        [matchId, stage, 'completed', notes || '', location_info || '', 'system']
      );

      // Add to history
      await db.run(
        'INSERT INTO match_history (match_id, action, description) VALUES (?, ?, ?)',
        [matchId, 'progress_update', `Job progress updated to ${stage}`]
      );

      res.json({
        success: true,
        message: `Job progress updated to ${stage}`,
        data: {
          match_id: matchId,
          stage: stage,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error updating job progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job progress',
        error: error.message
      });
    }
  }

  // Get job progress history
  async getJobProgress(req, res) {
    try {
      const { matchId } = req.params;

      // Get current match status
      const match = await db.get(`
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          c.name as customer_name,
          c.phone as customer_phone,
          c.job_description,
          sc.name as category_name,
          sc.icon as category_icon
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN customers c ON jm.customer_id = c.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE jm.id = ?
      `, [matchId]);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Job match not found'
        });
      }

      // Get progress tracking history
      const progressHistory = await db.all(
        'SELECT * FROM job_progress_tracking WHERE match_id = ? ORDER BY timestamp ASC',
        [matchId]
      );

      // Get customer feedback if exists
      const customerFeedback = await db.get(
        'SELECT * FROM customer_job_feedback WHERE match_id = ?',
        [matchId]
      );

      res.json({
        success: true,
        data: {
          match: match,
          current_stage: match.job_progress || 'pending',
          progress_history: progressHistory,
          customer_feedback: customerFeedback,
          stage_definitions: this.getStageDefinitions()
        }
      });

    } catch (error) {
      console.error('Error fetching job progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job progress',
        error: error.message
      });
    }
  }

  // Submit customer feedback (Stage 4)
  async submitCustomerFeedback(req, res) {
    try {
      const { matchId } = req.params;
      const { error, value } = customerFeedbackSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Check if match exists and is in completed stage
      const match = await db.get('SELECT * FROM job_matches WHERE id = ? AND job_progress = ?', [matchId, JOB_STAGES.COMPLETED]);
      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Job match not found or not in completed stage'
        });
      }

      // Insert customer feedback
      await db.run(
        `INSERT INTO customer_job_feedback 
         (match_id, service_rating, quality_rating, timeliness_rating, overall_rating, feedback_text, would_recommend, would_hire_again) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          matchId,
          value.service_rating,
          value.quality_rating,
          value.timeliness_rating,
          value.overall_rating,
          value.feedback_text || '',
          value.would_recommend !== undefined ? value.would_recommend : true,
          value.would_hire_again !== undefined ? value.would_hire_again : true
        ]
      );

      // Update match with overall rating
      await db.run(
        'UPDATE job_matches SET rating = ?, feedback = ? WHERE id = ?',
        [value.overall_rating, value.feedback_text || '', matchId]
      );

      // Add progress tracking
      await db.run(
        'INSERT INTO job_progress_tracking (match_id, stage, status, notes, updated_by) VALUES (?, ?, ?, ?, ?)',
        [matchId, 'feedback_received', 'completed', 'Customer feedback submitted', 'customer']
      );

      res.json({
        success: true,
        message: 'Customer feedback submitted successfully',
        data: {
          match_id: matchId,
          overall_rating: value.overall_rating
        }
      });

    } catch (error) {
      console.error('Error submitting customer feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit customer feedback',
        error: error.message
      });
    }
  }

  // Get all jobs with progress for admin dashboard
  async getAllJobsWithProgress(req, res) {
    try {
      const { stage, provider_id, customer_id, page = 1, limit = 20 } = req.query;

      let whereConditions = ['1=1'];
      let params = [];

      if (stage) {
        whereConditions.push('jm.job_progress = ?');
        params.push(stage);
      }

      if (provider_id) {
        whereConditions.push('jm.provider_id = ?');
        params.push(provider_id);
      }

      if (customer_id) {
        whereConditions.push('jm.customer_id = ?');
        params.push(customer_id);
      }

      const offset = (page - 1) * limit;

      const sql = `
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          c.name as customer_name,
          c.phone as customer_phone,
          c.job_description,
          c.urgency_level,
          sc.name as category_name,
          sc.icon as category_icon,
          cf.overall_rating as customer_rating,
          cf.feedback_text as customer_feedback
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN customers c ON jm.customer_id = c.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        LEFT JOIN customer_job_feedback cf ON jm.id = cf.match_id
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY jm.match_date DESC
        LIMIT ? OFFSET ?
      `;

      params.push(parseInt(limit), parseInt(offset));
      const jobs = await db.all(sql, params);

      // Get total count
      const countSql = `
        SELECT COUNT(*) as total
        FROM job_matches jm
        WHERE ${whereConditions.join(' AND ')}
      `;
      const countResult = await db.get(countSql, params.slice(0, -2));

      res.json({
        success: true,
        data: jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        },
        stage_stats: await getStageStatistics()
      });

    } catch (error) {
      console.error('Error fetching jobs with progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs with progress',
        error: error.message
      });
    }
  }


  // Helper method to get stage definitions
  getStageDefinitions() {
    return {
      [JOB_STAGES.ACCEPTED]: {
        name: 'รับงานแล้ว',
        description: 'ผู้ให้บริการตอบรับงานแล้ว รอการเดินทางไปยังสถานที่',
        color: 'blue',
        next_actions: ['ถึงหน้างาน']
      },
      [JOB_STAGES.ARRIVED]: {
        name: 'ถึงหน้างาน',
        description: 'ผู้ให้บริการมาถึงสถานที่ทำงานแล้ว',
        color: 'yellow',
        next_actions: ['เริ่มดำเนินงาน']
      },
      [JOB_STAGES.STARTED]: {
        name: 'เริ่มดำเนินงาน',
        description: 'กำลังดำเนินงานอยู่',
        color: 'orange',
        next_actions: ['เสร็จงาน']
      },
      [JOB_STAGES.COMPLETED]: {
        name: 'เสร็จงาน',
        description: 'งานเสร็จแล้ว รอลูกค้าให้ feedback และ rating',
        color: 'purple',
        next_actions: ['รอ feedback ลูกค้า']
      },
      [JOB_STAGES.CLOSED]: {
        name: 'ปิดงาน',
        description: 'งานปิดสมบูรณ์แล้ว ผู้ให้บริการกรอกแบบสอบถามเรียบร้อย',
        color: 'green',
        next_actions: []
      }
    };
  }
}

module.exports = new JobProgressController();