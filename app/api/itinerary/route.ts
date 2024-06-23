import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const dummyResponse = [
  {
    day: 1,
    location: {
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    description:
      "Arrive in Paris and explore iconic landmarks such as the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.",
  },
  {
    day: 2,
    location: {
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    description:
      "Spend another day in Paris visiting Montmartre, Champs-Élysées, and enjoying French cuisine.",
  },
  {
    day: 3,
    location: {
      name: "Versailles",
      latitude: 48.8014,
      longitude: 2.1309,
    },
    description:
      "Day trip to the Palace of Versailles, a symbol of the absolute monarchy of the Ancien Régime.",
  },
  {
    day: 4,
    location: {
      name: "Loire Valley",
      latitude: 47.2986,
      longitude: 0.6769,
    },
    description:
      "Explore the charming castles and vineyards of the Loire Valley, such as Château de Chambord and Château de Chenonceau.",
  },
  {
    day: 5,
    location: {
      name: "Bordeaux",
      latitude: 44.8378,
      longitude: -0.5792,
    },
    description:
      "Travel to Bordeaux, a renowned wine region, and enjoy wine tastings and a stroll along the Garonne River.",
  },
  {
    day: 6,
    location: {
      name: "Bordeaux",
      latitude: 44.8378,
      longitude: -0.5792,
    },
    description:
      "Explore the historic city center of Bordeaux, a UNESCO World Heritage site, and indulge in the local cuisine.",
  },
  {
    day: 7,
    location: {
      name: "Provence",
      latitude: 43.9336,
      longitude: 4.8924,
    },
    description:
      "Travel to Provence, known for its picturesque villages, lavender fields, and Roman ruins.",
  },
  {
    day: 8,
    location: {
      name: "Provence",
      latitude: 43.9336,
      longitude: 4.8924,
    },
    description:
      "Visit the charming towns of Avignon, Arles, and Gordes, and savor the flavors of Provençal cuisine.",
  },
  {
    day: 9,
    location: {
      name: "Côte d'Azur",
      latitude: 43.7102,
      longitude: 7.262,
    },
    description:
      "Head to the French Riviera and relax on the beaches of Nice or Cannes, or explore the glamorous town of Monaco.",
  },
  {
    day: 10,
    location: {
      name: "Côte d'Azur",
      latitude: 43.7102,
      longitude: 7.262,
    },
    description:
      "Discover the stunning coastal scenery, chic boutiques, and vibrant nightlife of the Côte d'Azur.",
  },
  {
    day: 11,
    location: {
      name: "Lyon",
      latitude: 45.764,
      longitude: 4.8357,
    },
    description:
      "Travel to Lyon, a gastronomic paradise, and sample traditional Lyonnais dishes in a bouchon.",
  },
  {
    day: 12,
    location: {
      name: "Lyon",
      latitude: 45.764,
      longitude: 4.8357,
    },
    description:
      "Explore Lyon's Old Town, Fourvière Hill, and the traboules (secret passageways) of the city.",
  },
  {
    day: 13,
    location: {
      name: "Strasbourg",
      latitude: 48.5734,
      longitude: 7.7521,
    },
    description:
      "Visit Strasbourg, a picturesque city known for its half-timbered houses, Strasbourg Cathedral, and Christmas markets.",
  },
  {
    day: 14,
    location: {
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    description:
      "Return to Paris for some last-minute shopping, dining, or a leisurely cruise along the Seine River before departure.",
  },
]

export async function POST(request: Request) {
  // return Response.json(dummyResponse)

  const { region, timeframe } = await request.json()

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a travel planner. The user will provide a region and a timeframe in the format { region, timeframe } and you will reply with a travel itinerary as a json array in the format [{ day, location: { name, latitude, longitude }, description }]. Keep in mind that moving between cities every day is not realistic. Take into account travel distances between locations when suggesting time spent in each and location order.",
      },
      {
        role: "user",
        content: `{ region: ${region}, timeframe: ${timeframe} }`,
      },
    ],
    model: "gpt-3.5-turbo",
  })

  const { content } = completion.choices[0].message
  if (content) {
    return Response.json(JSON.parse(content))
  }
  return Response.error()
}
