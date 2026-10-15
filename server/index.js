const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/members", async (req, res) => {
  const result = await pool.query("SELECT email, name FROM members ORDER BY name");
  res.json(result.rows);
});

app.get("/api/classes", async (req, res) => {
  const result = await pool.query("SELECT * FROM classes ORDER BY starts_at");
  const classes = result.rows;
  for (let i = 0; i < classes.length; i++) {
    const count = await pool.query("SELECT COUNT(*) FROM bookings WHERE class_id = $1", [
      classes[i].id,
    ]);
    classes[i].booked = Number(count.rows[0].count);
  }
  res.json(classes);
});

app.get("/api/bookings/:email", async (req, res) => {
  const result = await pool.query(
    "SELECT bookings.id, bookings.class_id, classes.title, classes.starts_at FROM bookings JOIN classes ON classes.id = bookings.class_id WHERE bookings.member_email = $1 ORDER BY classes.starts_at",
    [req.params.email]
  );
  res.json(result.rows);
});

app.post("/api/bookings", async (req, res) => {
  const classId = req.body?.classId ?? req.body?.class_id;
  const email = req.body?.email;
  if (!classId) {
    return res.status(400).json({ error: "classId is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  try {
    const existing = await pool.query(
      "SELECT id FROM bookings WHERE member_email = $1 AND class_id = $2",
      [email, classId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "You have already booked this class" });
    }

    const classResult = await pool.query("SELECT capacity FROM classes WHERE id = $1", [classId]);
    const count = await pool.query("SELECT COUNT(*) FROM bookings WHERE class_id = $1", [classId]);
    if (classResult.rows.length > 0 && Number(count.rows[0].count) >= classResult.rows[0].capacity) {
      return res.status(409).json({ error: "Class is full" });
    }
    const result = await pool.query(
      "INSERT INTO bookings (member_email, class_id) SELECT $1, $2 WHERE (SELECT capacity FROM classes WHERE id = $2) > (SELECT COUNT(*) FROM bookings WHERE class_id = $2) RETURNING *",
      [email, classId]
    );
    if (result.rows.length === 0) {
      if (classResult.rows.length > 0) {
        return res.status(409).json({ error: "Class is full" });
      }
      return res.status(500).json({ error: "Something went wrong. Try again." });
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

app.listen(3001, () => {
  console.log("Sweatlah API running on http://localhost:3001");
});
