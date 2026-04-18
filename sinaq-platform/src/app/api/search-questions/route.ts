import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, grade, count = 10 } = await req.json();

    if (!topic && !subject) {
      return NextResponse.json({ error: 'Mövzu və ya fənn daxil edin' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Wikipedia-dan kontekst al
    let wikiContext = '';
    const wikiQuery = [subject, topic].filter(Boolean).join(' ');

    try {
      const azRes = await fetch(
        `https://az.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiQuery)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (azRes.ok) {
        const d = await azRes.json();
        if (d.extract) wikiContext += d.extract + '\n\n';
      }
    } catch { /* ignore */ }

    if (!wikiContext) {
      try {
        const enRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiQuery)}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (enRes.ok) {
          const d = await enRes.json();
          if (d.extract) wikiContext += d.extract;
        }
      } catch { /* ignore */ }
    }

    const context = wikiContext.slice(0, 3000);

    // API key yoxdursa — fallback suallar qaytar
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const fallback = generateFallbackQuestions(topic || subject || '', subject || '', grade || '', count);
      return NextResponse.json({ questions: fallback, total: fallback.length, note: 'API key yoxdur — nümunə suallar' });
    }

    const prompt = buildPrompt(topic, subject, grade, count, context);

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      // API xətasında fallback qaytar
      const fallback = generateFallbackQuestions(topic || subject || '', subject || '', grade || '', count);
      return NextResponse.json({ questions: fallback, total: fallback.length, error: `API xətası: ${errText}` });
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content
      ?.filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('') || '';

    const questions = parseQuestions(rawText);

    if (!questions.length) {
      const fallback = generateFallbackQuestions(topic || subject || '', subject || '', grade || '', count);
      return NextResponse.json({ questions: fallback, total: fallback.length });
    }

    return NextResponse.json({ questions, total: questions.length });
  } catch (e) {
    console.error('Search questions error:', e);
    return NextResponse.json({ error: 'Xəta baş verdi: ' + (e instanceof Error ? e.message : 'bilinməyən') }, { status: 500 });
  }
}

function buildPrompt(topic: string, subject: string, grade: string, count: number, context: string): string {
  return `Sən Azərbaycan məktəb sınaq platforması üçün sual yaradırsın.

${context ? `KONTEKST (Wikipedia):\n${context}\n\n` : ''}TAPŞIRIQ:
${grade ? `Sinif: ${grade}-ci sinif` : ''}
${subject ? `Fənn: ${subject}` : ''}
${topic ? `Mövzu: ${topic}` : ''}
Sual sayı: ${count}

Azərbaycan dilində ${count} ədəd test sualı yarat. Hər sual 4 variantlı olsun.

MÜTLƏQ JSON formatında cavab ver (başqa heç nə yazma):
[
  {
    "q": "Sual mətni?",
    "opts": ["A variantı", "B variantı", "C variantı", "D variantı"],
    "ans": 0,
    "exp": "Düzgün cavabın izahatı",
    "topic": "${topic || subject || 'Ümumi'}",
    "difficulty": "orta"
  }
]

ans — düzgün cavabın indeksi (0=A, 1=B, 2=C, 3=D). Yalnız JSON array qaytır.`;
}

function parseQuestions(raw: string): object[] {
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch { /* ignore */ }
  return [];
}

// API key olmadan nümunə suallar
function generateFallbackQuestions(topic: string, subject: string, grade: string, count: number): object[] {
  const label = topic || subject || 'Ümumi';
  const gradeLabel = grade ? `${grade}-ci sinif` : '';

  const templates = [
    {
      q: `${gradeLabel} ${label} mövzusunda hansı anlayış daha geniş əhatə dairəsinə malikdir?`,
      opts: [`${label} əsas anlayışı`, `${label} alt anlayışı`, `${label} tətbiqi`, `${label} nəzəriyyəsi`],
      ans: 0,
      exp: `${label} mövzusunun əsas anlayışı ən geniş əhatə dairəsinə malikdir.`,
      topic: label,
      difficulty: 'orta'
    },
    {
      q: `${label} haqqında hansı ifadə doğrudur?`,
      opts: [`${label} müstəqil bir sahədir`, `${label} digər sahələrlə əlaqəlidir`, `${label} yalnız nəzəridir`, `${label} praktiki deyil`],
      ans: 1,
      exp: `${label} digər sahələrlə sıx əlaqəlidir.`,
      topic: label,
      difficulty: 'asan'
    },
    {
      q: `${label} mövzusunun əsas xüsusiyyəti nədir?`,
      opts: ['Mürəkkəblik', 'Sadəlik', 'Sistemlilik', 'Təsadüfilik'],
      ans: 2,
      exp: `${label} mövzusu sistemli quruluşa malikdir.`,
      topic: label,
      difficulty: 'orta'
    },
  ];

  const result = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    result.push({ ...templates[i % templates.length], q: `${i + 1}. ` + templates[i % templates.length].q });
  }
  return result;
}
