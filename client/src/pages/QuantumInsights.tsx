import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuantumRecommendations from '@/components/quantum/QuantumRecommendations';

export default function QuantumInsights() {
  const [activeTab, setActiveTab] = useState('quantum-inspirations');

  return (
    <div className="container py-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent">
          Quantum Spiritual Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Experience synchronistic guidance and spiritually resonant recommendations attuned to your unique energy signature.
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with explanations */}
        <div className="md:col-span-1">
          <Card className="bg-gradient-to-br from-purple-900/5 to-indigo-900/5 border border-purple-200/20 sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                <span className="flex items-center gap-2">
                  <i className="ri-magic-line text-amber-500"></i>
                  <span>Quantum Guidance</span>
                </span>
              </CardTitle>
              <CardDescription>
                How the quantum field connects with your consciousness
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h3 className="font-medium text-purple-600 mb-1">Resonance Algorithm</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our quantum algorithms detect patterns in your spiritual journey and match them with resonant energies.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-indigo-600 mb-1">Synchronicity Engine</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Meaningful coincidences are detected and highlighted to guide your spiritual path.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-amber-600 mb-1">Soul Connections</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover others whose energetic signatures harmonize with yours across dimensions.
                </p>
              </div>
              
              <div className="pt-2 border-t border-purple-100 dark:border-purple-900/30">
                <p className="text-xs text-gray-500 italic">
                  "The universe speaks in the language of synchronicity. Our quantum algorithms help translate."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quantum-inspirations">
                <span className="flex items-center gap-2">
                  <i className="ri-lightbulb-flash-line text-amber-500"></i>
                  <span>Quantum Inspirations</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="spiritual-directions">
                <span className="flex items-center gap-2">
                  <i className="ri-compass-3-line text-purple-500"></i>
                  <span>Spiritual Directions</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quantum-inspirations" className="pt-6">
              <QuantumRecommendations />
            </TabsContent>

            <TabsContent value="spiritual-directions" className="pt-6">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-900/10 to-amber-900/5 border border-amber-200/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl transform translate-x-8 -translate-y-8"></div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-medium text-amber-600">
                      Your Spiritual Compass
                    </CardTitle>
                    <CardDescription>
                      Your current position in the cosmic journey
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-white/40 dark:bg-white/5 rounded-lg p-4">
                      <h3 className="font-medium text-purple-600 mb-2">Current Phase: Transformation</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        You are in a transformative phase where old structures dissolve to make way for new growth. 
                        This is a period of both creation and destruction - embrace the chrysalis state.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/40 dark:bg-white/5 rounded-lg p-4">
                        <h3 className="font-medium text-indigo-600 mb-2">Dominant Energy: Tiphareth (Beauty)</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          Your soul is currently resonating with the harmonizing energy of Tiphareth,
                          the balancing center of the Tree of Life.
                        </p>
                      </div>
                      
                      <div className="bg-white/40 dark:bg-white/5 rounded-lg p-4">
                        <h3 className="font-medium text-amber-600 mb-2">Rising Energy: Geburah (Strength)</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          You're developing greater discernment and inner strength.
                          This energy helps establish healthy boundaries.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/40 dark:bg-white/5 rounded-lg p-4">
                      <h3 className="font-medium text-purple-600 mb-2">Recommended Path</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Focus on balancing your inner polarities while strengthening your energetic boundaries.
                        Practices that connect heart wisdom with discernment will be especially powerful now.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-purple-200/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        <span className="flex items-center gap-2">
                          <i className="ri-focus-3-line text-purple-500"></i>
                          <span>Cosmic Alignment</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your energy is aligned with the cosmic pattern of transformation.
                        This is a powerful time for manifestation work and inner alchemy.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-indigo-200/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        <span className="flex items-center gap-2">
                          <i className="ri-heart-pulse-line text-indigo-500"></i>
                          <span>Energy Signature</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your unique energy signature shows strong resonance with creative
                        and analytical frequencies, suggesting a balanced approach.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-amber-200/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        <span className="flex items-center gap-2">
                          <i className="ri-timer-line text-amber-500"></i>
                          <span>Cosmic Timing</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The current cosmic timing favors inner work and preparation.
                        New opportunities for growth will emerge in the coming lunar cycle.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}