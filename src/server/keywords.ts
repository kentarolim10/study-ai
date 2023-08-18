import { Configuration, OpenAIApi } from "openai";
import { PrismaClient } from "@prisma/client";
import { env } from "~/env.mjs";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const GPT_MODEL = "text-davinci-003";

async function fetchKeywordsFromWikiLink(link: string) {
  const res = await fetch(link);
  const $ = cheerio.load(await res.text());
  const text = $("p")
    .map((_, elem) => {
      const txt = $(elem);
      return txt.text().replaceAll(/\n/g, "");
    })
    .toArray();
  const keywordArray = text
    .toString()
    .toLowerCase()
    .replaceAll(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .filter((word) => word !== "");

  return new Set(keywordArray);
}

async function fetchKeywords(topic: string) {
  //Get wiki link from topic
  const response = await openai.createCompletion({
    model: GPT_MODEL,
    prompt: `Return a link to a wikipedia article about ${topic}.`,
    max_tokens: 100,
  });

  if (!response) return new Set<string>();
  const link = response.data.choices[0]?.text;

  if (!link) return new Set<string>();
  return await fetchKeywordsFromWikiLink(link);
}

async function fetchUnrelatedWords(topic: string) {
  //Get wiki link for unrelated topic
  const response = await openai.createCompletion({
    model: GPT_MODEL,
    prompt: `Return a link to a wikipedia article about a topic unrelated to ${topic}.`,
    max_tokens: 100,
  });

  if (!response) return new Set<string>();
  const link = response.data.choices[0]?.text;

  if (!link) return new Set<string>();
  return await fetchKeywordsFromWikiLink(link);
}

async function fetchFillerWords() {
  const fillerWords = await prisma.fillerWord.findMany();
  return fillerWords.map((fillerWord) => fillerWord.word);
}

export default async function getKeywords(topic: string) {
  console.log("in");
  const keywords: { [key: string]: number } = await Promise.all([
    fetchKeywords(topic),
    fetchUnrelatedWords(topic),
    fetchFillerWords(),
  ])
    .then(async (words) => {
      console.log("FETCHED");
      const keywordSet = words[0];
      const unrelatedWords = words[1];
      const dbFillerWords = words[2];
      const fillerWords: { word: string }[] = [];
      //Filters out keywordSet from db filler words
      dbFillerWords.forEach((fillerWord) => {
        if (keywordSet.has(fillerWord)) {
          keywordSet.delete(fillerWord);
        }
      });
      //Filters out keywordSet from unrelatedWords
      //Pushes all new unrelatedWords to fillerWords
      unrelatedWords.forEach((unrelatedWord) => {
        if (keywordSet.has(unrelatedWord)) {
          keywordSet.delete(unrelatedWord);
          fillerWords.push({ word: unrelatedWord });
        }
      });
      //Pushes all new fillerwords to db
      return await prisma.fillerWord
        .createMany({
          data: fillerWords,
        })
        .then(() => {
          console.log("NEW FILLER WORDS");
          const keywordObj: { [key: string]: number } = Array.from(
            keywordSet
          ).reduce((obj, keyword) => {
            obj[keyword] = 1;
            return obj;
          }, {} as { [key: string]: number });
          console.log(keywordObj);
          return keywordObj;
        });
    })
    .catch(() => {
      return {};
    });
  return keywords;
}
