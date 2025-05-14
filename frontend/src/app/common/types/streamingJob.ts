export interface StreamingJob {
    stream_name: string;
    username: string;
    source: string;
    destination: string;
    start: Date;
    end: Date;
    speed: number;
    filter: string;
    id: string;
    progress: number;
}

export interface StreamingJobRequest {
    stream_name: string;
    username: string;
    source: string;
    destination: string;
    start: Date;
    end: Date;
    speed: number;
    filter: string | undefined;
}

export function jsonToStreamingJob(json: any): StreamingJob {
    return {
        ...json,
        start: new Date(json.start),
        end: new Date(json.end),

    };
}