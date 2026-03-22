import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface CartProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  type: string;
  duration: string | null;
  difficulty: string | null;
}

interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartData {
  items: CartItem[];
  total: number;
}

export function useCart() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery<CartData>({
    queryKey: ["cart"],
    queryFn: () => fetch("/api/cart").then((r) => r.json()),
    enabled: !!session,
    placeholderData: { items: [], total: 0 },
  });

  const addItem = useMutation({
    mutationFn: (productId: string) =>
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) =>
      fetch(`/api/cart/${itemId}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCart = useMutation({
    mutationFn: () => fetch("/api/cart", { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const checkout = useMutation({
    mutationFn: () =>
      fetch("/api/checkout", { method: "POST" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    itemCount: query.data?.items?.length ?? 0,
    isLoading: query.isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    checkout,
  };
}
