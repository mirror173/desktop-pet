(function () {
  function normalizeBriefingCard(raw = '') {
    let text = String(raw || '');

    text = text.replace(/<\/?(card|div|p|section|article|header|footer|main|aside|ul|ol|li|br)[^>]*>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');

    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');

    text = text.replace(/🦞/g, '');
    text = text.replace(/([1-9])️⃣/g, '$1.');
    text = text.replace(/^[-_=*\s]{3,}$/gm, '');
    text = text.replace(/\*{3,}/g, '**');
    text = text.replace(/】\s*(?=[一二三四五六七八九十]+、)/g, '】\n\n');
    text = text.replace(/\n?([一二三四五六七八九十]+、)\s*([^\n]+)?/g, (_, chapter, title = '') => {
      const body = title.trim();
      return body ? `\n\n${chapter}${body}` : `\n\n${chapter}`;
    });
    text = text.replace(/(?<!\n)(\d+\.)/g, '\n$1');
    text = text.replace(/(?<!\n)([-·] )/g, '\n$1');
    text = text.replace(/(?<!\n)(> )/g, '\n$1');
    text = text.replace(/(\n\d+\.)(?=\S)/g, '$1\n');
    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t\f\v]+/g, ' ').trim())
      .filter((line, idx, arr) => line !== '' || (arr[idx - 1] !== '' && arr[idx + 1] !== ''))
      .join('\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/[ \t]+$/gm, '');
    return text.trim();
  }

  function extractBriefingJson(text) {
    const match = String(text || '').match(/__BRIEFING_JSON__=({[\s\S]*?})(?:\n|$)/);
    if (!match?.[1]) return null;
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('JSON解析失败', error);
      return null;
    }
  }

  function getBriefingFallbackPayload() {
    return {
      ok: false,
      content: '',
      error: '到岗梳理数据暂时不可用',
      briefing: {
        date: new Date().toISOString().slice(0, 10),
        source: 'unknown',
        createdAt: Date.now(),
        messageCount: 0
      }
    };
  }

  function formatBriefingOutput(rawOutput) {
    if (!rawOutput) return getBriefingFallbackPayload();
    let text = String(rawOutput);
    const parsed = extractBriefingJson(text);
    if (parsed) {
      if (parsed.ok && parsed.content) {
        return { ...parsed, content: normalizeBriefingCard(parsed.content) };
      }
      if (parsed.error) return parsed;
    }

    const marker = '🎉 找到今日最新到岗梳理：';
    const markerIndex = text.indexOf(marker);
    if (markerIndex >= 0) text = text.slice(markerIndex + marker.length);

    text = text.replace(/^PS .*$/gm, '').replace(/^=+$/gm, '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
    const cleaned = normalizeBriefingCard(text);
    return cleaned ? {
      ok: true,
      content: cleaned,
      briefing: { date: new Date().toISOString().slice(0, 10), source: 'lark-cli-fallback', createdAt: Date.now(), messageCount: 0 }
    } : getBriefingFallbackPayload();
  }

  function renderBriefingPayload(payload) {
    const safe = payload && typeof payload === 'object' ? payload : getBriefingFallbackPayload();
    const briefing = safe.briefing && typeof safe.briefing === 'object' ? safe.briefing : {};
    const date = String(briefing.date || new Date().toISOString().slice(0, 10));
    const source = String(briefing.source || 'unknown');
    const createdAt = Number(briefing.createdAt || Date.now());
    const messageCount = Number.isFinite(Number(briefing.messageCount)) ? Number(briefing.messageCount) : 0;
    const content = normalizeBriefingCard(safe.content || '');
    return [
      `【到岗梳理】${date}`,
      `日期：${date}`,
      `来源：${source}`,
      `消息数：${messageCount}`,
      `生成时间：${window.RendererTimeUtils.formatTime(createdAt, true)}`,
      '',
      content || '暂无可展示内容'
    ].join('\n');
  }

  const api = { normalizeBriefingCard, extractBriefingJson, getBriefingFallbackPayload, formatBriefingOutput, renderBriefingPayload };
  window.RendererBriefingUtils = api;
  Object.assign(window, api);
})();