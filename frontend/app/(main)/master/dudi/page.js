'use client'

import { Suspense } from "react"
import DudiContent from "./dudiContent"

export default function DudiPage() {
  return (
    <Suspense fallback={<div>Loading DUDI...</div>}>
      <DudiContent />
    </Suspense>
  )
}
