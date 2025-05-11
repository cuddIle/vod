"use client";

import {useEffect, useMemo, useState} from 'react';
import {
    MantineReactTable,
    MRT_GlobalFilterTextInput,
    MRT_TablePagination,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import {StreamingJob} from "@/app/common/types/streamingJob";
 import { AppShell, Button, Group, Progress } from '@mantine/core';
import StreamingProgressBar from './streamingProgressBar';
import { useDisclosure } from '@mantine/hooks';
import CreateStreamModal from './createStreamModal';



export default function StreamingJobTable({streamingJobs}: {streamingJobs: StreamingJob[]}) {
    const [opened, { open, close }] = useDisclosure(false);
    const [progressMap, setProgressMap] = useState(new Map());

    useEffect(() => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.onmessage = (event) => {
          const { id, progress } = JSON.parse(event.data);
          setProgressMap((prevMap) => {
              const updatedMap = new Map(prevMap);
              updatedMap.set(id, progress);
              return updatedMap;
          });
      };

      return () => ws.close();
  }, []);

  const table = useMantineReactTable({
        // Table data and columns
        data: streamingJobs,
        columns: useMemo<MRT_ColumnDef<StreamingJob>[]>(
            () => [
                {
                    accessorKey: 'name', //access nested data with dot notation
                    header: 'Name',
                },
                {
                    accessorKey: 'id', //access nested data with dot notation
                    header: 'Id',
                },
                {
                    header: 'Source',
                    accessorKey: 'source',
                },
                {
                    header: 'Destination',
                    accessorKey: 'destination',
                },
                {
                    header: 'speed',
                    accessorKey: 'speed',
                },
                {
                    header: 'Status',
                    accessorFn: (row) => {
                        const progress = progressMap.get(row.id);
                        return <StreamingProgressBar progress={progress}/>;
                    }
                },
            ],
            [progressMap]
        ),
        
        // Toolbar
        renderTopToolbarCustomActions: ({ table }) => (
            <Group p="md">
                <Button
                    color="green"
                    onClick={open}
                    variant="outline"
                >
                    Create new Stream
                </Button>

                <Button
                    color="red"
                    onClick={() => {
                        console.log(table.getSelectedRowModel());
                    }}
                    variant="outline"
                >
                    Stop Stream
                </Button>
            </Group>
        ),
        
        // Table settings
        enableColumnFilters: false,
        enableFullScreenToggle: false,
        enableColumnActions: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableColumnPinning: false,
        enableSorting: false,
        enableRowSelection: true,
        paginationDisplayMode: 'pages',
        initialState: {
            showGlobalFilter: true,
        },
        mantineSearchTextInputProps: {
            m: "md",
        },
        mantinePaginationProps: {
            m: "md",
            showRowsPerPage: false,
        },
    });

    return (<>
        <MantineReactTable table={table}/>
        <CreateStreamModal opened={opened} close={close} create={(streamingJob: StreamingJob) => console.log(streamingJob)}/>
    </>)
    
}

function getRandomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}