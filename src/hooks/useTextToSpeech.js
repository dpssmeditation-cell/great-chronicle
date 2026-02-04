import { useState, useEffect, useRef } from 'react';

const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [voices, setVoices] = useState([]);
    const [voice, setVoice] = useState(null);

    const utteranceRef = useRef(null);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
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
    }, []);

    const speak = (text) => {
        if (!isSupported) return;

        cancel(); // Stop any current speech

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
        if (!isSupported) return;
        synth.current.pause();
        setIsPaused(true);
    };

    const resume = () => {
        if (!isSupported) return;
        synth.current.resume();
        setIsPaused(false);
    };

    const cancel = () => {
        if (!isSupported) return;
        synth.current.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const changeRate = (newRate) => {
        setRate(newRate);
        // Note: Changing rate while speaking requires restarting in some browsers, 
        // but for simplicity we'll just update state for next utterance 
        // or user can restart manually if they want immediate effect.
        // For a more advanced implementation, we could pause, cancel, and restart at current position (hard to track)
    };

    return {
        isSupported,
        isPlaying,
        isPaused,
        rate,
        voice,
        voices,
        speak,
        pause,
        resume,
        cancel,
        setRate: changeRate,
        setVoice
    };
};

export default useTextToSpeech;
