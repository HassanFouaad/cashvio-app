import type { LegalSection } from '@/types';

interface LegalArticleProps {
  title: string;
  lastUpdated: string;
  intro: string;
  tocTitle: string;
  sections: Record<string, LegalSection>;
}

/**
 * Shared renderer for legal documents (privacy policy, terms & conditions).
 * Renders a header, intro, linked table of contents, and numbered sections
 * with multi-paragraph content and optional bullet lists.
 */
export function LegalArticle({
  title,
  lastUpdated,
  intro,
  tocTitle,
  sections,
}: LegalArticleProps) {
  const entries = Object.entries(sections);

  return (
    <article className="py-16 md:py-24">
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground">{lastUpdated}</p>
        </header>

        {/* Intro */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {intro.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Table of contents */}
        <nav
          aria-label={tocTitle}
          className="mb-12 rounded-xl border border-border bg-muted/40 p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {tocTitle}
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2 list-decimal ps-5 marker:text-muted-foreground">
            {entries.map(([key, section]) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {entries.map(([key, section], index) => (
            <section key={key} id={key} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {index + 1}. {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && section.items.length > 0 && (
                  <ul className="list-disc space-y-2 ps-6 text-muted-foreground leading-relaxed marker:text-muted-foreground">
                    {section.items.map((item, iIndex) => (
                      <li key={iIndex}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.footer && (
                  <p className="text-muted-foreground leading-relaxed">
                    {section.footer}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
