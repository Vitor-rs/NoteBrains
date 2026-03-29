import { useEffect, useState, useCallback, useRef } from 'react'
import Graph from 'graphology'
import { SigmaContainer, useLoadGraph, useSigma, useRegisterEvents, useSetSettings } from '@react-sigma/core'
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import '@react-sigma/core/lib/style.css'
import { useNotes } from '../../store/NotesContext'
import { getTagColor } from '../../types'
import type { Note } from '../../types'

// Build a graphology graph from the notes data
function buildGraph(notes: Note[]): Graph {
  const graph = new Graph()

  // Add nodes for each note
  notes.forEach((note, i) => {
    // Determine the main color based on primary tag
    const primaryTag = note.tags[0]
    const color = primaryTag ? getTagColor(primaryTag) : '#6b7280'

    // Place nodes in a circle initially (ForceAtlas2 will rearrange)
    const angle = (2 * Math.PI * i) / Math.max(notes.length, 1)
    const radius = 100

    graph.addNode(note.id, {
      label: note.title === 'Sem título' ? `Nota ${i + 1}` : note.title,
      x: radius * Math.cos(angle) + (Math.random() - 0.5) * 20,
      y: radius * Math.sin(angle) + (Math.random() - 0.5) * 20,
      size: Math.max(6, 4 + note.tags.length * 2),
      color,
      noteId: note.id,
      borderColor: color,
      type: 'circle',
    })
  })

  // Add edges between notes that share tags
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const sharedTags = notes[i].tags.filter((t) => notes[j].tags.includes(t))
      if (sharedTags.length > 0) {
        const edgeColor = getTagColor(sharedTags[0])
        graph.addEdge(notes[i].id, notes[j].id, {
          size: Math.min(1 + sharedTags.length, 4),
          color: edgeColor + '60', // Add transparency
          type: 'line',
          tags: sharedTags,
        })
      }
    }
  }

  // Also add tag nodes as smaller cluster centers
  const tagSet = new Set<string>()
  notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)))

  tagSet.forEach((tag) => {
    const tagId = `tag-${tag}`
    const color = getTagColor(tag)
    const connectedNotes = notes.filter((n) => n.tags.includes(tag))

    if (connectedNotes.length >= 1) {
      // Place tag node near its connected notes
      const avgX = connectedNotes.reduce((sum, n) => {
        const attrs = graph.getNodeAttributes(n.id)
        return sum + (attrs.x as number)
      }, 0) / connectedNotes.length

      const avgY = connectedNotes.reduce((sum, n) => {
        const attrs = graph.getNodeAttributes(n.id)
        return sum + (attrs.y as number)
      }, 0) / connectedNotes.length

      graph.addNode(tagId, {
        label: `#${tag}`,
        x: avgX + (Math.random() - 0.5) * 10,
        y: avgY + (Math.random() - 0.5) * 10,
        size: 4 + connectedNotes.length,
        color: color + 'cc',
        borderColor: color,
        type: 'circle',
        isTag: true,
      })

      // Connect tag to its notes
      connectedNotes.forEach((note) => {
        graph.addEdge(tagId, note.id, {
          size: 0.8,
          color: color + '30',
          type: 'line',
        })
      })
    }
  })

  return graph
}

