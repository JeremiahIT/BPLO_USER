const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
// const { auth } = require('../middleware/auth'); // AUTH DISABLED

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and image formats
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, and DOC files are allowed.'), false);
    }
  }
});

// Get all requirements
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM requirements ORDER BY name');
    res.json({ requirements: result.rows });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload requirement file for a permit
router.post('/upload/:permitId/:requirementId', upload.single('file'), async (req, res) => {
  try {
    const { permitId, requirementId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Verify permit exists (AUTH DISABLED)
    const permitResult = await db.query('SELECT id FROM business_permits WHERE id = $1', [permitId]);
    if (permitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    // Verify requirement exists
    const requirementResult = await db.query('SELECT * FROM requirements WHERE id = $1', [requirementId]);
    if (requirementResult.rows.length === 0) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Check if requirement already uploaded for this permit
    const existingResult = await db.query(
      'SELECT * FROM permit_requirements WHERE permit_id = $1 AND requirement_id = $2',
      [permitId, requirementId]
    );

    if (existingResult.rows.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE permit_requirements 
         SET file_path = $1, file_name = $2, file_size = $3, uploaded_at = CURRENT_TIMESTAMP
         WHERE permit_id = $4 AND requirement_id = $5`,
        [file.path, file.originalname, file.size, permitId, requirementId]
      );
    } else {
      // Create new record
      await db.query(
        `INSERT INTO permit_requirements (permit_id, requirement_id, file_path, file_name, file_size)
         VALUES ($1, $2, $3, $4, $5)`,
        [permitId, requirementId, file.path, file.originalname, file.size]
      );
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        name: file.originalname,
        size: file.size,
        path: file.path
      }
    });
  } catch (error) {
    console.error('Upload requirement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get requirements for a specific permit (AUTH DISABLED)
router.get('/permit/:permitId', async (req, res) => {
  try {
    const { permitId } = req.params;

    // Verify permit exists (AUTH DISABLED)
    const permitResult = await db.query('SELECT id FROM business_permits WHERE id = $1', [permitId]);
    if (permitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    const result = await db.query(
      `SELECT 
        r.*,
        pr.file_path,
        pr.file_name,
        pr.file_size,
        pr.uploaded_at,
        CASE WHEN pr.id IS NOT NULL THEN true ELSE false END as is_uploaded
       FROM requirements r
       LEFT JOIN permit_requirements pr ON r.id = pr.requirement_id AND pr.permit_id = $1
       ORDER BY r.name`,
      [permitId]
    );

    res.json({ requirements: result.rows });
  } catch (error) {
    console.error('Get permit requirements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download requirement file
router.get('/download/:permitId/:requirementId', async (req, res) => {
  try {
    const { permitId, requirementId } = req.params;

    // Verify permit exists (AUTH DISABLED)
    const permitResult = await db.query('SELECT id FROM business_permits WHERE id = $1', [permitId]);
    if (permitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    // Get file information
    const result = await db.query(
      `SELECT pr.*, r.name as requirement_name
       FROM permit_requirements pr
       JOIN requirements r ON pr.requirement_id = r.id
       WHERE pr.permit_id = $1 AND pr.requirement_id = $2`,
      [permitId, requirementId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileInfo = result.rows[0];

    // Check if file exists
    if (!fs.existsSync(fileInfo.file_path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Send file
    res.download(fileInfo.file_path, fileInfo.file_name);
  } catch (error) {
    console.error('Download requirement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete requirement file
router.delete('/:permitId/:requirementId', async (req, res) => {
  try {
    const { permitId, requirementId } = req.params;

    // Verify permit exists (AUTH DISABLED)
    const permitResult = await db.query('SELECT id FROM business_permits WHERE id = $1', [permitId]);
    if (permitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    // Get file information
    const result = await db.query(
      'SELECT * FROM permit_requirements WHERE permit_id = $1 AND requirement_id = $2',
      [permitId, requirementId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileInfo = result.rows[0];

    // Delete file from filesystem
    if (fs.existsSync(fileInfo.file_path)) {
      fs.unlinkSync(fileInfo.file_path);
    }

    // Delete record from database
    await db.query(
      'DELETE FROM permit_requirements WHERE permit_id = $1 AND requirement_id = $2',
      [permitId, requirementId]
    );

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete requirement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 