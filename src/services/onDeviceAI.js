// OPTIONAL on-device AI (WebLLM). Runs a small model inside the browser using WebGPU; nothing is sent to a server.
// It is only used if the person clicks "Load on-device AI". The rule-based review/interview always works without it.
// This file is also the place where a real AI API call could be added later.

export const AI = {
  engine: null, ready: false,
  async load(onProgress) {
    if (!('gpu' in navigator)) throw new Error('This browser has no WebGPU. Try recent Chrome or Edge on a laptop.');
    const webllm = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm');
    this.engine = await webllm.CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC', { initProgressCallback: p => onProgress(p.text, p.progress) });
    this.ready = true;
  },
  async ask(system, user) {
    const r = await this.engine.chat.completions.create({ messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.4, max_tokens: 280 });
    return r.choices[0].message.content.trim();
  }
};

// Written resume feedback (3 improvements)
export function aiResumeFeedback(text, roleLabel) {
  return AI.ask('You are a concise resume coach for IT students applying for ' + roleLabel + ' roles. Give exactly 3 specific, actionable improvements as a numbered list. Never invent experience the candidate does not have.', text.slice(0, 3500));
}

// Short coaching note for one interview answer
export function aiAnswerNote(question, answer) {
  return AI.ask('You are a supportive interview coach for IT students. In 2 short sentences, say how to improve this answer. Do not invent facts.', 'Question: ' + question + '\nAnswer: ' + answer.slice(0, 1200));
}
