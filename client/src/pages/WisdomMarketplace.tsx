import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";

// Sample wisdom offering categories
const CATEGORIES = [
  { id: "meditation", label: "Meditation", icon: "ri-mental-health-line" },
  { id: "insight", label: "Spiritual Insight", icon: "ri-lightbulb-flash-line" },
  { id: "practice", label: "Daily Practice", icon: "ri-calendar-check-line" },
  { id: "teaching", label: "Sacred Teaching", icon: "ri-book-open-line" },
  { id: "ritual", label: "Ritual", icon: "ri-candle-line" },
  { id: "healing", label: "Healing", icon: "ri-psychotherapy-line" }
];

// Sample wisdom offerings
const SAMPLE_OFFERINGS = [
  {
    id: 1,
    title: "Kabbalistic Meditation for Inner Harmony",
    description: "A 20-minute guided meditation connecting the sefirot of Tiferet and Yesod for balancing emotional and spiritual energies.",
    category: "meditation",
    authorId: 3,
    authorName: "Sarah Cohen",
    authorAvatar: null,
    pointsCost: 50,
    rating: 4.8,
    reviewsCount: 24,
    tags: ["kabbalah", "meditation", "balance"]
  },
  {
    id: 2,
    title: "Daily Tree of Life Contemplation Practice",
    description: "A structured 7-day practice for integrating Tree of Life symbolism into your daily awareness.",
    category: "practice",
    authorId: 2,
    authorName: "Alex Johnson",
    authorAvatar: null,
    pointsCost: 35,
    rating: 4.6,
    reviewsCount: 18,
    tags: ["daily practice", "tree of life", "awareness"]
  },
  {
    id: 3,
    title: "Healing Visualization Through the Spheres",
    description: "A healing technique using visualization of ascending through the Sephirotic spheres to access divine healing energy.",
    category: "healing",
    authorId: 5,
    authorName: "Miguel Sanchez",
    authorAvatar: null,
    pointsCost: 65,
    rating: 4.9,
    reviewsCount: 31,
    tags: ["healing", "visualization", "energy work"]
  },
  {
    id: 4,
    title: "Morning Ritual for Aligning with Spiritual Purpose",
    description: "A 15-minute morning ritual to align your daily activities with your highest spiritual purpose using Keter to Malkuth alignment.",
    category: "ritual",
    authorId: 4,
    authorName: "Amara Wilson",
    authorAvatar: null,
    pointsCost: 40,
    rating: 4.7,
    reviewsCount: 22,
    tags: ["morning ritual", "purpose", "alignment"]
  },
  {
    id: 5,
    title: "Teachings on the Middle Pillar of Consciousness",
    description: "An exploration of the middle pillar (Keter, Tiferet, Yesod, Malkuth) as a pathway to balanced consciousness.",
    category: "teaching",
    authorId: 1,
    authorName: "David Goldstein",
    authorAvatar: null,
    pointsCost: 75,
    rating: 4.9,
    reviewsCount: 28,
    tags: ["kabbalah", "consciousness", "balance"]
  },
  {
    id: 6,
    title: "Insight: The Quantum Nature of Binah",
    description: "A deep insight into how Binah (Understanding) relates to quantum physics and the observer effect.",
    category: "insight",
    authorId: 6,
    authorName: "Lily Brenner",
    authorAvatar: null,
    pointsCost: 60,
    rating: 4.8,
    reviewsCount: 19,
    tags: ["quantum", "binah", "physics"]
  }
];

// Get the icon for a category
const getCategoryIcon = (categoryId: string) => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.icon : "ri-question-mark";
};

// Get the label for a category
const getCategoryLabel = (categoryId: string) => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.label : "Unknown";
};

