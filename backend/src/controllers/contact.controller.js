const supabase = require("../config/supabase");

// POST /api/contact  { name, email, message }  (public)
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "name, email, message are required" });
    }
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message })
      .select()
      .single();
    if (error) throw error;

    await supabase.from("analytics_events").insert({ event_type: "contact_submit", meta: { email } });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/admin/contact  (protected) -> list submissions
const listContact = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitContact, listContact };
