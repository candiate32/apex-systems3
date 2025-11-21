import { useState } from "react";
import { Link } from "react-router-dom";
import { mockClubs } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users, Calendar, Search, Plus } from "lucide-react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = mockClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Community</h1>
        <p className="text-muted-foreground">Explore clubs, book courts, and connect with players</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/court-booking">
          <Button className="neon-border smooth-transition hover:scale-105">
            <Calendar className="w-4 h-4 mr-2" />
            Book a Court
          </Button>
        </Link>
        <Link to="/create-club">
          <Button variant="outline" className="smooth-transition hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Create Your Club
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search clubs by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clubs Directory */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Clubs Directory
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card
              key={club.id}
              className="glass-card hover:border-primary/50 smooth-transition hover:scale-105 group"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  {club.logo ? (
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-16 h-16 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary smooth-transition">
                      {club.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {club.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{club.about}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{club.playerCount} Players</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{club.courts.length} Courts</span>
                  </div>
                </div>

                <Link to={`/club/${club.id}`}>
                  <Button className="w-full neon-border smooth-transition hover:scale-105">
                    View Club
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No clubs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
