import { SCALETTA } from "@/data/prenota";

/** Elenco giorno per giorno delle degustazioni (dati in src/data/prenota.ts). */
export default function ScalettaDegustazioni() {
  return (
    <div className="flex flex-col gap-8 text-left">
      {SCALETTA.map(({ giorno, slot }) => (
        <div key={giorno}>
          <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
            {giorno}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {slot.map((s) => (
              <li
                key={s.ora + s.nome}
                className="flex flex-wrap items-baseline gap-x-4 rounded-[0.9rem] border border-[rgba(47,91,70,0.18)] bg-[rgba(255,253,245,0.6)] px-4 py-3"
              >
                <span className="font-ui text-[0.9rem] font-semibold text-[var(--color-wine)]">{s.ora}</span>
                <span className="text-[0.98rem] text-[var(--color-ink-strong)]">{s.nome}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
