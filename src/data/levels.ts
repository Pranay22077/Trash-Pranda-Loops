export interface LevelConfig {
  number: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'insane';
  timeLimit: number; // seconds
  snacksRequired: number;
  npcCount: number;
  npcSpeed: number; // multiplier
  detectionRange: number; // multiplier
  description: string;
}

export const LEVELS: LevelConfig[] = [
  // Easy Levels (1-4)
  {
    number: 1,
    name: 'Kitchen Basics',
    difficulty: 'easy',
    timeLimit: 120,
    snacksRequired: 5,
    npcCount: 1,
    npcSpeed: 0.8,
    detectionRange: 0.8,
    description: 'Learn the basics. One slow chef, plenty of time.',
  },
  {
    number: 2,
    name: 'Night Shift',
    difficulty: 'easy',
    timeLimit: 100,
    snacksRequired: 6,
    npcCount: 2,
    npcSpeed: 0.9,
    detectionRange: 0.9,
    description: 'Two chefs on duty. Stay in the shadows.',
  },
  {
    number: 3,
    name: 'Morning Prep',
    difficulty: 'easy',
    timeLimit: 90,
    snacksRequired: 7,
    npcCount: 2,
    npcSpeed: 1.0,
    detectionRange: 1.0,
    description: 'Chefs are getting faster. Time is ticking.',
  },
  {
    number: 4,
    name: 'Lunch Rush Begins',
    difficulty: 'easy',
    timeLimit: 80,
    snacksRequired: 8,
    npcCount: 3,
    npcSpeed: 1.0,
    detectionRange: 1.0,
    description: 'Three chefs now. The kitchen is busier.',
  },

  // Medium Levels (5-8)
  {
    number: 5,
    name: 'Dinner Service',
    difficulty: 'medium',
    timeLimit: 75,
    snacksRequired: 9,
    npcCount: 3,
    npcSpeed: 1.1,
    detectionRange: 1.1,
    description: 'Chefs are alert. Move carefully.',
  },
  {
    number: 6,
    name: 'Weekend Crowd',
    difficulty: 'medium',
    timeLimit: 70,
    snacksRequired: 10,
    npcCount: 4,
    npcSpeed: 1.2,
    detectionRange: 1.1,
    description: 'Four chefs working fast. Timing is everything.',
  },
  {
    number: 7,
    name: 'Security Upgrade',
    difficulty: 'medium',
    timeLimit: 65,
    snacksRequired: 11,
    npcCount: 4,
    npcSpeed: 1.2,
    detectionRange: 1.2,
    description: 'Enhanced detection systems. Stay sharp.',
  },
  {
    number: 8,
    name: 'Holiday Prep',
    difficulty: 'medium',
    timeLimit: 60,
    snacksRequired: 12,
    npcCount: 5,
    npcSpeed: 1.3,
    detectionRange: 1.2,
    description: 'Five chefs preparing for the holidays.',
  },

  // Hard Levels (9-12)
  {
    number: 9,
    name: 'Chef\'s Special',
    difficulty: 'hard',
    timeLimit: 55,
    snacksRequired: 13,
    npcCount: 5,
    npcSpeed: 1.4,
    detectionRange: 1.3,
    description: 'Head chef is watching. One mistake and you\'re caught.',
  },
  {
    number: 10,
    name: 'Banquet Night',
    difficulty: 'hard',
    timeLimit: 50,
    snacksRequired: 14,
    npcCount: 6,
    npcSpeed: 1.4,
    detectionRange: 1.3,
    description: 'Six chefs for a big event. Chaos is your friend.',
  },
  {
    number: 11,
    name: 'Stealth Master',
    difficulty: 'hard',
    timeLimit: 48,
    snacksRequired: 15,
    npcCount: 6,
    npcSpeed: 1.5,
    detectionRange: 1.4,
    description: 'Perfect stealth required. No room for error.',
  },
  {
    number: 12,
    name: 'Time Trial',
    difficulty: 'hard',
    timeLimit: 45,
    snacksRequired: 16,
    npcCount: 7,
    npcSpeed: 1.5,
    detectionRange: 1.4,
    description: 'Seven chefs, limited time. Can you handle it?',
  },

  // Expert Levels (13-16)
  {
    number: 13,
    name: 'Michelin Inspection',
    difficulty: 'expert',
    timeLimit: 42,
    snacksRequired: 17,
    npcCount: 7,
    npcSpeed: 1.6,
    detectionRange: 1.5,
    description: 'Inspectors are here. Everyone is on high alert.',
  },
  {
    number: 14,
    name: 'Celebrity Chef Visit',
    difficulty: 'expert',
    timeLimit: 40,
    snacksRequired: 18,
    npcCount: 8,
    npcSpeed: 1.7,
    detectionRange: 1.5,
    description: 'Eight chefs showing off. Use their pride against them.',
  },
  {
    number: 15,
    name: 'Grand Opening',
    difficulty: 'expert',
    timeLimit: 38,
    snacksRequired: 19,
    npcCount: 8,
    npcSpeed: 1.7,
    detectionRange: 1.6,
    description: 'The biggest night. Maximum security.',
  },
  {
    number: 16,
    name: 'Master Thief Challenge',
    difficulty: 'expert',
    timeLimit: 35,
    snacksRequired: 20,
    npcCount: 9,
    npcSpeed: 1.8,
    detectionRange: 1.6,
    description: 'Nine chefs. You\'re a legend if you succeed.',
  },

  // Master Levels (17-18)
  {
    number: 17,
    name: 'Culinary Olympics',
    difficulty: 'master',
    timeLimit: 33,
    snacksRequired: 22,
    npcCount: 10,
    npcSpeed: 1.9,
    detectionRange: 1.7,
    description: 'Ten world-class chefs. This is insanity.',
  },
  {
    number: 18,
    name: 'The Gauntlet',
    difficulty: 'master',
    timeLimit: 30,
    snacksRequired: 24,
    npcCount: 11,
    npcSpeed: 2.0,
    detectionRange: 1.8,
    description: 'Eleven chefs moving at lightning speed.',
  },

  // Insane Levels (19-20)
  {
    number: 19,
    name: 'Nightmare Kitchen',
    difficulty: 'insane',
    timeLimit: 28,
    snacksRequired: 26,
    npcCount: 12,
    npcSpeed: 2.2,
    detectionRange: 1.9,
    description: 'Twelve chefs. They see everything. Good luck.',
  },
  {
    number: 20,
    name: 'Legendary Heist',
    difficulty: 'insane',
    timeLimit: 25,
    snacksRequired: 30,
    npcCount: 15,
    npcSpeed: 2.5,
    detectionRange: 2.0,
    description: 'The ultimate challenge. Fifteen chefs. 25 seconds. 30 snacks. Are you the legend?',
  },
];

export function getLevel(levelNumber: number): LevelConfig | undefined {
  return LEVELS.find(l => l.number === levelNumber);
}

export function getAllLevels(): LevelConfig[] {
  return LEVELS;
}
