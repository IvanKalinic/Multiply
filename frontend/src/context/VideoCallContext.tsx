import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { useSocket } from "./SocketContext";

type ContextType = {
  stream: any;
  setStream: React.Dispatch<React.SetStateAction<any>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  me: string;
  setMe: React.Dispatch<React.SetStateAction<string>>;
  call: any;
  setCall: React.Dispatch<React.SetStateAction<any>>;
  callAccepted: boolean;
  setCallAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  callEnded: boolean;
  setCallEnded: React.Dispatch<React.SetStateAction<boolean>>;
  myVideo: any;
  userVideo: any;
};

const VideoCallContext = createContext<ContextType>({
  stream: null,
  setStream: () => null,
  name: "",
  setName: () => null,
  me: "",
  setMe: () => null,
  call: null,
  setCall: () => null,
  callAccepted: false,
  setCallAccepted: () => null,
  callEnded: false,
  setCallEnded: () => null,
  myVideo: null,
  userVideo: null,
});

export const useVideoCall = () => {
  const videoCallContext = useContext(VideoCallContext);
  if (videoCallContext === undefined) {
    throw new Error("useVideoCall must be used within a SocketProvider");
  }

  return videoCallContext;
};

interface Props {
  children: React.ReactChild;
}

export const VideoCallProvider = ({ children }: Props) => {
  const [stream, setStream] = useState<any>(null);
  const [name, setName] = useState("");
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const { socket } = useSocket();

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setStream(currentStream);

  //       myVideo.current.srcObject = currentStream;
  //     });

  //   socket.on("me", (id: string) => setMe(id));
  //   socket.on("calluser", ({ from, name: callerName, signal }) => {
  //     setCall({ isReceivedCall: true, from, name: callerName, signal });
  //   });
  // }, []);

  // const answercall = () => {
  //   setCallAccepted(true);

  //   const peer = new Peer({ initiator: false, trickle: false, stream });
  //   peer.on("signal", (data) => {
  //     socket.emit("answercall", { signal: data, to: call.from });
  //   });
  //   peer.on("stream", (currentStream) => {
  //     userVideo.current.srcObject = currentStream;
  //   });
  //   peer.signal(call.signal);

  //   connectionRef.current = peer;
  // };

  // const callUser = (id) => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream });
  //   peer.on("signal", (data) => {
  //     socket.emit("calluser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name,
  //     });
  //   });
  //   peer.on("stream", (currentStream) => {
  //     userVideo.current.srcObject = currentStream;
  //   });

  //   socket.on("callaccepted", (signal) => {
  //     setCallAccepted(true);

  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const leaveCall = () => {
  //   setCallEnded(true);

  //   connectionRef.current.destroy();
  //   window.location.reload();
  // };

  const value = useMemo(
    () => ({
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      setStream,
      name,
      setName,
      callEnded,
      me,
      setMe,
      setCall,
      setCallAccepted,
      setCallEnded,
      // callUser,
      // leaveCall,
      // answercall,
    }),
    [
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      setStream,
      name,
      setName,
      callEnded,
      me,
      // callUser,
      // leaveCall,
      // answercall,
      setMe,
      setCall,
      setCallAccepted,
      setCallEnded,
    ]
  );

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};
