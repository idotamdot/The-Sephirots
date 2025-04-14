import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Badge } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import DoveAndStars from "@/components/icons/DoveAndStars";

// Spiritual attributes that are measured
interface SpiritualAttribute {
  id: string;
  name: string;
  description: string;
  color: string;
  sephirot: string;
  icon: string;
}

// Spiritual attributes aligned with the Tree of Life
const SPIRITUAL_ATTRIBUTES: SpiritualAttribute[] = [
  {
    id: "wisdom",
    name: "Wisdom",
    description: "Ability to perceive deeper truths and apply intuitive understanding",
    color: "#93c5fd", // Light blue
    sephirot: "Chokmah",
    icon: "ri-lightbulb-flash-line"
  },
  {
    id: "understanding",
    name: "Understanding",
    description: "Analytical comprehension and ability to integrate complexity",
    color: "#a78bfa", // Purple
    sephirot: "Binah",
    icon: "ri-brain-line"
  },
  {
    id: "compassion",
    name: "Compassion",
    description: "Extending kindness and empathy to all beings",
    color: "#60a5fa", // Blue
    sephirot: "Chesed",
    icon: "ri-heart-line"
  },
  {
    id: "boundaries",
    name: "Boundaries",
    description: "Establishing healthy limitations and discernment",
    color: "#ef4444", // Red
    sephirot: "Gevurah",
    icon: "ri-shield-line"
  },
  {
    id: "harmony",
    name: "Harmony",
    description: "Creating balance and integration between opposing forces",
    color: "#fcd34d", // Gold
    sephirot: "Tiferet",
    icon: "ri-scales-3-line"
  },
  {
    id: "persistence",
    name: "Persistence",
    description: "Consistency and endurance in spiritual practice",
    color: "#34d399", // Green
    sephirot: "Netzach",
    icon: "ri-plant-line"
  },
  {
    id: "communication",
    name: "Communication",
    description: "Ability to express and receive spiritual insights",
    color: "#f97316", // Orange
    sephirot: "Hod",
    icon: "ri-chat-heart-line"
  },
  {
    id: "manifestation",
    name: "Manifestation",
    description: "Bringing spiritual potential into tangible form",
    color: "#a855f7", // Purple
    sephirot: "Yesod",
    icon: "ri-seedling-line"
  },
  {
    id: "presence",
    name: "Presence",
    description: "Grounded awareness in the physical realm",
    color: "#4b5563", // Gray
    sephirot: "Malkuth",
    icon: "ri-footprint-line"
  },
  {
    id: "transcendence",
    name: "Transcendence",
    description: "Connection to higher consciousness and divine will",
    color: "#f9fafb", // White
    sephirot: "Keter",
    icon: "ri-sun-line"
  }
];

interface SpiritualProgressChartProps {
  userId?: number;
  showTips?: boolean;
  interactive?: boolean;
  compact?: boolean;
}

