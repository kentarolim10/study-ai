import Link from "next/link";
import Header from "~/components/ui/Header";
import Layout from "~/components/ui/Layout";
import { api } from "~/utils/api";

export default function Index() {
  const { data: lectures, isLoading } = api.lecture.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!lectures) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <Header />
      <main className="grid grid-cols-4 gap-4">
        {lectures.map((lecture) => (
          <Link
            className="grid h-32 place-items-center rounded border-2 border-input p-4"
            href={`/lectures/${lecture.id}`}
            key={lecture.id}
          >
            <h2 className="text-xl capitalize">{lecture.class}</h2>
          </Link>
        ))}
      </main>
    </Layout>
  );
}
