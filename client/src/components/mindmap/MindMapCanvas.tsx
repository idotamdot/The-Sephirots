import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HexColorPicker } from 'react-colorful';

// Node types - these are the primary elements in our mind map
export type NodeType = 'concept' | 'insight' | 'question' | 'practice' | 'experience';

// Styles for connections between nodes
export type ConnectionStyle = 'solid' | 'dashed' | 'dotted' | 'wavy';

// Node definition with position, content, and visual properties
export interface MindMapNode {
  id: string;
  type: NodeType;
  content: string;
  description?: string;
  x: number;
  y: number;
  color: string;
  size: number;
  attributes?: Record<string, any>;
}

// Connection between nodes
export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  description?: string;
  color: string;
  thickness: number;
  style: ConnectionStyle;
}

interface MindMapCanvasProps {
  currentUser: User | undefined;
  initialNodes?: MindMapNode[];
  initialConnections?: MindMapConnection[];
  readOnly?: boolean;
  onChange?: (nodes: MindMapNode[], connections: MindMapConnection[]) => void;
  onSave?: () => void;
}

const DEFAULT_NODE_SIZE = 80;
const DEFAULT_NODE_COLOR = '#9333ea'; // Sephirot purple
const DEFAULT_CONNECTION_COLOR = '#ffffff';
const DEFAULT_CONNECTION_THICKNESS = 2;
const NODE_TYPES: { type: NodeType; label: string; color: string }[] = [
  { type: 'concept', label: 'Concept', color: '#9333ea' }, // Sephirot purple
  { type: 'insight', label: 'Insight', color: '#f59e0b' }, // Amber
  { type: 'question', label: 'Question', color: '#3b82f6' }, // Blue
  { type: 'practice', label: 'Practice', color: '#10b981' }, // Green
  { type: 'experience', label: 'Experience', color: '#ec4899' } // Pink
];

