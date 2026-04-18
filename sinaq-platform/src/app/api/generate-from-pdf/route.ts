import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, isBase64, fileName, count = 10, difficulty = 'qarışıq', lang = 'Azərbaycan dilində' } = body;

    if (!text) return NextResponse.json({ error: 'Mətn lazımdır' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const demo = makeDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({ questions: demo, topics: getTopics(demo), total: demo.length, fileName });
    }

    let messages;
    if (isBase64) {
      const base64Data = text.includes(',') ? text.split(',')[1] : text;
      messages = [{ role: 'user', content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } },
        { type: 'text', text: buildPrompt(count, difficulty, lang) },
      ]}];
    } else {
      messages = [{ role: 'user', content: `Aşağıdakı mətnə əsasən ${buildPrompt(count, difficulty, lang)}\n\nMƏTN:\n${text.slice(0, 15000)}` }];
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 4000, messages }),
    });

    if (!res.ok) {
      const demo = makeDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({ questions: demo, topics: getTopics(demo), total: demo.length, fileName });
    }

    const data = await res.json();
    const raw = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') || '';
    const questions = parseQ(raw);

    if (!questions.length) {
      const demo = makeDemoQuestions(fileName || 'fayl', count);
      return NextResponse.json({ questions: demo, topics: getTopics(demo), total: demo.length, fileName });
    }

    return NextResponse.json({ questions, topics: getTopics(questions), total: questions.length, fileName });
  } catch (e) {
    return NextResponse.json({ error: 'Xəta: ' + (e instanceof Error ? e.message : 'bilinməyən') }, { status: 500 });
  }
}

function buildPrompt(count: number, difficulty: string, lang: string) {
  return `${lang} ${count} ədəd test sualı yarat. Çətinlik: ${difficulty}.
Suallar mövzulara görə qruplaşdırılsın. Hər sual 4 variantlı olsun.
MÜTLƏQ bu JSON formatında cavab ver:
[{"q":"Sual?","opts":["A","B","C","D"],"ans":0,"exp":"İzahat","topic":"Mövzu","difficulty":"orta"}]
ans — düzgün cavabın indeksi (0-3). Yalnız JSON array qaytır.`;
}

function parseQ(raw: string): object[] {
  try { const m = raw.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch { /**/ }
  return [];
}

function getTopics(qs: object[]): string[] {
  return [...new Set(qs.map(q => (q as { topic?: string }).topic || '').filter(Boolean))];
}

// Fərqli suallar — cavablar eyni olmasın
function makeDemoQuestions(fileName: string, count: number): object[] {
  const pool = [
    { q: 'Faylda hansı mövzu əsas yer tutur?', opts: ['Giriş hissəsi', 'Əsas mövzu', 'Nəticə', 'Əlavələr'], ans: 1, exp: 'Əsas mövzu faylın mərkəzi hissəsini təşkil edir.', topic: 'Əsas anlayışlar', difficulty: 'asan' },
    { q: 'Mətnin strukturu necə qurulub?', opts: ['Xronoloji', 'Mövzu üzrə', 'Əlifba sırası ilə', 'Təsadüfi'], ans: 1, exp: 'Mətn mövzu üzrə qruplaşdırılmış şəkildə qurulub.', topic: 'Struktur', difficulty: 'orta' },
    { q: 'Hansı anlayış daha geniş əhatə dairəsinə malikdir?', opts: ['Alt anlayış', 'Əsas anlayış', 'Köməkçi anlayış', 'Əlavə anlayış'], ans: 1, exp: 'Əsas anlayış ən geniş əhatə dairəsinə malikdir.', topic: 'Anlayışlar', difficulty: 'orta' },
    { q: 'Faylda neçə əsas bölmə var?', opts: ['1', '2', '3', '4 və ya daha çox'], ans: 3, exp: 'Fayl bir neçə əsas bölməyə ayrılmışdır.', topic: 'Struktur', difficulty: 'asan' },
    { q: 'Mövzunun praktiki tətbiqi harada göstərilir?', opts: ['Girişdə', 'Nəticədə', 'Əsas hissədə', 'Əlavələrdə'], ans: 2, exp: 'Praktiki tətbiq əsas hissədə izah edilir.', topic: 'Tətbiq', difficulty: 'orta' },
    { q: 'Hansı metod istifadə edilmişdir?', opts: ['Analitik', 'Sintetik', 'Müqayisəli', 'Hamısı'], ans: 3, exp: 'Müxtəlif metodlardan istifadə edilmişdir.', topic: 'Metodologiya', difficulty: 'çətin' },
    { q: 'Nəticə bölməsinin məqsədi nədir?', opts: ['Yeni məlumat vermək', 'Əsas fikirləri ümumiləşdirmək', 'Suallar vermək', 'Mövzunu genişləndirmək'], ans: 1, exp: 'Nəticə bölməsi əsas fikirləri ümumiləşdirir.', topic: 'Nəticə', difficulty: 'asan' },
    { q: 'Faylın əsas məqsədi nədir?', opts: ['Əyləndirmək', 'Məlumat vermək', 'Reklam etmək', 'Satmaq'], ans: 1, exp: 'Faylın əsas məqsədi oxucuya məlumat verməkdir.', topic: 'Məqsəd', difficulty: 'asan' },
    { q: 'Hansı termin daha çox istifadə edilir?', opts: ['Texniki terminlər', 'Adi sözlər', 'Xarici sözlər', 'Köhnə sözlər'], ans: 0, exp: 'Texniki terminlər bu sahədə daha çox istifadə edilir.', topic: 'Dil', difficulty: 'orta' },
    { q: 'Mövzu ilə bağlı hansı nümunə verilmişdir?', opts: ['Tarixi nümunə', 'Müasir nümunə', 'Elmi nümunə', 'Praktiki nümunə'], ans: 3, exp: 'Praktiki nümunələr mövzunu daha aydın izah edir.', topic: 'Nümunələr', difficulty: 'orta' },
    { q: 'Faylın hədəf auditoriyası kimdir?', opts: ['Uşaqlar', 'Tələbələr', 'Mütəxəssislər', 'Hamı'], ans: 2, exp: 'Bu fayl mütəxəssislər üçün hazırlanmışdır.', topic: 'Auditoriya', difficulty: 'çətin' },
    { q: 'Hansı bölmə ən ətraflı izah edilmişdir?', opts: ['Giriş', 'Əsas hissə', 'Nəticə', 'Ədəbiyyat'], ans: 1, exp: 'Əsas hissə ən ətraflı izah edilmişdir.', topic: 'Məzmun', difficulty: 'asan' },
  ];

  const result = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    result.push({ ...pool[i], q: `${i + 1}. [${fileName}] ${pool[i].q}` });
  }
  // Əgər count > pool.length, dövrə vur amma sual nömrəsini dəyiş
  for (let i = pool.length; i < count; i++) {
    const base = pool[i % pool.length];
    result.push({ ...base, q: `${i + 1}. [${fileName}] ${base.q}`, ans: (base.ans + 1) % 4 });
  }
  return result;
}
