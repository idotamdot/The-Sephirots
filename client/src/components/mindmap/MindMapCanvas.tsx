import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { User } from "@/lib/types";

// Types for mind map nodes and connections
export interface MindMapNode {
  id: string;
  type: "concept" | "insight" | "question" | "experience" | "connection";
  content: string;
  x: number;
  y: number;
  color: string;
  size: number;
  createdBy: number;  // User ID
  connections: string[];  // Array of node IDs this node is connected to
  attributes?: {
    [key: string]: any;
  };
}

export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted" | "wavy";
}

interface MindMapCanvasProps {
  initialNodes?: MindMapNode[];
  initialConnections?: MindMapConnection[];
  currentUser?: User;
  readOnly?: boolean;
  collaborative?: boolean;
  onChange?: (nodes: MindMapNode[], connections: MindMapConnection[]) => void;
  onSave?: () => void;
}

const NODE_TYPES = [
  { type: "concept", label: "Concept", icon: "ri-ball-pen-line", color: "#8b5cf6" },
  { type: "insight", label: "Insight", icon: "ri-lightbulb-flash-line", color: "#f59e0b" },
  { type: "question", label: "Question", icon: "ri-question-mark", color: "#3b82f6" },
  { type: "experience", label: "Experience", icon: "ri-heart-pulse-line", color: "#ec4899" },
  { type: "connection", label: "Connection", icon: "ri-link-m", color: "#10b981" }
];

const CONNECTION_STYLES = [
  { style: "solid", label: "Solid", icon: "ri-subtract-line" },
  { style: "dashed", label: "Dashed", icon: "ri-separator" },
  { style: "dotted", label: "Dotted", icon: "ri-more-line" },
  { style: "wavy", label: "Wavy", icon: "ri-scales-3-line" }
];

// Default node attributes
const getDefaultNodeAttributes = (type: string) => {
  switch (type) {
    case "concept":
      return { abstraction: 0.7, clarity: 0.8, connectivity: 0.6 };
    case "insight":
      return { intuition: 0.9, revelation: 0.7, depth: 0.8 };
    case "question": 
      return { curiosity: 0.9, openness: 0.8, complexity: 0.6 };
    case "experience":
      return { intensity: 0.8, duration: 0.5, reflection: 0.7 };
    case "connection":
      return { strength: 0.8, bidirectional: true, resonance: 0.7 };
    default:
      return {};
  }
};

// Generate a unique ID
const generateId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

