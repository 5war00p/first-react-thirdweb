import { SignClientTypes } from "@walletconnect/types";
import { TonConnectProvider } from "./TonConnectProvider";
export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
export interface ProviderMessage {
  type: string;
  data: unknown;
}
export interface ProviderInfo {
  chainId: string;
}
export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
export declare type ProviderChainId = ProviderInfo["chainId"];
export declare type ProviderAccounts = string[];
export interface EIP1102Request extends RequestArguments {
  method: "eth_requestAccounts";
}
export declare namespace IProviderEvents {
  type Event =
    | "connect"
    | "disconnect"
    | "message"
    | "chainChanged"
    | "accountsChanged"
    | "session_delete"
    | "session_event"
    | "session_update"
    | "display_uri";
  interface EventArguments {
    connect: ProviderInfo;
    disconnect: ProviderRpcError;
    message: ProviderMessage;
    chainChanged: ProviderChainId;
    accountsChanged: ProviderAccounts;
    session_delete: {
      topic: string;
    };
    session_event: SignClientTypes.EventArguments["session_event"];
    session_update: SignClientTypes.EventArguments["session_delete"];
    display_uri: string;
  }
}
export interface IEthereumProviderEvents {
  on: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void
  ) => TonConnectProvider;
  once: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void
  ) => TonConnectProvider;
  off: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void
  ) => TonConnectProvider;
  removeListener: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void
  ) => TonConnectProvider;
  emit: <E extends IProviderEvents.Event>(
    event: E,
    payload: IProviderEvents.EventArguments[E]
  ) => boolean;
}
export interface EIP1193Provider {
  on(
    event: "connect",
    listener: (info: ProviderInfo) => void
  ): TonConnectProvider;
  on(
    event: "disconnect",
    listener: (error: ProviderRpcError) => void
  ): TonConnectProvider;
  on(
    event: "message",
    listener: (message: ProviderMessage) => void
  ): TonConnectProvider;
  on(
    event: "chainChanged",
    listener: (chainId: ProviderChainId) => void
  ): TonConnectProvider;
  on(
    event: "accountsChanged",
    listener: (accounts: ProviderAccounts) => void
  ): TonConnectProvider;
  request(args: RequestArguments): Promise<unknown>;
}
export interface IEthereumProvider extends EIP1193Provider {
  enable(): Promise<ProviderAccounts>;
}
//# sourceMappingURL=types.d.ts.map
