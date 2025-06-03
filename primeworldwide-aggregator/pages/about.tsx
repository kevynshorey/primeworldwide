/**
 * pages/about.tsx
 *
 * Static "About" page with company info.
 */

export default function About() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">About Prime Worldwide Properties</h1>
      <p className="mb-4">
        Welcome to Prime Worldwide Properties—primeworldwideproperties.com. We aggregate the latest
        Barbados real estate listings weekly from multiple trusted sources so you can browse all
        available properties in one place. Our mission is to provide a fast, reliable, and
        user-friendly platform for home seekers, investors, and real estate professionals.
      </p>
      <p>
        Listings are updated every Sunday at 03:00 UTC from respected Barbados property websites,
        including CaribList, Terra Caribbean, Realtor.com (Barbados), and major local agency portals.
        If you are an agent or owner and want to ensure your properties appear here, please contact
        us via the Contact page.
      </p>
    </div>
  );
}