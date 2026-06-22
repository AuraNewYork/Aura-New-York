// MIGRATION: To swap from Google Sheets to Supabase, replace the import below
// with `import { fetchSupabaseInventory as fetchInventory } from './supabaseInventory'`
// and update groupByLayout if the schema differs.

export { fetchGoogleSheetsInventory as fetchInventory, groupByLayout } from './googleSheets'
export type { Unit, LayoutGroup, InventoryResult } from './types'
