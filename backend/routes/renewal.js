const express = require('express');
const jwt = require('jsonwebtoken');
const Renewal = require('../models/Renewal');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      businessName,
      businessAddress,
      ownerName,
      businessType,
      grossReceipts,
      barangayClearance,
      fireSafetyCert,
      cedulaNumber,
    } = req.body;
    const userId = req.user.id;
    const renewal = await Renewal.create({
      businessName,
      businessAddress,
      ownerName,
      businessType,
      grossReceipts,
      barangayClearance,
      fireSafetyCert,
      cedulaNumber,
      userId,
    });
    res.status(201).json({ message: 'Renewal submitted successfully', renewal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const renewals = await Renewal.findAll({ where: { userId: req.user.id } });
    res.json(renewals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;