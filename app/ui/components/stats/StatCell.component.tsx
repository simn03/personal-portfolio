type StatCellProps = {
  value: string;
  label: string;
  /** Native tooltip carrying the exact figure a rounded headline hides. */
  hint?: string;
};

/** One cell in a stats grid: a big tabular number over a small caption. */
export default function StatCell({ value, label, hint }: StatCellProps) {
  return (
    <div className="retro-stat" title={hint}>
      <span className="retro-stat-value">{value}</span>
      <span className="retro-eyebrow text-muted-foreground">{label}</span>
    </div>
  );
}
