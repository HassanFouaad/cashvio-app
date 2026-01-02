import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialsProps {
  locale: Locale;
}

const testimonialKeys = ['testimonial1', 'testimonial2', 'testimonial3'] as const;

export async function Testimonials({ locale }: TestimonialsProps) {
  const t = await getTranslations({ locale, namespace: 'home.testimonials' });

  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialKeys.map((key, index) => (
            <Card key={key} className="relative overflow-hidden">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <svg
                  className="w-10 h-10 text-primary/20 mb-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                {/* Quote */}
                <blockquote className="text-foreground mb-6">
                  &ldquo;{t(`${key}.quote`)}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {t(`${key}.author`).charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {t(`${key}.author`)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(`${key}.role`)}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-accent fill-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

