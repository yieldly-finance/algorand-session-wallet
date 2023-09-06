import algosdk, { Transaction } from "algosdk";
import { PermissionCallback, SignedTxn, Wallet } from "./wallet";
import { PeraWalletConnect } from "@perawallet/connect";

const logoInverted =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOS42IiBmaWxsPSIjRkZFRTU1Ii8+CjxwYXRoIGQ9Ik0yNi4wODE1IDExLjg1MDVDMjYuODI2IDE0LjkzNTEgMjYuNTc0NCAxNy42NDg0IDI1LjUxOTQgMTcuOTEwOUMyNC40NjQ0IDE4LjE3MzMgMjMuMDA1NyAxNS44ODU1IDIyLjI2MTIgMTIuODAwOUMyMS41MTY3IDkuNzE2MjYgMjEuNzY4NCA3LjAwMjkyIDIyLjgyMzMgNi43NDA0N0MyMy44NzgzIDYuNDc4MDIgMjUuMzM3IDguNzY1ODQgMjYuMDgxNSAxMS44NTA1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTM4LjM3NTIgMTQuNTAyNUMzNi43MjY0IDEyLjc1NSAzMy40NDYxIDEzLjIyODcgMzEuMDQ4NSAxNS41NjA0QzI4LjY1MDkgMTcuODkyMiAyOC4wNDM4IDIxLjE5OSAyOS42OTI2IDIyLjk0NjVDMzEuMzQxNCAyNC42OTQgMzQuNjIxNyAyNC4yMjA0IDM3LjAxOTMgMjEuODg4NkMzOS40MTY5IDE5LjU1NjkgNDAuMDI0IDE2LjI1IDM4LjM3NTIgMTQuNTAyNVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0yNS4yNjE2IDQxLjI2MDdDMjYuMzE2NiA0MC45OTgyIDI2LjUzMTIgMzguMTMxNCAyNS43NDEgMzQuODU3NEMyNC45NTA4IDMxLjU4MzQgMjMuNDU1IDI5LjE0MjEgMjIuNCAyOS40MDQ2QzIxLjM0NTEgMjkuNjY3IDIxLjEzMDQgMzIuNTMzOSAyMS45MjA2IDM1LjgwNzhDMjIuNzEwOSAzOS4wODE4IDI0LjIwNjcgNDEuNTIzMSAyNS4yNjE2IDQxLjI2MDdaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTQuNTA3NCAxNi4xMDIzQzE3LjU1MSAxNi45OTk5IDE5Ljc3NSAxOC41NzQ1IDE5LjQ3NDggMTkuNjE5NEMxOS4xNzQ2IDIwLjY2NDIgMTYuNDYzOSAyMC43ODM2IDEzLjQyMDMgMTkuODg2MUMxMC4zNzY3IDE4Ljk4ODUgOC4xNTI3NCAxNy40MTM5IDguNDUyOTMgMTYuMzY5QzguNzUzMTIgMTUuMzI0MiAxMS40NjM4IDE1LjIwNDggMTQuNTA3NCAxNi4xMDIzWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTM0LjI2MTcgMjcuOTAwN0MzNy40OTIyIDI4Ljg1MzQgMzkuODY3NiAzMC40NzI2IDM5LjU2NzQgMzEuNTE3NUMzOS4yNjcyIDMyLjU2MjMgMzYuNDA1MSAzMi42MzcxIDMzLjE3NDcgMzEuNjg0NEMyOS45NDQyIDMwLjczMTggMjcuNTY4OCAyOS4xMTI1IDI3Ljg2OSAyOC4wNjc3QzI4LjE2OTIgMjcuMDIyOCAzMS4wMzEzIDI2Ljk0ODEgMzQuMjYxNyAyNy45MDA3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE3LjkzMjIgMjUuNzA4NEMxNy4xNzc0IDI0LjkyNiAxNC43MDE4IDI2LjA2NDggMTIuNDAyNyAyOC4yNTE4QzEwLjEwMzUgMzAuNDM4OSA4Ljg1MTYxIDMyLjg0NjEgOS42MDYzOCAzMy42Mjg1QzEwLjM2MTIgMzQuNDEwOSAxMi44MzY4IDMzLjI3MjIgMTUuMTM1OSAzMS4wODUxQzE3LjQzNSAyOC44OTgxIDE4LjY4NjkgMjYuNDkwOCAxNy45MzIyIDI1LjcwODRaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K";
const logo =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOS42IiBmaWxsPSIjRkZFRTU1Ii8+CjxwYXRoIGQ9Ik0yNi4wODE1IDExLjg1MDVDMjYuODI2IDE0LjkzNTEgMjYuNTc0NCAxNy42NDg0IDI1LjUxOTQgMTcuOTEwOUMyNC40NjQ0IDE4LjE3MzMgMjMuMDA1NyAxNS44ODU1IDIyLjI2MTIgMTIuODAwOUMyMS41MTY3IDkuNzE2MjYgMjEuNzY4NCA3LjAwMjkyIDIyLjgyMzMgNi43NDA0N0MyMy44NzgzIDYuNDc4MDIgMjUuMzM3IDguNzY1ODQgMjYuMDgxNSAxMS44NTA1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTM4LjM3NTIgMTQuNTAyNUMzNi43MjY0IDEyLjc1NSAzMy40NDYxIDEzLjIyODcgMzEuMDQ4NSAxNS41NjA0QzI4LjY1MDkgMTcuODkyMiAyOC4wNDM4IDIxLjE5OSAyOS42OTI2IDIyLjk0NjVDMzEuMzQxNCAyNC42OTQgMzQuNjIxNyAyNC4yMjA0IDM3LjAxOTMgMjEuODg4NkMzOS40MTY5IDE5LjU1NjkgNDAuMDI0IDE2LjI1IDM4LjM3NTIgMTQuNTAyNVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0yNS4yNjE2IDQxLjI2MDdDMjYuMzE2NiA0MC45OTgyIDI2LjUzMTIgMzguMTMxNCAyNS43NDEgMzQuODU3NEMyNC45NTA4IDMxLjU4MzQgMjMuNDU1IDI5LjE0MjEgMjIuNCAyOS40MDQ2QzIxLjM0NTEgMjkuNjY3IDIxLjEzMDQgMzIuNTMzOSAyMS45MjA2IDM1LjgwNzhDMjIuNzEwOSAzOS4wODE4IDI0LjIwNjcgNDEuNTIzMSAyNS4yNjE2IDQxLjI2MDdaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTQuNTA3NCAxNi4xMDIzQzE3LjU1MSAxNi45OTk5IDE5Ljc3NSAxOC41NzQ1IDE5LjQ3NDggMTkuNjE5NEMxOS4xNzQ2IDIwLjY2NDIgMTYuNDYzOSAyMC43ODM2IDEzLjQyMDMgMTkuODg2MUMxMC4zNzY3IDE4Ljk4ODUgOC4xNTI3NCAxNy40MTM5IDguNDUyOTMgMTYuMzY5QzguNzUzMTIgMTUuMzI0MiAxMS40NjM4IDE1LjIwNDggMTQuNTA3NCAxNi4xMDIzWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTM0LjI2MTcgMjcuOTAwN0MzNy40OTIyIDI4Ljg1MzQgMzkuODY3NiAzMC40NzI2IDM5LjU2NzQgMzEuNTE3NUMzOS4yNjcyIDMyLjU2MjMgMzYuNDA1MSAzMi42MzcxIDMzLjE3NDcgMzEuNjg0NEMyOS45NDQyIDMwLjczMTggMjcuNTY4OCAyOS4xMTI1IDI3Ljg2OSAyOC4wNjc3QzI4LjE2OTIgMjcuMDIyOCAzMS4wMzEzIDI2Ljk0ODEgMzQuMjYxNyAyNy45MDA3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE3LjkzMjIgMjUuNzA4NEMxNy4xNzc0IDI0LjkyNiAxNC43MDE4IDI2LjA2NDggMTIuNDAyNyAyOC4yNTE4QzEwLjEwMzUgMzAuNDM4OSA4Ljg1MTYxIDMyLjg0NjEgOS42MDYzOCAzMy42Mjg1QzEwLjM2MTIgMzQuNDEwOSAxMi44MzY4IDMzLjI3MjIgMTUuMTM1OSAzMS4wODUxQzE3LjQzNSAyOC44OTgxIDE4LjY4NjkgMjYuNDkwOCAxNy45MzIyIDI1LjcwODRaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K";

