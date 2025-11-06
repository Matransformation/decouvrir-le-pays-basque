"use client";

import { Suspense } from "react";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Chargement…</div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