export default function MindMapCanvas({
  currentUser,
  initialNodes = [],
  initialConnections = [],
  readOnly = false,
  onChange,
  onSave
}: MindMapCanvasProps) {
  // State for nodes and connections
  const [nodes, setNodes] = useState<MindMapNode[]>(initialNodes);
  const [connections, setConnections] = useState<MindMapConnection[]>(initialConnections);
  
  // Canvas and interaction state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [createConnectionMode, setCreateConnectionMode] = useState<{
    active: boolean;
    sourceId: string | null;
  }>({ active: false, sourceId: null });
  
  // Form state for node editing/creation
  const [nodeForm, setNodeForm] = useState<{
    id: string;
    type: NodeType;
    content: string;
    description: string;
    color: string;
    size: number;
    x: number;
    y: number;
  }>({
    id: '',
    type: 'concept',
    content: '',
    description: '',
    color: DEFAULT_NODE_COLOR,
    size: DEFAULT_NODE_SIZE,
    x: 0,
    y: 0
  });
  
  // Form state for connection editing/creation
  const [connectionForm, setConnectionForm] = useState<{
    id: string;
    sourceId: string;
    targetId: string;
    label: string;
    description: string;
    color: string;
    thickness: number;
    style: ConnectionStyle;
  }>({
    id: '',
    sourceId: '',
    targetId: '',
    label: '',
    description: '',
    color: DEFAULT_CONNECTION_COLOR,
    thickness: DEFAULT_CONNECTION_THICKNESS,
    style: 'solid'
  });
  
  // Initialize with provided data
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
    if (initialConnections.length > 0) {
      setConnections(initialConnections);
    }
  }, [initialNodes, initialConnections]);
  
  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(nodes, connections);
    }
  }, [nodes, connections, onChange]);
  
  // Handle canvas double click - create new node
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    if (e.target !== canvasRef.current) {
      const element = e.target as HTMLElement;
      if (element.closest('.node-element')) return;
    }
    
    // Calculate position relative to canvas and scale
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left) / scale - offset.x;
    const y = (e.clientY - canvasRect.top) / scale - offset.y;
    
    // Open node form
    setNodeForm({
      id: `node-${Date.now()}`,
      type: 'concept',
      content: '',
      description: '',
      color: DEFAULT_NODE_COLOR,
      size: DEFAULT_NODE_SIZE,
      x,
      y
    });
    setShowNodeForm(true);
  };
  
  // Handle node click - select or connect nodes
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If in connection creation mode, complete the connection
    if (createConnectionMode.active && createConnectionMode.sourceId) {
      // Don't connect to self
      if (createConnectionMode.sourceId === nodeId) {
        setCreateConnectionMode({ active: false, sourceId: null });
        return;
      }
      
      // Create new connection
      setConnectionForm({
        id: `connection-${Date.now()}`,
        sourceId: createConnectionMode.sourceId,
        targetId: nodeId,
        label: '',
        description: '',
        color: DEFAULT_CONNECTION_COLOR,
        thickness: DEFAULT_CONNECTION_THICKNESS,
        style: 'solid'
      });
      setShowConnectionForm(true);
      setCreateConnectionMode({ active: false, sourceId: null });
      return;
    }
    
    // Otherwise just select the node
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    setSelectedConnection(null);
  };
  
  // Handle connection click - select connection
  const handleConnectionClick = (connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConnection(connectionId === selectedConnection ? null : connectionId);
    setSelectedNode(null);
  };
  
  // Add new node
  const handleAddNode = () => {
    const newNode: MindMapNode = {
      id: nodeForm.id,
      type: nodeForm.type,
      content: nodeForm.content,
      description: nodeForm.description || undefined,
      x: nodeForm.x,
      y: nodeForm.y,
      color: nodeForm.color,
      size: nodeForm.size
    };
    
    setNodes([...nodes, newNode]);
    setShowNodeForm(false);
    setSelectedNode(newNode.id);
  };
  
  // Update existing node
  const handleUpdateNode = () => {
    const updatedNodes = nodes.map(node => 
      node.id === nodeForm.id 
        ? {
          ...node,
          type: nodeForm.type,
          content: nodeForm.content,
          description: nodeForm.description || undefined,
          color: nodeForm.color,
          size: nodeForm.size
        }
        : node
    );
    
    setNodes(updatedNodes);
    setShowNodeForm(false);
  };
  
  // Delete selected node
  const handleDeleteNode = () => {
    if (!selectedNode) return;
    
    // Remove the node
    const updatedNodes = nodes.filter(node => node.id !== selectedNode);
    
    // Remove any connections to this node
    const updatedConnections = connections.filter(
      conn => conn.sourceId !== selectedNode && conn.targetId !== selectedNode
    );
    
    setNodes(updatedNodes);
    setConnections(updatedConnections);
    setSelectedNode(null);
  };
  
  // Add new connection
  const handleAddConnection = () => {
    const newConnection: MindMapConnection = {
      id: connectionForm.id,
      sourceId: connectionForm.sourceId,
      targetId: connectionForm.targetId,
      label: connectionForm.label || undefined,
      description: connectionForm.description || undefined,
      color: connectionForm.color,
      thickness: connectionForm.thickness,
      style: connectionForm.style
    };
    
    setConnections([...connections, newConnection]);
    setShowConnectionForm(false);
    setSelectedConnection(newConnection.id);
  };
  
  // Update existing connection
  const handleUpdateConnection = () => {
    const updatedConnections = connections.map(conn => 
      conn.id === connectionForm.id 
        ? {
          ...conn,
          label: connectionForm.label || undefined,
          description: connectionForm.description || undefined,
          color: connectionForm.color,
          thickness: connectionForm.thickness,
          style: connectionForm.style
        }
        : conn
    );
    
    setConnections(updatedConnections);
    setShowConnectionForm(false);
  };
  
  // Delete selected connection
  const handleDeleteConnection = () => {
    if (!selectedConnection) return;
    
    const updatedConnections = connections.filter(conn => conn.id !== selectedConnection);
    setConnections(updatedConnections);
    setSelectedConnection(null);
  };
  
  // Handle node drag start
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    
    setSelectedNode(nodeId);
    setSelectedConnection(null);
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDragging(true);
    setDragStart({
      x: e.clientX - (node.x + offset.x) * scale,
      y: e.clientY - (node.y + offset.y) * scale
    });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      const x = (moveEvent.clientX - dragStart.x) / scale - offset.x;
      const y = (moveEvent.clientY - dragStart.y) / scale - offset.y;
      
      // Update node position
      const updatedNodes = nodes.map(n => 
        n.id === nodeId ? { ...n, x, y } : n
      );
      
      setNodes(updatedNodes);
    };
    
    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Start connection creation mode
  const handleStartConnection = (nodeId: string, e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setCreateConnectionMode({ active: true, sourceId: nodeId });
  };
  
  // Edit selected node
  const handleEditNode = () => {
    if (!selectedNode) return;
    
    const node = nodes.find(n => n.id === selectedNode);
    if (!node) return;
    
    setNodeForm({
      id: node.id,
      type: node.type,
      content: node.content,
      description: node.description || '',
      color: node.color,
      size: node.size,
      x: node.x,
      y: node.y
    });
    
    setShowNodeForm(true);
  };
  
  // Edit selected connection
  const handleEditConnection = () => {
    if (!selectedConnection) return;
    
    const conn = connections.find(c => c.id === selectedConnection);
    if (!conn) return;
    
    setConnectionForm({
      id: conn.id,
      sourceId: conn.sourceId,
      targetId: conn.targetId,
      label: conn.label || '',
      description: conn.description || '',
      color: conn.color,
      thickness: conn.thickness,
      style: conn.style
    });
    
    setShowConnectionForm(true);
  };
  
  // Cancel form submission
  const handleCancelForm = () => {
    setShowNodeForm(false);
    setShowConnectionForm(false);
  };
  
  // Render connections as SVG paths
  const renderConnections = () => {
    return connections.map(conn => {
      const sourceNode = nodes.find(n => n.id === conn.sourceId);
      const targetNode = nodes.find(n => n.id === conn.targetId);
      
      if (!sourceNode || !targetNode) return null;
      
      // Calculate endpoints
      const source = {
        x: sourceNode.x + sourceNode.size / 2,
        y: sourceNode.y + sourceNode.size / 2
      };
      
      const target = {
        x: targetNode.x + targetNode.size / 2,
        y: targetNode.y + targetNode.size / 2
      };
      
      // Calculate path
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const lineLength = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate offsets to start/end arrows at node edges
      const sourceRadius = sourceNode.size / 2;
      const targetRadius = targetNode.size / 2;
      
      const sourceOffsetX = dx * sourceRadius / lineLength;
      const sourceOffsetY = dy * sourceRadius / lineLength;
      const targetOffsetX = dx * targetRadius / lineLength;
      const targetOffsetY = dy * targetRadius / lineLength;
      
      const adjustedSource = {
        x: source.x + sourceOffsetX,
        y: source.y + sourceOffsetY
      };
      
      const adjustedTarget = {
        x: target.x - targetOffsetX,
        y: target.y - targetOffsetY
      };
      
      // Get line dash pattern based on style
      let dashArray;
      switch (conn.style) {
        case 'dashed':
          dashArray = '8 4';
          break;
        case 'dotted':
          dashArray = '2 3';
          break;
        case 'wavy':
          // Use a path with bezier curves for wavy line
          const dx2 = adjustedTarget.x - adjustedSource.x;
          const dy2 = adjustedTarget.y - adjustedSource.y;
          const mx = adjustedSource.x + dx2 / 2;
          const my = adjustedSource.y + dy2 / 2;
          const waviness = 15;
          const perpX = -dy2 / lineLength * waviness;
          const perpY = dx2 / lineLength * waviness;
          
          return (
            <g 
              key={conn.id} 
              className="connection-element" 
              onClick={(e) => handleConnectionClick(conn.id, e)}
            >
              <path
                d={`M ${adjustedSource.x} ${adjustedSource.y} 
                    Q ${mx + perpX} ${my + perpY} ${adjustedTarget.x} ${adjustedTarget.y}`}
                stroke={conn.color}
                strokeWidth={conn.thickness}
                fill="none"
                strokeLinecap="round"
                className={`connection ${selectedConnection === conn.id ? 'selected' : ''}`}
              />
              {conn.label && (
                <text
                  x={mx + perpX / 2}
                  y={my + perpY / 2}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  className="connection-label"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        default:
          dashArray = '';
      }
      
      // For normal styles (solid, dashed, dotted)
      return (
        <g 
          key={conn.id} 
          className="connection-element" 
          onClick={(e) => handleConnectionClick(conn.id, e)}
        >
          <line
            x1={adjustedSource.x}
            y1={adjustedSource.y}
            x2={adjustedTarget.x}
            y2={adjustedTarget.y}
            stroke={conn.color}
            strokeWidth={conn.thickness}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            className={`connection ${selectedConnection === conn.id ? 'selected' : ''}`}
          />
          {conn.label && (
            <text
              x={(adjustedSource.x + adjustedTarget.x) / 2}
              y={(adjustedSource.y + adjustedTarget.y) / 2 - 5}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              className="connection-label"
            >
              {conn.label}
            </text>
          )}
        </g>
      );
    });
  };
  
  // Render nodes
  const renderNodes = () => {
    return nodes.map(node => {
      const isSelected = selectedNode === node.id;
      
      return (
        <div
          key={node.id}
          className={`absolute node-element flex flex-col items-center justify-center p-2 rounded-full cursor-pointer transform transition-transform ${
            isSelected ? 'ring-2 ring-white scale-105' : ''
          } ${createConnectionMode.active ? 'hover:ring-2 hover:ring-blue-400' : ''}`}
          style={{
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            backgroundColor: node.color,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)'
          }}
          onClick={(e) => handleNodeClick(node.id, e)}
          onMouseDown={(e) => handleNodeDragStart(node.id, e)}
        >
          <div className="text-center text-white text-xs px-1 select-none" style={{ wordBreak: 'break-word' }}>
            {node.content}
          </div>
          
          {!readOnly && isSelected && (
            <div className="absolute -right-2 -bottom-2 z-20">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full">
                    <span className="sr-only">Options</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="flex flex-col space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleEditNode}
                      className="justify-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartConnection(node.id, e);
                      }}
                      className="justify-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Connect
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleDeleteNode}
                      className="justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Tools */}
      {!readOnly && (
        <div className="bg-slate-800/80 py-1 px-2 rounded-t-lg flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setShowNodeForm(true);
                setNodeForm({
                  ...nodeForm,
                  id: `node-${Date.now()}`,
                  x: canvasRef.current ? (canvasRef.current.clientWidth / 2 - offset.x) / scale : 100,
                  y: canvasRef.current ? (canvasRef.current.clientHeight / 2 - offset.y) / scale : 100
                });
              }}
            >
              Add Node
            </Button>
            
            {/* Add more tools as needed */}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom controls */}
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="h-8 w-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Button>
            <span className="text-xs text-white">{Math.round(scale * 100)}%</span>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setScale(Math.min(2, scale + 0.1))}
              className="h-8 w-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </Button>
            
            {/* Reset view */}
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => {
                setScale(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="h-8 w-8"
              title="Reset View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l2.69 2.69c-1.96 1.9-2.75 4.65-2.1 7.3a8 8 0 108.5-5.72.75.75 0 00-.32 1.47 6.5 6.5 0 11-6.9 4.65l2.51 2.51a.75.75 0 101.06-1.06L3.28 2.22z" />
              </svg>
            </Button>
            
            {/* Save */}
            {onSave && (
              <Button 
                size="sm" 
                onClick={onSave}
                className="bg-gradient-to-r from-sephirot-purple to-amber-500 hover:from-sephirot-purple-dark hover:to-amber-600"
              >
                Save Map
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Connection mode indicator */}
      {createConnectionMode.active && (
        <div className="absolute top-2 left-2 z-30 bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-lg flex items-center">
          <span>Connect mode: Select target node</span>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setCreateConnectionMode({ active: false, sourceId: null })}
            className="h-6 w-6 ml-2 hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </Button>
        </div>
      )}
      
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative flex-grow overflow-hidden cursor-move"
        style={{ 
          backgroundColor: 'transparent',
          touchAction: 'none'  // Needed for proper touch/mouse handling
        }}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseDown={(e) => {
          if (e.target === canvasRef.current && !createConnectionMode.active) {
            setSelectedNode(null);
            setSelectedConnection(null);
            
            // Pan the canvas
            const startX = e.clientX;
            const startY = e.clientY;
            const startOffsetX = offset.x;
            const startOffsetY = offset.y;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const dx = moveEvent.clientX - startX;
              const dy = moveEvent.clientY - startY;
              setOffset({
                x: startOffsetX + dx / scale,
                y: startOffsetY + dy / scale
              });
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }
        }}
      >
        {/* SVG layer for connections */}
        <svg 
          className="absolute inset-0 w-full h-full z-0"
          style={{ 
            transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: 'center'
          }}
        >
          {/* Render connections */}
          {renderConnections()}
        </svg>
        
        {/* Nodes layer */}
        <div 
          className="absolute inset-0 w-full h-full z-10"
          style={{ 
            transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: 'center'
          }}
        >
          {/* Render nodes */}
          {renderNodes()}
        </div>
      </div>
      
      {/* Node Form Dialog */}
      {showNodeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg shadow-lg p-5 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">
              {nodeForm.id.startsWith('node-') && !nodes.find(n => n.id === nodeForm.id) 
                ? 'Add New Node' 
                : 'Edit Node'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Type</label>
                <div className="flex flex-wrap gap-2">
                  {NODE_TYPES.map(nodeType => (
                    <Button 
                      key={nodeType.type}
                      type="button"
                      size="sm"
                      variant={nodeForm.type === nodeType.type ? "default" : "outline"}
                      onClick={() => setNodeForm({
                        ...nodeForm,
                        type: nodeType.type,
                        color: nodeType.color
                      })}
                      style={{
                        backgroundColor: nodeForm.type === nodeType.type ? nodeType.color : 'transparent',
                        borderColor: nodeType.color
                      }}
                    >
                      {nodeType.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Content</label>
                <Input
                  value={nodeForm.content}
                  onChange={(e) => setNodeForm({ ...nodeForm, content: e.target.value })}
                  placeholder="Node content"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Description (optional)</label>
                <Textarea
                  value={nodeForm.description}
                  onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                  placeholder="Longer description"
                  rows={3}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Color</label>
                  <div className="relative">
                    <div 
                      className="h-8 w-full rounded cursor-pointer border border-slate-700"
                      style={{ backgroundColor: nodeForm.color }}
                      onClick={() => document.getElementById('colorPicker')?.click()}
                    ></div>
                    <div className="hidden">
                      <HexColorPicker
                        id="colorPicker"
                        color={nodeForm.color}
                        onChange={(color) => setNodeForm({ ...nodeForm, color })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Size</label>
                  <Input
                    type="number"
                    value={nodeForm.size}
                    onChange={(e) => setNodeForm({ 
                      ...nodeForm, 
                      size: Math.max(40, Math.min(200, parseInt(e.target.value) || DEFAULT_NODE_SIZE)) 
                    })}
                    className="bg-slate-800 border-slate-700"
                    min="40"
                    max="200"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancelForm}>Cancel</Button>
              <Button 
                onClick={nodeForm.id.startsWith('node-') && !nodes.find(n => n.id === nodeForm.id) 
                  ? handleAddNode 
                  : handleUpdateNode
                }
                disabled={!nodeForm.content.trim()}
              >
                {nodeForm.id.startsWith('node-') && !nodes.find(n => n.id === nodeForm.id) 
                  ? 'Add Node' 
                  : 'Update Node'
                }
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Connection Form Dialog */}
      {showConnectionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg shadow-lg p-5 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">
              {connectionForm.id.startsWith('connection-') && !connections.find(c => c.id === connectionForm.id) 
                ? 'Add New Connection' 
                : 'Edit Connection'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Label (optional)</label>
                <Input
                  value={connectionForm.label}
                  onChange={(e) => setConnectionForm({ ...connectionForm, label: e.target.value })}
                  placeholder="Connection label"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Description (optional)</label>
                <Textarea
                  value={connectionForm.description}
                  onChange={(e) => setConnectionForm({ ...connectionForm, description: e.target.value })}
                  placeholder="Connection description"
                  rows={2}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Style</label>
                <div className="flex flex-wrap gap-2">
                  {(['solid', 'dashed', 'dotted', 'wavy'] as ConnectionStyle[]).map(style => (
                    <Button 
                      key={style}
                      type="button"
                      size="sm"
                      variant={connectionForm.style === style ? "default" : "outline"}
                      onClick={() => setConnectionForm({ ...connectionForm, style })}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Color</label>
                  <div className="relative">
                    <div 
                      className="h-8 w-full rounded cursor-pointer border border-slate-700"
                      style={{ backgroundColor: connectionForm.color }}
                      onClick={() => document.getElementById('connectionColorPicker')?.click()}
                    ></div>
                    <div className="hidden">
                      <HexColorPicker
                        id="connectionColorPicker"
                        color={connectionForm.color}
                        onChange={(color) => setConnectionForm({ ...connectionForm, color })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Thickness</label>
                  <Input
                    type="number"
                    value={connectionForm.thickness}
                    onChange={(e) => setConnectionForm({ 
                      ...connectionForm, 
                      thickness: Math.max(1, Math.min(10, parseInt(e.target.value) || DEFAULT_CONNECTION_THICKNESS)) 
                    })}
                    className="bg-slate-800 border-slate-700"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancelForm}>Cancel</Button>
              <Button 
                onClick={connectionForm.id.startsWith('connection-') && !connections.find(c => c.id === connectionForm.id) 
                  ? handleAddConnection 
                  : handleUpdateConnection
                }
              >
                {connectionForm.id.startsWith('connection-') && !connections.find(c => c.id === connectionForm.id) 
                  ? 'Add Connection' 
                  : 'Update Connection'
                }
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected connection tools */}
      {selectedConnection && !readOnly && (
        <div className="absolute bottom-4 right-4 bg-slate-800/90 p-2 rounded-full shadow-lg z-30 flex items-center space-x-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleEditConnection}
            className="h-8 w-8 hover:bg-slate-700"
            title="Edit Connection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleDeleteConnection}
            className="h-8 w-8 text-red-500 hover:bg-red-950/30"
            title="Delete Connection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      )}
      
      {/* Instructions */}
      {!readOnly && !selectedNode && !selectedConnection && !createConnectionMode.active && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/60 px-4 py-2 rounded-full text-xs text-white z-30">
          Double-click to add nodes • Drag to move • Select to edit
        </div>
      )}
    </div>
  );
}