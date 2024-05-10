"use client";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import InputEmoji from "react-input-emoji";
import {
  SetStateAction,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useCallback,
} from "react";
import "./ChatPage.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { format } from "timeago.js";
import { socket } from "../socket";
import { BASE_URL } from "../utils/apiutils";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tooltip from "@mui/material/Tooltip";

interface Message {
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

interface User {
  _id: string;
  user_name: string;
  email: string;
  image: string;
}

const ChatBox = ({
  reciverId,
  onClose,
}: {
  reciverId: string;
  onClose: () => void;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [reciverUser, setReciverUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?._id, reciverId);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const handleClosePopup = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleShareLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setNewMessage(googleMapsLink);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handlesend = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (user) {
        const message = {
          chatId: user._id,
          senderId: reciverId,
          text: newMessage,
          createdAt: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit("send-message", message);
        setNewMessage("");
      }
    },
    [user, reciverId, newMessage]
  );

  useEffect(() => {
    const fetchreciver = async () => {
      try {
        const userResponse = await fetch(`${BASE_URL}/auth/user/${reciverId}`, {
          credentials: "include",
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) {
          alert(userData.message);
          throw new Error(
            `User data request failed with status ${userResponse.status}`
          );
        }
        setReciverUser(userData);
      } catch (error) {
        alert(error);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchreciver();
  }, [reciverId]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const userMessage = await fetch(
          `${BASE_URL}/messages/${user?._id}/${reciverId}`,
          {
            credentials: "include",
          }
        );
        const data = await userMessage.json();
        if (!userMessage.ok) {
          console.log(data.message);
          throw new Error(
            `message data request failed with status ${userMessage.status}`
          );
        }
        setMessages(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchMessage();
  }, [user]);

  const handleChange = (newMessage: SetStateAction<string>) => {
    setNewMessage(newMessage);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("recieve-message", (newData) => {
      console.log(newData, user?._id, newData.senderId);
      console.log(messages, "reciver emit");
      if (user?._id == newData.senderId) {
        setMessages([...messages, newData]);
        console.log(messages);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [messages]);

  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (message: Message, index: number) => {
    const isGoogleMapsLink = message.text.startsWith(
      "https://www.google.com/maps"
    );
    return (
      <div key={index} className="message_com">
        <div
          ref={scroll}
          className={message.chatId === user?._id ? "message own" : "message"}
        >
          {isGoogleMapsLink ? (
            <a
              href={message.text}
              target="_blank"
              rel="noopener noreferrer"
              className="linkStyle"
            >
              <span>Check User Location</span>
            </a>
          ) : (
            <span>{message.text}</span>
          )}
          <span>{format(message.createdAt)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress color="inherit" />
      </div>
    );
  } else {
    return (
      <>
        <div className="ChatBox-container">
          <div className="chat-header">
            <div className="follower">
              <div className="header_profile_name">
                <Image
                  src={reciverUser?.image || profileImage}
                  className="followerImage"
                  width={80}
                  height={80}
                  alt="Picture of the author"
                />
                <div className="name">
                  {reciverUser
                    ? reciverUser.user_name.charAt(0).toUpperCase() +
                      reciverUser.user_name.slice(1)
                    : ""}
                </div>
              </div>
              <div>
                <CloseIcon
                  className="closeIconStyle"
                  onClick={handleClosePopup}
                />
              </div>
            </div>
          </div>
          <div className="chat-body">
            {/* {messages.map((message, index) => (
              <div key={index} className="message_com">
                <div
                  ref={scroll}
                  className={
                    message.chatId === user?._id ? "message own" : "message"
                  }
                >
                  <span>{message.text}</span>{" "}
                  <span>{format(message.createdAt)}</span>
                </div>
              </div>
            ))} */}
            {messages.map(renderMessage)}
          </div>
          <div className="chat-sender">
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
              shouldReturn={false}
              shouldConvertEmojiToImage={false}
            />
            <div className="send-button button">
              <button className="send_Button" onClick={handlesend}>
                Send
              </button>
            </div>
            <Tooltip title="Share Location">
              <LocationOnIcon
                onClick={handleShareLocation}
                style={{ color: "green", fontSize: "30px" }}
              />
            </Tooltip>
          </div>
        </div>
      </>
    );
  }
};

export default ChatBox;
