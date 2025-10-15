import { NextRequest } from "next/server";
import { Client } from "@langchain/langgraph-sdk";
import { getDeployments } from "@/lib/environment/deployments";

/**
 * Creates a client for a specific deployment using LangSmith admin auth
 */
function createServerClient(deploymentId: string) {
  const deployment = getDeployments().find((d) => d.id === deploymentId);
  if (!deployment) {
    throw new Error(`Deployment ${deploymentId} not found`);
  }

  const client = new Client({
    apiUrl: deployment.deploymentUrl,
    apiKey: process.env.LANGSMITH_API_KEY,
    defaultHeaders: {
      "x-auth-scheme": "langsmith",
    },
  });
  return client;
}

/**
 * GET /api/langgraph/schema?deploymentId=...&agentId=...
 * Returns full schemas object from LangGraph SDK (we will use config_schema on client).
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deploymentId = url.searchParams.get("deploymentId");
    const agentId = url.searchParams.get("agentId");

    if (!deploymentId || !agentId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: deploymentId and agentId" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const client = createServerClient(deploymentId);
    const schemas = await client.assistants.getSchemas(agentId);

    return new Response(JSON.stringify(schemas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting agent config schema:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}