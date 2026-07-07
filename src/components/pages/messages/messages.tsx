import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "@/libs/hooks/use-user";
import { setLoadingMessage } from "@/libs/store/reducer/reducer";
import { useAppDispatch } from "@/libs/store/store";
import { IEmployeeModel } from "@/services/employee";
import { IMessageModel, getMessage } from "@/services/message";
import "@/styles/message.scss";
import MessageArea from "@/components/pages/messages/message-area";
import MessageContact from "@/components/pages/messages/message-contact";

const Messages = () => {
  const dispatch = useAppDispatch();
  const user = useUser();

  const socket = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    const currentSocket = io(import.meta.env.VITE_SOCKET_IO_URL);
    socket.current = currentSocket;
    currentSocket.emit("connectServer", user.id);
    currentSocket.on("receiveMessage", (message: string) => {
      setMessage({
        isFrom: false,
        message,
        createdAt: new Date().toISOString(),
      });
    });

    return () => {
      currentSocket.disconnect();
      socket.current = undefined;
    };
  }, [user]);

  const [currentUser, setCurrentUser] = useState<IEmployeeModel | null>(null);

  const [message, setMessage] = useState<IMessageModel | null>(null);
  const [messageLst, setMessageLst] = useState<IMessageModel[]>([]);

  useEffect(() => {
    if (message) {
      setMessageLst((prev) => [...prev, message]);
    }
  }, [message]);

  useEffect(() => {
    (async () => {
      if (currentUser) {
        dispatch(setLoadingMessage(true));
        const data = await getMessage(user?.id ?? "", currentUser.id ?? "");
        setMessageLst(data);
        dispatch(setLoadingMessage(false));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className="message-wrapper">
      <MessageContact setCurrentChat={setCurrentUser} />

      <MessageArea
        currentUser={currentUser}
        messageLst={messageLst}
        socket={socket}
        setMessageLst={setMessageLst}
      />
    </div>
  );
};

export default Messages;
