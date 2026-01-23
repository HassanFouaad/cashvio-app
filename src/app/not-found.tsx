import type { Metadata } from 'next';
import Link from 'next/link';

// Metadata for global 404 - don't index
export const metadata: Metadata = {
  title: '404 - Page Not Found | Cashvio',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Global Not Found Handler
 * This catches 404s outside of locale routes
 * Redirects to English locale's not-found page
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center px-4">
          <h1 className="text-[150px] font-bold text-primary/20 leading-none">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </body>
    </html>
  );
}

