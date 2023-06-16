import { type NextPage } from "next";
import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const examples1 = [
    {
      text: "In mathematics an integral is the continuous analog of a sum which is used to calculate areas volumes and their generalizations",
      importance: 0,
    },
    {
      text: "An atom is a particle that consists of a nucleus of protons and neutrons surrounded by a cloud of electrons",
      importance: 0,
    },
    {
      text: "In botany a fruit is the seed-bearing structure in flowering plants that is formed from the ovary after flowering",
      importance: 0,
    },
    {
      text: "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser",
      importance: 0,
    },
  ];

  const examples2 = useMemo(
    () => [
      [
        { text: "In ", importance: 0 },
        { text: "mathematics ", importance: 1 },
        { text: "an ", importance: 0 },
        { text: "integral ", importance: 2 },
        { text: "is ", importance: 0 },
        { text: "the ", importance: 0 },
        { text: "continuous ", importance: 1 },
        { text: "analog ", importance: 2 },
        { text: "of ", importance: 0 },
        { text: "a ", importance: 0 },
        { text: "sum ", importance: 1 },
        { text: "which ", importance: 0 },
        { text: "is ", importance: 0 },
        { text: "used ", importance: 0 },
        { text: "to ", importance: 0 },
        { text: "calculate ", importance: 1 },
        { text: "areas ", importance: 2 },
        { text: "volumes ", importance: 2 },
        { text: "and ", importance: 0 },
        { text: "their ", importance: 0 },
        { text: "generalizations", importance: 2 },
      ],
      [
        { text: "An ", importance: 0 },
        { text: "atom ", importance: 2 },
        { text: "is ", importance: 0 },
        { text: "a ", importance: 0 },
        { text: "particle ", importance: 2 },
        { text: "that ", importance: 0 },
        { text: "consists ", importance: 0 },
        { text: "of ", importance: 0 },
        { text: "a ", importance: 0 },
        { text: "nucleus ", importance: 2 },
        { text: "of ", importance: 0 },
        { text: "protons ", importance: 2 },
        { text: "and ", importance: 0 },
        { text: "neutrons ", importance: 2 },
        { text: "surrounded ", importance: 0 },
        { text: "by ", importance: 0 },
        { text: "a ", importance: 0 },
        { text: "cloud ", importance: 1 },
        { text: "of ", importance: 0 },
        { text: "electrons", importance: 2 },
      ],
      [
        { text: "In ", importance: 0 },
        { text: "botany ", importance: 2 },
        { text: "a ", importance: 0 },
        { text: "fruit ", importance: 2 },
        { text: "is ", importance: 0 },
        { text: "the ", importance: 0 },
        { text: "seed-bearing ", importance: 2 },
        { text: "structure ", importance: 1 },
        { text: "in ", importance: 0 },
        { text: "flowering ", importance: 2 },
        { text: "plants ", importance: 1 },
        { text: "that ", importance: 0 },
        { text: "is ", importance: 0 },
        { text: "formed ", importance: 0 },
        { text: "from  ", importance: 0 },
        { text: "the ", importance: 0 },
        { text: "ovary ", importance: 2 },
        { text: "after ", importance: 0 },
        { text: "flowering", importance: 2 },
      ],
      [
        { text: "The ", importance: 0 },
        { text: "HyperText ", importance: 2 },
        { text: "Markup ", importance: 2 },
        { text: "Language ", importance: 2 },
        { text: "or ", importance: 0 },
        { text: "HTML ", importance: 2 },
        { text: "is ", importance: 0 },
        { text: "the ", importance: 0 },
        { text: "standard ", importance: 1 },
        { text: "markup ", importance: 2 },
        { text: "language ", importance: 2 },
        { text: "for ", importance: 0 },
        { text: "documents ", importance: 2 },
        { text: "designed ", importance: 0 },
        { text: "to  ", importance: 0 },
        { text: "be ", importance: 0 },
        { text: "displayed ", importance: 1 },
        { text: "in ", importance: 0 },
        { text: "a ", importance: 0 },
        { text: "web ", importance: 2 },
        { text: "browser", importance: 2 },
      ],
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceArray, setSentenceArray] = useState<
    { text: string; importance: number }[]
  >([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === examples1.length - 1 ? 0 : prevIndex + 1
      );
      setSentenceIndex(0);
      setSentenceArray([]);
    }, 11000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const foo = examples2[currentIndex];
    if (!foo) return;

    if (sentenceIndex < foo.length) {
      const timerId = setTimeout(() => {
        const arr = examples2[currentIndex];
        if (arr !== undefined) {
          setSentenceArray((prevArr) => {
            const word = arr[sentenceIndex];
            if (word) {
              return [...prevArr, word];
            }
            return prevArr;
          });
          setSentenceIndex((prevIndex) => prevIndex + 1);
        }
      }, 250);
      return () => clearInterval(timerId);
    }
    if (sentenceIndex === foo.length - 1) {
      setCurrentIndex((cur) => cur + 1);
    }
  }, [
    sentenceIndex,
    setSentenceArray,
    setSentenceIndex,
    currentIndex,
    examples2,
  ]);

  const ExampleItem = ({ text }: { text: string }) => {
    return <div></div>;
  };

  const ImportanceStyler = ({ importance }: { importance: number }) => {
    if (importance == 0) {
      return "text-white text-opacity-50";
    } else if (importance == 1) {
      return "text-white text-opacity-50";
    } else {
      return "text-white text-opacity-90 font-bold";
    }
  };

  const TypewriterCard = () => {
    return <div></div>;
  };

  const leftArray = examples1[currentIndex];

  return (
    <>
      <Head>
        <title>StudyAI</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3b017d] to-[#151515]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            StudyAI
          </h1>

          <h2 className="text-white">
            Welcome to StudyAI, the future of classroom learning
          </h2>

          <div></div>

          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Home;
