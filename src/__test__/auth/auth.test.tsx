import { jest, describe, it, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    __esModule: true, // Esto es vital para que Jest trate el mock correctamente
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

import { useAuth, AuthProvider } from '@/context/AuthContext';

// Mock de localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


describe('AuthContext', () => {
    it('realiza login y actualiza el estado', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('test@mail.com');
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('test@mail.com');
    });
});
