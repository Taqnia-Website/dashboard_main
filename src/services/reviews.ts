import { httpRequest } from "./http";

export interface ReviewDto {
  id: string;
  customer_name: string;
  rating: number;
  comment?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateReviewDto = Omit<ReviewDto, "id" | "created_at" | "updated_at">;
export type UpdateReviewDto = Partial<CreateReviewDto> & { id: string };

export async function fetchReviews(): Promise<ReviewDto[]> {
  return await httpRequest<ReviewDto[]>({ method: "GET", path: "/reviews" });
}

export async function createReview(data: CreateReviewDto): Promise<ReviewDto> {
  return await httpRequest<ReviewDto, CreateReviewDto>({ method: "POST", path: "/reviews", body: data });
}

export async function updateReview(id: string, data: Partial<CreateReviewDto>): Promise<ReviewDto> {
  return await httpRequest<ReviewDto, Partial<CreateReviewDto>>({ method: "PUT", path: `/reviews/${id}`, body: data });
}

export async function deleteReview(id: string): Promise<void> {
  await httpRequest<void>({ method: "DELETE", path: `/reviews/${id}` });
}

export async function bulkDeleteReviews(ids: string[]): Promise<void> {
  await httpRequest<void, { ids: string[] }>({ method: "POST", path: "/reviews/bulk-delete", body: { ids } });
}


