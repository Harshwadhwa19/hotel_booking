const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.hotel.deleteMany();
  // We keep users and coupons as they might be needed and aren't seeded here in bulk usually
  // If we wanted to clear everything:
  // await prisma.user.deleteMany();
  // await prisma.coupon.deleteMany();

  const hotelsData = [
    // --- GOA (Beach & Party) ---
    {
      name: 'The Leela Goa',
      location: 'Mobor Beach, South Goa',
      city: 'Goa',
      category: 'Resort',
      pricePerNight: 28000,
      rating: 4.9,
      description: 'A riverside luxury resort with direct access to the pristine Mobor Beach. Experience the fusion of Portuguese heritage and South Indian tradition.',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80'
      ],
      facilities: ['Free Wifi', 'Private Beach', 'Swimming Pool', 'Spa', 'Breakfast'],
      latitude: 15.1583,
      longitude: 73.9431
    },
    {
      name: 'W Goa',
      location: 'Vagator Beach, North Goa',
      city: 'Goa',
      category: 'Hotel',
      pricePerNight: 24000,
      rating: 4.7,
      description: 'Overlooking the Arabian Sea, W Goa offers a vibrant lifestyle experience with world-class dining and high-energy nightlife.',
      images: [
        'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
      ],
      facilities: ['Beach Club', 'Gym', 'Infinity Pool', 'Spa'],
      latitude: 15.6028,
      longitude: 73.7347
    },
    {
      name: 'Heritage Villa Club',
      location: 'Candolim',
      city: 'Goa',
      category: 'Villa',
      pricePerNight: 12000,
      rating: 4.6,
      description: 'Private villas nestled in lush greenery, just minutes away from the Calangute-Candolim beach stretch.',
      images: [
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
      ],
      facilities: ['Private Pool', 'Kitchen', 'Free Wifi', 'Parking'],
      latitude: 15.5186,
      longitude: 73.7667
    },
    {
      name: 'Goan Village Resort',
      location: 'Calangute',
      city: 'Goa',
      category: 'Resort',
      pricePerNight: 5500,
      rating: 4.2,
      description: 'An affordable yet premium resort experience in the heart of Calangute.',
      images: ['https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Pool', 'Bar', 'Wifi', 'Restaurant'],
      latitude: 15.5494,
      longitude: 73.7535
    },

    // --- MANALI (Mountains & Snow) ---
    {
      name: 'The Himalayan Manali',
      location: 'Hadimba Road',
      city: 'Manali',
      category: 'Resort',
      pricePerNight: 18000,
      rating: 4.9,
      description: 'A Victorian-style luxury castle with apple orchards and mountain views.',
      images: [
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1548786811-dd6e453ccca2?auto=format&fit=crop&w=1200&q=80'
      ],
      facilities: ['Mountain View', 'Fireplace', 'Orchard', 'Spa'],
      latitude: 32.2476,
      longitude: 77.1887
    },
    {
      name: 'Span Resort & Spa',
      location: 'Kullu Manali Highway',
      city: 'Manali',
      category: 'Resort',
      pricePerNight: 22000,
      rating: 4.8,
      description: 'Riverside luxury resort offering breathtaking views of the Beas River.',
      images: ['https://images.unsplash.com/photo-1621641031044-63806fb71932?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['River View', 'Spa', 'Trekking', 'Gym'],
      latitude: 32.1856,
      longitude: 77.1700
    },
    {
      name: 'Apple Country Resorts',
      location: 'Log Huts Area',
      city: 'Manali',
      category: 'Hotel',
      pricePerNight: 8500,
      rating: 4.5,
      description: 'Set at the highest point of Manali, offering unparalleled views of the valley.',
      images: ['https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Sauna', 'Snow Point', 'Wifi', 'Restaurant'],
      latitude: 32.2510,
      longitude: 77.1840
    },
    {
      name: 'Zostel Manali',
      location: 'Old Manali',
      city: 'Manali',
      category: 'Apartment',
      pricePerNight: 1500,
      rating: 4.5,
      description: 'Cozy and social backpacker stay in the heart of Old Manali.',
      images: ['https://images.unsplash.com/photo-1555854811-8aa227589d49?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Cafe', 'Community Kitchen', 'Wifi', 'Game Area'],
      latitude: 32.2550,
      longitude: 77.1820
    },

    // --- MUMBAI (City & Luxury) ---
    {
      name: 'Taj Lands End',
      location: 'Bandra West',
      city: 'Mumbai',
      category: 'Hotel',
      pricePerNight: 24000,
      rating: 4.8,
      description: 'Overlooking the Arabian Sea and the Bandra Worli Sea Link.',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Sea View', 'Spa', 'Fine Dining', 'Pool'],
      latitude: 19.0435,
      longitude: 72.8193
    },
    {
      name: 'The Oberoi',
      location: 'Nariman Point',
      city: 'Mumbai',
      category: 'Hotel',
      pricePerNight: 26000,
      rating: 4.9,
      description: 'The standard of luxury in South Mumbai, with views of the Queen\'s Necklace.',
      images: ['https://images.unsplash.com/photo-1551882547-ff43c3302831?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Marine Drive View', 'Gourmet Dining', 'Gym', 'Spa'],
      latitude: 18.9275,
      longitude: 72.8208
    },
    {
      name: 'Sahara Star',
      location: 'Vile Parle',
      city: 'Mumbai',
      category: 'Hotel',
      pricePerNight: 11000,
      rating: 4.4,
      description: 'Known for its giant tropical lagoon and architectural brilliance near the airport.',
      images: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Lagoon', 'Airport Proximity', 'Fine Dining', 'Cinemas'],
      latitude: 19.0948,
      longitude: 72.8521
    },

    // --- LONAVALA (Hill Station) ---
    {
      name: 'The Machan',
      location: 'Atvan',
      city: 'Lonavala',
      category: 'Villa',
      pricePerNight: 15000,
      rating: 4.7,
      description: 'A unique eco-resort with tree houses rising 30-45 feet above the forest.',
      images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Nature View', 'Tree House', 'Eco-friendly', 'Wifi'],
      latitude: 18.7557,
      longitude: 73.4091
    },
    {
      name: 'Della Resorts',
      location: 'Khandala',
      city: 'Lonavala',
      category: 'Resort',
      pricePerNight: 18000,
      rating: 4.6,
      description: 'Luxury adventure resort with extreme sports and fine dining.',
      images: ['https://images.unsplash.com/photo-1445013021741-ad44af74fd00?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Adventure Park', 'Pet Friendly', 'Nightclub', 'Spa'],
      latitude: 18.7617,
      longitude: 73.3850
    },
    {
      name: 'Fariyas Resort',
      location: 'Frichley Hills',
      city: 'Lonavala',
      category: 'Resort',
      pricePerNight: 9500,
      rating: 4.3,
      description: 'A classic Lonavala resort with an indoor water park.',
      images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Water Park', 'Spa', 'Kids Activity', 'Pool'],
      latitude: 18.7505,
      longitude: 73.4140
    },

    // --- JAIPUR (Heritage & Royalty) ---
    {
      name: 'Rambagh Palace Jaipur',
      location: 'Bhawani Singh Road',
      city: 'Jaipur',
      category: 'Hotel',
      pricePerNight: 45000,
      rating: 5.0,
      description: 'The Jewel of Jaipur, former royal residence turned luxury hotel.',
      images: ['https://images.unsplash.com/photo-1599661046289-e31887846eac?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Royal Stay', 'Gardens', 'Spa', 'Peacocks'],
      latitude: 26.8981,
      longitude: 75.8115
    },
    {
      name: 'Fairmont Jaipur',
      location: 'Riico, Kukas',
      city: 'Jaipur',
      category: 'Hotel',
      pricePerNight: 19000,
      rating: 4.8,
      description: 'Inspired by the Mughal and Rajput architecture, a modern grand palace.',
      images: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Luxury Spa', 'Pool Side Dinner', 'High Tea'],
      latitude: 27.0391,
      longitude: 75.8853
    },
    {
      name: 'Jai Mahal Palace',
      location: 'Civil Lines',
      city: 'Jaipur',
      category: 'Resort',
      pricePerNight: 16000,
      rating: 4.7,
      description: 'A masterpiece of Indo-Saracenic architecture set in 18 acres of Mughal gardens.',
      images: ['https://images.unsplash.com/photo-1590059132218-173ee07914de?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Heritage Gardens', 'Pool', 'Wifi', 'Palace View'],
      latitude: 26.9110,
      longitude: 75.7930
    },

    // --- UDAIPUR (Lakes & Romance) ---
    {
      name: 'Taj Lake Palace Udaipur',
      location: 'Pichola Lake',
      city: 'Udaipur',
      category: 'Hotel',
      pricePerNight: 55000,
      rating: 5.0,
      description: 'An architectural marvel floating in the middle of Lake Pichola.',
      images: ['https://images.unsplash.com/photo-1590001158193-7901314947dc?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1621293954908-d81146c0ecdc?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Boat Service', 'Lake View', 'Palace Stay', 'Royal Dining'],
      latitude: 24.5753,
      longitude: 73.6800
    },
    {
      name: 'The Leela Palace',
      location: 'Lake Pichola',
      city: 'Udaipur',
      category: 'Resort',
      pricePerNight: 42000,
      rating: 4.9,
      description: 'A modern palace resort with breathtaking lake views and luxury spa.',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Infinity Pool', 'Spa', 'Lake Boating', 'Wifi'],
      latitude: 24.5786,
      longitude: 73.6800
    },

    // --- PUNE (Business & Tech) ---
    {
      name: 'JW Marriott Pune',
      location: 'Senapati Bapat Road',
      city: 'Pune',
      category: 'Hotel',
      pricePerNight: 11000,
      rating: 4.7,
      description: 'The preferred choice for business and luxury in Pune City.',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Rooftop Lounge', 'Spa', 'Pool', 'Convention Center'],
      latitude: 18.5350,
      longitude: 73.8300
    },
    {
      name: 'Conrad Pune',
      location: 'Mangaldas Road',
      city: 'Pune',
      category: 'Hotel',
      pricePerNight: 13000,
      rating: 4.8,
      description: 'Art Deco-inspired luxury hotel in the heart of Pune\'s business district.',
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Executive Lounge', 'Spa', 'Outdoor Pool', 'Smart Rooms'],
      latitude: 18.5362,
      longitude: 73.8834
    },

    // --- NASHIK (Vineyards) ---
    {
      name: 'Beyond by Sula',
      location: 'Gangapur Road',
      city: 'Nashik',
      category: 'Villa',
      pricePerNight: 12000,
      rating: 4.8,
      description: 'Stay in the heart of India\'s wine capital, overlooking Sula Vineyards.',
      images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Wine Tasting', 'Vineyard Tour', 'Lake View', 'Wifi'],
      latitude: 20.0050,
      longitude: 73.6880
    },
    {
      name: 'Radisson Blu Nashik',
      location: 'Nashik-Pune Road',
      city: 'Nashik',
      category: 'Hotel',
      pricePerNight: 9500,
      rating: 4.6,
      description: 'Modern luxury in Nashik with a stunning pool and multi-cuisine dining.',
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Pool', 'Spa', 'Gym', 'Wifi'],
      latitude: 19.9975,
      longitude: 73.7898
    },

    // --- KASOL (Parvati Valley) ---
    {
      name: 'Parvati Kuteer',
      location: 'Manikaran Road',
      city: 'Kasol',
      category: 'Villa',
      pricePerNight: 5500,
      rating: 4.6,
      description: 'Rustic wooden cottages by the Parvati River, perfect for nature lovers.',
      images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Riverside', 'Bornfire', 'Home Food', 'Trekking'],
      latitude: 32.0097,
      longitude: 77.3150
    },

    // --- HARIDWAR (Spirituality) ---
    {
      name: 'Pilibhit House',
      location: 'Niranjani Akhara Marg',
      city: 'Haridwar',
      category: 'Hotel',
      pricePerNight: 20000,
      rating: 4.9,
      description: 'A century-old mansion reimagined as a luxury boutique heritage hotel by the Ganges.',
      images: ['https://images.unsplash.com/photo-1621293954908-d81146c0ecdc?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Ganga Aarti', 'Spa', 'Heritage Stay', 'Gourmet Food'],
      latitude: 29.9457,
      longitude: 78.1642
    },

    // --- MAHABALESHWAR ---
    {
      name: 'Le Meridien Mahabaleshwar',
      location: 'Satara-Medha Road',
      city: 'Mahabaleshwar',
      category: 'Resort',
      pricePerNight: 17000,
      rating: 4.9,
      description: 'Set amidst forest, offering a sanctuary of peace and world-class service.',
      images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Forest View', 'Heated Pool', 'Spa', 'Orchard'],
      latitude: 17.9235,
      longitude: 73.6586
    },

    // --- DELHI (Capital City) ---
    {
      name: 'The Taj Mahal Hotel',
      location: 'Mansingh Road',
      city: 'Delhi',
      category: 'Hotel',
      pricePerNight: 22000,
      rating: 4.9,
      description: 'A landmark of luxury in the heart of Lutyoens Delhi.',
      images: ['https://images.unsplash.com/photo-1587061941618-1c4b7b282772?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Pool', 'Spa', 'Luxury Dining', 'Gardens'],
      latitude: 28.6010,
      longitude: 77.2250
    },
    {
      name: 'Roseate House',
      location: 'Aerocity',
      city: 'Delhi',
      category: 'Hotel',
      pricePerNight: 14000,
      rating: 4.7,
      description: 'A contemporary luxury hotel near the international airport.',
      images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Rooftop Pool', 'Cinema', 'Spa', 'Wifi'],
      latitude: 28.5520,
      longitude: 77.1220
    },

    // --- BANGALORE (IT Hub) ---
    {
      name: 'ITC Gardenia',
      location: 'Residency Road',
      city: 'Bangalore',
      category: 'Hotel',
      pricePerNight: 20000,
      rating: 4.8,
      description: 'A luxury business hotel inspired by the garden city architecture.',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Garden Lounge', 'Spa', 'Pool', 'Butler Service'],
      latitude: 12.9600,
      longitude: 77.5950
    },
    {
      name: 'The Leela Palace Bangalore',
      location: 'Old Airport Road',
      city: 'Bangalore',
      category: 'Hotel',
      pricePerNight: 22000,
      rating: 4.9,
      description: 'Inspired by the royal heritage of the Mysore Palace.',
      images: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Royal Stay', 'Gardens', 'Spa', 'Pool'],
      latitude: 12.9590,
      longitude: 77.6480
    },

    // --- MUSSOORIE (Queen of Hills) ---
    {
      name: 'JW Marriott Walnut Grove',
      location: 'Mussoorie-Dhanaulti Road',
      city: 'Mussoorie',
      category: 'Resort',
      pricePerNight: 28000,
      rating: 4.9,
      description: 'Luxury resort nestled in the Himalayan foothills.',
      images: ['https://images.unsplash.com/photo-1548786811-dd6e453ccca2?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Mountain View', 'Kids Club', 'Heated Pool', 'Bowling'],
      latitude: 30.4590,
      longitude: 78.0660
    },

    // --- RISHIKESH (Yoga Capital) ---
    {
      name: 'Ananda In The Himalayas',
      location: 'The Palace Estate',
      city: 'Rishikesh',
      category: 'Resort',
      pricePerNight: 35000,
      rating: 5.0,
      description: 'World-renowned spa and destination wellness retreat.',
      images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Yoga', 'Spa', 'Meditation', 'Himalayan View'],
      latitude: 30.1250,
      longitude: 78.3000
    },

    // --- MUNNAR (Tea Gardens) ---
    {
      name: 'The Panoramic Getaway',
      location: 'Chithirapuram',
      city: 'Munnar',
      category: 'Resort',
      pricePerNight: 15000,
      rating: 4.8,
      description: 'Offering the best views of the Munnar mountains and tea gardens.',
      images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80'],
      facilities: ['Tea Garden View', 'Heated Pool', 'Wifi'],
      latitude: 10.0500,
      longitude: 77.0300
    }
  ];

  for (const h of hotelsData) {
    const hotel = await prisma.hotel.create({
      data: {
        ...h,
        reviews: {
          create: [
            {
              userName: 'Rahul Sharma',
              comment: 'Amazing experience, world-class service!',
              rating: 5.0
            },
            {
              userName: 'Anjali Gupta',
              comment: 'The location is unbeatable. Highly recommended.',
              rating: 4.8
            }
          ]
        }
      }
    });
    console.log(`Created hotel: ${hotel.name} in ${hotel.city}`);
  }

  console.log('--- SEEDING FINISHED: TOTAL ' + hotelsData.length + ' HOTELS ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
