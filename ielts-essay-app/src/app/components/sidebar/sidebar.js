// components/Sidebar.js

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Home");
  return (
    <div className="sidebar">
      <h2>IELTS Evaluator</h2>
      <ul>
        <li
          className={active === "Home" ? "active" : ""}
          onClick={() => setActive("Home")}
        >
          <Link href="/">Home</Link>
        </li>
        <li
          className={active === "History" ? "active" : ""}
          onClick={() => setActive("History")}
        >
          <Link href="/history">Evaluation History</Link>
        </li>
        <li
          className={active === "Settings" ? "active" : ""}
          onClick={() => setActive("Settings")}
        >
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
      <style jsx>{`
        .sidebar {
          height: 100vh;
          width: 250px;
          background: #121212;
          color: #fff;
          padding: 20px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 20px 0;
        }
        .active {
          font-weight: bold;
          color: #4caf50;
        }
      `}</style>
    </div>
  );
}
