require("dotenv").config();

const express = require("express");
const cors = require("cors");

const supabase = require("./src/config/supabase");

const publicRoutes = require("./src/routes/public.routes");
const adminRoutes = require("./src/routes/admin.routes");
const linkedinRoutes = require("./src/routes/linkedin.routes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    application: "Manikanta Portfolio API",
    version: "2.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  try {
    const { error } = await supabase
      .from("profile")
      .select("id")
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      database: "Connected",
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      database: "Disconnected",
      error: err.message,
    });
  }
});

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/linkedin", linkedinRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});