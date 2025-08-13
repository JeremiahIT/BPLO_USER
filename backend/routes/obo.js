const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // adjust path if needed

const router = express.Router();

// POST /submit-obo
router.post(
  '/submit-obo',
  [
    body('businessName').notEmpty().withMessage('Business Name is required'),
    body('businessAddress').notEmpty().withMessage('Business Address is required'),
    body('taxIdentificationNumber').notEmpty().withMessage('TIN is required'),
    body('emailAddress').isEmail().withMessage('Valid Email Address is required'),
    body('contactNo').notEmpty().withMessage('Contact Number is required'),
    body('zoningClassification').notEmpty().withMessage('Zoning Classification is required'),
    body('oboClearanceFee').notEmpty().withMessage('OBO Clearance Fee is required'),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      businessName,
      businessAddress,
      taxIdentificationNumber,
      emailAddress,
      contactNo,
      zoningClassification,
      oboClearanceFee
    } = req.body;

    try {
      const query = `
        INSERT INTO obo_forms 
        (business_name, business_address, tin, email_address, contact_no, zoning_classification, obo_clearance_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await db.query(query, [
        businessName,
        businessAddress,
        taxIdentificationNumber,
        emailAddress,
        contactNo,
        zoningClassification,
        oboClearanceFee
      ]);

      res.json({ message: 'OBO form submitted successfully' });
    } catch (error) {
      console.error('Error inserting OBO form:', error);
      res.status(500).json({ message: 'Server error while submitting OBO form' });
    }
  }
);

module.exports = router;
