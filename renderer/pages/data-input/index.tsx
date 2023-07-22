import { useRouter } from "next/router";
import { useToolState } from "../../context/ToolStateContext";
import { parse } from "papaparse";

const DataInput = () => {
  const router = useRouter();
  const { transactionData,setTransactionData, setTxAddress } = useToolState();

  const fileParser = (file: File) => {
    return new Promise<string[][]>((resolve, reject) => {
      parse(file, {
        complete: (results) => resolve(results?.data),
        error: () => reject(new Error("csv parse err")),
      });
    });
  };

  const onInputCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      e.preventDefault()
      throw new Error('')
    }
    const lineList = await fileParser(e.target.files[0]);
    const keyList = lineList[0];
    const resultObj = lineList
      .filter((_, index) => index !== 0) // 2行目以降がデータのため
      .map((valueList) => {
        const tmpObj = {};
        keyList.map((key, index) => (tmpObj[key] = valueList[index]));
        return tmpObj;
      });
    setTransactionData(resultObj);
  };
  // csvまたはjsonファイルを読み込む
  // json? blob?
  // TransactionType, Account,
  // 全てのAccountは同じでなければいけない

  const nextPage = () => {
    setTxAddress(transactionData[0].Account);
    router.push("/sign-and-submit");
  };
  
  const prevPage = () => {
    setTxAddress(undefined)
    setTransactionData(undefined)
    router.back()
  }

  return (
    <div className="pt-8">
      <div className="text-2xl text-center mb-8">CSVファイルの選択</div>
      <div className="text-center">
        <input
          type="file"
          accept=".csv"
          className="file-input w-full max-w-xs"
          onChange={onInputCsv}
        />
      </div>

      <div className="my-4 mx-10 overflow-y-scroll max-h-[80vh] min-h-[80vh]">
        {transactionData &&
          transactionData.map((data, index) => {
            return (
              <div key={index} className="collapse bg-base-200 mb-1">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium grid grid-cols-12">
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-5">{data["TransactionType"]}</div>
                  <div className="col-span-6 truncate text-ellipsis">
                    {data["Account"]}
                  </div>
                </div>
                <div className="collapse-content">
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
          onClick={nextPage}
          disabled={!transactionData || transactionData.length === 0}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default DataInput;
