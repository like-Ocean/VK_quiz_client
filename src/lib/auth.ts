import type { AuthUser, UserRole } from '@/lib/types';

const KEY = 'quizmaster_user';

export function getUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function setUser(user: AuthUser) {
    localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser() {
    localStorage.removeItem(KEY);
}

export function roleFromEmail(email: string): UserRole {
    return email.toLowerCase().includes('organizer') ? 'organizer' : 'participant';
}

export function nameFromEmail(email: string): string {
    const local = email.split('@')[0] ?? 'User';
    return local.charAt(0).toUpperCase() + local.slice(1);
}
