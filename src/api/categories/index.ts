import { api } from "@/api/client";
import type { CategoryCreate, CategoryResponse } from "@/types/category";

export async function fetchCategories() {
  const response = await api.get<CategoryResponse[]>("/categories");
  return response.data;
}

export async function createCategory(payload: CategoryCreate) {
  const response = await api.post<CategoryResponse>("/categories", payload);
  return response.data;
}

export async function deleteCategory(categoryId: string) {
  const response = await api.delete<{ message: string }>(`/categories/${categoryId}`);
  return response.data;
}
