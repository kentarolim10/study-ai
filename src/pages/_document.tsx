import { Html, Head, Main, NextScript } from 'next/document';
 
export default function Document() {
  return (
    <Html style={{ colorScheme: "dark" }} className="dark">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
