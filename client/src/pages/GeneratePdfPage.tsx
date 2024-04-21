import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URI } from "../constants";
import Markdown from "react-markdown";
import { useReactToPrint } from "react-to-print";

const options = [
  "Delhi",
  "Rajasthan",
  "Himachal Pradesh",
  "Uttar Pradesh",
  "Tamil Nadu",
];

const GeneratePdfPage = () => {
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);
  const [data, setData] = useState<Record<string, string>>({});
  const printRef = useRef<HTMLElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current!,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const getResponseFromBot = async (input: string): Promise<string> => {
    try {
      const resp = await axios.post(`${BACKEND_URI}/chat`, { query: input });
      console.log(resp.data);
      const ans = resp.data.response;
      setData((old) => {
        return { ...old, [input]: ans };
      });
      return "done";
    } catch (e) {
      console.log(e);
      return "There was some error with the server, please try again later.";
    }
  };

  const handleInput = async (input: string) => {
    setIsBotTyping(true);
    const city = input;
    const inputs = [
      `About ${city}`,
      `What even is UPI?`,
      `How to get a local sim card?`,
      `What are some tourist spots in ${city}`,
      `What are some food spots in ${city}`,
      `What can I expect the fare prices to be in ${city}?`,
      `What various options do I have for travel in ${city}?`,
      `What budget should I expect? in ${city}`,
      `What are some helpline numbers for ${city}`,
      `What are cultural considerations that I should consider while travelling in ${city}?`,
    ];
    for (const input of inputs) {
      await getResponseFromBot(input);
    }
    // const promises: Promise<string>[] = inputs.map((input) =>
    //   getResponseFromBot(input),
    // );
    // await Promise.all(promises);
    setIsBotTyping(false);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Chosen ${selectedOption}`);
    handleInput(selectedOption);
  };

  return (
    <>
      <main className="flex flex-col items-center pt-32 md:pt-14">
        <div className="flex w-3/4 flex-col justify-center items-center">
          <h1 className="text-3xl my-2 font-bold capitalize">
            Generate an detailed information trip guide
          </h1>
          <p>
            Plan. Print. Explore. Effortlessly create your personalized
            itinerary PDF. From trip specifics to local insights, emergency
            contacts to fare guides, we've got you covered. Everything you need
            for your journey – at your fingertips. Start your adventure now!
          </p>
        </div>
        <form
          className="max-w-sm mx-auto flex flex-col justify-center items-center"
          onSubmit={handleOnSubmit}
        >
          <label
            htmlFor="countries"
            className="block mb-2 font-medium text-black my-4 text-2xl"
          >
            Select a destination
          </label>
          <select
            id="countries"
            value={selectedOption}
            onChange={handleOptionChange}
            className="bg-bg-secondary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            disabled={isBotTyping}
            type="submit"
            className="bg-bg-main text-white p-4 rounded-full my-4 disabled:opacity-40"
          >
            Generate PDF
          </button>
        </form>
        {!isBotTyping && Object.keys(data).length !== 0 && (
          <button
            onClick={handlePrint}
            type="submit"
            className="bg-primary-main text-background-main p-4 rounded-full my-4 disabled:opacity-40"
          >
            Download PDF
          </button>
        )}
        {isBotTyping && "Generating..."}
        {Object.keys(data).length !== 0 && (
          <section ref={printRef} className="w-2/3 print:w-full print:px-4">
            {Object.keys(data).map((question) => {
              return (
                <div
                  className="print:min-h-screen print:flex print:flex-col print:justify-center print:items-center"
                  key={question}
                >
                  <h1 className="text-2xl font-bold capitalize text-center">
                    {question}
                  </h1>
                  <Markdown>{data[question]}</Markdown>
                  <hr />
                </div>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
};

export default GeneratePdfPage;
