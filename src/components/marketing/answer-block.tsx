import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface AnswerBlockStep {
        title: string;
        description: string;
}

interface AnswerBlockLink {
        href: string;
        label: string;
}

interface AnswerBlockProps {
        badge: string;
        question: string;
        intro: string;
        steps: AnswerBlockStep[];
        note?: string;
        relatedLinks?: AnswerBlockLink[];
        className?: string;
}

/**
 * Answer block component: a structured answer to a common question,
 * designed to rank in featured snippets and provide immediate value.
 * Uses the ledger receipt aesthetic with numbered steps and related links.
 */
export function AnswerBlock({
        badge,
        question,
        intro,
        steps,
        note,
        relatedLinks,
        className,
}: AnswerBlockProps) {
        return (
                <div
                        className={cn(
                                "receipt-edge bg-card px-6 py-8 sm:px-8 sm:py-10 max-w-3xl mx-auto",
                                className,
                        )}
                >
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-4">
                                <span className="mono-label text-primary">
                                        {badge}
                                </span>
                                <span
                                        className="tear-line flex-1"
                                        aria-hidden="true"
                                />
                        </div>

                        {/* Question */}
                        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                                {question}
                        </h2>

                        {/* Intro */}
                        <p className="text-base text-muted-foreground leading-relaxed mb-6">
                                {intro}
                        </p>

                        {/* Steps */}
                        <ol className="space-y-5 mb-6">
                                {steps.map((step, index) => (
                                        <li key={index} className="flex gap-4">
                                                <span className="font-receipt text-primary text-sm shrink-0 mt-0.5">
                                                        {String(
                                                                index + 1,
                                                        ).padStart(2, "0")}
                                                </span>
                                                <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-foreground mb-1">
                                                                {step.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                                {
                                                                        step.description
                                                                }
                                                        </p>
                                                </div>
                                        </li>
                                ))}
                        </ol>

                        {/* Note */}
                        {note && (
                                <>
                                        <div
                                                className="tear-line my-5"
                                                aria-hidden="true"
                                        />
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                                                {note}
                                        </p>
                                </>
                        )}

                        {/* Related Links */}
                        {relatedLinks && relatedLinks.length > 0 && (
                                <>
                                        <div
                                                className="tear-line my-6"
                                                aria-hidden="true"
                                        />
                                        <div className="space-y-3">
                                                <h3 className="mono-label text-primary text-xs">
                                                        {relatedLinks.length > 0
                                                                ? relatedLinks[0].label.split(
                                                                          " ",
                                                                  )[0]
                                                                : "Related"}
                                                </h3>
                                                <ul className="space-y-2">
                                                        {relatedLinks.map(
                                                                (link) => (
                                                                        <li
                                                                                key={
                                                                                        link.href
                                                                                }
                                                                        >
                                                                                <Link
                                                                                        href={
                                                                                                link.href
                                                                                        }
                                                                                        className="text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                                                                                >
                                                                                        <span
                                                                                                className="font-receipt text-primary group-hover:translate-x-0.5 transition-transform"
                                                                                                aria-hidden="true"
                                                                                        >
                                                                                                &rarr;
                                                                                        </span>
                                                                                        <span>
                                                                                                {
                                                                                                        link.label
                                                                                                }
                                                                                        </span>
                                                                                </Link>
                                                                        </li>
                                                                ),
                                                        )}
                                                </ul>
                                        </div>
                                </>
                        )}
                </div>
        );
}
