/**
 * Research Service - Implements the 'last30days' skill logic.
 * Aggregates information from various sources and synthesizes a briefing.
 */

import { webSearch } from './search.js';

export async function runLast30DaysResearch(env, topic) {
    console.log(`[Research] Running 'last30days' for: ${topic}`);
    
    // 1. Concurrent searches across different platform contexts
    const platforms = [
        { name: 'Reddit', query: `site:reddit.com ${topic} "last 30 days"` },
        { name: 'Hacker News', query: `site:news.ycombinator.com ${topic}` },
        { name: 'X / Twitter', query: `site:twitter.com ${topic} news` },
        { name: 'YouTube', query: `${topic} latest review 2024` }
    ];

    const searchResults = await Promise.all(platforms.map(async (p) => {
        try {
            const results = await webSearch(p.query, { 
                provider: 'serper', 
                limit: 5,
                apiKey: env.SERPER_API_KEY 
            });
            return { platform: p.name, data: results };
        } catch (e) {
            return { platform: p.name, error: e.message };
        }
    }));

    // 2. Synthesize with AI
    if (!env.AI) {
        return { 
            topic, 
            summary: "AI Synthesizer not available. Here are raw results.",
            results: searchResults 
        };
    }

    const contextText = searchResults.map(r => {
        if (r.error) return `[${r.platform}] Error: ${r.error}`;
        const snippets = r.data.results?.map(res => `- ${res.title}: ${res.snippet}`).join('\n') || 'No results';
        return `### ${r.platform}\n${snippets}`;
    }).join('\n\n');

    const systemPrompt = `You are the Narad Research Intelligence. 
    Analyze the provided search results for the topic "${topic}" from the last 30 days.
    Synthesize a high-fidelity briefing including:
    1. **Key Trends**: What is the community actually talking about?
    2. **Grounded Synthesis**: A narrative summary with citations to the search results.
    3. **Sentiment**: Community consensus (positive/negative/skeptical).
    4. **Actionable Insights**: How should an engineer or researcher react to this?
    
    Use a professional, brutally efficient tone.`;

    const response = await env.AI.run(env.PRIMARY_MODEL || 'llama-3.3-70b-versatile', {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Search Context from last 30 days:\n${contextText}` }
        ]
    });

    return {
        topic,
        briefing: response.response || response.text || response,
        raw_context: contextText
    };
}
