export type ItemType = {
    className?: string;
    images?: string[];
    title: string;
    metadata: string[];
    url?: string;
    page?: string;
    description: string[];
    /** ISO date strings (YYYY-MM-DD) — kept serialisable across the RSC boundary. */
    startDate?: string;
    endDate?: string;
}

export type MousePosition = {
    x: number;
    y: number;
}