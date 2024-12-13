import React, { useState, useRef, useEffect } from 'react';
import SockJsClient from 'react-stomp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wsUrl } from '../../../api';
import './CheckedInPatientsAlert.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Fab } from '@material-ui/core';

const CheckedInPatientsAlert = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioRefs = useRef({
        connected: new Audio('/incoming.wav'),
        messageReceived: new Audio('/incoming.wav'),
        disconnected: new Audio('/incoming.wav'),
    });

    useEffect(() => {
        // Preload sounds when enabled
        if (soundEnabled) {
            Object.values(audioRefs.current).forEach((audio) => {
                audio.load();
            });
        }
    }, [soundEnabled]);

    const playSound = (soundKey) => {
        if (soundEnabled) {
            const audio = audioRefs.current[soundKey];
            if (audio) {
                audio.play().catch((err) => {
                    console.warn('Audio playback failed:', err);
                });
            }
        }
    };

    const showToast = (message, soundKey) => {
        toast(
            <div className="toast-content">
                <p className="toast-message">{message}</p>
                <button className="toast-button" onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                </button>
            </div>,
            { autoClose: 5000, className: 'light-toast' }
        );
        playSound(soundKey);
    };

    const onConnected = () => {
        showToast('Connected to server', 'connected');
    };

    const onMessageReceived = (msg) => {
        if (msg) {
            showToast(msg, 'messageReceived');
        }
    };

    const onDisconnected = () => {
        showToast('Disconnected from server', 'disconnected');
    };

    return (
        <div>

            <Fab
                color="primary"
                aria-label="toggle-sound"
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 1000,
                    background: "#014d88"
                }}
                onClick={() => setSoundEnabled((prev) => !prev)}
            >
                {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </Fab>

            <SockJsClient
                url={wsUrl}
                topics={['/topic/checking-in-out-process']}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={onMessageReceived}
                debug={true}
            />
        </div>
    );
};

export default CheckedInPatientsAlert;
