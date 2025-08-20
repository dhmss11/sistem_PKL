'use client'

import { Suspense } from "react"
import MutasiKirimDataContent from "./kirimBarangContent"

export default function kirimBarangPage () {
  return (
    <Suspense fallback= {<div>loading ...</div>}>
      <MutasiKirimDataContent/>
       </Suspense>
  )
}