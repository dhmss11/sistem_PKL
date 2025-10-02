'use client'
import { Suspense } from "react"
import SchoolSettingsContent from './schoolSettingsContent'

export default function SchoolSettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolSettingsContent/>
    </Suspense>
  )
}
