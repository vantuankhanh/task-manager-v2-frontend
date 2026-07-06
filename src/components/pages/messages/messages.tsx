import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../../libs/hooks/use-user";
import { setLoadingMessage } from "../../../libs/store/reducer/reducer";
import { useAppDispatch } from "../../../libs/store/store";
import { IEmployeeModel } from "../../../services/employee";
import { IMessageModel, getMessage } from "../../../services/message";
import "../../../styles/message.scss";
import MessageArea from "./message-area";
import MessageContact from "./message-contact";

const Messages = () => {
  const dispatch = useAppDispatch();
  const user = useUser();

  const socket = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    if (user && socket) {
      socket.current = io(import.meta.env.VITE_SOCKET_IO_URL);
      socket.current.emit("connectServer", user.id);
      socket.current.on("receiveMessage", (message: string) => {
        setMessage({
          isFrom: false,
          message,
          createdAt: new Date().toISOString(),
        });
      });
    }
  }, [user]);

  const [currentUser, setCurrentUser] = useState<IEmployeeModel | null>(null);

  const [message, setMessage] = useState<IMessageModel | null>(null);
  const [messageLst, setMessageLst] = useState<IMessageModel[]>([]);

  useEffect(() => {
    if (message) {
      setMessageLst((prev) => [...prev, message]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
