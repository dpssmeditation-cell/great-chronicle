import React, { useEffect } from 'react';
import useTextToSpeech from '../hooks/useTextToSpeech';
import './AudioPlayer.css';

const AudioPlayer = ({ text, title }) => {
    const {
        isSupported,
        isPlaying,
        isPaused,
        rate,
        speak,
        pause,
        resume,
        cancel,
        setRate
    } = useTextToSpeech();

    // Stop audio when component unmounts or text changes
    useEffect(() => {
        return () => cancel();
    }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isSupported || !text) return null;

    const handlePlayPause = () => {
        if (isPlaying) {
            if (isPaused) {
                resume();
            } else {
                pause();
            }
        } else {
            // Add title to the beginning for context
            const fullText = `${title}. ${text}`;
            speak(fullText);
        }
    };

    const handleStop = () => {
        cancel();
    };

    const cycleRate = () => {
        const rates = [0.75, 1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(rate);
        const nextRate = rates[(currentIndex + 1) % rates.length];
        setRate(nextRate);
    };

    return (
        <div className="audio-player glass-card">
            <div className="audio-controls">
                <button
                    className="audio-btn"
                    onClick={handleStop}
                    title="Stop"
                    disabled={!isPlaying && !isPaused}
                >
                    ⏹️
                </button>

                <button
                    className="audio-btn primary"
                    onClick={handlePlayPause}
                    title={isPlaying && !isPaused ? "Pause" : "Play"}
                >
                    {isPlaying && !isPaused ? '⏸️' : '▶️'}
                </button>

                <button
                    className="audio-rate-control"
                    onClick={cycleRate}
                    title="Change Playback Speed"
                >
                    <span style={{ fontSize: '1.2em' }}>⚡</span>
                    <span className="rate-display">{rate}x</span>
                </button>
            </div>
        </div>
    );
};

export default AudioPlayer;
