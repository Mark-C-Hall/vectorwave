import Head from "next/head";
import LoadingIcon from "~/components/icons/LoadingIcon";

export default function LoadingPage() {
  return (
    <>
      <Head>
        <title>VectorWave</title>
        <meta
          name="description"
          content="Query documents with the power of AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <aside className="flex h-screen w-[260px] bg-black p-4"></aside>
        <LoadingIcon />
      </main>
    </>
  );
}
