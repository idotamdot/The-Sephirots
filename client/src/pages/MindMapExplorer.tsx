import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import MindMapCanvas, { MindMapNode, MindMapConnection } from "@/components/mindmap/MindMapCanvas";
import StarfieldBackground from "@/components/mindmap/StarfieldBackground";

// Define MindMap type
interface MindMap {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  category: string;
  isPublic: boolean;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
  nodes?: MindMapNode[];
  connections?: MindMapConnection[];
  collaborators?: any[];
}

// Define Template type
interface MindMapTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  createdBy: number;
  nodeData: string;
  connectionData: string;
  isPublic: boolean;
  createdAt: string;
}

// Extract tags from a description (temporary function until we have proper tags)
const extractTags = (description: string): string[] => {
  const keywords = ["consciousness", "spiritual", "mystical", "divine", "energy", "metaphysical", 
                   "meditation", "soul", "higher self", "awareness", "connection", "being",
                   "kabbalah", "tree of life", "sephirot"];
  
  return keywords.filter(keyword => 
    description.toLowerCase().includes(keyword.toLowerCase())
  ).slice(0, 3); // Limit to 3 tags
};

export default function MindMapExplorer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [mapName, setMapName] = useState("Untitled Mind Map");
  const [mapDescription, setMapDescription] = useState("");
  const [mapCategory, setMapCategory] = useState("spirituality");
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborative, setIsCollaborative] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentMap, setCurrentMap] = useState<{
    nodes: MindMapNode[];
    connections: MindMapConnection[];
  } | null>(null);
  const [selectedMindMapId, setSelectedMindMapId] = useState<number | null>(null);

  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  // Get mind map templates
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<MindMapTemplate[]>({
    queryKey: ["/api/mindmap-templates"],
    enabled: activeTab === "explore"
  });

  // Get all public mind maps
  const { data: publicMindMaps = [], isLoading: isLoadingPublicMaps } = useQuery<MindMap[]>({
    queryKey: ["/api/mindmaps"],
    enabled: activeTab === "explore"
  });

  // Get user's mind maps
  const { data: userMindMaps = [], isLoading: isLoadingUserMaps } = useQuery<MindMap[]>({
    queryKey: ["/api/mindmaps/user", currentUser?.id],
    enabled: !!currentUser && activeTab === "myMaps"
  });

  // Get specific mind map details
  const { data: selectedMindMap, isLoading: isLoadingSelectedMap } = useQuery<MindMap>({
    queryKey: ["/api/mindmaps", selectedMindMapId],
    enabled: !!selectedMindMapId
  });
  
  // Create new mind map mutation
  const createMindMap = useMutation({
    mutationFn: (newMindMap: any) => 
      apiRequest("POST", "/api/mindmaps", newMindMap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps/user", currentUser?.id] });
      toast({
        title: "Success",
        description: "Mind map created successfully!",
        variant: "success"
      });
      setActiveTab("myMaps");
    },
    onError: (error) => {
      console.error("Error creating mind map:", error);
      toast({
        title: "Error",
        description: "Failed to create mind map. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Add nodes to mind map mutation
  const addNode = useMutation({
    mutationFn: ({ mapId, nodeData }: { mapId: number, nodeData: any }) => 
      apiRequest("POST", `/api/mindmaps/${mapId}/nodes`, nodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps", selectedMindMapId] });
    }
  });

  // Add connections to mind map mutation
  const addConnection = useMutation({
    mutationFn: ({ mapId, connectionData }: { mapId: number, connectionData: any }) => 
      apiRequest("POST", `/api/mindmaps/${mapId}/connections`, connectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps", selectedMindMapId] });
    }
  });

  // Delete mind map mutation
  const deleteMindMap = useMutation({
    mutationFn: (mapId: number) => 
      apiRequest("DELETE", `/api/mindmaps/${mapId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mindmaps/user", currentUser?.id] });
      toast({
        title: "Success",
        description: "Mind map deleted successfully!",
        variant: "success"
      });
    }
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMapName(`${template.name} - Copy`);
      setMapDescription(template.description);
      setMapCategory(template.category.toLowerCase());
      
      // If the template has nodes/connections, load them
      if (template.nodeData && template.connectionData) {
        try {
          const nodes = JSON.parse(template.nodeData);
          const connections = JSON.parse(template.connectionData);
          setCurrentMap({ nodes, connections });
        } catch (e) {
          console.error("Error parsing template data:", e);
        }
      }
    }
  };

  // Handle map changes in the canvas
  const handleMapChange = (nodes: MindMapNode[], connections: MindMapConnection[]) => {
    setCurrentMap({ nodes, connections });
  };

  // Handle creating a new mind map
  const handleCreateNewMap = () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a mind map.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset form
    setMapName("Untitled Mind Map");
    setMapDescription("");
    setMapCategory("spirituality");
    setIsPublic(true);
    setIsCollaborative(true);
    setCurrentMap(null);
    setSelectedTemplate(null);
    
    // Show create dialog
    setShowCreateDialog(true);
  };

  // Handle saving mind map
  const handleSaveMap = async () => {
    if (!currentUser || !currentMap) return;
    
    try {
      // Create the mind map
      const mindMapData = {
        name: mapName,
        description: mapDescription,
        category: mapCategory,
        createdBy: currentUser.id,
        isPublic,
        isCollaborative
      };
      
      const response = await createMindMap.mutateAsync(mindMapData);
      const data = await response.json();
      const newMapId = data.id;
      
      // Add nodes
      for (const node of currentMap.nodes) {
        await addNode.mutateAsync({
          mapId: newMapId,
          nodeData: {
            nodeId: node.id,
            type: node.type,
            content: node.content,
            x: node.x,
            y: node.y,
            color: node.color,
            size: node.size,
            createdBy: currentUser.id,
            attributes: JSON.stringify(node.attributes || {})
          }
        });
      }
      
      // Add connections
      for (const connection of currentMap.connections) {
        await addConnection.mutateAsync({
          mapId: newMapId,
          connectionData: {
            connectionId: connection.id,
            sourceNodeId: connection.sourceId,
            targetNodeId: connection.targetId,
            label: connection.label || null,
            color: connection.color,
            thickness: connection.thickness,
            style: connection.style,
            createdBy: currentUser.id
          }
        });
      }
      
      toast({
        title: "Success",
        description: "Mind map saved successfully!",
        variant: "success"
      });
      
      // Switch to My Mind Maps tab
      setActiveTab("myMaps");
      
    } catch (error) {
      console.error("Error saving mind map:", error);
      toast({
        title: "Error",
        description: "Failed to save mind map. Please try again.",
        variant: "destructive"
      });
    }
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
          {isLoadingTemplates ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-primary-500 shadow-lg' 
                        : 'shadow'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="outline" className="bg-primary-50">
                          {template.category}
                        </Badge>
                        {extractTags(template.description).map(tag => (
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
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-sephirot-purple to-amber-500 hover:from-sephirot-purple-dark hover:to-amber-600"
                  >
                    Create from Template
                  </Button>
                </div>
              )}
            </>
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
          {isLoadingUserMaps ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : userMindMaps.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-900">Your Mind Maps</h2>
                <Button onClick={handleCreateNewMap}>
                  <i className="ri-add-line mr-1"></i>
                  Create New Map
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userMindMaps.map(mindMap => {
                  const createdDate = new Date(mindMap.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  return (
                    <Card key={mindMap.id} className="overflow-hidden shadow hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle>{mindMap.name}</CardTitle>
                        <CardDescription>Created on {createdDate}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="bg-primary-50">
                            {mindMap.category}
                          </Badge>
                          {extractTags(mindMap.description).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {mindMap.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteMindMap.mutate(mindMap.id)}
                          disabled={deleteMindMap.isPending}
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Delete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedMindMapId(mindMap.id);
                            setActiveTab("create");
                          }}
                        >
                          <i className="ri-pencil-line mr-1"></i>
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <i className="ri-mind-map text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Mind Maps Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't created any metaphysical mind maps yet.
              </p>
              <Button onClick={handleCreateNewMap}>
                Create Your First Mind Map
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Mind Map Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Mind Map</DialogTitle>
            <DialogDescription>
              Enter the details for your new metaphysical mind map.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={mapCategory}
                onValueChange={setMapCategory}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="spirituality">Spirituality</SelectItem>
                    <SelectItem value="consciousness">Consciousness</SelectItem>
                    <SelectItem value="metaphysics">Metaphysics</SelectItem>
                    <SelectItem value="kabbalah">Kabbalah</SelectItem>
                    <SelectItem value="mysticism">Mysticism</SelectItem>
                    <SelectItem value="theology">Theology</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={mapDescription}
                onChange={(e) => setMapDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Settings</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Public</p>
                    <p className="text-xs text-gray-500">Allow others to view this mind map</p>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Collaborative</p>
                    <p className="text-xs text-gray-500">Allow others to contribute to this mind map</p>
                  </div>
                  <Switch
                    checked={isCollaborative}
                    onCheckedChange={setIsCollaborative}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowCreateDialog(false);
                setActiveTab("create");
              }}
              className="bg-gradient-to-r from-sephirot-purple to-amber-500 hover:from-sephirot-purple-dark hover:to-amber-600"
            >
              Start Creating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}