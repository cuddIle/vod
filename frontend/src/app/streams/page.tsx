"use client";

import StreamingJobTable from "@/app/common/components/streamingJobTable";
import {useState, useEffect} from "react";
import {jsonToStreamingJob, StreamingJob} from "@/app/common/types/streamingJob";
import { AppShell, Burger } from "@mantine/core";

export default function StreamingJobs() {
    const [streamingJobs, setStreamingJobs] = useState<StreamingJob[]>([]);


    useEffect(() => {
        getStreams().then((newStreamingJobs) => setStreamingJobs(newStreamingJobs))
    }, []);

    return (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
          }}
          padding="md"
        >
          <AppShell.Header>
            <Burger
              hiddenFrom="sm"
              size="sm"
            />
            <div>Logo</div>
          </AppShell.Header>
    
          <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
    
          <AppShell.Main><StreamingJobTable streamingJobs={streamingJobs} /></AppShell.Main>
        </AppShell>
      );
    }


// Fetch device IDs from the API
async function getStreams(): Promise<StreamingJob[]> {
    const response = await fetch("http://localhost:8000/get_streams", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch streams");
    }
    return (await response.json()).message.map(jsonToStreamingJob);
}
