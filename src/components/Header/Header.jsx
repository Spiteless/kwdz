import Head from "next/head";

export default function Header(props) {
  const { title, metaName, metaContent } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta
        name={metaName || "Placeholder meta content"}
        content={metaContent || "Placeholder meta content"}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
