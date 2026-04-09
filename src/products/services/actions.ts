import { type Product, productsApi } from "..";

interface GetProductsOptions {
  filterKey?: string;
}

const sleep = (s: number) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000));

export const getProducts = async ({
  filterKey,
}: GetProductsOptions): Promise<Product[]> => {
  const filteredUrl = filterKey ? `category=${filterKey}` : "";

  const { data } = await productsApi.get<Product[]>(`/products?${filteredUrl}`);
  return data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await productsApi.get<Product>(`/products/${id}`);
  return data;
};

export const createProduct = async (product: Omit<Product, "id">) => {
  await sleep(5);
  const { data } = await productsApi.post<Product>("/products", product);
  return data;
};
