"use client";

import { useState, useEffect, useMemo } from "react";
import { useTransactionStore } from "@/services/useTransactionStore";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/forms/TransactionForm";
import { Plus, ArrowUpDown, Filter, Wallet, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from "lucide-react";
import { Transaction } from "@/types";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { transactions, getAllTransactions, deleteTransaction, isLoading: dataLoading } = useTransactionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      redirect("/login");
    }
    getAllTransactions();
  }, [isAuthenticated, authLoading, getAllTransactions]);

  // Calcular resumen financiero
  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [transactions]);

  // Filtrar y ordenar transacciones
  const processedTransactions = useMemo(() => {
    return transactions
      .filter((t) => (filterType === "all" ? true : t.type === filterType))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, filterType, sortOrder]);

  // Abrir modal para crear nueva transacción
  const handleCreate = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  // Abrir modal para editar transacción
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Eliminar transacción con confirmación
  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };


  if (authLoading || (dataLoading && transactions.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-app-purple border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tus finanzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="rounded-xl object-contain shadow-lg shadow-app-purple/30" width={180} height={90} />

            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">
                Bienvenido, <span className="text-app-purple">{user?.name}</span>
              </p>
            </div>
          </div>

          {/* Botón nueva transacción */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-app-purple hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-app-purple/20 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Nueva Transacción
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Balance Neto"
            amount={netBalance}
            icon={<Wallet className="text-app-purple" />}
            accentColor="bg-app-purple/10"
          />
          <SummaryCard
            title="Total Ingresos"
            amount={totalIncome}
            icon={<ArrowUpCircle className="text-app-green" />}
            accentColor="bg-app-green/15"
          />
          <SummaryCard
            title="Total Gastos"
            amount={totalExpenses}
            icon={<ArrowDownCircle className="text-red-500" />}
            accentColor="bg-red-50"
          />
        </div>

        {/* Tabla de transacciones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Controles de filtro */}
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Historial de Transacciones</h2>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                <Filter size={16} className="ml-2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-transparent text-sm font-semibold focus:outline-none py-1 pr-3"
                >
                  <option value="all">Todos</option>
                  <option value="income">Ingresos</option>
                  <option value="expense">Gastos</option>
                </select>
              </div>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown size={16} />
                {sortOrder === "asc" ? "Antiguas" : "Recientes"}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-4">Descripción</th>
                  <th className="px-8 py-4">Fecha</th>
                  <th className="px-8 py-4 text-right">Monto</th>
                  <th className="px-8 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {processedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900 group-hover:text-app-purple transition-colors">
                        {tx.title}
                      </div>
                      <div className="text-xs font-medium text-gray-400">{tx.category}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                      {new Date(tx.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className={`px-8 py-5 text-right font-black text-lg ${tx.type === "income" ? "text-app-green" : "text-red-500"
                      }`}>
                      {tx.type === "income" ? "+" : "-"} ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tx)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? "Editar Transacción" : "Nueva Transacción"}
      >
        <TransactionForm
          onClose={() => setIsModalOpen(false)}
          transaction={editingTransaction}
        />
      </Modal>
      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar eliminación"
      >
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar la transacción
          <span className="font-semibold text-gray-900">
            {" "}“{transactionToDelete?.title}”
          </span>?
          <span className="block text-sm text-red-500 mt-2">
            Esta acción no se puede deshacer.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
          >
            Cancelar
          </button>

          <button
            onClick={async () => {
              if (!transactionToDelete) return;

              await deleteTransaction(transactionToDelete.id);
              setIsDeleteModalOpen(false);
              setTransactionToDelete(null);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Componente de card de resumen
function SummaryCard({ title, amount, icon, accentColor }: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl ${accentColor} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-0.5">${amount.toLocaleString()}</p>
      </div>
    </div>
  );
}