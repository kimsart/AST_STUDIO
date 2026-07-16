/**
 * User-authored inventory terminology is intentionally represented by open
 * strings. Defaults and recognition results may suggest values, but they do
 * not constrain this contract.
 */
export interface SupplyTerminology {
  name: string;
  category?: string;
  subcategory?: string;
  itemType?: string;
  unit?: string;
  barcode?: string;
  tags?: readonly string[];
}

export interface SupplyCreateInput extends SupplyTerminology {
  quantityValue?: number | null;
  location?: string;
  notes?: string;
  imageKey?: string | null;
}

export interface SupplyUpdateInput {
  id: string;
  name?: string;
  category?: string | null;
  subcategory?: string | null;
  itemType?: string | null;
  unit?: string | null;
  barcode?: string | null;
  tags?: readonly string[] | null;
  quantityValue?: number | null;
  location?: string | null;
  notes?: string | null;
  imageKey?: string | null;
}

export interface Supply {
  id: string;
  name: string;
  category?: string | null;
  subcategory?: string | null;
  itemType?: string | null;
  unit?: string | null;
  barcode?: string | null;
  tags: string[];
  quantityValue?: number | null;
  /** Retained temporarily while existing integer quantities are backfilled. */
  quantity?: number | null;
  location?: string | null;
  notes?: string | null;
  imageKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyListOptions {
  limit?: number;
  nextToken?: string | null;
}

export interface SupplyPage {
  items: Supply[];
  nextToken?: string | null;
}

