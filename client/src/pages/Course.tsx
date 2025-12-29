import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/transitions/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  ArrowRight,
  Play,
  Lock,
  Star,
  Users,
  Globe,
  Heart,
  Scale,
  Lightbulb
} from "lucide-react";

// Simple markdown renderer that escapes HTML first for safety
function renderMarkdown(content: string): string {
  // First escape any HTML to prevent XSS
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Then apply markdown transformations
  return escaped
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-emerald-800 mb-4">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">');
}

interface CourseModule {
  id: number;
  title: string;
  description: string;
  content: string;
  orderIndex: number;
  estimatedMinutes: number;
  isRequired: boolean;
  completed?: boolean;
  locked?: boolean;
}

// Default course modules focused on understanding systems
const defaultModules: CourseModule[] = [
  {
    id: 1,
    title: "Introduction: Finding Common Ground",
    description: "Understanding the fundamental values that unite all living persons.",
    content: `# Finding Common Ground

Welcome to this journey of understanding. Before we can improve our world, we must first understand what binds us together as human beings.

## What We All Share

Despite our diverse backgrounds, cultures, and beliefs, there are fundamental needs and values that unite us all:

- **Safety & Security** - The desire to feel safe and protected
- **Connection** - The need to belong and be part of a community
- **Growth** - The drive to learn, improve, and reach our potential
- **Purpose** - The search for meaning in our lives
- **Dignity** - The expectation of being treated with respect

## Our Approach

This course takes an unbiased approach, focusing solely on quality of life for all living persons. We don't advocate for any particular political, religious, or economic system - instead, we examine how various systems affect real people's lives.

## What You'll Learn

By the end of this course, you'll have:
- A clearer understanding of how modern systems work
- Tools to evaluate policies based on human wellbeing
- Skills to engage in constructive dialogue
- Ideas for unifying goals that benefit everyone

Let's begin this journey together.`,
    orderIndex: 0,
    estimatedMinutes: 15,
    isRequired: true,
    completed: false,
    locked: false,
  },
  {
    id: 2,
    title: "Understanding Economic Systems",
    description: "How economies affect daily life and wellbeing.",
    content: `# Understanding Economic Systems

Economic systems determine how resources are distributed in society. Understanding them helps us see how they impact everyone's quality of life.

## Key Concepts

### Resource Distribution
- How goods and services reach people
- The role of markets, governments, and communities
- Trade-offs in different approaches

### Work and Income
- How people earn their livelihood
- The relationship between work and dignity
- Balancing productivity with wellbeing

### Measuring Success
- Beyond GDP: What makes economies truly successful?
- Quality of life indicators
- Sustainability considerations

## Reflection Questions

1. What economic conditions help communities thrive?
2. How can we balance efficiency with fairness?
3. What role should technology play in economic systems?`,
    orderIndex: 1,
    estimatedMinutes: 25,
    isRequired: true,
    completed: false,
    locked: true,
  },
  {
    id: 3,
    title: "Governance and Participation",
    description: "How decisions are made and how we can participate.",
    content: `# Governance and Participation

How societies make collective decisions affects everyone. Understanding these processes empowers us to participate meaningfully.

## Types of Decision-Making

### Democratic Principles
- Voice and representation
- Accountability and transparency
- Protection of minority rights

### Levels of Governance
- Local communities
- Regional coordination
- Global cooperation

## Effective Participation

### Being Informed
- Finding reliable information
- Understanding different perspectives
- Avoiding manipulation

### Engaging Constructively
- Respectful dialogue
- Building coalitions
- Creating change

## The Common Good

What serves the wellbeing of all? This question should guide all governance decisions.`,
    orderIndex: 2,
    estimatedMinutes: 30,
    isRequired: true,
    completed: false,
    locked: true,
  },
  {
    id: 4,
    title: "Social Systems and Community",
    description: "The structures that support human connection and belonging.",
    content: `# Social Systems and Community

Humans are inherently social beings. Our social systems shape how we connect, support each other, and create meaning.

## Building Blocks of Community

### Family and Relationships
- Diverse family structures
- Support networks
- Intergenerational connections

### Community Organizations
- Religious and spiritual groups
- Civic organizations
- Support networks

### Digital Communities
- Online connections
- Virtual collaboration
- Balancing digital and physical presence

## Social Safety Nets

How do we ensure no one falls through the cracks?
- Healthcare access
- Education opportunities
- Emergency support systems

## Creating Belonging

Everyone deserves to feel they belong. How can we create more inclusive communities?`,
    orderIndex: 3,
    estimatedMinutes: 25,
    isRequired: true,
    completed: false,
    locked: true,
  },
  {
    id: 5,
    title: "Environmental Stewardship",
    description: "Our relationship with the natural world and future generations.",
    content: `# Environmental Stewardship

We share one planet. How we treat it affects everyone, now and in the future.

## Understanding Our Impact

### Natural Systems
- Ecosystems and their value
- Climate and weather patterns
- Biodiversity and its importance

### Human Activities
- Resource consumption
- Pollution and waste
- Land use and development

## Sustainable Pathways

### Individual Actions
- Daily choices that matter
- Consumer power
- Lifestyle considerations

### Collective Action
- Policy and regulation
- International cooperation
- Technology solutions

## Intergenerational Responsibility

What world do we want to leave for future generations? How do we balance present needs with long-term sustainability?`,
    orderIndex: 4,
    estimatedMinutes: 25,
    isRequired: true,
    completed: false,
    locked: true,
  },
  {
    id: 6,
    title: "Creating Unifying Goals",
    description: "Synthesizing learning into actionable, unifying objectives.",
    content: `# Creating Unifying Goals

You've explored many systems. Now let's bring it all together into actionable goals that can unite diverse groups.

## The Unifying Framework

### Core Principles
1. **Human Dignity** - Every person matters equally
2. **Sustainability** - Decisions consider long-term impacts
3. **Inclusion** - Everyone has a voice
4. **Balance** - Multiple values coexist
5. **Adaptability** - Systems can evolve

## Identifying Common Goals

What do most people want?
- Safe communities
- Meaningful work
- Access to healthcare and education
- Clean environment
- Freedom to pursue happiness

## Taking Action

### Start Local
- What can you improve in your community?
- Who can you collaborate with?

### Think Global
- How do local actions connect to larger changes?
- What global challenges need attention?

## Your Commitment

As you complete this course, consider: What will you do to contribute to a better world for all?`,
    orderIndex: 5,
    estimatedMinutes: 30,
    isRequired: true,
    completed: false,
    locked: true,
  },
];

