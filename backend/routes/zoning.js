const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // Your DB connection module

const router = express.Router();

/**
 * POST /submit-zoning
 * Insert a new zoning form into the database
 */
router.post(
  '/submit-zoning',
  [
    body('businessName').notEmpty().withMessage('Business Name is required'),
    body('businessAddress').notEmpty().withMessage('Business Address is required'),
    body('emailAddress').isEmail().withMessage('Valid Email Address is required'),
    body('contactNumber').notEmpty().withMessage('Contact Number is required'),
    body('tin').notEmpty().withMessage('TIN is required'),
    body('zoningClassification').notEmpty().withMessage('Zoning Classification is required'),
    body('oboClearanceFee').isFloat({ min: 0 }).withMessage('OBO Clearance Fee must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      businessName,
      businessAddress,
      emailAddress,
      contactNumber,
      tin,
      zoningClassification,
      oboClearanceFee
    } = req.body;

    try {
      // Insert into DB with default status "pending"
      const query = `
        INSERT INTO zoning_forms 
        (business_name, business_address, email_address, contact_number, tin, zoning_classification, obo_clearance_fee, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `;

      await db.query(query, [
        businessName,
        businessAddress,
        emailAddress,
        contactNumber,
        tin,
        zoningClassification,
        oboClearanceFee
      ]);

      res.json({ message: 'Zoning form submitted successfully' });
    } catch (error) {
      console.error('Error inserting zoning form:', error);
      res.status(500).json({ message: 'Server error while submitting zoning form' });
    }
  }
);

/**
 * GET /zoning-forms
 * Fetch all zoning forms
 */
router.get('/zoning-forms', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM zoning_forms ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching zoning forms:', error);
    res.status(500).json({ message: 'Server error while fetching zoning forms' });
  }
});

/**
 * PATCH /zoning-forms/:id
 * Update zoning form status (approved/disapproved/pending)
 */
router.patch('/zoning-forms/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'disapproved', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    await db.query(
      'UPDATE zoning_forms SET status = $1 WHERE id = $2',
      [status, id]
    );
    res.json({ message: `Form ${status} successfully` });
  } catch (error) {
    console.error('Error updating zoning form:', error);
    res.status(500).json({ message: 'Server error while updating zoning form' });
  }
});

module.exports = router;
