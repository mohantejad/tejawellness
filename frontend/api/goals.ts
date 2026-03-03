import { apiFetch } from '@/api/base';
import type { Goal } from '@/types/goals';
import type { PaginatedResponse } from '@/types/api';

export async function fetchGoals(page = 1) {
  const data: PaginatedResponse<Goal> = await apiFetch(`/api/goals/?page=${page}`);
  return data;
}
