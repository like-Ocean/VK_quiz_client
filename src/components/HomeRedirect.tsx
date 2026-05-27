import { Navigate } from 'react-router-dom';

export default function HomeRedirect() {
    try {
        const raw = localStorage.getItem('quizmaster_user');
        if (raw) {
            const role = (JSON.parse(raw) as { role: string }).role;
            if (role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
            if (role === 'participant') return <Navigate to="/participant/dashboard" replace />;
        }
    } catch {
        console.error('Failed to parse user data from localStorage');
    }
    return <Navigate to="/login" replace />;
}
