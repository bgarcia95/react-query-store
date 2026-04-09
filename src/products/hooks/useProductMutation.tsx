import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, productActions } from "..";

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: productActions.createProduct,
    onSuccess: (data) => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["products", { filterKey: data.category }],
      //   });

      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: data.category }],
        (oldData) => {
          if (!oldData) return [data];

          return [...oldData, data];
        },
      );
    },
  });
  return mutation;
};
