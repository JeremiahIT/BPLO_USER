const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Create new business renewal
router.post('/', [
  body('b_name').notEmpty(),
  body('b_address').notEmpty(),
  body('owner_name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { b_name, b_address, owner_name } = req.body;

    const result = await db.query(
      `INSERT INTO business_renewal (b_name, b_address, owner_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [b_name, b_address, owner_name]
    );

    if (result && result.rows && result.rows[0]) {
      res.status(201).json({
        message: 'Business renewal submitted successfully',
        renewal: result.rows[0]
      });
    } else {
      res.status(500).json({ error: 'Failed to create renewal' });
    }
  } catch (error) {
    console.error('Create renewal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