export default function MindMapCanvas({
  initialNodes = [],
  initialConnections = [],
  currentUser,
  readOnly = false,
  collaborative = false,
  onChange,
  onSave
}: MindMapCanvasProps) {
  // State for nodes and connections
  const [nodes, setNodes] = useState<MindMapNode[]>(initialNodes);
  const [connections, setConnections] = useState<MindMapConnection[]>(initialConnections);
  
  // State for canvas interaction
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [creatingConnection, setCreatingConnection] = useState<{sourceId: string, targetId: string | null} | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // State for editing tools
  const [activeNodeType, setActiveNodeType] = useState<string>("concept");
  const [activeConnectionStyle, setActiveConnectionStyle] = useState<string>("solid");
  const [showToolbar, setShowToolbar] = useState(true);
  const [connectionThickness, setConnectionThickness] = useState(2);
  const [isEditingNodeContent, setIsEditingNodeContent] = useState(false);
  const [editingContent, setEditingContent] = useState("");
  
  // References
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Handle canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    if (e.button === 0 && !e.target.closest(".node") && !draggingNode) {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (readOnly) return;
    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
    
    if (draggingNode) {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === draggingNode 
            ? { 
                ...node, 
                x: node.x + (e.movementX / scale), 
                y: node.y + (e.movementY / scale) 
              } 
            : node
        )
      );
    }
  };
  
  const handleCanvasMouseUp = () => {
    if (readOnly) return;
    isDragging.current = false;
    setDraggingNode(null);
    
    if (creatingConnection && creatingConnection.targetId) {
      addConnection(creatingConnection.sourceId, creatingConnection.targetId);
      setCreatingConnection(null);
    }
  };
  
  // Node interactions
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedNode(nodeId);
    setDraggingNode(nodeId);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleNodeDoubleClick = (e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingContent(node.content);
      setIsEditingNodeContent(true);
      setSelectedNode(nodeId);
    }
  };
  
  // Connection management
  const startConnectionCreation = (nodeId: string) => {
    if (readOnly) return;
    setCreatingConnection({ sourceId: nodeId, targetId: null });
  };
  
  const completeConnectionCreation = (nodeId: string) => {
    if (readOnly || !creatingConnection) return;
    
    if (creatingConnection.sourceId !== nodeId) {
      setCreatingConnection({ ...creatingConnection, targetId: nodeId });
    }
  };
  
  const addConnection = (sourceId: string, targetId: string) => {
    if (readOnly) return;
    
    // Don't connect if already connected
    if (connections.some(c => 
      (c.sourceId === sourceId && c.targetId === targetId) || 
      (c.sourceId === targetId && c.targetId === sourceId))
    ) {
      return;
    }
    
    const newConnection: MindMapConnection = {
      id: `conn_${generateId()}`,
      sourceId,
      targetId,
      color: NODE_TYPES.find(t => t.type === activeNodeType)?.color || "#8b5cf6",
      thickness: connectionThickness,
      style: activeConnectionStyle as "solid" | "dashed" | "dotted" | "wavy"
    };
    
    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);
    
    // Also update the connections array in the nodes
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === sourceId) {
          return { ...node, connections: [...node.connections, targetId] };
        }
        return node;
      })
    );
    
    if (onChange) {
      onChange([...nodes], updatedConnections);
    }
  };
  
  // Node management
  const addNode = (x: number, y: number) => {
    if (readOnly) return;
    
    const nodeType = NODE_TYPES.find(t => t.type === activeNodeType);
    if (!nodeType || !currentUser) return;
    
    const newNode: MindMapNode = {
      id: generateId(),
      type: activeNodeType as any,
      content: `New ${nodeType.label}`,
      x: (x - position.x) / scale,
      y: (y - position.y) / scale,
      color: nodeType.color,
      size: 100,
      createdBy: currentUser.id,
      connections: [],
      attributes: getDefaultNodeAttributes(activeNodeType)
    };
    
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setSelectedNode(newNode.id);
    
    if (onChange) {
      onChange(updatedNodes, [...connections]);
    }
  };
  
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    
    // Don't add a node if we clicked on an existing node
    if (e.target.closest(".node")) return;
    
    const { left, top } = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    addNode(e.clientX - left, e.clientY - top);
  };
  
  const deleteNode = (nodeId: string) => {
    if (readOnly) return;
    
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    
    // Also delete connections to/from this node
    const updatedConnections = connections.filter(conn => 
      conn.sourceId !== nodeId && conn.targetId !== nodeId
    );
    
    setNodes(updatedNodes);
    setConnections(updatedConnections);
    setSelectedNode(null);
    
    if (onChange) {
      onChange(updatedNodes, updatedConnections);
    }
  };
  
  const updateNodeContent = () => {
    if (readOnly || !selectedNode) return;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === selectedNode ? { ...node, content: editingContent } : node
      )
    );
    setIsEditingNodeContent(false);
    
    if (onChange) {
      onChange([...nodes], [...connections]);
    }
  };
  
  // Connection deletion
  const deleteConnection = (connectionId: string) => {
    if (readOnly) return;
    
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;
    
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    
    // Also update the connections array in the nodes
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === connection.sourceId) {
          return { 
            ...node, 
            connections: node.connections.filter(c => c !== connection.targetId) 
          };
        }
        return node;
      })
    );
    
    setConnections(updatedConnections);
    setSelectedConnection(null);
    
    if (onChange) {
      onChange([...nodes], updatedConnections);
    }
  };
  
  // Zoom handling
  const handleZoom = (factor: number) => {
    setScale(prevScale => {
      const newScale = Math.max(0.5, Math.min(2, prevScale * factor));
      return newScale;
    });
  };
  
  // Calculate position for temporary connection line during creation
  const getTemporaryConnectionPath = () => {
    if (!creatingConnection) return "";
    
    const sourceNode = nodes.find(n => n.id === creatingConnection.sourceId);
    if (!sourceNode) return "";
    
    const sourceX = sourceNode.x * scale + position.x;
    const sourceY = sourceNode.y * scale + position.y;
    
    const mousePosition = lastMousePos.current;
    
    return `M ${sourceX} ${sourceY} L ${mousePosition.x - (canvasRef.current?.getBoundingClientRect().left || 0)} ${mousePosition.y - (canvasRef.current?.getBoundingClientRect().top || 0)}`;
  };
  
  // Calculate the SVG path for a connection
  const getConnectionPath = (conn: MindMapConnection) => {
    const sourceNode = nodes.find(n => n.id === conn.sourceId);
    const targetNode = nodes.find(n => n.id === conn.targetId);
    
    if (!sourceNode || !targetNode) return "";
    
    const sourceX = sourceNode.x * scale + position.x;
    const sourceY = sourceNode.y * scale + position.y;
    const targetX = targetNode.x * scale + position.x;
    const targetY = targetNode.y * scale + position.y;
    
    // Direct line
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  };
  
  // Get stroke-dasharray based on style
  const getConnectionDashArray = (style: string) => {
    switch(style) {
      case "dashed": return "5,5";
      case "dotted": return "2,2";
      case "wavy": return ""; // Special case handled with path d attribute
      default: return "";
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };
  
  // Effect to notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(nodes, connections);
    }
  }, [nodes, connections, onChange]);
  
  // Initialize canvas with default nodes if empty
  useEffect(() => {
    if (nodes.length === 0 && currentUser) {
      const defaultNodes: MindMapNode[] = [
        {
          id: generateId(),
          type: "concept",
          content: "Central Concept",
          x: 400,
          y: 250,
          color: "#8b5cf6",
          size: 120,
          createdBy: currentUser.id,
          connections: [],
          attributes: getDefaultNodeAttributes("concept")
        }
      ];
      
      setNodes(defaultNodes);
      
      if (onChange) {
        onChange(defaultNodes, []);
      }
    }
  }, [currentUser]);
  
  return (
    <div className="relative h-full w-full flex flex-col rounded-lg border border-gray-200">
      {/* Toolbar */}
      {showToolbar && !readOnly && (
        <div className="p-2 border-b border-gray-200 bg-white rounded-t-lg flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(1.1)}
              className="h-8 w-8"
            >
              <i className="ri-zoom-in-line"></i>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(0.9)}
              className="h-8 w-8"
            >
              <i className="ri-zoom-out-line"></i>
            </Button>
            <span className="text-xs mx-1">{Math.round(scale * 100)}%</span>
          </div>
          
          <div className="mr-4 border-r border-gray-200 pr-2">
            <ToggleGroup type="single" value={activeNodeType} onValueChange={(value) => value && setActiveNodeType(value)}>
              {NODE_TYPES.map(type => (
                <TooltipProvider key={type.type}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem 
                        value={type.type} 
                        aria-label={type.label}
                        className="h-8 w-8"
                      >
                        <i 
                          className={type.icon} 
                          style={{ color: activeNodeType === type.type ? type.color : undefined }}
                        ></i>
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{type.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </ToggleGroup>
          </div>
          
          <div className="mr-4 border-r border-gray-200 pr-2">
            <ToggleGroup type="single" value={activeConnectionStyle} onValueChange={(value) => value && setActiveConnectionStyle(value)}>
              {CONNECTION_STYLES.map(style => (
                <TooltipProvider key={style.style}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem 
                        value={style.style} 
                        aria-label={style.label}
                        className="h-8 w-8"
                      >
                        <i className={style.icon}></i>
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{style.label} Connection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </ToggleGroup>
          </div>
          
          <div className="flex items-center gap-2 mr-4">
            <span className="text-xs">Thickness</span>
            <Slider
              value={[connectionThickness]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setConnectionThickness(value[0])}
              className="w-24"
            />
          </div>
          
          <div className="ml-auto">
            <Button onClick={handleSave}>
              <i className="ri-save-line mr-1"></i>
              Save Map
            </Button>
          </div>
        </div>
      )}
      
      {/* Mind Map Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gray-50"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onDoubleClick={handleCanvasDoubleClick}
      >
        {/* SVG Layer for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Render all connections */}
          {connections.map(conn => (
            <g key={conn.id} onClick={() => setSelectedConnection(conn.id)}>
              <path
                d={getConnectionPath(conn)}
                stroke={conn.color}
                strokeWidth={conn.thickness}
                strokeDasharray={getConnectionDashArray(conn.style)}
                fill="none"
                className={selectedConnection === conn.id ? "selected-connection" : ""}
                style={{ pointerEvents: "auto", cursor: "pointer" }}
              />
              
              {/* Draw the label if present */}
              {conn.label && (
                <text
                  x={0}
                  y={0}
                  className="connection-label"
                  fill={conn.color}
                  fontSize="12px"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {conn.label}
                </text>
              )}
            </g>
          ))}
          
          {/* Render temporary connection line while creating */}
          {creatingConnection && (
            <path
              d={getTemporaryConnectionPath()}
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5,5"
              fill="none"
            />
          )}
        </svg>
        
        {/* Node Layer */}
        <div className="absolute inset-0">
          {nodes.map(node => {
            const nodeSize = node.size * scale;
            const nodeType = NODE_TYPES.find(t => t.type === node.type);
            
            return (
              <div
                key={node.id}
                className={`absolute node select-none ${selectedNode === node.id ? 'ring-2 ring-amber-400' : ''} ${draggingNode === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: node.x * scale + position.x - (nodeSize / 2),
                  top: node.y * scale + position.y - (nodeSize / 2),
                  width: nodeSize,
                  height: nodeSize,
                  backgroundColor: `${node.color}20`,
                  borderRadius: '8px',
                  border: `2px solid ${node.color}`,
                  padding: '8px',
                  overflow: 'hidden'
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex flex-col h-full">
                  {/* Node Header */}
                  <div className="flex items-center mb-1 text-xs" style={{ color: node.color }}>
                    <i className={nodeType?.icon || "ri-circle-line"} />
                    <span className="ml-1 font-medium">{nodeType?.label || "Node"}</span>
                    
                    {!readOnly && hoveredNode === node.id && (
                      <div className="ml-auto flex gap-1">
                        <button 
                          className="hover:text-amber-600" 
                          onClick={(e) => {
                            e.stopPropagation();
                            startConnectionCreation(node.id);
                          }}
                        >
                          <i className="ri-link-m"></i>
                        </button>
                        <button 
                          className="hover:text-red-600" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Node Content */}
                  <div className="flex-1 text-center flex items-center justify-center">
                    {isEditingNodeContent && selectedNode === node.id ? (
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onBlur={updateNodeContent}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            updateNodeContent();
                          }
                        }}
                        autoFocus
                        className="w-full h-full resize-none bg-transparent text-center focus:outline-none text-gray-800"
                        style={{ fontSize: `${14 * scale}px` }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p 
                        className="w-full text-gray-800 break-words" 
                        style={{ fontSize: `${14 * scale}px` }}
                      >
                        {node.content}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Connection target area for when creating a connection */}
                {creatingConnection && creatingConnection.sourceId !== node.id && (
                  <div 
                    className="absolute inset-0 bg-amber-200 bg-opacity-30 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      completeConnectionCreation(node.id);
                    }}
                  >
                    <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <i className="ri-link-m"></i>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Connection Controls */}
      {selectedConnection && !readOnly && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md border border-gray-200 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-600 h-8 w-8"
              onClick={() => deleteConnection(selectedConnection)}
            >
              <i className="ri-delete-bin-line"></i>
            </Button>
            <div className="h-8 w-px bg-gray-200"></div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600"
              onClick={() => setSelectedConnection(null)}
            >
              <i className="ri-close-line"></i>
            </Button>
          </div>
        </div>
      )}
      
      {/* Instructions when canvas is empty */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center max-w-md p-6">
            <i className="ri-mind-map text-6xl mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Create Your Metaphysical Mind Map</h3>
            <p className="mb-4">
              Double-click anywhere to add your first concept or insight to begin mapping your metaphysical ideas.
            </p>
            <p className="text-sm">
              Connect nodes by hovering over them and clicking the link icon, then click on another node to create a connection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}