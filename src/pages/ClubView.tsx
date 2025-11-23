import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Users,
  Globe,
  Facebook,
  Instagram,
  ArrowLeft,
  Calendar,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { clubApi, Club } from "@/api/clubApi";
import { toast } from "sonner";

export default function ClubView() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      if (!clubId) return;
      try {
        const data = await clubApi.getClubById(clubId);
        setClub(data);
      } catch (error) {
        console.error("Error fetching club:", error);
        toast.error("Failed to load club details");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Club Not Found</h2>
        <p className="text-muted-foreground mb-6">The club you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/community")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </div>
    );
  }

  // Mock members for now as the API doesn't return member details yet
  const clubMembers: any[] = [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/community")}
        className="mb-6 smooth-transition hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Button>

      {/* Club Header */}
      <div className="glass-card p-8 rounded-xl mb-8 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {club.logo_url ? (
            <img
              src={club.logo_url}
              alt={club.name}
              className="w-32 h-32 rounded-xl object-cover border-2 border-primary/50"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <Building2 className="w-16 h-16 text-primary" />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 glow-text">{club.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {club.location}
              </p>
            </div>

            <p className="text-foreground/90">{club.about}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>{club.contact_info}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{club.player_count || 0} Members</span>
              </div>
            </div>

            {/* Social Links */}
            {club.social_links && (
              <div className="flex gap-3">
                {club.social_links.website && (
                  <a
                    href={club.social_links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {club.social_links.facebook && (
                  <a
                    href={`https://facebook.com/${club.social_links.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {club.social_links.instagram && (
                  <a
                    href={`https://instagram.com/${club.social_links.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Courts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Available Courts
            </CardTitle>
            <CardDescription>Book a court for your next match</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {club.courts && club.courts.length > 0 ? (
              club.courts.map((court) => (
                <div
                  key={court.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary smooth-transition"
                >
                  <div>
                    <p className="font-medium">{court.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {court.type}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/court-booking?clubId=${club.id}&courtId=${court.id}`)}
                    className="neon-border smooth-transition hover:scale-105"
                  >
                    Book
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No courts available</p>
            )}
          </CardContent>
        </Card>

        {/* Club Members */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Club Members
            </CardTitle>
            <CardDescription>{club.player_count || 0} active members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {clubMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">Age: {member.age}</p>
                </div>
                <Badge>{member.events.join(", ")}</Badge>
              </div>
            ))}
            {clubMembers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Member list not available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