export default function WisdomMarketplace() {
  const [activeTab, setActiveTab] = useState<string>("discover");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  // Filter offerings based on search and category
  const filteredOfferings = SAMPLE_OFFERINGS.filter(offering => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === "" || 
      offering.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offering.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = selectedCategory === null || offering.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get offerings by current user
  const userOfferings = SAMPLE_OFFERINGS.filter(offering => 
    offering.authorId === currentUser?.id
  );

  // Get offerings acquired by current user (placeholder)
  const acquiredOfferings = SAMPLE_OFFERINGS.slice(0, 2);

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-sephirot-purple to-amber-500 bg-clip-text text-transparent">
          Community Wisdom Marketplace
        </h1>
        <p className="text-gray-600 mt-1">
          Share and discover spiritual practices, insights, and teachings from the community.
        </p>
      </div>
      
      {/* Main tabs */}
      <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="myOfferings">My Offerings</TabsTrigger>
          <TabsTrigger value="acquired">Acquired Wisdom</TabsTrigger>
        </TabsList>
        
        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Input 
                placeholder="Search wisdom offerings..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="border border-gray-200"
              >
                All
              </Button>
              {CATEGORIES.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="border border-gray-200"
                >
                  <i className={`${category.icon} mr-2`}></i>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* User's Spiritual Points */}
          <div className="bg-gradient-to-r from-amber-50 to-purple-50 p-4 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center">
              <div className="mr-4">
                <i className="ri-coins-line text-2xl text-amber-500"></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Your Spiritual Points</h3>
                <p className="text-2xl font-bold text-amber-600">{currentUser?.points || 0} <span className="text-sm font-normal">points</span></p>
              </div>
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <i className="ri-information-line mr-1"></i>
                  How to earn more
                </Button>
              </div>
            </div>
          </div>
          
          {/* Offerings Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory 
                ? `${getCategoryLabel(selectedCategory)} Offerings`
                : "Community Wisdom Offerings"
              }
            </h2>
            
            {filteredOfferings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfferings.map(offering => (
                  <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge 
                          className="bg-gradient-to-r from-amber-100 to-purple-100 text-amber-800 hover:from-amber-200 hover:to-purple-200"
                        >
                          <i className={`${getCategoryIcon(offering.category)} mr-1`}></i>
                          {getCategoryLabel(offering.category)}
                        </Badge>
                        <div className="flex items-center text-amber-500">
                          <i className="ri-star-fill mr-1"></i>
                          <span className="text-sm font-medium">{offering.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({offering.reviewsCount})</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 text-xl">{offering.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-200 to-purple-200 flex items-center justify-center text-xs font-medium">
                          {offering.authorName.charAt(0)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{offering.authorName}</span>
                      </div>
                      <CardDescription className="mt-2">{offering.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {offering.tags.map(tag => (
                          <Badge variant="outline" key={tag} className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="font-medium text-amber-700">
                        <i className="ri-coins-line mr-1"></i>
                        {offering.pointsCost} points
                      </div>
                      <Button>
                        Acquire Wisdom
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <i className="ri-search-line text-4xl text-gray-300 mb-2"></i>
                <h3 className="text-lg font-medium text-gray-500">No wisdom offerings found</h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* My Offerings Tab */}
        <TabsContent value="myOfferings">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Wisdom Offerings</h2>
            <Button>
              <i className="ri-add-line mr-1"></i>
              Create New Offering
            </Button>
          </div>
          
          {userOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userOfferings.map(offering => (
                <Card key={offering.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge>
                        <i className={`${getCategoryIcon(offering.category)} mr-1`}></i>
                        {getCategoryLabel(offering.category)}
                      </Badge>
                      <div className="flex items-center text-amber-500">
                        <i className="ri-star-fill mr-1"></i>
                        <span className="text-sm font-medium">{offering.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({offering.reviewsCount})</span>
                      </div>
                    </div>
                    <CardTitle className="mt-2">{offering.title}</CardTitle>
                    <CardDescription className="mt-1">{offering.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {offering.tags.map(tag => (
                        <Badge variant="outline" key={tag} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-amber-50 rounded text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Acquisitions:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Points earned:</span>
                        <span className="font-medium">{offering.pointsCost * 12}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offering price:</span>
                        <span className="font-medium">{offering.pointsCost} points</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button variant="outline">
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                    <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                      <i className="ri-line-chart-line mr-1"></i>
                      View Stats
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <i className="ri-creative-commons-line text-4xl text-gray-300 mb-2"></i>
              <h3 className="text-lg font-medium text-gray-500">You haven't created any offerings yet</h3>
              <p className="text-gray-400 mt-2 mb-4">
                Share your spiritual wisdom with the community and earn points.
              </p>
              <Button>
                <i className="ri-add-line mr-1"></i>
                Create Your First Offering
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Acquired Wisdom Tab */}
        <TabsContent value="acquired">
          <h2 className="text-xl font-semibold mb-6">Your Acquired Wisdom</h2>
          
          {acquiredOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acquiredOfferings.map(offering => (
                <Card key={offering.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge>
                        <i className={`${getCategoryIcon(offering.category)} mr-1`}></i>
                        {getCategoryLabel(offering.category)}
                      </Badge>
                      <div className="flex">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <i className="ri-heart-line text-gray-500 hover:text-red-500"></i>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <i className="ri-bookmark-line text-gray-500 hover:text-amber-500"></i>
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="mt-2">{offering.title}</CardTitle>
                    <div className="flex items-center mt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-200 to-purple-200 flex items-center justify-center text-xs font-medium">
                        {offering.authorName.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{offering.authorName}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {offering.tags.map(tag => (
                        <Badge variant="outline" key={tag} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Separator />
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Acquired on:</span>
                        <span>April 10, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last practiced:</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <i className="ri-star-line mr-1"></i>
                      Rate & Review
                    </Button>
                    <Button>
                      <i className="ri-book-open-line mr-1"></i>
                      Open Wisdom
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <i className="ri-book-open-line text-4xl text-gray-300 mb-2"></i>
              <h3 className="text-lg font-medium text-gray-500">You haven't acquired any wisdom yet</h3>
              <p className="text-gray-400 mt-2 mb-4">
                Explore the marketplace to find spiritual teachings and practices.
              </p>
              <Button onClick={() => setActiveTab("discover")}>
                <i className="ri-compass-3-line mr-1"></i>
                Explore Marketplace
              </Button>
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Practice History</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-amber-600">8</div>
                  <div className="text-sm text-gray-500">This Week</div>
                </div>
                <Separator orientation="vertical" className="mx-6 h-12" />
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-amber-600">24</div>
                  <div className="text-sm text-gray-500">This Month</div>
                </div>
                <Separator orientation="vertical" className="mx-6 h-12" />
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-amber-600">142</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-4">Consistency leads to spiritual growth. Practice your acquired wisdom regularly.</p>
                <Button variant="outline">
                  <i className="ri-calendar-line mr-1"></i>
                  Schedule Practice Reminders
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}