import { create } from 'zustand';
import { Transaction } from '@/types';

interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    getAllTransactions: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    isLoading: false,

    // Get a todas las transacciones
    getAllTransactions: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockData: Transaction[] = [
            { id: '1', title: 'Salario', amount: 3000, type: 'income', category: 'Trabajo', date: '2023-10-01' },
            { id: '2', title: 'Alquiler', amount: 800, type: 'expense', category: 'Vivienda', date: '2023-10-05' },
        ];
        set({ transactions: mockData, isLoading: false });
    },

    // Add nueva transacción
    addTransaction: async (newTx) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const transaction: Transaction = {
            ...newTx,
            id: Math.random().toString()
        };

        set((state) => ({
            transactions: [transaction, ...state.transactions],
            isLoading: false
        }));
    },

    // Actualizar transacción existente
    updateTransaction: async (updatedTx) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
            transactions: state.transactions.map(tx =>
                tx.id === updatedTx.id ? updatedTx : tx
            ),
            isLoading: false
        }));
    },

    // Eliminar transacción
    deleteTransaction: async (id) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
            transactions: state.transactions.filter(tx => tx.id !== id),
            isLoading: false
        }));
    },
}));