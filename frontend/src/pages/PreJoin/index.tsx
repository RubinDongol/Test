import { Button, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppWrapper } from '../../components/layouts';

const PreJoin = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, []);

  const handleJoin = () => {
    if (name.trim()) {
      navigate(`/room/${groupId}`, { state: { name } });
    }
  };

  return (
    <AppWrapper>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 pt-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col items-center">
          {/* Video Preview */}
          <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black flex justify-center items-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-auto h-full object-center"
            />
          </div>

          {/* Name Input and Join Button */}
          <div className="w-full flex flex-col items-center mt-10 px-10">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              size="large"
              className="w-full"
            />
            <Button
              type="primary"
              size="large"
              onClick={handleJoin}
              className="w-full mt-6">
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default PreJoin;
