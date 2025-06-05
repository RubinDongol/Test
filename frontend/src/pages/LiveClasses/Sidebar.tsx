import { useContext, useState } from "react";
import { SocketContext } from './SocketContext';
import { Button, Input } from "antd";

const Sidebar = () => {
  const { me, callAccepted, callUser, leaveCall, answerCall, call } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <div className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md min-w-[300px]">
      <h2 className="text-xl font-bold">Your ID</h2>
      <Input value={me} readOnly className="font-mono" />

      <h2 className="text-xl font-bold mt-4">Make a call</h2>
      <Input
        placeholder="Enter ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      {callAccepted ? (
        <Button danger onClick={leaveCall}>Hang Up</Button>
      ) : (
        <Button type="primary" onClick={() => callUser(idToCall)}>Call</Button>
      )}
      
      {call.isReceivingCall && !callAccepted && (
        <div className="flex flex-col items-center space-y-2">
          <p className="font-semibold">{call.name || "Someone"} is calling you</p>
          <Button type="primary" onClick={answerCall}>Answer</Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