export default function SpiritualProgressChart({
  userId,
  showTips = true,
  interactive = true,
  compact = false
}: SpiritualProgressChartProps) {
  const [activeTab, setActiveTab] = useState<string>("radar");
  const [spiritualValues, setSpiritualValues] = useState<Record<string, number>>({});
  const [historicalData, setHistoricalData] = useState<Array<{date: string, values: Record<string, number>}>>([]);
  const [highlightedAttribute, setHighlightedAttribute] = useState<string | null>(null);
  
  // Fetch user badges to calculate spiritual values
  const { data: userBadges, isLoading: badgesLoading } = useQuery({
    queryKey: userId ? [`/api/users/${userId}/badges`] : null,
    enabled: !!userId,
  });
  
  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery<User>({
    queryKey: userId ? [`/api/users/${userId}`] : ["/api/users/me"],
  });

  // Calculate spiritual values based on badges and user activity
  useEffect(() => {
    if (badgesLoading || !userBadges || !userData) return;
    
    // Initialize with baseline values
    const baselineValues: Record<string, number> = {};
    SPIRITUAL_ATTRIBUTES.forEach(attr => {
      baselineValues[attr.id] = 10; // Everyone starts with some baseline spiritual qualities
    });
    
    // Calculate values based on badges
    const calculatedValues = { ...baselineValues };
    
    if (Array.isArray(userBadges)) {
      userBadges.forEach(badge => {
        // Map badges to attributes based on their symbolism or category
        let attributeBoosts: Record<string, number> = {};
        
        // Parse badge symbolism and description to determine spiritual attribute boosts
        if (badge.symbolism) {
          if (badge.symbolism.includes("Keter")) {
            attributeBoosts.transcendence = (attributeBoosts.transcendence || 0) + 15;
          }
          if (badge.symbolism.includes("Chokmah")) {
            attributeBoosts.wisdom = (attributeBoosts.wisdom || 0) + 15;
          }
          if (badge.symbolism.includes("Binah")) {
            attributeBoosts.understanding = (attributeBoosts.understanding || 0) + 15;
          }
          if (badge.symbolism.includes("Chesed")) {
            attributeBoosts.compassion = (attributeBoosts.compassion || 0) + 15;
          }
          if (badge.symbolism.includes("Gevurah")) {
            attributeBoosts.boundaries = (attributeBoosts.boundaries || 0) + 15;
          }
          if (badge.symbolism.includes("Tiferet")) {
            attributeBoosts.harmony = (attributeBoosts.harmony || 0) + 15;
          }
          if (badge.symbolism.includes("Netzach")) {
            attributeBoosts.persistence = (attributeBoosts.persistence || 0) + 15;
          }
          if (badge.symbolism.includes("Hod")) {
            attributeBoosts.communication = (attributeBoosts.communication || 0) + 15;
          }
          if (badge.symbolism.includes("Yesod")) {
            attributeBoosts.manifestation = (attributeBoosts.manifestation || 0) + 15;
          }
          if (badge.symbolism.includes("Malkuth")) {
            attributeBoosts.presence = (attributeBoosts.presence || 0) + 15;
          }
        }
        
        // Badge tier multiplier
        const tierMultiplier = 
          badge.tier === 'bronze' ? 1 :
          badge.tier === 'silver' ? 1.5 :
          badge.tier === 'gold' ? 2 :
          badge.tier === 'platinum' ? 2.5 :
          badge.tier === 'founder' ? 3 : 1;
        
        // Apply boosts with tier multiplier
        Object.entries(attributeBoosts).forEach(([attr, boost]) => {
          calculatedValues[attr] = Math.min(100, (calculatedValues[attr] || 0) + boost * tierMultiplier);
        });
      });
    }
    
    // Add some randomness for demonstration purposes
    // In a real implementation, these would be calculated from actual user activity metrics
    SPIRITUAL_ATTRIBUTES.forEach(attr => {
      const randomVariation = Math.random() * 10 - 5; // -5 to +5
      calculatedValues[attr.id] = Math.max(5, Math.min(100, calculatedValues[attr.id] + randomVariation));
    });
    
    setSpiritualValues(calculatedValues);
    
    // Generate historical data for demonstration
    // In a real app, this would come from actual historical records
    const historicalEntries = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      
      const historicalValues: Record<string, number> = {};
      SPIRITUAL_ATTRIBUTES.forEach(attr => {
        // Generate historical value with some random variation
        // showing general improvement over time
        const progressFactor = (6 - i) / 6; // 0 to 1, representing progress over time
        const baseValue = 10 + (calculatedValues[attr.id] - 10) * progressFactor;
        const randomVariation = Math.random() * 10 - 5; // -5 to +5
        
        historicalValues[attr.id] = Math.max(5, Math.min(100, baseValue + randomVariation));
      });
      
      historicalEntries.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        values: historicalValues
      });
    }
    
    setHistoricalData(historicalEntries);
    
  }, [userBadges, userData, badgesLoading]);

  // Render the radar chart using canvas
  useEffect(() => {
    if (activeTab !== "radar" || Object.keys(spiritualValues).length === 0) return;
    
    const canvas = document.getElementById('spiritual-radar-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background circles and lines
    const numLevels = 5; // Number of circular levels
    
    // Draw circles
    for (let level = 1; level <= numLevels; level++) {
      const radius = (maxRadius / numLevels) * level;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#6b7280';
      ctx.globalAlpha = 0.1;
      ctx.stroke();
      
      // Label the level
      if (level < numLevels) {
        ctx.fillStyle = '#6b7280';
        ctx.globalAlpha = 0.3;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '10px Arial';
        ctx.fillText(`${Math.round((level / numLevels) * 100)}`, centerX, centerY - radius);
      }
    }
    
    // Reset opacity
    ctx.globalAlpha = 1;
    
    // Draw attribute axes
    const attributes = SPIRITUAL_ATTRIBUTES;
    const anglePerAttribute = (Math.PI * 2) / attributes.length;
    
    attributes.forEach((attr, index) => {
      const angle = index * anglePerAttribute - Math.PI / 2; // Start from top
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      // Draw axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#6b7280';
      ctx.globalAlpha = 0.2;
      ctx.stroke();
      
      // Reset opacity
      ctx.globalAlpha = 1;
      
      // Draw attribute label
      ctx.fillStyle = highlightedAttribute === attr.id ? attr.color : '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = highlightedAttribute === attr.id ? 'bold 11px Arial' : '10px Arial';
      
      // Position label beyond the chart edge
      const labelDistance = maxRadius * 1.15;
      const labelX = centerX + Math.cos(angle) * labelDistance;
      const labelY = centerY + Math.sin(angle) * labelDistance;
      
      ctx.fillText(attr.name, labelX, labelY);
    });
    
    // Draw data polygon
    ctx.beginPath();
    
    attributes.forEach((attr, index) => {
      const angle = index * anglePerAttribute - Math.PI / 2; // Start from top
      const value = spiritualValues[attr.id] || 0;
      const valueRadius = (maxRadius * value) / 100; // Scale to [0, maxRadius]
      
      const x = centerX + Math.cos(angle) * valueRadius;
      const y = centerY + Math.sin(angle) * valueRadius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Close the path
    ctx.closePath();
    
    // Create gradient fill
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0.7)'); // Purple core
    gradient.addColorStop(1, 'rgba(251, 191, 36, 0.1)'); // Fade to golden
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw data points and values
    attributes.forEach((attr, index) => {
      const angle = index * anglePerAttribute - Math.PI / 2; // Start from top
      const value = spiritualValues[attr.id] || 0;
      const valueRadius = (maxRadius * value) / 100; // Scale to [0, maxRadius]
      
      const x = centerX + Math.cos(angle) * valueRadius;
      const y = centerY + Math.sin(angle) * valueRadius;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, highlightedAttribute === attr.id ? 6 : 4, 0, Math.PI * 2);
      
      // Apply attribute color
      ctx.fillStyle = attr.color;
      
      // Add glow if highlighted
      if (highlightedAttribute === attr.id) {
        ctx.shadowColor = attr.color;
        ctx.shadowBlur = 10;
      }
      
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw value
      if (highlightedAttribute === attr.id || value > 75) {
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(Math.round(value).toString(), x, y);
      }
    });
    
    // Draw central spiritual essence
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    const centralGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 15
    );
    centralGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    centralGradient.addColorStop(1, 'rgba(167, 139, 250, 0.6)');
    
    ctx.fillStyle = centralGradient;
    ctx.shadowColor = 'rgba(167, 139, 250, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Calculate overall spiritual score
    const totalAttributes = attributes.length;
    const totalValue = Object.values(spiritualValues).reduce((sum, val) => sum + val, 0);
    const averageValue = Math.round(totalValue / totalAttributes);
    
    // Draw central text
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(averageValue.toString(), centerX, centerY);
    
  }, [spiritualValues, activeTab, highlightedAttribute]);
  
  // Render the historical trend chart
  useEffect(() => {
    if (activeTab !== "trends" || historicalData.length === 0) return;
    
    const canvas = document.getElementById('spiritual-trend-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40; // Padding from edges
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up chart area
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const chartLeft = padding;
    const chartBottom = height - padding;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(chartLeft, padding);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.lineTo(width - padding, chartBottom);
    ctx.strokeStyle = '#9ca3af';
    ctx.stroke();
    
    // Draw y-axis labels and grid lines
    const maxValue = 100;
    const yStep = 20; // Step size for y-axis labels
    
    for (let value = 0; value <= maxValue; value += yStep) {
      const y = chartBottom - (value / maxValue) * chartHeight;
      
      // Draw grid line
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '10px Arial';
      ctx.fillText(value.toString(), chartLeft - 5, y);
    }
    
    // X-axis setup
    const dataPoints = historicalData.length;
    const xStep = chartWidth / (dataPoints - 1);
    
    // Draw x-axis labels
    historicalData.forEach((data, index) => {
      const x = chartLeft + index * xStep;
      
      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = '10px Arial';
      ctx.fillText(data.date, x, chartBottom + 5);
    });
    
    // Draw lines for each spiritual attribute 
    // (only for the highlighted attribute if there is one)
    const attributesToDraw = highlightedAttribute 
      ? SPIRITUAL_ATTRIBUTES.filter(attr => attr.id === highlightedAttribute)
      : SPIRITUAL_ATTRIBUTES.slice(0, 3); // Just show top 3 if none highlighted
    
    attributesToDraw.forEach(attribute => {
      ctx.beginPath();
      
      historicalData.forEach((data, index) => {
        const x = chartLeft + index * xStep;
        const value = data.values[attribute.id] || 0;
        const y = chartBottom - (value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = attribute.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add points
      historicalData.forEach((data, index) => {
        const x = chartLeft + index * xStep;
        const value = data.values[attribute.id] || 0;
        const y = chartBottom - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = attribute.color;
        ctx.fill();
        
        // Add value label to the last point
        if (index === dataPoints - 1) {
          ctx.fillStyle = '#1f2937';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 10px Arial';
          ctx.fillText(`${Math.round(value)} (${attribute.name})`, x + 8, y);
        }
      });
    });
    
    // Add legend if not showing a single attribute
    if (!highlightedAttribute) {
      const legendY = padding;
      const legendX = padding;
      
      attributesToDraw.forEach((attr, index) => {
        const y = legendY + index * 20;
        
        // Draw color indicator
        ctx.beginPath();
        ctx.rect(legendX, y, 15, 10);
        ctx.fillStyle = attr.color;
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '10px Arial';
        ctx.fillText(attr.name, legendX + 20, y + 5);
      });
    }
    
  }, [historicalData, activeTab, highlightedAttribute]);
  
  // Handle attribute selection
  const handleAttributeClick = (attrId: string) => {
    if (highlightedAttribute === attrId) {
      setHighlightedAttribute(null);
    } else {
      setHighlightedAttribute(attrId);
    }
  };
  
  if (userLoading || badgesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg md:text-xl">
          <div className="w-6 h-6 mr-2 text-purple-500">
            <DoveAndStars size="sm" fillColor="#8b5cf6" />
          </div>
          Spiritual Growth Mapping
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="radar" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="radar">Attribute Radar</TabsTrigger>
              <TabsTrigger value="trends">Growth Trends</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            
            {interactive && (
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <i className="ri-bookmark-line mr-1"></i>
                  Save Snapshot
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  <i className="ri-share-line mr-1"></i>
                  Share
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="radar" className="mt-0">
            <div className="py-4">
              <div className="flex justify-center">
                <canvas 
                  id="spiritual-radar-chart" 
                  width={compact ? 300 : 400} 
                  height={compact ? 300 : 400} 
                  className="max-w-full"
                />
              </div>
              
              {showTips && (
                <div className="mt-4 text-sm p-3 bg-purple-50 rounded-md border border-purple-100">
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <i className="ri-lightbulb-flash-line mr-2"></i>
                    Spiritual Growth Insight
                  </h4>
                  <p className="text-gray-600 text-xs mt-1">
                    {highlightedAttribute ? (
                      // Show specific tip for selected attribute
                      (() => {
                        const attr = SPIRITUAL_ATTRIBUTES.find(a => a.id === highlightedAttribute);
                        if (!attr) return "Select an attribute to see insights.";
                        
                        const value = spiritualValues[attr.id] || 0;
                        
                        if (value < 30) {
                          return `Your ${attr.name} is developing. Consider practices related to ${attr.sephirot} to strengthen this attribute.`;
                        } else if (value < 70) {
                          return `Your ${attr.name} shows healthy development. Continue to nurture this aspect of your spiritual journey.`;
                        } else {
                          return `Your ${attr.name} is highly developed! You may help others develop this quality through mentorship.`;
                        }
                      })()
                    ) : (
                      "Your spiritual attributes show balanced development. Click on any attribute on the chart to see specific insights."
                    )}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-0">
            <div className="py-4">
              <div className="flex justify-center">
                <canvas 
                  id="spiritual-trend-chart" 
                  width={compact ? 300 : 400} 
                  height={compact ? 300 : 300} 
                  className="max-w-full"
                />
              </div>
              
              {!highlightedAttribute && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {SPIRITUAL_ATTRIBUTES.map(attr => (
                    <Button 
                      key={attr.id}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleAttributeClick(attr.id)}
                      style={{
                        borderColor: attr.color,
                        color: attr.color
                      }}
                    >
                      <i className={`${attr.icon} mr-1`}></i>
                      {attr.name}
                    </Button>
                  ))}
                </div>
              )}
              
              {highlightedAttribute && (
                <div className="flex justify-center mt-4">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setHighlightedAttribute(null)}
                    className="text-xs"
                  >
                    <i className="ri-apps-line mr-1"></i>
                    Show All Attributes
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attributes" className="mt-0">
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPIRITUAL_ATTRIBUTES.map(attr => {
                  const value = spiritualValues[attr.id] || 0;
                  
                  return (
                    <TooltipProvider key={attr.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="flex items-center p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                            style={{ borderColor: `${attr.color}50` }}
                            onClick={() => handleAttributeClick(attr.id)}
                          >
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white"
                              style={{ backgroundColor: attr.color }}
                            >
                              <i className={attr.icon}></i>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-medium">{attr.name}</h3>
                                <span className="text-sm font-semibold">{Math.round(value)}</span>
                              </div>
                              
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${value}%`, 
                                    backgroundColor: attr.color 
                                  }}
                                />
                              </div>
                              
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <span>{attr.sephirot}</span>
                                <i className="ri-arrow-right-s-line mx-1"></i>
                                {getValueDescription(value)}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{attr.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper function to get description based on value
function getValueDescription(value: number): string {
  if (value < 20) return "Beginning";
  if (value < 40) return "Developing";
  if (value < 60) return "Established";
  if (value < 80) return "Advanced";
  return "Mastered";
}