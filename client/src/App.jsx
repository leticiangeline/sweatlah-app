import { useState, useEffect } from "react";
import "./App.css";

function formatTime(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-MY", { weekday: "short" });
  const time = d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
  return day + " " + time;
}

function formatTime2(iso) {
  const d = new Date(iso);
  return d.getHours() + ":" + d.getMinutes();
}

function App() {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [classes, setClasses] = useState([]);
  const [spotsLeft, setSpotsLeft] = useState({});
  const [bookings, setBookings] = useState([]);
  const [day, setDay] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMembers() {
      const res = await fetch("http://localhost:3001/api/members");
      const data = await res.json();
      setMembers(data);
    }
    loadMembers();
  }, []);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch("http://localhost:3001/api/classes");
      const data = await res.json();
      setClasses(data);
    }
    loadClasses();
  }, []);

  useEffect(() => {
    const left = {};
    for (let i = 0; i < classes.length; i++) {
      left[classes[i].id] = classes[i].capacity - classes[i].booked;
    }
    setSpotsLeft(left);
  }, [classes.length]);

  async function selectMember(value) {
    setEmail(value);
    setMessage("");
    const res = await fetch("http://localhost:3001/api/bookings/" + value);
    const data = await res.json();
    setBookings(data);
  }

  async function bookClass(classId) {
    try {
      await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, classId: classId }),
      });
      const res = await fetch("http://localhost:3001/api/classes");
      const data = await res.json();
      setClasses(data);
      const res2 = await fetch("http://localhost:3001/api/bookings/" + email);
      const data2 = await res2.json();
      setBookings(data2);
      setMessage("Booked!");
    } catch (err) {}
  }

  async function cancelBooking(id) {
    try {
      await fetch("http://localhost:3001/api/bookings/" + id, { method: "DELETE" });
      const res = await fetch("http://localhost:3001/api/classes");
      const data = await res.json();
      setClasses(data);
      const res2 = await fetch("http://localhost:3001/api/bookings/" + email);
      const data2 = await res2.json();
      setBookings(data2);
      setMessage("Cancelled.");
    } catch (err) {}
  }

  let shown = classes;
  if (day !== "All") {
    shown = classes.filter(
      (c) => new Date(c.starts_at).toLocaleDateString("en-MY", { weekday: "short" }) === day
    );
  }

  return (
    <main>
      <h1>Sweatlah</h1>
      <label>
        Who are you?{" "}
        <select value={email} onChange={(e) => selectMember(e.target.value)}>
          <option value="">Pick your name</option>
          {members.map((m) => (
            <option key={m.email} value={m.email}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <p className="message">{message}</p>

      <Schedule
        classes={shown}
        spotsLeft={spotsLeft}
        day={day}
        setDay={setDay}
        email={email}
        bookClass={bookClass}
      />

      <h2>My bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.title}, {formatTime(b.starts_at)}{" "}
            <button onClick={() => cancelBooking(b.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Schedule({ classes, spotsLeft, day, setDay, email, bookClass }) {
  const days = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <section>
      <h2>This week</h2>
      <div className="days">
        {days.map((d) => (
          <button key={d} onClick={() => setDay(d)} disabled={d === day}>
            {d}
          </button>
        ))}
      </div>
      {classes.map((c) => (
        <ClassCard key={c.id} cls={c} spotsLeft={spotsLeft} email={email} bookClass={bookClass} />
      ))}
    </section>
  );
}

function ClassCard({ cls, spotsLeft, email, bookClass }) {
  let label = spotsLeft[cls.id] + " spots left";
  if (spotsLeft[cls.id] <= 3) {
    label = "Almost full! " + spotsLeft[cls.id] + " left";
  }
  return (
    <article>
      <h3>{cls.title}</h3>
      <p>
        {cls.coach}, {formatTime(cls.starts_at)}
      </p>
      <p>{label}</p>
      <BookButton classId={cls.id} email={email} bookClass={bookClass} />
    </article>
  );
}

function BookButton({ classId, email, bookClass }) {
  return (
    <button disabled={email === ""} onClick={() => bookClass(classId)}>
      Book
    </button>
  );
}

export default App;
