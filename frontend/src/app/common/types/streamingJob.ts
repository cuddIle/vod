export interface StreamingJob {
    name: string;
    source: string;
    destination: string;
    start: Date;
    end: Date;
    speed: number;
    filter: string;
    id: string;
}

export function jsonToStreamingJob(json: any): StreamingJob {
    return {
        ...json,
        start: new Date(json.start),
        end: new Date(json.end),

    };
}