export type Category = 'HELP' | 'THINGS' | 'ADVICE_SKILLS' | 'CONNECTIONS' | 'OTHER';
export type Tag = 'URGENT' | 'HEARTWARMING' | 'RARE_FIND';

export interface Request {
  id: string;
  authorId: string | null;
  title: string;
  description: string | null;
  category: Category;
  tag: Tag | null;
  location: string | null;
  createdAt: string;
}

export interface Response {
  id: string;
  requestId: string;
  authorId: string | null;
  message: string;
  contact: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'HELP', label: 'Help' },
  { value: 'THINGS', label: 'Things' },
  { value: 'ADVICE_SKILLS', label: 'Advice & Skills' },
  { value: 'CONNECTIONS', label: 'Connections' },
  { value: 'OTHER', label: 'Other' },
];

export const TAGS: { value: Tag; label: string; color: string }[] = [
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'HEARTWARMING', label: 'Heartwarming', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'RARE_FIND', label: 'Rare Find', color: 'bg-blue-100 text-blue-800 border-blue-200' },
];