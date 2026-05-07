export interface ArticleItem {
  id: number;
  title: string;
  category: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  summary: string;
}

export interface ArticleQueryParams {
  title?: string;
  category?: string;
  status?: ArticleItem['status'];
  page: number;
  pageSize: number;
}

export interface ArticleFormData {
  title: string;
  category: string;
  summary: string;
  content?: string;
  status: 'draft' | 'published';
}
