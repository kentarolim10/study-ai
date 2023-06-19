import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Layout from "~/components/ui/Layout";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [lectureName, setLectureName] = useState("");
  const [topic, setTopic] = useState("");

  const createLecture = api.lecture.createLecture.useMutation({
    async onSuccess(lecture) {
      if (lecture) {
        await startLecture(lecture.id);
      }
    },
  });

  const createLectureHandler = () => {
    createLecture.mutate({ className: lectureName, topic: topic });
  };

  const startLecture = async (lectureId: string) => {
    await router.push("/lectures/" + lectureId);
  };

  return (
    <Layout>
      <Header />
      <main>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Class name"
        ></Input>
        <Input
          value={lectureName}
          onChange={(e) => setLectureName(e.target.value)}
          placeholder="Topic"
        ></Input>
        <Button
          onClick={createLectureHandler}
          disabled={createLecture.isLoading}
        >
          Start Lecture
        </Button>
      </main>
    </Layout>
  );
}
