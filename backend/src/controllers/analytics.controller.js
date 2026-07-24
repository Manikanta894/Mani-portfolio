const supabase = require("../config/supabase");

// POST /api/analytics/track  { event_type, meta }  (public, called by frontend)
const track = async (req, res) => {
  try {
    const { event_type, meta } = req.body;
    const allowed = ["visit", "resume_download", "contact_submit", "research_download"];
    if (!allowed.includes(event_type)) {
      return res.status(400).json({ success: false, message: "Invalid event_type" });
    }
    const { error } = await supabase.from("analytics_events").insert({ event_type, meta: meta || {} });
    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/admin/analytics/summary  (protected) -> counts per event_type
const summary = async (req, res) => {
  try {
    const types = ["visit", "resume_download", "contact_submit", "research_download"];
    const counts = {};
    for (const t of types) {
      const { count, error } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", t);
      if (error) throw error;
      counts[t] = count || 0;
    }
    res.json({ success: true, data: counts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { track, summary };
