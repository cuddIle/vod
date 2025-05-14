"use client";

import StreamingJobTable from "@/app/common/components/streamingJobTable";
import {useState, useEffect} from "react";
import {jsonToStreamingJob, StreamingJob, StreamingJobRequest} from "@/app/common/types/streamingJob";
import { AppShell, Burger } from "@mantine/core";
import { get } from "http";

export default function StreamingJobs() {
    const [streamingJobs, setStreamingJobs] = useState<StreamingJob[]>([]);

        // Fetch device IDs from the API
    async function getStreams(): Promise<StreamingJob[]> {
      const response = await fetch("http://localhost:8000/get_all_streams", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
          throw new Error("Failed to fetch streams");
      }
      return (await response.json()).message.map(jsonToStreamingJob);
    }

    async function createStreamingJob(streamingJobRequest: StreamingJobRequest): Promise<undefined> {
    const response = await fetch("http://localhost:8000/create_new_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(streamingJobRequest),
    });

    if (!response.ok) {
        throw new Error("Failed to create stream");
    }

    getStreams().then((newStreamingJobs) => setStreamingJobs(newStreamingJobs));
    }

    useEffect(() => {
      const interval = setInterval(() => {
        console.log("Fetching streams");
        getStreams().then((newStreamingJobs) => setStreamingJobs(newStreamingJobs));
      }, 1000);
  
      return () => clearInterval(interval);
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
    
          <AppShell.Main><StreamingJobTable createStreamingJob={createStreamingJob} streamingJobs={streamingJobs} /></AppShell.Main>
        </AppShell>
      ); 
    }


