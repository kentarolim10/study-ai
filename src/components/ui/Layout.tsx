export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-screen-lg gap-2">{children}</div>
  );
}
