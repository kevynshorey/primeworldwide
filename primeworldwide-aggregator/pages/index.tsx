/**
 * pages/index.tsx
 *
 * Homepage: server-side fetches first page of properties and renders a grid.
 * Includes pagination controls and a filter bar for quick filters.
 */

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import prisma from "../lib/db";
import { Property } from "@prisma/client";
import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";

interface HomeProps {
  initialData: {
    data: Property[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function Home({ initialData }: HomeProps) {
  const router = useRouter();
  const { data, pagination } = initialData;

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: "/",
      query: { ...router.query, page: newPage },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Prime Worldwide Properties</h1>
      <FilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query.page ? Number(context.query.page) : 1;
  const limit = context.query.limit ? Number(context.query.limit) : 9;

  const [totalCount, properties] = await Promise.all([
    prisma.property.count(),
    prisma.property.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { scrapedAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    props: {
      initialData: {
        data: JSON.parse(JSON.stringify(properties)),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      },
    },
  };
};