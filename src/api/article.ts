import request from '@/utils/request';
import type { ArticleItem, ArticleQueryParams, ArticleFormData } from '@/types/article';
import type { PaginatedResult } from '@/types/user';

export function getArticleList(params: ArticleQueryParams) {
  return request.get<never, PaginatedResult<ArticleItem>>('/articles', { params });
}

export function createArticle(data: ArticleFormData) {
  return request.post<never, ArticleItem>('/articles', data);
}

export function updateArticle(id: number, data: Partial<ArticleFormData>) {
  return request.put<never, ArticleItem>(`/articles/${id}`, data);
}

export function deleteArticle(id: number) {
  return request.delete(`/articles/${id}`);
}
