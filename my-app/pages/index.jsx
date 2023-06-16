import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import Web3Modal, { providers } from "web3modal";
import { BigNumber, Contract, utils } from "ethers";
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import { parseEther } from "ethers/lib/utils";

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [tokensMinted, setTokensMinted] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] =
    useState(zero);

  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensToBeClaimed,setTokensToBeClaimed] = useState(zero)
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 5) {
      window.alert("Change the network to goerli");
      throw new Error("Change the network to Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();

      const balance = await tokenContract.balanceOf(address);

      setBalanceOfCryptoDevTokens(balance);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const _tokensMinted = await tokenContract.totalSupply();
      await setTokensMinted(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };

  const getTokensToBeClaimed =async () =>{
    const provider = await getProviderOrSigner()
    const nftContract = await new Contract(
      NFT_CONTRACT_ADDRESS,NFT_CONTRACT_ABI , provider
    )
  }

  const mintCryptoDevToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const value = 0.01 * amount;

      const tx = await tokenContract.mint(amount, {
        value: parseEther(toString(value)),
      });

      setLoading(true);

      await tx.wait();
      setLoading(false);
      window.alert("Successfully minted crypto dev tokens");
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    connectWallet();
  }, []);

  const renderButton = () => {
    if (loading) {
      return (
        <div>
          <button className={styles.button}>Loding...</button>
        </div>
      );
    }

    if(tokensToBeClaimed){
      return()
    }
    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of tokens"
            onChange={(e) => setTokenAmount(BigNumber.formatEther(e))}
          />
          <button
            className={styles.button}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintCryptoDevToken(tokenAmount)}
          >
            Mint Token
          </button>
        </div>
      </div>
    );
  };

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

          {walletConnected ? (
            <div>
              <div className={styles.description}>
                You have minted {utils.formatEther(balanceOfCryptoDevTokens)}{" "}
                crypto devs tokens
              </div>
              <div className={styles.description}>
                Overall {utils.formatEther(tokensMinted)}/10000 tokens have been
                minted
              </div>
              {renderButton()}
            </div>
          ) : (
            <button className={styles.button} onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
