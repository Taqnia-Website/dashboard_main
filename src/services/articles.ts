import { httpRequest } from "./http";

export interface ArticleDto {
  id: string;
  title: string;
  author_name: string;
  category: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateArticleDto = Omit<ArticleDto, "id" | "created_at" | "updated_at">;
export type UpdateArticleDto = Partial<CreateArticleDto> & { id: string };

export async function fetchArticles(): Promise<ArticleDto[]> {
  return await httpRequest<ArticleDto[]>({ method: "GET", path: "/articles" });
}

export async function createArticle(data: CreateArticleDto): Promise<ArticleDto> {
  return await httpRequest<ArticleDto, CreateArticleDto>({ method: "POST", path: "/articles", body: data });
}

export async function updateArticle(id: string, data: Partial<CreateArticleDto>): Promise<ArticleDto> {
  return await httpRequest<ArticleDto, Partial<CreateArticleDto>>({ method: "PUT", path: `/articles/${id}`, body: data });
}

export async function deleteArticle(id: string): Promise<void> {
  await httpRequest<void>({ method: "DELETE", path: `/articles/${id}` });
}

export async function bulkDeleteArticles(ids: string[]): Promise<void> {
  await httpRequest<void, { ids: string[] }>({ method: "POST", path: "/articles/bulk-delete", body: { ids } });
}


