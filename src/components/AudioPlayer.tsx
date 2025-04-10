import { useState, useRef, useEffect } from 'react';
import { PlayCircleFilled, PauseCircleFilled, SoundFilled, CloseOutlined } from '@ant-design/icons';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  onClose: () => void;
}

export function AudioPlayer({ src, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isDragging) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, playbackRate, isDragging]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('播放失败:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = Number(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 计算进度条渐变
  const progressBackground = `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) ${progress}%, hsl(var(--secondary)) 100%)`;

  // 计算音量控制渐变
  const volumeBackground = `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume * 100}%, hsl(var(--secondary)) ${volume * 100}%, hsl(var(--secondary)) 100%)`;

  return (
    <Card className="w-full max-w-md mx-auto border-border animate-scaleIn hover-lift">
      <audio ref={audioRef} src={src} />
      
      <CardContent className="p-4">
        <div className="flex flex-col space-y-5">
          {/* Progress bar */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-muted-foreground w-10 text-center">
              {formatTime((progress / 100) * duration)}
            </span>
            <div className="relative flex-1 h-8 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                onMouseDown={handleProgressMouseDown}
                onMouseUp={handleProgressMouseUp}
                onTouchStart={handleProgressMouseDown}
                onTouchEnd={handleProgressMouseUp}
                className={cn(
                  "absolute w-full h-1.5 rounded-full appearance-none cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "transition-all duration-200",
                  "[&::-webkit-slider-thumb]:appearance-none",
                  "[&::-webkit-slider-thumb]:h-3.5",
                  "[&::-webkit-slider-thumb]:w-3.5",
                  "[&::-webkit-slider-thumb]:rounded-full",
                  "[&::-webkit-slider-thumb]:bg-primary",
                  "[&::-webkit-slider-thumb]:shadow-md",
                  "[&::-webkit-slider-thumb]:transition-all",
                  "[&::-webkit-slider-thumb]:duration-200",
                  "[&::-webkit-slider-thumb:hover]:h-4",
                  "[&::-webkit-slider-thumb:hover]:w-4",
                )}
                style={{ background: progressBackground }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-10 text-center">
              {formatTime(duration)}
            </span>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Playback speed */}
              <div className="relative">
                <button 
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md",
                    "bg-secondary text-secondary-foreground",
                    "hover:bg-secondary/80 transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  onClick={() => handlePlaybackRateChange(playbackRate === 2 ? 1 : playbackRate + 0.5)}
                  aria-label={`播放速度: ${playbackRate}x`}
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <SoundFilled className="text-muted-foreground text-lg" />
                <div className="relative w-20 h-8 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={cn(
                      "absolute w-full h-1.5 rounded-full appearance-none cursor-pointer",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20",
                      "transition-all duration-200",
                      "[&::-webkit-slider-thumb]:appearance-none",
                      "[&::-webkit-slider-thumb]:h-3",
                      "[&::-webkit-slider-thumb]:w-3",
                      "[&::-webkit-slider-thumb]:rounded-full",
                      "[&::-webkit-slider-thumb]:bg-primary",
                      "[&::-webkit-slider-thumb]:shadow-md",
                      "[&::-webkit-slider-thumb]:transition-all",
                      "[&::-webkit-slider-thumb]:duration-200",
                      "[&::-webkit-slider-thumb:hover]:h-3.5",
                      "[&::-webkit-slider-thumb:hover]:w-3.5",
                    )}
                    style={{ background: volumeBackground }}
                  />
                </div>
              </div>
            </div>

            {/* Play/Pause button */}
            <button 
              onClick={togglePlay}
              className={cn(
                "p-2 rounded-full text-primary",
                "hover:text-primary/80 transition-all duration-300",
              )}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <PauseCircleFilled className="text-3xl" />
              ) : (
                <PlayCircleFilled className="text-3xl" />
              )}
            </button>

            {/* Close button */}
            <button 
              onClick={onClose}
              className={cn(
                "p-2 text-muted-foreground rounded-full"
              )}
              aria-label="关闭"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
