const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  await pool.query("TRUNCATE bookings, classes, members RESTART IDENTITY");
  await pool.query("INSERT INTO members (email, name) VALUES ('aisyah@mail.com', 'Aisyah')");
  await pool.query("INSERT INTO members (email, name) VALUES ('weijie@mail.com', 'Wei Jie')");
  await pool.query("INSERT INTO members (email, name) VALUES ('priya@mail.com', 'Priya')");
  await pool.query("INSERT INTO members (email, name) VALUES ('daniel@mail.com', 'Daniel')");
  await pool.query("INSERT INTO members (email, name) VALUES ('farah@mail.com', 'Farah')");
  await pool.query("INSERT INTO members (email, name) VALUES ('kumar@mail.com', 'Kumar')");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Morning HIIT', 'Coach Dan', '2026-10-12 07:00', 20)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Yoga Flow', 'Coach Mei', '2026-10-12 19:00', 15)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Boxing Basics', 'Coach Raj', '2026-10-13 19:00', 12)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Morning HIIT', 'Coach Dan', '2026-10-14 07:00', 20)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Pilates', 'Coach Mei', '2026-10-15 18:30', 10)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Boxing Basics', 'Coach Raj', '2026-10-15 20:00', 12)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Zumba', 'Coach Lina', '2026-10-16 19:00', 25)");
  await pool.query("INSERT INTO classes (title, coach, starts_at, capacity) VALUES ('Saturday Spin', 'Coach Dan', '2026-10-17 09:00', 4)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('aisyah@mail.com', 8)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('weijie@mail.com', 8)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('priya@mail.com', 8)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('farah@mail.com', 2)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('kumar@mail.com', 3)");
  await pool.query("INSERT INTO bookings (member_email, class_id) VALUES ('daniel@mail.com', 3)");
  console.log("Seeded");
  await pool.end();
}

seed();
