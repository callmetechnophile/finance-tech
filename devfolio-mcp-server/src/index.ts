#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Devfolio MCP Server instance
const server = new Server(
  {
    name: "devfolio-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools for Devfolio platform management
const TOOLS = [
  {
    name: "search_devfolio_hackathons",
    description: "Search active, upcoming, or past Devfolio hackathons by category, theme, or keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword e.g. 'AI', 'DeFi', 'SME Finance'" },
        status: { type: "string", enum: ["active", "upcoming", "ended", "all"], description: "Filter hackathon status" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_hackathon_details",
    description: "Get detailed information about a specific Devfolio hackathon (tracks, prizes, timelines, submission guidelines).",
    inputSchema: {
      type: "object",
      properties: {
        hackathon_slug: { type: "string", description: "Hackathon slug ID e.g. 'forge-hackathon-2026'" },
      },
      required: ["hackathon_slug"],
    },
  },
  {
    name: "generate_devfolio_submission",
    description: "Generate a fully structured Devfolio submission markdown package (Project Title, Tagline, Problem, Solution, Tech Stack, Links, Video Pitch).",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Name of the hackathon project" },
        tagline: { type: "string", description: "Elevator pitch / short tagline" },
        problem: { type: "string", description: "The problem statement solved by the project" },
        solution: { type: "string", description: "Detailed description of the technical solution" },
        tech_stack: { type: "array", items: { type: "string" }, description: "List of technologies used (Next.js, FastAPI, NVIDIA NIM, NeonDB, etc.)" },
        github_repo: { type: "string", description: "GitHub repository URL" },
        demo_url: { type: "string", description: "Live demo URL" },
        video_url: { type: "string", description: "YouTube or Loom demo video link" },
      },
      required: ["project_name", "tagline", "problem", "solution", "tech_stack"],
    },
  },
  {
    name: "validate_submission_requirements",
    description: "Check if a project submission meets Devfolio judging criteria and mandatory track requirements.",
    inputSchema: {
      type: "object",
      properties: {
        track_name: { type: "string", description: "Hackathon track e.g. 'AI Financial Operations' or 'Best Use of NVIDIA NIM'" },
        has_github: { type: "boolean", description: "Is GitHub repository link provided?" },
        has_demo: { type: "boolean", description: "Is live demo or video provided?" },
        readme_complete: { type: "boolean", description: "Is Master README documentation complete?" },
      },
      required: ["track_name", "has_github"],
    },
  },
];

// Handle listing tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_devfolio_hackathons") {
      const query = String(args?.query || "");
      const status = String(args?.status || "active");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "success",
                query,
                filter: status,
                results: [
                  {
                    slug: "forge-hackathon-2026",
                    name: "FORGE-PATH Global SME Finance AI Hackathon",
                    tagline: "Build the next-gen autonomous financial OS for manufacturing SMEs.",
                    status: "active",
                    tracks: ["AI Financial Copilot", "Treasury Yield Optimization", "OCR Ingestion Pipeline"],
                    total_prizes: "$50,000 USD",
                    deadline: "2026-07-25T23:59:59Z",
                    url: "https://devfolio.co/hackathons/forge-hackathon-2026",
                  },
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "get_hackathon_details") {
      const slug = String(args?.hackathon_slug || "forge-hackathon-2026");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug,
                name: "FORGE-PATH Global SME Finance AI Hackathon",
                organizer: "DeepMind & NVIDIA Developer Platform",
                tracks: [
                  { name: "Best AI Copilot", prize: "$15,000", criteria: "Must integrate streaming LLM inference with real-time context." },
                  { name: "Best Financial Operating System", prize: "$20,000", criteria: "Full-stack Next.js + FastAPI + Postgres architecture." },
                  { name: "Best Document Intelligence", prize: "$15,000", criteria: "Automated invoice OCR parsing with quarantine validation." },
                ],
                rules: [
                  "Repository must be public on GitHub with a open-source license.",
                  "Demo video must be under 3 minutes.",
                  "Must submit before deadline on Devfolio.",
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "generate_devfolio_submission") {
      const projectName = String(args?.project_name || "FORGE-PATH");
      const tagline = String(args?.tagline || "Autonomous Financial Operating System for Manufacturing SMEs");
      const problem = String(args?.problem || "");
      const solution = String(args?.solution || "");
      const techStack = (args?.tech_stack as string[]) || [];
      const githubRepo = String(args?.github_repo || "https://github.com/example/forge-path");
      const demoUrl = String(args?.demo_url || "https://forge-path.vercel.app");
      const videoUrl = String(args?.video_url || "https://youtu.be/demo");

      const devfolioMarkdown = `
# ${projectName}

> **${tagline}**

---

### 💡 The Problem
${problem}

---

### 🚀 Our Solution
${solution}

---

### 🛠️ Tech Stack & Integrations
${techStack.map((tech) => `- **${tech}**`).join("\n")}

---

### 🔗 Project Links
- **GitHub Repository**: [${githubRepo}](${githubRepo})
- **Live Interactive Demo**: [${demoUrl}](${demoUrl})
- **Demo Video Pitch**: [${videoUrl}](${videoUrl})
`.trim();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "generated",
                project_name: projectName,
                formatted_markdown: devfolioMarkdown,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "validate_submission_requirements") {
      const track = String(args?.track_name || "Best Financial Operating System");
      const hasGithub = Boolean(args?.has_github);
      const hasDemo = Boolean(args?.has_demo);
      const readmeComplete = Boolean(args?.readme_complete);

      const isEligible = hasGithub && (hasDemo || readmeComplete);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                track_name: track,
                is_eligible: isEligible,
                checks: {
                  github_repository: hasGithub ? "PASSED ✓" : "MISSING ❌",
                  live_demo_or_video: hasDemo ? "PASSED ✓" : "MISSING ❌",
                  master_readme: readmeComplete ? "PASSED ✓" : "WARNING ⚠️",
                },
                recommendation: isEligible
                  ? "Your Devfolio project submission is fully compliant and ready to submit!"
                  : "Ensure public GitHub repository link and demo URL are populated before submitting.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    throw new Error(`Unknown tool name: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing Devfolio MCP tool ${name}: ${error.message}`,
        },
      ],
    };
  }
});

// Start STDIO Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Devfolio MCP Server running on STDIO transport.");
}

main().catch((error) => {
  console.error("Fatal error starting Devfolio MCP Server:", error);
  process.exit(1);
});
