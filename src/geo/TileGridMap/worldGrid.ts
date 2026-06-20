/**
 * Compact, abstract world tile-grid layout. Each country is a single square
 * placed at an approximate (row, col) so continents read at a glance — this is
 * a stylised "tile grid map", NOT an accurate projection. Consumers can supply
 * their own `tiles` to override it entirely.
 *
 * row 0 = north, col 0 = west. Codes are ISO 3166-1 alpha-2.
 */
export interface WorldTile {
  code: string;
  name: string;
  row: number;
  col: number;
}

export const WORLD_TILE_GRID: WorldTile[] = [
  // --- North America ---
  { code: "GL", name: "Greenland", row: 0, col: 5 },
  { code: "CA", name: "Canada", row: 1, col: 3 },
  { code: "US", name: "United States", row: 2, col: 3 },
  { code: "MX", name: "Mexico", row: 3, col: 3 },
  { code: "CU", name: "Cuba", row: 3, col: 4 },
  { code: "GT", name: "Guatemala", row: 4, col: 3 },
  { code: "JM", name: "Jamaica", row: 4, col: 4 },
  { code: "PA", name: "Panama", row: 5, col: 4 },

  // --- South America ---
  { code: "CO", name: "Colombia", row: 6, col: 4 },
  { code: "VE", name: "Venezuela", row: 6, col: 5 },
  { code: "EC", name: "Ecuador", row: 7, col: 4 },
  { code: "PE", name: "Peru", row: 8, col: 4 },
  { code: "BR", name: "Brazil", row: 8, col: 6 },
  { code: "BO", name: "Bolivia", row: 9, col: 5 },
  { code: "PY", name: "Paraguay", row: 10, col: 5 },
  { code: "CL", name: "Chile", row: 11, col: 4 },
  { code: "AR", name: "Argentina", row: 11, col: 5 },
  { code: "UY", name: "Uruguay", row: 11, col: 6 },

  // --- Europe ---
  { code: "IS", name: "Iceland", row: 0, col: 9 },
  { code: "GB", name: "United Kingdom", row: 1, col: 9 },
  { code: "IE", name: "Ireland", row: 1, col: 8 },
  { code: "NO", name: "Norway", row: 0, col: 11 },
  { code: "SE", name: "Sweden", row: 0, col: 12 },
  { code: "FI", name: "Finland", row: 0, col: 13 },
  { code: "DK", name: "Denmark", row: 1, col: 11 },
  { code: "NL", name: "Netherlands", row: 1, col: 10 },
  { code: "DE", name: "Germany", row: 2, col: 11 },
  { code: "PL", name: "Poland", row: 2, col: 12 },
  { code: "FR", name: "France", row: 2, col: 10 },
  { code: "ES", name: "Spain", row: 3, col: 9 },
  { code: "PT", name: "Portugal", row: 3, col: 8 },
  { code: "IT", name: "Italy", row: 3, col: 11 },
  { code: "CH", name: "Switzerland", row: 3, col: 10 },
  { code: "AT", name: "Austria", row: 3, col: 12 },
  { code: "CZ", name: "Czechia", row: 2, col: 13 },
  { code: "GR", name: "Greece", row: 4, col: 12 },
  { code: "UA", name: "Ukraine", row: 2, col: 14 },
  { code: "RO", name: "Romania", row: 3, col: 13 },
  { code: "RU", name: "Russia", row: 1, col: 16 },

  // --- Middle East & Central Asia ---
  { code: "TR", name: "Turkey", row: 4, col: 14 },
  { code: "SY", name: "Syria", row: 4, col: 15 },
  { code: "IQ", name: "Iraq", row: 5, col: 15 },
  { code: "IR", name: "Iran", row: 5, col: 16 },
  { code: "SA", name: "Saudi Arabia", row: 6, col: 15 },
  { code: "IL", name: "Israel", row: 5, col: 14 },
  { code: "AE", name: "UAE", row: 6, col: 16 },
  { code: "KZ", name: "Kazakhstan", row: 3, col: 17 },
  { code: "AF", name: "Afghanistan", row: 5, col: 17 },
  { code: "PK", name: "Pakistan", row: 6, col: 17 },

  // --- Africa ---
  { code: "MA", name: "Morocco", row: 4, col: 9 },
  { code: "DZ", name: "Algeria", row: 4, col: 10 },
  { code: "TN", name: "Tunisia", row: 4, col: 11 },
  { code: "LY", name: "Libya", row: 5, col: 11 },
  { code: "EG", name: "Egypt", row: 5, col: 12 },
  { code: "ML", name: "Mali", row: 5, col: 9 },
  { code: "NG", name: "Nigeria", row: 6, col: 10 },
  { code: "ET", name: "Ethiopia", row: 6, col: 13 },
  { code: "KE", name: "Kenya", row: 7, col: 13 },
  { code: "CD", name: "DR Congo", row: 7, col: 11 },
  { code: "TZ", name: "Tanzania", row: 8, col: 12 },
  { code: "AO", name: "Angola", row: 8, col: 11 },
  { code: "ZA", name: "South Africa", row: 10, col: 11 },
  { code: "MG", name: "Madagascar", row: 9, col: 13 },

  // --- South & East Asia ---
  { code: "IN", name: "India", row: 6, col: 18 },
  { code: "LK", name: "Sri Lanka", row: 7, col: 18 },
  { code: "BD", name: "Bangladesh", row: 6, col: 19 },
  { code: "MM", name: "Myanmar", row: 6, col: 20 },
  { code: "TH", name: "Thailand", row: 7, col: 20 },
  { code: "VN", name: "Vietnam", row: 7, col: 21 },
  { code: "MY", name: "Malaysia", row: 8, col: 20 },
  { code: "ID", name: "Indonesia", row: 9, col: 21 },
  { code: "PH", name: "Philippines", row: 7, col: 22 },
  { code: "CN", name: "China", row: 5, col: 20 },
  { code: "MN", name: "Mongolia", row: 4, col: 20 },
  { code: "KR", name: "South Korea", row: 5, col: 22 },
  { code: "JP", name: "Japan", row: 5, col: 23 },

  // --- Oceania ---
  { code: "AU", name: "Australia", row: 10, col: 22 },
  { code: "NZ", name: "New Zealand", row: 11, col: 24 },
  { code: "PG", name: "Papua New Guinea", row: 9, col: 23 },
  { code: "FJ", name: "Fiji", row: 10, col: 25 },
];
