import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import './ChatButton.css';

const ChatButton = () => {
  const [unreadMessages] = useState(1); // You can manage this state based on your chat system
  const [showPulse, setShowPulse] = useState(true);

  const handleChatClick = () => {
    setShowPulse(false);
    // Add your chat open logic here
    console.log('Chat button clicked');
  };

  return (
    <button className="floating-chat-btn" onClick={handleChatClick} aria-label="Open chat">
      {showPulse && <div className="chat-pulse" />}
      <FontAwesomeIcon icon={faCommentDots} className="chat-icon" />
      {unreadMessages > 0 && (
        <div className="chat-badge">
          {unreadMessages}
        </div>
      )}
    </button>
  );
};

export default ChatButton; 