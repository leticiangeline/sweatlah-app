import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

vi.stubGlobal("fetch", async (url) => {
  if (url.endsWith("/api/classes")) return { ok: true, json: async () => [
    { id: 8, title: "Saturday Spin", coach: "Dan", starts_at: "2026-10-17T09:00:00", capacity: 4, booked: 3 },
    { id: 9, title: "Sunday Spin", coach: "Mei", starts_at: "2026-10-18T10:00:00", capacity: 4, booked: 4 }
  ]};
  return { ok: true, json: async () => [] };
});

test("renders spots left correctly", async () => {
  render(<App />);
  expect(await screen.findByText("Almost full! 1 left")).toBeTruthy();
});

test("renders FULL when class is at capacity", async () => {
  render(<App />);
  expect(await screen.findByText("FULL")).toBeTruthy();
});