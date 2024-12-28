// pages/index.js
"use client";
import Sidebar from "./maincontainer/maincontainer";
import MainContent from "./sidebar/sidebar";

export default function Home() {
  return (
    <div className="container">
      <MainContent />
      <Sidebar />
      <style jsx>{`
        .container {
          display: flex;
          background: bg-slate-900;
        }
      `}</style>
    </div>
  );
}
