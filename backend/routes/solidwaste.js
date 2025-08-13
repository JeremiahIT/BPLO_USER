const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // adjust path if needed

const router = express.Router();

// POST /submit-solidwaste
router.post(
  '/submit-solidwaste',
  [
    body('businessName').notEmpty().withMessage('Business Name is required'),
    body('businessAddress').notEmpty().withMessage('Business Address is required'),
    body('taxIdentificationNumber').notEmpty().withMessage('TIN is required'),
    body('emailAddress').isEmail().withMessage('Valid Email Address is required'),
    body('contactNo').notEmpty().withMessage('Contact Number is required'),
    body('zoningClassification').notEmpty().withMessage('Zoning Classification is required'),
    body('solidWasteClearanceFee').notEmpty().withMessage('Solid Waste Clearance Fee is required'),
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
      solidWasteClearanceFee
    } = req.body;

    try {
      // Insert into DB
      const query = `
        INSERT INTO solid_waste_forms 
        (business_name, business_address, tin, email_address, contact_no, zoning_classification, solid_waste_clearance_fee)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await db.query(query, [
        businessName,
        businessAddress,
        taxIdentificationNumber,
        emailAddress,
        contactNo,
        zoningClassification,
        solidWasteClearanceFee
      ]);

      res.json({ message: 'Solid Waste form submitted successfully' });
    } catch (error) {
      console.error('Error inserting Solid Waste form:', error);
      res.status(500).json({ message: 'Server error while submitting Solid Waste form' });
    }
  }
);

module.exports = router;
