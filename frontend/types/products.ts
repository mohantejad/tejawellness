export type ProductReview = {
  id: number;
  user: string;
  rating: number;
  created_at: string;
};

export type ProductComment = {
  id: number;
  user: string;
  text: string;
  created_at: string;
  updated_at: string;
  replies?: ProductComment[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string | number;
  compare_at_price?: string | number;
  image_url?: string;
  media?: { id: number; image_url?: string; video_url?: string; is_primary?: boolean; order?: number }[];
  primary_image?: string | null;
  primary_video?: string | null;
  affiliate_url?: string;
  stock?: number;
  is_active?: boolean;

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
  reviews?: ProductReview[];
};
