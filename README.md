# 🦜 PollyGlot — AI Translation App

A polished AI-powered translation web app built with React + Vite,
secured with a Cloudflare Worker, and deployed on Cloudflare Pages.

## Live Demo
🔗 [https://square-queen-9582.ahmadi08zahra.workers.dev/)

## Features
- Translate text to **French**, **Spanish**, or **Japanese**
- AI-powered via **OpenRouter** (meta-llama/llama-3.3-70b-instruct:free)
- **Secure**: API key is hidden in a Cloudflare Worker — never exposed to the browser
- Clean, responsive UI with smooth slide-in animations
- Graceful error handling for network and input errors

## Tech Stack
| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite                         |
| Styling    | CSS (Fraunces + Nunito fonts)           |
| AI Model   | meta-llama/llama-3.3-70b via OpenRouter |
| API Proxy  | Cloudflare Worker (hides API key)       |
| Deployment | Cloudflare Pages                        |

> **Note on model**: The assignment specified "gpt-oss-120b" which is not an
> available model on OpenRouter. `meta-llama/llama-3.3-70b-instruct:free` was
> used instead — it is free, high-quality, and ideal for translation tasks.
> Temperature is set to 0.3 and max_tokens to 500 as per requirements.

