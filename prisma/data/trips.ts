import { users } from './users';
import { Visibility } from '@prisma/generated';
import { v4 as uuidv4 } from 'uuid';

export const trips = [
  {
    id: uuidv4() as string,
    title: 'Spring week in Paris and London',
    description: 'A museum-heavy city break with train travel, neighborhood walks, and a few booked dinners.',
    visibility: Visibility.PUBLIC,
    slug: 'spring-paris-london-public',
    userId: users[0].id,
    destinations: ['Paris, France', 'London, United Kingdom'],
    startDate: new Date('2026-04-03'),
    endDate: new Date('2026-04-12'),
    itineraryItems: [
      {
        title: 'Eurostar to London',
        description: 'Keep passports and printed hotel confirmations in the front pocket.',
        location: 'Paris Gare du Nord',
        startsAt: new Date('2026-04-07T08:45:00.000Z'),
        endsAt: new Date('2026-04-07T11:30:00.000Z'),
        sortOrder: 0,
      },
      {
        title: 'British Museum highlights',
        description: 'Focus on the Greece and Egypt rooms, then leave time for Bloomsbury coffee.',
        location: 'British Museum',
        startsAt: new Date('2026-04-08T10:00:00.000Z'),
        endsAt: new Date('2026-04-08T13:00:00.000Z'),
        sortOrder: 1,
      },
    ],
    notes: [
      {
        title: 'Packing',
        content: 'Bring compact umbrella, universal adapter, comfortable shoes, and printed museum reservations.',
      },
      {
        title: 'Transit',
        content: 'Use Navigo Easy in Paris and contactless cards on the Tube.',
      },
    ],
    places: [
      {
        name: 'Le Comptoir du Relais',
        category: 'Restaurant',
        address: '9 Carrefour de l Odeon, 75006 Paris',
        url: 'https://www.hotel-paris-relais-saint-germain.com/en/restaurant-bar.html',
        notes: 'Good candidate for the first night if reservation times work.',
      },
      {
        name: 'Daunt Books Marylebone',
        category: 'Bookshop',
        address: '84 Marylebone High St, London W1U 4QW',
        url: 'https://dauntbooks.co.uk/',
        notes: 'Browse travel writing and buy a small notebook.',
      },
    ],
  },
  {
    id: uuidv4() as string,
    title: 'California family road trip',
    description: 'Private draft for a family route from San Francisco to Los Angeles with national park stops.',
    visibility: Visibility.PRIVATE,
    slug: 'california-family-road-trip-private',
    userId: users[0].id,
    destinations: ['San Francisco, USA', 'Yosemite National Park, USA', 'Los Angeles, USA'],
    startDate: new Date('2026-07-18'),
    endDate: new Date('2026-07-29'),
    itineraryItems: [
      {
        title: 'Pick up rental car',
        location: 'San Francisco International Airport',
        startsAt: new Date('2026-07-18T17:00:00.000Z'),
        endsAt: new Date('2026-07-18T18:00:00.000Z'),
        sortOrder: 0,
      },
      {
        title: 'Yosemite Valley day',
        description: 'Start early, pack water, and avoid moving the car after parking.',
        location: 'Yosemite Valley',
        startsAt: new Date('2026-07-21T14:00:00.000Z'),
        endsAt: new Date('2026-07-21T23:00:00.000Z'),
        sortOrder: 1,
      },
    ],
    notes: [
      {
        title: 'Budget watch',
        content: 'Track parking, fuel, and park entry fees separately from hotel deposits.',
      },
    ],
    places: [
      {
        name: 'Tunnel View',
        category: 'Viewpoint',
        address: 'Wawona Road, Yosemite National Park, CA',
        notes: 'Best late afternoon light if traffic is manageable.',
      },
      {
        name: 'Griffith Observatory',
        category: 'Sightseeing',
        address: '2800 E Observatory Rd, Los Angeles, CA',
        url: 'https://griffithobservatory.org/',
        notes: 'Check evening hours before planning dinner nearby.',
      },
    ],
  },
  {
    id: uuidv4() as string,
    title: 'Singapore and Saigon food crawl',
    description: 'Public inspiration trip centered on hawker centers, coffee, markets, and short cultural stops.',
    visibility: Visibility.PUBLIC,
    slug: 'singapore-saigon-food-crawl-public',
    userId: users[1].id,
    destinations: ['Singapore', 'Ho Chi Minh City, Vietnam'],
    startDate: new Date('2026-11-02'),
    endDate: new Date('2026-11-15'),
    itineraryItems: [
      {
        title: 'Maxwell Food Centre lunch',
        description: 'Try chicken rice, sugar cane juice, and leave room for kaya toast later.',
        location: 'Maxwell Food Centre',
        startsAt: new Date('2026-11-03T04:30:00.000Z'),
        endsAt: new Date('2026-11-03T06:00:00.000Z'),
        sortOrder: 0,
      },
      {
        title: 'Ben Thanh Market evening walk',
        location: 'Ben Thanh Market',
        startsAt: new Date('2026-11-10T11:00:00.000Z'),
        endsAt: new Date('2026-11-10T13:00:00.000Z'),
        sortOrder: 1,
      },
    ],
    notes: [
      {
        title: 'Food list',
        content: 'Laksa, carrot cake, banh mi, bun thit nuong, egg coffee, and fresh spring rolls.',
      },
    ],
    places: [
      {
        name: 'Maxwell Food Centre',
        category: 'Food hall',
        address: '1 Kadayanallur St, Singapore',
        notes: 'Go before the lunch rush.',
      },
      {
        name: 'The Workshop Coffee',
        category: 'Cafe',
        address: '27 Ngo Duc Ke, District 1, Ho Chi Minh City',
        notes: 'Reliable coffee stop near the center.',
      },
    ],
  },
  {
    id: uuidv4() as string,
    title: 'Japan rail planning board',
    description: 'Private planning workspace for comparing Tokyo, Kyoto, Osaka, and a possible onsen night.',
    visibility: Visibility.PRIVATE,
    slug: 'japan-rail-planning-board-private',
    userId: users[1].id,
    destinations: ['Tokyo, Japan', 'Kyoto, Japan', 'Osaka, Japan'],
    startDate: new Date('2027-03-22'),
    endDate: new Date('2027-04-04'),
    itineraryItems: [
      {
        title: 'Shinkansen to Kyoto',
        location: 'Tokyo Station',
        startsAt: new Date('2027-03-27T01:30:00.000Z'),
        endsAt: new Date('2027-03-27T04:00:00.000Z'),
        sortOrder: 0,
      },
    ],
    notes: [
      {
        title: 'Open questions',
        content: 'Decide whether the rail pass is worth it after finalizing day trips.',
      },
      {
        title: 'Cherry blossom buffer',
        content: 'Keep two flexible mornings in Tokyo or Kyoto for parks if bloom timing shifts.',
      },
    ],
    places: [
      {
        name: 'Kiyomizu-dera',
        category: 'Temple',
        address: '1-294 Kiyomizu, Higashiyama Ward, Kyoto',
        url: 'https://www.kiyomizudera.or.jp/en/',
        notes: 'Go early before the approach gets crowded.',
      },
      {
        name: 'Kuromon Ichiba Market',
        category: 'Market',
        address: '2 Chome Nipponbashi, Chuo Ward, Osaka',
        notes: 'Potential lunch stop between hotel transfer and Dotonbori.',
      },
    ],
  },
  {
    id: uuidv4() as string,
    title: 'Reykjavik winter long weekend',
    description: 'Short public sample trip with weather-dependent activities and saved backup places.',
    visibility: Visibility.PUBLIC,
    slug: 'reykjavik-winter-long-weekend-public',
    userId: users[2].id,
    destinations: ['Reykjavik, Iceland', 'Golden Circle, Iceland'],
    startDate: new Date('2026-02-12'),
    endDate: new Date('2026-02-16'),
    itineraryItems: [
      {
        title: 'Golden Circle small-group tour',
        description: 'Confirm pickup time the night before and pack waterproof outer layers.',
        location: 'Reykjavik',
        startsAt: new Date('2026-02-13T09:00:00.000Z'),
        endsAt: new Date('2026-02-13T18:00:00.000Z'),
        sortOrder: 0,
      },
      {
        title: 'Northern lights backup window',
        description: 'Only book if aurora and cloud forecasts look reasonable.',
        startsAt: null,
        endsAt: null,
        sortOrder: 1,
      },
    ],
    notes: [
      {
        title: 'Weather',
        content: 'Build every day with a bad-weather indoor fallback.',
      },
    ],
    places: [
      {
        name: 'Hallgrimskirkja',
        category: 'Landmark',
        address: 'Hallgrimstorg 1, 101 Reykjavik',
        notes: 'Tower view if visibility is good.',
      },
      {
        name: 'Sky Lagoon',
        category: 'Spa',
        address: 'Vesturvor 44-48, Kopavogur',
        url: 'https://www.skylagoon.com/',
        notes: 'Check transfer options before booking.',
      },
    ],
  },
];
