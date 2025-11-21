import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Mock player data (in real app, would come from state/context)
const mockPlayer = {
  name: "Rahul Sharma",
  club: "Delhi Sports Club",
  age: 16,
  registeredEvents: [
    { type: "Singles", category: "U17", partner: null },
  ],
};

const availableEvents = [
  { id: "1", type: "Singles", category: "U17" },
  { id: "2", type: "Doubles", category: "U17" },
  { id: "3", type: "Mixed Doubles", category: "U17" },
  { id: "4", type: "Singles", category: "Open" },
];

export default function EventSelection() {
  const [events, setEvents] = useState(mockPlayer.registeredEvents);

  const handleAddEvent = (eventType: string) => {
    toast.success("Event Added!", {
      description: `You've been registered for ${eventType}`,
      icon: <CheckCircle2 className="text-accent" />,
    });
    // In real app, would update backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Event Selection</h1>
        <p className="text-muted-foreground">
          Manage your tournament events
        </p>
      </div>

      {/* Player Info Card */}
      <div className="glass-card p-6 rounded-xl mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{mockPlayer.name}</h2>
            <p className="text-muted-foreground">
              {mockPlayer.club} • Age {mockPlayer.age}
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/50">
            {events.length} Event{events.length !== 1 ? "s" : ""} Registered
          </Badge>
        </div>
      </div>

      {/* Registered Events */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Registered Events</h3>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="glass-card p-5 rounded-xl flex items-center justify-between animate-slide-up"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">{event.type}</h4>
                  <p className="text-sm text-muted-foreground">{event.category}</p>
                  {event.partner && (
                    <p className="text-sm text-primary">Partner: {event.partner}</p>
                  )}
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Available Events */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Add More Events</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {availableEvents.map((event) => (
            <div
              key={event.id}
              className="glass-card p-5 rounded-xl smooth-transition hover:neon-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{event.type}</h4>
                  <p className="text-sm text-muted-foreground">{event.category}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddEvent(event.type)}
                  className="smooth-transition hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {event.type.includes("Doubles") 
                  ? "Partner selection required" 
                  : "Individual event"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