// Inner component that loads the graph and handles interactions
function GraphEvents({ onNodeClick }: { onNodeClick: (noteId: string) => void }) {
  const sigma = useSigma()
  const loadGraph = useLoadGraph()
  const registerEvents = useRegisterEvents()
  const setSettings = useSetSettings()
  const { notes } = useNotes()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const animFrameRef = useRef<number>(0)

  // Load graph when notes change
  useEffect(() => {
    const graph = buildGraph(notes)
    loadGraph(graph)
  }, [notes, loadGraph])

  // Start ForceAtlas2 layout (worker-based for start/stop)
  const { start: startFA2, stop: stopFA2 } = useWorkerLayoutForceAtlas2({
    settings: {
      gravity: 5,
      scalingRatio: 20,
      strongGravityMode: true,
      slowDown: 10,
      barnesHutOptimize: true,
      barnesHutTheta: 0.5,
    },
  })

  useEffect(() => {
    startFA2()
    // Stop after a few seconds to settle
    const timer = setTimeout(() => {
      stopFA2()
      // Start subtle breathing animation
      startBreathingAnimation()
    }, 3000)
    return () => {
      clearTimeout(timer)
      stopFA2()
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [notes]) // eslint-disable-line react-hooks/exhaustive-deps

  // Subtle organic breathing animation
  const startBreathingAnimation = useCallback(() => {
    const graph = sigma.getGraph()
    const startTime = Date.now()
    const originalPositions: Record<string, { x: number; y: number }> = {}

    graph.forEachNode((node, attrs) => {
      originalPositions[node] = { x: attrs.x as number, y: attrs.y as number }
    })

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000

      graph.forEachNode((node) => {
        const orig = originalPositions[node]
        if (!orig) return
        // Each node has its own subtle oscillation
        const nodeHash = node.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
        const phase = nodeHash * 0.1
        const dx = Math.sin(elapsed * 0.3 + phase) * 0.4
        const dy = Math.cos(elapsed * 0.25 + phase * 1.3) * 0.4

        graph.setNodeAttribute(node, 'x', orig.x + dx)
        graph.setNodeAttribute(node, 'y', orig.y + dy)
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }, [sigma])

  // Register events for hover and click
  useEffect(() => {
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      clickNode: (event) => {
        const attrs = sigma.getGraph().getNodeAttributes(event.node)
        if (attrs.isTag) return // Don't navigate for tag nodes
        onNodeClick(event.node)
      },
    })
  }, [registerEvents, sigma, onNodeClick])

  // Update settings with nodeReducer for hover effects
  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph()
        const newData = { ...data }

        if (hoveredNode) {
          if (node === hoveredNode) {
            // Hovered node: enlarge and brighten
            newData.size = (data.size as number) * 1.5
            newData.zIndex = 10
            newData.highlighted = true
          } else if (graph.hasEdge(hoveredNode, node) || graph.hasEdge(node, hoveredNode)) {
            // Neighbor: slightly enlarge, keep color
            newData.size = (data.size as number) * 1.2
            newData.highlighted = true
          } else {
            // Not connected: dim
            newData.color = `${data.color}33`
            newData.label = ''
          }
        }

        return newData
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph()
        const newData = { ...data }

        if (hoveredNode) {
          const [source, target] = graph.extremities(edge)
          if (source === hoveredNode || target === hoveredNode) {
            // Connected edge: brighten and thicken
            newData.size = Math.max((data.size as number) * 2, 2)
            const color = (data.color as string).replace(/[0-9a-f]{2}$/i, 'bb')
            newData.color = color
          } else {
            // Unrelated edge: dim
            newData.color = `${data.color}11`
          }
        }

        return newData
      },
    })
  }, [hoveredNode, sigma, setSettings])

  return null
}

interface KnowledgeGraphProps {
  onNodeClick: (noteId: string) => void
}

export function KnowledgeGraph({ onNodeClick }: KnowledgeGraphProps) {
  const { notes } = useNotes()

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            Crie notas e adicione tags para visualizar o grafo de conhecimento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-gray-950 overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Regiões</p>
        <div className="space-y-1.5">
          {Array.from(new Set(notes.flatMap((n) => n.tags))).slice(0, 8).map((tag) => (
            <div key={tag} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTagColor(tag) }} />
              <span className="text-[11px] text-gray-400">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sigma Container */}
      <SigmaContainer
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        settings={{
          allowInvalidContainer: true,
          renderLabels: true,
          renderEdgeLabels: false,
          labelSize: 11,
          labelColor: { color: '#e5e7eb' },
          labelFont: 'system-ui, sans-serif',
          labelDensity: 0.5,
          labelGridCellSize: 80,
          labelRenderedSizeThreshold: 4,
          defaultNodeColor: '#6b7280',
          defaultEdgeColor: '#374151',
          defaultEdgeType: 'line',
          stagePadding: 40,
          zoomToSizeRatioFunction: (x) => x,
          itemSizesReference: 'positions',
          defaultDrawNodeHover: (context, data, settings) => {
            const size = data.size || 6
            // Outer glow
            const gradient = context.createRadialGradient(data.x, data.y, size, data.x, data.y, size * 3)
            gradient.addColorStop(0, (data.color || '#6b7280') + '40')
            gradient.addColorStop(1, 'transparent')
            context.beginPath()
            context.arc(data.x, data.y, size * 3, 0, Math.PI * 2)
            context.fillStyle = gradient
            context.fill()

            // Node circle
            context.beginPath()
            context.arc(data.x, data.y, size + 1, 0, Math.PI * 2)
            context.fillStyle = data.color || '#6b7280'
            context.fill()
            context.strokeStyle = '#ffffff44'
            context.lineWidth = 1.5
            context.stroke()

            // Label
            if (data.label) {
              context.font = `${settings.labelSize + 2}px ${settings.labelFont}`
              context.fillStyle = '#f3f4f6'
              context.textAlign = 'center'
              context.fillText(data.label, data.x, data.y + size + 14)
            }
          },
        }}
      >
        <GraphEvents onNodeClick={onNodeClick} />
      </SigmaContainer>

      {/* Decorative radial glow in center */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-3xl" />
      </div>
    </div>
  )
}
