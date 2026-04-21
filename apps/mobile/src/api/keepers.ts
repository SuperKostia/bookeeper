import { api } from './client';

export interface KeeperCard {
  id: string;
  firstName: string | null;
  displayName: string;
  photoUrl: string | null;
  bio: string | null;
  hourlyRateCents: number;
  levels: string[];
  badges: string[];
  verified: boolean;
  travelRadiusKm: number;
  zoneLabel: string | null;
  ratingAvg: number | null;
  reviewsCount: number;
}

export interface KeeperReview {
  id: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  context: string;
  level: string;
  bookingDate: string;
  durationMinutes: number;
}

export interface KeeperDetail extends KeeperCard {
  reviews: KeeperReview[];
}

export function searchKeepers(params: { context?: string; level?: string } = {}): Promise<
  KeeperCard[]
> {
  const q = new URLSearchParams();
  if (params.context) q.set('context', params.context);
  if (params.level) q.set('level', params.level);
  const qs = q.toString();
  return api<KeeperCard[]>(`/keepers/search${qs ? `?${qs}` : ''}`);
}

export function getKeeper(id: string): Promise<KeeperDetail> {
  return api<KeeperDetail>(`/keepers/${id}`);
}
