import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Introduce un correo electrónico válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const transactionSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "La categoría es obligatoria"),
    date: z.string().min(1, "La fecha es obligatoria"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
