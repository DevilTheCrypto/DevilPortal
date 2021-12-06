import { ConnectorNames } from "@pancakeswap-libs/uikit";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
import { NetworkConnector } from "./NetworkConnector";
import WalletConnectProvider from '@walletconnect/web3-provider';

const NETWORK_URL = "https://bsc-dataseed.binance.org/";

export const NETWORK_CHAIN_ID: number = parseInt("97");

if (typeof NETWORK_URL === "undefined") {
  throw new Error(
    `REACT_APP_NETWORK_URL must be a defined environment variable`
  );
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  if (!networkLibrary)
    networkLibrary = new Web3Provider(walletconnect.walletConnectProvider);
  // eslint-disable-next-line no-return-assign
  return networkLibrary;
}

export const injected = new InjectedConnector({
  supportedChainIds: [4, 56, 97],
});

export const provider = new WalletConnectProvider({
  bridge: 'https://pancakeswap.bridge.walletconnect.org',
  rpc: {
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  qrcode: true,
  chainId: NETWORK_CHAIN_ID,
});

export const bscConnector = new BscConnector({ supportedChainIds: [56, 97] });

// mainnet only
export const walletconnect = new WalletConnectConnector({
  bridge: "https://pancakeswap.bridge.walletconnect.org",
  qrcode: true,rpc: {
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  // pollingInterval: 15000,
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: "Uniswap",
  appLogoUrl:
    "https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg",
});

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
};
