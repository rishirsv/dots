# Proxy Support

Proxy configuration for geo-testing, corporate environments, and rate-limited sites.

## Basic Proxy Configuration

```bash
agent-browser --proxy "http://proxy.example.com:8080" open https://example.com
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
agent-browser open https://example.com
```

## Authenticated Proxy

```bash
export HTTP_PROXY="http://username:password@proxy.example.com:8080"
agent-browser open https://example.com
```

## SOCKS Proxy

```bash
export ALL_PROXY="socks5://proxy.example.com:1080"
agent-browser open https://example.com
```

## Proxy Bypass

```bash
agent-browser --proxy "http://proxy.example.com:8080" --proxy-bypass "localhost,*.internal.com" open https://example.com
export NO_PROXY="localhost,127.0.0.1,.internal.company.com"
agent-browser open https://internal.company.com
```
