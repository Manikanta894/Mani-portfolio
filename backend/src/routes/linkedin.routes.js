const express = require("express");
const router = express.Router();

const {
  getLinkedInPosts,
  getLinkedInStats,
} = require("../controllers/linkedin.controller");

router.get("/", getLinkedInPosts);       // GET /api/linkedin  -> all posts
router.get("/stats", getLinkedInStats);  // GET /api/linkedin/stats -> followers/impressions snapshot

module.exports = router;
