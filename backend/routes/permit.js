// routes/permit.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const BusinessPermit = require("../models/BusinessPermit");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/permits — Create New Permit
router.post(
  "/",
  upload.fields([
    { name: "dtiCertificate", maxCount: 1 },
    { name: "secCertificate", maxCount: 1 },
    { name: "cdaCertificate", maxCount: 1 },
    { name: "birCertificate", maxCount: 1 }
  ]),
  [
    body("business_type").notEmpty().withMessage("Business type is required"),
    body("business_name").notEmpty().withMessage("Business name is required"),
    body("owner_first_name").notEmpty().withMessage("Owner first name is required"),
    body("owner_last_name").notEmpty().withMessage("Owner last name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("mobile").matches(/^\+639\d{9}$/).withMessage("Invalid Philippine mobile number"),
    body("mail_address").notEmpty().withMessage("Mailing address is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: "Validation failed", details: errors.array() });

      const {
        business_type, registration_number, business_name,
        tax_identification_number, trade_name,
        owner_first_name, owner_middle_name, owner_last_name,
        owner_extension_name, owner_sex, mail_address,
        telephone, mobile, email
      } = req.body;

      const files = req.files || {};
      const dti_certificate = files.dtiCertificate?.[0]?.path || null;
      const sec_certificate = files.secCertificate?.[0]?.path || null;
      const cda_certificate = files.cdaCertificate?.[0]?.path || null;
      const bir_certificate = files.birCertificate?.[0]?.path || null;

      const permit_number = `BPLO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const permit = await BusinessPermit.create({
        permit_number,
        business_type,
        registration_number: registration_number || null,
        business_name,
        tax_identification_number: tax_identification_number || null,
        trade_name: trade_name || null,
        owner_first_name,
        owner_middle_name: owner_middle_name || null,
        owner_last_name,
        owner_extension_name: owner_extension_name || null,
        owner_sex: owner_sex || null,
        mail_address,
        telephone: telephone || null,
        mobile,
        email,
        dti_certificate,
        sec_certificate,
        cda_certificate,
        bir_certificate
      });

      res.status(201).json({ message: "Permit created successfully", permit });
    } catch (error) {
      console.error("Create permit error:", error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
);

// GET /api/permits — All Permits
router.get("/", async (req, res) => {
  try {
    const permits = await BusinessPermit.findAll({ order: [["created_at", "DESC"]] });
    res.json({ permits });
  } catch (error) {
    console.error("Get permits error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// GET /api/permits/:id — Single Permit
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const permit = await BusinessPermit.findByPk(id);
    if (!permit) return res.status(404).json({ error: "Permit not found" });
    res.json({ permit });
  } catch (error) {
    console.error("Get permit error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;
