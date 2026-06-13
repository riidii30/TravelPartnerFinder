import MainLayout from "../layouts/MainLayout";
import {
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import ringtone from "../assets/ringtone.mp3";

const socket = io(
  "http://localhost:8000"
);

function Chat() {
  const { requestId } = useParams();

  const room = `request_${requestId}`;

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [incomingCall, setIncomingCall] =
    useState(false);

  const [callerName, setCallerName] =
    useState("");

  const peerConnectionRef =
    useRef(null);

  const remoteAudioRef =
    useRef(null);

  const [localStream, setLocalStream] =
    useState(null);

  const [isMuted, setIsMuted] =
    useState(false);

  const [ringAudio] = useState(
    new Audio(ringtone)
  );

  const createPeerConnection = () => {
    const peer =
      new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit(
          "ice_candidate",
          {
            room,
            candidate:
              event.candidate,
          }
        );
      }
    };

    peer.ontrack = (event) => {
      console.log(
        "Remote Audio Received"
      );

      if (
        remoteAudioRef.current
      ) {
        remoteAudioRef.current.srcObject =
          event.streams[0];
      }
    };

    peerConnectionRef.current =
      peer;

    return peer;
  };

  const startCall = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      setLocalStream(stream);
      const peer =
        createPeerConnection();

      stream
        .getTracks()
        .forEach((track) => {
          peer.addTrack(
            track,
            stream
          );
        });

      socket.emit(
        "call_user",
        {
          room,
          caller: user.name,
        }
      );

      alert(
        "Microphone Access Granted 🎤"
      );
    } catch (error) {
      console.log(error);

      alert(
        "Microphone Permission Denied"
      );
    }
  };

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchMessages();

    socket.emit(
      "join_room",
      room
    );

    // Real-time messages
    socket.on(
      "receive_message",
      (data) => {
        setMessages((prev) => [
          ...prev,
          data,
        ]);
      }
    );

    // Incoming call alert
    socket.on(
      "call_accepted",
      async (data) => {
        alert(
          `${data.accepter} accepted the call ✅`
        );

        const peer =
          peerConnectionRef.current;

        const offer =
          await peer.createOffer();

        await peer.setLocalDescription(
          offer
        );

        socket.emit(
          "offer",
          {
            room,
            offer,
          }
        );
      }
    );

    socket.on(
      "incoming_call",
      (data) => {
        setIncomingCall(true);
        setCallerName(data.caller);

        ringAudio.loop = true;

        ringAudio.play().catch((err) =>
          console.log("Audio blocked:", err)
        );
      }
    );

    socket.on(
      "offer",
      async (data) => {
        console.log(
          "Offer Received",
          data.offer
        );

        const peer =
          createPeerConnection();

        await peer.setRemoteDescription(
          new RTCSessionDescription(
            data.offer
          )
        );

        const answer =
          await peer.createAnswer();

        await peer.setLocalDescription(
          answer
        );

        socket.emit(
          "answer",
          {
            room,
            answer,
          }
        );
      }
    );

    socket.on(
      "answer",
      async (data) => {
        console.log(
          "Answer Received",
          data.answer
        );

        const peer =
          peerConnectionRef.current;

        if (
          peer &&
          peer.signalingState ===
          "have-local-offer"
        ) {
          await peer.setRemoteDescription(
            new RTCSessionDescription(
              data.answer
            )
          );
        }
      }
    );

    socket.on(
      "ice_candidate",
      async (data) => {
        const peer =
          peerConnectionRef.current;

        if (
          peer &&
          peer.remoteDescription &&
          data.candidate
        ) {
          await peer.addIceCandidate(
            new RTCIceCandidate(
              data.candidate
            )
          );

          console.log(
            "ICE Candidate Added"
          );
        }
      }
    );

    return () => {
      socket.off("receive_message");
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
    };

  }, [room]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/messages/${room}`
      );

      setMessages(res.data);
    } catch (error) {
      console.error(
        "Fetch Messages Error:",
        error
      );
    }
  };

  const endCall = () => {

    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    if (
      peerConnectionRef.current
    ) {
      peerConnectionRef.current.close();
    }

    peerConnectionRef.current =
      null;
    setLocalStream(null);

    if (
      remoteAudioRef.current
    ) {
      remoteAudioRef.current.srcObject =
        null;
    }
    setIncomingCall(false);
    setCallerName("");

    alert("Call Ended ❌");
  };

  const toggleMute = () => {

    if (!localStream) return;

    localStream
      .getAudioTracks()
      .forEach((track) => {
        track.enabled =
          !track.enabled;
      });

    setIsMuted((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        "http://localhost:8000/message",
        {
          senderName: user.name,
          receiverName: "Traveler",
          message,
          roomId: room,
        }
      );

      socket.emit(
        "send_message",
        {
          room,
          id: Date.now(),
          sender_name: user.name,
          message,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_name: user.name,
          message,
        },
      ]);

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>

      <audio
        ref={remoteAudioRef}
        autoPlay
      />

      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h1>
            Travel Chat
          </h1>

          <button
            className="btn btn-success"
            onClick={startCall}
          >
            📞 Call
          </button>

          <button
            className="btn btn-warning ms-2"
            onClick={toggleMute}
          >
            {isMuted
              ? "🔊 Unmute"
              : "🔇 Mute"}
          </button>

          <button
            className="btn btn-danger ms-2"
            onClick={endCall}
          >
            📵 End Call
          </button>

        </div>

        {incomingCall && (
          <div
            className="alert alert-success d-flex justify-content-between align-items-center"
          >
            <span>
              📞 {callerName} is calling...
            </span>

            <button
              className="btn btn-success"
              onClick={async () => {

                ringAudio.pause();
                ringAudio.currentTime = 0;

                const stream =
                  await navigator.mediaDevices.getUserMedia({
                    audio: true,
                  });

                setLocalStream(stream);

                const peer =
                  createPeerConnection();

                stream
                  .getTracks()
                  .forEach((track) => {
                    peer.addTrack(
                      track,
                      stream
                    );
                  });

                socket.emit(
                  "accept_call",
                  {
                    room,
                    accepter: user.name,
                  }
                );

                setIncomingCall(false);

                alert("Call Accepted ✅");
              }}
            >
              Accept Call
            </button>

          </div>
        )}

        <p className="text-muted">
          Room: {room}
        </p>

        <div
          className="border rounded p-4 bg-light"
          style={{
            height: "450px",
            overflowY: "auto",
          }}
        >
          {messages.length === 0 ? (
            <p className="text-muted">
              No messages yet...
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className="mb-3"
              >
                <small className="text-muted">
                  {msg.sender_name}
                </small>

                <div
                  className="p-2 rounded bg-success text-white d-inline-block d-block"
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 d-flex gap-2">

          <input
            type="text"
            className="form-control"
            placeholder="Type message..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }
            }}
          />

          <button
            className="btn btn-success"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>
    </MainLayout>
  );
}

export default Chat;