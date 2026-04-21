import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, count = 10, lang = 'az' } = await req.json();
    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Mətn ən az 20 simvol olmalıdır' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const n = Math.min(Math.max(parseInt(String(count)) || 10, 1), 50);

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const qs = buildFromText(text, n);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const langLabel = lang === 'ru' ? 'rus dilinde' : lang === 'en' ? 'English' : 'Azerbaycan dilinde';
    const prompt = `Asagidaki metne esasen ${langLabel} ${n} eded test suali yarat.

METN:
${text.slice(0, 8000)}

VACIB QAYDALAR:
1. Suallar YALNIZ verilmis metne esaslanmalidir
2. Her sual 4 variantli olmalidir (A, B, C, D)
3. Yalniz 1 dogru cavab olmalidir
4. Suallar metni dusundurucu sekilde yoxlamalidir
5. MUTLEQ ${n} sual yaz

JSON formatinda cavab ver:
[{"q":"Sual?","opts":["A","B","C","D"],"ans":0,"exp":"Izahat","topic":"Movzu","difficulty":"orta"}]

ans — dogru cavab indeksi (0-3). Yalniz JSON array qaytir.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!res.ok) {
      const qs = buildFromText(text, n);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const data = await res.json();
    const raw = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') || '';
    let questions = parseQ(raw);

    if (questions.length < n) {
      const extra = buildFromText(text, n - questions.length);
      questions = [...questions, ...extra];
    }

    return NextResponse.json({ questions: questions.slice(0, n), total: Math.min(questions.length, n) });
  } catch (e) {
    return NextResponse.json({ error: 'Xeta: ' + (e instanceof Error ? e.message : 'bilinmeyen') }, { status: 500 });
  }
}

function parseQ(raw: string): object[] {
  try { const m = raw.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch { /**/ }
  return [];
}

function buildFromText(text: string, count: number): object[] {
  // Mətndən cümlələr çıxar
  const sentences = text
    .split(/[.!?؟]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.length < 200)
    .slice(0, 20);

  const pool: object[] = [];

  sentences.forEach((sent, i) => {
    const words = sent.split(' ').filter(w => w.length > 3);
    if (words.length < 4) return;

    // Boşluq sualı
    const keyWordIdx = Math.floor(words.length / 2);
    const keyWord = words[keyWordIdx];
    const blanked = sent.replace(keyWord, '___');

    const fakeWords = words.filter((_, j) => j !== keyWordIdx).slice(0, 3);
    while (fakeWords.length < 3) fakeWords.push('digər', 'başqa', 'həmin');

    const opts = [keyWord, fakeWords[0], fakeWords[1], fakeWords[2]];
    const shuffled = [...opts].sort(() => Math.random() - 0.5);
    const ans = shuffled.indexOf(keyWord);

    pool.push({
      q: `Boşluğu doldurun: "${blanked}"`,
      opts: shuffled,
      ans,
      exp: `Düzgün cavab: "${keyWord}" — mətndən götürülmüşdür.`,
      topic: `Paraqraf ${i + 1}`,
      difficulty: 'orta',
    });

    // Doğru/yanlış sualı
    if (i % 2 === 0) {
      pool.push({
        q: `Aşağıdakı ifadə doğrudurmu? "${sent.slice(0, 80)}..."`,
        opts: ['Doğrudur', 'Yanlışdır', 'Qismən doğrudur', 'Məlumat yoxdur'],
        ans: 0,
        exp: `Bu ifadə mətndə birbaşa qeyd edilmişdir.`,
        topic: `Paraqraf ${i + 1}`,
        difficulty: 'asan',
      });
    }
  });

  // Ümumi suallar
  if (pool.length < count) {
    const wordFreq: Record<string, number> = {};
    text.split(/\s+/).forEach(w => {
      const clean = w.replace(/[^a-zA-ZəüöğışçÇŞĞÜÖƏİ]/g, '').toLowerCase();
      if (clean.length > 4) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    });
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);

    if (topWords.length >= 4) {
      pool.push({
        q: 'Mətndə ən çox hansı mövzu müzakirə edilir?',
        opts: topWords.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)),
        ans: 0,
        exp: `"${topWords[0]}" mətndə ən çox istifadə edilən sözdür.`,
        topic: 'Ümumi',
        difficulty: 'orta',
      });
    }
  }

  return pool.slice(0, count);
}
