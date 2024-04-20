import { useState } from "react";
import { useAuth } from "../contexts";

const ChatsPage = () => {
  const [userChats, setUserChats] = useState<any[]>([]);

  return (
    <>
      <div>ChatsPage</div>
    </>
  );
};

export default ChatsPage;
