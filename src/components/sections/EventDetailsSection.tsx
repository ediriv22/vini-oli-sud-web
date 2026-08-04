import { siteConfig } from "@/data/site";

export default function EventDetailsSection() {
  const { eventDetails } = siteConfig;

  return (
    <section
      id="evento"
      aria-labelledby="evento-title"
      className="section-flow section-space"
    >
      <div className="section-shell max-w-[46rem] text-center">
        <p className="eyebrow">{eventDetails.eyebrow}</p>
        <h2
          id="evento-title"
          className="display-balance mt-4 font-display text-[clamp(2rem,4.4vw,2.9rem)] leading-[1.05] text-[var(--color-ink-strong)]"
        >
          {eventDetails.title}
        </h2>

        <p className="mt-8 font-display text-[1.6rem] text-[var(--color-wine)] sm:text-[1.9rem]">
          {eventDetails.dates}
        </p>
        <p className="font-ui mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          {eventDetails.admission}
        </p>
        <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">
          {eventDetails.villageAccessNote}
        </p>

        <div className="mt-8 rounded-[1.1rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] px-6 py-6 text-left">
          <p className="font-display text-[1.15rem] text-[var(--color-ink-strong)]">
            {eventDetails.pass.title}
          </p>
          <p className="font-ui mt-1 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)]">
            {eventDetails.pass.availabilityNote}
          </p>
          <p className="mt-3 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">
            {eventDetails.pass.intro}
          </p>
          <ul className="mt-4 space-y-1.5">
            {eventDetails.pass.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-[0.88rem] leading-[1.5] text-[var(--color-muted)]"
              >
                <span aria-hidden="true" className="mt-[0.35em] text-[var(--color-wine)]">
                  •
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[rgba(255,215,87,0.3)] pt-8">
          <p className="font-display text-[1.3rem] text-[var(--color-ink-strong)]">
            {eventDetails.venueName}
          </p>
          <p className="mt-2 text-[0.98rem] leading-[1.6] text-[var(--color-muted)]">
            {eventDetails.venueDescription}
          </p>
        </div>

        <p className="mt-8 text-[0.9rem] leading-[1.65] text-[var(--color-muted)]">
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
