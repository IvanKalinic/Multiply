import * as z from "zod";

export const adminRegisterSchema = z.object({
  username: z.string().min(1, "Korisničko ime je obvezno"),
  email: z
    .string()
    .min(1, "Adresa e-pošte je obvezna")
    .email("Adresa e-pošte nije valjana"),
  password: z.string().min(1, "Lozinka je obvezna"),
  passwordAgain: z.string().min(1, "Ponovljena lozinka je obvezna"),
});
