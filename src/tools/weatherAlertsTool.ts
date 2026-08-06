import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createErrorResult, createTextResult } from "../lib/utils.ts";
import { logger } from "../logger.ts";

import { getAlerts, getForecast } from "../services/weatherService.ts";
import { get } from "http";

type SendLoggingMessageFn = (params: {
    level: "debug" | "info" | "notice" | "warning" | "error" | "critical" | "alert" | "emergency";
    data: unknown;
    logger?: string;
}) => Promise<void>;

/**
 * Registers all MCP tools on the server.
 * Called once per session from getServer() in src/index.ts.
 */
export default function register(server: McpServer): void {

    server.registerTool(
        "get_alerts",
        {
            title: "Get Alerts",
            description: "Get weather alerts for a state",
            inputSchema: z.object({
                state: z
                    .string()
                    .length(2)
                    .describe("Two-letter state code (e.g. CA, NY)"),
            }),
            outputSchema: {
                echo: z.string().describe("Weather alerts, if any, for the state"),
            },
            annotations: {
                readOnlyHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },

        (args, extra) => callWeatherService(server.sendLoggingMessage.bind(server), args, extra),
    );
}

async function callWeatherService(
    sendLoggingMessage: SendLoggingMessageFn,
    args: { state: string },
    extra: { sessionId?: string; requestId: unknown },
): Promise<CallToolResult> {
    const toolName = "getAlerts";
    const { sessionId, requestId } = extra;
    // Example: send an MCP log notification to the client. The client
    // controls which levels it receives via logging/setLevel.
    // See: https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/logging
    try {
        await sendLoggingMessage({
            level: "debug",
            data: { state: args.state },
            logger: "getAlerts",
        });
    } catch (error) {
        // Log notification failures must not prevent the tool from responding.
        logger.debug(
            { error: error instanceof Error ? error.message : String(error) },
            "Failed to send MCP log notification",
        );
    }

    const data = await getAlerts(args?.state);  // { echo: args.message };
    logger.info({ toolName, sessionId, requestId }, "Tool executed");
    return createTextResult(data);
}
