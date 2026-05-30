// Static inspiration content feed.
// Replace individual entries or the whole structure when an API or database is ready.
// Field guide:
//   id          unique string
//   type        "art_history" | "quote" | "technique" | "featured_artist"
//   date        ISO date string — used to match Today in Art History entries to the current date
//   title       headline shown in the card
//   body        supporting text (1–3 sentences)
//   image       optional — object with { src: string (URL or data URL), alt: string }
//   source      attribution label shown below body
//   month       1-based month number — for future grouped-by-month filtering
//   day         1-based day number — for Today in Art History matching

export const artHistoryEntries = [
  {
    id: "ah-jan-01",
    type: "art_history",
    month: 1, day: 1,
    title: "New Year's Salons Open in Paris (1863)",
    body: "The Académie des Beaux-Arts opened the 1863 season, the same year the Salon des Refusés—championed by Napoleon III—gave rejected artists including Manet a public venue, shifting the course of Western painting.",
    source: "Salon des Refusés, Paris 1863",
    image: null,
  },
  {
    id: "ah-jan-15",
    type: "art_history",
    month: 1, day: 15,
    title: "Vermeer's 'Girl with a Pearl Earring' Attributed (1994)",
    body: "Renewed scholarly attention in the 1990s confirmed the attribution of this iconic Dutch Golden Age painting to Johannes Vermeer, sparking a global renaissance of interest in his small but luminous body of work.",
    source: "Mauritshuis, The Hague",
    image: null,
  },
  {
    id: "ah-feb-14",
    type: "art_history",
    month: 2, day: 14,
    title: "Brancusi's 'Bird in Space' Clears US Customs (1928)",
    body: "A federal court ruled that Brancusi's polished bronze abstraction was indeed fine art and not a taxable manufactured object, a landmark decision that expanded the legal definition of sculpture.",
    source: "United States Customs Court, 1928",
    image: null,
  },
  {
    id: "ah-mar-30",
    type: "art_history",
    month: 3, day: 30,
    title: "Van Gogh Born in Zundert (1853)",
    body: "Vincent van Gogh came into the world in a small Dutch village. He would not begin painting seriously until his late twenties, yet produced over 2,100 artworks in the decade before his death at 37.",
    source: "Van Gogh Museum, Amsterdam",
    image: null,
  },
  {
    id: "ah-apr-15",
    type: "art_history",
    month: 4, day: 15,
    title: "Leonardo da Vinci Born (1452)",
    body: "Born in Vinci, Tuscany, Leonardo would pioneer sfumato, study human anatomy through dissection, and leave notebooks filled with inventions centuries ahead of their time alongside paintings like the Mona Lisa.",
    source: "Uffizi Gallery, Florence",
    image: null,
  },
  {
    id: "ah-may-01",
    type: "art_history",
    month: 5, day: 1,
    title: "First Impressionist Exhibition Opens (1874)",
    body: "Thirty artists, including Monet, Renoir, Degas, and Berthe Morisot, mounted an independent show in Paris that critics mocked but that launched the most influential art movement of the 19th century.",
    source: "Nadar's Studio, Boulevard des Capucines, Paris",
    image: null,
  },
  {
    id: "ah-may-29",
    type: "art_history",
    month: 5, day: 29,
    title: "Picasso and Braque Experiment with Collage (1912)",
    body: "By late May 1912 Braque introduced papier collé — pasting printed paper into drawings — and Picasso quickly followed. The technique dissolved the boundary between fine art and everyday material, founding Synthetic Cubism.",
    source: "Musée Picasso, Paris",
    image: null,
  },
  {
    id: "ah-may-30",
    type: "art_history",
    month: 5, day: 30,
    title: "Frida Kahlo Completes 'The Two Fridas' (1939)",
    body: "Painted during her divorce from Diego Rivera, this double self-portrait shows two versions of Kahlo — one European, one Tehuana — their hearts exposed and connected by a single artery, a visceral study of identity and loss.",
    source: "Museo de Arte Moderno, Mexico City",
    image: null,
  },
  {
    id: "ah-jun-06",
    type: "art_history",
    month: 6, day: 6,
    title: "Velázquez Completes 'Las Meninas' (1656)",
    body: "Diego Velázquez finished this enigmatic court painting in Madrid. Its complex reflections and broken fourth wall — the artist painting while we seemingly stand in the place of the king — still generate scholarly debate.",
    source: "Museo del Prado, Madrid",
    image: null,
  },
  {
    id: "ah-jul-27",
    type: "art_history",
    month: 7, day: 27,
    title: "Van Gogh's Final Days in Auvers-sur-Oise (1890)",
    body: "On July 27, 1890, van Gogh walked into the wheat fields above Auvers and shot himself. He died two days later. In the last 70 days of his life he had completed roughly one painting per day.",
    source: "Van Gogh Museum, Amsterdam",
    image: null,
  },
  {
    id: "ah-aug-22",
    type: "art_history",
    month: 8, day: 22,
    title: "Mona Lisa Returned to the Louvre (1913)",
    body: "After being stolen in 1911 by Vincenzo Peruggia, who had hidden the painting in his apartment for two years, the Mona Lisa was recovered in Florence and returned to Paris, where thousands queued to see her.",
    source: "Musée du Louvre, Paris",
    image: null,
  },
  {
    id: "ah-sep-16",
    type: "art_history",
    month: 9, day: 16,
    title: "Jackson Pollock's Drip Paintings Debut (1948)",
    body: "Pollock's first solo show featuring his revolutionary drip technique opened to mixed but intense reactions. The technique — pouring and flinging industrial paint onto canvas laid on the floor — defined Abstract Expressionism.",
    source: "Betty Parsons Gallery, New York",
    image: null,
  },
  {
    id: "ah-oct-12",
    type: "art_history",
    month: 10, day: 12,
    title: "Banksy's 'Girl with Balloon' Self-Destructs at Auction (2018)",
    body: "Moments after selling for £1.04 million at Sotheby's London, a hidden shredder inside the gilded frame partially destroyed the canvas. The stunt instantly became one of the most discussed art events of the decade.",
    source: "Sotheby's London, 2018",
    image: null,
  },
  {
    id: "ah-nov-18",
    type: "art_history",
    month: 11, day: 18,
    title: "Georgia O'Keeffe Arrives in New Mexico (1929)",
    body: "O'Keeffe's first extended stay in Taos introduced her to the desert landscape that would define her mature work — bleached animal skulls, red cliffs, and open sky that she painted for five more decades.",
    source: "Georgia O'Keeffe Museum, Santa Fe",
    image: null,
  },
  {
    id: "ah-dec-25",
    type: "art_history",
    month: 12, day: 25,
    title: "Vermeer Christened in Delft (1632)",
    body: "Johannes Vermeer was baptized on October 31, 1632 (celebrated December 25 in some records). His 34 surviving paintings — intimate domestic scenes suffused with cool northern light — are among the most studied in Western art.",
    source: "Nieuwe Kerk, Delft",
    image: null,
  },
];

