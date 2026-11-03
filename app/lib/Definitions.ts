export type ItemType = {
    className?: string;
    images?: string[];
    title: string;
    metadata: string[];
    url?: string;
    /** Slug used for in-page anchors (project cards render as `#project-<id>`). */
    id?: string;
    /** One short label shown beside the title, e.g. "Startup" or "Freelance". */
    badge?: string;
    /** On a work item: the `id` of the project card it points to. */
    project?: string;
    description: string[];
    /** ISO date strings (YYYY-MM-DD) — kept serialisable across the RSC boundary. */
    startDate?: string;
    endDate?: string;
}

export type MousePosition = {
    x: number;
    y: number;
}