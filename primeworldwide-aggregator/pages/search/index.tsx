/**
 * pages/search/index.tsx
 *
 * Search page: allows dynamic client-side filtering via /api/properties.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropertyCard from "../../components/PropertyCard";
import FilterBar from "../../components/FilterBar";
import { Property } from "@prisma/client";

export default function SearchPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{ page: number; totalPages: number }>({
    page: 1,
    totalPages: 1,
  });

  const fetchProperties = async () => {
    setLoading(true);
    const query = new URLSearchParams(router.query as Record<string, string>).toString();
    const res = await fetch(`/api/properties?${query}`);
    const result = await res.json();
    setProperties(result.data);
    setPagination({ page: result.pagination.page, totalPages: result.pagination.totalPages });
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: "/search",
      query: { ...router.query, page: newPage },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Search Properties</h1>
      <FilterBar />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
      <div className="flex justify-center items-center mt-8 space-x-4">
        {Array.from({ length: pagination.totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 border ${
                pageNum === pagination.page
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal"
              } rounded`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}