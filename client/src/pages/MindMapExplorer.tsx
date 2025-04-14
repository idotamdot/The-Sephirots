import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types";
import MindMapCanvas, { MindMapNode, MindMapConnection } from "@/components/mindmap/MindMapCanvas";
import StarfieldBackground from "@/components/mindmap/StarfieldBackground";

// Sample mind map templates
const TEMPLATES = [
  {
    id: 1,
    title: "Tree of Life Structure",
    description: "Explore the connections between the ten Sephirot in the Kabbalistic Tree of Life.",
    category: "Kabbalah",
    tags: ["mysticism", "spirituality", "structure"],
    authorId: 1
  },
  {
    id: 2,
    title: "Consciousness Expansion",
    description: "Map the journey of consciousness from material awareness to divine realization.",
    category: "Consciousness",
    tags: ["awareness", "meditation", "evolution"],
    authorId: 2
  },
  {
    id: 3,
    title: "Divine Attributes",
    description: "Explore the divine attributes and their manifestations in human experience.",
    category: "Theology",
    tags: ["divinity", "attributes", "manifestation"],
    authorId: 3
  }
];

export default function MindMapExplorer() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [mapName, setMapName] = useState("Untitled Mind Map");
  const [currentMap, setCurrentMap] = useState<{
    nodes: MindMapNode[];
    connections: MindMapConnection[];
  } | null>(null);

  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  // Get mind maps
  const { data: mindMaps = [] } = useQuery({
    queryKey: ["/api/mindmaps"],
    enabled: activeTab === "myMaps" || activeTab === "explore"
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setMapName(`${template.title} - Copy`);
    }
  };

  // Handle map changes
  const handleMapChange = (nodes: MindMapNode[], connections: MindMapConnection[]) => {
    setCurrentMap({ nodes, connections });
  };

  // Handle save map
  const handleSaveMap = () => {
    if (!currentMap) return;
    
    // In a real implementation, this would save to the backend
    console.log("Saving map:", { name: mapName, ...currentMap });
    
    // Show success message
    alert("Mind map saved successfully!");
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto relative">
      {/* Page header */}
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-primary-950 bg-gradient-to-br from-sephirot-purple to-amber-500 bg-clip-text text-transparent">
          Metaphysical Mind Mapping
        </h1>
        <p className="text-gray-600 mt-1">
          Collaborate on mind maps to explore spiritual and metaphysical concepts with the community.
        </p>
      </div>
      
      {/* Main content tabs */}
      <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="explore">Explore Templates</TabsTrigger>
          <TabsTrigger value="create">Create New Map</TabsTrigger>
          <TabsTrigger value="myMaps">My Mind Maps</TabsTrigger>
        </TabsList>
        
        {/* Explore Templates Tab */}
        <TabsContent value="explore" className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map(template => (
              <Card 
                key={template.id} 
                className={`overflow-hidden hover:shadow-lg transition-all ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-primary-500 shadow-lg' 
                    : 'shadow'
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="bg-primary-50">
                      {template.category}
                    </Badge>
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(template.id)}
                    className="w-full"
                  >
                    {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setActiveTab("create")}
                className="bg-gradient-to-r from-sephirot-purple to-amber-500 hover:from-sephirot-purple-dark hover:to-amber-600"
              >
                Create from Template
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Create New Map Tab */}
        <TabsContent value="create" className="space-y-4 relative">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={mapName}
                onChange={e => setMapName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter mind map name..."
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setActiveTab("explore")}>
                Cancel
              </Button>
              <Button onClick={handleSaveMap}>
                Save Mind Map
              </Button>
            </div>
          </div>
          
          {/* Mind Map Canvas with Starfield Background */}
          <div className="h-[calc(100vh-250px)] min-h-[500px] relative overflow-hidden rounded-lg border border-gray-200">
            {/* Starfield Background */}
            <StarfieldBackground
              starsCount={400}
              speed={0.1}
              backgroundColor="rgba(8, 3, 30, 0.97)"
            />
            
            {/* MindMap Canvas */}
            <div className="absolute inset-0 z-10">
              <MindMapCanvas
                currentUser={currentUser}
                onChange={handleMapChange}
                onSave={handleSaveMap}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-500 italic text-center">
            Double-click on the canvas to add a new concept. Drag nodes to reposition them.
            Connect nodes by hovering over them and clicking the link icon.
          </div>
        </TabsContent>
        
        {/* My Mind Maps Tab */}
        <TabsContent value="myMaps" className="relative">
          {mindMaps && mindMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* This would map over the user's mind maps */}
              <Card className="overflow-hidden shadow hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle>My First Mind Map</CardTitle>
                  <CardDescription>Created on April 14, 2025</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="bg-primary-50">
                      Personal
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      meditation
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    5 concepts, 3 connections
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <i className="ri-delete-bin-line mr-1"></i>
                    Delete
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="ri-pencil-line mr-1"></i>
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="ri-mind-map text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Mind Maps Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't created any metaphysical mind maps yet.
              </p>
              <Button onClick={() => setActiveTab("create")}>
                Create Your First Mind Map
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}