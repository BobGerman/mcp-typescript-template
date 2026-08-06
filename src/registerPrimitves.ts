import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import registerEchoTool from "./tools/echo.ts";
import registerElicitEchoTool from "./tools/elicitEcho.ts";
import registerCodeCampSessionsTool from "./tools/codeCampSessions.ts";
import registerCodeCampSpeakersTool from "./tools/codeCampSpeakers.ts";
import registerCodeCampGeneralInfoTool from "./tools/codeCampGeneralInfo.ts";
import registerBackgroundInfoResource from "./resources/backgroundInfo.ts";

/**
 * Registers all MCP tools on the server.
 * Called once per session from getServer() in src/index.ts.
 */
export function registerPrimitives(server: McpServer): void {

  // Tools
  // registerEchoTool(server);
  // registerElicitEchoTool(server);
  registerCodeCampSessionsTool(server);
  registerCodeCampSpeakersTool(server);
  registerCodeCampGeneralInfoTool(server);

  // Resources
  // registerBackgroundInfoResource(server);
}
