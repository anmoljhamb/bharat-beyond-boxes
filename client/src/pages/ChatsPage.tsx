import { useEffect, useState } from "react";
import { BUserDetails, Chats, Message } from "../types";
import { useAuth } from "../contexts";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

const ChatsPage = () => {
  const auth = useAuth();
  const [userChats, setUserChats] = useState<Chats>({});
  const [usersInfo, setUsersInfo] = useState<Record<string, BUserDetails>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("selectedChat");
    if (key) {
      setSelectedChat(key);
    }
  }, [location]);

  const fetchUserInfo = async (uid: string) => {
    const resp = await getDoc(doc(db, "userDetails", uid));
    setUsersInfo((old) => {
      return { ...old, [uid]: resp.data() as BUserDetails };
    });
  };

  useEffect(() => {
    if (selectedChat.length === 0) {
      return;
    }
    const q = query(
      collection(db, "chats", selectedChat, "messages"),
      orderBy("createdAt"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const chats: Message[] = [];
      snapshot.forEach((doc) => {
        chats.push(doc.data() as Message);
      });
      setChatHistory(chats);
    });
    return unsub;
  }, [selectedChat]);

  useEffect(() => {
    console.log(`chatHistory: ${chatHistory}`);
    chatHistory.forEach((chat) => {
      console.log(chat);
    });
  }, [chatHistory]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", auth.currentUser!.uid),
      async (doc) => {
        if (!doc.exists()) {
          setUserChats({});
          return;
        }
        const temp = doc.data();
        setIsLoading(true);
        let promises = Object.keys(temp).map((chatUid) => {
          if (chatUid in usersInfo) {
            return;
          }
          return fetchUserInfo(temp[chatUid].uid);
        });
        promises = promises.filter((promise) => promise !== undefined);
        await Promise.all(promises);
        setIsLoading(false);
        setUserChats(temp);
      },
    );

    return unsub;
  }, [auth.currentUser]);

  return (
    <>
      <div>ChatsPage</div>
      {Object.keys(userChats).length === 0 && <p>Chats Not Found!</p>}
      {Object.keys(userChats).length > 0 && (
        <>
          {Object.keys(userChats).map((hashed) => {
            const uid = userChats[hashed].uid;
            const userName = usersInfo[uid];
            return (
              <p
                key={hashed}
                onClick={() => {
                  navigate(`?selectedChat=${hashed}`);
                  setSelectedChat(hashed);
                }}
              >
                {userName.name}
              </p>
            );
          })}
        </>
      )}
      {selectedChat.length === 0 && <p>No Selected Chats</p>}
      {selectedChat.length > 0 &&
        selectedChat in userChats &&
        userChats[selectedChat].uid in usersInfo && (
          <ul>
            <h1> Chat with {usersInfo[userChats[selectedChat].uid].name}</h1>
            {chatHistory.map((chat, index) => {
              return <li key={index}>{chat.message}</li>;
            })}
          </ul>
        )}
    </>
  );
};

export default ChatsPage;
