package com.tixchain.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.util.logging.Logger;

@Configuration
public class BlockchainConfig {

    private static final Logger log = Logger.getLogger(BlockchainConfig.class.getName());

    @Value("${tixchain.blockchain.rpc-url}")
    private String rpcUrl;

    @Value("${tixchain.blockchain.chain-id}")
    private int chainId;

    @PostConstruct
    public void init() {
        log.info("Blockchain configuration initialized: rpc=" + rpcUrl + ", chainId=" + chainId);
    }
}
