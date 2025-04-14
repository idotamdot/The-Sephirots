import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Badge } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PersonalizedBadge from "@/components/badges/PersonalizedBadge";
import DoveAndStars from "@/components/icons/DoveAndStars";

// Node types in the visualization
enum NodeType {
  USER = "user",
  BADGE = "badge",
  SEPHIROT = "sephirot"
}

// Connection types
enum ConnectionType {
  USER_TO_BADGE = "user_badge",  // User has earned badge
  BADGE_TO_SEPHIROT = "badge_sephirot", // Badge belongs to sephirot category
  USER_TO_USER = "user_connection", // Users have collaborated
  SEPHIROT_TO_SEPHIROT = "sephirot_connection" // Tree of Life connections
}

// Node data structure
interface Node {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  image?: string;
  data?: any; // Additional data (User or Badge object)
}

// Connection data structure
interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  strength: number;
  color: string;
}

// Define Sephirot nodes with their traditional positions
const SEPHIROT_NODES: Partial<Node>[] = [
  { id: "sephirot-keter", type: NodeType.SEPHIROT, label: "Keter (Crown)", color: "#f9fafb" },
  { id: "sephirot-chokmah", type: NodeType.SEPHIROT, label: "Chokmah (Wisdom)", color: "#93c5fd" },
  { id: "sephirot-binah", type: NodeType.SEPHIROT, label: "Binah (Understanding)", color: "#a78bfa" },
  { id: "sephirot-chesed", type: NodeType.SEPHIROT, label: "Chesed (Loving-kindness)", color: "#60a5fa" },
  { id: "sephirot-gevurah", type: NodeType.SEPHIROT, label: "Gevurah (Strength)", color: "#ef4444" },
  { id: "sephirot-tiferet", type: NodeType.SEPHIROT, label: "Tiferet (Beauty)", color: "#fcd34d" },
  { id: "sephirot-netzach", type: NodeType.SEPHIROT, label: "Netzach (Victory)", color: "#34d399" },
  { id: "sephirot-hod", type: NodeType.SEPHIROT, label: "Hod (Splendor)", color: "#f97316" },
  { id: "sephirot-yesod", type: NodeType.SEPHIROT, label: "Yesod (Foundation)", color: "#a855f7" },
  { id: "sephirot-malkuth", type: NodeType.SEPHIROT, label: "Malkuth (Kingdom)", color: "#4b5563" },
  { id: "sephirot-daat", type: NodeType.SEPHIROT, label: "Da'at (Knowledge)", color: "#e5e7eb" }
];

