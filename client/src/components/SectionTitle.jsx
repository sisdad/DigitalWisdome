export default function SectionTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
        {eyebrow}
      </div>

      <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl leading-8 text-white/50">
          {description}
        </p>
      )}
    </div>
  );
}