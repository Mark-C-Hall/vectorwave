import Header from "~/components/Header";
import LoadingIcon from "~/components/icons/LoadingIcon";

export default function LoadingPage() {
  return (
    <>
      <Header title="Loading..." content="Loading..." />
      <main className="flex">
        <aside className="flex h-screen w-[260px] bg-black p-4"></aside>
        <LoadingIcon />
      </main>
    </>
  );
}
