import { useEffect, useState } from "react";
import { walletIpc } from "../../ipc";
import { useToolState } from "../../context/ToolStateContext";
import { useRouter } from "next/router";

const Wallet = () => {
  const router = useRouter();
  const { setSignerAddress } = useToolState();
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    walletIpc.getAll().then((addresses) => {
      setAddresses(addresses);
    });
  };

  const createWallet = async () => {
    const address = await walletIpc.walletCreate();
    setSignerAddress(address);
    await fetchAddresses();
  };

  const deleteWallet = async (address: string) => {
    await walletIpc.delete(address);
    await fetchAddresses();
  };

  const nextPage = (address: string) => {
    setSignerAddress(address);
    router.push("/data-input");
  };

  return (
    <div className="pt-8">
      <div className="text-center text-2xl">
        <div className="mt-1">署名用アドレスの選択</div>
      </div>
      <div className="text-center break-words">
        <p className="mt-1">トランザクションを送信するアカウントに対してレギュラーキーが設定されている必要があります。</p>
      </div>
      <div className="mt-12 text-center">
        <div className="text-xl">登録済みアドレス</div>
        <div className="my-6">
          {addresses.length === 0 && "登録済みのアドレスがありません。"}
          {addresses.map((address) => {
            return (
              <div key={address} className="py-2 hover:bg-gray-500">
                <div className="grid place-items-center items-center grid-cols-8">
                  <div
                    className="col-span-7 text-left hover:cursor-pointer"
                    onClick={() => nextPage(address)}
                  >
                    {address}
                  </div>
                  <div className="">
                    <button onClick={() => deleteWallet(address)}>削除</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-4">
        <button className="btn" onClick={createWallet}>
          新しいウォレットの作成
        </button>
      </div>
    </div>
  );
};

export default Wallet;
