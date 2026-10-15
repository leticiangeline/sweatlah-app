const API_URL = "http://localhost:3001";

export async function getMembers() {
  const res = await fetch(API_URL + "/api/members");
  return res.json();
}

export async function getClasses() {
  const res = await fetch(API_URL + "/api/classes");
  return res.json();
}

export async function getBookings(email) {
  const res = await fetch(API_URL + "/api/bookings/" + email);
  return res.json();
}

export function createBooking(email, classId) {
  return fetch(API_URL + "/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, email }),
  });
}

export function deleteBooking(id) {
  return fetch(API_URL + "/api/bookings/" + id, { method: "DELETE" });
}
