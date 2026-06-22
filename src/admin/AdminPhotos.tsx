import { useEffect, useState } from 'react'
import { Trash2, Plus, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminWrite } from '../lib/api'
import { supabase, type SiteUnitPhoto, type SiteBuildingAmenityPhoto, type SiteStockPhoto, type SiteBuilding } from '../lib/supabase'

type Tab = 'unit' | 'amenity' | 'stock'

export function AdminPhotosPage() {
  const { token, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('unit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Unit Photos
  const [unitPhotos, setUnitPhotos] = useState<SiteUnitPhoto[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [unitPhotoUrl, setUnitPhotoUrl] = useState('')
  const [unitPhotoFile, setUnitPhotoFile] = useState<File | null>(null)

  // Amenity Photos
  const [amenityPhotos, setAmenityPhotos] = useState<SiteBuildingAmenityPhoto[]>([])
  const [selectedAmenityBuilding, setSelectedAmenityBuilding] = useState('')
  const [amenityPhotoUrl, setAmenityPhotoUrl] = useState('')
  const [amenityPhotoFile, setAmenityPhotoFile] = useState<File | null>(null)

  // Stock Photos
  const [stockPhotos, setStockPhotos] = useState<SiteStockPhoto[]>([])
  const [buildings, setBuildings] = useState<SiteBuilding[]>([])
  const [selectedStockBuilding, setSelectedStockBuilding] = useState('')
  const [selectedBedrooms, setSelectedBedrooms] = useState('1')
  const [stockPhotoUrl, setStockPhotoUrl] = useState('')
  const [stockPhotoFile, setStockPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    document.title = 'Admin Photos | Aura New York'
  }, [])

  useEffect(() => {
    if (!isAdmin || !token) return
    fetchData()
  }, [isAdmin, token])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [unitRes, amenityRes, stockRes, buildingsRes] = await Promise.all([
        supabase.from('site_unit_photos').select('*').order('display_order'),
        supabase.from('site_building_amenity_photos').select('*').order('display_order'),
        supabase.from('site_stock_photos').select('*').order('position'),
        supabase.from('site_buildings').select('*').order('display_order'),
      ])

      setUnitPhotos(unitRes.data || [])
      setAmenityPhotos(amenityRes.data || [])
      setStockPhotos(stockRes.data || [])
      setBuildings(buildingsRes.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setUploading(true)
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const urlResponse = await adminWrite(token!, 'upload-url', 'storage', { filename })
      const { upload_url, photo_url } = urlResponse

      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')
      return photo_url
    } finally {
      setUploading(false)
    }
  }

  // Unit Photos
  const filteredUnitPhotos = unitPhotos.filter(
    (p) => p.building === selectedBuilding && p.unit === selectedUnit
  )

  const handleAddUnitPhoto = async () => {
    if (!token || !selectedBuilding || !selectedUnit) return
    if (!unitPhotoUrl && !unitPhotoFile) return

    try {
      setSaving(true)
      setError(null)

      let photoUrl = unitPhotoUrl
      if (unitPhotoFile) {
        photoUrl = await uploadFile(unitPhotoFile)
      }

      const maxOrder =
        Math.max(...filteredUnitPhotos.map((p) => p.display_order), 0) + 1

      await adminWrite(token, 'insert', 'site_unit_photos', {
        building: selectedBuilding,
        unit: selectedUnit,
        photo_url: photoUrl,
        display_order: maxOrder,
      })

      setUnitPhotoUrl('')
      setUnitPhotoFile(null)
      await fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add photo failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUnitPhoto = async (photo: SiteUnitPhoto) => {
    if (!token || !confirm('Delete photo?')) return

    try {
      setSaving(true)
      setError(null)
      await adminWrite(token, 'delete', 'site_unit_photos', {}, photo.id)
      await fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  // Amenity Photos
  const filteredAmenityPhotos = amenityPhotos.filter(
    (p) => p.building === selectedAmenityBuilding
  )

  const handleAddAmenityPhoto = async () => {
    if (!token || !selectedAmenityBuilding) return
    if (!amenityPhotoUrl && !amenityPhotoFile) return

    try {
      setSaving(true)
      setError(null)

      let photoUrl = amenityPhotoUrl
      if (amenityPhotoFile) {
        photoUrl = await uploadFile(amenityPhotoFile)
      }

      const maxOrder =
        Math.max(...filteredAmenityPhotos.map((p) => p.display_order), 0) + 1

      await adminWrite(token, 'insert', 'site_building_amenity_photos', {
        building: selectedAmenityBuilding,
        photo_url: photoUrl,
        display_order: maxOrder,
      })

      setAmenityPhotoUrl('')
      setAmenityPhotoFile(null)
      await fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add photo failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAmenityPhoto = async (photo: SiteBuildingAmenityPhoto) => {
    if (!token || !confirm('Delete photo?')) return

    try {
      setSaving(true)
      setError(null)
      await adminWrite(token, 'delete', 'site_building_amenity_photos', {}, photo.id)
      await fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  // Stock Photos
  const filteredStockPhotos = stockPhotos.filter(
    (p) => p.building_id === selectedStockBuilding && p.bedrooms === parseInt(selectedBedrooms)
  )

  const handleAddStockPhoto = async () => {
    if (!token || !selectedStockBuilding) return
    if (!stockPhotoUrl && !stockPhotoFile) return

    try {
      setSaving(true)
      setError(null)

      let photoUrl = stockPhotoUrl
      if (stockPhotoFile) {
        photoUrl = await uploadFile(stockPhotoFile)
      }

      const maxPosition =
        Math.max(...filteredStockPhotos.map((p) => p.position), 0) + 1

      await adminWrite(token, 'insert', 'site_stock_photos', {
        building_id: selectedStockBuilding,
        bedrooms: parseInt(selectedBedrooms),
        url: photoUrl,
        position: maxPosition,
      })

      setStockPhotoUrl('')
      setStockPhotoFile(null)
      await fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add photo failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStockPhoto = async (photo: SiteStockPhoto) => {
    if (!token || !confirm('Delete photo?')) return

    try {
      setSaving(true)
      setError(null)
      await adminWrite(token, 'delete', 'site_stock_photos', {}, photo.id)
      await fetchData()
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
        <h1 className="text-3xl font-bold text-brand-950 mb-8">Manage Photos</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200">
          {(['unit', 'amenity', 'stock'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'unit' && 'Unit Photos'}
              {tab === 'amenity' && 'Amenity Photos'}
              {tab === 'stock' && 'Stock Photos'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Unit Photos Tab */}
            {activeTab === 'unit' && (
              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Building
                    </label>
                    <input
                      type="text"
                      placeholder="Enter building name"
                      value={selectedBuilding}
                      onChange={(e) => setSelectedBuilding(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 101, 202A"
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={unitPhotoUrl}
                      onChange={(e) => setUnitPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Or Upload File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUnitPhotoFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <button
                    onClick={handleAddUnitPhoto}
                    disabled={saving || uploading || (!selectedBuilding || !selectedUnit)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Photo
                  </button>
                </div>

                {selectedBuilding && selectedUnit && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-neutral-900">Photos for {selectedBuilding} - Unit {selectedUnit}</h3>
                    {filteredUnitPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredUnitPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={photo.photo_url}
                              alt="Unit photo"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => handleDeleteUnitPhoto(photo)}
                              disabled={saving}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-600 text-sm">No photos yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Amenity Photos Tab */}
            {activeTab === 'amenity' && (
              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Building
                    </label>
                    <input
                      type="text"
                      placeholder="Enter building name"
                      value={selectedAmenityBuilding}
                      onChange={(e) => setSelectedAmenityBuilding(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={amenityPhotoUrl}
                      onChange={(e) => setAmenityPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Or Upload File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAmenityPhotoFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <button
                    onClick={handleAddAmenityPhoto}
                    disabled={saving || uploading || !selectedAmenityBuilding}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Photo
                  </button>
                </div>

                {selectedAmenityBuilding && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-neutral-900">Amenity Photos for {selectedAmenityBuilding}</h3>
                    {filteredAmenityPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredAmenityPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={photo.photo_url}
                              alt="Amenity photo"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => handleDeleteAmenityPhoto(photo)}
                              disabled={saving}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-600 text-sm">No photos yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Stock Photos Tab */}
            {activeTab === 'stock' && (
              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Building
                      </label>
                      <select
                        value={selectedStockBuilding}
                        onChange={(e) => setSelectedStockBuilding(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                      >
                        <option value="">Select Building</option>
                        {buildings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bedrooms
                      </label>
                      <select
                        value={selectedBedrooms}
                        onChange={(e) => setSelectedBedrooms(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                      >
                        <option value="0">Studio</option>
                        <option value="1">1 Bed</option>
                        <option value="2">2 Bed</option>
                        <option value="3">3 Bed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={stockPhotoUrl}
                      onChange={(e) => setStockPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Or Upload File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setStockPhotoFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <button
                    onClick={handleAddStockPhoto}
                    disabled={saving || uploading || !selectedStockBuilding}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Photo
                  </button>
                </div>

                {selectedStockBuilding && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-neutral-900">
                      Stock Photos: {buildings.find(b => b.id === selectedStockBuilding)?.name} - {selectedBedrooms === '0' ? 'Studio' : `${selectedBedrooms} Bed`}
                    </h3>
                    {filteredStockPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredStockPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={photo.url}
                              alt="Stock photo"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => handleDeleteStockPhoto(photo)}
                              disabled={saving}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-600 text-sm">No photos yet</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPhotosPage
