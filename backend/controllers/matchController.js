const db = require('../models/database');
const Joi = require('joi');

// Validation schema for match status update
const matchStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled').required(),
  provider_response: Joi.string().optional().allow(''),
  customer_response: Joi.string().optional().allow(''),
  rating: Joi.number().integer().min(1).max(5).optional(),
  feedback: Joi.string().optional().allow('')
});

class MatchController {
  
  // Get all matches with filtering
  async getMatches(req, res) {
    try {
      const { 
        provider_id, 
        customer_id, 
        status, 
        page = 1, 
        limit = 10,
        sort_by = 'match_date',
        order = 'DESC'
      } = req.query;

      let sql = `
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          sp.rating as provider_rating,
          sp.service_category_id,
          sp.price_range as provider_price_range,
          sp.location as provider_location,
          sp.district as provider_district,
          sp.subdistrict as provider_subdistrict,
          sp.available_days as provider_available_days,
          sp.available_hours as provider_available_hours,
          c.name as customer_name,
          c.phone as customer_phone,
          c.job_description,
          c.budget_range,
          c.urgency_level,
          c.location as customer_location,
          c.district as customer_district,
          c.subdistrict as customer_subdistrict,
          c.preferred_date as customer_preferred_date,
          c.preferred_time as customer_preferred_time,
          sc.name as category_name,
          sc.icon as category_icon
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN customers c ON jm.customer_id = c.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE 1=1
      `;
      
      const params = [];

      // Apply filters
      if (provider_id) {
        sql += ' AND jm.provider_id = ?';
        params.push(provider_id);
      }

      if (customer_id) {
        sql += ' AND jm.customer_id = ?';
        params.push(customer_id);
      }

      if (status) {
        sql += ' AND jm.status = ?';
        params.push(status);
      }

      // Add sorting
      const validSortFields = ['match_date', 'match_score', 'response_date'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'match_date';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      sql += ` ORDER BY jm.${sortField} ${sortOrder}`;

      // Add pagination
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const matches = await db.all(sql, params);

      // Get total count for pagination
      let countSql = `
        SELECT COUNT(*) as total
        FROM job_matches jm
        WHERE 1=1
      `;
      const countParams = [];
      
      if (provider_id) {
        countSql += ' AND jm.provider_id = ?';
        countParams.push(provider_id);
      }

      if (customer_id) {
        countSql += ' AND jm.customer_id = ?';
        countParams.push(customer_id);
      }

      if (status) {
        countSql += ' AND jm.status = ?';
        countParams.push(status);
      }

      const totalResult = await db.get(countSql, countParams);
      const total = totalResult.total;

      res.json({
        success: true,
        data: matches,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch matches',
        error: error.message
      });
    }
  }

  // Get single match by ID
  async getMatch(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          sp.line_id as provider_line_id,
          sp.rating as provider_rating,
          sp.price_range as provider_price_range,
          sp.location as provider_location,
          sp.district as provider_district,
          sp.subdistrict as provider_subdistrict,
          c.name as customer_name,
          c.phone as customer_phone,
          c.line_id as customer_line_id,
          c.job_description,
          c.budget_range,
          c.urgency_level,
          c.preferred_contact,
          c.location as customer_location,
          c.district as customer_district,
          c.subdistrict as customer_subdistrict,
          sc.name as category_name,
          sc.icon as category_icon
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN customers c ON jm.customer_id = c.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE jm.id = ?
      `;
      
      const match = await db.get(sql, [id]);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      // Get match history
      const historySql = `
        SELECT * FROM match_history 
        WHERE match_id = ? 
        ORDER BY timestamp DESC
      `;
      
      const history = await db.all(historySql, [id]);

      res.json({
        success: true,
        data: {
          ...match,
          history
        }
      });
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch match',
        error: error.message
      });
    }
  }

  // Update match status
  async updateMatchStatus(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = matchStatusSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Check if match exists
      const existingMatch = await db.get('SELECT * FROM job_matches WHERE id = ?', [id]);
      if (!existingMatch) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      // Update match
      const sql = `
        UPDATE job_matches SET
          status = ?, 
          provider_response = ?, 
          customer_response = ?,
          rating = ?,
          feedback = ?,
          response_date = CURRENT_TIMESTAMP,
          completion_date = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completion_date END
        WHERE id = ?
      `;

      await db.run(sql, [
        value.status,
        value.provider_response || existingMatch.provider_response,
        value.customer_response || existingMatch.customer_response,
        value.rating || existingMatch.rating,
        value.feedback || existingMatch.feedback,
        value.status,
        id
      ]);

      // Add to history
      await db.run(
        'INSERT INTO match_history (match_id, action, description) VALUES (?, ?, ?)',
        [id, 'status_change', `Status changed to ${value.status}`]
      );

      // Update provider stats if job completed
      if (value.status === 'completed') {
        await db.run(
          'UPDATE service_providers SET total_jobs = total_jobs + 1 WHERE id = ?',
          [existingMatch.provider_id]
        );

        // Update provider rating if rating provided
        if (value.rating) {
          const ratingResult = await db.get(
            `SELECT AVG(rating) as avg_rating, COUNT(*) as count 
             FROM job_matches 
             WHERE provider_id = ? AND rating IS NOT NULL`,
            [existingMatch.provider_id]
          );
          
          if (ratingResult.avg_rating) {
            await db.run(
              'UPDATE service_providers SET rating = ? WHERE id = ?',
              [ratingResult.avg_rating, existingMatch.provider_id]
            );
          }
        }
      }

      res.json({
        success: true,
        message: 'Match status updated successfully'
      });
    } catch (error) {
      console.error('Error updating match status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update match status',
        error: error.message
      });
    }
  }

  // Create manual match
  async createMatch(req, res) {
    try {
      const { provider_id, customer_id } = req.body;

      if (!provider_id || !customer_id) {
        return res.status(400).json({
          success: false,
          message: 'Provider ID and Customer ID are required'
        });
      }

      // Check if provider and customer exist
      const provider = await db.get('SELECT * FROM service_providers WHERE id = ?', [provider_id]);
      const customer = await db.get('SELECT * FROM customers WHERE id = ?', [customer_id]);

      if (!provider || !customer) {
        return res.status(404).json({
          success: false,
          message: 'Provider or customer not found'
        });
      }

      // Check if match already exists
      const existingMatch = await db.get(
        'SELECT * FROM job_matches WHERE provider_id = ? AND customer_id = ?',
        [provider_id, customer_id]
      );

      if (existingMatch) {
        return res.status(400).json({
          success: false,
          message: 'Match already exists'
        });
      }

      // Calculate match score
      let matchScore = 0;
      
      // Same service category
      if (provider.service_category_id === customer.service_category_id) {
        matchScore += 0.4;
      }

      // Location proximity
      if (provider.district === customer.district) {
        matchScore += 0.3;
        if (provider.subdistrict === customer.subdistrict) {
          matchScore += 0.2;
        }
      }

      // Provider rating
      matchScore += (provider.rating / 5) * 0.1;

      // Create match
      const result = await db.run(
        'INSERT INTO job_matches (provider_id, customer_id, match_score, status) VALUES (?, ?, ?, ?)',
        [provider_id, customer_id, matchScore, 'pending']
      );

      // Add to history
      await db.run(
        'INSERT INTO match_history (match_id, action, description) VALUES (?, ?, ?)',
        [result.id, 'created', 'Manual match created']
      );

      res.status(201).json({
        success: true,
        message: 'Match created successfully',
        data: {
          id: result.id,
          provider_id,
          customer_id,
          match_score: matchScore,
          status: 'pending'
        }
      });
    } catch (error) {
      console.error('Error creating match:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create match',
        error: error.message
      });
    }
  }

  // Get auto-generated matches
  async getAutoMatches(req, res) {
    try {
      const { limit = 20 } = req.query;

      const sql = `
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          sp.rating as provider_rating,
          c.name as customer_name,
          c.phone as customer_phone,
          c.job_description,
          c.urgency_level,
          sc.name as category_name,
          sc.icon as category_icon
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN customers c ON jm.customer_id = c.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE jm.match_score >= 0.5
        ORDER BY jm.match_score DESC, jm.match_date DESC
        LIMIT ?
      `;

      const matches = await db.all(sql, [parseInt(limit)]);

      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      console.error('Error fetching auto matches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch auto matches',
        error: error.message
      });
    }
  }

  // Get match statistics
  async getMatchStats(req, res) {
    try {
      const totalMatches = await db.get('SELECT COUNT(*) as count FROM job_matches');
      const pendingMatches = await db.get('SELECT COUNT(*) as count FROM job_matches WHERE status = "pending"');
      const acceptedMatches = await db.get('SELECT COUNT(*) as count FROM job_matches WHERE status = "accepted"');
      const completedMatches = await db.get('SELECT COUNT(*) as count FROM job_matches WHERE status = "completed"');
      const rejectedMatches = await db.get('SELECT COUNT(*) as count FROM job_matches WHERE status = "rejected"');

      const avgMatchScore = await db.get('SELECT AVG(match_score) as avg FROM job_matches');
      const avgRating = await db.get('SELECT AVG(rating) as avg FROM job_matches WHERE rating IS NOT NULL');

      // Top categories
      const topCategories = await db.all(`
        SELECT 
          sc.name,
          sc.icon,
          COUNT(jm.id) as match_count
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        GROUP BY sc.id, sc.name, sc.icon
        ORDER BY match_count DESC
        LIMIT 5
      `);

      res.json({
        success: true,
        data: {
          total_matches: totalMatches.count,
          pending_matches: pendingMatches.count,
          accepted_matches: acceptedMatches.count,
          completed_matches: completedMatches.count,
          rejected_matches: rejectedMatches.count,
          avg_match_score: avgMatchScore.avg || 0,
          avg_rating: avgRating.avg || 0,
          top_categories: topCategories
        }
      });
    } catch (error) {
      console.error('Error fetching match stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch match statistics',
        error: error.message
      });
    }
  }
}

module.exports = new MatchController();