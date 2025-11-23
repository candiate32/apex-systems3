import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { eventsApi, Event } from "@/api/eventsApi";
import { registrationsApi, Registration } from "@/api/registrationsApi";
import { authApi } from "@/api/authApi";

export default function EventSelection() {
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; club_id?: string; age?: number; club_name?: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }
        // We need to fetch the full player profile to get age and club if not in metadata
        // For now, we'll use what we have from authApi
        setCurrentUser(user);

        const [eventsData, registrationsData] = await Promise.all([
          eventsApi.getEvents(),
          registrationsApi.getRegistrations()
        ]);

        setAvailableEvents(eventsData);
        // Filter registrations for current user
        const userRegistrations = registrationsData.filter(r => r.player_id === user.id);
        setRegisteredEvents(userRegistrations);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEvent = async (event: Event) => {
    if (!currentUser) {
      toast.error("You must be logged in to register");
      return;
    }

    // Check if already registered
    if (registeredEvents.some(r => r.event_id === event.id)) {
      toast.error("You are already registered for this event");
      return;
    }

    try {
      const newRegistration = await registrationsApi.createRegistration({
        player_id: currentUser.id,
        player_name: currentUser.name,
        event_id: event.id,
        event_name: event.name,
        // partner_id: null // Handle partner selection later
      });

      // Optimistically update or re-fetch?
      // Since createRegistration returns the created object, we can append it.
      // However, we might need the event name which might not be in the response immediately if it's a join
      // But our Registration interface has event_name.
      // The API createRegistration implementation currently just inserts and returns.
      // If the DB trigger/function populates event_name, it might be there.
      // If not, we might need to manually add it for the UI state.

      const registrationWithDetails: Registration = {
        ...newRegistration,
        event_name: event.name, // Manually add for UI if missing
        player_name: currentUser.name,
        status: "pending" // Default
      };

      setRegisteredEvents([...registeredEvents, registrationWithDetails]);

      toast.success("Event Added!", {
        description: `You've been registered for ${event.name}`,
        icon: <CheckCircle2 className="text-accent" />,
      });
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Failed to register for event");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Event Selection</h1>
        <p className="text-muted-foreground">
          Manage your tournament events
        </p>
      </div>

      {/* Player Info Card */}
      {currentUser && (
        <div className="glass-card p-6 rounded-xl mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
              <p className="text-muted-foreground">
                {currentUser.club_id ? "Club Member" : "Independent Player"}
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/50">
              {registeredEvents.length} Event{registeredEvents.length !== 1 ? "s" : ""} Registered
            </Badge>
          </div>
        </div>
      )}

      {/* Registered Events */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Registered Events</h3>
        {registeredEvents.length === 0 ? (
          <div className="text-center p-8 glass-card rounded-xl text-muted-foreground">
            No events registered yet.
          </div>
        ) : (
          <div className="space-y-4">
            {registeredEvents.map((reg) => {
              // Find event details if needed, or use reg.event_name
              const event = availableEvents.find(e => e.id === reg.event_id);
              return (
                <div
                  key={reg.id}
                  className="glass-card p-5 rounded-xl flex items-center justify-between animate-slide-up"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{reg.event_name || event?.name || "Unknown Event"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event?.category} • {event?.type}
                      </p>
                      {reg.partner_name && (
                        <p className="text-sm text-primary">Partner: {reg.partner_name}</p>
                      )}
                      <Badge variant={reg.status === 'confirmed' ? 'default' : 'secondary'} className="mt-1">
                        {reg.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Events */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Events</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {availableEvents.map((event) => {
            const isRegistered = registeredEvents.some(r => r.event_id === event.id);
            return (
              <div
                key={event.id}
                className={`glass-card p-5 rounded-xl smooth-transition hover:neon-border ${isRegistered ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.category} • {event.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.gender} • {event.age_group || "Open"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddEvent(event)}
                    disabled={isRegistered || !event.registration_open}
                    className="smooth-transition hover:scale-105"
                    variant={isRegistered ? "outline" : "default"}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {event.type === "doubles" || event.type === "mixed"
                      ? "Partner selection required"
                      : "Individual event"}
                  </span>
                  {!event.registration_open && <span className="text-destructive">Registration Closed</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
