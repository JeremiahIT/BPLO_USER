const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// -------------------- Ensure uploads folder exists --------------------
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// -------------------- Multer setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// -------------------- Create new permit --------------------
router.post(
  "/",
  upload.fields([
    { name: "dtiCertificate" },
    { name: "secCertificate" },
    { name: "cdaCertificate" },
    { name: "birCertificate" },
  ]),
  [
    body("business_type").notEmpty().withMessage("Business type is required"),
    body("business_name").notEmpty().withMessage("Business name is required"),
    body("owner_first_name").notEmpty().withMessage("Owner first name required"),
    body("owner_last_name").notEmpty().withMessage("Owner last name required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("mobile")
      .matches(/^\+639\d{9}$/)
      .withMessage("Mobile must be in +639XXXXXXXXX format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        business_type,
        registration_number,
        business_name,
        tax_identification_number,
        trade_name,
        owner_first_name,
        owner_middle_name,
        owner_last_name,
        owner_extension_name,
        owner_sex,
        mail_address,
        telephone,
        mobile,
        email,
      } = req.body;

      // Handle files
      const files = req.files || {};
      const dtiCertificate = files.dtiCertificate
        ? files.dtiCertificate[0].path
        : null;
      const secCertificate = files.secCertificate
        ? files.secCertificate[0].path
        : null;
      const cdaCertificate = files.cdaCertificate
        ? files.cdaCertificate[0].path
        : null;
      const birCertificate = files.birCertificate
        ? files.birCertificate[0].path
        : null;

      // Permit number
      const permitNumber = `BPLO-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      const result = await db.query(
        `INSERT INTO business_permits (
          permit_number, business_type, registration_number, business_name,
          tax_identification_number, trade_name, owner_first_name, owner_middle_name,
          owner_last_name, owner_extension_name, owner_sex, mail_address, telephone,
          mobile, email, dti_certificate, sec_certificate, cda_certificate, bir_certificate
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        RETURNING *`,
        [
          permitNumber,
          business_type,
          registration_number || null,
          business_name,
          tax_identification_number || null,
          trade_name || null,
          owner_first_name,
          owner_middle_name || null,
          owner_last_name,
          owner_extension_name || null,
          owner_sex || null,
          mail_address || null,
          telephone || null,
          mobile,
          email,
          dtiCertificate,
          secCertificate,
          cdaCertificate,
          birCertificate,
        ]
      );

      res
        .status(201)
        .json({ message: "Permit created successfully", permit: result.rows[0] });
    } catch (error) {
      console.error("Create permit error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