export default function Course() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);

  // Fetch course progress
  const { data: modules, isLoading } = useQuery<CourseModule[]>({
    queryKey: ["course-progress"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/course/progress", {
          credentials: "include",
        });
        if (!response.ok) {
          return defaultModules;
        }
        return response.json();
      } catch {
        return defaultModules;
      }
    },
    initialData: defaultModules,
  });

  // Complete module mutation
  const completeModuleMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      const response = await fetch(`/api/course/modules/${moduleId}/complete`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to complete module");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({
        title: "Module Completed!",
        description: "Great progress! Keep learning.",
      });
      setActiveModule(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completedModules = modules?.filter(m => m.completed).length || 0;
  const totalModules = modules?.length || defaultModules.length;
  const progressPercent = (completedModules / totalModules) * 100;
  const isComplete = progressPercent >= 100;

  const handleStartModule = (module: CourseModule) => {
    if (module.locked && !module.completed) {
      toast({
        title: "Module Locked",
        description: "Complete previous modules first.",
        variant: "destructive",
      });
      return;
    }
    setActiveModule(module);
  };

  const handleCompleteModule = () => {
    if (!activeModule) return;
    
    // For demo purposes, mark as complete locally
    const updatedModules = modules?.map(m => {
      if (m.id === activeModule.id) {
        return { ...m, completed: true };
      }
      // Unlock next module
      if (m.orderIndex === activeModule.orderIndex + 1) {
        return { ...m, locked: false };
      }
      return m;
    });
    
    queryClient.setQueryData(["course-progress"], updatedModules);
    toast({
      title: "Module Completed!",
      description: "Great progress! Keep learning.",
    });
    setActiveModule(null);
  };

  const moduleIcons = [Globe, Scale, Users, Heart, Lightbulb, Star];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Active Module View */}
        <AnimatePresence mode="wait">
          {activeModule ? (
            <motion.div
              key="module"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => setActiveModule(null)}
                className="mb-4"
              >
                ← Back to Course
              </Button>
              
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-emerald-100 text-emerald-700">
                      Module {activeModule.orderIndex + 1}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activeModule.estimatedMinutes} min
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{activeModule.title}</CardTitle>
                  <CardDescription>{activeModule.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-6 prose prose-emerald max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdown(activeModule.content)
                    }} 
                  />
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    onClick={handleCompleteModule}
                    disabled={activeModule.completed}
                  >
                    {activeModule.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Already Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4"
                >
                  Understanding Systems Course
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 max-w-2xl mx-auto mb-6"
                >
                  Complete this course to maintain free access to the platform.
                  Learn about the systems that shape our world with an unbiased focus on quality of life for all.
                </motion.p>

                {/* Progress Overview */}
                <Card className="max-w-md mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-emerald-800">Your Progress</span>
                      <span className="text-sm text-emerald-600">{completedModules}/{totalModules} modules</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 mb-2" />
                    {isComplete ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-medium">
                        <Trophy className="w-5 h-5" />
                        Course Complete! Free access unlocked.
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {totalModules - completedModules} modules remaining
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Course Modules */}
              <StaggerContainer className="space-y-4">
                {modules?.map((module, index) => {
                  const Icon = moduleIcons[index % moduleIcons.length];
                  const isLocked = index > 0 && !modules[index - 1]?.completed && !module.completed;
                  
                  return (
                    <StaggerItem key={module.id}>
                      <Card 
                        className={`transition-all duration-300 ${
                          module.completed 
                            ? "border-emerald-200 bg-emerald-50/50" 
                            : isLocked 
                            ? "opacity-60" 
                            : "hover:shadow-md cursor-pointer"
                        }`}
                        onClick={() => !isLocked && handleStartModule({...module, locked: isLocked})}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              module.completed 
                                ? "bg-emerald-100 text-emerald-600" 
                                : isLocked
                                ? "bg-gray-100 text-gray-400"
                                : "bg-teal-100 text-teal-600"
                            }`}>
                              {module.completed ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                <Icon className="w-6 h-6" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  Module {index + 1}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {module.estimatedMinutes} min
                                </span>
                                {module.isRequired && (
                                  <Badge className="bg-amber-100 text-amber-700 text-xs">Required</Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-800">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>

                            <div>
                              {module.completed ? (
                                <Badge className="bg-emerald-100 text-emerald-700">
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Completed
                                </Badge>
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="text-indigo-800">Why Complete This Course?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Deeper Understanding</h4>
                        <p className="text-sm text-gray-600">
                          Gain insights into how systems affect everyone's quality of life.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Build Bridges</h4>
                        <p className="text-sm text-gray-600">
                          Find common ground with people from different backgrounds.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-100 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-pink-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Free Access</h4>
                        <p className="text-sm text-gray-600">
                          Maintain free platform access by completing this course.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
