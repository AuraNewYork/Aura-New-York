import Papa from 'papaparse'
import type { Unit, LayoutGroup } from './types'

const MOINIAN_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2qDSRqh6cJzN5qFRZ9Yk8w3M9bGlLoYwT7ot_DnMBLfUTHpL8iMW5kOTp1iYcJv4_Hpu-2JTJNHhX/pub?gid=799951236&single=true&output=csv'
const FRESH_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPJ9T15cta8kerjm2kU5vo9ZpZ5ou39AudKfOURoNh3V8g6gqaRJPI-sVlJGBPu3YnDVFqnfEExx3N/pub?gid=799951236&single=true&output=csv'

function parseBed(val: string): { bed: number; isConvertible: boolean } {
  const lower = val.toLowerCase().trim()
  if (lower.includes('conv')) {
    const numMatch = lower.match(/(\d+)/)
    if (numMatch) return { bed: parseInt(numMatch[1]), isConvertible: true }
    return { bed: 0, isConvertible: true }
  }
  const num = parseFloat(lower)
  return { bed: isNaN(num) ? 0 : num, isConvertible: false }
}

function parseCsvRow(row: string[]): Unit | null {
  const building = (row[0] || '').trim()
  const unit = (row[1] || '').trim()
  const { bed, isConvertible } = parseBed(row[2] || '')
  const bath = parseFloat(row[3] || '0') || 0
  const sqft = parseInt(row[4] || '0') || 0
  const status = (row[5] || '').trim()
  const grossRent = parseFloat(row[8] || '0') || 0
  const concession = parseFloat(row[9] || '0') || 0
  const term = parseInt(row[10] || '0') || 0
  const netRent = parseFloat(row[11] || '0') || 0
  const exposure = (row[12] || '').trim()
  const balcony = (row[13] || '').trim()
  const expiry = (row[20] || '').trim()
  const videoUrl = (row[29] || '').trim()
  const floorPlanUrl = (row[30] || '').trim()
  const matterportUrl = (row[31] || '').trim()
  const picsUrl = (row[32] || '').trim()

  if (!building || !unit || netRent <= 0) return null
  if (!status.toLowerCase().includes('vacant')) return null

  let bedLabel: string
  if (bed === 0 && !isConvertible) bedLabel = 'Studio'
  else if (bed === 0 && isConvertible) bedLabel = 'Convertible Studio'
  else if (isConvertible) bedLabel = `${bed} Bedroom (Convertible)`
  else if (bed === 1) bedLabel = '1 Bedroom'
  else bedLabel = `${bed} Bedrooms`

  return {
    building, unit, bed, bedLabel, isConvertible, bath, sqft, status,
    grossRent, concession, term, netRent, exposure, balcony,
    expiry, videoUrl, floorPlanUrl, matterportUrl, picsUrl,
  }
}

async function fetchCsv(url: string): Promise<string[][]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`)
  const text = await res.text()
  const result = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true })
  return result.data.slice(1)
}

export async function fetchGoogleSheetsInventory(): Promise<Unit[]> {
  const [moinian, fresh] = await Promise.all([
    fetchCsv(MOINIAN_URL).catch(() => [] as string[][]),
    fetchCsv(FRESH_URL).catch(() => [] as string[][]),
  ])

  const allRows = [...moinian, ...fresh]
  const seen = new Set<string>()
  const units: Unit[] = []

  for (const row of allRows) {
    const unit = parseCsvRow(row)
    if (!unit) continue
    const key = `${unit.building}-${unit.unit}`
    if (seen.has(key)) continue
    seen.add(key)
    units.push(unit)
  }

  return units
}

export function groupByLayout(units: Unit[]): LayoutGroup[] {
  const groups = new Map<string, Unit[]>()

  for (const unit of units) {
    const key = `${unit.bed}bed-${unit.bath}bath`
    const existing = groups.get(key) || []
    existing.push(unit)
    groups.set(key, existing)
  }

  const layouts: LayoutGroup[] = []
  for (const [key, groupUnits] of groups) {
    const sorted = [...groupUnits].sort((a, b) => a.netRent - b.netRent)
    const sample = sorted[0]
    const bathLabel = sample.bath === 1 ? '1 Bath' : `${sample.bath} Baths`
    const label = `${sample.bedLabel}, ${bathLabel}`

    layouts.push({
      key,
      label,
      bed: sample.bed,
      bath: sample.bath,
      units: sorted,
      cheapest: sorted[0],
      priciest: sorted[sorted.length - 1],
    })
  }

  return layouts.sort((a, b) => a.bed - b.bed || a.bath - b.bath)
}
