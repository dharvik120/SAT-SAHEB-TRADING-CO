'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { Globe, Ship, Anchor, CheckCircle } from 'lucide-react'

interface TradeNode {
  id: string
  name: string
  coordinates: { x: number; y: number } // Percentage position inside SVG coordinate map
  info: string
  type: 'hub' | 'destination'
}

const tradeNodes: TradeNode[] = [
  {
    id: 'india',
    name: 'Mundra Port, India (Origin)',
    coordinates: { x: 67, y: 55 },
    info: 'SAT SAHEB TRADING CO. Headquarters & Core Logistics Hub. Directly connected to Mundra Port, Kutches premier trade terminal.',
    type: 'hub',
  },
  {
    id: 'middle-east',
    name: 'Gulf Cooperation Council (GCC)',
    coordinates: { x: 58, y: 53 },
    info: 'High demand export route for premium Grains, Pulses, and Cumin Seeds.',
    type: 'destination',
  },
  {
    id: 'europe',
    name: 'European Union Portals',
    coordinates: { x: 50, y: 35 },
    info: 'Premium quality compliance shipments, including hand-selected kidney beans and whole seed exports.',
    type: 'destination',
  },
  {
    id: 'southeast-asia',
    name: 'South-East Asian Ports',
    coordinates: { x: 78, y: 62 },
    info: 'Fast shipping transit route for wholesale pulses, chick peas, and red kidney beans.',
    type: 'destination',
  },
  {
    id: 'americas',
    name: 'North American Hubs',
    coordinates: { x: 25, y: 38 },
    info: 'Custom graded packaging and specifications matching strict import control guidelines.',
    type: 'destination',
  },
]

interface InteractiveMapProps {
  logisticsTitle?: string | null
  logisticsOriginTitle?: string | null
  logisticsOriginDesc?: string | null
  nodes?: any[]
}

