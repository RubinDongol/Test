import React, { useContext } from 'react';
import { SocketContext } from './SocketContext';

const VideoGrid = () => {
  const { myVideo, userVideo, callAccepted, callEnded, stream } =
    useContext(SocketContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {stream && (
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
