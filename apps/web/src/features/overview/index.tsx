"use client";

import { useMemo } from "react";
import { useAgentsContext } from "@/providers/Agents";
import { isUserCreatedDefaultAssistant, isSystemCreatedDefaultAssistant } from "@/lib/agent-utils";
import { OverviewDashboard } from "./components/overview-dashboard";

export default function OverviewInterface() {
    const { agents, loading: agentsLoading } = useAgentsContext();

    // Фільтруємо агентів, виключаючи default агентів
    const nonDefaultAgents = useMemo(() => {
        if (agentsLoading) return [];

        return agents.filter((agent) => {
            // Виключаємо системних default агентів
            if (isSystemCreatedDefaultAssistant(agent)) {
                return false;
            }

            // Виключаємо користувацьких default агентів
            if (isUserCreatedDefaultAssistant(agent)) {
                return false;
            }

            return true;
        });
    }, [agents, agentsLoading]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground mt-2">
                    Переглядайте всіх ваших агентів
                </p>
            </div>

            <OverviewDashboard
                agents={nonDefaultAgents}
                loading={agentsLoading}
            />
        </div>
    );
}