import { z } from "zod";

export const playerRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
  age: z
    .number()
    .min(10, "Age must be at least 10")
    .max(60, "Age must be at most 60"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  club: z.string().min(2, "Club name is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  eventType: z.enum(["singles", "doubles", "mixed-doubles"], {
    required_error: "Please select an event type",
  }),
  partnerId: z.string().optional(),
});

export type PlayerRegistrationFormData = z.infer<typeof playerRegistrationSchema>;

export const matchCodeSchema = z.object({
  code: z
    .string()
    .min(5, "Match code must be at least 5 characters")
    .regex(/^[A-Z0-9]+$/, "Match code must contain only uppercase letters and numbers"),
});

export const scoreSchema = z.object({
  player1Score: z.number().min(0, "Score must be positive"),
  player2Score: z.number().min(0, "Score must be positive"),
});
