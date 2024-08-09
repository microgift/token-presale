import { program } from "commander";
import { PublicKey } from "@solana/web3.js";
import {
  initProject,
  setClusterConfig,
  setStage,
  setVaultAddress,
  startPresale,
} from "./scripts";

program.version("0.0.1");

programCommand("init")
.action(async (directory, cmd) => {
  const { env, keypair, rpc } = cmd.opts();

  console.log("Solana Cluster:", env);
  console.log("Keypair Path:", keypair);
  console.log("RPC URL:", rpc);

  await setClusterConfig(env, keypair, rpc);
  
  await initProject();
});

programCommand("set-vault")
.option("-v, --vault <string>", "dao wallet address")
.action(async (directory, cmd) => {
  const { env, keypair, rpc, vault } = cmd.opts();

  console.log("Solana Cluster:", env);
  console.log("Keypair Path:", keypair);
  console.log("RPC URL:", rpc);

  await setClusterConfig(env, keypair, rpc);
  
  if (vault === undefined) {
    console.log("Error vault address");
    return;
  }

  await setVaultAddress(new PublicKey(vault));
});

programCommand("start-presale")
.option("-t, --token <string>", "token address that's used in the program")
.action(async (directory, cmd) => {
  const { env, keypair, rpc, token } = cmd.opts();

  console.log("Solana Cluster:", env);
  console.log("Keypair Path:", keypair);
  console.log("RPC URL:", rpc);

  await setClusterConfig(env, keypair, rpc);
  
  if (token === undefined) {
    console.log("Error vault address");
    return;
  }

  await startPresale(new PublicKey(token));
});

programCommand("set-stage")
.option("-s, --stage <number>", "stage number")
.action(async (directory, cmd) => {
  const { env, keypair, rpc, stage } = cmd.opts();

  console.log("Solana Cluster:", env);
  console.log("Keypair Path:", keypair);
  console.log("RPC URL:", rpc);

  await setClusterConfig(env, keypair, rpc);
  
  await setStage(stage);
});

function programCommand(name: string) {
  return program
    .command(name)
    .option(
      //  mainnet-beta, testnet, devnet
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet"
    )
    .option(
      "-r, --rpc <string>",
      "Solana cluster RPC name",
      "https://api.devnet.solana.com"
    )
    .option(
      "-k, --keypair <string>",
      "Solana wallet Keypair Path",
      "admin.json"
    );
}

program.parse(process.argv);

/*

yarn script init
yarn script set-vault -v DJDcV3UxP55KqHUKsTSBve7xssRYtbQ5eSG8uWND2HQ7
yarn script start-presale -t 5U6PVxcjCWo361vFwS6cfB65Br4T5jECA6vsVAtm5urt
yarn script set-stage -s 1
yarn script init-user
yarn script buy -a 100000000 -v DJDcV3UxP55KqHUKsTSBve7xssRYtbQ5eSG8uWND2HQ7

*/
