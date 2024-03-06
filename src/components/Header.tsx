import Head from "next/head";

export default function Header(props: { title: string; content: string }) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.content} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
