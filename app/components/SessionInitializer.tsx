"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SessionInitializer() {
  useEffect(() => {
    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("session_id", sessionId);
      console.log("🆕 Nouveau session_id généré :", sessionId);
    } else {
      console.log("🔗 session_id existant :", sessionId);
    }
  }, []);

  return null;
}
