// app/test/page.tsx
"use client";
import { useState } from "react";

export default function Test() {
  const [val, setVal] = useState("");
  return (
    <input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      placeholder="type here"
    />
  );
}
