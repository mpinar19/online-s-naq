import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, isBase64, fileName, count = 10, difficulty = 'qarışıq', lang = 'Azərbaycan dilində' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Mətn lazımdır' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // API key yoxdursa — demo suallar qaytar
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const demo = generateDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({
        questions: demo,
        topics: [...new Set(demo.map((q: object) => (q as { topic?: string }).topic || ""))],
        total: demo.length,
        fileName,
        note: 'Demo rejim — API key əlavə edin'
      });
    }

    let messages;
    if (isBase64) {
      const base64Data = text.includes(',') ? text.split(',')[1] : text;
      messages = [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } },
          { type: 'text', text: buildPrompt(count, difficulty, lang) },
        ],
      }];
    } else {
      messages = [{
        role: 'user',
        content: `Aşağıdakı mətnə əsasən ${buildPrompt(count, difficulty, lang)}\n\nMƏTN:\n${text.slice(0, 15000)}`,
      }];
    }

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 4000, messages }),
    });

    if (!claudeRes.ok) {
      // API xətasında demo qaytar
      const demo = generateDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({
        questions: demo,
        topics: [...new Set(demo.map((q: object) => (q as { topic?: string }).topic || ""))],
        total: demo.length,
        fileName,
      });
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content
      ?.filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('') || '';

    const questions = parseQuestions(rawText);
    const topics = [...new Set(questions.map((q: { topic?: string }) => q.topic).filter(Boolean))];

    if (!questions.length) {
      const demo = generateDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({
        questions: demo,
        topics: [...new Set(demo.map((q: object) => (q as { topic?: string }).topic || ""))],
        total: demo.length,
        fileName,
      });
    }

    return NextResponse.json({ questions, topics, total: questions.length, fileName });
  } catch (e) {
    console.error('PDF generate error:', e);
    return NextResponse.json({ error: 'Xəta: ' + (e instanceof Error ? e.message : 'bilinməyən') }, { status: 500 });
  }
}

function buildPrompt(count: number, difficulty: string, lang: string): string {
  return `${lang} ${count} ədəd test sualı yarat. Çətinlik: ${difficulty}.
Suallar mövzulara görə qruplaşdırılsın. Hər sual 4 variantlı olsun.

MÜTLƏQ bu JSON formatında cavab ver (başqa heç nə yazma):
[
  {
    "q": "Sual mətni?",
    "opts": ["A variantı", "B variantı", "C variantı", "D variantı"],
    "ans": 0,
    "exp": "Düzgün cavabın izahatı",
    "topic": "Mövzu adı",
    "difficulty": "asan"
  }
]
ans — düzgün cavabın indeksi (0=A, 1=B, 2=C, 3=D). Yalnız JSON array qaytır.`;
}

function parseQuestions(raw: string): object[] {
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
  } catch { /* ignore */ }
  return [];
}

function generateDemoQuestions(fileName: string, count: number): object[] {
  const topics = ['Əsas anlayışlar', 'Tətbiq', 'Nəzəriyyə', 'Praktika'];
  const result = [];
  for (let i = 0; i < Math.min(count, 12); i++) {
    const t = topics[i % topics.length];
    result.push({
      q: `"${fileName}" faylından sual ${i + 1}: ${t} mövzusunda hansı ifadə doğrudur?`,
      opts: [
        `${t} — birinci variant`,
        `${t} — ikinci variant`,
        `${t} — üçüncü variant`,
        `${t} — dördüncü variant`,
      ],
      ans: i % 4,
      exp: `Bu sual "${fileName}" faylının ${t} bölməsindən götürülmüşdür. API key əlavə etdikdən sonra real suallar yaranacaq.`,
      topic: t,
      difficulty: ['asan', 'orta', 'çətin'][i % 3],
    });
  }
  return result;
}
