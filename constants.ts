import { Creator, NikeCreator, EnrichedCreator, ContentType } from './types';

// Nike Demo Creators - Sorted by relevance score for Nike brand search
export const NIKE_CREATORS: NikeCreator[] = [
  {
    id: 'nike1',
    name: 'Marcus Johnson',
    handle: '@marcusj_hoops',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike1.jpeg',
    gender: 'Male',
    location: 'Los Angeles',
    platform: 'TikTok',
    followers: 1250000,
    engagementRate: 8.7,
    topics: ['Basketball', 'Sneakers', 'Streetwear'],
    contentType: 'Reel',
    relevanceScore: 98,
    matches: [
      {
        type: 'visual',
        confidence: 96,
        timestamp: '0:04',
        excerpt: 'Wearing Nike Air Jordan 1 "Chicago" in opening shot',
        context: 'Product prominently featured throughout video'
      },
      {
        type: 'audio',
        confidence: 92,
        timestamp: '0:23',
        excerpt: '"These Jordans hit different on the court, Nike really outdid themselves"',
        context: 'Organic brand mention during product review'
      },
      {
        type: 'personalNote',
        confidence: 88,
        excerpt: 'Nike Ambassador - Previous campaign with Jordan Brand Q3 2024',
        context: 'Internal CRM note'
      }
    ],
    nikeAffinity: {
      partnership: 'Jordan Brand Ambassador',
      mentionFrequency: 'high',
      brandAlignment: ['Basketball', 'Streetwear', 'Gen-Z Culture']
    }
  },
  {
    id: 'nike2',
    name: 'Alicia Chen',
    handle: '@alicia_runs',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike2.jpeg',
    gender: 'Female',
    location: 'New York',
    platform: 'YouTube',
    followers: 890000,
    engagementRate: 6.4,
    topics: ['Marathon', 'Running', 'Fitness'],
    contentType: 'Video',
    relevanceScore: 95,
    matches: [
      {
        type: 'visual',
        confidence: 94,
        timestamp: '2:15',
        excerpt: 'Nike Alphafly 3 featured in marathon training montage',
        context: 'Product visible for 45+ seconds'
      },
      {
        type: 'caption',
        confidence: 91,
        excerpt: 'Training for NYC Marathon in my @Nike Alphafly 3s 🏃‍♀️ #NikeRunning #JustDoIt',
        context: 'Pinned comment with 12k likes'
      },
      {
        type: 'audio',
        confidence: 87,
        timestamp: '5:30',
        excerpt: '"The ZoomX foam in these is a game changer for long distance"',
        context: 'Technical product discussion'
      }
    ],
    nikeAffinity: {
      partnership: 'Nike Run Club Member',
      mentionFrequency: 'high',
      brandAlignment: ['Endurance Sports', "Women's Fitness", 'Marathon Community']
    }
  },
  {
    id: 'nike3',
    name: 'Jake Williams',
    handle: '@jakewilliams_fit',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike3.jpeg',
    gender: 'Male',
    location: 'Miami',
    platform: 'Instagram',
    followers: 720000,
    engagementRate: 5.8,
    topics: ['CrossFit', 'Training', 'Fitness'],
    contentType: 'Post',
    relevanceScore: 91,
    matches: [
      {
        type: 'visual',
        confidence: 93,
        timestamp: '0:12',
        excerpt: 'Nike Metcon 9 prominently shown during workout',
        context: 'Full outfit is Nike Training'
      },
      {
        type: 'caption',
        confidence: 89,
        excerpt: 'New PR day 💪 Metcon 9s keeping me grounded. @niketraining',
        context: 'Post reached 180k impressions'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'medium',
      brandAlignment: ['Functional Fitness', 'Training', 'Male 25-34']
    }
  },
  {
    id: 'nike4',
    name: 'Destiny Moore',
    handle: '@destinymoore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike4.jpeg',
    gender: 'Female',
    location: 'Atlanta',
    platform: 'TikTok',
    followers: 2100000,
    engagementRate: 9.2,
    topics: ['Lifestyle', 'Fashion', 'Wellness'],
    contentType: 'Reel',
    relevanceScore: 88,
    matches: [
      {
        type: 'caption',
        confidence: 86,
        excerpt: 'Casual fit check 🖤 AF1s never miss #OOTD #NikeAirForce1',
        context: 'Viral video with 3.2M views'
      },
      {
        type: 'personalNote',
        confidence: 84,
        excerpt: 'Strong lifestyle integration - Nike appears in 30% of her content organically',
        context: 'Analyst observation from content audit'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'medium',
      brandAlignment: ['Women\'s Lifestyle', 'Gen-Z Fashion', 'Urban Style']
    }
  },
  {
    id: 'nike5',
    name: 'Carlos Rivera',
    handle: '@carlosrivera_futbol',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike5.jpeg',
    gender: 'Male',
    location: 'Houston',
    platform: 'YouTube',
    followers: 560000,
    engagementRate: 7.1,
    topics: ['Soccer', 'Football', 'Sports'],
    contentType: 'Video',
    relevanceScore: 86,
    matches: [
      {
        type: 'visual',
        confidence: 91,
        timestamp: '1:45',
        excerpt: 'Nike Mercurial Superfly cleats featured in skills tutorial',
        context: 'Product demo in training content'
      },
      {
        type: 'audio',
        confidence: 85,
        timestamp: '3:20',
        excerpt: '"The touch on these Mercurials is insane, perfect for quick cuts"',
        context: 'Product feature explanation'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'high',
      brandAlignment: ['Soccer', 'Hispanic Audience', 'Youth Sports']
    }
  },
  {
    id: 'nike6',
    name: 'Sneaker_Archive',
    handle: '@sneaker_archive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike6.jpeg',
    gender: 'Male',
    location: 'Chicago',
    platform: 'Instagram',
    followers: 980000,
    engagementRate: 11.3,
    topics: ['Sneakers', 'Collection', 'Streetwear'],
    contentType: 'Post',
    relevanceScore: 94,
    matches: [
      {
        type: 'visual',
        confidence: 98,
        timestamp: '0:08',
        excerpt: 'Entire wall display of Nike Dunks, Jordans, and Air Max',
        context: '200+ Nike pairs visible in collection showcase'
      },
      {
        type: 'caption',
        confidence: 95,
        excerpt: 'The holy grail finally arrived 🔥 1985 OG Jordan 1 Bred #NikeHistory #Sneakerhead',
        context: 'Engagement rate 15% on Nike content'
      },
      {
        type: 'personalNote',
        confidence: 92,
        excerpt: 'Top-tier Nike historian. Authentic collector with deep brand knowledge.',
        context: 'Community influence score: 9.4/10'
      }
    ],
    nikeAffinity: {
      partnership: 'Nike SNKRS Insider',
      mentionFrequency: 'high',
      brandAlignment: ['Sneaker Culture', 'Collectors', 'Brand Heritage']
    }
  },
  {
    id: 'nike7',
    name: 'Tanya Okonkwo',
    handle: '@tanyafitjourney',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike7.jpeg',
    gender: 'Female',
    location: 'London',
    platform: 'TikTok',
    followers: 1450000,
    engagementRate: 8.9,
    topics: ['Fitness', 'Transformation', 'Wellness'],
    contentType: 'Story',
    relevanceScore: 85,
    matches: [
      {
        type: 'audio',
        confidence: 88,
        timestamp: '0:45',
        excerpt: '"Started this journey in my Nike Free Runs, now I\'m competing in them"',
        context: 'Emotional brand mention in transformation story'
      },
      {
        type: 'visual',
        confidence: 84,
        timestamp: '1:20',
        excerpt: 'Nike Training Club app visible on phone screen',
        context: 'Organic app integration'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'medium',
      brandAlignment: ['Women\'s Fitness', 'Transformation Stories', 'UK Market']
    }
  },
  {
    id: 'nike8',
    name: 'Zach Peters',
    handle: '@zachstreetwear',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike8.jpeg',
    gender: 'Male',
    location: 'Portland',
    platform: 'YouTube',
    followers: 340000,
    engagementRate: 6.8,
    topics: ['Streetwear', 'Fashion', 'Sneakers'],
    contentType: 'Video',
    relevanceScore: 82,
    matches: [
      {
        type: 'visual',
        confidence: 87,
        timestamp: '4:15',
        excerpt: 'Nike SB Dunk Low styling in streetwear haul video',
        context: 'Multiple Nike pieces in outfit showcase'
      },
      {
        type: 'caption',
        confidence: 83,
        excerpt: 'Portland kids know Nike is home 🏠 #NikeSB #PDX',
        context: 'Local brand connection narrative'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'medium',
      brandAlignment: ['Skate Culture', 'Gen-Z Streetwear', 'Pacific Northwest']
    }
  },
  {
    id: 'nike9',
    name: 'Maya Patel',
    handle: '@mayapatel_hoops',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    thumbnail: '/generated/nike9.jpeg',
    gender: 'Female',
    location: 'Phoenix',
    platform: 'Instagram',
    followers: 420000,
    engagementRate: 7.5,
    topics: ['Basketball', 'Women\'s Sports', 'Training'],
    contentType: 'Paid',
    relevanceScore: 90,
    matches: [
      {
        type: 'visual',
        confidence: 94,
        timestamp: '0:30',
        excerpt: 'Nike Sabrina 1 signature shoes featured in practice footage',
        context: 'Consistent Nike Basketball gear across content'
      },
      {
        type: 'audio',
        confidence: 89,
        timestamp: '2:10',
        excerpt: '"Love what Nike is doing for women\'s basketball right now"',
        context: 'Advocacy for brand\'s women\'s initiatives'
      },
      {
        type: 'personalNote',
        confidence: 91,
        excerpt: 'Rising star in women\'s basketball content. Strong alignment with Nike W initiative.',
        context: 'Priority prospect for women\'s basketball campaign'
      }
    ],
    nikeAffinity: {
      mentionFrequency: 'high',
      brandAlignment: ['Women\'s Basketball', 'Female Athletes', 'Sports Empowerment']
    }
  }
];

// Coffee Demo Creators - Sorted by relevance score for Coffee brand search
export const COFFEE_CREATORS: EnrichedCreator[] = [
  {
    id: 'coffee1',
    name: 'Barista Ben',
    handle: '@baristaben',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=700&fit=crop',
    gender: 'Male',
    location: 'Seattle',
    platform: 'YouTube',
    followers: 890000,
    engagementRate: 7.2,
    topics: ['Espresso', 'Latte Art', 'Coffee'],
    contentType: 'Video',
    relevanceScore: 97,
    matches: [
      {
        type: 'visual',
        confidence: 96,
        timestamp: '0:15',
        excerpt: 'Demonstrating perfect rosetta latte art technique',
        context: 'Tutorial content with high production value'
      },
      {
        type: 'audio',
        confidence: 94,
        timestamp: '2:30',
        excerpt: '"The key to great espresso is understanding your grind size and extraction time"',
        context: 'Educational coffee content'
      },
      {
        type: 'personalNote',
        confidence: 90,
        excerpt: 'Former World Latte Art Championship competitor, authentic expertise',
        context: 'Internal CRM note'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      partnership: 'La Marzocco Ambassador',
      mentionFrequency: 'high',
      brandAlignment: ['Specialty Coffee', 'Barista Culture', 'Coffee Education']
    }
  },
  {
    id: 'coffee2',
    name: 'Cold Brew Carly',
    handle: '@coldbrewcarly',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=700&fit=crop',
    gender: 'Female',
    location: 'Austin',
    platform: 'TikTok',
    followers: 1450000,
    engagementRate: 9.8,
    topics: ['Cold Brew', 'Coffee Recipes', 'Summer Drinks'],
    contentType: 'Reel',
    relevanceScore: 95,
    matches: [
      {
        type: 'visual',
        confidence: 95,
        timestamp: '0:03',
        excerpt: 'Pouring signature cold brew over ice with slow-mo effect',
        context: 'Aesthetic content with 2.1M views'
      },
      {
        type: 'caption',
        confidence: 92,
        excerpt: 'My secret cold brew ratio for the smoothest coffee ever ☕️ #ColdBrew #CoffeeTok',
        context: 'Viral recipe post'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      mentionFrequency: 'high',
      brandAlignment: ['Gen-Z Coffee Culture', 'Recipe Content', 'Iced Coffee Trends']
    }
  },
  {
    id: 'coffee3',
    name: 'Matcha Maya',
    handle: '@matchamaya',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=700&fit=crop',
    gender: 'Female',
    location: 'Los Angeles',
    platform: 'Instagram',
    followers: 720000,
    engagementRate: 6.5,
    topics: ['Matcha', 'Tea', 'Wellness'],
    contentType: 'Post',
    relevanceScore: 88,
    matches: [
      {
        type: 'visual',
        confidence: 91,
        timestamp: '0:08',
        excerpt: 'Matcha latte art in ceramic cup with natural lighting',
        context: 'Aesthetic wellness content'
      },
      {
        type: 'caption',
        confidence: 87,
        excerpt: 'Swapped my afternoon coffee for matcha and never looked back 🍵 #MatchaLatte',
        context: 'Lifestyle integration post'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      mentionFrequency: 'medium',
      brandAlignment: ['Wellness', 'Tea Culture', 'Mindful Drinking']
    }
  },
  {
    id: 'coffee4',
    name: 'Brew Master Mike',
    handle: '@brewmastermike',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?w=400&h=700&fit=crop',
    gender: 'Male',
    location: 'Portland',
    platform: 'YouTube',
    followers: 560000,
    engagementRate: 8.1,
    topics: ['Home Brewing', 'Pour Over', 'Coffee Gear'],
    contentType: 'Video',
    relevanceScore: 94,
    matches: [
      {
        type: 'visual',
        confidence: 94,
        timestamp: '1:20',
        excerpt: 'Side-by-side comparison of V60 vs Chemex pour over methods',
        context: 'Educational gear review'
      },
      {
        type: 'audio',
        confidence: 91,
        timestamp: '4:15',
        excerpt: '"The bloom phase is where all the magic happens - don\'t rush it"',
        context: 'Technical brewing explanation'
      },
      {
        type: 'personalNote',
        confidence: 88,
        excerpt: 'Go-to resource for home brewing education, highly trusted by coffee community',
        context: 'Analyst observation'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      partnership: 'Fellow Products Partner',
      mentionFrequency: 'high',
      brandAlignment: ['Home Brewing', 'Coffee Gear', 'Education']
    }
  },
  {
    id: 'coffee5',
    name: 'Cafe Wanderer',
    handle: '@cafewanderer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=700&fit=crop',
    gender: 'Female',
    location: 'Brooklyn',
    platform: 'Instagram',
    followers: 340000,
    engagementRate: 5.9,
    topics: ['Cafe Culture', 'Travel', 'Coffee Shops'],
    contentType: 'Post',
    relevanceScore: 86,
    matches: [
      {
        type: 'visual',
        confidence: 89,
        timestamp: '0:05',
        excerpt: 'Cozy corner of specialty coffee shop with vintage decor',
        context: 'Aesthetic cafe discovery content'
      },
      {
        type: 'caption',
        confidence: 85,
        excerpt: 'Found the most underrated coffee shop in Brooklyn 📍 #CafeHopping #CoffeeTravel',
        context: 'Location discovery post with high saves'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      mentionFrequency: 'medium',
      brandAlignment: ['Cafe Discovery', 'Urban Lifestyle', 'Coffee Tourism']
    }
  },
  {
    id: 'coffee6',
    name: 'Espresso Eddie',
    handle: '@espressoeddie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=700&fit=crop',
    gender: 'Male',
    location: 'Chicago',
    platform: 'TikTok',
    followers: 980000,
    engagementRate: 11.2,
    topics: ['Espresso', 'Cafe Reviews', 'Coffee Humor'],
    contentType: 'Reel',
    relevanceScore: 92,
    matches: [
      {
        type: 'visual',
        confidence: 93,
        timestamp: '0:02',
        excerpt: 'POV: reviewing espresso shots at different price points',
        context: 'Entertaining comparison content'
      },
      {
        type: 'audio',
        confidence: 90,
        timestamp: '0:18',
        excerpt: '"This $2 espresso hits different than the $8 one and I need to talk about it"',
        context: 'Authentic review commentary'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      mentionFrequency: 'high',
      brandAlignment: ['Coffee Reviews', 'Entertainment', 'Authentic Voice']
    }
  },
  {
    id: 'coffee7',
    name: 'Morning Ritual Rachel',
    handle: '@morningritualrachel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=700&fit=crop',
    gender: 'Female',
    location: 'Denver',
    platform: 'Instagram',
    followers: 420000,
    engagementRate: 7.8,
    topics: ['Morning Routine', 'Lifestyle', 'Wellness'],
    contentType: 'Story',
    relevanceScore: 84,
    matches: [
      {
        type: 'visual',
        confidence: 88,
        timestamp: '0:12',
        excerpt: 'Sunrise coffee moment on mountain-view balcony',
        context: 'Aspirational lifestyle content'
      },
      {
        type: 'caption',
        confidence: 84,
        excerpt: 'My 5AM coffee ritual is non-negotiable ☀️ #MorningRoutine #CoffeeLover',
        context: 'Routine content with high engagement'
      },
      {
        type: 'personalNote',
        confidence: 82,
        excerpt: 'Strong lifestyle integration - coffee appears in 45% of morning content organically',
        context: 'Content audit observation'
      }
    ],
    brandAffinity: {
      brand: 'Coffee',
      mentionFrequency: 'medium',
      brandAlignment: ['Lifestyle', 'Morning Routines', 'Wellness Integration']
    }
  }
];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    handle: '@arivera',
    avatar: 'https://picsum.photos/seed/c1/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb1/400/600',
    gender: 'Male',
    location: 'New York',
    platform: 'Instagram',
    followers: 120000,
    engagementRate: 4.5,
    topics: ['Coffee', 'Lifestyle', 'Fashion']
  },
  {
    id: 'c2',
    name: 'Jordan Lee',
    handle: '@jlee_hoops',
    avatar: 'https://picsum.photos/seed/c2/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb2/400/600',
    gender: 'Male',
    location: 'Los Angeles',
    platform: 'TikTok',
    followers: 850000,
    engagementRate: 8.2,
    topics: ['Basketball', 'Sports', 'Fitness']
  },
  {
    id: 'c3',
    name: 'Sarah Jenkins',
    handle: '@sarahj_brew',
    avatar: 'https://picsum.photos/seed/c3/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb3/400/600',
    gender: 'Female',
    location: 'New York',
    platform: 'YouTube',
    followers: 45000,
    engagementRate: 5.1,
    topics: ['Coffee', 'Vlog', 'Travel']
  },
  {
    id: 'c4',
    name: 'Mike Chen',
    handle: '@mikec_dunks',
    avatar: 'https://picsum.photos/seed/c4/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb4/400/600',
    gender: 'Male',
    location: 'Chicago',
    platform: 'TikTok',
    followers: 200000,
    engagementRate: 6.7,
    topics: ['Basketball', 'Fitness']
  },
  {
    id: 'c5',
    name: 'Emma Wilson',
    handle: '@emstyle',
    avatar: 'https://picsum.photos/seed/c5/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb5/400/600',
    gender: 'Female',
    location: 'London',
    platform: 'Instagram',
    followers: 500000,
    engagementRate: 3.2,
    topics: ['Fashion', 'Travel']
  },
  {
    id: 'c6',
    name: 'Chris Paulson',
    handle: '@cp3_fan',
    avatar: 'https://picsum.photos/seed/c6/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb6/400/600',
    gender: 'Male',
    location: 'New York',
    platform: 'YouTube',
    followers: 15000,
    engagementRate: 12.5,
    topics: ['Basketball', 'Analysis']
  },
  {
    id: 'c7',
    name: 'Jessica Day',
    handle: '@jessday',
    avatar: 'https://picsum.photos/seed/c7/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb7/400/600',
    gender: 'Female',
    location: 'New York',
    platform: 'Instagram',
    followers: 90000,
    engagementRate: 4.0,
    topics: ['Coffee', 'Art', 'Design']
  },
  {
    id: 'c8',
    name: 'Davon Lewis',
    handle: '@dlewis',
    avatar: 'https://picsum.photos/seed/c8/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb8/400/600',
    gender: 'Male',
    location: 'Miami',
    platform: 'TikTok',
    followers: 300000,
    engagementRate: 7.1,
    topics: ['Music', 'Lifestyle']
  },
  {
    id: 'c9',
    name: 'Lily Evans',
    handle: '@lily_e',
    avatar: 'https://picsum.photos/seed/c9/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb9/400/600',
    gender: 'Female',
    location: 'Los Angeles',
    platform: 'Instagram',
    followers: 1200000,
    engagementRate: 2.1,
    topics: ['Beauty', 'Fashion']
  },
  {
    id: 'c10',
    name: 'Tom Hardy',
    handle: '@tomh_builds',
    avatar: 'https://picsum.photos/seed/c10/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb10/400/600',
    gender: 'Male',
    location: 'Austin',
    platform: 'YouTube',
    followers: 67000,
    engagementRate: 5.5,
    topics: ['DIY', 'Tech']
  },
  {
    id: 'c11',
    name: 'Coffee Bros',
    handle: '@coffeebros',
    avatar: 'https://picsum.photos/seed/c11/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb11/400/600',
    gender: 'Male',
    location: 'Seattle',
    platform: 'TikTok',
    followers: 45000,
    engagementRate: 9.0,
    topics: ['Coffee', 'Business']
  },
  {
    id: 'c12',
    name: 'Street Hoops',
    handle: '@streethoops_ny',
    avatar: 'https://picsum.photos/seed/c12/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb12/400/600',
    gender: 'Male',
    location: 'New York',
    platform: 'YouTube',
    followers: 20000,
    engagementRate: 15.0,
    topics: ['Basketball', 'Street Culture']
  },
  {
    id: 'c13',
    name: 'Anna K',
    handle: '@annak_nyc',
    avatar: 'https://picsum.photos/seed/c13/50/50',
    thumbnail: 'https://picsum.photos/seed/thumb13/400/600',
    gender: 'Female',
    location: 'New York',
    platform: 'Instagram',
    followers: 8000,
    engagementRate: 6.0,
    topics: ['Photography', 'Coffee', 'New York']
  }
];