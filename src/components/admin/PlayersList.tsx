import { useState } from "react";
import { mockPlayers } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

export default function PlayersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players] = useState(mockPlayers);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (playerId: string, playerName: string) => {
    toast.success("Player Deleted", {
      description: `${playerName} has been removed from the tournament.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" className="smooth-transition">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Players Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Age</th>
                <th className="text-left p-4 font-semibold">Club</th>
                <th className="text-left p-4 font-semibold">Gender</th>
                <th className="text-left p-4 font-semibold">Events</th>
                <th className="text-left p-4 font-semibold">Partner</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className="border-b border-border/50 hover:bg-secondary/30 smooth-transition animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4 font-medium">{player.name}</td>
                  <td className="p-4 text-muted-foreground">{player.age}</td>
                  <td className="p-4 text-muted-foreground">{player.club}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="capitalize">
                      {player.gender}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {player.events.map((event, i) => (
                        <Badge key={i} className="bg-primary/20 text-primary border-primary/50">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {player.partnerName || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="smooth-transition hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="smooth-transition hover:text-destructive"
                        onClick={() => handleDelete(player.id, player.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-primary">{players.length}</div>
          <div className="text-sm text-muted-foreground">Total Players</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-accent">
            {players.filter((p) => p.gender === "male").length}
          </div>
          <div className="text-sm text-muted-foreground">Male</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neon-purple">
            {players.filter((p) => p.gender === "female").length}
          </div>
          <div className="text-sm text-muted-foreground">Female</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neon-green">
            {players.filter((p) => p.partnerId).length}
          </div>
          <div className="text-sm text-muted-foreground">Doubles Players</div>
        </div>
      </div>
    </div>
  );
}
