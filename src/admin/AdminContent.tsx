import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminWrite } from '../lib/api'
import { supabase, type SiteSetting } from '../lib/supabase'

type SettingEdit = {
  key: string
  value: unknown
  id?: string
  dirty: boolean
}

export function AdminContentPage() {
  const { token, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SettingEdit[]>([])
  const [allSettings, setAllSettings] = useState<SiteSetting[]>([])

  const defaultKeys = [
    'hero_video_url',
    'about_content',
    'about_headshots',
    'testimonials',
    'contact_recipient',
  ]

  useEffect(() => {
    document.title = 'Admin Content | Aura New York'
  }, [])

  useEffect(() => {
    if (!isAdmin || !token) return
    fetchSettings()
  }, [isAdmin, token])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', defaultKeys)

      if (err) throw err

      setAllSettings(data || [])

      const settingMap = new Map(data?.map((s) => [s.key, s]) || [])
      const edits = defaultKeys.map((key) => ({
        key,
        value: settingMap.get(key)?.value || getDefaultValue(key),
        id: settingMap.get(key)?.id,
        dirty: false,
      }))

      setSettings(edits)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const getDefaultValue = (key: string) => {
    switch (key) {
      case 'about_headshots':
        return []
      case 'testimonials':
        return []
      default:
        return ''
    }
  }

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, value, dirty: true } : s
      )
    )
  }

  const saveSetting = async (setting: SettingEdit) => {
    if (!token) return

    try {
      setSaving(true)
      setError(null)

      const valueToSave = typeof setting.value === 'string' ? setting.value : setting.value

      if (setting.id) {
        await adminWrite(token, 'update', 'site_settings', { value: valueToSave }, setting.id)
      } else {
        await adminWrite(token, 'insert', 'site_settings', {
          key: setting.key,
          value: valueToSave,
        })
      }

      setSettings((prev) =>
        prev.map((s) =>
          s.key === setting.key ? { ...s, dirty: false } : s
        )
      )

      await fetchSettings()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
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
        <h1 className="text-3xl font-bold text-brand-950 mb-8">Manage Content</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.key}
                className="p-6 bg-white border border-neutral-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <label className="block text-sm font-semibold text-neutral-900">
                    {setting.key
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  {setting.dirty && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Modified
                    </span>
                  )}
                </div>

                {/* Hero Video URL */}
                {setting.key === 'hero_video_url' && (
                  <div>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={setting.value as string}
                      onChange={(e) =>
                        updateSetting(setting.key, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 mb-3"
                    />
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={saving || !setting.dirty}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}

                {/* About Content */}
                {setting.key === 'about_content' && (
                  <div>
                    <textarea
                      placeholder="About content..."
                      value={setting.value as string}
                      onChange={(e) =>
                        updateSetting(setting.key, e.target.value)
                      }
                      rows={5}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 mb-3"
                    />
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={saving || !setting.dirty}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}

                {/* About Headshots (Array of URLs) */}
                {setting.key === 'about_headshots' && (
                  <div>
                    <div className="space-y-2 mb-3">
                      {(setting.value as string[]).map((url, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => {
                              const updated = [...(setting.value as string[])]
                              updated[idx] = e.target.value
                              updateSetting(setting.key, updated)
                            }}
                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
                          />
                          <button
                            onClick={() => {
                              const updated = (setting.value as string[]).filter((_, i) => i !== idx)
                              updateSetting(setting.key, updated)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const updated = [...(setting.value as string[]), '']
                        updateSetting(setting.key, updated)
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition mb-3"
                    >
                      <Plus className="w-4 h-4" />
                      Add Headshot
                    </button>
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={saving || !setting.dirty}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}

                {/* Testimonials (Array of { name, text, role }) */}
                {setting.key === 'testimonials' && (
                  <div>
                    <div className="space-y-4 mb-3">
                      {(setting.value as Array<{ name: string; text: string; role: string }>).map(
                        (testimonial, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2"
                          >
                            <input
                              type="text"
                              placeholder="Name"
                              value={testimonial.name || ''}
                              onChange={(e) => {
                                const updated = [...(setting.value as Array<{ name: string; text: string; role: string }>)]
                                updated[idx].name = e.target.value
                                updateSetting(setting.key, updated)
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Role"
                              value={testimonial.role || ''}
                              onChange={(e) => {
                                const updated = [...(setting.value as Array<{ name: string; text: string; role: string }>)]
                                updated[idx].role = e.target.value
                                updateSetting(setting.key, updated)
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 text-sm"
                            />
                            <textarea
                              placeholder="Testimonial text"
                              value={testimonial.text || ''}
                              onChange={(e) => {
                                const updated = [...(setting.value as Array<{ name: string; text: string; role: string }>)]
                                updated[idx].text = e.target.value
                                updateSetting(setting.key, updated)
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 text-sm"
                            />
                            <button
                              onClick={() => {
                                const updated = (setting.value as Array<{ name: string; text: string; role: string }>).filter(
                                  (_, i) => i !== idx
                                )
                                updateSetting(setting.key, updated)
                              }}
                              className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const updated = [
                          ...(setting.value as Array<{ name: string; text: string; role: string }>),
                          { name: '', text: '', role: '' },
                        ]
                        updateSetting(setting.key, updated)
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition mb-3"
                    >
                      <Plus className="w-4 h-4" />
                      Add Testimonial
                    </button>
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={saving || !setting.dirty}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}

                {/* Contact Recipient */}
                {setting.key === 'contact_recipient' && (
                  <div>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={setting.value as string}
                      onChange={(e) =>
                        updateSetting(setting.key, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 mb-3"
                    />
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={saving || !setting.dirty}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContentPage
