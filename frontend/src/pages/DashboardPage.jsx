import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
const BACKEND_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_BACKEND_URL) 
  || (typeof window !== 'undefined' && window.VITE_BACKEND_URL)
  || "http://localhost:5000";
const DashboardPage = ({ navigateTo }) => {
    const [sessions, setSessions] = useState([]);
    const { token, user, logout } = useAuth();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/sessions/active/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setSessions(await res.json());
                } else {
                    throw new Error('Failed to fetch sessions');
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            }
        };
        fetchSessions();
    }, [token]);

    return (
        <div className="page-container" style={{ justifyContent: 'flex-start' }}>
            <header className="header">
                <h1 className="header-title" onClick={() => navigateTo('home')}>TA Dashboard</h1>
                <div className="header-right">
                    <span>Welcome, <span style={{ fontWeight: '600' }}>{user.username}</span></span>
                    <button onClick={() => { logout(); navigateTo('home'); }} className="btn btn-red" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </header>
            <main className="card" style={{ maxWidth: '1200px', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Active Sessions</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>Participants</th>
                                <th>Last Updated</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length > 0 ? sessions.map(session => (
                                <tr key={session._id}>
                                    <td style={{ fontFamily: 'monospace' }}>{session.roomId}</td>
                                    <td>{session.participants.length}</td>
                                    <td>{new Date(session.updatedAt).toLocaleString()}</td>
                                    <td>
                                        {session.isHandRaised
                                            ? <span style={{ color: '#facc15', fontWeight: 'bold' }}>Hand Raised!</span>
                                            : <span style={{ color: '#4ade80' }}>Active</span>
                                        }
                                    </td>
                                    <td>
                                        <button onClick={() => navigateTo('editor', session.roomId)} className="btn btn-indigo" style={{ width: 'auto', padding: '0.25rem 0.75rem' }}>
                                            Join
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>No active sessions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

