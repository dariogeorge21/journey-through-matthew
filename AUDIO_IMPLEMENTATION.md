# Audio Feedback Implementation Guide

## Overview
This document describes the audio feedback system implemented for the quiz game to enhance user experience when answering questions.

## Features Implemented

### 1. Success Sound for Correct Answers
- Plays a pleasant chime (C major chord) when users select the correct answer
- Audio file: `/public/audio/success.wav`
- Triggers immediately when answer is selected

### 2. Failure Sound for Incorrect Answers
- Plays a buzzer tone when users select an incorrect answer
- Audio file: `/public/audio/failure.wav`
- Triggers immediately when answer is selected

### 3. Mute/Unmute Toggle
- Users can toggle audio on/off via the speaker icon in the quiz header
- Icon shows 🔊 when audio is enabled, 🔇 when muted
- Mute state is managed globally via React Context

## Architecture

### Audio Context (`contexts/AudioContext.tsx`)
- Provides global audio state management
- Exports `useAudio()` hook for components to access audio functionality
- Manages mute state and provides `playSound()` function
- Gracefully handles audio loading/playback errors

### Audio Files
- **Location**: `/public/audio/`
- **Formats**: WAV (web-compatible, small file size)
- **Generation**: Created using `scripts/generateAudio.js`
- **File sizes**: ~120KB each (optimized for fast loading)

### Integration Points

#### Quiz Page (`app/quiz/page.tsx`)
- Imports `useAudio` hook
- Calls `playSound()` in `handleAnswer()` function
- Displays mute button in header
- Audio plays before explanation modal appears

#### Root Layout (`app/layout.tsx`)
- Wraps entire app with `AudioProvider`
- Ensures audio context is available to all components

## Usage

### Playing Audio
```typescript
const { playSound } = useAudio();

// Play success sound
playSound("success");

// Play failure sound
playSound("failure");
```

### Checking Mute State
```typescript
const { isMuted } = useAudio();

if (!isMuted) {
  // Audio is enabled
}
```

### Toggling Mute
```typescript
const { toggleMute } = useAudio();

toggleMute(); // Toggle mute state
```

## Error Handling
- Audio playback failures are caught and logged to console
- Missing audio files don't break the application
- Graceful degradation if Web Audio API is unavailable

## Accessibility
- Mute button provides explicit control for users who prefer silent mode
- Audio is optional and doesn't interfere with quiz functionality
- Clear visual feedback (icon change) when audio is toggled

## Performance
- Audio files are small (~120KB each) for fast loading
- Audio plays asynchronously without blocking UI
- No impact on quiz responsiveness

## Regenerating Audio Files
To regenerate audio files with different tones:
```bash
node scripts/generateAudio.js
```

This will create new WAV files in `/public/audio/` directory.

