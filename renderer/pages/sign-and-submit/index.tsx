import { useRouter } from "next/router";
import { useToolState } from "../../context/ToolStateContext";
import xrpl from "../../core/xrpl";
import { useEffect, useMemo, useState } from "react";
import { walletIpc } from "../../ipc";
import { splitArrayByNum } from "../../utils";
import IconCopy from "../../components/icons/Copy";

enum Status {
  Initial,
  SignAndSubmitting,
  Success,
  Error,
  ReSending,
  SuccessReSend,
}

const SignAndSubmit = () => {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(Status.Initial);
  const {
    txAddress,
    signerAddress,
    transactionData,
    signedTransactionData,
    setSignedTransactionData,
  } = useToolState();
  const [currentLedgerIndex, setCurrentLedgerIndex] = useState<number>();
  const [currentAccountSequence, setCurrentAccountSequence] =
    useState<number>();

  useEffect(() => {
    const id = setInterval(async () => {
      const info = await xrpl.networkInfo(txAddress!);
      setCurrentLedgerIndex(info.ledgerSequence);
      setCurrentAccountSequence(info.accountSequence);
    }, 4000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const sendTxn = async (result:typeof signedTransactionData) => {
    const txnArray = splitArrayByNum(result, 20);
    let i = 0;
    try {
      while (i < txnArray.length) {
        await Promise.all([
          ...txnArray[i].map((txn) => {
            if (txn.txJson.Sequence >= currentAccountSequence!) {
              return xrpl.submit(txn.txBlob);
            }
            return Promise.resolve();
          }),
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]);
        i++;
      }
      alert("トランザクションの送信が完了しました。");
    } catch (e) {
      alert(
        "エラーが発生しました。トランザクションの再送信を行なってください。"
      );
      throw e;
    }
  };

  const signAndSubmit = async () => {
    setStatus(Status.SignAndSubmitting);
    // Sequence取得
    let { Sequence, LastLedgerSequence, Fee } = await xrpl.txValues(txAddress!);
    if (
      !confirm(
        `1トランザクションあたりの手数料は${
          Number(Fee) / 1_000_000
        }XRPです。続行しますか？`
      )
    ) {
      return;
    }
    // LastLedgerSequence設定(1+n/4*5)
    LastLedgerSequence =
      LastLedgerSequence - 20 + Math.floor(1 + transactionData.length / 4) * 5;
    const autofilled: Record<string, any>[] = transactionData.map(
      (data, index) => {
        return { Sequence: Sequence + index, LastLedgerSequence, Fee, ...data };
      }
    );
    const result = await walletIpc.bulksign(signerAddress, autofilled);
    setSignedTransactionData(result);
    try {
      await sendTxn([...result]);
      setStatus(Status.Success);
    } catch (e) {
      setStatus(Status.Error);
    }
  };

  const reSendTxn = async () => {
    setStatus(Status.ReSending);
    try {
      await sendTxn(signedTransactionData);
      setStatus(Status.SuccessReSend);
    } catch (e) {
      setStatus(Status.Error);
    }
  };

  const signedTx = useMemo(() => {
    return signedTransactionData?.map((data) => data.txJson);
  }, [signedTransactionData]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const prevPage = () => {
    if(!confirm(
      "署名したトランザクションデータは失われます。よろしいですか？\n送信済みデータを再度データを送信する場合、同一内容のトランザクションが登録される可能性があります。"
    ))
      return
    setSignedTransactionData(undefined);
    router.back();
  };

  return (
    <div className="pt-8">
      <div className="text-2xl text-center mb-8">
        トランザクションへの署名と送信
      </div>
      <div className="flex justify-center items-center">
        <div className="text-xl text-center pr-4">署名用アドレス</div>
        <div className="flex items-center text-xl text-center">
          {signerAddress}
          <IconCopy
            className="btn btn-sm btn-circle"
            onClick={() => copyToClipboard(signerAddress!)}
          />
        </div>
      </div>
      <div className="flex justify-between m-8">
        <button
          className="btn btn-info"
          onClick={signAndSubmit}
          disabled={status > Status.Initial}
        >
          トランザクションへ署名し、送信
        </button>
        <div className="text-right">
          <div>現在のレジャー番号: {currentLedgerIndex || "取得中"}</div>
          <div>
            現在のアカウントシーケンス番号: {currentAccountSequence || "取得中"}
          </div>
        </div>
      </div>
      {status > Status.Error && (
        <div className="m-8">
          <button
            className="btn btn-info"
            onClick={reSendTxn}
            disabled={status > Status.ReSending}
          >
            トランザクションの再送信
          </button>
        </div>
      )}

      <div className="m-4 overflow-y-scroll max-h-[80vh] min-h-[80vh]">
        {(signedTx || transactionData)?.map((data, index) => {
          return (
            <div key={index + (data['Sequence']||'')} className="collapse bg-base-200 mb-1">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium grid grid-cols-12">
                <div className="col-span-1 pr-4">
                  {/* {Object.keys(data).join(",")} */}
                  {data["Sequence"] < currentAccountSequence && "✅"}
                  {index + 1}
                </div>
                <div className="col-span-5">{data["TransactionType"]}</div>
                <div className="col-span-6 truncate text-ellipsis">
                  {data["Account"]}
                </div>
              </div>
              <div className="collapse-content overflow-x-scroll">
                <pre>
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
      <div className="z-50 text-right p-4 shadow-lg shadow-gray-900 flex justify-between sticky bottom-0 bg-white">
        <button className="m-1 btn min-w-[8rem]" onClick={prevPage}>
          戻る
        </button>
        <button
          className="m-1 btn btn-primary min-w-[8rem]"
          onClick={() => router.push("/sign-and-submit")}
          disabled={
            status !== Status.Success && status !== Status.SuccessReSend
          }
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default SignAndSubmit;
