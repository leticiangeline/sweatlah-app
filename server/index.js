const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://postgres:sweatlah123@localhost:5432/sweatlah",
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
    "SELECT bookings.id, classes.title, classes.starts_at FROM bookings JOIN classes ON classes.id = bookings.class_id WHERE bookings.member_email = $1 ORDER BY classes.starts_at",
    [req.params.email]
  );
  res.json(result.rows);
});

app.post("/api/bookings", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO bookings (member_email, class_id) VALUES ($1, $2) RETURNING *",
    [req.body.email, req.body.classId]
  );
  res.status(201).json(result.rows[0]);
});

app.delete("/api/bookings/:id", async (req, res) => {
  await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

app.listen(3001, () => {
  console.log("Sweatlah API running on http://localhost:3001");
});
