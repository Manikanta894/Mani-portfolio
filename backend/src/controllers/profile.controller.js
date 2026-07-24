const supabase = require("../config/supabase");

const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json({
      success: true,
      data: data || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getProfile,
};