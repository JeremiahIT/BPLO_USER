const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // adjust path based on your project

const router = express.Router();

// POST /submit-contact
router.post(
  '/submit-contact',
  [
    body('emailContact').isEmail().withMessage('Valid Email is required'),
    body('businessName').notEmpty().withMessage('Business Name is required'),
    body('businessAddress').notEmpty().withMessage('Business Address is required'),
    body('taxIdentificationNumber').notEmpty().withMessage('TIN is required'),
    body('zoningClassification').notEmpty().withMessage('Zoning Classification is required'),
    body('choClearanceFee').notEmpty().withMessage('CHO Clearance Fee is required')
  ],
  async (req, res) => {
    // Validate fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      emailContact,
      businessName,
      businessAddress,
      taxIdentificationNumber,
      zoningClassification,
      choClearanceFee
    } = req.body;

    try {
      const query = `
        INSERT INTO cho_forms 
        (email_contact, business_name, business_address, tin, zoning_classification, cho_clearance_fee)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await db.query(query, [
        emailContact,
        businessName,
        businessAddress,
        taxIdentificationNumber,
        zoningClassification,
        choClearanceFee
      ]);

      res.json({ message: 'CHO form submitted successfully' });
    } catch (error) {
      console.error('Error inserting CHO form:', error);
      res.status(500).json({ message: 'Server error while submitting CHO form' });
    }
  }
);

module.exports = router;
