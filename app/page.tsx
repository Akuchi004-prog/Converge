"use client";

import { useCallback, useEffect, useState } from "react";
import Footer from "./components/footer";


/* ==== Types ==== */
type TrackId = "design" | "engineering" | "product";
type DayId = 1 | 2;

type Speaker = {
  name: string;
  role: string;
  bio: string;
};

type Session = {
  id: string;
  track: TrackId | "shared";
  days: DayId[]; // which days this session appears on
  start: string; // 24h "HH:MM"
  end: string; // 24h "HH:MM"
  title: string;
  room: string;
  abstract: string;
  speaker: Speaker | null;
};

/* ==== Static data ==== */
const DAYS: { id: DayId; label: string; weekday: string; date: string }[] = [
  { id: 1, label: "Day 1", weekday: "Thursday", date: "2026-09-24" },
  { id: 2, label: "Day 2", weekday: "Friday", date: "2026-09-25" },
];

const TRACKS: { id: TrackId; label: string }[] = [
  { id: "design", label: "Design Track" },
  { id: "engineering", label: "Engineering Track" },
  { id: "product", label: "Product Track" },
];

const SESSIONS: Session[] = [
  {
    id: "keynote",
    track: "shared",
    days: [1],
    start: "09:00",
    end: "10:00",
    title: "Converging Realms: The Next Decade of Spatial & Generative Interface",
    room: "Grand Ballroom (Main Hall)",
    abstract:
      "Our opening keynote addresses the deep unification of physical boundaries, spatial OS layout paradigms and intent-driven generative systems. We look at what happens when the interface stops being a surface you point at and becomes a space you inhabit.",
    speaker: {
      name: "Dr. Aris Thorne",
      role: "Director of Spatial Research at Helios Labs",
      bio: "Aris leads research into spatial computing primitives and has spent a decade building the interaction models behind mixed-reality operating systems.",
    },
  },
  {
    id: "d-micro",
    track: "design",
    days: [1],
    start: "10:15",
    end: "11:15",
    title: "Advanced Micro-Interactions & Fluid Motion Curves",
    room: "Studio Hall A (Room 302)",
    abstract:
      "A practical deep-dive into easing, spring physics and choreography. We break down how small state transitions carry meaning, and how to build a motion vocabulary that stays consistent across an entire product surface.",
    speaker: {
      name: "Mei Tanaka",
      role: "Staff Interaction Designer at Orbit",
      bio: "Mei builds motion systems for large design teams and writes about the relationship between physics models and perceived responsiveness.",
    },
  },
  {
    id: "d-type",
    track: "design",
    days: [1],
    start: "11:30",
    end: "12:30",
    title: "Typography as an Interface: Dynamic Scaling Systems",
    room: "Studio Hall A (Room 302)",
    abstract:
      "Type is the densest interface element we ship. This session covers fluid type scales, optical sizing with variable fonts, and how to keep hierarchy intact from a 320px phone to a wall display.",
    speaker: {
      name: "Jonas Vega",
      role: "Type Systems Lead at Brandt & Co.",
      bio: "Jonas designs variable typefaces for interface use and consults on typographic systems for design-system teams.",
    },
  },
  {
    id: "lunch",
    track: "shared",
    days: [2],
    start: "09:00",
    end: "10:00",
    title: "Community Lunch",
    room: "Terrace & Atrium",
    abstract:
      "Enjoy artisanal catered dining with fellow attendees. Track leads will be seated across the atrium if you want to continue a conversation from the morning sessions.",
    speaker: null,
  },
  {
    id: "d-motion-a11y",
    track: "design",
    days: [2],
    start: "10:30",
    end: "11:30",
    title: "Accessible Motion Design: Setting the New Standards",
    room: "Studio Hall A (Room 302)",
    abstract:
      "Motion design is one of the most powerful tools in our UI toolkit, but it often compromises accessibility. This deep-dive session covers practical strategies to design fluid animations that respect device-level reduced motion preferences, handle vestibular sensitivities, and enrich screen reader paradigms.",
    speaker: {
      name: "Rayan Al-Jamil",
      role: "Principal Motion Designer at Linear",
      bio: "Rayan specializes in building fluid physics-based animation models and accessibility protocols for complex canvas platforms.",
    },
  },
  {
    id: "e-rust",
    track: "engineering",
    days: [1],
    start: "10:15",
    end: "11:15",
    title: "Rust in Production: Porting Desktop Engines Safely",
    room: "Tech Theater B",
    abstract:
      "A field report on incrementally moving a mature C++ desktop engine to Rust without freezing feature work. Covers FFI boundaries, build tooling and the migration order that kept the team shipping.",
    speaker: {
      name: "Priya Raman",
      role: "Principal Engineer at Fathom Systems",
      bio: "Priya has led two large-scale Rust migrations and maintains several crates in the graphics ecosystem.",
    },
  },
  {
    id: "e-render",
    track: "engineering",
    days: [1],
    start: "11:30",
    end: "12:30",
    title: "Next-Gen Rendering Pipelines for Collaborative Canvas",
    room: "Tech Theater B",
    abstract:
      "How to keep a shared canvas at 60fps with dozens of concurrent cursors. We walk through GPU-backed tile rendering, dirty-region tracking and the trade-offs between CRDT granularity and paint cost.",
    speaker: {
      name: "Tobias Lund",
      role: "Graphics Lead at Canvas Collective",
      bio: "Tobias works on real-time rendering for collaborative editors and previously built compositor internals for a browser engine.",
    },
  },
  {
    id: "e-validation",
    track: "engineering",
    days: [2],
    start: "10:30",
    end: "11:30",
    title: "One-to-One Validation: Minimal High-Fidelity Testing",
    room: "Tech Theater B",
    abstract:
      "Large test suites rot. This session argues for a small set of high-fidelity checks pinned directly to user-visible behaviour, and shows how to decide which existing tests to delete.",
    speaker: {
      name: "Elena Marsh",
      role: "Test Infrastructure Lead at Quarry",
      bio: "Elena rebuilds testing strategy for teams whose CI has become slower than their release cycle.",
    },
  },
  {
    id: "p-loops",
    track: "product",
    days: [1],
    start: "10:15",
    end: "11:15",
    title: "AI-Driven Product Loops: Beyond Chat Interfaces",
    room: "Innovation Hub C",
    abstract:
      "Chat was the first interface for generative systems, not the last. This session maps the product loops that work when the model is ambient — inline suggestions, background agents, and the feedback signals each one needs.",
    speaker: {
      name: "Dana Okafor",
      role: "Head of Product at Ember AI",
      bio: "Dana builds AI-native product surfaces and has shipped generative features across three consumer platforms.",
    },
  },
  {
    id: "p-metrics",
    track: "product",
    days: [1],
    start: "11:30",
    end: "12:30",
    title: "The Metrics That Matter: Product-Led Growth Secrets",
    room: "Innovation Hub C",
    abstract:
      "Most PLG dashboards measure activity, not value. We look at how to pick an activation metric you can actually move, and how to instrument it without drowning the team in events.",
    speaker: {
      name: "Marco Silveira",
      role: "VP Growth at Tessellate",
      bio: "Marco has run growth for two developer-tools companies and advises early-stage teams on activation measurement.",
    },
  },
  {
    id: "p-enterprise",
    track: "product",
    days: [2],
    start: "10:30",
    end: "11:30",
    title: "Navigating Enterprise Requirements Without Losing Momentum",
    room: "Innovation Hub C",
    abstract:
      "Enterprise deals arrive with a checklist attached. We cover how to absorb SSO, audit logs and procurement reviews into a roadmap without stalling the core product work your smaller customers came for.",
    speaker: {
      name: "Hannah Reyes",
      role: "Director of Product at Vantage Cloud",
      bio: "Hannah has taken two self-serve products upmarket and writes about balancing enterprise demands against product focus.",
    },
  },
];

