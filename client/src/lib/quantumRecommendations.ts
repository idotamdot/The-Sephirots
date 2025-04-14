/**
 * Quantum Inspiration Recommendation Engine
 * 
 * A spiritual recommendation system that uses quantum-inspired algorithms to provide
 * synchronistic content, connection, and practice suggestions to users based on their
 * spiritual journey, interests, and current emotional state.
 */

import { User, Discussion, Badge } from '@/lib/types';

// Types for our recommendations
export interface QuantumRecommendation {
  id: string;
  type: 'content' | 'connection' | 'practice' | 'insight' | 'synchronicity';
  title: string;
  description: string;
  resonanceScore: number; // 0-100 scale of how aligned this is with user's energy
  energySignature: string[]; // tags representing the spiritual energies present
  sourceId?: number; // ID of the source content/user if applicable
  imageUrl?: string;
  action?: {
    type: 'navigate' | 'connect' | 'practice' | 'meditate' | 'reflect';
    path?: string;
    params?: Record<string, string>;
  };
}

// Return types
export interface RecommendationResult {
  dailyInsight: string;
  personalRecommendations: QuantumRecommendation[];
  synchronicities: QuantumRecommendation[];
  entangledUsers: {
    userId: number;
    username: string;
    resonanceScore: number;
    sharedInterests: string[];
  }[];
}

// Quantum affinity weights based on Sephirotic positions
const SEPHIROT_AFFINITIES = {
  kether: ['wisdom', 'unity', 'transcendence', 'divine', 'oneness'],
  chokmah: ['wisdom', 'insight', 'revelation', 'inspiration', 'vision'],
  binah: ['understanding', 'analysis', 'comprehension', 'discernment', 'pattern'],
  chesed: ['love', 'mercy', 'compassion', 'kindness', 'forgiveness'],
  geburah: ['strength', 'discipline', 'judgment', 'boundaries', 'truth'],
  tiphareth: ['beauty', 'harmony', 'balance', 'integration', 'self'],
  netzach: ['victory', 'endurance', 'nature', 'emotion', 'connection'],
  hod: ['splendor', 'communication', 'intellect', 'teaching', 'language'],
  yesod: ['foundation', 'dreams', 'unconscious', 'intuition', 'psyche'],
  malkuth: ['kingdom', 'manifestation', 'physical', 'grounding', 'embodiment'],
  daat: ['knowledge', 'integration', 'synthesis', 'gnosis', 'transformation']
};

