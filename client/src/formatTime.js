export function formatTime(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-MY", { weekday: "short" });
  const time = d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
  return day + " " + time;
}
