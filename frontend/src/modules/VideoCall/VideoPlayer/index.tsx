import React from "react";
import { useSocket } from "../../../context/SocketContext";
import { useVideoCall } from "../../../context/VideoCallContext";
import "./index.scss";

const VideoPlayer = () => {
  const { name, myVideo, userVideo, callAccepted, callEnded, stream, call } =
    useVideoCall();

  return (
    <div className="video-container">
      {/* my video */}
      {stream && (
        <div className="paper-container">
          <div className="grid-container">
            <h3>{name || "Name"}</h3>
            <video playsInline muted ref={myVideo} autoPlay className="video" />
          </div>
        </div>
      )}
      {/* user's video */}
      {callAccepted && !callEnded && (
        <div className="paper-container">
          <div className="grid-container">
            <h3>{call.name || "Name"}</h3>
            <video playsInline ref={userVideo} autoPlay className="video" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