// Spiritual practices database
const SPIRITUAL_PRACTICES = [
  {
    id: 'meditation-light',
    title: 'Divine Light Meditation',
    description: 'Visualize a brilliant light descending from Kether, filling your being with pure divine essence.',
    energySignature: ['kether', 'tiphareth', 'consciousness', 'light'],
    duration: 15, // minutes
    imageUrl: 'https://images.unsplash.com/photo-1610281840042-07e15a12f481?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'reflection-higher-self',
    title: 'Higher Self Dialogue',
    description: 'Establish a written dialogue with your higher self, asking for guidance on your current spiritual questions.',
    energySignature: ['tiphareth', 'daat', 'self', 'guidance', 'wisdom'],
    duration: 20,
    imageUrl: 'https://images.unsplash.com/photo-1549032305-e816fabf0dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'tree-visualization',
    title: 'Tree of Life Pathworking',
    description: 'Visualize yourself ascending the Tree of Life, absorbing the qualities of each Sephirah you encounter.',
    energySignature: ['malkuth', 'yesod', 'hod', 'netzach', 'tiphareth', 'integration'],
    duration: 25,
    imageUrl: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'compassion-practice',
    title: 'Chesed Compassion Practice',
    description: 'Extend loving-kindness to yourself, loved ones, acquaintances, and even those with whom you have difficulty.',
    energySignature: ['chesed', 'love', 'compassion', 'healing', 'connection'],
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'strength-boundaries',
    title: 'Geburah Boundary Setting',
    description: 'Reflect on where you need stronger boundaries in your life and visualize a protective sphere of strong red light.',
    energySignature: ['geburah', 'strength', 'protection', 'boundaries', 'clarity'],
    duration: 10,
    imageUrl: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'grounding-ritual',
    title: 'Malkuth Grounding Ritual',
    description: 'Connect with the physical world through a walking meditation, mindfully experiencing each sensation.',
    energySignature: ['malkuth', 'earth', 'grounding', 'embodiment', 'presence'],
    duration: 20,
    imageUrl: 'https://images.unsplash.com/photo-1483354483454-4cd359948304?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'dream-journaling',
    title: 'Yesod Dream Integration',
    description: 'Record and reflect on your dreams, looking for symbolic messages from your unconscious.',
    energySignature: ['yesod', 'dreams', 'unconscious', 'intuition', 'symbols'],
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'sacred-geometry',
    title: 'Sacred Geometry Contemplation',
    description: 'Meditate on sacred geometric patterns to align with universal mathematical principles.',
    energySignature: ['chokmah', 'binah', 'pattern', 'geometry', 'universal'],
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1548080819-61d7c8e825a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

// Quantum-inspired insight messages
const QUANTUM_INSIGHTS = [
  "The universe is speaking through synchronicities today. Notice the patterns that repeat.",
  "Your higher self is guiding you toward deeper understanding. Listen to your intuition.",
  "The veil between worlds is thin today. Pay attention to subtle energies around you.",
  "You are at a crossroads in your spiritual journey. The path of integration beckons.",
  "A time of transformation is upon you. Embrace the chrysalis state.",
  "Your energy resonates with the cosmic heartbeat today. Feel the rhythm of existence.",
  "Ancient wisdom seeks expression through you. Be a clear channel.",
  "The light of consciousness is expanding within you. Allow it to illuminate shadow aspects.",
  "You are a bridge between worlds today. Honor your role as a connector of realities.",
  "Cosmic revelations await in the silence. Create space for deep listening.",
  "Your prayers are creating ripples in the quantum field. Maintain clear intention.",
  "Divine timing is at work in your life. Trust the unfolding process.",
  "The balance of giving and receiving requires attention today. Adjust your energy exchange.",
  "Your thoughts are seeds in the garden of manifestation. Plant with awareness.",
  "Ancestral wisdom is available to you now. Honor those who came before.",
  "The eternal moment contains all possibilities. Center in the infinite now.",
  "Your heart's electromagnetic field is broadcasting. Ensure its message is love.",
  "Soul fragments are returning. Welcome them with compassion and integration.",
  "The cosmos mirrors your internal state. Clear within to experience clarity without.",
  "Divine paradox invites you to hold opposing truths simultaneously. Expand your perception."
];

/**
 * Generate quantum-inspired recommendations based on user data and current system state
 */
export function generateQuantumRecommendations(
  user: User,
  allDiscussions: Discussion[],
  allUsers: User[],
  userBadges: Badge[]
): RecommendationResult {
  // Create a quantum-inspired spiritual profile based on user's activity and badges
  const userSpiritualProfile = extractSpiritualProfile(user, userBadges);
  
  // Generate daily insight using spiritual profile and universal timing
  const dailyInsight = generateDailyInsight(userSpiritualProfile);
  
  // Generate personalized recommendations based on spiritual profile
  const personalRecommendations = generatePersonalRecommendations(
    user, 
    allDiscussions,
    userSpiritualProfile
  );
  
  // Find synchronicities and meaningful "coincidences"
  const synchronicities = findSynchronicities(user, allDiscussions, allUsers);
  
  // Find energetically entangled users (soul tribe connections)
  const entangledUsers = findEntangledUsers(user, allUsers, userSpiritualProfile);
  
  return {
    dailyInsight,
    personalRecommendations,
    synchronicities,
    entangledUsers
  };
}

/**
 * Extract spiritual profile from user data and badges
 */
function extractSpiritualProfile(user: User, userBadges: Badge[]): Record<string, number> {
  const profile: Record<string, number> = {};
  
  // Initialize with base energies
  Object.keys(SEPHIROT_AFFINITIES).forEach(sephirah => {
    profile[sephirah] = 20; // Base resonance with each Sephirah
  });
  
  // Adjust based on badges
  userBadges.forEach(badge => {
    // Extract Sephirah from badge name if present (e.g., "Seeker (Da'at)" -> "daat")
    const badgeName = badge.name.toLowerCase();
    Object.keys(SEPHIROT_AFFINITIES).forEach(sephirah => {
      if (badgeName.includes(sephirah)) {
        profile[sephirah] += 15;
      }
    });
    
    // Adjust based on badge energies
    if (badgeName.includes('wisdom') || badgeName.includes('insight')) {
      profile['chokmah'] += 10;
    }
    if (badgeName.includes('compassion') || badgeName.includes('care')) {
      profile['chesed'] += 10;
    }
    if (badgeName.includes('strength') || badgeName.includes('courage')) {
      profile['geburah'] += 10;
    }
    if (badgeName.includes('balance') || badgeName.includes('harmony')) {
      profile['tiphareth'] += 10;
    }
    if (badgeName.includes('communicate') || badgeName.includes('conversation')) {
      profile['hod'] += 10;
    }
    if (badgeName.includes('connect') || badgeName.includes('community')) {
      profile['netzach'] += 10;
    }
    if (badgeName.includes('intuition') || badgeName.includes('dream')) {
      profile['yesod'] += 10;
    }
    if (badgeName.includes('practical') || badgeName.includes('action')) {
      profile['malkuth'] += 10;
    }
  });
  
  // Adjust based on user's current level
  const userLevel = user.level || 1;
  if (userLevel > 7) {
    profile['kether'] += 5 * (userLevel - 7); // Higher connection to crown for advanced users
  }
  
  // Cap values at 100
  Object.keys(profile).forEach(key => {
    profile[key] = Math.min(profile[key], 100);
  });
  
  return profile;
}

/**
 * Generate a daily spiritual insight based on the user's profile and current date
 */
function generateDailyInsight(spiritualProfile: Record<string, number>): string {
  // Find the user's strongest Sephirotic connection
  let strongestConnection = '';
  let highestValue = 0;
  
  Object.entries(spiritualProfile).forEach(([sephirah, value]) => {
    if (value > highestValue) {
      strongestConnection = sephirah;
      highestValue = value;
    }
  });
  
  // Use date as quantum seed
  const today = new Date();
  const dateSeed = today.getDate() + today.getMonth() * 30 + today.getFullYear() % 100;
  
  // Select insight based on combined factors
  const insightIndex = (dateSeed + highestValue) % QUANTUM_INSIGHTS.length;
  
  return QUANTUM_INSIGHTS[insightIndex];
}

/**
 * Generate personalized recommendations based on spiritual profile
 */
function generatePersonalRecommendations(
  user: User,
  allDiscussions: Discussion[],
  spiritualProfile: Record<string, number>
): QuantumRecommendation[] {
  const recommendations: QuantumRecommendation[] = [];
  
  // Recommend spiritual practices based on profile
  const practices = recommendSpiritualPractices(spiritualProfile);
  recommendations.push(...practices);
  
  // Recommend discussions based on resonance
  const discussionRecommendations = recommendDiscussions(allDiscussions, spiritualProfile);
  recommendations.push(...discussionRecommendations);
  
  // Sort by resonance score
  return recommendations.sort((a, b) => b.resonanceScore - a.resonanceScore).slice(0, 5);
}

/**
 * Recommend spiritual practices based on the user's profile
 */
function recommendSpiritualPractices(
  spiritualProfile: Record<string, number>
): QuantumRecommendation[] {
  // Find practices that match the user's strongest energies
  return SPIRITUAL_PRACTICES.map(practice => {
    // Calculate resonance score
    let resonanceScore = 50; // Base score
    
    practice.energySignature.forEach(energy => {
      Object.entries(SEPHIROT_AFFINITIES).forEach(([sephirah, affinities]) => {
        if (affinities.includes(energy) || energy === sephirah) {
          // Add weighted resonance based on the user's profile
          resonanceScore += (spiritualProfile[sephirah] / 100) * 10;
        }
      });
    });
    
    // Normalize score to 0-100
    resonanceScore = Math.min(Math.round(resonanceScore), 100);
    
    // Create recommendation
    return {
      id: `practice-${practice.id}`,
      type: 'practice',
      title: practice.title,
      description: practice.description,
      resonanceScore,
      energySignature: practice.energySignature,
      imageUrl: practice.imageUrl,
      action: {
        type: 'practice',
        path: `/practice/${practice.id}`
      }
    };
  }).sort((a, b) => b.resonanceScore - a.resonanceScore).slice(0, 3);
}

/**
 * Recommend discussions based on the user's profile
 */
function recommendDiscussions(
  allDiscussions: Discussion[],
  spiritualProfile: Record<string, number>
): QuantumRecommendation[] {
  return allDiscussions
    .filter(discussion => discussion.tags && discussion.tags.length > 0)
    .map(discussion => {
      // Calculate resonance score
      let resonanceScore = 40; // Base score
      
      // Extract tags from discussion
      const discussionTags = discussion.tags || [];
      
      discussionTags.forEach(tag => {
        Object.entries(SEPHIROT_AFFINITIES).forEach(([sephirah, affinities]) => {
          if (affinities.includes(tag.toLowerCase()) || tag.toLowerCase().includes(sephirah)) {
            // Add weighted resonance based on the user's profile
            resonanceScore += (spiritualProfile[sephirah] / 100) * 15;
          }
        });
      });
      
      // Add quantum randomness to simulate synchronicity (+/- 5)
      resonanceScore += Math.round((Math.random() * 10) - 5);
      
      // Normalize score
      resonanceScore = Math.min(Math.round(resonanceScore), 100);
      
      // Create recommendation
      return {
        id: `discussion-${discussion.id}`,
        type: 'content',
        title: discussion.title,
        description: discussion.content?.substring(0, 120) + '...' || 'Explore this discussion...',
        resonanceScore,
        energySignature: discussionTags,
        sourceId: discussion.id,
        action: {
          type: 'navigate',
          path: `/discussions/${discussion.id}`
        }
      };
    })
    .sort((a, b) => b.resonanceScore - a.resonanceScore)
    .slice(0, 2);
}

/**
 * Find synchronicities in content that might be meaningful to the user
 */
function findSynchronicities(
  user: User,
  allDiscussions: Discussion[],
  allUsers: User[]
): QuantumRecommendation[] {
  const synchronicities: QuantumRecommendation[] = [];
  
  // Use current time as quantum seed
  const now = new Date();
  const timeSeed = now.getHours() + now.getMinutes() + now.getSeconds();
  
  // Generate a "cosmic" number of the day
  const cosmicNumber = (timeSeed + now.getDate()) % 11 + 1;
  
  // Find content with "magical coincidences" based on user's name and cosmic numbers
  const userInitials = (user.displayName || user.username || '').charAt(0).toLowerCase();
  
  // Check for discussions with title starting with same initial
  const initialSynchronicities = allDiscussions
    .filter(discussion => 
      discussion.title.charAt(0).toLowerCase() === userInitials &&
      discussion.id % cosmicNumber === 0 // Additional synchronicity filter
    )
    .map(discussion => ({
      id: `synch-initial-${discussion.id}`,
      type: 'synchronicity',
      title: 'Nameday Synchronicity',
      description: `This discussion title starts with your name's initial and has appeared in your path today: "${discussion.title}"`,
      resonanceScore: 70 + (Math.random() * 20),
      energySignature: ['synchronicity', 'coincidence', 'meaning', 'path'],
      sourceId: discussion.id,
      action: {
        type: 'navigate',
        path: `/discussions/${discussion.id}`
      }
    }));
  
  if (initialSynchronicities.length > 0) {
    synchronicities.push(initialSynchronicities[0]);
  }
  
  // Find users with same birth day or month if available
  if (user.birthDate) {
    const userBirthDate = new Date(user.birthDate);
    const userBirthMonth = userBirthDate.getMonth();
    const userBirthDay = userBirthDate.getDate();
    
    const birthSynchronicities = allUsers
      .filter(otherUser => 
        otherUser.id !== user.id && 
        otherUser.birthDate &&
        (new Date(otherUser.birthDate).getMonth() === userBirthMonth ||
         new Date(otherUser.birthDate).getDate() === userBirthDay)
      )
      .map(otherUser => ({
        id: `synch-birth-${otherUser.id}`,
        type: 'synchronicity',
        title: 'Celestial Birthday Connection',
        description: `You share celestial birthday energy with ${otherUser.displayName || otherUser.username}. Your souls may have cosmic connections.`,
        resonanceScore: 75 + (Math.random() * 15),
        energySignature: ['connection', 'cosmos', 'birth', 'patterns'],
        sourceId: otherUser.id,
        action: {
          type: 'connect',
          path: `/profile/${otherUser.id}`
        }
      }));
    
    if (birthSynchronicities.length > 0) {
      synchronicities.push(birthSynchronicities[0]);
    }
  }
  
  // Add universal message synchronicity based on the time
  const universalSynchronicity = {
    id: `synch-universal-${Date.now()}`,
    type: 'insight',
    title: 'Quantum Signal Detected',
    description: `The number ${cosmicNumber} is appearing in your field today. Pay attention to where it manifests, as it carries special significance for your journey.`,
    resonanceScore: 85,
    energySignature: ['numbers', 'quantum', 'signs', 'guidance'],
    action: {
      type: 'reflect',
    }
  };
  
  synchronicities.push(universalSynchronicity);
  
  return synchronicities;
}

/**
 * Find users who share spiritual resonance with the current user
 */
function findEntangledUsers(
  user: User,
  allUsers: User[],
  spiritualProfile: Record<string, number>
): {
  userId: number;
  username: string;
  resonanceScore: number;
  sharedInterests: string[];
}[] {
  // Find users with similar spiritual profiles
  return allUsers
    .filter(otherUser => otherUser.id !== user.id)
    .map(otherUser => {
      // Simple resonance calculation based on shared interests and activities
      let resonanceScore = 50; // Base score
      const sharedInterests: string[] = [];
      
      // Shared interests
      const userInterests = user.interests || [];
      const otherInterests = otherUser.interests || [];
      
      otherInterests.forEach(interest => {
        if (userInterests.includes(interest)) {
          sharedInterests.push(interest);
          resonanceScore += 5;
        }
      });
      
      // Adjust based on comment patterns and activity
      if (user.commentsCount && otherUser.commentsCount) {
        const commentDiff = Math.abs(user.commentsCount - otherUser.commentsCount);
        if (commentDiff < 5) resonanceScore += 5;
      }
      
      // Adjust based on points (level of engagement)
      if (user.points && otherUser.points) {
        const pointsRatio = Math.min(user.points, otherUser.points) / Math.max(user.points, otherUser.points);
        resonanceScore += pointsRatio * 10;
      }
      
      // Add quantum randomness to simulate synchronistic connections (+/- 10)
      resonanceScore += Math.round((Math.random() * 20) - 10);
      
      // Normalize score
      resonanceScore = Math.min(Math.round(resonanceScore), 100);
      
      return {
        userId: otherUser.id,
        username: otherUser.displayName || otherUser.username || `User ${otherUser.id}`,
        resonanceScore,
        sharedInterests
      };
    })
    .sort((a, b) => b.resonanceScore - a.resonanceScore)
    .slice(0, 3);
}