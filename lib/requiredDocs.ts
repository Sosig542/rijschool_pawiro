export const REQUIRED_DOC_TYPES = [
  "Pasfoto",
  "Rijbewijsuittreksel",
  "Leges bewijs",
  "Plakzegels",
  "Doktersverklaring",
  "Kopie ID/Rijbewijs",
] as const;

export type RequiredDocType = (typeof REQUIRED_DOC_TYPES)[number];
