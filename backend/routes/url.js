const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const qrcode = require("qrcode");
const Url = require("../models/Url");
const User = require("../models/User");

// Shorten URL
router.post("/shorten", async (req, res) => {
  const { original_url } = req.body;
  if (!original_url) {
    return res.status(400).json({ error: "Original URL is required" });
  }
  try {
    new URL(original_url);
    const shortId = nanoid(7);
    const short_url = `${process.env.BASE_URL}/${shortId}`;
    const url = new Url({
      original_url,
      short_url,
      user_uid: req.user ? req.user.uid : null,
    });
    await url.save();
    const qrCode = await qrcode.toDataURL(short_url);
    res.json({ short_url, qrCode });
  } catch (error) {
    res.status(400).json({ error: "Invalid URL or server error" });
  }
});

// Get all URLs for a user
router.get("/my-urls", async (req, res) => {
  try {
    const urls = await Url.find(
      req.user ? { user_uid: req.user.uid } : { user_uid: null }
    );
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a URL
router.delete("/:id", async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });
    if (url.user_uid && (!req.user || req.user.uid !== url.user_uid)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await url.deleteOne();
    res.json({ message: "URL deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect from short URL
router.get("/:shortId", async (req, res) => {
  try {
    const url = await Url.findOne({
      short_url: `${process.env.BASE_URL}/${req.params.shortId}`,
    });
    if (!url) return res.status(404).json({ error: "URL not found" });
    res.redirect(url.original_url);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user details (for Email/Password sign-up)
router.post("/update-user", async (req, res) => {
  const { name } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: "User must be authenticated" });
  }
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { name, emailVerified: req.user.emailVerified },
      { new: true }
    );
    res.json({
      uid: user.uid,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { nanoid } = require("nanoid");
// const qrcode = require("qrcode");
// const Url = require("../models/Url");

// // Shorten URL
// router.post("/shorten", async (req, res) => {
//   const { original_url } = req.body;
//   // const { original_url, preferred_domain } = req.body;
//   if (!original_url) {
//     return res.status(400).json({ error: "Original URL is required" });
//   }
//   try {
//     // Validate URL format
//     new URL(original_url);
//     // console.log("URL object: ", new URL(original_url));
//     const shortId = nanoid(7); // Generate 7-character short ID
//     // console.log("shortId is: ", shortId);
//     const short_url = `${process.env.BASE_URL}/${shortId}`;
//     // const short_url = `https://${preferred_domain}/${shortId}`;
//     // console.log("short url is: ", short_url);
//     const url = new Url({
//       original_url,
//       short_url,
//       user_uid: req.user ? req.user.uid : null,
//     });
//     // preferred_domain,

//     // console.log("url object being saved to db: ", url);
//     await url.save();
//     // Generate QR code as Base64
//     const qrCode = await qrcode.toDataURL(short_url);
//     // console.log("qr code is: ", qrCode);
//     res.json({ short_url, qrCode });
//   } catch (error) {
//     res.status(400).json({ error: "Invalid URL or server error" });
//   }
// });

// Get all URLs for a user
router.get("/my-urls", async (req, res) => {
  try {
    const urls = await Url.find(
      req.user ? { user_uid: req.user.uid } : { user_uid: null }
    );
    // console.log("Current logged in users url is: ", urls);
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a URL
router.delete("/:id", async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });
    if (url.user_uid && (!req.user || req.user.uid !== url.user_uid)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await url.deleteOne();
    res.json({ message: "URL deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect from short URL
router.get("/:shortId", async (req, res) => {
  // const { preferred_domain } = req.body;
  try {
    const url = await Url.findOne({
      short_url: `${process.env.BASE_URL}/${req.params.shortId}`,
      // short_url: `https://${preferred_domain}/${req.params.shortId}`,
    });
    if (!url) return res.status(404).json({ error: "URL not found" });
    res.redirect(url.original_url);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
