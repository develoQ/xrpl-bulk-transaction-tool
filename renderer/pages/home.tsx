import React from "react";
import Head from "next/head";
import Link from "next/link";

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>XRPL NFT Tool</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center mb-4">
        <div className="mt-1">Welcome to the XRPL Txn Tool</div>
      </div>
      <div className="flex flex-col space-y-2 justify-center text-base w-full text-center mb-4 min-h-[20rem]">
        <span className="font-bold mb-4">
          このツールはXRPレジャーにおけるトランザクションの一括送信をサポートします。
        </span>
        <span>
          アカウントのレギュラーキーや認可Minterを利用した一時的な利用を想定しています。
        </span>
        <span>利用終了後はすぐにレギュラーキーや認可Minterの設定を解除してください。</span>
        <span className="mt-4">全て自己責任の上でご利用ください。</span>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/wallet">
          <a className="btn btn-primary">次へ進む</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Home;
