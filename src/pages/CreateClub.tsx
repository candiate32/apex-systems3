import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CreateClubFormData {
  name: string;
  location: string;
  about: string;
  contactInfo: string;
  logo?: string;
}

interface Court {
  name: string;
  type: "indoor" | "outdoor";
}

export default function CreateClub() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [newCourtName, setNewCourtName] = useState("");
  const [newCourtType, setNewCourtType] = useState<"indoor" | "outdoor">("indoor");

  const { register, handleSubmit, formState: { errors } } = useForm<CreateClubFormData>();

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to create a club.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  const addCourt = () => {
    if (!newCourtName.trim()) {
      toast.error("Court name is required");
      return;
    }

    setCourts([...courts, { name: newCourtName, type: newCourtType }]);
    setNewCourtName("");
    setNewCourtType("indoor");
    toast.success("Court added");
  };

  const removeCourt = (index: number) => {
    setCourts(courts.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateClubFormData) => {
    if (courts.length === 0) {
      toast.error("Add at least one court");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Club Created!", {
      description: `${data.name} has been successfully created.`,
      icon: <CheckCircle2 className="text-accent" />,
    });

    setIsSubmitting(false);

    // Navigate to club dashboard or community page
    setTimeout(() => {
      navigate("/community");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Create Your Club</h1>
        <p className="text-muted-foreground">Set up your sports club and start building your community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                placeholder="Enter club name"
                {...register("name", { required: "Club name is required" })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State/Country"
                {...register("location", { required: "Location is required" })}
                className={errors.location ? "border-destructive" : ""}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About the Club *</Label>
              <Textarea
                id="about"
                placeholder="Describe your club, facilities, and what makes it special..."
                rows={4}
                {...register("about", { required: "Description is required" })}
                className={errors.about ? "border-destructive" : ""}
              />
              {errors.about && (
                <p className="text-sm text-destructive">{errors.about.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                placeholder="Phone number or email"
                {...register("contactInfo", { required: "Contact info is required" })}
                className={errors.contactInfo ? "border-destructive" : ""}
              />
              {errors.contactInfo && (
                <p className="text-sm text-destructive">{errors.contactInfo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Club Logo URL (Optional)</Label>
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                {...register("logo")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Courts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add Courts</CardTitle>
            <CardDescription>Define the courts available at your club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Court Form */}
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-1">
                <Label>Court Name</Label>
                <Input
                  placeholder="e.g., Court 1"
                  value={newCourtName}
                  onChange={(e) => setNewCourtName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Court Type</Label>
                <Select value={newCourtType} onValueChange={(v) => setNewCourtType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={addCourt}
                variant="outline"
                className="smooth-transition hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Court
              </Button>
            </div>

            {/* Courts List */}
            <div className="space-y-2">
              {courts.map((court, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{court.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{court.type}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourt(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {courts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No courts added yet. Add at least one court.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full neon-border smooth-transition hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Creating Club..."
          ) : (
            <>
              <Building2 className="w-5 h-5 mr-2" />
              Create Club
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