export default function InteractiveMap({
  logisticsTitle,
  logisticsOriginTitle,
  logisticsOriginDesc,
  nodes: initialNodes = []
}: InteractiveMapProps) {
  const [liveNodes, setLiveNodes] = useState<any[]>(initialNodes)

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'logisticsNodes'), (snap) => {
        if (!snap.empty) {
          const fresh: any[] = []
          snap.forEach((doc) => {
            const data = doc.data()
            if (data.isEnabled !== false) fresh.push({ id: doc.id, ...data })
          })
          fresh.sort((a, b) => (a.order || 0) - (b.order || 0))
          if (fresh.length > 0) setLiveNodes(fresh)
        }
      })
      return () => unsub()
    } catch (e) {
      console.warn('InteractiveMap live listener bypassed:', e)
    }
  }, [])

  const currentNodes = liveNodes.length > 0 ? liveNodes : initialNodes
  const displayNodes: TradeNode[] = currentNodes && currentNodes.length > 0
    ? currentNodes.map((n) => ({
        id: String(n.id),
        name: n.name,
        coordinates: { x: n.xCoord, y: n.yCoord },
        info: n.info,
        type: n.type as 'hub' | 'destination',
      }))
    : [...tradeNodes]

  if ((logisticsOriginTitle || logisticsOriginDesc) && displayNodes.length > 0) {
    const originIdx = displayNodes.findIndex(n => n.type === 'hub')
    const fallbackIdx = originIdx !== -1 ? originIdx : 0
    if (displayNodes[fallbackIdx]) {
      displayNodes[fallbackIdx] = {
        ...displayNodes[fallbackIdx],
        name: logisticsOriginTitle || displayNodes[fallbackIdx].name,
        info: logisticsOriginDesc || displayNodes[fallbackIdx].info,
      }
    }
  }

  const [activeNode, setActiveNode] = useState<TradeNode | null>(displayNodes[0] || null)
  const originNode = displayNodes.find((n) => n.type === 'hub') || displayNodes[0]

  return (
    <div className="relative w-full py-16 px-6 bg-gradient-to-b from-[#032318] to-emerald-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Side: Trade Details Panel */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 text-secondary mb-4"
          >
            <Globe className="h-4 w-4 animate-spin-slow" />
            <span className="font-sans text-xs uppercase tracking-mega font-bold">Global Logistics</span>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif text-white tracking-wide leading-tight mb-6"
          >
            {logisticsTitle || 'Connecting Farms to Global Ports'}
          </motion.h3>

          <div className="relative h-64 bg-emerald-900/30 border border-emerald-800/40 p-6 rounded-none flex flex-col justify-between overflow-hidden shadow-premium">
            <div className="absolute right-4 bottom-4 opacity-5 text-emerald-100">
              <Ship className="h-32 w-32" />
            </div>

            {activeNode ? (
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="z-10 flex flex-col h-full justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-secondary font-sans font-semibold mb-2">
                    {activeNode.type === 'hub' ? <Anchor className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <h4 className="text-sm tracking-wider uppercase">{activeNode.name}</h4>
                  </div>
                  <p className="font-sans text-xs md:text-sm text-emerald-100/70 leading-relaxed mt-4">
                    {activeNode.info}
                  </p>
                </div>
                
                <span className="text-[10px] tracking-widest text-emerald-300/50 uppercase mt-4 block border-t border-emerald-800/50 pt-3">
                  Click nodes on map to inspect shipping corridors
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center text-emerald-200/40">
                <p className="text-sm">Hover or select a corridor node on the map.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas */}
        <div className="lg:col-span-2 relative aspect-[16/9] w-full bg-emerald-900/10 border border-emerald-900/20 shadow-premium p-4 md:p-8 flex items-center justify-center">
          {/* Vector SVG World Map Silhouette overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08]"
            viewBox="0 0 1000 500"
            fill="currentColor"
          >
            {/* Very simple abstract representation of major landmasses */}
            {/* North America */}
            <path d="M 50 100 L 250 80 L 300 200 L 200 300 L 150 250 L 100 350 L 50 200 Z" />
            {/* South America */}
            <path d="M 200 300 L 250 350 L 280 480 L 230 490 L 180 380 Z" />
            {/* Africa */}
            <path d="M 450 220 L 550 200 L 600 350 L 520 450 L 460 380 Z" />
            {/* Eurasia */}
            <path d="M 380 180 L 600 80 L 850 100 L 950 180 L 800 300 L 720 280 L 650 350 L 520 320 Z" />
            {/* Australia */}
            <path d="M 800 380 L 900 390 L 880 470 L 790 450 Z" />
          </svg>

          {/* Map Nodes and Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {displayNodes
              .filter((n) => n.type !== 'hub')
              .map((node) => {
                const isActive = activeNode?.id === node.id
                
                // Draw curve path from Mundra (origin) to destination
                // control point for quadratic curve
                const cX = (originNode.coordinates.x + node.coordinates.x) / 2
                const cY = Math.min(originNode.coordinates.y, node.coordinates.y) - 10
                
                return (
                  <motion.path
                    key={`line-${node.id}`}
                    d={`M ${originNode.coordinates.x} ${originNode.coordinates.y} Q ${cX} ${cY} ${node.coordinates.x} ${node.coordinates.y}`}
                    fill="none"
                    stroke={isActive ? '#d69317' : '#059669'}
                    strokeWidth={isActive ? '0.6' : '0.3'}
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                )
              })}
          </svg>

          {/* Render Trade Node Buttons (Interactive Overlay) */}
          <div className="absolute inset-0">
            {displayNodes.map((node) => {
              const isOrigin = node.type === 'hub'
              const isActive = activeNode?.id === node.id
              
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className="absolute group/node -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                >
                  {/* Outer pulsating wave */}
                  <motion.div
                    animate={
                      isOrigin
                        ? { scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }
                        : isActive
                        ? { scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }
                        : { scale: 1, opacity: 0 }
                    }
                    transition={{
                      duration: isOrigin ? 2.5 : 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={`absolute -inset-3 rounded-full ${isOrigin ? 'bg-secondary' : 'bg-emerald-500'}`}
                  />
                  
                  {/* Inner Solid Marker */}
                  <div
                    className={`relative z-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isOrigin
                        ? 'h-6 w-6 bg-secondary text-[#032318]'
                        : isActive
                        ? 'h-5 w-5 bg-white text-primary border border-secondary scale-110'
                        : 'h-4.5 w-4.5 bg-emerald-600 border border-emerald-400 group-hover/node:bg-emerald-400 scale-100'
                    }`}
                  >
                    {isOrigin && <Anchor className="h-3 w-3" />}
                  </div>
                  
                  {/* Hover Floating Text label */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-7 z-20 whitespace-nowrap hidden group-hover/node:block bg-black/90 border border-emerald-800 px-2 py-1 text-[10px] uppercase tracking-wider rounded-none">
                    {node.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
      </div>
      
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
