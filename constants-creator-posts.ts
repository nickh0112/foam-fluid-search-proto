import { CreatorAccount, CreatorPost, ScoreBreakdown } from './types';

const EMPTY_BREAKDOWN: ScoreBreakdown = {
  captionPoints: 0, audioPoints: 0, visualPoints: 0,
  reinforcementBonus: 0, baseTotal: 0, normalizedScore: 0,
  signalCount: 0, dominantSignal: null, signalDetails: [],
};

export const MARCUS_ACCOUNT: CreatorAccount = {
  id: 'marcus-rivera',
  name: 'Marcus Rivera',
  handle: '@marcusrivera',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  platform: 'Instagram',
  followers: 245000,
  engagementRate: 4.8,
  bio: 'Fitness. Lifestyle. LA. Nike Running Club member.',
  posts: [
    // ============================================
    // NIKE-HEAVY POSTS (4) — Caption + Audio + Visual
    // ============================================
    {
      id: 'mp-01',
      thumbnail: '/generated/marcus/post-01.jpeg',
      contentType: 'Reel',
      caption: 'My honest Nike Pegasus 41 review after 200 miles. Is it worth the hype? Spoiler: absolutely. The React foam is next level and these are my new daily trainers. #Nike #Pegasus41 #RunningReview #NikeRunning',
      postedAt: '2026-02-08T10:30:00Z',
      stats: { views: 187000, likes: 14200, comments: 892, shares: 2100 },
      signals: [
        { type: 'caption', confidence: 96, excerpt: 'Nike Pegasus 41 review...React foam is next level...#Nike #NikeRunning', context: 'Multiple Nike mentions in caption', frequency: 3, density: 'prominent' },
        { type: 'audio', confidence: 93, timestamp: '0:12', excerpt: '"The Nike Pegasus 41 has been my daily trainer for two months and honestly, Nike nailed the cushioning"', context: 'Detailed product review', frequency: 2, density: 'prominent' },
        { type: 'visual', confidence: 95, timestamp: '0:04', excerpt: 'Nike Pegasus 41 close-up, Nike swoosh prominently visible throughout', context: 'Product featured for 80% of video', frequency: 2, density: 'prominent' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-02',
      thumbnail: '/generated/marcus/post-02.jpeg',
      contentType: 'Video',
      caption: 'NIKE ATHLETE CAMP 2026! Got invited to train with Nike pros for 3 days. This was insane. Full vlog dropping Sunday. #NikeTraining #AthleteCamp #BTS',
      postedAt: '2026-02-05T14:00:00Z',
      stats: { views: 245000, likes: 22100, comments: 1340, shares: 3800 },
      signals: [
        { type: 'caption', confidence: 94, excerpt: 'NIKE ATHLETE CAMP 2026! Train with Nike pros...#NikeTraining', context: 'Nike is central theme', frequency: 2, density: 'prominent' },
        { type: 'audio', confidence: 95, timestamp: '1:20', excerpt: '"Nike flew us out to their campus, the Nike training facility is unreal, everything here is Nike from floor to ceiling"', context: 'Immersive brand experience', frequency: 3, density: 'prominent' },
        { type: 'visual', confidence: 97, timestamp: '0:08', excerpt: 'Nike campus, Nike branding on walls, Nike gear on all athletes, Nike swoosh banners', context: 'Nike environment throughout', frequency: 4, density: 'prominent' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-03',
      thumbnail: '/generated/marcus/post-03.jpeg',
      contentType: 'Reel',
      caption: 'NRC morning 5K at Griffith Park. Started the day right with the Nike Running Club crew. Love this community. #NRC #NikeRunClub #MorningRun #LA',
      postedAt: '2026-02-01T07:15:00Z',
      stats: { views: 98000, likes: 8900, comments: 445, shares: 1200 },
      signals: [
        { type: 'caption', confidence: 91, excerpt: 'NRC morning 5K...Nike Running Club crew...#NRC #NikeRunClub', context: 'Nike club membership', frequency: 2, density: 'moderate' },
        { type: 'audio', confidence: 87, timestamp: '0:30', excerpt: '"Shoutout to the Nike Run Club for organizing this, always a good time"', context: 'Organic club mention', frequency: 1, density: 'moderate' },
        { type: 'visual', confidence: 92, timestamp: '0:05', excerpt: 'Nike Running Club banner visible, wearing Nike Vaporfly', context: 'NRC branded event', frequency: 2, density: 'prominent' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-04',
      thumbnail: '/generated/marcus/post-04.jpeg',
      contentType: 'Reel',
      caption: 'UNBOXING the new Nike Vomero 18! Nike sent these over and I have thoughts. Full review coming but first impressions: Nike went crazy on the cushion. The Nike ZoomX midsole is thick. #Nike #Vomero18 #Unboxing #NikeRunning',
      postedAt: '2026-01-28T16:45:00Z',
      stats: { views: 156000, likes: 11800, comments: 723, shares: 1900 },
      signals: [
        { type: 'caption', confidence: 97, excerpt: 'Nike Vomero 18! Nike sent these...Nike went crazy...Nike ZoomX...#Nike #NikeRunning', context: '4 Nike mentions in caption', frequency: 4, density: 'prominent' },
        { type: 'audio', confidence: 92, timestamp: '0:15', excerpt: '"Nike just dropped the Vomero 18 and these are plush, the Nike ZoomX foam is incredible"', context: 'Product first impressions', frequency: 2, density: 'prominent' },
        { type: 'visual', confidence: 96, timestamp: '0:03', excerpt: 'Nike box opening, Nike Vomero 18 close-up, Nike swoosh details', context: 'Unboxing format showcases product', frequency: 3, density: 'prominent' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },

    // ============================================
    // NIKE-PRESENT POSTS (4) — Visual + maybe Audio/Caption
    // ============================================
    {
      id: 'mp-05',
      thumbnail: '/generated/marcus/post-05.jpeg',
      contentType: 'Reel',
      caption: 'Push day at Muscle Beach. Chest and shoulders feeling strong today. The grind never stops. #MuscleBeach #PushDay #ChestDay #LAFitness',
      postedAt: '2026-01-25T11:00:00Z',
      stats: { views: 72000, likes: 6100, comments: 312, shares: 580 },
      signals: [
        { type: 'visual', confidence: 82, timestamp: '0:06', excerpt: 'Wearing Nike Metcon shoes and Nike Dri-FIT shirt visible during workout', context: 'Nike gear worn but not discussed', frequency: 2, density: 'moderate' },
        { type: 'audio', confidence: 68, timestamp: '1:45', excerpt: '"These Metcons grip so well for heavy lifts"', context: 'Brief product mention', frequency: 1, density: 'passing' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-06',
      thumbnail: '/generated/marcus/post-06.jpeg',
      contentType: 'Post',
      caption: 'Morning run through Griffith Park. 8 miles before the city wakes up. This view never gets old. #GriffithPark #MorningRun #RunLA #TrailRunning',
      postedAt: '2026-01-22T06:30:00Z',
      stats: { views: 54000, likes: 5200, comments: 198, shares: 420 },
      signals: [
        { type: 'visual', confidence: 85, timestamp: '0:02', excerpt: 'Nike Pegasus shoes and Nike running shorts visible in multiple shots', context: 'Full Nike running outfit', frequency: 3, density: 'moderate' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-07',
      thumbnail: '/generated/marcus/post-07.jpeg',
      contentType: 'Reel',
      caption: 'Pickup basketball at Venice Beach. Got absolutely cooked in the first game but came back strong. Who wants to run next weekend? #VeniceBeach #Pickup #Basketball #Hoops',
      postedAt: '2026-01-18T17:20:00Z',
      stats: { views: 89000, likes: 7800, comments: 567, shares: 890 },
      signals: [
        { type: 'visual', confidence: 70, timestamp: '0:20', excerpt: 'Nike basketball shoes visible during play', context: 'Quick glimpses during game footage', frequency: 1, density: 'passing' },
        { type: 'audio', confidence: 62, timestamp: '2:10', excerpt: '"Let me switch to my Nikes for the next game"', context: 'Casual mention during game', frequency: 1, density: 'passing' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-08',
      thumbnail: '/generated/marcus/post-08.jpeg',
      contentType: 'Post',
      caption: 'Weekly sneaker rotation. Mixing Nike, New Balance, and ASICS depending on the workout. The Pegasus for easy runs, 1080 for long runs, Gel-Kayano for recovery. What\'s your rotation? #SneakerRotation #RunningShoes #GearCheck',
      postedAt: '2026-01-15T12:00:00Z',
      stats: { views: 67000, likes: 5900, comments: 412, shares: 680 },
      signals: [
        { type: 'visual', confidence: 80, timestamp: '0:00', excerpt: 'Nike Pegasus displayed alongside other brands', context: 'Multi-brand showcase, Nike is 1 of 3', frequency: 2, density: 'moderate' },
        { type: 'caption', confidence: 78, excerpt: 'Mixing Nike...The Pegasus for easy runs...#SneakerRotation', context: 'Nike mentioned as one of several brands', frequency: 1, density: 'moderate' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },

    // ============================================
    // FITNESS/SPORTS POSTS (5) — Minimal or no Nike signals
    // ============================================
    {
      id: 'mp-09',
      thumbnail: '/generated/marcus/post-09.jpeg',
      contentType: 'Reel',
      caption: 'LEG DAY PR! 405 squat, 315 for reps. Been chasing this number for months. Proof that consistency pays off. #LegDay #SquatPR #405Club #NeverSkipLegDay',
      postedAt: '2026-01-12T09:45:00Z',
      stats: { views: 112000, likes: 9800, comments: 678, shares: 1100 },
      signals: [
        { type: 'visual', confidence: 55, timestamp: '0:08', excerpt: 'Nike Metcon shoes visible during squat', context: 'Shoes briefly visible, not focus of content', frequency: 1, density: 'passing' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-10',
      thumbnail: '/generated/marcus/post-10.jpeg',
      contentType: 'Reel',
      caption: 'Full body HIIT workout you can do anywhere. No equipment needed, just you and 30 minutes. Save this for later. #HIIT #FullBody #HomeWorkout #NoEquipment',
      postedAt: '2026-01-09T08:00:00Z',
      stats: { views: 134000, likes: 11200, comments: 534, shares: 2300 },
      signals: [
        { type: 'visual', confidence: 50, timestamp: '0:22', excerpt: 'Nike training shirt visible', context: 'Generic athletic wear, brand incidental', frequency: 1, density: 'passing' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-11',
      thumbnail: '/generated/marcus/post-11.jpeg',
      contentType: 'Video',
      caption: 'Basketball skills challenge with my boy @darius_fit. Loser buys dinner. Who do you think won? #Basketball #SkillsChallenge #Hoops #FriendlyComp',
      postedAt: '2026-01-05T15:30:00Z',
      stats: { views: 96000, likes: 8400, comments: 723, shares: 1400 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-12',
      thumbnail: '/generated/marcus/post-12.jpeg',
      contentType: 'Reel',
      caption: 'Meal prep Sunday! Chicken, rice, broccoli x5. Simple but effective. Nutrition is 80% of the game. Drop your go-to meal prep below. #MealPrep #NutritionTips #FuelYourBody #GainzKitchen',
      postedAt: '2026-01-02T10:00:00Z',
      stats: { views: 78000, likes: 6700, comments: 445, shares: 1800 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-13',
      thumbnail: '/generated/marcus/post-13.jpeg',
      contentType: 'Video',
      caption: 'My top 5 training tips that changed everything. Took me years to figure these out. Number 3 is the one most people get wrong. #TrainingTips #FitnessAdvice #PersonalTrainer #GymTips',
      postedAt: '2025-12-29T13:15:00Z',
      stats: { views: 145000, likes: 12300, comments: 891, shares: 3200 },
      signals: [
        { type: 'visual', confidence: 48, timestamp: '2:30', excerpt: 'Nike Dri-FIT shirt logo briefly visible', context: 'Brand on clothing, completely incidental', frequency: 1, density: 'passing' },
      ],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },

    // ============================================
    // LIFESTYLE POSTS (4) — No Nike signals
    // ============================================
    {
      id: 'mp-14',
      thumbnail: '/generated/marcus/post-14.jpeg',
      contentType: 'Story',
      caption: 'Lakers game night with the crew! LeBron went off in the 4th. Incredible atmosphere at Crypto.com Arena. #Lakers #NBA #GameNight #PurpleAndGold',
      postedAt: '2025-12-25T21:00:00Z',
      stats: { views: 45000, likes: 4200, comments: 234, shares: 310 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-15',
      thumbnail: '/generated/marcus/post-15.jpeg',
      contentType: 'Post',
      caption: 'Best coffee spots in LA, a thread. Starting with @bluebelcoffee in Silver Lake. The pour over here hits different. Where\'s your go-to? #LACoffee #CoffeeGuide #SilverLake #CoffeeLover',
      postedAt: '2025-12-21T09:30:00Z',
      stats: { views: 38000, likes: 3400, comments: 287, shares: 560 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-16',
      thumbnail: '/generated/marcus/post-16.jpeg',
      contentType: 'Reel',
      caption: 'Sunset hike in Malibu. Sometimes you need to unplug and just be present. This view is the reward. #Malibu #SunsetHike #LAHikes #NatureTherapy',
      postedAt: '2025-12-17T17:00:00Z',
      stats: { views: 62000, likes: 5800, comments: 198, shares: 720 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-17',
      thumbnail: '/generated/marcus/post-17.jpeg',
      contentType: 'Video',
      caption: 'Downtown LA food tour! Tried 6 spots in one day. The birria tacos from @birrialandia were the clear winner. Full video on YouTube. #LAFoodTour #StreetFood #DTLA #FoodieLA',
      postedAt: '2025-12-13T12:00:00Z',
      stats: { views: 56000, likes: 4900, comments: 356, shares: 890 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },

    // ============================================
    // PERSONAL POSTS (3) — No Nike signals
    // ============================================
    {
      id: 'mp-18',
      thumbnail: '/generated/marcus/post-18.jpeg',
      contentType: 'Reel',
      caption: 'Happy birthday to me! 28 feels good. Grateful for everyone who came out last night. Year 28 is going to be different. #Birthday #Grateful #NewChapter #28',
      postedAt: '2025-12-09T20:00:00Z',
      stats: { views: 89000, likes: 12400, comments: 1230, shares: 340 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-19',
      thumbnail: '/generated/marcus/post-19.jpeg',
      contentType: 'Video',
      caption: 'APARTMENT TOUR! Finally moved into the new place in West Hollywood. Took 3 months to get it right. Minimalist fitness guy aesthetic. Full tour on the channel. #ApartmentTour #WeHo #NewPlace #InteriorDesign',
      postedAt: '2025-12-04T14:00:00Z',
      stats: { views: 123000, likes: 10800, comments: 892, shares: 1600 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
    {
      id: 'mp-20',
      thumbnail: '/generated/marcus/post-20.jpeg',
      contentType: 'Story',
      caption: 'Q&A time! Answering your top questions about training, nutrition, and life in LA. Drop more questions for part 2. #QandA #AskMarcus #FitnessQA #LifeInLA',
      postedAt: '2025-11-30T18:00:00Z',
      stats: { views: 41000, likes: 3600, comments: 567, shares: 210 },
      signals: [],
      compositeScore: 0,
      scoreBreakdown: EMPTY_BREAKDOWN,
    },
  ],
};
