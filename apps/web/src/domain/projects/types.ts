export interface ProjectCreateInput {
  title: string;
  description?: string;
  status?: string;
  notes?: string;
  coverImageUrl?: string | null;
  /** Ordered gallery Storage paths after the cover image. */
  imageKeys?: readonly string[];
  /** Authoritative supply assignment state stored on the project. */
  supplyIds?: readonly string[];
}

export interface ProjectUpdateInput {
  id: string;
  title?: string;
  description?: string | null;
  status?: string | null;
  notes?: string | null;
  coverImageUrl?: string | null;
  /** Use [] to clear the additional gallery. */
  imageKeys?: readonly string[] | null;
  /** Use [] to clear supply assignments or null to leave them unchanged. */
  supplyIds?: readonly string[] | null;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  notes?: string | null;
  coverImageUrl?: string | null;
  imageKeys: string[];
  supplyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListOptions {
  limit?: number;
  nextToken?: string | null;
}

export interface ProjectPage {
  items: Project[];
  nextToken?: string | null;
}

