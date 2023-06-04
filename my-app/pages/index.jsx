import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {}, []);
  return (
    <div>
      <Head>
        <title>Crypto Devs ICO</title>
        <meta name="description" content="ICO-dApp" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to the Crypto Devs ICO</h1>
          <div className={styles.description}>
            You can claim or mint Crypto Dev tokens here
          </div>
        </div>
      </div>
    </div>
  );
}
