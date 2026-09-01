import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export interface RelatedContentLink {
  href: string;
  label: string;
}

interface RelatedContentProps {
  title: string;
  links: RelatedContentLink[];
  className?: string;
}

/**
 * Shared internal-link block for product pages, tools, and documentation.
 * Links use the locale-aware navigation helper so English stays unprefixed
 * and Arabic receives the /ar prefix automatically.
 */
export function RelatedContent({
  title,
  links,
  className,
}: RelatedContentProps) {
  if (links.length === 0) return null;

  return (
    <section aria-label={title} className={cn("section-padding-sm", className)}>
      <div className="container-wide">
        <div className="receipt-edge bg-card px-6 py-7 sm:px-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-5">
            {title}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-start gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span
                    className="font-receipt text-primary"
                    aria-hidden="true"
                  >
                    +
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
