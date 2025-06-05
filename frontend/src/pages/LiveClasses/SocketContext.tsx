import React, { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext<any>(null);

const socket = io('http://localhost:8080');

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [me, setMe] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState<any>({});

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on('me', id => setMe(id));

    socket.on('callUser', ({ from, signal, name }) => {
      setCall({ isReceivingCall: true, from, name, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', data => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', currentStream => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', data => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me });
    });

    peer.on('stream', currentStream => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', signal => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
