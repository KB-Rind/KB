import { BedtimeStory, ChildProfile, NurseryRhyme, SoundTrackConfig } from "../types";

export const DEFAULT_CHILD_PROFILES: ChildProfile[] = [
  {
    id: "child-1",
    name: "Mia",
    age: 3,
    favoriteAnimal: "Bunny",
    favoriteTheme: "The silver moon and drifting clouds",
    avatarColor: "from-pink-500 to-rose-400",
    avatarEmoji: "🐰",
    preferredLanguage: "English",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "child-2",
    name: "Leo",
    age: 5,
    favoriteAnimal: "Bear Cub",
    favoriteTheme: "Starlight forest adventures",
    avatarColor: "from-indigo-500 to-amber-400",
    avatarEmoji: "🐻",
    preferredLanguage: "English",
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const DEFAULT_SOUND_TRACKS: SoundTrackConfig[] = [
  {
    id: "rain",
    name: "Gentle Rain",
    category: "nature",
    iconName: "CloudRain",
    description: "Soft raindrops tapping softly on a warm bedroom window.",
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: "ocean",
    name: "Calm Ocean Tide",
    category: "nature",
    iconName: "Waves",
    description: "Slow, rhythmic waves rolling in and out under the night sky.",
    volume: 0.5,
    isPlaying: false,
  },
  {
    id: "lullaby",
    name: "Music Box Lullaby",
    category: "music",
    iconName: "Music",
    description: "Delicate chime arpeggios that play sweet, slow bedtime melodies.",
    volume: 0.45,
    isPlaying: false,
  },
  {
    id: "whitenoise",
    name: "Warm Pink Noise",
    category: "ambient",
    iconName: "Wind",
    description: "Deep, soothing ambient hush that masks sudden household sounds.",
    volume: 0.4,
    isPlaying: false,
  },
  {
    id: "heartbeat",
    name: "Mother's Heartbeat",
    category: "womb",
    iconName: "Heart",
    description: "Rhythmic 60-BPM womb pulse bringing deep comfort and relaxation.",
    volume: 0.55,
    isPlaying: false,
  },
  {
    id: "crickets",
    name: "Night Meadow",
    category: "nature",
    iconName: "Sparkles",
    description: "Gentle summer crickets and a soft whisper of evening grass.",
    volume: 0.35,
    isPlaying: false,
  },
  {
    id: "stream",
    name: "Forest Brook",
    category: "nature",
    iconName: "Droplets",
    description: "Cool, crystal clear water meandering gently over smooth river stones.",
    volume: 0.4,
    isPlaying: false,
  },
];

export const DEFAULT_NURSERY_RHYMES: NurseryRhyme[] = [
  {
    id: "rhyme-teeth",
    title: "The Toothbrush Star",
    routineCategory: "brush_teeth",
    stanzas: [
      {
        stanzaNumber: 1,
        lines: [
          "Up and down and round about,",
          "Chase the sleepy sugar out!",
          "Little bubbles soft and bright,",
          "Making smiles clean and white."
        ],
        parentActionTip: "Gently brush upper and lower teeth together in a small circle"
      },
      {
        stanzaNumber: 2,
        lines: [
          "Front teeth sparkle like a star,",
          "Back teeth shining near and far.",
          "Spit the foam and rinse with care,",
          "Nighttime magic in the air."
        ],
        parentActionTip: "Offer a warm cup of water to rinse and admire the bright smile"
      }
    ],
    closingNote: "All clean and sparkling, ready for bedtime whispers."
  },
  {
    id: "rhyme-toys",
    title: "Tidy Up, Little Stars",
    routineCategory: "tidy_toys",
    stanzas: [
      {
        stanzaNumber: 1,
        lines: [
          "Blocks and crayons go to rest,",
          "Tucked inside the cozy chest.",
          "Teddy lays his fluffy head,",
          "Getting ready for his bed."
        ],
        parentActionTip: "Pick up 3 toys together while humming"
      },
      {
        stanzaNumber: 2,
        lines: [
          "Every puzzle in its place,",
          "With a quiet, happy face.",
          "Now the room is soft and still,",
          "Moonlight resting on the sill."
        ],
        parentActionTip: "Dim the nursery light to celebrate a tidy room"
      }
    ],
    closingNote: "The toys are sleeping sweetly now, and so will you."
  },
  {
    id: "rhyme-pajamas",
    title: "Cozy Pajama Song",
    routineCategory: "pajamas",
    stanzas: [
      {
        stanzaNumber: 1,
        lines: [
          "One little foot in, two little feet,",
          "Soft little fabric, warm and sweet.",
          "Buttons zipped and sleeves pulled through,",
          "Cozy cuddles waiting for you."
        ],
        parentActionTip: "Tickle their toes softly as the pajama legs slide on"
      },
      {
        stanzaNumber: 2,
        lines: [
          "Snug as a bunny wrapped in wool,",
          "Quiet mind and tummy full.",
          "Lay your head upon the sheet,",
          "Dreaming travels, oh so sweet."
        ],
        parentActionTip: "Tuck the blanket gently up to their shoulders"
      }
    ],
    closingNote: "Warm and cozy from head to toe."
  },
  {
    id: "rhyme-twinkle",
    title: "Twinkle, Twinkle, Little Star",
    routineCategory: "classic",
    stanzas: [
      {
        stanzaNumber: 1,
        lines: [
          "Twinkle, twinkle, little star,",
          "How I wonder what you are!",
          "Up above the world so high,",
          "Like a diamond in the sky."
        ]
      },
      {
        stanzaNumber: 2,
        lines: [
          "When the blazing sun is gone,",
          "When he nothing shines upon,",
          "Then you show your little light,",
          "Twinkle, twinkle, all the night."
        ]
      },
      {
        stanzaNumber: 3,
        lines: [
          "Then the traveler in the dark",
          "Thanks you for your tiny spark;",
          "He could not see which way to go,",
          "If you did not twinkle so."
        ]
      }
    ],
    closingNote: "Look up at the quiet stars shining down just for you."
  },
  {
    id: "rhyme-brahms",
    title: "Brahms' Lullaby (Cradle Song)",
    routineCategory: "classic",
    stanzas: [
      {
        stanzaNumber: 1,
        lines: [
          "Lullaby and goodnight,",
          "With pink roses bedight,",
          "With lilies o'erhead,",
          "Lay thee down in thy bed."
        ]
      },
      {
        stanzaNumber: 2,
        lines: [
          "Close your eyes, soft and deep,",
          "Drift away into sleep,",
          "Safe and warm through the night,",
          "'Til the dawn brings its light."
        ]
      }
    ],
    closingNote: "Sleep in heavenly peace."
  }
];

export const DEFAULT_STORIES: BedtimeStory[] = [
  {
    id: "story-bunny-moon",
    title: "The Sleepy Bunny & The Silver Moon",
    subtitle: "A gentle journey across the lavender meadow",
    childName: "Mia",
    age: 3,
    favoriteAnimal: "Bunny",
    theme: "The silver moon and drifting clouds",
    estimatedReadMinutes: 4,
    recommendedSound: "lullaby",
    closingAffirmation: "Goodnight little one. You are safe, cherished, and loved as high as the moon.",
    createdAt: Date.now() - 3600000 * 12,
    isFavorite: true,
    pages: [
      {
        pageNumber: 1,
        title: "The Sun Goes Down",
        text: "The golden sun dipped behind the gentle purple hills, waving a quiet goodnight to the flowers. Mia the bunny wiggled her soft little nose and gave a slow, delicious yawn.",
        sceneDescription: "A soft watercolor illustration of a fluffy bunny looking at the pastel sunset over hills.",
        calmAction: "Stretch your arms up high and let out a big cozy yawn."
      },
      {
        pageNumber: 2,
        title: "The Moonlit Meadow",
        text: "The night air smelled of sweet lavender and dewy grass. Up in the velvety blue sky, the friendly Silver Moon smiled down, casting a soft milky glow across the sleepy forest.",
        sceneDescription: "The crescent moon with kind eyes looking down on clover and lavender flowers.",
        calmAction: "Take one slow, deep breath in... and let it out gently like a warm breeze."
      },
      {
        pageNumber: 3,
        title: "The Cloud Pillow",
        text: "A friendly baby cloud drifted down from the sky, as fluffy as whipped cream. 'Come rest your sleepy paws, little bunny,' the cloud whispered in a voice as gentle as a lullaby.",
        sceneDescription: "A soft fluffy white cloud cradling the little bunny.",
        calmAction: "Snuggle your head into your soft pillow."
      },
      {
        pageNumber: 4,
        title: "Drifting into Dreams",
        text: "Mia curled up tight, tucking her long velvet ears under her chin. The crickets played a soft lullaby, the stars blinked softly one by one, and Mia closed her eyes, safe and warm in mama's love.",
        sceneDescription: "The bunny sleeping soundly under a blanket of starlight.",
        calmAction: "Close your eyes softly. Your dreams are waiting."
      }
    ]
  },
  {
    id: "story-bear-cloud",
    title: "Barnaby Bear Snuggles a Cloud",
    subtitle: "A cozy mountain tale of soft whispers and deep sleep",
    childName: "Leo",
    age: 5,
    favoriteAnimal: "Bear Cub",
    theme: "Starlight forest adventures",
    estimatedReadMinutes: 4,
    recommendedSound: "rain",
    closingAffirmation: "Sleep tight, brave little cub. Tomorrow is filled with wonders, but tonight is for quiet rest.",
    createdAt: Date.now() - 3600000 * 24,
    isFavorite: true,
    pages: [
      {
        pageNumber: 1,
        title: "The Whispering Pines",
        text: "High up on Whispering Mountain, tall pine trees swayed gently back and forth. Barnaby Bear Cub walked slowly along the mossy path, his big furry paws feeling heavier with every step.",
        sceneDescription: "A friendly little bear walking among glowing fireflies under giant starry pine trees.",
        calmAction: "Roll your shoulders back and let your whole body sink into the bed."
      },
      {
        pageNumber: 2,
        title: "A Gentle Starlight Shower",
        text: "Soft rain began to tap a soothing rhythm on the broad green leaves—pitter-patter, pitter-patter. It sounded just like a blanket of whispers telling the whole mountain to go to sleep.",
        sceneDescription: "Gentle rain glowing with faint blue starlight over a cozy hollow log.",
        calmAction: "Listen to the rain sounds and take a slow breath."
      },
      {
        pageNumber: 3,
        title: "The Mossy Cave",
        text: "Inside his warm cedar den, mama bear had arranged a bed of dry golden leaves and fragrant pine needles. Barnaby curled into a cozy round ball right beside mama's gentle, steady heartbeat.",
        sceneDescription: "Mama bear and baby bear snuggled together in a warm golden cave with glowing lanterns.",
        calmAction: "Give your favorite stuffed friend or blanket a warm hug."
      },
      {
        pageNumber: 4,
        title: "Heavy Eyelids",
        text: "Barnaby's eyelids felt like heavy velvet curtains. Thump... thump... mama's heartbeat rocked him into stillness. The stars watched over the mountain, and Barnaby was fast asleep.",
        sceneDescription: "Little bear sleeping with a tiny contented smile in deep starlight.",
        calmAction: "Keep your eyes closed and let yourself drift away."
      }
    ]
  },
  {
    id: "story-starlight-express",
    title: "The Starlight Train to Dreamland",
    subtitle: "All aboard the softest midnight express",
    childName: "Little Dreamer",
    age: 4,
    favoriteAnimal: "Fawn",
    theme: "A magical journey through the stars",
    estimatedReadMinutes: 5,
    recommendedSound: "ocean",
    closingAffirmation: "Chugga-chugga, hush-a-bye. Rest your sweet head under the night sky.",
    createdAt: Date.now() - 3600000 * 36,
    isFavorite: false,
    pages: [
      {
        pageNumber: 1,
        title: "The Starry Station",
        text: "At the edge of the sky sits the Starry Station, made entirely of soft glowing clouds. The conductor, an old gentle owl in a velvet hat, tipped his feathers and whispered: 'All aboard the Dreamland Express.'",
        sceneDescription: "A glowing silver train floating on tracks made of golden stardust.",
        calmAction: "Take a deep breath and hear the quiet chug of the train."
      },
      {
        pageNumber: 2,
        title: "Marshmallow Seats",
        text: "Each seat inside the carriage is as plush and warm as a giant toasted marshmallow. The windows look out upon colorful planets floating by like giant colorful soap bubbles.",
        sceneDescription: "Inside the train carriage with cozy warm lanterns and sleepy animal passengers.",
        calmAction: "Sink into your mattress as if it were a fluffy marshmallow."
      },
      {
        pageNumber: 3,
        title: "Gliding Over Constellations",
        text: "The train glided smoothly across the Big Dipper and slid down the Milky Way. The wheels made no noise at all, just a soft soothing hum like a mother singing in the quiet of night.",
        sceneDescription: "The train soaring past glowing constellations in deep midnight blue.",
        calmAction: "Slowly unclench your hands and let your fingers go completely limp."
      },
      {
        pageNumber: 4,
        title: "Arriving at Slumberland",
        text: "The engine slowed to a gentle stop beside a lake of liquid silver. Every passenger tucked their heads beneath warm quilted comforters. The journey was over, and sweet dreams had begun.",
        sceneDescription: "A peaceful dreamland village nestled beside a silver moonlit lake.",
        calmAction: "Goodnight train, goodnight stars, goodnight sweet child."
      }
    ]
  }
];
