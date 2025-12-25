"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "@/validations/validations";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <img src="/logo.png" alt="" className="block mx-auto rounded-xl mb-10 shadow-lg shadow-app-purple/30" width={300} height={150} />
          <h2 className="text-4xl font-bold text-app-green">Bienvenido</h2>
          <p className="mt-4 text-gray-600">
            Ingresa a tu cuenta de prueba
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all ${errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                  }`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all ${errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                  }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-app-purple py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:bg-gray-400"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-app-green"></div>
                Cargando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}