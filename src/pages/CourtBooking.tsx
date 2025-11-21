import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockClubs, mockBookings } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CourtBooking() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [selectedClub, setSelectedClub] = useState(searchParams.get("clubId") || "");
  const [selectedCourt, setSelectedCourt] = useState(searchParams.get("courtId") || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to book a court.</p>
        <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
      </div>
    );
  }

  const selectedClubData = mockClubs.find((c) => c.id === selectedClub);
  const availableCourts = selectedClubData?.courts || [];
  const selectedCourtData = availableCourts.find((c) => c.id === selectedCourt);

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
  ];

  const checkAvailability = () => {
    if (!selectedDate || !startTime || !endTime) return true;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const overlapping = mockBookings.some(
      (booking) =>
        booking.courtId === selectedCourt &&
        booking.date === dateStr &&
        booking.status === "confirmed" &&
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime))
    );

    return !overlapping;
  };

  const handleBooking = () => {
    if (!selectedClub || !selectedCourt || !selectedDate || !startTime || !endTime) {
      toast.error("Missing Information", {
        description: "Please fill in all fields.",
      });
      return;
    }

    if (startTime >= endTime) {
      toast.error("Invalid Time Range", {
        description: "End time must be after start time.",
      });
      return;
    }

    if (!checkAvailability()) {
      toast.error("Court Unavailable", {
        description: "This time slot is already booked.",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Court Booked Successfully!", {
      description: `Your booking is confirmed for ${selectedDate?.toLocaleDateString()}.`,
      icon: <CheckCircle2 className="text-accent" />,
    });

    setShowConfirmDialog(false);
    setIsBooking(false);

    // Reset form
    setSelectedCourt("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Book a Court</h1>
        <p className="text-muted-foreground">Select a date, time, and court for your session</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Choose your preferred court and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Club */}
            <div className="space-y-2">
              <Label>Select Club</Label>
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a club" />
                </SelectTrigger>
                <SelectContent>
                  {mockClubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {club.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Court */}
            {selectedClub && (
              <div className="space-y-2">
                <Label>Select Court</Label>
                <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a court" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourts.map((court) => (
                      <SelectItem key={court.id} value={court.id}>
                        {court.name} ({court.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time Selection */}
            {selectedCourt && (
              <>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              onClick={handleBooking}
              className="w-full neon-border smooth-transition hover:scale-105"
              disabled={!selectedCourt || !startTime || !endTime}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book Court
            </Button>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose when you want to play</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md"
            />
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>Please review your booking details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Club:</span>
              <span className="font-medium">{selectedClubData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Court:</span>
              <span className="font-medium">{selectedCourtData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">
                {startTime} - {endTime}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBooking}
              className="flex-1 neon-border"
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
