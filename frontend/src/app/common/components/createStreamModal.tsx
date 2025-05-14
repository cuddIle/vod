import '@mantine/dates/styles.css';

import { Button, Group, Modal, Slider, TextInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { StreamingJob, StreamingJobRequest } from "../types/streamingJob";
import { DateTimePicker } from "@mantine/dates";

export default function CreateStreamModal({ opened, close, create }: { opened: boolean; close: () => void, create: (streamingJob: StreamingJobRequest) => void }) {
    const [name, setName] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [speed, setSpeed] = useState(1);
    const [filter, setFilter] = useState("");
    
    const handleSubmit = () => {
        const newStreamingJob: StreamingJobRequest = {
            stream_name: name,
            username: "user", // TODO: get the username from the context
            source,
            destination,
            start: new Date(start),
            end: new Date(end),
            speed,
            filter,
        };
        create(newStreamingJob);
        close();
    };

    return (
        <Modal opened={opened} onClose={close} title="Create New Stream">
        <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextInput label="Source" value={source} onChange={(e) => setSource(e.target.value)} required />
        <TextInput label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        <DateTimePicker label="Start Date" placeholder="Pick date and time" onChange={(value) => {setStart(value)}} required/>
        <DateTimePicker label="End Date" placeholder="Pick date and time" onChange={(value) => {setEnd(value)}} required/>
        <Text size="sm">Speed</Text>
        <Slider onChange={setSpeed} value={speed} min={50} max={2000}></Slider>
        <TextInput label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
  
        <Group p="right" mt="md">
          <Button onClick={close} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} color="green">Create</Button>
        </Group>
      </Modal>
    );
  }