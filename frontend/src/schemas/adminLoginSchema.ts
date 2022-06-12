import * as z from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Korisničko ime je obvezno"),
  email: z
    .string()
    .min(1, "Adresa e-pošte je obvezna")
    .email("Adresa e-pošte nije valjana"),
  password: z.string().min(1, "Lozinka je obvezna"),
});

export const userLoginSchema = z.object({
  username: z.string().min(1, "Korisničko ime je obvezno"),
  password: z.string().min(1, "Lozinka je obvezna"),
});