const db = require('../models/database');
const Joi = require('joi');

// Validation schema for customer
const customerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  phone: Joi.string().required().pattern(/^[0-9-]{10,12}$/),
  line_id: Joi.string().optional().allow(''),
  location: Joi.string().required().max(255),
  district: Joi.string().required().max(100),
  subdistrict: Joi.string().required().max(100),
  province: Joi.string().default('ราชบุรี'),
  service_category_id: Joi.number().integer().required(),
  job_description: Joi.string().required().max(1000),
  budget_range: Joi.string().optional().max(100),
  urgency_level: Joi.string().valid('low', 'medium', 'high').default('medium'),
  preferred_contact: Joi.string().valid('phone', 'line', 'both').default('phone'),
  is_active: Joi.boolean().default(true)
});

class CustomerController {
  
  // Get all customers with optional filtering
  async getCustomers(req, res) {
    try {
      const { 
        category_id, 
        district, 
        subdistrict,
        urgency_level,
        search, 
        page = 1, 
        limit = 10,
        sort_by = 'created_at',
        order = 'DESC'
      } = req.query;

      let sql = `
        SELECT 
          c.*,
          sc.name as category_name,
          sc.icon as category_icon
        FROM customers c
        LEFT JOIN service_categories sc ON c.service_category_id = sc.id
        WHERE c.is_active = 1
      `;
      
      const params = [];

      // Apply filters
      if (category_id) {
        sql += ' AND c.service_category_id = ?';
        params.push(category_id);
      }

      if (district) {
        sql += ' AND c.district LIKE ?';
        params.push(`%${district}%`);
      }

      if (subdistrict) {
        sql += ' AND c.subdistrict LIKE ?';
        params.push(`%${subdistrict}%`);
      }

      if (urgency_level) {
        sql += ' AND c.urgency_level = ?';
        params.push(urgency_level);
      }

      if (search) {
        sql += ' AND (c.name LIKE ? OR c.job_description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Add sorting
      const validSortFields = ['name', 'created_at', 'urgency_level'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      sql += ` ORDER BY c.${sortField} ${sortOrder}`;

      // Add pagination
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const customers = await db.all(sql, params);

      // Get total count for pagination
      let countSql = `
        SELECT COUNT(*) as total
        FROM customers c
        WHERE c.is_active = 1
      `;
      const countParams = [];
      
      if (category_id) {
        countSql += ' AND c.service_category_id = ?';
        countParams.push(category_id);
      }

      if (district) {
        countSql += ' AND c.district LIKE ?';
        countParams.push(`%${district}%`);
      }

      if (subdistrict) {
        countSql += ' AND c.subdistrict LIKE ?';
        countParams.push(`%${subdistrict}%`);
      }

      if (urgency_level) {
        countSql += ' AND c.urgency_level = ?';
        countParams.push(urgency_level);
      }

      if (search) {
        countSql += ' AND (c.name LIKE ? OR c.job_description LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`);
      }

      const totalResult = await db.get(countSql, countParams);
      const total = totalResult.total;

      res.json({
        success: true,
        data: customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message
      });
    }
  }

  // Get single customer by ID
  async getCustomer(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          c.*,
          sc.name as category_name,
          sc.icon as category_icon
        FROM customers c
        LEFT JOIN service_categories sc ON c.service_category_id = sc.id
        WHERE c.id = ?
      `;
      
      const customer = await db.get(sql, [id]);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Get customer's job matches
      const matchesSql = `
        SELECT 
          jm.*,
          sp.name as provider_name,
          sp.phone as provider_phone,
          sp.rating as provider_rating
        FROM job_matches jm
        LEFT JOIN service_providers sp ON jm.provider_id = sp.id
        WHERE jm.customer_id = ?
        ORDER BY jm.match_date DESC
      `;
      
      const matches = await db.all(matchesSql, [id]);

      res.json({
        success: true,
        data: {
          ...customer,
          job_matches: matches
        }
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer',
        error: error.message
      });
    }
  }

  // Create new customer
  async createCustomer(req, res) {
    try {
      const { error, value } = customerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const sql = `
        INSERT INTO customers (
          name, phone, line_id, location, district, subdistrict, province,
          service_category_id, job_description, budget_range, urgency_level,
          preferred_contact, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.run(sql, [
        value.name, value.phone, value.line_id, value.location,
        value.district, value.subdistrict, value.province,
        value.service_category_id, value.job_description, value.budget_range,
        value.urgency_level, value.preferred_contact, value.is_active
      ]);

      // Try to find matching providers automatically
      const matchingSql = `
        SELECT sp.*, 
               sc.name as category_name,
               (
                 CASE 
                   WHEN sp.district = ? THEN 50
                   WHEN sp.subdistrict = ? THEN 30
                   ELSE 0
                 END +
                 CASE 
                   WHEN sp.rating >= 4.5 THEN 30
                   WHEN sp.rating >= 4.0 THEN 20
                   WHEN sp.rating >= 3.5 THEN 10
                   ELSE 0
                 END +
                 CASE 
                   WHEN sp.total_jobs >= 100 THEN 20
                   WHEN sp.total_jobs >= 50 THEN 15
                   WHEN sp.total_jobs >= 20 THEN 10
                   ELSE 5
                 END
               ) as match_score
        FROM service_providers sp
        LEFT JOIN service_categories sc ON sp.service_category_id = sc.id
        WHERE sp.service_category_id = ? 
        AND sp.is_active = 1
        ORDER BY match_score DESC
        LIMIT 5
      `;

      const matchingProviders = await db.all(matchingSql, [
        value.district, value.subdistrict, value.service_category_id
      ]);

      // Create job matches for top providers
      for (const provider of matchingProviders) {
        await db.run(
          `INSERT INTO job_matches (provider_id, customer_id, match_score, status)
           VALUES (?, ?, ?, ?)`,
          [provider.id, result.id, provider.match_score / 100, 'pending']
        );
      }

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: {
          id: result.id,
          ...value,
          matching_providers: matchingProviders.length
        }
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message
      });
    }
  }

  // Update customer
  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = customerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const sql = `
        UPDATE customers SET
          name = ?, phone = ?, line_id = ?, location = ?, district = ?,
          subdistrict = ?, province = ?, service_category_id = ?,
          job_description = ?, budget_range = ?, urgency_level = ?,
          preferred_contact = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const result = await db.run(sql, [
        value.name, value.phone, value.line_id, value.location,
        value.district, value.subdistrict, value.province,
        value.service_category_id, value.job_description, value.budget_range,
        value.urgency_level, value.preferred_contact, value.is_active, id
      ]);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message
      });
    }
  }

  // Delete customer
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      
      const result = await db.run('DELETE FROM customers WHERE id = ?', [id]);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message
      });
    }
  }
}

module.exports = new CustomerController();