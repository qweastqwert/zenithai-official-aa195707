import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { toast } from 'sonner';

interface VoiceModeProps {
  open: boolean;
  onClose: () => void;
  isAssistantThinking: boolean;
  lastAssistantMessage: string;
  onUserUtterance: (text: string) => void;
}

/**
 * Call-like voice mode for MindMate.
 * STT: browser Web Speech API (local, no API key).
 * TTS: browser speechSynthesis (local voices).
 */
export default function VoiceMode({
  open,
  onClose,
  isAssistantThinking,
  lastAssistantMessage,
  onUserUtterance,
}: VoiceModeProps) {
  const stt = useSpeechRecognition();
  const tts = useSpeechSynthesis();
  const [muted, setMuted] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const lastSpokenRef = useRef<string>('');
  const lastSentRef = useRef<string>('');

  // Auto-start listening when opened
  useEffect(() => {
    if (!open) return;
    if (!stt.isSupported) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    if (!tts.isSupported) {
      toast.warning('Voice output not supported; using text only');
    }
    // Slight delay so any prior recognition cleanup finishes
    const t = setTimeout(() => stt.startListening(), 250);
    return () => {
      clearTimeout(t);
      stt.stopListening();
      tts.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Send user utterance when transcript finalises
  useEffect(() => {
    const text = stt.transcript.trim();
    if (!text || muted) return;
    if (text === lastSentRef.current) return;
    lastSentRef.current = text;
    onUserUtterance(text);
    // Pause listening while assistant speaks
    stt.stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stt.transcript, muted]);

  // Speak assistant message and resume listening when done
  useEffect(() => {
    if (!open || !ttsEnabled || !tts.isSupported) return;
    if (isAssistantThinking) return;
    const clean = lastAssistantMessage
      .replace(/\*+/g, '')
      .replace(/[#_`>]/g, '')
      .trim();
    if (!clean || clean === lastSpokenRef.current) return;
    lastSpokenRef.current = clean;
    tts.speak(clean, { rate: 1, pitch: 1 });
    // Resume listening shortly after speech is expected to end
    const checkInterval = setInterval(() => {
      if (!tts.isSpeaking && !muted && open) {
        clearInterval(checkInterval);
        setTimeout(() => stt.startListening(), 300);
      }
    }, 400);
    return () => clearInterval(checkInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAssistantMessage, isAssistantThinking, ttsEnabled, open]);

  // Error toast
  useEffect(() => {
    if (stt.error) {
      if (stt.error === 'not-allowed') {
        toast.error('Microphone permission denied');
      } else if (stt.error !== 'no-speech' && stt.error !== 'aborted') {
        toast.error(`Voice: ${stt.error}`);
      }
    }
  }, [stt.error]);

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      stt.startListening();
    } else {
      setMuted(true);
      stt.stopListening();
    }
  };

  const handleClose = () => {
    stt.stopListening();
    tts.stop();
    onClose();
  };

  let status = 'Listening…';
  if (muted) status = 'Muted';
  else if (isAssistantThinking) status = 'MindMate is thinking…';
  else if (tts.isSpeaking) status = 'MindMate is speaking…';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6"
        >
          <div className="absolute top-6 left-6 text-sm uppercase tracking-widest opacity-70">
            Voice Mode · Local STT/TTS
          </div>

          {/* Animated orb */}
          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              animate={{
                scale: stt.isListening ? [1, 1.15, 1] : tts.isSpeaking ? [1, 1.08, 1] : 1,
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-48 w-48 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 blur-xl opacity-60"
            />
            <div className="absolute h-32 w-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              {isAssistantThinking ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : muted ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </div>
          </div>

          <p className="text-lg font-medium mb-2">{status}</p>
          {stt.transcript && !isAssistantThinking && (
            <p className="text-sm opacity-70 max-w-md text-center italic">
              "{stt.transcript}"
            </p>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={toggleMute}
              className="h-14 w-14 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              aria-label={muted ? 'Unmute mic' : 'Mute mic'}
            >
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              onClick={handleClose}
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
              aria-label="End call"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (ttsEnabled) tts.stop();
                setTtsEnabled(!ttsEnabled);
              }}
              className="h-14 w-14 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              aria-label={ttsEnabled ? 'Mute speaker' : 'Unmute speaker'}
            >
              {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>

          <p className="text-xs opacity-60 mt-8 max-w-md text-center">
            Runs entirely on your device using the browser's built-in speech engine — no audio leaves your device for transcription.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}