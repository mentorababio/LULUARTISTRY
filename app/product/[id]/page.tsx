"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";

const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await api.products.getSingle(params.id as string);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return <ProductDetail product={product} />;
};

export default ProductPage;
