import { z } from "zod";
import type { Tool } from "./tool.ts";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createErrorResult, createTextResult } from "../lib/utils.ts";

export const echoTool: Tool = {
    name: "echo",
    title: "Echo",
    description: "Echo back the provided message",
    inputSchema: z.object({
        message: z.string().describe("The message to echo back"),
    }),
    outputSchema: z.object({
        echo: z.string().describe("The echoed message"),
    }),
    annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
    },
    implementation: async (server, args, extra) => {
        const { message } = args;
        try {
            await server.sendLoggingMessage({
                level: "debug",
                data: { message: args.message },
                logger: "echo",
            });
        } catch (error) {
            // Log notification failures must not prevent the tool from responding.
            logger.debug(
                { error: error instanceof Error ? error.message : String(error) },
                "Failed to send MCP log notification",
            );
        }

        const data = { echo: args.message };
        //   logger.info({ "echo", extra.sessionId, requestId }, "Tool executed");
        return createTextResult(data);

    }
}
