import { Navigate } from 'react-router-dom';

export default function HomeRedirect() {
    let role: string | null = null;

    try {
        const raw = localStorage.getItem('quizmaster_user');
        if (raw) {
            role = (JSON.parse(raw) as { role: string }).role;
        }
    } catch {
        console.error('Failed to parse user data from localStorage');
    }

    if (role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    if (role === 'participant') return <Navigate to="/participant/dashboard" replace />;
    return <Navigate to="/login" replace />;
}
