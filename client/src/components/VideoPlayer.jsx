import React, { useRef, useEffect, useState, useCallback } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Loader2, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

const VideoPlayer = ({ url, poster, onReady }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    loading: true,
    isFullscreen: false
  })

  const updatePlayerState = useCallback((updates) => {
    setPlayerState(prevState => ({ ...prevState, ...updates }))
  }, [])

  useEffect(() => {
    if (!videoRef.current) return

    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered', 'vjs-custom-theme')
    videoRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      controls: false,
      fluid: true,
      responsive: true,
      poster: poster,
      sources: [{ src: url, type: 'application/x-mpegURL' }]
    })

    player.on('loadedmetadata', () => updatePlayerState({ duration: player.duration(), loading: false }))
    player.on('timeupdate', () => updatePlayerState({ currentTime: player.currentTime() }))
    player.on('play', () => updatePlayerState({ isPlaying: true }))
    player.on('pause', () => updatePlayerState({ isPlaying: false }))
    player.on('fullscreenchange', () => updatePlayerState({ isFullscreen: player.isFullscreen() }))

    playerRef.current = player
    if (onReady) onReady(player)

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [url, poster, onReady, updatePlayerState])

  const togglePlay = useCallback(() => {
    const player = playerRef.current
    if (player) {
      playerState.isPlaying ? player.pause() : player.play()
    }
  }, [playerState.isPlaying])

  const seek = useCallback((time) => {
    if (playerRef.current) playerRef.current.currentTime(time)
  }, [])

  const changeVolume = useCallback((newVolume) => {
    if (playerRef.current) {
      playerRef.current.volume(newVolume)
      updatePlayerState({ volume: newVolume })
    }
  }, [updatePlayerState])

  const toggleMute = useCallback(() => {
    changeVolume(playerState.volume === 0 ? 1 : 0)
  }, [playerState.volume, changeVolume])

  const toggleFullscreen = useCallback(() => {
    const player = playerRef.current
    if (player) {
      playerState.isFullscreen ? player.exitFullscreen() : player.requestFullscreen()
    }
  }, [playerState.isFullscreen])

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
      {playerState.loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col space-y-2 text-white">
          <Slider
            value={[playerState.currentTime]}
            max={playerState.duration}
            step={0.1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {playerState.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(playerState.currentTime - 10)}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(playerState.currentTime + 10)}>
                <SkipForward className="h-5 w-5" />
              </Button>
              <span className="text-sm">
                {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {playerState.volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[playerState.volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => changeVolume(value[0] / 100)}
                  className="w-24"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {playerState.isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer