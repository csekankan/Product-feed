import { Product } from "../types/product";
import { useState, useCallback, useEffect } from "react";
import { fetchProducts } from "../services/api-service";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  const [productName, setProductName] = useState<string | undefined>(undefined);
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadProducts(undefined, undefined, undefined, true);
  }, []);

  const loadProducts = async (
    name?: string,
    minimum?: number,
    maximum?: number,
    reset = false
  ) => {
    setLoading(true);
    try {
      if (reset) {
        setProducts([]); // Clear old products when searching with new filters
        setCursor(null); // Reset pagination cursor
      }

      const data = await fetchProducts(
        reset ? null : cursor,
        limit,
        minimum,
        maximum,
        name
      );

      setProducts((prev) => (reset ? data.products : [...prev, ...data.products]));
      setCursor(data.next_cursor);
      setHasNext(data.has_next);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if ((min === undefined || max === undefined || min <= max) || productName) {
      await loadProducts(productName, min, max, true);
    }
  }, [productName, min, max]);

  const reset = async () => {
    setProductName(undefined);
    setMin(undefined);
    setMax(undefined);
    await loadProducts(undefined, undefined, undefined, true);
  };

  const loadMoreRows = useCallback(
    (_: { startIndex: number; stopIndex: number }) => {
      if (!loading && hasNext) {
        loadProducts(productName, min, max, false);
      }
    },
    [loading, hasNext, productName, min, max]
  );

  const handleProductChange = useCallback(
    (id: number, newproduct:Product) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...newproduct, isUpdated: true } : product
        )
      );
    },
    []
  );

  return {
    handleSearch,
    handleProductChange,
    loadMoreRows,
    loadProducts,
    products,
    loading,
    cursor,
    hasNext,
    min,
    max,
    setMin,
    setMax,
    reset,
    productName,
    setProductName,
  };
};
