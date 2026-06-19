// Pages Function — PollyGlot secure translation proxy
// Hides the OpenRouter API key from the browser and returns a clean translation string.

const LANGUAGE_MAP = {
  french: 'French',
  spanish: 'Spanish',
  japanese: 'Japanese',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Handle POST /api/translate
export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const text = (body.text || '').toString().trim();
  const language = (body.language || '').toString().toLowerCase();

  if (!text) {
    return jsonResponse({ error: 'Missing "text" in request body' }, 400);
  }
  if (!LANGUAGE_MAP[language]) {
    return jsonResponse(
      { error: 'Invalid language. Use french | spanish | japanese' },
      400,
    );
  }

  const systemPrompt =
    `You are a professional translator. Translate the user's text into ${LANGUAGE_MAP[language]}. ` +
    `Return ONLY the translation, with no explanations, quotes, or extra punctuation.`;

  const openRouterResponse = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://pollyglot.pages.dev',
        'X-Title': 'PollyGlot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      }),
    },
  );

  if (!openRouterResponse.ok) {
    const errText = await openRouterResponse.text();
    return jsonResponse(
      { error: 'OpenRouter request failed', details: errText },
      502,
    );
  }

  const data = await openRouterResponse.json();
  const translation = data?.choices?.[0]?.message?.content?.trim();

  if (!translation) {
    return jsonResponse({ error: 'Empty translation from model' }, 502);
  }

  return jsonResponse({ translation });
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}