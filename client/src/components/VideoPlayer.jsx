import React, { useRef, useEffect, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Loader2, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

export default function VideoPlayer({ url, poster, onReady }) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return

    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered')
    videoRef.current.appendChild(videoElement)

    const player = (playerRef.current = videojs(videoElement, {
      controls: false,
      fluid: true,
      responsive: true,
      poster: poster,
      sources: [
        {
          src: url,
          type: 'application/x-mpegURL', // for HLS streaming
        },
      ],
    }))

    player.addClass('vjs-custom-theme')

    player.on('loadedmetadata', () => {
      setDuration(player.duration())
      setLoading(false)
    })

    player.on('timeupdate', () => {
      setCurrentTime(player.currentTime())
    })

    player.on('play', () => setIsPlaying(true))
    player.on('pause', () => setIsPlaying(false))

    player.on('fullscreenchange', () => {
      setIsFullscreen(player.isFullscreen())
    })

    if (onReady) {
      onReady(player)
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [url, poster, onReady])

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
    }
  }

  const seek = (time) => {
    if (playerRef.current) {
      playerRef.current.currentTime(time)
    }
  }

  const changeVolume = (newVolume) => {
    if (playerRef.current) {
      playerRef.current.volume(newVolume)
      setVolume(newVolume)
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      if (volume === 0) {
        changeVolume(1)
      } else {
        changeVolume(0)
      }
    }
  }

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (isFullscreen) {
        playerRef.current.exitFullscreen()
      } else {
        playerRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative group">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col space-y-2 text-white">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(currentTime - 10)}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(currentTime + 10)}>
                <SkipForward className="h-5 w-5" />
              </Button>
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => changeVolume(value[0] / 100)}
                  className="w-24"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}