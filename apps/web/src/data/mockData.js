export const mockProjects = [
  {
    id: 1,
    title: "Watercolor Botanicals",
    status: "in-progress",
    notes: "A series of watercolor paintings featuring botanical subjects. Currently working on the hydrangea study.",
    budget: 150,
  },
  {
    id: 2,
    title: "Charcoal Portrait Series",
    status: "planned",
    notes: "Black and white portrait studies using charcoal on paper. Prep phase - gathering reference materials.",
    budget: 200,
  },
  {
    id: 3,
    title: "Mixed Media Collage",
    status: "on-hold",
    notes: "Experimental collage combining paper, paint, and found materials. On hold pending resource availability.",
    budget: 100,
  },
];

export const mockSupplies = [
  {
    id: 1,
    name: "Paints",
    category: "Paint",
    qty: 34,
    status: "ok",
    color: "bg-ast_purple",
    location: "Shelf A",
    condition: "Good",
  },
  {
    id: 2,
    name: "Brushes",
    category: "Brush",
    qty: 18,
    status: "ok",
    color: "bg-ast_turquoise",
    location: "Brush Cup",
    condition: "Good",
  },
  {
    id: 3,
    name: "Paper",
    category: "Paper",
    qty: 7,
    status: "low",
    color: "bg-ast_pink",
    location: "Cabinet",
    condition: "Good",
  },
  {
    id: 4,
    name: "Canvas",
    category: "Canvas",
    qty: 3,
    status: "critical",
    color: "bg-ast_pink",
    location: "Storage Rack",
    condition: "Good",
  },
  {
    id: 5,
    name: "Mediums",
    category: "Medium",
    qty: 12,
    status: "ok",
    color: "bg-ast_turquoise",
    location: "Shelf B",
    condition: "Good",
  },
];

export const mockAlerts = [
  {
    id: 1,
    text: "You were working on Watercolor Botanicals.",
    type: "memory",
  },
  {
    id: 2,
    text: "Need help? Ask how to add supplies, track condition, or prep for a show.",
    type: "help",
  },
];
