import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerRegistrationSchema, PlayerRegistrationFormData } from "@/lib/validators";
import { mockPlayers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, CheckCircle2, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { csvApi, CsvValidationResponse, CsvUploadResponse } from "@/api/csvApi";

export default function Register() {
  // UI state
  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  const [availablePartners, setAvailablePartners] = useState(mockPlayers);
  const navigate = useNavigate();

  // CSV handling state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvValidation, setCsvValidation] = useState<CsvValidationResponse | null>(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  // Form handling
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlayerRegistrationFormData>({
    resolver: zodResolver(playerRegistrationSchema),
  });

  const selectedEvent = watch("eventType");
  const selectedGender = watch("gender");
  const selectedClub = watch("club");

  // Update partner list based on event type
  const handleEventChange = (value: string) => {
    setValue("eventType", value as any);
    if (value === "doubles" || value === "mixed-doubles") {
      setShowPartnerSelect(true);
      const filtered = mockPlayers.filter((p) => {
        if (value === "doubles") {
          return p.gender === selectedGender && p.club === selectedClub && !p.partnerId;
        }
        return p.club === selectedClub && !p.partnerId;
      });
      setAvailablePartners(filtered);
    } else {
      setShowPartnerSelect(false);
    }
  };

  const onSubmit = async (data: PlayerRegistrationFormData) => {
    const isDuplicate = mockPlayers.some(
      (p) => p.name.toLowerCase() === data.name.toLowerCase() && p.phone === data.phone
    );
    if (isDuplicate) {
      toast.error("Player Already Registered", {
        description: "A player with this name and phone number already exists.",
      });
      return;
    }
    if (data.partnerId) {
      const partner = mockPlayers.find((p) => p.id === data.partnerId);
      if (partner?.partnerId) {
        toast.error("Partner Unavailable", {
          description: "This partner is already paired with another player.",
        });
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Registration Successful!", {
      description: `${data.name} has been registered for ${data.eventType}.`,
      icon: <CheckCircle2 className="text-accent" />,
    });
    setTimeout(() => navigate("/events"), 1500);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setUploadingCsv(true);
    try {
      const clubName = watch("club");
      const res: CsvUploadResponse = await csvApi.registerPlayers(csvFile, clubName);
      toast.success("CSV Upload Complete", {
        description: `${res.registered_count} players registered`,
      });
      if (res.failed?.length) {
        toast.error("Some rows failed", {
          description: `${res.failed.length} rows failed. Check console for details.`,
        });
        console.warn("CSV upload failures:", res.failed);
      }
    } catch (e: any) {
      toast.error("CSV Upload Failed", { description: e.message });
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Player Registration</h1>
        <p className="text-muted-foreground">Enter your details to register for the tournament</p>
      </div>

      {/* Bulk CSV Registration */}
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold glow-text">Bulk Player Registration</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={csvApi.downloadTemplate}>
            <Download className="w-4 h-4 mr-2" /> Download Template
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setCsvFile(file);
              if (file) {
                csvApi.validateCsv(file).then(setCsvValidation);
              } else {
                setCsvValidation(null);
              }
            }}
            className="border border-input rounded-md p-1"
          />
          <Button disabled={!csvFile || uploadingCsv} onClick={handleCsvUpload}>
            {uploadingCsv ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
        {csvValidation && !csvValidation.valid && (
          <div className="text-sm text-destructive mt-2">
            Validation errors: {csvValidation.errors?.join(", ")}
          </div>
        )}
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 rounded-xl space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Player Name *</Label>
          <Input id="name" {...register("name")} placeholder="Enter full name" className={errors.name ? "border-destructive" : ""} />
          {errors.name && <p className="text-sm text-destructive animate-slide-up">{errors.name.message}</p>}
        </div>

        {/* Age & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input id="age" type="number" {...register("age", { valueAsNumber: true })} placeholder="10-60" className={errors.age ? "border-destructive" : ""} />
            {errors.age && <p className="text-sm text-destructive animate-slide-up">{errors.age.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" {...register("phone")} placeholder="10-digit number" maxLength={10} className={errors.phone ? "border-destructive" : ""} />
            {errors.phone && <p className="text-sm text-destructive animate-slide-up">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Club & Gender */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="club">Club Name *</Label>
            <Input id="club" {...register("club")} placeholder="Your club name" className={errors.club ? "border-destructive" : ""} />
            {errors.club && <p className="text-sm text-destructive animate-slide-up">{errors.club.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select onValueChange={(value) => setValue("gender", value as any)}>
              <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive animate-slide-up">{errors.gender.message}</p>}
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type *</Label>
          <Select onValueChange={handleEventChange}>
            <SelectTrigger className={errors.eventType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="singles">Singles</SelectItem>
              <SelectItem value="doubles">Doubles (Same Gender)</SelectItem>
              <SelectItem value="mixed-doubles">Mixed Doubles</SelectItem>
            </SelectContent>
          </Select>
          {errors.eventType && <p className="text-sm text-destructive animate-slide-up">{errors.eventType.message}</p>}
        </div>

        {/* Partner Selection (conditional) */}
        {showPartnerSelect && (
          <div className="space-y-2 animate-slide-up">
            <Label htmlFor="partnerId">Select Partner *</Label>
            <Select onValueChange={(value) => setValue("partnerId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose available partner" />
              </SelectTrigger>
              <SelectContent>
                {availablePartners.length > 0 ? (
                  availablePartners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} - {partner.club}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No available partners</SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Partners must be from the same club and not already paired</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full neon-border smooth-transition hover:scale-105" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : (<>
            <UserPlus className="w-5 h-5 mr-2" /> Register Player
          </>)}
        </Button>
      </form>
    </div>
  );
}
