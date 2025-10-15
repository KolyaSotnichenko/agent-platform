"use client";

import { useMemo, useState } from "react";
import { Filter, Search, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AgentCard } from "@/features/agents/components/agent-card";
import { CreateAgentDialog } from "@/features/agents/components/create-edit-agent-dialogs/create-agent-dialog";
import { getDeployments } from "@/lib/environment/deployments";
import { Agent } from "@/types/agent";
import { GraphGroup } from "@/features/agents/types";
import { groupAgentsByGraphs } from "@/lib/agent-utils";
import _ from "lodash";

interface OverviewDashboardProps {
    agents: Agent[];
    loading: boolean;
}

export function OverviewDashboard({ agents, loading }: OverviewDashboardProps) {
    const deployments = getDeployments();
    const [searchQuery, setSearchQuery] = useState("");
    const [graphFilter, setGraphFilter] = useState<string>("all");
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const allGraphGroups: GraphGroup[] = useMemo(() => {
        if (loading) return [];
        const groups: GraphGroup[] = [];
        deployments.forEach((deployment) => {
            const agentsInDeployment = agents.filter(
                (agent) => agent.deploymentId === deployment.id,
            );
            const agentsGroupedByGraphs = groupAgentsByGraphs(agentsInDeployment);
            agentsGroupedByGraphs.forEach((agentGroup) => {
                if (agentGroup.length > 0) {
                    const graphId = agentGroup[0].graph_id;
                    groups.push({
                        agents: agentGroup,
                        deployment,
                        graphId,
                    });
                }
            });
        });
        return groups;
    }, [agents, deployments, loading]);

    const filteredAgents = useMemo(() => {
        // 1. Фільтруємо групи на основі graphFilter dropdown
        let groupsMatchingGraphFilter: GraphGroup[];

        if (graphFilter === "all") {
            groupsMatchingGraphFilter = allGraphGroups;
        } else {
            // Парсимо комбінований ID "deploymentId:graphId"
            const [selectedDeploymentId, selectedGraphId] = graphFilter.split(":");
            groupsMatchingGraphFilter = allGraphGroups.filter(
                (group) =>
                    group.deployment.id === selectedDeploymentId &&
                    group.graphId === selectedGraphId,
            );
        }

        // 2. Отримуємо всіх агентів з груп, які відповідають фільтру графа
        const agentsInFilteredGroups = groupsMatchingGraphFilter.flatMap(
            (group) => group.agents,
        );

        // 3. Фільтруємо цих агентів на основі пошукового запиту
        const lowerCaseQuery = searchQuery.toLowerCase();
        if (!lowerCaseQuery) {
            return agentsInFilteredGroups; // Немає пошукового запиту, повертаємо всіх агентів з відфільтрованих груп
        }

        return agentsInFilteredGroups.filter((agent) =>
            agent.name.toLowerCase().includes(lowerCaseQuery),
        );
    }, [allGraphGroups, graphFilter, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Завантаження агентів...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Пошук агентів..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">Фільтри:</span>
                    </div>

                    <Select
                        value={graphFilter}
                        onValueChange={setGraphFilter}
                    >
                        <SelectTrigger className="h-9 min-w-[180px]">
                            <SelectValue placeholder="Всі шаблони" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі шаблони</SelectItem>
                            {allGraphGroups.map((graph) => (
                                <SelectItem
                                    key={`${graph.deployment.id}:${graph.graphId}`}
                                    value={`${graph.deployment.id}:${graph.graphId}`}
                                >
                                    <span className="text-muted-foreground">
                                        [{graph.deployment.name}]
                                    </span>
                                    {_.startCase(graph.graphId)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-medium">
                        {filteredAgents.length}{" "}
                        {filteredAgents.length === 1 ? "Агент" : "Агентів"}
                    </h2>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    Створити агента
                </Button>
            </div> */}

            {filteredAgents.length === 0 ? (
                <div className="animate-in fade-in-50 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                        <Users className="text-muted-foreground h-10 w-10" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">Агентів не знайдено</h2>
                    <p className="text-muted-foreground mt-2 mb-8 text-center">
                        Ми не змогли знайти жодного агента, що відповідає вашим критеріям пошуку.
                        Спробуйте змінити фільтри.
                    </p>
                    {/* <Button onClick={() => setShowCreateDialog(true)}>
                        Створити агента
                    </Button> */}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAgents.map((agent) => (
                        <AgentCard
                            key={`overview-${agent.assistant_id}`}
                            agent={agent}
                            showDeployment={true}
                        />
                    ))}
                </div>
            )}

            <CreateAgentDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />
        </div>
    );
}