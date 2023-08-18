import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Layout from "~/components/ui/Layout";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [topic, setTopic] = useState("");

  const createLecture = api.lecture.createLecture.useMutation({
    async onSuccess(lecture) {
      if (lecture) {
        await startLecture(lecture.id);
      }
    },
  });

  const createLectureHandler = () => {
    createLecture.mutate({ className: className, topic: topic });
  };

  const startLecture = async (lectureId: string) => {
    await router.push("/lectures/" + lectureId);
  };

  return (
    <Layout>
      <Header />
      <main className="flex flex-col items-center justify-center py-40">
        <Input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class name"
          className="mb-4 w-96"
        ></Input>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
          className="mb-16 w-96"
        ></Input>
        <Button
          onClick={createLectureHandler}
          disabled={createLecture.isLoading || !className || !topic}
          className="w-96"
        >
          Start Lecture
        </Button>
      </main>
    </Layout>
  );
}
