export type Temperature = 'hot' | 'cold' | 'both';

export interface BubbleTea {
  id?: number;
  name: string;
  temperature: Temperature;
  price: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BubbleTeaFilter {
  temperature?: Temperature | '';
  activeOnly?: boolean;
  search?: string;
}