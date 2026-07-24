const supabase = require("../config/supabase");

const getLinkedInPosts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("linkedin_posts")
      .select("*")
      .order("posted_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getLinkedInPosts,
};
// GET /api/linkedin/stats — latest followers/impressions snapshot
const getLinkedInStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("linkedin_stats")
      .select("*")
      .order("captured_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.getLinkedInStats = getLinkedInStats;
