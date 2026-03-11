package com.tixchain.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    @Value("${tixchain.rate-limit.mint-requests-per-minute:5}")
    private int maxRequestsPerMinute;

    private final Map<String, WindowCounter> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        String path = httpReq.getRequestURI();

        if (path.contains("/api/tickets/mint") && "POST".equalsIgnoreCase(httpReq.getMethod())) {
            String clientIp = httpReq.getRemoteAddr();
            WindowCounter counter = requestCounts.computeIfAbsent(clientIp, k -> new WindowCounter());
            if (counter.isExceeded(maxRequestsPerMinute)) {
                HttpServletResponse httpRes = (HttpServletResponse) response;
                httpRes.setStatus(429);
                httpRes.setContentType("application/json");
                httpRes.getWriter().write("{\"error\": \"Rate limit exceeded. Max " + maxRequestsPerMinute
                        + " mint requests per minute.\"}");
                return;
            }
            counter.increment();
        }
        chain.doFilter(request, response);
    }

    private static class WindowCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long windowStart = System.currentTimeMillis();

        boolean isExceeded(int max) {
            resetIfExpired();
            return count.get() >= max;
        }

        void increment() {
            resetIfExpired();
            count.incrementAndGet();
        }

        private void resetIfExpired() {
            long now = System.currentTimeMillis();
            if (now - windowStart > 60_000) {
                count.set(0);
                windowStart = now;
            }
        }
    }
}
