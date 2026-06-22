import { useEffect, useState } from 'react'
import { Trash2, Plus, CreditCard as Edit2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminWrite } from '../lib/api'
import { supabase, type SiteBuilding } from '../lib/supabase'

type FormData = Omit<SiteBuilding, 'id' | 'created_at' | 'updated_at' | 'slug'>

export function AdminBuildingsPage() {
  const { token, isAdmin } = useAuth()
  const [buildings, setBuildings] = useState<SiteBuilding[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    neighborhood: '',
    about_paragraph: '',
    amenities: '',
    year_built: null,
    latitude: null,
    longitude: null,
    schedule_tour_url: '',
    application_url: '',
    hero_image_url: '',
    studio_description: '',
    one_bed_description: '',
    two_bed_description: '',
    three_bed_description: '',
    display_order: 0,
    published: false,
  })

  useEffect(() => {
    document.title = 'Admin Buildings | Aura New York'
  }, [])

  useEffect(() => {
    if (!isAdmin || !token) return
    fetchBuildings()
  }, [isAdmin, token])

  const fetchBuildings = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase.from('site_buildings').select('*').order('display_order')
      if (err) throw err
      setBuildings(data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load buildings')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      neighborhood: '',
      about_paragraph: '',
      amenities: '',
      year_built: null,
      latitude: null,
      longitude: null,
      schedule_tour_url: '',
      application_url: '',
      hero_image_url: '',
      studio_description: '',
      one_bed_description: '',
      two_bed_description: '',
      three_bed_description: '',
      display_order: 0,
      published: false,
    })
    setEditingId(null)
  }

  const handleEdit = (building: SiteBuilding) => {
    const { id, created_at, updated_at, slug, ...rest } = building
    setFormData(rest)
    setEditingId(id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSaving(true)
      setError(null)

      const dataToSave = {
        ...formData,
        slug: generateSlug(formData.name),
      }

      if (editingId) {
        await adminWrite(token, 'update', 'site_buildings', dataToSave, editingId)
      } else {
        await adminWrite(token, 'insert', 'site_buildings', dataToSave)
      }

      resetForm()
      setShowForm(false)
      await fetchBuildings()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (building: SiteBuilding) => {
    if (!token || !confirm(`Delete "${building.name}"?`)) return

    try {
      setSaving(true)
      setError(null)
      await adminWrite(token, 'delete', 'site_buildings', {}, building.id)
      await fetchBuildings()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-neutral-600">Access denied</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-brand-950">Manage Buildings</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Building
          </button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Building Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="text"
                placeholder="Neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="number"
                placeholder="Year Built"
                value={formData.year_built || ''}
                onChange={(e) => setFormData({ ...formData, year_built: e.target.value ? parseInt(e.target.value) : null })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="number"
                placeholder="Latitude"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                step="0.0001"
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                step="0.0001"
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="url"
                placeholder="Hero Image URL"
                value={formData.hero_image_url}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="url"
                placeholder="Schedule Tour URL"
                value={formData.schedule_tour_url}
                onChange={(e) => setFormData({ ...formData, schedule_tour_url: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="url"
                placeholder="Application URL"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <input
                type="number"
                placeholder="Display Order"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="About Paragraph"
                value={formData.about_paragraph}
                onChange={(e) => setFormData({ ...formData, about_paragraph: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Amenities (comma-separated or JSON)"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <textarea
                placeholder="Studio Description"
                value={formData.studio_description}
                onChange={(e) => setFormData({ ...formData, studio_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <textarea
                placeholder="1 Bed Description"
                value={formData.one_bed_description}
                onChange={(e) => setFormData({ ...formData, one_bed_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <textarea
                placeholder="2 Bed Description"
                value={formData.two_bed_description}
                onChange={(e) => setFormData({ ...formData, two_bed_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <textarea
                placeholder="3 Bed Description"
                value={formData.three_bed_description}
                onChange={(e) => setFormData({ ...formData, three_bed_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-neutral-700">Published</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Update' : 'Create'} Building
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-4 py-2 bg-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Buildings List */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : buildings.length > 0 ? (
          <div className="space-y-4">
            {buildings.map((building) => (
              <div key={building.id} className="p-4 bg-white border border-neutral-200 rounded-lg flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-brand-950">{building.name}</h3>
                  <p className="text-sm text-neutral-600">{building.address}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${building.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'}`}>
                      {building.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-700">Order: {building.display_order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(building)}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(building)}
                    disabled={saving}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-600">No buildings found</div>
        )}
      </div>
    </div>
  )
}

export default AdminBuildingsPage
