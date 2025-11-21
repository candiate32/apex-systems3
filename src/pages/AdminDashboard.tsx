import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Brackets } from "lucide-react";
import PlayersList from "@/components/admin/PlayersList";
import FixtureGeneration from "@/components/admin/FixtureGeneration";
import SchedulingPanel from "@/components/admin/SchedulingPanel";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage players, fixtures, and schedules
        </p>
      </div>

      <Tabs defaultValue="players" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="players" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Players</span>
          </TabsTrigger>
          <TabsTrigger value="fixtures" className="flex items-center space-x-2">
            <Brackets className="w-4 h-4" />
            <span>Fixtures</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="animate-fade-in">
          <PlayersList />
        </TabsContent>

        <TabsContent value="fixtures" className="animate-fade-in">
          <FixtureGeneration />
        </TabsContent>

        <TabsContent value="schedule" className="animate-fade-in">
          <SchedulingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
