// src/components/ui/card.jsx
import React from "react";

export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl shadow-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }) {
  return (
    <div className={`p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
}
