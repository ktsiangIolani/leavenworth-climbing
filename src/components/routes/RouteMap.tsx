import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { ClimbingRoute } from '../../types'

const AIRBNB = {
  lat: 47.7778,
  lng: -120.6656,
  label: '190 Dos Brothers Lane',
  sublabel: 'Leavenworth (Plain), WA',
}

const airbnbIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;
    background:#ff385c;border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
    display:flex;align-items:center;justify-content:center;
  "><span style="transform:rotate(45deg);font-size:16px;line-height:1;">🏠</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
})

// Fix Leaflet default marker icon in Vite
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Colors grouped by geographic zone (sub-area → zone color)
const AREA_COLORS: Record<string, string> = {
  // Icicle Canyon — lower/mid Icicle Road
  'Trundle Dome':    '#FF6B35',
  '30 Rock':         '#FF6B35',
  'Alphabet Rock':   '#FF6B35',
  // Snow Creek — upper Icicle / Snow Creek
  'Bathtub Dome':    '#10B981',
  'Eight Mile Rock': '#10B981',
  'Pearly Gates':    '#10B981',
  // Sport Domes — Secret & Bacon Gully corridor
  'Secret Dome':     '#8B5CF6',
  'Bacon Gully':     '#8B5CF6',
  // Tumwater Canyon — Hwy 2 canyon crags
  'Rattlesnake Rock':'#EF4444',
  'Hobo Gulch':      '#EF4444',
  // Clem's Holler — west Leavenworth
  "Clem's Holler":   '#F59E0B',
  // Index / Skykomish day trip
  'Beetle Bailey Slab': '#06B6D4',
  'Inner Walls':     '#06B6D4',
}

// Legend entries: one row per zone
const ZONE_LEGEND = [
  { label: 'Icicle Canyon',   color: '#FF6B35' },
  { label: 'Snow Creek',      color: '#10B981' },
  { label: 'Sport Domes',     color: '#8B5CF6' },
  { label: 'Tumwater Canyon', color: '#EF4444' },
  { label: "Clem's Holler",   color: '#F59E0B' },
  { label: 'Index',           color: '#06B6D4' },
]

function FlyAndFocus({
  route,
  markerRefs,
}: {
  route: ClimbingRoute | null
  markerRefs: React.MutableRefObject<Record<string, L.CircleMarker | null>>
}) {
  const map = useMap()
  useEffect(() => {
    if (!route) return
    map.flyTo([route.lat, route.lng], 15, { duration: 0.8 })
    const t = setTimeout(() => markerRefs.current[route.id]?.openPopup(), 900)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.id])
  return null
}

interface Props {
  routes: ClimbingRoute[]
  onRouteClick: (route: ClimbingRoute) => void
  focusRoute?: ClimbingRoute | null
}

export function RouteMap({ routes, onRouteClick, focusRoute }: Props) {
  const markerRefs = useRef<Record<string, L.CircleMarker | null>>({})

  useEffect(() => {
    // Force Leaflet to recalculate size after DOM is ready
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[47.65, -120.680]}
        zoom={11}
        className="h-full w-full"
        zoomControl
        style={{ background: '#f8f9fa' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FlyAndFocus route={focusRoute ?? null} markerRefs={markerRefs} />

        {/* Airbnb cabin marker */}
        <Marker position={[AIRBNB.lat, AIRBNB.lng]} icon={airbnbIcon}>
          <Popup>
            <div style={{ minWidth: '160px', fontFamily: 'Inter, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '3px', color: '#111827' }}>
                🏠 Our Airbnb
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>{AIRBNB.label}</p>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>{AIRBNB.sublabel}</p>
            </div>
          </Popup>
        </Marker>

        {routes.map(route => {
          const color  = AREA_COLORS[route.area] ?? '#E84A5F'
          const isLight = color === '#FECEAB'
          const radius = route.style === 'Boulder' ? 7 : 10
          return (
            <CircleMarker
              key={route.id}
              ref={el => { markerRefs.current[route.id] = el }}
              center={[route.lat, route.lng]}
              radius={radius}
              pathOptions={{
                fillColor: color, fillOpacity: 0.95,
                color: isLight ? '#C4894A' : '#ffffff', weight: 2, opacity: 1,
              }}
            >
              <Popup>
                <div style={{ minWidth: '170px', fontFamily: 'Inter, sans-serif' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-1)' }}>
                    {route.name}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      background: '#FEF0F2', color: '#BE2B41',
                      borderRadius: '20px', padding: '2px 8px',
                      border: '1px solid #F9B8C1'
                    }}>{route.grade}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      background: '#f3f4f6', color: '#374151',
                      borderRadius: '20px', padding: '2px 8px',
                      border: '1px solid #e5e7eb'
                    }}>{route.style}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-2)', marginBottom: '8px' }}>{route.area}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onRouteClick(route)}
                      style={{
                        flex: 1, background: '#E84A5F', color: 'white',
                        border: 'none', borderRadius: '10px', padding: '7px 12px',
                        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      View route →
                    </button>
                    {route.mpUrl && (
                      <a
                        href={route.mpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '34px', background: '#fff7ed', color: '#ea580c',
                          border: '1px solid #fed7aa', borderRadius: '10px',
                          fontSize: '13px', textDecoration: 'none', cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        title="View on Mountain Project"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend card */}
      <div
        className="absolute bottom-5 left-4 z-[1000] rounded-2xl bg-card/95 backdrop-blur-sm border border-card shadow-card p-3"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2">Legend</p>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm leading-none">🏠</span>
          <span className="text-xs font-medium text-secondary">Airbnb</span>
        </div>
        {ZONE_LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs font-medium text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
