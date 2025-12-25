export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}