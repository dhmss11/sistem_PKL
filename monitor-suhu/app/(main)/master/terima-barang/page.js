'use client'

import { Suspense } from "react"
import MutasiTerimaDataContent from "./terimaBarangContent"

export default function TerimaBarangPage () {
  return (
    <Suspense fallback= {<div>loading ...</div>}>
      <MutasiTerimaDataContent/>
       </Suspense>
  )
}