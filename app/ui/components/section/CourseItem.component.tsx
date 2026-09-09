import { ItemType } from "../../../lib/Definitions";
import Tag from "./Tag.component";

export type ParsedCourseMetadata = {
  /** e.g. "cpsc" (letters only). */
  department?: string;
  /** e.g. "110" or "436S". */
  courseNumber?: string;
  /** Human label derived from the course code prefix. */
  departmentLabel?: string;
  year?: string;
  grade?: string;
  skills: string[];
};

const DEPARTMENT_LABELS: Record<string, string> = {
  CPSC: "computer science",
  MATH: "mathematics",
};

const CODE_PATTERN = /^([A-Z]{2,4})\s?(\d{3}[A-Z]?)$/i;

/**
 * Splits a flat metadata tag list (["CPSC 110", "UBC", "2021", "Grade: A+",
 * "Skill: Racket"]) into structured course facts. Pure, so it can be unit
 * tested.
 */
export function parseCourseMetadata(metadata: string[]): ParsedCourseMetadata {
  const parsed: ParsedCourseMetadata = { skills: [] };

  for (const tag of metadata) {
    const codeMatch = CODE_PATTERN.exec(tag);
    if (codeMatch) {
      const letters = codeMatch[1].toUpperCase();
      parsed.department = letters.toLowerCase();
      parsed.courseNumber = codeMatch[2];
      parsed.departmentLabel = DEPARTMENT_LABELS[letters] ?? letters.toLowerCase();
      continue;
    }
    if (/^\d{4}$/.test(tag)) {
      parsed.year = tag;
      continue;
    }
    const gradeMatch = /^Grade:\s*(.+)$/.exec(tag);
    if (gradeMatch) {
      parsed.grade = gradeMatch[1];
      continue;
    }
    const skillMatch = /^Skill:\s*(.+)$/.exec(tag);
    if (skillMatch) {
      parsed.skills.push(skillMatch[1]);
    }
  }

  return parsed;
}

type CourseItemProps = {
  item: ItemType;
  className?: string;
};

/**
 * Retro "course record" card. The course code is presented like a stamped
 * ledger entry, grades/years sit quietly in the corner, and skills are the
 * only pill tags — keeping each card scannable.
 */
export default function CourseItem({ item, className }: CourseItemProps) {
  const parsed = parseCourseMetadata(item.metadata);
  const blurb = item.description[0];

  return (
    <article className={`${className ?? ""} retro-card h-full flex-col gap-3 p-4`}>
      <header className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-start gap-3">
          {parsed.department && parsed.courseNumber && (
            <span className="stamp shrink-0 rounded-md border-2 border-primary/50 bg-secondary px-2 pb-1 pt-0.5 text-center leading-tight">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                {parsed.department}
              </span>
              <span className="block font-mono text-lg font-bold text-primary">
                {parsed.courseNumber}
              </span>
            </span>
          )}

          <span className="min-w-0 pt-0.5">
            <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
            {parsed.departmentLabel && parsed.department !== undefined && (
              <p className="mt-0.5 font-mono text-xs lowercase text-muted-foreground">
                {parsed.departmentLabel}
              </p>
            )}
          </span>
        </span>

        <dl className="shrink-0 pt-0.5 text-right font-mono text-xs text-muted-foreground">
          {parsed.year && (
            <dd className="lowercase">term &lsquo;{parsed.year.slice(2)}</dd>
          )}
          {parsed.grade && (
            <dd className="mt-1 inline-block rounded border border-border px-1.5 py-0.5 text-foreground">
              {parsed.grade}
            </dd>
          )}
        </dl>
      </header>

      {blurb && (
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
      )}

      {parsed.skills.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {parsed.skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