/* ==== Helpers ==== */
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toCalendarStamp(date: string, time: string) {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function calendarUrl(session: Session, date: string) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: session.title,
    dates: `${toCalendarStamp(date, session.start)}/${toCalendarStamp(date, session.end)}`,
    details: session.abstract,
    location: session.room,
    ctz: "America/Los_Angeles",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function trackLabel(track: Session["track"]) {
  if (track === "shared") return "Shared Session";
  return TRACKS.find((t) => t.id === track)?.label ?? "";
}

/* ==== Modal ==== */
function SessionModal({
  session,
  activeTrack,
  date,
  onClose,
}: {
  session: Session;
  activeTrack: TrackId;
  date: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const colorTrack = session.track === "shared" ? activeTrack : session.track;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modal"
        data-track={colorTrack}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="modalAccent" aria-hidden="true" />

        <div className="modalHead">
          <div>
            <p className="modalBadge">• {trackLabel(session.track)}</p>
            <h2 className="modalTitle" id="modalTitle">
              {session.title}
            </h2>
          </div>
          <button className="modalClose" onClick={onClose} aria-label="Close window">
            ✕
          </button>
        </div>

        <div className="modalMeta">
          <span>
            🕐 {formatTime(session.start)} – {formatTime(session.end)}
          </span>
          <span>📍 {session.room}</span>
        </div>

        <div className="modalBody">
          <h3 className="modalSectionTitle">Session Abstract</h3>
          <p className="modalAbstract">{session.abstract}</p>

          {session.speaker && (
            <div className="speakerCard">
              <span className="speakerAvatar" aria-hidden="true">
                {initialsOf(session.speaker.name)}
              </span>
              <div>
                <p className="speakerName">{session.speaker.name}</p>
                <p className="speakerBio">
                  {session.speaker.role}. {session.speaker.bio}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modalFooter">
          <button className="btnGhost" onClick={onClose}>
            Close Window
          </button>
          <a
            className="btnPrimary"
            href={calendarUrl(session, date)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add to Calendar
          </a>
        </div>
      </div>
    </div>
  );
}

/* ==== Page ==== */
export default function Home() {
  const [activeDay, setActiveDay] = useState<DayId>(1);
  const [activeTrack, setActiveTrack] = useState<TrackId>("design");
  const [openSession, setOpenSession] = useState<Session | null>(null);

  const closeModal = useCallback(() => setOpenSession(null), []);

  const currentDay = DAYS.find((day) => day.id === activeDay) ?? DAYS[0];

  const visibleSessions = SESSIONS.filter(
    (session) =>
      session.days.includes(activeDay) &&
      (session.track === "shared" || session.track === activeTrack)
  ).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  return (
    <main>
      {/* ==== Header ==== */}
      <header>
        <div className="container">
          <div className="headerInner">
            <div className="headerLogo">
              <h1 className="headerTitle">
                Converge<span> 2026</span>
              </h1>
              <p className="headerSubtitle">
                September 24-25, 2026 • San Francisco, CA
              </p>
            </div>

            <div className="dayTabs" role="tablist" aria-label="Conference day">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  role="tab"
                  aria-selected={activeDay === day.id}
                  className={`dayTab ${activeDay === day.id ? "dayTabActive" : ""}`}
                  onClick={() => setActiveDay(day.id)}
                >
                  {day.label} • {day.weekday}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ==== Track Section ==== */}
      <section className="track">
        <div className="container">
          <div className="trackNavs" role="tablist" aria-label="Session track">
            {TRACKS.map((track) => (
              <button
                key={track.id}
                role="tab"
                aria-selected={activeTrack === track.id}
                data-track={track.id}
                className={`trackBadge ${
                  activeTrack === track.id ? "trackBadgeActive" : ""
                }`}
                onClick={() => setActiveTrack(track.id)}
              >
                • {track.label}
              </button>
            ))}
          </div>

          {/* ==== Schedule ==== */}
          <div className="schedule">
            {visibleSessions.map((session) => (
              <div
                className="scheduleRow"
                key={`${activeDay}-${session.id}`}
                data-track={session.track === "shared" ? activeTrack : session.track}
              >
                <p className="scheduleTime">{formatTime(session.start)}</p>

                <button
                  className={`scheduleCard ${
                    session.track === "shared" ? "scheduleCardShared" : ""
                  }`}
                  onClick={() => setOpenSession(session)}
                  aria-haspopup="dialog"
                >
                  <div className="cardMeta">
                    {session.track === "shared" && (
                      <span className="sharedBadge">SHARED SESSION</span>
                    )}
                    <span>
                      {formatTime(session.start)} – {formatTime(session.end)}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{session.room}</span>
                  </div>

                  <h2 className="cardTitle">{session.title}</h2>
                  <p className="cardAbstract">{session.abstract}</p>

                  {session.speaker && (
                    <p className="cardSpeaker">
                      <span>SPEAKER</span> {session.speaker.name}
                    </p>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {openSession && (
        <SessionModal
          session={openSession}
          activeTrack={activeTrack}
          date={currentDay.date}
          onClose={closeModal}
        />
      )}

      <Footer />
    </main>
  );
}