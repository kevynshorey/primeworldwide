/**
 * components/FilterBar.tsx
 *
 * Renders dropdowns/inputs for filtering by parish, price range, bedrooms, bathrooms.
 * On change, updates the URL query params, which triggers re-fetch on Search page.
 */

import { useRouter } from "next/router";
import { ChangeEvent, useState, useEffect } from "react";

export default function FilterBar() {
  const router = useRouter();
  const query = router.query;

  const [parish, setParish] = useState<string>((query.parish as string) || "");
  const [minPrice, setMinPrice] = useState<string>((query.minPrice as string) || "");
  const [maxPrice, setMaxPrice] = useState<string>((query.maxPrice as string) || "");
  const [bedrooms, setBedrooms] = useState<string>((query.bedrooms as string) || "");
  const [bathrooms, setBathrooms] = useState<string>((query.bathrooms as string) || "");

  useEffect(() => {
    setParish((query.parish as string) || "");
    setMinPrice((query.minPrice as string) || "");
    setMaxPrice((query.maxPrice as string) || "");
    setBedrooms((query.bedrooms as string) || "");
    setBathrooms((query.bathrooms as string) || "");
  }, [query]);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "parish":
        setParish(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "bedrooms":
        setBedrooms(value);
        break;
      case "bathrooms":
        setBathrooms(value);
        break;
    }
    const newQuery = {
      ...query,
      [name]: value || undefined,
      page: "1",
    };
    // Remove empty values
    Object.keys(newQuery).forEach((k) => {
      if (!newQuery[k as keyof typeof newQuery]) {
        delete newQuery[k as keyof typeof newQuery];
      }
    });
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const parishOptions = [
    "", "Christ Church", "Saint Andrew", "Saint George",
    "Saint James", "Saint John", "Saint Joseph",
    "Saint Lucy", "Saint Michael", "Saint Peter",
    "Saint Philip", "Saint Thomas",
  ];

  return (
    <div className="bg-gray-100 p-4 rounded mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Parish */}
        <div>
          <label htmlFor="parish" className="block text-sm font-medium text-gray-700">
            Parish
          </label>
          <select
            id="parish"
            name="parish"
            value={parish}
            onChange={handleFilterChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            {parishOptions.map((p) => (
              <option key={p} value={p}>
                {p || "Any"}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="e.g. 100000"
            value={minPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="e.g. 500000"
            value={maxPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
            Bedrooms (Min)
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            placeholder="e.g. 2"
            value={bedrooms}
            onChange={handleFilterChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
            Bathrooms (Min)
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            placeholder="e.g. 2"
            value={bathrooms}
            onChange={handleFilterChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}