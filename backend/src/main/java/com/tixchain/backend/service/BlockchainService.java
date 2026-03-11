package com.tixchain.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.logging.Logger;

@Service
public class BlockchainService {

    private static final Logger log = Logger.getLogger(BlockchainService.class.getName());

    @Value("${tixchain.blockchain.rpc-url}")
    private String rpcUrl;

    @Value("${tixchain.blockchain.chain-id}")
    private int chainId;

    private String lastTxHash;

    public String getLastTxHash() {
        return lastTxHash;
    }

    public String deployTicketContract(String eventName, int totalSupply, BigDecimal price) {
        log.info("[Blockchain] Deploying contract for '" + eventName + "' | supply=" + totalSupply + " | price="
                + price);
        String simulatedAddress = "0x" + Integer.toHexString(eventName.hashCode()) + "CAFE";
        this.lastTxHash = "0xdeploy_" + System.currentTimeMillis();
        return simulatedAddress;
    }

    public String mintNFT(String contractAddress, String toWallet, BigDecimal price) {
        log.info("[Blockchain] Minting NFT on " + contractAddress + " to " + toWallet + " for " + price);
        String simulatedTokenId = String.valueOf(System.currentTimeMillis() % 100000);
        this.lastTxHash = "0xmint_" + System.currentTimeMillis();
        return simulatedTokenId;
    }

    public String getNFTMetadata(String tokenId) {
        return "{\"tokenId\": \"" + tokenId + "\", \"standard\": \"ERC-721\"}";
    }

    public void transferWithEscrow(String contractAddress, String tokenId,
            String fromWallet, String toWallet, BigDecimal amount) {
        log.info("[Blockchain] Escrow transfer: token #" + tokenId + " from " + fromWallet + " to " + toWallet);
        this.lastTxHash = "0xescrow_" + System.currentTimeMillis();
    }

    public void listenToEvents(String contractAddress) {
        log.info("[Blockchain] Starting event listener for contract " + contractAddress);
    }
}
