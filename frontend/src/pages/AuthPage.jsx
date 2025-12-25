import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const BACKEND_URL = "https://codemate-lumos.onrender.com"
const AuthPage = ({ navigateTo }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? `${BACKEND_URL}/api/auth/login` : `${BACKEND_URL}/api/auth/register`;
        const body = isLogin ? { email, password } : { username, email, password, role };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                login(data, data.token);
                navigateTo('home');
            } else {
                throw new Error(data.message || 'An error occurred');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const tabStyle = (isActive) => ({
        width: '50%',
        padding: '0.75rem',
        fontWeight: '600',
        textAlign: 'center',
        cursor: 'pointer',
        color: isActive ? '#818cf8' : '#9ca3af',
        borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
        transition: 'all 0.2s',
    });

    return (
        <div className="page-container">
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigateTo('home')}>CodeMate</h1>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #374151', marginBottom: '1.5rem' }}>
                    <div onClick={() => setIsLogin(true)} style={tabStyle(isLogin)}>Login</div>
                    <div onClick={() => setIsLogin(false)} style={tabStyle(!isLogin)}>Register</div>
                </div>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label className="form-label">Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-input" required />
                        </div>
                    )}
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="form-label">Role</label>
                            <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
                                <option value="Student">Student</option>
                                <option value="TA">TA</option>
                            </select>
                        </div>
                    )}
                    {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-indigo">{isLogin ? 'Login' : 'Create Account'}</button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;

