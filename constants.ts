import { Creator, NikeCreator, ContentType } from './types';

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