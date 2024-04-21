import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { BUserDetails, Chats, Message } from "../types";
import { useAuth } from "../contexts";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../utils";
import { IoSend } from "react-icons/io5";
import Markdown from "react-markdown";

const ChatsPage = () => {
  const auth = useAuth();
  const [userChats, setUserChats] = useState<Chats>({});
  const [usersInfo, setUsersInfo] = useState<Record<string, BUserDetails>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const chatWindow = useRef<HTMLElement>(null);
  const [userInput, setUserInput] = useState<string>("");

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

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userInput);
    await addDoc(collection(db, "chats", selectedChat, "messages"), {
      createdAt: serverTimestamp(),
      message: userInput,
      uid: auth.currentUser!.uid,
    });
    setUserInput("");
  };

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
    <section className="w-full h-screen pt-14 flex flex-row">
      <div className="w-1/4 bg-black">
        <h1 className="text-3xl text-white z-10 text-center my-2 font-bold">
          Chats
        </h1>

        {Object.keys(userChats).length === 0 && <p>Chats Not Found!</p>}
        {Object.keys(userChats).length > 0 && (
          <ul className="text-white my-4">
            {Object.keys(userChats).map((hashed) => {
              const uid = userChats[hashed].uid;
              const userName = usersInfo[uid];
              return (
                <li
                  key={hashed}
                  onClick={() => {
                    navigate(`?selectedchat=${hashed}`);
                    setSelectedChat(hashed);
                  }}
                  className={cn(
                    "w-full cursor-pointer text-center px-2 py-4 font-semibold text-2xl",
                    hashed === selectedChat ? "bg-bg-main" : "bg-black",
                  )}
                >
                  {userName.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="w-3/4 bg-bg-light flex flex-col">
        <h1 className="text-3xl font-semibold">
          {selectedChat.length === 0 && <p>No Selected Chats</p>}
          {selectedChat.length > 0 &&
            selectedChat in userChats &&
            userChats[selectedChat].uid in usersInfo && (
              <ul>
                <h1 className="text-center my-4">
                  {" "}
                  Chatting with {usersInfo[userChats[selectedChat].uid].name}
                </h1>
              </ul>
            )}
        </h1>
        <section
          ref={chatWindow}
          className={cn(
            "duration-500 scroll-smooth ease-in-out transition-all",
            "flex-grow h-full overflow-y-auto text-white flex flex-col p-4",
          )}
        >
          <>
            {chatHistory.map((message, index) => {
              const isBotMessage = message.uid !== auth.currentUser!.uid;
              return (
                <div
                  className={cn(
                    "w-full flex",
                    isBotMessage ? "justify-start" : "justify-end",
                  )}
                  key={index}
                >
                  <div
                    className={cn(
                      "my-1 p-2 w-[65%] rounded-sm py-3 transition-all duration-300 ease-in-out",
                      isBotMessage
                        ? "bg-bg-main text-white"
                        : "bg-white text-bg-main",
                    )}
                  >
                    <Markdown>{message.message}</Markdown>
                  </div>
                </div>
              );
            })}
          </>
        </section>
        <div
          className={cn("h-16 flex flex-col justify-center items-center px-6")}
        >
          <div className="w-full flex justify-center items-center">
            <form onSubmit={handleOnSubmit} className="w-full relative">
              <input
                value={userInput}
                type="text"
                className={cn(
                  "transition-all duration-300",
                  "bg-background-main border-2 border-primary-50 text-text-main p-2",
                  "w-full flex-grow rounded-sm focus:outline-none h-12 pl-4 pr-16",
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUserInput(e.target.value);
                }}
              />
              <button
                disabled={userInput.length === 0}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  "rounded-2xl text-primary-main text-2xl flex justify-center items-center",
                  "h-10 w-10 absolute bg-white left-auto right-2 top-1/2 -translate-y-1/2 disabled:opacity-60",
                )}
                type="submit"
              >
                <IoSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatsPage;
