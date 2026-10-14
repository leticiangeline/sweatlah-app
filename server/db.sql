CREATE TABLE members (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  coach TEXT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  member_email TEXT REFERENCES members(email),
  class_id INTEGER REFERENCES classes(id)
);
