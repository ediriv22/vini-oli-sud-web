import { siteConfig } from "@/data/site";

export default function EventDetailsSection() {
  const { eventDetails } = siteConfig;

  return (
    <section
      id="evento"
      aria-labelledby="evento-title"
      className="section-flow section-space"
      data-content-key="sec:eventDetails"
    >
      <div className="section-shell max-w-[46rem] text-center">
        <p className="eyebrow" data-content-key="field:eventDetails.eyebrow">
          {eventDetails.eyebrow}
        </p>
        <h2
          id="evento-title"
          className="display-balance mt-4 font-display text-[clamp(2rem,4.4vw,2.9rem)] leading-[1.05] text-[var(--color-ink-strong)]"
          data-content-key="field:eventDetails.title"
        >
          {eventDetails.title}
        </h2>

        <p
          className="mt-8 font-display text-[1.6rem] text-[var(--color-wine)] sm:text-[1.9rem]"
          data-content-key="field:eventDetails.dates"
        >
          {eventDetails.dates}
        </p>
        <p
          className="font-ui mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]"
          data-content-key="field:eventDetails.admission"
        >
          {eventDetails.admission}
        </p>
        <p
          className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--color-muted)]"
          data-content-key="field:eventDetails.villageAccessNote"
        >
          {eventDetails.villageAccessNote}
        </p>

        <div className="mt-8 border-t border-[rgba(255,215,87,0.3)] pt-8">
          <p
            className="font-display text-[1.3rem] text-[var(--color-ink-strong)]"
            data-content-key="field:eventDetails.venueName"
          >
            {eventDetails.venueName}
          </p>
          <p
            className="mt-2 text-[0.98rem] leading-[1.6] text-[var(--color-muted)]"
            data-content-key="field:eventDetails.venueDescription"
          >
            {eventDetails.venueDescription}
          </p>
        </div>

        <p
          className="mt-8 text-[0.9rem] leading-[1.65] text-[var(--color-muted)]"
          data-content-key="field:eventDetails.collaboration"
        >
          {eventDetails.collaboration}
        </p>

        <a
          href={eventDetails.externalLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui mt-6 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)]"
        >
          {eventDetails.externalLink.label}
          <span aria-hidden="true">↗</span>
        </a>

        <div className="mt-4">
          <a
            href={eventDetails.programDownload.url}
            download
            className="font-ui inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)]"
          >
            {eventDetails.programDownload.label}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
