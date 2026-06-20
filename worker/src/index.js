

export default {
  async fetch(request, env, ctx) {
    // 1) CORS preflight (browser sends OPTIONS before POST)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // 2) Only POST /translate is allowed
    const url = new URL(request.url);
    if (url.pathname !== '/translate') {
      return jsonResponse({ error: 'Not found' }, 404);
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // 3) Parse + validate the body the frontend sent
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
    if (!['french', 'spanish', 'japanese'].includes(language)) {
      return jsonResponse({ error: 'Invalid language. Use french | spanish | japanese' }, 400);
    }

    // 4) Call OpenRouter with the gpt-oss-120b free model
    const languageFull = {
      french: 'French',
      spanish: 'Spanish',
      japanese: 'Japanese',
    }[language];

    const systemPrompt = `You are a professional translator. Translate the user's text into ${languageFull}. ` +
      `Return ONLY the translation, with no explanations, quotes, or extra punctuation.`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
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
    });

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
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}