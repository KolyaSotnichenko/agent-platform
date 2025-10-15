import { NextRequest } from "next/server";
import { Client } from "@langchain/langgraph-sdk";
import { getDeployments } from "@/lib/environment/deployments";

/**
 * Creates a client for a specific deployment, using LangSmith auth only
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
 * Gets all public assistants for a deployment
 */
async function getPublicAssistants(deploymentId: string) {
  const client = createServerClient(deploymentId);
  const publicAssistants = await client.assistants.search({
    limit: 100,
    metadata: {
      _x_oap_is_public: true,
    },
  });
  return publicAssistants;
}

/**
 * GET /api/langgraph/public?deploymentId=...
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deploymentId = url.searchParams.get("deploymentId");

    if (!deploymentId) {
      return new Response(
        JSON.stringify({ error: "Missing deploymentId parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const publicAssistants = await getPublicAssistants(deploymentId);

    return new Response(JSON.stringify(publicAssistants), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting public assistants:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}