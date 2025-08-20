const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
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
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// -------------------- Database connection middleware --------------------
const checkDatabase = (req, res, next) => {
  if (!db || !db.query) {
    console.error('Database connection not available');
    return res.status(500).json({ error: 'Database connection failed' });
  }
  next();
};

// -------------------- Create new permit --------------------
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
      console.log('Body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
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

      console.log('Inserting into database with permit number:', permitNumber);

      // Use db.query instead of sequelize
      const result = await db.query(
        `INSERT INTO business_permits (
          permit_number, business_type, registration_number, business_name,
          tax_identification_number, trade_name, owner_first_name, owner_middle_name,
          owner_last_name, owner_extension_name, owner_sex, mail_address, telephone,
          mobile, email, dti_certificate, sec_certificate, cda_certificate, bir_certificate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *`,
        [
          permitNumber, 
          business_type, 
          registration_number || null, 
          business_name,
          tax_identification_number || null, 
          trade_name || null, 
          owner_first_name,
          owner_middle_name || null,
          owner_last_name,
          owner_extension_name, 
          owner_sex || null, 
          mail_address,
          telephone,
          mobile,
          email, 
          dtiCertificate, 
          secCertificate, 
          cdaCertificate, 
          birCertificate
        ]
      );

      console.log('Permit created successfully:', result.rows[0]);

      res.status(201).json({ 
        message: 'Permit created successfully', 
        permit: result.rows[0] 
      });

    } catch (error) {
      console.error('Create permit error details:', error);
      res.status(500).json({ 
        error: 'Server error creating permit', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
});

// -------------------- GET all permits --------------------
router.get('/', checkDatabase, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM business_permits ORDER BY created_at DESC`
    );
    res.json({ permits: result.rows });
  } catch (error) {
    console.error('Get permits error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// -------------------- GET single permit --------------------
router.get('/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM business_permits WHERE id = $1`, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }
    
    res.json({ permit: result.rows[0] });
  } catch (error) {
    console.error('Get permit error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;