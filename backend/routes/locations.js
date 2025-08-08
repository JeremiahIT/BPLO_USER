const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all regions
router.get('/regions', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM regions ORDER BY name');
    res.json({ regions: result.rows });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get provinces by region
router.get('/provinces/:regionId', async (req, res) => {
  try {
    const { regionId } = req.params;
    const result = await db.query(
      'SELECT * FROM provinces WHERE region_id = $1 ORDER BY name',
      [regionId]
    );
    res.json({ provinces: result.rows });
  } catch (error) {
    console.error('Get provinces error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get cities by province
router.get('/cities/:provinceId', async (req, res) => {
  try {
    const { provinceId } = req.params;
    const result = await db.query(
      'SELECT * FROM cities WHERE province_id = $1 ORDER BY name',
      [provinceId]
    );
    res.json({ cities: result.rows });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get barangays by city
router.get('/barangays/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const result = await db.query(
      'SELECT * FROM barangays WHERE city_id = $1 ORDER BY name',
      [cityId]
    );
    res.json({ barangays: result.rows });
  } catch (error) {
    console.error('Get barangays error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all location data in one request
router.get('/all', async (req, res) => {
  try {
    const regionsResult = await db.query('SELECT * FROM regions ORDER BY name');
    const provincesResult = await db.query('SELECT * FROM provinces ORDER BY name');
    const citiesResult = await db.query('SELECT * FROM cities ORDER BY name');
    const barangaysResult = await db.query('SELECT * FROM barangays ORDER BY name');

    res.json({
      regions: regionsResult.rows,
      provinces: provincesResult.rows,
      cities: citiesResult.rows,
      barangays: barangaysResult.rows
    });
  } catch (error) {
    console.error('Get all locations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 