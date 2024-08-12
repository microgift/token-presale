import { BN, Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  Transaction,
  ComputeBudgetProgram
} from "@solana/web3.js";

import {
  getAssociatedTokenAccount
} from "./util";
import { GLOBAL_STATE_SEED, USDC_ADDRESS, USDT_ADDRESS } from "./constant";
import { Presale } from "../target/types/presale";

export const createInitializeTx = async (
  admin: PublicKey,
  program: Program<Presale>
) => {
  const [globalState, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_STATE_SEED)],
    program.programId
  );
  console.log("globalState: ", globalState.toBase58());
  
  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
    .add(
      await program.methods
        .initialize()
        .accounts({
          admin
        })
        .transaction()
    );

  tx.feePayer = admin;

  return tx;
};

export const createSetVaultAddressTx = async (
  admin: PublicKey,
  vault: PublicKey,
  program: Program<Presale>
) => {
  const [globalState, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_STATE_SEED)],
    program.programId
  );
  console.log("globalState: ", globalState.toBase58());

  const usdcVault = getAssociatedTokenAccount(vault, USDC_ADDRESS);
  console.log("usdcVault: ", usdcVault.toBase58());

  const usdtVault = getAssociatedTokenAccount(vault, USDT_ADDRESS);
  console.log("usdtVault: ", usdtVault.toBase58());

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 120_000 }))
    .add(
      await program.methods
        .setVaultAddress()
        .accounts({
          admin,
          vault
        })
        .transaction()
    );

  tx.feePayer = admin;

  return tx;
};

export const createStartPresaleTx = async (
  admin: PublicKey,
  token: PublicKey,
  program: Program<Presale>
) => {
  const [globalState, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_STATE_SEED)],
    program.programId
  );
  console.log("globalState: ", globalState.toBase58());

  const tokenVault = getAssociatedTokenAccount(globalState, token);
  console.log("tokenVault: ", tokenVault.toBase58());

  const tx = new Transaction();

    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
      .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
      .add(
        await program.methods
          .startPresale()
          .accounts({
            admin
          })
          .transaction()
      );

  tx.feePayer = admin;

  return tx;
};

export const createSetStageTx = async (
  admin: PublicKey,
  stageNum: number,
  program: Program<Presale>
) => {

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
    .add(
      await program.methods
        .setStage(stageNum)
        .accounts({
          admin
        })
        .transaction()
    );

  tx.feePayer = admin;

  return tx;
};

export const createInitUserTx = async (
  user: PublicKey,
  program: Program<Presale>
) => {

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
    .add(
      await program.methods
        .initUser()
        .accounts({
          user
        })
        .transaction()
    );

  tx.feePayer = user;

  return tx;
};

export const createBuyTx = async (
  user: PublicKey,
  solAmount: number,
  vault: PublicKey,
  program: Program<Presale>
) => {

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
    .add(
      await program.methods
        .buy(new BN(solAmount))
        .accounts({
          user,
          vault
        })
        .transaction()
    );

  tx.feePayer = user;

  return tx;
};

export const createBuyWithStableCoinTx = async (
  user: PublicKey,
  coinAmount: number,
  vault: PublicKey,
  program: Program<Presale>
) => {
  const stableCoin = USDC_ADDRESS;

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }))
    .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 65_000 }))
    .add(
      await program.methods
        .buyWithStableCoin(new BN(coinAmount))
        .accounts({
          user,
          vault,
          stableCoin
        })
        .transaction()
    );

  tx.feePayer = user;

  return tx;
};