class PeraWallet implements Wallet {
  accounts: string[];
  defaultAccount: number;
  network: string;
  permissionCallback?: PermissionCallback;

  walletConn: PeraWalletConnect;

  constructor() {
    this.accounts = [];
    this.defaultAccount = 0;

    this.walletConn = new PeraWalletConnect();
  }

  static displayName(): string {
    return "Pera Wallet";
  }
  displayName(): string {
    return PeraWallet.displayName();
  }

  static img(inverted: boolean): string {
    return inverted ? logoInverted : logo;
  }

  img(inverted: boolean): string {
    return PeraWallet.img(inverted);
  }

  async connect(): Promise<boolean> {
    if (this.isConnected()) return true;

    try {
      this.accounts = await this.walletConn.connect();
    } catch (err) {
      return false;
    }

    return true;
  }

  isConnected(): boolean {
    return this.walletConn.isConnected;
  }

  async disconnect(): Promise<boolean> {
    if (!this.isConnected()) return true;

    try {
      await this.walletConn.disconnect();
    } catch (err) {
      return false;
    }

    return true;
  }

  getDefaultAccount(): string {
    if (!this.isConnected()) return "";
    return this.accounts[this.defaultAccount];
  }

  async doSign(defaultAcct: string, txns: Transaction[]): Promise<SignedTxn[]> {
    const signerTxns = txns.map((v) => ({
      txn: v,
    }));

    return this.walletConn
      .signTransaction([signerTxns])
      .then((v) => v.map((k, i) => ({ txID: txns[i].txID(), blob: k })));
  }

  async signTxn(txns: Transaction[]): Promise<SignedTxn[]> {
    const defaultAcct = this.getDefaultAccount();

    if (this.permissionCallback) {
      return await this.permissionCallback.request({
        approved: async (): Promise<SignedTxn[]> => {
          return await this.doSign(defaultAcct, txns);
        },
        declined: async (): Promise<SignedTxn[]> => {
          return [];
        },
      });
    }

    return await this.doSign(defaultAcct, txns);
  }

  signBytes(
    b: Uint8Array,
    permissionCallback?: PermissionCallback
  ): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }

  async signTeal(
    teal: Uint8Array,
    permissionCallback?: PermissionCallback
  ): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }
}

export default PeraWallet;
