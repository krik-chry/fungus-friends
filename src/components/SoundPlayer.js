import React from 'react';
import ReactPlayer from 'react-player';
import '../styles/SoundPlayer.css';

function SoundPlayer(props) {
  const { sound } = props;
  return (
    // Background nature sounds: Hidden youtube video with play/pause functionality
    <ReactPlayer
      url="https://www.youtube.com/watch?v=d0tU18Ybcvk"
      playing={sound}
      loop={true}
      volume="0.2"
      style={{ display: 'none' }}
    />
  );
}

export default SoundPlayer;
