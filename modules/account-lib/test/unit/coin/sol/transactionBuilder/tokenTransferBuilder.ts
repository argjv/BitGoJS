import { register } from '../../../../../src';
import { TransactionBuilderFactory, KeyPair, Utils } from '../../../../../src/coin/sol';
import should from 'should';
import * as testData from '../../../../resources/sol/sol';

describe('Sol Token Transfer Builder', () => {
  const factory = register('tsol', TransactionBuilderFactory);

  const tokenTransferBuilder = () => {
    const txBuilder = factory.getTokenTransferBuilder();
    txBuilder.nonce(recentBlockHash);
    txBuilder.sender(authAccount.pub);
    return txBuilder;
  };

  const authAccount = new KeyPair(testData.authAccount).getKeys();
  const nonceAccount = new KeyPair(testData.nonceAccount).getKeys();
  const otherAccount = new KeyPair({ prv: testData.prvKeys.prvKey1.base58 }).getKeys();
  const invalidPubKey = testData.pubKeys.invalidPubKeys[0];
  const recentBlockHash = 'GHtXQBsoZHVnNFa9YevAzFr17DJjgHXk3ycTKD5xD3Zi';
  const amount = testData.tokenTransfers.amount.toString();
  const memo = testData.tokenTransfers.memo;
  const nameORCA = testData.tokenTransfers.nameORCA;
  const ownerORCA = testData.tokenTransfers.ownerORCA;
  const walletPK = testData.associatedTokenAccounts.accounts[0].pub;
  const walletSK = testData.associatedTokenAccounts.accounts[0].prv;

  describe('Succeed', () => {
    it('build a token transfer tx unsigned with memo', async () => {
      const txBuilder = factory.getTokenTransferBuilder();
      txBuilder.nonce(recentBlockHash);
      txBuilder.sender(walletPK);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      txBuilder.memo(memo);
      const tx = await txBuilder.build();
      tx.inputs.length.should.equal(1);
      tx.inputs[0].should.deepEqual({
        address: walletPK,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(1);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.TOKEN_TRANSFER_UNSIGNED_TX_WITH_MEMO);
    });

    it('build a token transfer tx unsigned with durable nonce', async () => {
      const txBuilder = factory.getTokenTransferBuilder();
      txBuilder.nonce(recentBlockHash, { walletNonceAddress: nonceAccount.pub, authWalletAddress: walletPK });
      txBuilder.sender(walletPK);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      const tx = await txBuilder.build();
      tx.inputs.length.should.equal(1);
      tx.inputs[0].should.deepEqual({
        address: walletPK,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(1);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.TOKEN_TRANSFER_UNSIGNED_TX_WITH_DURABLE_NONCE);
      const txJson = tx.toJson();
      txJson.durableNonce.should.deepEqual({
        walletNonceAddress: nonceAccount.pub,
        authWalletAddress: walletPK,
      });
    });

    it('build a token transfer tx unsigned with memo and durable nonce', async () => {
      const txBuilder = factory.getTokenTransferBuilder();
      txBuilder.nonce(recentBlockHash, { walletNonceAddress: nonceAccount.pub, authWalletAddress: walletPK });
      txBuilder.sender(walletPK);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      txBuilder.memo(memo);
      const tx = await txBuilder.build();
      tx.inputs.length.should.equal(1);
      tx.inputs[0].should.deepEqual({
        address: walletPK,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(1);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.TOKEN_TRANSFER_UNSIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE);
    });

    it('build a token transfer tx unsigned without memo or durable nonce', async () => {
      const txBuilder = factory.getTokenTransferBuilder();
      txBuilder.nonce(recentBlockHash);
      txBuilder.sender(walletPK);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      const tx = await txBuilder.build();
      tx.inputs.length.should.equal(1);
      tx.inputs[0].should.deepEqual({
        address: walletPK,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(1);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.TOKEN_TRANSFER_UNSIGNED_TX_WITHOUT_MEMO);
    });

    it('build a token transfer tx signed with memo and durable nonce', async () => {
      const txBuilder = factory.getTokenTransferBuilder();
      txBuilder.nonce(recentBlockHash, {
        walletNonceAddress: nonceAccount.pub,
        authWalletAddress: walletPK,
      });
      txBuilder.sender(walletPK);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      txBuilder.memo(memo);
      txBuilder.sign({ key: walletSK });
      const tx = await txBuilder.build();
      tx.id.should.not.equal(undefined);
      tx.inputs.length.should.equal(1);
      tx.inputs[0].should.deepEqual({
        address: walletPK,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(1);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.TOKEN_TRANSFER_SIGNED_TX_WITH_MEMO_AND_DURABLE_NONCE);
    });

    it('build a token multi transfer tx signed with memo and durable nonce', async () => {
      const account1 = new KeyPair({ prv: testData.extraAccounts.prv1 }).getKeys();
      const account2 = new KeyPair({ prv: testData.extraAccounts.prv2 }).getKeys();
      const account3 = new KeyPair({ prv: testData.extraAccounts.prv3 }).getKeys();
      const account4 = new KeyPair({ prv: testData.extraAccounts.prv4 }).getKeys();
      const account5 = new KeyPair({ prv: testData.extraAccounts.prv5 }).getKeys();
      const txBuilder = factory.getTokenTransferBuilder();

      txBuilder.nonce(recentBlockHash, { walletNonceAddress: nonceAccount.pub, authWalletAddress: authAccount.pub });
      txBuilder.sender(ownerORCA);
      txBuilder.send({ address: otherAccount.pub, amount, tokenName: nameORCA });
      txBuilder.send({ address: account1.pub, amount, tokenName: nameORCA });
      txBuilder.send({ address: account2.pub, amount, tokenName: nameORCA });
      txBuilder.send({ address: account3.pub, amount, tokenName: nameORCA });
      txBuilder.send({ address: account4.pub, amount, tokenName: nameORCA });
      txBuilder.send({ address: account5.pub, amount, tokenName: nameORCA });
      txBuilder.memo(memo);
      txBuilder.sign({ key: authAccount.prv });
      const tx = await txBuilder.build();
      tx.inputs.length.should.equal(6);
      tx.inputs[0].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.inputs[1].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.inputs[2].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.inputs[3].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.inputs[4].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.inputs[5].should.deepEqual({
        address: ownerORCA,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs.length.should.equal(6);
      tx.outputs[0].should.deepEqual({
        address: otherAccount.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs[1].should.deepEqual({
        address: account1.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs[2].should.deepEqual({
        address: account2.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs[3].should.deepEqual({
        address: account3.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs[4].should.deepEqual({
        address: account4.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      tx.outputs[5].should.deepEqual({
        address: account5.pub,
        value: amount,
        coin: 'tsol:ORCA',
      });
      const rawTx = tx.toBroadcastFormat();
      should.equal(Utils.isValidRawTransaction(rawTx), true);
      should.equal(rawTx, testData.MULTI_TOKEN_TRANSFER_SIGNED);
    });
  });
  describe('Fail', () => {
    it('for invalid sender', () => {
      const txBuilder = tokenTransferBuilder();
      should(() => txBuilder.sender(invalidPubKey)).throwError('Invalid or missing sender, got: ' + invalidPubKey);
    });

    it('for invalid toAddress', () => {
      const txBuilder = tokenTransferBuilder();
      should(() => txBuilder.send({ address: invalidPubKey, amount, tokenName: nameORCA })).throwError(
        'Invalid or missing address, got: ' + invalidPubKey,
      );
    });

    it('for invalid amount', () => {
      const invalidAmount = 'randomstring';
      const txBuilder = tokenTransferBuilder();
      should(() =>
        txBuilder.send({
          address: nonceAccount.pub,
          amount: invalidAmount,
          tokenName: nameORCA,
        }),
      ).throwError('Invalid or missing amount, got: ' + invalidAmount);
    });
  });
});
