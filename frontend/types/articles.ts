export type ArticleReview = {
  id: number;
  user: string;
  rating: number;
  created_at: string;
};

export type ArticleComment = {
  id: number;
  user: string;
  text: string;
  created_at: string;
  updated_at: string;
  replies?: ArticleComment[];
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  image_url?: string;
  source_url?: string;

  is_published?: boolean;
  average_rating?: number;
  rating_count?: number;

  like_count?: number;
  review_count?: number;
  comment_count?: number;
  is_liked?: boolean;

  goal?: {
    id: number;
    name: string;
    slug: string;
  };

  created_at?: string;
  updated_at?: string;

  reviews?: ArticleReview[];
};