export const quotesOfTheDay = [
  {
    id: "q-001",
    type: "quote",
    body: "Every artist dips his brush in his own soul, and paints his own nature into his pictures.",
    source: "Henry Ward Beecher",
    image: null,
  },
  {
    id: "q-002",
    type: "quote",
    body: "Creativity takes courage.",
    source: "Henri Matisse",
    image: null,
  },
  {
    id: "q-003",
    type: "quote",
    body: "The role of the artist is to ask questions, not answer them.",
    source: "Anton Chekhov",
    image: null,
  },
  {
    id: "q-004",
    type: "quote",
    body: "I found I could say things with color and shapes that I couldn't say any other way — things I had no words for.",
    source: "Georgia O'Keeffe",
    image: null,
  },
  {
    id: "q-005",
    type: "quote",
    body: "Art enables us to find ourselves and lose ourselves at the same time.",
    source: "Thomas Merton",
    image: null,
  },
  {
    id: "q-006",
    type: "quote",
    body: "The purpose of art is washing the dust of daily life off our souls.",
    source: "Pablo Picasso",
    image: null,
  },
  {
    id: "q-007",
    type: "quote",
    body: "I never made one of my discoveries through the process of rational thinking.",
    source: "Albert Einstein",
    image: null,
  },
  {
    id: "q-008",
    type: "quote",
    body: "To be an artist is to believe in life.",
    source: "Henry Moore",
    image: null,
  },
  {
    id: "q-009",
    type: "quote",
    body: "Color is a power which directly influences the soul.",
    source: "Wassily Kandinsky",
    image: null,
  },
  {
    id: "q-010",
    type: "quote",
    body: "An artist is not paid for his labor but for his vision.",
    source: "James McNeill Whistler",
    image: null,
  },
  {
    id: "q-011",
    type: "quote",
    body: "Every child is an artist. The problem is how to remain an artist once we grow up.",
    source: "Pablo Picasso",
    image: null,
  },
  {
    id: "q-012",
    type: "quote",
    body: "Art is not what you see, but what you make others see.",
    source: "Edgar Degas",
    image: null,
  },
  {
    id: "q-013",
    type: "quote",
    body: "The artist's job is to be a witness to his time in history.",
    source: "Robert Rauschenberg",
    image: null,
  },
  {
    id: "q-014",
    type: "quote",
    body: "I paint my own reality. The only thing I know is that I paint because I need to.",
    source: "Frida Kahlo",
    image: null,
  },
  {
    id: "q-015",
    type: "quote",
    body: "Art is never finished, only abandoned.",
    source: "Leonardo da Vinci",
    image: null,
  },
];

// Returns the art history entry closest to today's month/day.
// Exact match preferred; falls back to nearest by day-of-year.
export function getTodayInArtHistory() {
  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();

  const exact = artHistoryEntries.find(e => e.month === todayMonth && e.day === todayDay);
  if (exact) return exact;

  const todayDOY = dayOfYear(todayMonth, todayDay);
  return artHistoryEntries.reduce((closest, entry) => {
    const entryDOY = dayOfYear(entry.month, entry.day);
    const closestDOY = dayOfYear(closest.month, closest.day);
    return Math.abs(entryDOY - todayDOY) < Math.abs(closestDOY - todayDOY) ? entry : closest;
  });
}

function dayOfYear(month, day) {
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let doy = day;
  for (let m = 1; m < month; m++) doy += daysInMonth[m];
  return doy;
}

// Returns a deterministic quote for today (rotates daily).
export function getQuoteOfTheDay() {
  const now = new Date();
  const index = (now.getFullYear() * 366 + dayOfYear(now.getMonth() + 1, now.getDate())) % quotesOfTheDay.length;
  return quotesOfTheDay[index];
}
