/**
 * components/PropertyCard.tsx
 *
 * Displays a single property's thumbnail, title, price, and link to detail page.
 */

import Link from "next/link";
import { Property } from "@prisma/client";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <a className="block border rounded overflow-hidden hover:shadow-lg transition">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <div className="p-4 bg-white">
          <h2 className="text-xl font-semibold">{property.title}</h2>
          <p className="text-teal-800 font-medium">{property.price}</p>
          <p className="text-sm text-gray-600">{property.address}</p>
        </div>
      </a>
    </Link>
  );
}