import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, grade, count = 10 } = await req.json();
    if (!topic && !subject) return NextResponse.json({ error: 'Mövzu daxil edin' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Wikipedia-dan kontekst al
    let context = '';
    const q = [subject, topic].filter(Boolean).join(' ');
    for (const lang of ['az', 'en']) {
      try {
        const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(3500) });
        if (r.ok) { const d = await r.json(); if (d.extract) { context += d.extract + '\n\n'; break; } }
      } catch { /**/ }
    }

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const qs = makePracticalQuestions(topic || '', subject || '', grade || '', count, context);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const prompt = `Sən Azərbaycan məktəb sınaq platforması üçün PRAKTIKI test sualları yaradırsın.

${context ? `KONTEKST (Wikipedia):\n${context.slice(0, 2500)}\n\n` : ''}TAPŞIRIQ:
${grade ? `Sinif: ${grade}-ci sinif` : ''}
${subject ? `Fənn: ${subject}` : ''}
${topic ? `Mövzu: ${topic}` : ''}
Sual sayı: ${count}

ÇOX VACİB: Suallar KONKRET, FAKTLARA ƏSASLANAN, PRAKTIKI olsun. Ümumi/mücərrəd suallar YAZMA.
Hər sual real bilik yoxlamalıdır. Variantlar arasında yalnız 1 doğru cavab olsun.

JSON formatında cavab ver:
[{"q":"Konkret sual?","opts":["A","B","C","D"],"ans":0,"exp":"Qısa izahat","topic":"${topic || subject || 'Ümumi'}","difficulty":"orta"}]

Yalnız JSON array qaytır.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!res.ok) {
      const qs = makePracticalQuestions(topic || '', subject || '', grade || '', count, context);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const data = await res.json();
    const raw = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') || '';
    const questions = parseQ(raw);

    if (!questions.length) {
      const qs = makePracticalQuestions(topic || '', subject || '', grade || '', count, context);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    return NextResponse.json({ questions, total: questions.length });
  } catch (e) {
    return NextResponse.json({ error: 'Xəta: ' + (e instanceof Error ? e.message : 'bilinməyən') }, { status: 500 });
  }
}

function parseQ(raw: string): object[] {
  try { const m = raw.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch { /**/ }
  return [];
}

// Mövzuya görə praktiki suallar
function makePracticalQuestions(topic: string, subject: string, grade: string, count: number, context: string): object[] {
  const label = topic || subject || 'Ümumi';
  const g = grade ? `${grade}-ci sinif` : '';

  // Fənnə görə xüsusi suallar
  const subjectQuestions: Record<string, object[]> = {
    'Riyaziyyat': [
      { q: `${g} 2x + 5 = 13 tənliyinin həlli nədir?`, opts: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], ans: 1, exp: '2x = 13 - 5 = 8, x = 4', topic: label, difficulty: 'asan' },
      { q: `${g} Üçbucağın daxili bucaqlarının cəmi neçə dərəcədir?`, opts: ['90°', '180°', '270°', '360°'], ans: 1, exp: 'Hər üçbucağın daxili bucaqlarının cəmi 180° bərabərdir.', topic: label, difficulty: 'asan' },
      { q: `${g} 3² + 4² = ?`, opts: ['14', '25', '49', '7'], ans: 1, exp: '9 + 16 = 25', topic: label, difficulty: 'asan' },
      { q: `${g} Kvadratın sahəsi 36 sm² olarsa, tərəfi neçə sm-dir?`, opts: ['4', '6', '8', '9'], ans: 1, exp: 'S = a², 36 = a², a = 6 sm', topic: label, difficulty: 'orta' },
      { q: `${g} 0.5 + 0.25 = ?`, opts: ['0.55', '0.65', '0.75', '0.85'], ans: 2, exp: '0.5 + 0.25 = 0.75', topic: label, difficulty: 'asan' },
    ],
    'Fizika': [
      { q: `${g} Işığın boşluqdakı sürəti təxminən neçədir?`, opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], ans: 1, exp: 'Işığın boşluqdakı sürəti c ≈ 3×10⁸ m/s-dir.', topic: label, difficulty: 'orta' },
      { q: `${g} F = ma düsturu hansı qanunu ifadə edir?`, opts: ['Nyutonun I qanunu', 'Nyutonun II qanunu', 'Nyutonun III qanunu', 'Arximed qanunu'], ans: 1, exp: 'F = ma — Nyutonun II qanunudur: qüvvə kütlə ilə təcəlin hasilinə bərabərdir.', topic: label, difficulty: 'orta' },
      { q: `${g} Elektrik cərəyanının vahidi nədir?`, opts: ['Volt', 'Amper', 'Om', 'Vatt'], ans: 1, exp: 'Elektrik cərəyanının SI vahidi Amper (A)-dir.', topic: label, difficulty: 'asan' },
    ],
    'Kimya': [
      { q: `${g} Su molekulunun kimyəvi formulu nədir?`, opts: ['H₂O₂', 'H₂O', 'HO', 'H₃O'], ans: 1, exp: 'Su molekulu 2 hidrogen və 1 oksigen atomundan ibarətdir: H₂O', topic: label, difficulty: 'asan' },
      { q: `${g} Dövri cədvəldə neçə qrup var?`, opts: ['7', '8', '18', '16'], ans: 2, exp: 'Mendeleyevin dövri cədvəlində 18 qrup var.', topic: label, difficulty: 'orta' },
      { q: `${g} NaCl nəyin kimyəvi formulu?`, opts: ['Şəkər', 'Xörək duzu', 'Soda', 'Sirke'], ans: 1, exp: 'NaCl — natrium xlorid, yəni xörək duzudur.', topic: label, difficulty: 'asan' },
    ],
    'Biologiya': [
      { q: `${g} Fotosintez prosesinin əsas məhsulu nədir?`, opts: ['CO₂', 'O₂ və qlükoza', 'Su', 'Azot'], ans: 1, exp: 'Fotosintezdə günəş enerjisi ilə CO₂ və H₂O-dan O₂ və qlükoza əmələ gəlir.', topic: label, difficulty: 'orta' },
      { q: `${g} İnsan orqanizmindəki ən böyük orqan hansıdır?`, opts: ['Qaraciyər', 'Ağciyər', 'Dəri', 'Beyin'], ans: 2, exp: 'Dəri insan orqanizminin ən böyük orqanıdır.', topic: label, difficulty: 'asan' },
      { q: `${g} DNT-nin tam adı nədir?`, opts: ['Dezoksiribonuklein turşusu', 'Ribonuklein turşusu', 'Dezoksiriboza', 'Nuklein turşusu'], ans: 0, exp: 'DNT — Dezoksiribonuklein turşusu, irsi məlumatı daşıyır.', topic: label, difficulty: 'orta' },
    ],
    'Tarix': [
      { q: `${g} Azərbaycan Xalq Cümhuriyyəti nə vaxt elan edildi?`, opts: ['1917', '1918', '1920', '1991'], ans: 1, exp: 'AXC 28 may 1918-ci ildə elan edildi — müsəlman dünyasında ilk demokratik respublika.', topic: label, difficulty: 'orta' },
      { q: `${g} Azərbaycan müstəqilliyini nə vaxt bərpa etdi?`, opts: ['1988', '1990', '1991', '1993'], ans: 2, exp: 'Azərbaycan 18 oktyabr 1991-ci ildə dövlət müstəqilliyini bərpa etdi.', topic: label, difficulty: 'asan' },
    ],
    'Coğrafiya': [
      { q: `${g} Azərbaycanın paytaxtı hansı şəhərdir?`, opts: ['Gəncə', 'Bakı', 'Sumqayıt', 'Lənkəran'], ans: 1, exp: 'Bakı Azərbaycanın paytaxtı və ən böyük şəhəridir.', topic: label, difficulty: 'asan' },
      { q: `${g} Xəzər dənizi hansı növ su hövzəsidir?`, opts: ['Dəniz', 'Göl', 'Körfəz', 'Okean'], ans: 1, exp: 'Xəzər dünyanın ən böyük qapalı su hövzəsidir — göldür.', topic: label, difficulty: 'orta' },
    ],
    'Azərbaycan dili': [
      { q: `${g} "Kitabi-Dədə Qorqud" dastanı hansı dildə yazılmışdır?`, opts: ['Ərəb', 'Fars', 'Qədim türk', 'Rus'], ans: 2, exp: '"Kitabi-Dədə Qorqud" qədim türk dilinin oğuz ləhcəsində yazılmışdır.', topic: label, difficulty: 'orta' },
      { q: `${g} Azərbaycan əlifbasında neçə hərf var?`, opts: ['29', '32', '33', '26'], ans: 2, exp: 'Müasir Azərbaycan latın əlifbasında 33 hərf var.', topic: label, difficulty: 'asan' },
    ],
  };

  // Mövzuya görə xüsusi suallar
  const topicSpecific: Record<string, object[]> = {
    'fotosintez': [
      { q: 'Fotosintez prosesi harada baş verir?', opts: ['Mitoxondridə', 'Xloroplastda', 'Nüvədə', 'Ribosomda'], ans: 1, exp: 'Fotosintez xloroplastlarda, xüsusilə tilakoidlərdə baş verir.', topic: 'Fotosintez', difficulty: 'orta' },
      { q: 'Fotosintez üçün hansı enerji mənbəyi lazımdır?', opts: ['İstilik', 'Günəş işığı', 'Elektrik', 'Kimyəvi'], ans: 1, exp: 'Fotosintez günəş enerjisindən istifadə edir.', topic: 'Fotosintez', difficulty: 'asan' },
      { q: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ — bu hansı prosesin tənliyi?', opts: ['Tənəffüs', 'Fotosintez', 'Fermentasiya', 'Oksidləşmə'], ans: 1, exp: 'Bu fotosintezin ümumi kimyəvi tənliyidir.', topic: 'Fotosintez', difficulty: 'çətin' },
    ],
    'kvadrat tənlik': [
      { q: 'x² - 5x + 6 = 0 tənliyinin kökləri hansılardır?', opts: ['x=1, x=6', 'x=2, x=3', 'x=-2, x=-3', 'x=1, x=5'], ans: 1, exp: '(x-2)(x-3)=0, x=2 və x=3', topic: 'Kvadrat tənlik', difficulty: 'orta' },
      { q: 'ax² + bx + c = 0 tənliyinin diskriminantı necə hesablanır?', opts: ['D = b² + 4ac', 'D = b² - 4ac', 'D = 2b - ac', 'D = b - 2ac'], ans: 1, exp: 'Diskriminant D = b² - 4ac düsturu ilə hesablanır.', topic: 'Kvadrat tənlik', difficulty: 'orta' },
    ],
  };

  // Mövzuya uyğun sualları tap
  const topicLower = topic.toLowerCase();
  let pool: object[] = [];

  for (const [key, qs] of Object.entries(topicSpecific)) {
    if (topicLower.includes(key)) { pool = [...pool, ...qs]; }
  }

  if (pool.length < count && subject && subjectQuestions[subject]) {
    pool = [...pool, ...subjectQuestions[subject]];
  }

  // Kontekstdən sual yarat (əgər Wikipedia məlumatı varsa)
  if (context && pool.length < count) {
    const sentences = context.split(/[.!?]/).filter(s => s.trim().length > 30).slice(0, 5);
    sentences.forEach((sent, i) => {
      const trimmed = sent.trim();
      if (trimmed.length > 30) {
        pool.push({
          q: `${label} ilə bağlı: "${trimmed.slice(0, 80)}..." — bu ifadə nəyi bildirir?`,
          opts: ['Tarixi faktı', 'Elmi qanunu', 'Əsas xüsusiyyəti', 'Tərifi'],
          ans: 2,
          exp: `Bu ${label} mövzusunun əsas xüsusiyyətlərindən birini izah edir.`,
          topic: label,
          difficulty: 'orta',
        });
      }
    });
  }

  // Ümumi fallback
  if (pool.length < count) {
    const general = [
      { q: `${label} sahəsinin əsas tədqiqat metodu hansıdır?`, opts: ['Müşahidə', 'Eksperiment', 'Müqayisə', 'Hamısı'], ans: 3, exp: `${label} sahəsində müxtəlif metodlardan istifadə edilir.`, topic: label, difficulty: 'orta' },
      { q: `${label} ilə bağlı hansı ifadə doğrudur?`, opts: [`${label} yalnız nəzəridir`, `${label} praktiki tətbiqi var`, `${label} köhnəlmiş sahədir`, `${label} az əhəmiyyətlidir`], ans: 1, exp: `${label} həm nəzəri, həm də praktiki əhəmiyyətə malikdir.`, topic: label, difficulty: 'asan' },
      { q: `${g} ${label} mövzusunda ən vacib anlayış hansıdır?`, opts: ['Əsas anlayış', 'Köməkçi anlayış', 'Əlavə anlayış', 'Tarixi anlayış'], ans: 0, exp: `${label} mövzusunun əsas anlayışı bütün digər anlayışların əsasını təşkil edir.`, topic: label, difficulty: 'asan' },
    ];
    pool = [...pool, ...general];
  }

  // Unikal suallar seç
  const result = [];
  const used = new Set<number>();
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    let idx = i % pool.length;
    while (used.has(idx) && used.size < pool.length) idx = (idx + 1) % pool.length;
    used.add(idx);
    result.push(pool[idx]);
  }
  return result;
}
