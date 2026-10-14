"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/auth/AuthProvider"
import { SyncManager } from "@/sync/SyncManager"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SyncManager />
      {children}
    </AuthProvider>
  )
}
