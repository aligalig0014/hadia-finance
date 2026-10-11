import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Flower2, Heart, RotateCcw } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface RomanticAudioPlayerProps {
  petalDensity: 'gentle' | 'romantic' | 'storm';
  onDensityChange: (d: 'gentle' | 'romantic' | 'storm') => void;
  onReplayOpening: () => void;
  onSendHeart: () => void;
  heartsCount: number;
}

export const RomanticAudioPlayer: React.FC<RomanticAudioPlayerProps> = ({
  petalDensity,
  onDensityChange,
  onReplayOpening,
  onSendHeart,
  heartsCount,
}) => {
  const [isMuted, setIsMuted] = useState(romanticAudio.getIsMuted());
  const [isPlaying, setIsPlaying] = useState(romanticAudio.getIsPlaying());

  const handleToggleAudio = () => {
    const unmuted = romanticAudio.toggleMute();
    setIsMuted(!unmuted);
    setIsPlaying(romanticAudio.getIsPlaying());
  };

  const nextDensity = () => {
    romanticAudio.playSparkle();
    if (petalDensity === 'gentle') onDensityChange('romantic');
    else if (petalDensity === 'romantic') onDensityChange('storm');
    else onDensityChange('gentle');
  };

  return (
    <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-40 flex items-center gap-2">
      {/* Heart Tap Counter */}
      <button
        onClick={() => {
          romanticAudio.playSparkle();
          onSendHeart();
        }}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-lg hover:bg-rose-900/80 transition active:scale-90"
        title="Send Love to Hadia"
      >
        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-heartbeat" />
        <span>{heartsCount}</span>
      </button>

      {/* Petals Density Switch */}
      <button
        onClick={nextDensity}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-lg hover:bg-rose-900/80 transition"
        title="Change Petals Shower Density"
      >
        <Flower2 className="w-3.5 h-3.5 text-pink-400" />
        <span className="hidden sm:inline capitalize">{petalDensity} Petals</span>
      </button>

      {/* Replay Opening */}
      <button
        onClick={onReplayOpening}
        className="p-1.5 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-200 hover:text-white shadow-lg transition"
        title="Replay Opening Surprise"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Music Toggle */}
      <button
        onClick={handleToggleAudio}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition ${
          !isMuted && isPlaying
            ? 'bg-rose-600/90 text-white border-rose-300'
            : 'bg-black/60 text-rose-300 border-rose-500/30 hover:bg-black/80'
        }`}
        title="Toggle Romantic Music"
      >
        {!isMuted && isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-xs font-semibold hidden md:inline">Romantic Piano</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold hidden md:inline">Play Music</span>
          </>
        )}
      </button>
    </div>
  );
};
