const express = require('express');
const { body, validationResult } = require('express-validator');
const sequelize = require('../config/database'); // ✅ Correct import
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// -------------------- Ensure uploads directory exists --------------------
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// -------------------- Multer setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// -------------------- Database connection middleware --------------------
const checkDatabase = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

// -------------------- POST /api/permits — Create New Permit --------------------
router.post('/', 
  checkDatabase,
  upload.fields([
    { name: 'dtiCertificate', maxCount: 1 }, 
    { name: 'secCertificate', maxCount: 1 }, 
    { name: 'cdaCertificate', maxCount: 1 }, 
    { name: 'birCertificate', maxCount: 1 }
  ]),
  [
    body('business_type').notEmpty().withMessage('Business type is required'),
    body('business_name').notEmpty().withMessage('Business name is required'),
    body('owner_first_name').notEmpty().withMessage('Owner first name is required'),
    body('owner_last_name').notEmpty().withMessage('Owner last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('mobile').matches(/^\+639\d{9}$/).withMessage('Invalid Philippine mobile number format (+639XXXXXXXXX)'),
    body('mail_address').notEmpty().withMessage('Mailing address is required')
  ],
  async (req, res) => {
    try {
      console.log('Received permit creation request');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors.array() 
        });
      }

      const {
        business_type,
        registration_number,
        business_name,
        tax_identification_number,
        trade_name,
        owner_first_name,
        owner_middle_name,
        owner_last_name,
        owner_extension_name = null,
        owner_sex,
        mail_address,
        telephone = null,
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

      // Insert using raw SQL
      const [result] = await sequelize.query(
        `INSERT INTO business_permits (
          permit_number, business_type, registration_number, business_name,
          tax_identification_number, trade_name, owner_first_name, owner_middle_name,
          owner_last_name, owner_extension_name, owner_sex, mail_address, telephone,
          mobile, email, dti_certificate, sec_certificate, cda_certificate, bir_certificate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *`,
        {
          replacements: [
            permitNumber,
            business_type,
            registration_number || null,
            business_name,
            tax_identification_number || null,
            trade_name || null,
            owner_first_name,
            owner_middle_name || null,
            owner_last_name,
            owner_extension_name || null,
            owner_sex || null,
            mail_address,
            telephone || null,
            mobile,
            email,
            dtiCertificate,
            secCertificate,
            cdaCertificate,
            birCertificate
          ],
          type: sequelize.QueryTypes.INSERT
        }
      );

      res.status(201).json({
        message: 'Permit created successfully',
        permit: result[0] // Only one row returned
      });

    } catch (error) {
      console.error('Create permit error details:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
});

// -------------------- GET /api/permits — All Permits --------------------
router.get('/', checkDatabase, async (req, res) => {
  try {
    const [permits] = await sequelize.query(
      `SELECT * FROM business_permits ORDER BY created_at DESC`
    );
    res.json({ permits });
  } catch (error) {
    console.error('Get permits error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// -------------------- GET /api/permits/:id — Single Permit --------------------
router.get('/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await sequelize.query(
      `SELECT * FROM business_permits WHERE id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!result.length) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    res.json({ permit: result[0] });
  } catch (error) {
    console.error('Get permit error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
