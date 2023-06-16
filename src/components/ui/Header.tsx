import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1>StudyAI</h1>
      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/lectures">Lectures</Link>
          </li>
          <li>
            <Link href="/lectures/create">Create</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
