import type { Category } from "./Category";

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  coverImageURL: string;
  categories: Category[];
};
