const db = require('../models/database');
const Joi = require('joi');

// Validation schema for provider
const providerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  phone: Joi.string().required().pattern(/^[0-9-]{10,12}$/),
  line_id: Joi.string().optional().allow(''),
  service_category_id: Joi.number().integer().required(),
  location: Joi.string().required().max(255),
  district: Joi.string().required().max(100),
  subdistrict: Joi.string().required().max(100),
  province: Joi.string().default('ราชบุรี'),
  description: Joi.string().optional().max(500),
  price_range: Joi.string().optional().max(100),
  available_days: Joi.string().optional().max(100),
  available_hours: Joi.string().optional().max(100),
  rating: Joi.number().min(0).max(5).optional(),
  total_jobs: Joi.number().integer().min(0).optional(),
  is_active: Joi.boolean().default(true)
});

class ProviderController {
  
  // Get all providers with optional filtering
  async getProviders(req, res) {
    try {
      const { 
        category_id, 
        district, 
        subdistrict, 
        search, 
        page = 1, 
        limit = 10,
        sort_by = 'rating',
        order = 'DESC'
      } = req.query;

      let sql = `
        SELECT 
          sp.*,
          sc.name as category_name,
          sc.icon as category_icon
        FROM service_providers sp
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE sp.is_active = 1
      `;
      
      const params = [];

      // Apply filters
      if (category_id) {
        sql += ' AND sp.service_category_id = ?';
        params.push(category_id);
      }

      if (district) {
        sql += ' AND sp.district LIKE ?';
        params.push(`%${district}%`);
      }

      if (subdistrict) {
        sql += ' AND sp.subdistrict LIKE ?';
        params.push(`%${subdistrict}%`);
      }

      if (search) {
        sql += ' AND (sp.name LIKE ? OR sp.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Add sorting
      const validSortFields = ['name', 'rating', 'total_jobs', 'created_at'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'rating';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      sql += ` ORDER BY sp.${sortField} ${sortOrder}`;

      // Add pagination
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const providers = await db.all(sql, params);

      // Get total count for pagination
      let countSql = `
        SELECT COUNT(*) as total
        FROM service_providers sp
        WHERE sp.is_active = 1
      `;
      const countParams = [];
      
      if (category_id) {
        countSql += ' AND sp.service_category_id = ?';
        countParams.push(category_id);
      }

      if (district) {
        countSql += ' AND sp.district LIKE ?';
        countParams.push(`%${district}%`);
      }

      if (subdistrict) {
        countSql += ' AND sp.subdistrict LIKE ?';
        countParams.push(`%${subdistrict}%`);
      }

      if (search) {
        countSql += ' AND (sp.name LIKE ? OR sp.description LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`);
      }

      const totalResult = await db.get(countSql, countParams);
      const total = totalResult.total;

      res.json({
        success: true,
        data: providers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch providers',
        error: error.message
      });
    }
  }

  // Get single provider by ID
  async getProvider(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          sp.*,
          sc.name as category_name,
          sc.icon as category_icon
        FROM service_providers sp
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE sp.id = ?
      `;
      
      const provider = await db.get(sql, [id]);

      if (!provider) {
        return res.status(404).json({
          success: false,
          message: 'Provider not found'
        });
      }

      // Get provider's job history
      const jobsSql = `
        SELECT 
          jm.*,
          c.name as customer_name,
          c.job_description
        FROM job_matches jm
        LEFT JOIN customers c ON jm.customer_id = c.id
        WHERE jm.provider_id = ?
        ORDER BY jm.match_date DESC
        LIMIT 10
      `;
      
      const jobs = await db.all(jobsSql, [id]);

      res.json({
        success: true,
        data: {
          ...provider,
          recent_jobs: jobs
        }
      });
    } catch (error) {
      console.error('Error fetching provider:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch provider',
        error: error.message
      });
    }
  }

  // Create new provider
  async createProvider(req, res) {
    try {
      const { error, value } = providerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const sql = `
        INSERT INTO service_providers (
          name, phone, line_id, service_category_id, location, district, subdistrict,
          province, description, price_range, available_days, available_hours, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.run(sql, [
        value.name, value.phone, value.line_id, value.service_category_id,
        value.location, value.district, value.subdistrict, value.province,
        value.description, value.price_range, value.available_days,
        value.available_hours, value.is_active
      ]);

      res.status(201).json({
        success: true,
        message: 'Provider created successfully',
        data: {
          id: result.id,
          ...value
        }
      });
    } catch (error) {
      console.error('Error creating provider:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create provider',
        error: error.message
      });
    }
  }

  // Update provider
  async updateProvider(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = providerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const sql = `
        UPDATE service_providers SET
          name = ?, phone = ?, line_id = ?, service_category_id = ?,
          location = ?, district = ?, subdistrict = ?, province = ?,
          description = ?, price_range = ?, available_days = ?,
          available_hours = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const result = await db.run(sql, [
        value.name, value.phone, value.line_id, value.service_category_id,
        value.location, value.district, value.subdistrict, value.province,
        value.description, value.price_range, value.available_days,
        value.available_hours, value.is_active, id
      ]);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Provider not found'
        });
      }

      res.json({
        success: true,
        message: 'Provider updated successfully'
      });
    } catch (error) {
      console.error('Error updating provider:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update provider',
        error: error.message
      });
    }
  }

  // Delete provider
  async deleteProvider(req, res) {
    try {
      const { id } = req.params;
      
      const result = await db.run('DELETE FROM service_providers WHERE id = ?', [id]);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Provider not found'
        });
      }

      res.json({
        success: true,
        message: 'Provider deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting provider:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete provider',
        error: error.message
      });
    }
  }

  // Get service categories
  async getCategories(req, res) {
    try {
      const categories = await db.all('SELECT * FROM service_categories ORDER BY name');
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }
}

module.exports = new ProviderController();