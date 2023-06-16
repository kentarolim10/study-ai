import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Layout from "~/components/ui/Layout";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { SetStateAction, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [lectureName, setLectureName] = useState("");
  const [className, setClassName] = useState("");

  const createLecture = api.lecture.createLecture.useMutation({
    async onSuccess(lecture) {
      if (lecture) {
        await startLecture(lecture.id);
      }
    },
  });

  const createLectureHandler = () => {
    createLecture.mutate({ titleName: lectureName, className: className });
  };

  const startLecture = async (lectureId: string) => {
    await router.push("/lectures/" + lectureId);
  };

  return (
    <Layout>
      <Header />
      <main>
        <Input
          value={className}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setClassName(e.target.value)
          }
          placeholder="Class name"
        ></Input>
        <Input
          value={lectureName}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setLectureName(e.target.value)
          }
          placeholder="Lecture Name"
        ></Input>
        <Button onClick={createLectureHandler}>Start Lecture</Button>
      </main>
    </Layout>
  );
}
