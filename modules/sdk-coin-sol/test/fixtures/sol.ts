import {
  TOKEN_TRANSFER_SIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  TOKEN_TRANSFER_UNSIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  TRANSFER_SIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  TRANSFER_UNSIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  WALLET_INIT_SIGNED_TX,
  WALLET_INIT_UNSIGNED_TX,
} from '../resources/sol';

export const rawTransactions = {
  transfer: {
    unsigned: TRANSFER_UNSIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
    signed: TRANSFER_SIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  },
  walletInit: {
    unsigned: WALLET_INIT_UNSIGNED_TX,
    signed: WALLET_INIT_SIGNED_TX,
  },
  transferToken: {
    unsigned: TOKEN_TRANSFER_UNSIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
    signed: TOKEN_TRANSFER_SIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE,
  },
};
