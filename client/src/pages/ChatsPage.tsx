import { useEffect, useState } from "react";
import { BUserDetails, Chats } from "../types";
import { useAuth } from "../contexts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ChatsPage = () => {
  const auth = useAuth();
  const [userChats, setUserChats] = useState<Chats>({});
  const [usersInfo, setUsersInfo] = useState<Record<string, BUserDetails>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserInfo = async (uid: string) => {
      const resp = await getDoc(doc(db, "userDetails", uid));
      setUsersInfo((old) => {
        return { ...old, [uid]: resp.data() as BUserDetails };
      });
    };

    const fetch = async () => {
      const resp = await getDoc(doc(db, "userChats", auth.currentUser!.uid));
      if (!resp.exists()) {
        return;
      }
      const temp: Chats = resp.data();
      setIsLoading(true);
      const promises = Object.keys(temp).map((chatUid) =>
        fetchUserInfo(temp[chatUid].uid),
      );
      await Promise.all(promises);
      setIsLoading(false);
      setUserChats(temp);
    };

    fetch();
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
            return <p key={hashed}>{userName.name}</p>;
          })}
        </>
      )}
    </>
  );
};

export default ChatsPage;
