import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, productActions } from "..";

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: productActions.createProduct,
    onMutate: (product) => {
      console.log("Mutating - Optimistic Product");

      // Optimistic Procuct
      const optimisticProduct = { id: Math.random(), ...product };
      console.log({ optimisticProduct });

      // Store product in query client cache
      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (oldData) => {
          if (!oldData) return [optimisticProduct];

          return [...oldData, optimisticProduct];
        },
      );

      return { optimisticProduct };
    },
    onSuccess: (data: Product, variables, context) => {
      console.log({ data, variables, context });

      //   queryClient.invalidateQueries({
      //     queryKey: ["products", { filterKey: data.category }],
      //   });

      queryClient.removeQueries({
        queryKey: ["product", context?.optimisticProduct.id],
      });

      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: data.category }],
        (oldData) => {
          if (!oldData) return [data];

          return oldData.map((cacheProduct) => {
            return cacheProduct.id === context.optimisticProduct.id
              ? data
              : cacheProduct;
          });
        },
      );
    },
    onError: (error, variables, context) => {
      console.log({ error, variables, context });

      queryClient.removeQueries({
        queryKey: ["product", context?.optimisticProduct.id],
      });

      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: variables.category }],
        (oldData) => {
          if (!oldData) return [];

          return oldData.filter((cacheProduct) => {
            return cacheProduct.id !== context?.optimisticProduct.id;
          });
        },
      );
    },
  });
  return mutation;
};
