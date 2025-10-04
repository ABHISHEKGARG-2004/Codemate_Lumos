import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage = ({ navigateTo }) => {
    const [roomIdInput, setRoomIdInput] = useState('');
    const { isAuthenticated, user, token, logout } = useAuth();

    const handleJoinRoom = () => {
        if (roomIdInput.trim()) {
            if (isAuthenticated) {
                navigateTo('editor', roomIdInput.trim());
            } else {
                alert('Please log in to join a room.');
                navigateTo('auth');
            }
        }
    };

    const handleCreateRoom = async () => {
        if (!isAuthenticated) {
            alert('Please log in to create a room.');
            navigateTo('auth');
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/sessions/create`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                navigateTo('editor', data.roomId);
            } else {
                throw new Error(data.message || 'Failed to create room');
            }
        } catch (error) {
            alert(`Error creating room: ${error.message}`);
        }
    };

    return (
        <div className="page-container">
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <span>Welcome, {user?.username}!</span>
                        {user?.role === 'TA' && (
                            <button onClick={() => navigateTo('dashboard')} className="btn btn-purple" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                TA Dashboard
                            </button>
                        )}
                        <button onClick={() => { logout(); navigateTo('home'); }} className="btn btn-red" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => navigateTo('auth')} className="btn btn-blue" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                        Login / Register
                    </button>
                )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold' }}>CodeMate</h1>
                <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Your Real-Time Collaborative Coding Partner</p>
            </div>

            <div className="card">
                <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="Enter Room ID"
                    className="form-input"
                />
                <button onClick={handleJoinRoom} className="btn btn-indigo">Join Room</button>
                <div className="form-divider">OR</div>
                <button onClick={handleCreateRoom} className="btn btn-green">Create a New Room</button>
            </div>
        </div>
    );
};

export default HomePage;

