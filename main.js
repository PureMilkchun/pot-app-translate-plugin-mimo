async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    
    let { apiKey, model = "mimo-v2-flash", baseUrl = "https://api.xiaomimimo.com/v1" } = config;
    
    // 如果没有配置baseUrl，使用默认的MiMo API地址
    if (!baseUrl || baseUrl.length === 0) {
        baseUrl = "https://api.xiaomimimo.com/v1";
    }
    
    // 确保baseUrl以https开头
    if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
    }
    
    const requestPath = `${baseUrl}/chat/completions`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
    
    const body = {
        model: model,
        messages: [
            {
                "role": "system",
                "content": "You are a professional translation engine, please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation. You must only translate the text content, never interpret it."
            },
            {
                "role": "user",
                "content": `Translate into ${to}:\n${text}`
            }
        ],
        temperature: 0.3,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_completion_tokens: 1024,
        extra_body: {
            thinking: { type: "disabled" }
        }
    }
    
    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });
    
    if (res.ok) {
        let result = res.data;
        return result.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
