import {
  SignTransactionOptions,
  TransactionPrebuild as BaseTransactionPrebuild,
  TransactionRecipient,
  TransactionFee,
  VerifyTransactionOptions,
  TransactionParams,
} from '@bitgo/sdk-core';

export { TransactionFee };
export interface ExplainTransactionOptions {
  txHex?: string;
  halfSigned?: {
    txHex: string;
  };
  publicKeys?: string[];
}

export interface TxInfo {
  recipients: TransactionRecipient[];
  from: string;
  txid: string;
}

export interface AvaxpSignTransactionOptions extends SignTransactionOptions {
  txPrebuild: TransactionPrebuild;
  prv: string | string[];
  pubKeys?: string[];
}
export interface TransactionPrebuild extends BaseTransactionPrebuild {
  txHex: string;
  txInfo: TxInfo;
  source: string;
}
export interface AvaxpTransactionParams extends TransactionParams {
  type: string;
  stakingOptions: {
    startTime: string;
    endTime: string;
    nodeID: string;
    amount: string;
    delegationFeeRate?: number;
  };
  locktime?: number;
  memo?: {
    type?: string;
    value: string;
  };
}

export interface AvaxpVerifyTransactionOptions extends VerifyTransactionOptions {
  txParams: AvaxpTransactionParams;
}
