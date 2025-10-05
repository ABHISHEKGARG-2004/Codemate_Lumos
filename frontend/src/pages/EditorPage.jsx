import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import Peer from 'peerjs';
import { useAuth } from '../context/AuthContext';
import Editor from '../components/Editor';

const EditorPage = ({ roomId, navigateTo }) => {
    const { user, token, logout } = useAuth();
    const [participants, setParticipants] = useState([]);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('// Welcome to CodeMate! Start coding here.');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceOn, setIsVoiceOn] = useState(false);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const myStreamRef = useRef(null);
    const peerConnections = useRef({});

    useEffect(() => {

        socketRef.current = io('http://localhost:5000');
        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-room', { roomId, user: { ...user, userId: user._id, socketId: socketRef.current.id } });
        });
        socketRef.current.on('initial-state', (state) => {
            setCode(state.code || '');
            setLanguage(state.language || 'javascript');
            setParticipants(state.participants || []);
        });

        // Listen for a new user joining
        socketRef.current.on('user-joined', (newUser) => {
            setParticipants(prev => {
                const userExists = prev.some(p => p.userId === newUser.userId);
                if (userExists) return prev;
                return [...prev, newUser];
            });
            // If voice chat is active, call the new user
            if (peerRef.current && myStreamRef.current) {
                const call = peerRef.current.call(newUser.socketId, myStreamRef.current);
                if (call) {
                    call.on('stream', (remoteStream) => addPeerStream(newUser.socketId, remoteStream));
                    peerConnections.current[newUser.socketId] = call;
                }
            }
        });

        socketRef.current.on('user-left', ({ socketId }) => {
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
            if (peerConnections.current[socketId]) {
                peerConnections.current[socketId].close();
                delete peerConnections.current[socketId];
                removePeerStream(socketId);
            }
        });


        socketRef.current.on('code-update', newCode => setCode(newCode));
        socketRef.current.on('language-update', newLang => setLanguage(newLang));

        // Cleanup on component unmount
        return () => {
            socketRef.current.disconnect();
            if (myStreamRef.current) myStreamRef.current.getTracks().forEach(track => track.stop());
            if (peerRef.current) peerRef.current.destroy();
        };
    }, [roomId, user]);

    const onCodeChange = (newCode) => {
        setCode(newCode);
        socketRef.current.emit('code-change', { roomId, newCode });
    };

    const broadcastLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        socketRef.current.emit('language-change', { roomId, newLanguage });
    };

    const handleVoiceChat = async () => {
        if (isVoiceOn) {
            myStreamRef.current.getTracks().forEach(track => track.stop());
            if (peerRef.current) peerRef.current.destroy();
            Object.values(peerConnections.current).forEach(conn => conn.close());
            peerConnections.current = {};
            document.getElementById('peer-audio-container').innerHTML = '';
            setIsVoiceOn(false);
            return;
        }

        try {
            myStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsVoiceOn(true);
            peerRef.current = new Peer(socketRef.current.id);
            // Listen for incoming calls
            peerRef.current.on('call', (call) => {
                call.answer(myStreamRef.current); // Answer the call with your audio stream
                call.on('stream', (remoteStream) => addPeerStream(call.peer, remoteStream));
                peerConnections.current[call.peer] = call;
            });
        } catch (err) {
            console.error("Failed to get mic", err);
            alert("Could not start voice call. Please ensure you have a microphone and have granted permission.");
        }
    };

    const addPeerStream = (peerId, stream) => {
        const container = document.getElementById('peer-audio-container');
        let audio = document.getElementById(`audio-${peerId}`);
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = `audio-${peerId}`;
            audio.autoplay = true;
            container.append(audio);
        }
        audio.srcObject = stream;
    };

    const removePeerStream = (peerId) => {
        const audio = document.getElementById(`audio-${peerId}`);
        if (audio) audio.remove();
    };

    const handleRunCode = async () => {
        setIsLoading(true);
        setOutput('Executing...');
        try {
            const res = await fetch(`http://localhost:5000/api/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ language, code })
            });
            const result = await res.json();
            
            if (res.ok) {
                // This logic correctly handles the Judge0/stdout format
                if (result.stdout !== null && result.stdout !== undefined) {
                    setOutput(result.stdout);
                } else if (result.stderr) {
                    setOutput(result.stderr);
                } else {
                    setOutput('Execution finished with no output.');
                }
            } else {
                throw new Error(result.error || result.message || 'Execution failed');
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editor-page-layout">
            <header className="header">
                <div className="header-left">
                    <h1 className="header-title" onClick={() => navigateTo('home')}>CodeMate</h1>
                    <div className="header-room-id">
                        <button onClick={() => navigator.clipboard.writeText(roomId)} title="Copy Room ID">
                            Room ID: {roomId}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <button onClick={handleVoiceChat} className={`btn ${isVoiceOn ? 'btn-red' : 'btn-green'}`} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                        {isVoiceOn ? 'Leave Call' : 'Join Voice Call'}
                    </button>
                    <span>Welcome, <span style={{ fontWeight: '600' }}>{user.username}</span></span>
                    <button onClick={() => { logout(); navigateTo('home'); }} className="btn btn-red" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                        Logout
                    </button>
                </div>
            </header>
            <main className="editor-main-content">
                <div className="editor-column">
                    <div className="editor-container">
                        <Editor language={language} value={code} onChange={onCodeChange} />
                    </div>
                    <div className="output-container">
                        <div className="output-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Output</h3>
                                <select value={language} onChange={e => broadcastLanguageChange(e.target.value)} className="form-select" style={{ padding: '0.25rem 0.5rem', marginBottom: 0, width: 'auto' }}>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            <button onClick={handleRunCode} disabled={isLoading} className="btn btn-indigo" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                {isLoading ? 'Running...' : 'Run Code'}
                            </button>
                        </div>
                        <pre className="output-body">{output}</pre>
                    </div>
                </div>
                <aside className="sidebar-column">
                    <div className="sidebar">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Participants ({participants.length})</h2>
                        <ul className="participants-list">
                            {participants.map(p => <li key={p.socketId || p.userId} className="participant-item">{p.username}</li>)}
                        </ul>
                    </div>
                </aside>
            </main>
            {/* Audio elements for peers will be added here */}
            <div id="peer-audio-container"></div>
        </div>
    );
};

export default EditorPage;

