// import sessions from './codeCampMockData/sessions.json' with { type: 'json' }
import speakers from './codeCampMockData/speakers.json' with { type: 'json' }

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createTextResult } from "../lib/utils.ts";

const TOOL_NAME = "codeCampSpeakers";

export default function register(server: McpServer): void {

    server.registerTool(
        "bostonCodeCampSpeakers",
        {
            title: "Boston CodeCamp Speakers",
            description: "Retrieve information about Boston CodeCamp speakers",
            inputSchema: {
                searchQuery: z.string().optional().describe("The search query for finding speakers, or 'all' to list all the speakers."),
            },
            outputSchema: {
                speakers: z.string().describe("The list of found speakers"),
            },
            annotations: {
                readOnlyHint: true,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        (args, extra) => runTool(server, args, extra),
    );
}

// Code to run when the tool is executed
async function runTool(server: McpServer, args: any, extra: { sessionId?: string; requestId: unknown }): Promise<any> {

    const searchQuery = args.searchQuery?.toLowerCase();

    let data = [];
    if (searchQuery && searchQuery != 'all') {
        data = speakers.filter((speaker) =>
            speaker.name.toLowerCase()
                .includes(searchQuery) ||
            speaker.title.toLowerCase()
                .includes(searchQuery) ||
            speaker.description.toLowerCase()
                .includes(searchQuery)
        );
    }
    else {
        data = speakers;
    }
    logger.info({ data, sessionId: extra.sessionId, requestId: extra.requestId },
        `${TOOL_NAME} Tool executed query ${args.searchQuery} and got ${data.length} results`);
    return createTextResult({ speakers: JSON.stringify(data) });
}