// Define the traditional Tree of Life connections between Sephirot
const SEPHIROT_CONNECTIONS: Partial<Connection>[] = [
  { source: "sephirot-keter", target: "sephirot-chokmah", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#f9fafb" },
  { source: "sephirot-keter", target: "sephirot-binah", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#f9fafb" },
  { source: "sephirot-chokmah", target: "sephirot-binah", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#93c5fd" },
  { source: "sephirot-chokmah", target: "sephirot-chesed", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#93c5fd" },
  { source: "sephirot-binah", target: "sephirot-gevurah", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#a78bfa" },
  { source: "sephirot-chesed", target: "sephirot-gevurah", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#60a5fa" },
  { source: "sephirot-chesed", target: "sephirot-tiferet", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#60a5fa" },
  { source: "sephirot-gevurah", target: "sephirot-tiferet", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#ef4444" },
  { source: "sephirot-tiferet", target: "sephirot-netzach", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#fcd34d" },
  { source: "sephirot-tiferet", target: "sephirot-hod", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#fcd34d" },
  { source: "sephirot-netzach", target: "sephirot-hod", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#34d399" },
  { source: "sephirot-netzach", target: "sephirot-yesod", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#34d399" },
  { source: "sephirot-hod", target: "sephirot-yesod", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#f97316" },
  { source: "sephirot-yesod", target: "sephirot-malkuth", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#a855f7" },
  { source: "sephirot-binah", target: "sephirot-daat", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#a78bfa" },
  { source: "sephirot-chokmah", target: "sephirot-daat", type: ConnectionType.SEPHIROT_TO_SEPHIROT, color: "#93c5fd" },
];

interface CosmicConnectionNetworkProps {
  currentUserId?: number;
  width?: number;
  height?: number;
  showUsers?: boolean;
  showBadges?: boolean;
  showSephirot?: boolean;
  interactive?: boolean;
  animateConnections?: boolean;
}

export default function CosmicConnectionNetwork({
  currentUserId,
  width = 800,
  height = 600,
  showUsers = true,
  showBadges = true,
  showSephirot = true,
  interactive = true,
  animateConnections = true
}: CosmicConnectionNetworkProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: showUsers,
  });
  
  // Fetch badges
  const { data: badges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    enabled: showBadges,
  });
  
  // Fetch user badges (for the current user if specified)
  const { data: userBadges, isLoading: userBadgesLoading } = useQuery({
    queryKey: currentUserId ? [`/api/users/${currentUserId}/badges`] : null,
    enabled: !!currentUserId,
  });

  // Build the network visualization data
  useEffect(() => {
    if ((showUsers && usersLoading) || (showBadges && badgesLoading) || (currentUserId && userBadgesLoading)) {
      setLoading(true);
      return;
    }
    
    setLoading(false);
    
    // Start with sephirot nodes (if enabled)
    let networkNodes: Node[] = [];
    let networkConnections: Connection[] = [];
    
    if (showSephirot) {
      // Position sephirot in the Tree of Life formation
      const sephirotNodes = SEPHIROT_NODES.map((node, index) => {
        const centerX = width / 2;
        const treeHeight = height * 0.8;
        
        // Calculate positions based on traditional Tree of Life layout
        let x, y;
        switch(node.id) {
          case "sephirot-keter": // Crown at top
            x = centerX;
            y = height * 0.1;
            break;
          case "sephirot-chokmah": // Wisdom - top right
            x = centerX + width * 0.15;
            y = height * 0.2;
            break;
          case "sephirot-binah": // Understanding - top left
            x = centerX - width * 0.15;
            y = height * 0.2;
            break;
          case "sephirot-daat": // Knowledge - middle top (not always included)
            x = centerX;
            y = height * 0.3;
            break;
          case "sephirot-chesed": // Loving-kindness - middle right
            x = centerX + width * 0.2;
            y = height * 0.35;
            break;
          case "sephirot-gevurah": // Strength - middle left
            x = centerX - width * 0.2;
            y = height * 0.35;
            break;
          case "sephirot-tiferet": // Beauty - middle center
            x = centerX;
            y = height * 0.45;
            break;
          case "sephirot-netzach": // Victory - lower right
            x = centerX + width * 0.15;
            y = height * 0.6;
            break;
          case "sephirot-hod": // Splendor - lower left
            x = centerX - width * 0.15;
            y = height * 0.6;
            break;
          case "sephirot-yesod": // Foundation - bottom center
            x = centerX;
            y = height * 0.75;
            break;
          case "sephirot-malkuth": // Kingdom - very bottom
            x = centerX;
            y = height * 0.9;
            break;
          default:
            x = centerX + (Math.random() - 0.5) * width * 0.6;
            y = height * 0.1 + Math.random() * height * 0.8;
        }
        
        return {
          ...node,
          x,
          y,
          size: 30,
        } as Node;
      });
      
      networkNodes = [...networkNodes, ...sephirotNodes];
      
      // Add sephirot connections
      const sephirotConnections = SEPHIROT_CONNECTIONS.map((connection, index) => ({
        ...connection,
        id: `connection-sephirot-${index}`,
        strength: 0.8,
      } as Connection));
      
      networkConnections = [...networkConnections, ...sephirotConnections];
    }
    
    // Add badge nodes (if enabled)
    if (showBadges && badges) {
      const badgeNodes = badges.map((badge, index) => {
        // Extract sephirot from symbolism field if possible
        let sephirotMatch = null;
        if (badge.symbolism) {
          const match = badge.symbolism.match(/(Keter|Chokmah|Binah|Chesed|Gevurah|Tiferet|Netzach|Hod|Yesod|Malkuth|Da'at)/i);
          if (match) {
            sephirotMatch = match[1].toLowerCase();
          }
        }
        
        // Position badges near their related sephirot if possible
        let x, y;
        const sephirotNode = networkNodes.find(n => n.id === `sephirot-${sephirotMatch}`);
        
        if (sephirotNode) {
          // Position around the sephirot with some randomization
          const angle = Math.random() * Math.PI * 2;
          const distance = 60 + Math.random() * 20;
          x = sephirotNode.x + Math.cos(angle) * distance;
          y = sephirotNode.y + Math.sin(angle) * distance;
          
          // Add a connection between badge and sephirot
          networkConnections.push({
            id: `connection-badge-sephirot-${badge.id}`,
            source: `badge-${badge.id}`,
            target: sephirotNode.id,
            type: ConnectionType.BADGE_TO_SEPHIROT,
            strength: 0.5,
            color: sephirotNode.color
          });
        } else {
          // Position randomly if no sephirot match
          x = width * 0.1 + Math.random() * width * 0.8;
          y = height * 0.1 + Math.random() * height * 0.8;
        }
        
        // Determine badge color based on tier
        let color;
        switch (badge.tier) {
          case "bronze": color = "#d97706"; break;
          case "silver": color = "#9ca3af"; break;
          case "gold": color = "#f59e0b"; break;
          case "platinum": color = "#818cf8"; break;
          case "founder": color = "#8b5cf6"; break;
          default: color = "#9ca3af";
        }
        
        return {
          id: `badge-${badge.id}`,
          type: NodeType.BADGE,
          label: badge.name,
          x,
          y,
          size: 25,
          color,
          data: badge
        } as Node;
      });
      
      networkNodes = [...networkNodes, ...badgeNodes];
    }
    
    // Add user nodes (if enabled)
    if (showUsers && users) {
      const userNodes = users.map((user, index) => {
        // Position users around the periphery
        const angle = (index / users.length) * Math.PI * 2;
        const radius = Math.min(width, height) * 0.4;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        
        return {
          id: `user-${user.id}`,
          type: NodeType.USER,
          label: user.displayName || user.username,
          x,
          y,
          size: user.id === currentUserId ? 35 : 20,
          color: user.isAi ? "#8b5cf6" : "#3b82f6",
          data: user
        } as Node;
      });
      
      networkNodes = [...networkNodes, ...userNodes];
      
      // Add user-badge connections based on userBadges data
      if (userBadges && Array.isArray(userBadges)) {
        userBadges.forEach(badge => {
          const badgeNode = networkNodes.find(n => n.id === `badge-${badge.id}`);
          if (badgeNode && currentUserId) {
            networkConnections.push({
              id: `connection-user-${currentUserId}-badge-${badge.id}`,
              source: `user-${currentUserId}`,
              target: `badge-${badge.id}`,
              type: ConnectionType.USER_TO_BADGE,
              strength: 0.7,
              color: badgeNode.color
            });
          }
        });
      }
      
      // Add some random user-to-user connections for demonstration
      // In a real app, these would be based on actual user interactions
      users.forEach((user, i) => {
        // Connect each user to 1-3 other random users
        const numConnections = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numConnections; j++) {
          const targetIndex = Math.floor(Math.random() * users.length);
          if (targetIndex !== i) {
            networkConnections.push({
              id: `connection-user-${user.id}-user-${users[targetIndex].id}`,
              source: `user-${user.id}`,
              target: `user-${users[targetIndex].id}`,
              type: ConnectionType.USER_TO_USER,
              strength: 0.3,
              color: "#9ca3af"
            });
          }
        }
      });
    }
    
    setNodes(networkNodes);
    setConnections(networkConnections);
    
  }, [users, badges, userBadges, showUsers, showBadges, showSephirot, width, height, currentUserId]);
  
  // Handle canvas rendering and animation
  useEffect(() => {
    if (!canvasRef.current || loading || nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas resolution
    canvas.width = width;
    canvas.height = height;
    
    // Animation function for rendering the network
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw connections first (so they appear behind nodes)
      connections.forEach(connection => {
        const source = nodes.find(n => n.id === connection.source);
        const target = nodes.find(n => n.id === connection.target);
        
        if (source && target) {
          // Determine connection appearance
          const isHighlighted = highlightedConnections.includes(connection.id);
          const isRelatedToHighlight = highlightedNode && 
            (connection.source === highlightedNode || connection.target === highlightedNode);
          
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          
          if (isHighlighted || isRelatedToHighlight) {
            ctx.strokeStyle = connection.color;
            ctx.lineWidth = 3;
            
            // Add glow effect for highlighted connections
            ctx.shadowColor = connection.color;
            ctx.shadowBlur = 8;
          } else {
            ctx.strokeStyle = `${connection.color}40`; // Semi-transparent
            ctx.lineWidth = connection.type === ConnectionType.SEPHIROT_TO_SEPHIROT ? 2 : 1;
            ctx.shadowBlur = 0;
          }
          
          // Add animated effect for connection lines if enabled
          if (animateConnections) {
            const time = Date.now() / 1000;
            const speed = 0.5;
            const length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            const segments = Math.max(3, Math.ceil(length / 30));
            
            for (let i = 0; i < segments; i++) {
              const t = i / segments;
              const osc = Math.sin(time * speed + t * Math.PI * 2) * 0.5 + 0.5;
              const lineWidth = isHighlighted || isRelatedToHighlight
                ? 3 * (0.5 + osc * 0.5)  
                : (connection.type === ConnectionType.SEPHIROT_TO_SEPHIROT ? 2 : 1) * (0.5 + osc * 0.5);
                
              ctx.lineWidth = lineWidth;
            }
          }
          
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const isHighlighted = node.id === highlightedNode;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        
        // Fill style based on node type and highlight state
        if (isHighlighted) {
          // Add glow for highlighted nodes
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = node.color;
        } else {
          ctx.shadowBlur = 0;
          
          // Different appearances for different node types
          if (node.type === NodeType.SEPHIROT) {
            // Sephirot nodes have gradient fill
            const gradient = ctx.createRadialGradient(
              node.x, node.y, 0,
              node.x, node.y, node.size
            );
            gradient.addColorStop(0, `${node.color}`);
            gradient.addColorStop(1, `${node.color}80`);
            ctx.fillStyle = gradient;
          } else if (node.type === NodeType.BADGE) {
            // Badge nodes are more opaque
            ctx.fillStyle = `${node.color}D0`;
          } else {
            // User nodes are semi-transparent
            ctx.fillStyle = `${node.color}90`;
          }
        }
        
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = isHighlighted ? "white" : `${node.color}`;
        ctx.lineWidth = isHighlighted ? 3 : 1;
        ctx.stroke();
        
        // Draw labels for sephirot nodes only (to reduce clutter)
        if (node.type === NodeType.SEPHIROT || isHighlighted) {
          ctx.fillStyle = node.type === NodeType.SEPHIROT ? "white" : "#1f2937";
          ctx.font = isHighlighted ? 'bold 12px Arial' : '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Short label for smaller nodes
          const displayLabel = node.label.split(' ')[0];
          ctx.fillText(displayLabel, node.x, node.y);
        }
        
        // Reset shadow for next drawing operations
        ctx.shadowBlur = 0;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections, width, height, highlightedNode, highlightedConnections, loading, animateConnections]);
  
  // Handle mouse interaction with the visualization
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over any node
    let hoveredNode = null;
    
    // Check nodes in reverse order so we detect top-most nodes first
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.size) {
        hoveredNode = node.id;
        break;
      }
    }
    
    setHighlightedNode(hoveredNode);
    
    // If a node is highlighted, also highlight its connections
    if (hoveredNode) {
      const relatedConnections = connections
        .filter(conn => conn.source === hoveredNode || conn.target === hoveredNode)
        .map(conn => conn.id);
      
      setHighlightedConnections(relatedConnections);
    } else {
      setHighlightedConnections([]);
    }
  };
  
  const handleCanvasMouseLeave = () => {
    setHighlightedNode(null);
    setHighlightedConnections([]);
  };
  
  if (loading) {
    return (
      <div className="relative" style={{ width, height }}>
        <Skeleton className="w-full h-full rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-purple-800">Mapping Cosmic Connections...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cosmic-connection-network relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg shadow-md bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded-md text-xs shadow-md">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
          <span>Sephirot Node</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span>Badge</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>User</span>
        </div>
      </div>
      
      {/* Node details tooltip */}
      {highlightedNode && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-lg max-w-xs">
          {(() => {
            const node = nodes.find(n => n.id === highlightedNode);
            if (!node) return null;
            
            switch (node.type) {
              case NodeType.USER:
                return (
                  <div>
                    <h4 className="font-medium text-sm">{node.label}</h4>
                    <p className="text-xs text-gray-600 mt-1">{node.data.isAi ? 'AI Entity' : 'Human User'}</p>
                    {node.data.bio && (
                      <p className="text-xs mt-1">{node.data.bio.substring(0, 100)}...</p>
                    )}
                  </div>
                );
              case NodeType.BADGE:
                return (
                  <div className="flex items-center">
                    <div className="mr-3">
                      <PersonalizedBadge 
                        badge={node.data} 
                        size="sm" 
                        enhanced={true}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{node.label}</h4>
                      <p className="text-xs text-gray-600 mt-1">{node.data.tier.charAt(0).toUpperCase() + node.data.tier.slice(1)} Tier</p>
                    </div>
                  </div>
                );
              case NodeType.SEPHIROT:
                return (
                  <div>
                    <h4 className="font-medium text-sm">{node.label}</h4>
                    <p className="text-xs text-gray-600 mt-1">Tree of Life Sephirah</p>
                    <p className="text-xs mt-1">Represents divine emanation in Kabbalistic tradition.</p>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      )}
    </div>
  );
}