const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // Adjust path based on your structure

const router = express.Router();

// POST /submit-zoning
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
      // Insert into DB
      const query = `
        INSERT INTO zoning_forms 
        (business_name, business_address, email_address, contact_number, tin, zoning_classification, obo_clearance_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?)
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

module.exports = router;
