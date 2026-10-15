import { useState, useEffect } from "react";
import "./App.css";
import { getMembers, getClasses, getBookings, createBooking, deleteBooking } from "./api.js";

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
  const [bookings, setBookings] = useState([]);
  const [day, setDay] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMembers() {
      const data = await getMembers();
      setMembers(data);
    }
    loadMembers();
  }, []);

  useEffect(() => {
    async function loadClasses() {
      const data = await getClasses();
      setClasses(data);
    }
    loadClasses();
  }, []);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  async function selectMember(value) {
    setEmail(value);
    setMessage("");
    await refreshData(value);
  }

  async function refreshData(email) {
    const data = await getClasses();
    setClasses(data);
    const data2 = await getBookings(email);
    setBookings(data2);
  }

  async function bookClass(classId) {
    try {
      const res = await createBooking(email, classId);

      const data = await res.json();
      console.log("BOOKING RESPONSE STATUS:", res.status, "DATA:", data);

      if (!res.ok) {
        const errorMsg = data.error || data.message || "Something went wrong";
        setMessage(errorMsg);
        return; // STOP execution - success logic and refreshers do NOT run
      }

      setMessage("Booked!");
      await refreshData(email);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  }

  async function cancelBooking(id) {
    try {
      const res = await deleteBooking(id);
      if (!res.ok) {
        const data = await res.json();
        const errorMsg = data.error || data.message || "Something went wrong";
        setMessage(errorMsg);
        return; // STOP execution - refreshers do NOT run
      }
      setMessage("Booking cancelled!");
      await refreshData(email);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
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
      <Schedule
        classes={shown}
        day={day}
        setDay={setDay}
        email={email}
        bookClass={bookClass}
      />

      <h2>My bookings</h2>
      <ul>
        {bookings.length === 0 ? (
          <li key="empty">No bookings yet.</li>
        ) : (
          bookings.map((b) => (
            <li key={b.id}>
              {b.title}, {formatTime(b.starts_at)}{" "}
              <button onClick={() => cancelBooking(b.id)}>Cancel</button>
            </li>
          ))
        )}
      </ul>
      {message && (
        <div className="toast" role="status" onClick={() => setMessage("")}>
          {message}
        </div>
      )}
    </main>
  );
}

function Schedule({ classes, day, setDay, email, bookClass }) {
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
        <ClassCard key={c.id} cls={c} email={email} bookClass={bookClass} />
      ))}
    </section>
  );
}

function ClassCard({ cls, email, bookClass }) {
  const spots = cls.capacity - cls.booked;
  let label = spots + " spots left";
  if (spots <= 0) {
    label = "FULL";
  } else if (spots <= 3) {
    label = "Almost full! " + spots + " left";
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
