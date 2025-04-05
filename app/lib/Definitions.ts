import { Dayjs } from "dayjs";

export type ItemType = {
    className?: string;
    images?: string[];
    title: string;
    metadata: string[];
    url?: string;
    page?: string;
    description: string[];
    startDate?: Dayjs;
    endDate?: Dayjs;
}

export type MousePosition = {
    x: number;
    y: number;
}