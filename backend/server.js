require("dotenv").config();
console.log("🔥 THIS IS THE NEW SERVER");
const express = require("express");
const cors = require("cors");
const { pool, initDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* -------------------- Home Route -------------------- */

app.get("/", (req, res) => {
  res.send("Device Management API is Running");
});

/* -------------------- Get All Devices -------------------- */

app.get("/api/devices", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devices ORDER BY id DESC"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch devices",
    });
  }
});

/* -------------------- Get Device By ID -------------------- */

app.get("/api/devices/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devices WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch device",
    });
  }
});

/* -------------------- Add Device -------------------- */

app.post("/api/devices", async (req, res) => {
  const {
    machine_name,
    finance_asset_id,
    asset_state,
    asset_condition,
    site,
    device_type,
    manufacturer,
    model,
    serial_number,
    assigned_user,
    finance_cap_date,
    remarks,
    backup_check,
    trend,
    in_navin_list,
    os,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO devices (
        machine_name,
        finance_asset_id,
        asset_state,
        asset_condition,
        site,
        device_type,
        manufacturer,
        model,
        serial_number,
        assigned_user,
        finance_cap_date,
        remarks,
        backup_check,
        trend,
        in_navin_list,
        os
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        machine_name,
        finance_asset_id,
        asset_state,
        asset_condition,
        site,
        device_type,
        manufacturer,
        model,
        serial_number,
        assigned_user,
        finance_cap_date,
        remarks,
        backup_check,
        trend,
        in_navin_list,
        os,
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM devices WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Finance Asset ID or Serial Number already exists",
      });
    }

    res.status(500).json({
      error: "Failed to add device",
    });
  }
});

/* -------------------- Update Device -------------------- */

app.put("/api/devices/:id", async (req, res) => {
  const {
    machine_name,
    finance_asset_id,
    asset_state,
    asset_condition,
    site,
    device_type,
    manufacturer,
    model,
    serial_number,
    assigned_user,
    finance_cap_date,
    remarks,
    backup_check,
    trend,
    in_navin_list,
    os,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE devices SET
        machine_name=?,
        finance_asset_id=?,
        asset_state=?,
        asset_condition=?,
        site=?,
        device_type=?,
        manufacturer=?,
        model=?,
        serial_number=?,
        assigned_user=?,
        finance_cap_date=?,
        remarks=?,
        backup_check=?,
        trend=?,
        in_navin_list=?,
        os=?
      WHERE id=?`,
      [
        machine_name,
        finance_asset_id,
        asset_state,
        asset_condition,
        site,
        device_type,
        manufacturer,
        model,
        serial_number,
        assigned_user,
        finance_cap_date,
        remarks,
        backup_check,
        trend,
        in_navin_list,
        os,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM devices WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update device",
    });
  }
});

/* -------------------- Delete Device -------------------- */

app.delete("/api/devices/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM devices WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    res.json({
      message: "Device deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete device",
    });
  }
});

/* -------------------- Search -------------------- */

app.get("/api/search/:keyword", async (req, res) => {
  const keyword = `%${req.params.keyword}%`;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM devices
       WHERE machine_name LIKE ?
       OR finance_asset_id LIKE ?
       OR serial_number LIKE ?
       OR assigned_user LIKE ?
       OR manufacturer LIKE ?`,
      [keyword, keyword, keyword, keyword, keyword]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Search failed",
    });
  }
});

/* -------------------- Start Server -------------------- */

async function startServer() {
  try {
    await initDatabase();

    console.log("✅ Database Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server");
    console.error(err);
    process.exit(1);
  }
}

startServer();