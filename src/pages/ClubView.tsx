import { useParams, useNavigate } from "react-router-dom";
import { mockClubs, mockPlayers } from "@/lib/mockData";
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
} from "lucide-react";

export default function ClubView() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const club = mockClubs.find((c) => c.id === clubId);

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

  const clubMembers = mockPlayers.filter((p) => club.members.includes(p.id));

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
          {club.logo ? (
            <img
              src={club.logo}
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
                <span>{club.contactInfo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{club.playerCount} Members</span>
              </div>
            </div>

            {/* Social Links */}
            {club.socialLinks && (
              <div className="flex gap-3">
                {club.socialLinks.website && (
                  <a
                    href={club.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {club.socialLinks.facebook && (
                  <a
                    href={`https://facebook.com/${club.socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {club.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${club.socialLinks.instagram}`}
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
            {club.courts.map((court) => (
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
                  onClick={() => navigate(`/court-booking?courtId=${court.id}`)}
                  className="neon-border smooth-transition hover:scale-105"
                >
                  Book
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Club Members */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Club Members
            </CardTitle>
            <CardDescription>{clubMembers.length} active members</CardDescription>
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
              <p className="text-center text-muted-foreground py-4">No members yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
