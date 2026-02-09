import { useState, useEffect, useRef } from 'react';

const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [voices, setVoices] = useState([]);
    const [voiceType, setVoiceType] = useState('system'); // 'system' or 'custom'
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    const utteranceRef = useRef(null);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.speechSynthesis) {
                setIsSupported(true);

                const loadVoices = () => {
                    const availableVoices = synth.current.getVoices();
                    setVoices(availableVoices);

                    // Try to set a default English voice
                    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                    setVoice(defaultVoice);
                };

                loadVoices();
                if (synth.current.onvoiceschanged !== undefined) {
                    synth.current.onvoiceschanged = loadVoices;
                }
            }

            // Initialize Audio object for custom voice
            audioRef.current = new Audio();
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };
            audioRef.current.onerror = (e) => {
                console.error("Audio playback error", e);
                setIsPlaying(false);
                setIsPaused(false);
                setIsLoading(false);
            };
        }
    }, []);

    const speak = async (text) => {
        if (!isSupported && voiceType === 'system') return;

        cancel(); // Stop any current speech

        if (voiceType === 'custom') {
            const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
            const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

            if (!apiKey || !voiceId) {
                console.error("ElevenLabs API Key or Voice ID is missing");
                alert("Please configure VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID in .env");
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: "eleven_monolingual_v1",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.5
                        }
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail?.message || 'Failed to generate speech');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                audioRef.current.src = url;
                audioRef.current.playbackRate = rate;

                // Cleanup URL on load
                audioRef.current.onloadeddata = () => {
                    // URL.revokeObjectURL(url); // careful with this if we want to replay
                };

                await audioRef.current.play();
                setIsPlaying(true);
                setIsPaused(false);
            } catch (error) {
                console.error("ElevenLabs error:", error);
                alert("Failed to reproduce voice: " + error.message);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // System Voice Logic
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        if (voice) utterance.voice = voice;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error', event);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        synth.current.speak(utterance);
    };

    const pause = () => {
        if (voiceType === 'custom') {
            audioRef.current.pause();
        } else {
            if (!isSupported) return;
            synth.current.pause();
        }
        setIsPaused(true);
    };

    const resume = () => {
        if (voiceType === 'custom') {
            audioRef.current.play();
        } else {
            if (!isSupported) return;
            synth.current.resume();
        }
        setIsPaused(false);
    };

    const cancel = () => {
        // Cancel both system and custom
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (isSupported) {
            synth.current.cancel();
        }
        setIsPlaying(false);
        setIsPaused(false);
        setIsLoading(false);
    };

    const changeRate = (newRate) => {
        setRate(newRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = newRate;
        }
    };

    return {
        isSupported,
        isPlaying,
        isPaused,
        isLoading,
        rate,
        voice,
        voices,
        voiceType,
        speak,
        pause,
        resume,
        cancel,
        setRate: changeRate,
        setVoice,
        setVoiceType
    };
};

export default useTextToSpeech;
