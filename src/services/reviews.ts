import { httpRequest } from "./http";

export interface ReviewDto {
 id: string;
  name: string;
  rate: number;
  comment: string | null;
  country: string | null;
}

export type CreateReviewDto = Omit<ReviewDto, "id" | "created_at" | "updated_at">;
export type UpdateReviewDto = Partial<CreateReviewDto> & { id: string };

export async function fetchReviews(): Promise<ReviewDto[]> {
  return await httpRequest<ReviewDto[]>({ method: "GET", path: "/api/reviews/" });
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


