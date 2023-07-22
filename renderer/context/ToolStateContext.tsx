import { createContext, useContext, useState } from "react";

type SignedTransaction = {
  txJson: Record<string, any>;
  txBlob: string;
  hash: string;
};

type ContextType = {
  signerAddress?: string;
  setSignerAddress: (address: string) => void;
  txAddress?: string;
  setTxAddress: (address: string) => void;
  transactionData?: Record<string, any>[];
  setTransactionData: (transactionData: Record<string, any>[]) => void;
  signedTransactionData?: SignedTransaction[];
  setSignedTransactionData: (transactionData: SignedTransaction[]) => void;
  reset(): void;
};

const ToolStateContext = createContext<ContextType>({} as any);

export const useToolState = () => {
  return useContext(ToolStateContext);
};

export const ToolStateContexttProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [signerAddress, setSignerAddress] = useState<string>();
  const [txAddress, setTxAddress] = useState<string>();
  const [transactionData, setTransactionData] =
    useState<Record<string, any>[]>();

  const [signedTransactionData, setSignedTransactionData] =
    useState<SignedTransaction[]>();

  const reset = () => {
    setSignerAddress(undefined);
    setTxAddress(undefined);
    setTransactionData(undefined);
    setSignedTransactionData(undefined);
  };

  return (
    <ToolStateContext.Provider
      value={{
        signerAddress,
        setSignerAddress,
        txAddress,
        setTxAddress,
        transactionData,
        setTransactionData,
        signedTransactionData,
        setSignedTransactionData,
        reset,
      }}
    >
      {children}
    </ToolStateContext.Provider>
  );
};
