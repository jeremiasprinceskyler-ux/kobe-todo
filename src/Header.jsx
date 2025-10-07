import React from "react";

export default function Header() {
  // Format today’s date
  const today = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <header className="header">
      <h1>My Day</h1>
      <p>{formattedDate}</p>
    </header>
  );
}
