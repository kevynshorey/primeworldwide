/**
 * pages/property/[id].tsx
 *
 * Detail page: fetch single property and render full details,
 * including image carousel and "Contact Agent" form.
 */

import { GetServerSideProps } from "next";
import { useState } from "react";
import prisma from "../../lib/db";
import { Property } from "@prisma/client";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <div className="mb-6">
        {/* Image carousel */}
        <div className="flex overflow-x-scroll space-x-4">
          {property.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Image ${idx + 1} of ${property.title}`}
              className="w-full max-w-sm rounded shadow"
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p>
            <strong>Price:</strong> {property.price}
          </p>
          <p>
            <strong>Address:</strong> {property.address}
          </p>
          <p>
            <strong>Parish:</strong> {property.parish}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms ?? "N/A"}
          </p>
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms ?? "N/A"}
          </p>
          <p>
            <strong>Lot Size:</strong> {property.lotSize ?? "N/A"}
          </p>
          <p className="mt-4">
            <a
              href={property.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-800 underline"
            >
              View Original Listing
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Contact Agent</h2>
          {status === "success" && (
            <p className="text-green-600 mb-2">Your inquiry has been sent!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mb-2">Failed to send inquiry. Please try again.</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-charcoal text-white px-4 py-2 rounded hover:bg-charcoal/90"
            >
              {status === "loading" ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const propId = parseInt(Array.isArray(id) ? id[0] : (id as string), 10);

  const property = await prisma.property.findUnique({
    where: { id: propId },
  });

  if (!property) {
    return { notFound: true };
  }

  return {
    props: {
      property: JSON.parse(JSON.stringify(property)),
    },
  };
};