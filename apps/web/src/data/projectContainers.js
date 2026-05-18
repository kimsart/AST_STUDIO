export const PROJECT_STATUSES = [
  { value: "planned",     label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "on-hold",     label: "On Hold" },
  { value: "completed",   label: "Completed" },
];

export const CANONICAL_STATUS_VALUES = new Set(PROJECT_STATUSES.map(s => s.value));
