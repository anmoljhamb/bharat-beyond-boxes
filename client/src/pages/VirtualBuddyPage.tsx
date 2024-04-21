import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { cn } from "../utils";
import Markdown from "react-markdown";
import { IoSend } from "react-icons/io5";
import { LandingCard2 } from "../assets";
import { BACKEND_URI } from "../constants";

const VirtualBuddyPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const chatWindow = useRef<HTMLElement>(null);

  useEffect(() => {
    chatWindow.current!.scrollTo(0, chatWindow.current!.scrollHeight);
  }, [messages]);

  const getResponseFromBot = async (input: string): Promise<string> => {
    try {
      const resp = await axios.post(`${BACKEND_URI}/chat`, { query: input });
      console.log(resp.data);
      return resp.data.response;
    } catch (e) {
      console.log(e);
      return "There was some error with the server, please try again later.";
    }
  };

  const addMessage = (msg: string) => {
    setMessages((old) => [...old, msg]);
  };

  const handleInput = async (input: string) => {
    addMessage(input);
    setIsBotTyping(true);
    setUserInput("");
    const botResponse = await getResponseFromBot(input);
    setIsBotTyping(false);
    addMessage(botResponse);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleInput(userInput);
  };

  return (
    <>
      <main className="h-screen w-screen bg-black flex flex-row overflow-hidden">
        <section className="w-[45%] h-full pt-16 bg-bg-light flex flex-col items-center gap-8 justify-center">
          <h1 className="text-white text-6xl font-bold text-center px-8">
            Chat With Your Virtual Buddy
          </h1>
          <img src={LandingCard2} />
        </section>
        <section className="w-[55%] h-full pt-16 bg-black flex flex-col">
          <section
            ref={chatWindow}
            className={cn(
              "duration-500 scroll-smooth ease-in-out transition-all",
              "flex-grow h-full overflow-y-auto text-white flex flex-col p-4",
              messages.length === 0
                ? "justify-center items-center"
                : "justify-start items-start",
            )}
          >
            {messages.length === 0 ? (
              <h1 className="text-2xl font-bold capitalize">
                How may I help you today?
              </h1>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isBotMessage = index % 2 === 1;
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
                        <Markdown>{message}</Markdown>
                      </div>
                    </div>
                  );
                })}
                {isBotTyping && <div className="text-white">Thinking...</div>}
              </>
            )}
          </section>
          <div
            className={cn(
              "h-16 flex flex-col justify-center items-center px-6",
            )}
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
                  disabled={userInput.length === 0 || isBotTyping}
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
        </section>
      </main>
    </>
  );
};

export default VirtualBuddyPage;
