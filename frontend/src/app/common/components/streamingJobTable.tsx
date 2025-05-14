"use client";

import {useEffect, useMemo, useState} from 'react';
import {
    MantineReactTable,
    MRT_GlobalFilterTextInput,
    MRT_TablePagination,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import {StreamingJob, StreamingJobRequest} from "@/app/common/types/streamingJob";
 import { AppShell, Button, Group, Progress } from '@mantine/core';
import StreamingProgressBar from './streamingProgressBar';
import { useDisclosure } from '@mantine/hooks';
import CreateStreamModal from './createStreamModal';



export default function StreamingJobTable({streamingJobs, createStreamingJob}: {streamingJobs: StreamingJob[], createStreamingJob: (streamingJob: StreamingJobRequest) => void}) {
    const [opened, { open, close }] = useDisclosure(false);


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
                        return <StreamingProgressBar progress={row.progress}/>;
                    }
                    
                },
            ],
            []
        ),
        
        // Toolbar
        renderTopToolbarCustomActions: ({ table }) => (
            <Group p="xl">
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
        <CreateStreamModal opened={opened} close={close} create={createStreamingJob}/>
    </>)
    
}

function getRandomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}