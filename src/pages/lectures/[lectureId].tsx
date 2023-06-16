import dynamic from "next/dynamic";
import Header from "~/components/ui/Header";
import Layout from "~/components/ui/Layout";

const EditorTranscriptClient = dynamic(
  () => import("~/components/lectures/EditorTranscriptClient"),
  { ssr: false }
);

export default function Index() {
  return (
    <Layout>
      <Header />
      <main className="flex flex-col gap-4">
        <EditorTranscriptClient />
      </main>
    </Layout>
  );
}
