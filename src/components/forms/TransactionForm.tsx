"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/validations/validations";
import { useTransactionStore } from "@/services/useTransactionStore";
import { Transaction } from "@/types";

interface TransactionFormProps {
  onClose: () => void;
  transaction?: Transaction;
}

export default function TransactionForm({ onClose, transaction }: TransactionFormProps) {
  const { addTransaction, updateTransaction, isLoading } = useTransactionStore();

  // Determinar si estamos en modo edición
  const isEditMode = !!transaction;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
      }
      : {
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      },
  });


  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditMode) {
        // Actualizar transacción existente
        await updateTransaction({ ...data, id: transaction.id });
      } else {
        // Crear nueva transacción
        await addTransaction(data);
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título
        </label>
        <input
          {...register("title")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.title
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
          placeholder="Ej: Compra de supermercado"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Monto y Tipo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className={`w-full border rounded-lg pl-8 pr-4 py-2.5 outline-none transition-all ${errors.amount
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo
          </label>
          <select
            {...register("type")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-app-purple focus:ring-2 focus:ring-app-purple/20 transition-all bg-white font-medium"
          >
            <option value="income">💰 Ingreso</option>
            <option value="expense">💸 Gasto</option>
          </select>
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categoría
        </label>
        <input
          {...register("category")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.category
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
          placeholder="Ej: Alimentación, Salario, Transporte"
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.category.message}</p>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fecha
        </label>
        <input
          type="date"
          {...register("date")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.date
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.date.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-app-purple text-white py-2.5 rounded-lg font-semibold hover:brightness-110 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Guardando...
            </span>
          ) : (
            isEditMode ? "Actualizar" : "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}