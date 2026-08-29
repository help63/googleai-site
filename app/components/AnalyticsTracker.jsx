"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    let visitorId =
      localStorage.getItem("googleai_visitor_id");

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(
        "googleai_visitor_id",
        visitorId
      );
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        visitorId,
        page: window.location.pathname
      })
    }).catch(() => {});
  }, []);

  return null;
}
