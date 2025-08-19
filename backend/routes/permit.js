const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const multer = require('multer'); // For file uploads
const path = require('path');
const router = express.Router();

// -------------------- Multer setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// -------------------- Routes --------------------

// GET all permits
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT bp.* FROM business_permits bp ORDER BY bp.created_at DESC`
    );
    res.json({ permits: result.rows });
  } catch (error) {
    console.error('Get permits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all permits with user info
router.get('/all', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT bp.*, u.first_name, u.last_name, u.email
      FROM business_permits bp
      LEFT JOIN users u ON bp.user_id = u.id
    `;
    const params = [];
    if (status) {
      query += ' WHERE bp.status = $1';
      params.push(status);
    }
    query += ` ORDER BY bp.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    res.json({ permits: result.rows });
  } catch (error) {
    console.error('Get all permits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single permit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const permitResult = await db.query(`SELECT * FROM business_permits WHERE id = $1`, [id]);
    if (permitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }
    const permit = permitResult.rows[0];

    // Get requirements
    const requirementsResult = await db.query(
      `SELECT pr.*, r.name as requirement_name, r.description as requirement_description
       FROM permit_requirements pr
       JOIN requirements r ON pr.requirement_id = r.id
       WHERE pr.permit_id = $1`, [id]
    );

    res.json({ permit: { ...permit, requirements: requirementsResult.rows } });
  } catch (error) {
    console.error('Get permit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Create new permit --------------------
// Using multer to handle optional file uploads
router.post('/', 
  upload.fields([
    { name: 'dtiCertificate' }, 
    { name: 'secCertificate' }, 
    { name: 'cdaCertificate' }, 
    { name: 'birCertificate' }
  ]),
  [
    body('business_type').notEmpty(),
    body('business_name').notEmpty(),
    body('owner_first_name').notEmpty(),
    body('owner_last_name').notEmpty(),
    body('email').isEmail().withMessage('Invalid email format'),
    body('mobile').matches(/^\+639\d{9}$/).withMessage('Invalid Philippine mobile number')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const {
        business_type,
        registration_number,
        business_name,
        tax_identification_number,
        trade_name,
        owner_first_name,
        owner_middle_name,
        owner_last_name,
        owner_extension_name,
        owner_sex,
        mail_address,
        telephone,
        mobile,
        email
      } = req.body;

      // Save uploaded file paths
      const files = req.files || {};
      const dtiCertificate = files.dtiCertificate ? files.dtiCertificate[0].path : null;
      const secCertificate = files.secCertificate ? files.secCertificate[0].path : null;
      const cdaCertificate = files.cdaCertificate ? files.cdaCertificate[0].path : null;
      const birCertificate = files.birCertificate ? files.birCertificate[0].path : null;

      // Generate permit number
      const permitNumber = `BPLO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const result = await db.query(
        `INSERT INTO business_permits (
          permit_number, business_type, registration_number, business_name,
          tax_identification_number, trade_name, owner_first_name, owner_middle_name,
          owner_last_name, owner_extension_name, owner_sex, mail_address, telephone,
          mobile, email, dti_certificate, sec_certificate, cda_certificate, bir_certificate
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        RETURNING *`,
        [
          permitNumber, business_type, registration_number, business_name,
          tax_identification_number, trade_name, owner_first_name, owner_middle_name,
          owner_last_name, owner_extension_name, owner_sex, mail_address, telephone,
          mobile, email, dtiCertificate, secCertificate, cdaCertificate, birCertificate
        ]
      );

      res.status(201).json({ message: 'Permit created successfully', permit: result.rows[0] });
    } catch (error) {
      console.error('Create permit error:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- Update permit status --------------------
router.patch('/:id/status', [
  body('status').isIn(['pending', 'under_review', 'approved', 'rejected', 'requires_changes']),
  body('notes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { status, notes } = req.body;

    await db.query(
      'UPDATE business_permits SET status=$1, notes=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3',
      [status, notes || null, id]
    );

    res.json({ message: 'Permit status updated successfully' });
  } catch (error) {
    console.error('Update permit status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
