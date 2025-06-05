import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { io } from 'socket.io-client';
import Peer from 'simple-peer-light';

const socket = io('http://localhost:8080');

const Room = () => {
  const { groupId } = useParams();
  const myVideo = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<any[]>([]);
  const peersRef = useRef<any[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const startVideoChat = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('✅ Got user media stream');

        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        console.log('➡️ Joining room after stream ready:', groupId);
        socket.emit('joinRoom', { groupId });

        setupSocketListeners(currentStream);
      } catch (err) {
        console.error('🚨 Error accessing camera/mic:', err);
      }
    };

    startVideoChat();
  }, []);

  const setupSocketListeners = (currentStream: MediaStream) => {
    socket.on('allUsers', (users) => {
      console.log('👥 Users in room:', users);

      const peersArray: any[] = [];
      users.forEach((userID: string) => {
        console.log('🎥 Creating initiator peer to connect:', userID);
        const peer = createPeer(userID, socket.id, currentStream);
        peersRef.current.push({ peerID: userID, peer });
        peersArray.push({ peerID: userID, peer });
      });
      setPeers(peersArray);
    });

    socket.on('user-joined', (payload) => {
      console.log('🎥 New user joined:', payload.callerID);

      const peer = addPeer(payload.signal, payload.callerID, currentStream);
      peersRef.current.push({ peerID: payload.callerID, peer });
      setPeers((prevPeers) => [...prevPeers, { peerID: payload.callerID, peer }]);
    });

    socket.on('receivingReturnedSignal', (payload) => {
      console.log('🔁 Received returned signal from:', payload.id);
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      if (item) {
        item.peer.signal(payload.signal);
      }
    });
  };

  const createPeer = (userToCall: string, callerID: string, stream: MediaStream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('sendingSignal', { userToCall, signal, from: callerID });
    });

    return peer;
  };

  const addPeer = (incomingSignal: any, callerID: string, stream: MediaStream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('returningSignal', { signal, to: callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const handleToggleMic = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const handleToggleCamera = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !cameraOn;
      setCameraOn(!cameraOn);
    }
  };

  const handleLeave = () => {
    peersRef.current.forEach((p) => p.peer.destroy());
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 text-lg font-semibold">
        👥 Connected: {1 + peers.length} users
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {stream && (
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video muted ref={myVideo} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-sm p-1 w-full text-center">
              Me {micOn ? '' : '🎤❌'} {cameraOn ? '' : '📷❌'}
            </div>
          </div>
        )}
        {peers.map((peerData) => (
          <PeerVideo key={peerData.peerID} peer={peerData.peer} peerID={peerData.peerID} />
        ))}
      </div>

      <div className="flex space-x-4 mt-8">
        <Button onClick={handleToggleMic}>{micOn ? 'Mute Mic' : 'Unmute Mic'}</Button>
        <Button onClick={handleToggleCamera}>{cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</Button>
        <Button danger onClick={handleLeave}>Leave</Button>
      </div>
    </div>
  );
};

export default Room;

const PeerVideo = ({ peer, peerID }: { peer: Peer.Instance, peerID: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on('stream', (remoteStream: MediaStream) => {
      if (ref.current) {
        ref.current.srcObject = remoteStream;
      }
    });
  }, []);

  return (
    <div className="bg-black rounded-lg overflow-hidden relative">
      <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-sm p-1 w-full text-center">
        {peerID.slice(0, 6)}...
      </div>
    </div>
  );
};
