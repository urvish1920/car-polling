"use client";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import InputEmoji from "react-input-emoji";
import { SetStateAction, useEffect, useRef, useState, MouseEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./ChatPage.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { format } from "timeago.js";
import { socket } from "../socket";
import { BASE_URL } from "../utils/apiutils";

interface Message {
  chatId: string;
  senderId: string;
  text: string;
  // createdAt: number;
}

interface User {
  _id: string;
  user_name: string;
  email: string;
  image: string;
}

const ChatBox = ({ reciverId }: { reciverId: string }) => {
  const [newMessage, setNewMessage] = useState("");
  const [reciverUser, setReciverUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?._id);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

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
      }
    };
    fetchreciver();
  }, [reciverId]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const userMessage = await fetch(`${BASE_URL}/messages/${user?._id}`, {
          credentials: "include",
        });
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

  const handlesend = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (user) {
      const message = {
        chatId: user._id,
        senderId: reciverId,
        text: newMessage,
        // createdAt: new Date().getTime(),
      };
      setMessages([...messages, message]);
      // setMessages((msgs) => {
      // return [...msgs, message.text];
      // });
      socket.emit("send-message", message);
      setNewMessage("");
    }

    //   try {
    //     const MessageSend = await fetch(`http://localhost:8000/messages`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //       body: JSON.stringify(message),
    //     });
    //     const data = await MessageSend.json();
    //     if (MessageSend.ok) {
    //     setMessages([...messages, data]);
    //     setNewMessage("");
    //   } else {
    //     throw new Error(
    //       `message data request failed with status ${MessageSend.status}`
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error fetching user data:", error);
    // }
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

  return (
    <>
      {/* chat-header */}
      <div className="ChatBox-container">
        <div className="chat-header">
          <div className="follower">
            <div>
              <Image
                src={reciverUser?.image || profileImage}
                className="followerImage"
                width={80}
                height={80}
                alt="Picture of the author"
              />
            </div>
            <div className="name">
              <span>
                {reciverUser
                  ? reciverUser.user_name.charAt(0).toUpperCase() +
                    reciverUser.user_name.slice(1)
                  : ""}
              </span>
            </div>
          </div>
          <hr
            style={{
              width: "95%",
              border: "0.1px solid #ececec",
              marginTop: "20px",
            }}
          />
        </div>
        {/* chat-body */}
        <div className="chat-body">
          {messages.map((message, index) => (
            <div key={index} className="message_com">
              <div
                ref={scroll}
                className={
                  message.chatId === user?._id ? "message own" : "message"
                }
              >
                <span>{message.text}</span>{" "}
                {/* <span>{format(message.createdAt)}</span> */}
              </div>
            </div>
          ))}
        </div>
        {/* chat-sender */}
        <div className="chat-sender">
          <InputEmoji
            value={newMessage}
            onChange={handleChange}
            shouldReturn={true}
            shouldConvertEmojiToImage={true}
          />
          <div className="send-button button">
            <button className="send_Button" onClick={handlesend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
