const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // adjust path based on your project

const router = express.Router();

// POST /submit-electrical
router.post(
  '/submit-electrical',
  [
    body('businessName').notEmpty().withMessage('Business Name is required'),
    body('businessAddress').notEmpty().withMessage('Business Address is required'),
    body('taxIdentificationNumber').notEmpty().withMessage('TIN is required'),
    body('emailAddress').isEmail().withMessage('Valid Email Address is required'),
    body('contactNo').notEmpty().withMessage('Contact Number is required'),
    body('zoningClassification').notEmpty().withMessage('Zoning Classification is required'),
    body('electricalClearanceFee').notEmpty().withMessage('Electrical Clearance Fee is required'),
  ],
  async (req, res) => {
    // Validate fields
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
      electricalClearanceFee
    } = req.body;

    try {
      const query = `
        INSERT INTO electrical_forms 
        (business_name, business_address, tin, email_address, contact_no, zoning_classification, electrical_clearance_fee)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await db.query(query, [
        businessName,
        businessAddress,
        taxIdentificationNumber,
        emailAddress,
        contactNo,
        zoningClassification,
        electricalClearanceFee
      ]);

      res.json({ message: 'Electrical form submitted successfully' });
    } catch (error) {
      console.error('Error inserting Electrical form:', error);
      res.status(500).json({ message: 'Server error while submitting Electrical form' });
    }
  }
);

module.exports = router;
