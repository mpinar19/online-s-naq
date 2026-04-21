import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, grade, count = 10 } = await req.json();
    if (!topic && !subject) return NextResponse.json({ error: 'Movzu daxil edin' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const label = (topic || subject || 'Umumi') as string;
    const n = Math.min(Math.max(parseInt(String(count)) || 10, 1), 50);

    // Wikipedia kontekst
    let context = '';
    const q = [subject, topic].filter(Boolean).join(' ');
    for (const lang of ['az', 'en']) {
      try {
        const r = await fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`,
          { signal: AbortSignal.timeout(3500) }
        );
        if (r.ok) {
          const d = await r.json();
          if (d.extract && d.extract.length > 50) { context = d.extract; break; }
        }
      } catch { /**/ }
    }

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const qs = buildLocalQuestions(label, subject as string || '', grade as string || '', n, context);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const prompt = `Sen Azerbaycan mekteb sinaq platformasi ucun YALNIZ "${label}" movzusuna aid test suallar yaradirsan.

${context ? `WIKIPEDIA KONTEKST:\n${context.slice(0, 2000)}\n\n` : ''}TAPSIRIG:
- Movzu: ${label}
${subject ? `- Fen: ${subject}` : ''}
${grade ? `- Sinif: ${grade}-ci sinif` : ''}
- Sual sayi: MUTLEQ ${n} SUAL

VACIB: Yalniz "${label}" movzusuna aid KONKRET, FAKTLARA ESASLANAN suallar yaz.
Umumi suallar YAZMA. MUTLEQ ${n} sual yaz.

JSON formatinda cavab ver:
[{"q":"Sual?","opts":["A","B","C","D"],"ans":0,"exp":"Izahat","topic":"${label}","difficulty":"orta"}]

ans — dogru cavab indeksi (0-3). Yalniz JSON array qaytir.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!res.ok) {
      const qs = buildLocalQuestions(label, subject as string || '', grade as string || '', n, context);
      return NextResponse.json({ questions: qs, total: qs.length });
    }

    const data = await res.json();
    const raw = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') || '';
    let questions = parseQ(raw);

    if (questions.length < n) {
      const extra = buildLocalQuestions(label, subject as string || '', grade as string || '', n - questions.length, context);
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

function buildLocalQuestions(topic: string, subject: string, grade: string, count: number, context: string): object[] {
  const g = grade ? `${grade}-ci sinif` : '';
  const pool: object[] = [];

  const bySubject: Record<string, object[]> = {
    'Riyaziyyat': [
      { q: `${g} 2x + 5 = 13 tənliyinin həlli nədir?`, opts: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], ans: 1, exp: '2x = 8, x = 4', topic, difficulty: 'asan' },
      { q: `${g} Üçbucağın daxili bucaqlarının cəmi neçə dərəcədir?`, opts: ['90°', '180°', '270°', '360°'], ans: 1, exp: 'Hər üçbucağın daxili bucaqlarının cəmi 180°-dir.', topic, difficulty: 'asan' },
      { q: `${g} 3² + 4² = ?`, opts: ['14', '25', '49', '7'], ans: 1, exp: '9 + 16 = 25', topic, difficulty: 'asan' },
      { q: `${g} Kvadratın sahəsi 36 sm² olarsa, tərəfi neçə sm-dir?`, opts: ['4', '6', '8', '9'], ans: 1, exp: 'a² = 36, a = 6 sm', topic, difficulty: 'orta' },
      { q: `${g} x² - 5x + 6 = 0 tənliyinin kökləri hansılardır?`, opts: ['x=1, x=6', 'x=2, x=3', 'x=-2, x=-3', 'x=1, x=5'], ans: 1, exp: '(x-2)(x-3)=0', topic, difficulty: 'orta' },
      { q: `${g} sin²α + cos²α = ?`, opts: ['0', '1', '2', 'α'], ans: 1, exp: 'Triqonometrik əsas eynilik: sin²α + cos²α = 1', topic, difficulty: 'orta' },
      { q: `${g} Ədədin 20%-i 14-ə bərabərdir. Ədəd neçədir?`, opts: ['56', '60', '70', '80'], ans: 2, exp: 'x × 0.2 = 14, x = 70', topic, difficulty: 'orta' },
      { q: `${g} Düzbucaqlının perimetri P = 2(a+b). a=5, b=3 olduqda P = ?`, opts: ['15', '16', '17', '18'], ans: 1, exp: 'P = 2(5+3) = 16', topic, difficulty: 'asan' },
    ],
    'Fizika': [
      { q: `${g} Işığın boşluqdakı sürəti təxminən neçədir?`, opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], ans: 1, exp: 'c ≈ 3×10⁸ m/s', topic, difficulty: 'orta' },
      { q: `${g} F = ma düsturu hansı qanunu ifadə edir?`, opts: ['Nyutonun I qanunu', 'Nyutonun II qanunu', 'Nyutonun III qanunu', 'Arximed qanunu'], ans: 1, exp: 'F = ma — Nyutonun II qanunudur.', topic, difficulty: 'orta' },
      { q: `${g} Elektrik cərəyanının vahidi nədir?`, opts: ['Volt', 'Amper', 'Om', 'Vatt'], ans: 1, exp: 'Elektrik cərəyanının SI vahidi Amper (A)-dir.', topic, difficulty: 'asan' },
      { q: `${g} Ohm qanunu: I = U/R. U = 12V, R = 4Ω olduqda I = ?`, opts: ['2A', '3A', '4A', '6A'], ans: 1, exp: 'I = 12/4 = 3A', topic, difficulty: 'orta' },
      { q: `${g} Səsin havadakı sürəti təxminən neçədir?`, opts: ['340 m/s', '3400 m/s', '34 m/s', '3000 m/s'], ans: 0, exp: 'Səsin havadakı sürəti ≈ 340 m/s-dir.', topic, difficulty: 'asan' },
      { q: `${g} Enerjinin saxlanması qanununa görə nə baş verir?`, opts: ['Enerji yox olur', 'Enerji yaranır', 'Enerji bir formadan digərinə keçir', 'Enerji artır'], ans: 2, exp: 'Enerji yox olmur, bir formadan digərinə çevrilir.', topic, difficulty: 'orta' },
    ],
    'Kimya': [
      { q: `${g} Su molekulunun kimyəvi formulu nədir?`, opts: ['H₂O₂', 'H₂O', 'HO', 'H₃O'], ans: 1, exp: 'Su: 2 hidrogen + 1 oksigen = H₂O', topic, difficulty: 'asan' },
      { q: `${g} Dövri cədvəldə neçə qrup var?`, opts: ['7', '8', '18', '16'], ans: 2, exp: 'Mendeleyevin dövri cədvəlində 18 qrup var.', topic, difficulty: 'orta' },
      { q: `${g} NaCl nəyin kimyəvi formulu?`, opts: ['Şəkər', 'Xörək duzu', 'Soda', 'Sirke'], ans: 1, exp: 'NaCl — natrium xlorid, xörək duzudur.', topic, difficulty: 'asan' },
      { q: `${g} Oksigenin atom nömrəsi neçədir?`, opts: ['6', '7', '8', '9'], ans: 2, exp: 'Oksigenin atom nömrəsi 8-dir.', topic, difficulty: 'asan' },
      { q: `${g} Turşuların ümumi formulu hansıdır?`, opts: ['MOH', 'HₙA', 'MₙO', 'NH₃'], ans: 1, exp: 'Turşular HₙA formulu ilə ifadə edilir.', topic, difficulty: 'orta' },
    ],
    'Biologiya': [
      { q: `${g} Fotosintez prosesinin əsas məhsulu nədir?`, opts: ['CO₂', 'O₂ və qlükoza', 'Su', 'Azot'], ans: 1, exp: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', topic, difficulty: 'orta' },
      { q: `${g} İnsan orqanizmindəki ən böyük orqan hansıdır?`, opts: ['Qaraciyər', 'Ağciyər', 'Dəri', 'Beyin'], ans: 2, exp: 'Dəri ən böyük orqandır.', topic, difficulty: 'asan' },
      { q: `${g} DNT-nin tam adı nədir?`, opts: ['Dezoksiribonuklein turşusu', 'Ribonuklein turşusu', 'Dezoksiriboza', 'Nuklein turşusu'], ans: 0, exp: 'DNT — Dezoksiribonuklein turşusu.', topic, difficulty: 'orta' },
      { q: `${g} Fotosintez harada baş verir?`, opts: ['Mitoxondridə', 'Xloroplastda', 'Nüvədə', 'Ribosomda'], ans: 1, exp: 'Fotosintez xloroplastlarda baş verir.', topic, difficulty: 'orta' },
      { q: `${g} İnsan qanının neçə qrupu var?`, opts: ['2', '3', '4', '5'], ans: 2, exp: 'İnsan qanının 4 qrupu var: I, II, III, IV.', topic, difficulty: 'asan' },
    ],
    'Tarix': [
      { q: `${g} Azərbaycan Xalq Cümhuriyyəti nə vaxt elan edildi?`, opts: ['1917', '1918', '1920', '1991'], ans: 1, exp: 'AXC 28 may 1918-ci ildə elan edildi.', topic, difficulty: 'orta' },
      { q: `${g} Azərbaycan müstəqilliyini nə vaxt bərpa etdi?`, opts: ['1988', '1990', '1991', '1993'], ans: 2, exp: '18 oktyabr 1991-ci ildə.', topic, difficulty: 'asan' },
      { q: `${g} Birinci Dünya Müharibəsi nə vaxt başladı?`, opts: ['1912', '1914', '1916', '1918'], ans: 1, exp: 'I Dünya Müharibəsi 1914-cü ildə başladı.', topic, difficulty: 'orta' },
      { q: `${g} Böyük İpək Yolu hansı şəhərləri birləşdirirdi?`, opts: ['Çin-Avropa', 'Hindistan-Afrika', 'Rusiya-Çin', 'Avropa-Amerika'], ans: 0, exp: 'Böyük İpək Yolu Çindən Avropaya uzanırdı.', topic, difficulty: 'orta' },
    ],
    'Coğrafiya': [
      { q: `${g} Azərbaycanın paytaxtı hansı şəhərdir?`, opts: ['Gəncə', 'Bakı', 'Sumqayıt', 'Lənkəran'], ans: 1, exp: 'Bakı Azərbaycanın paytaxtıdır.', topic, difficulty: 'asan' },
      { q: `${g} Xəzər dənizi hansı növ su hövzəsidir?`, opts: ['Dəniz', 'Göl', 'Körfəz', 'Okean'], ans: 1, exp: 'Xəzər dünyanın ən böyük qapalı su hövzəsidir.', topic, difficulty: 'orta' },
      { q: `${g} Dünyanın ən uzun çayı hansıdır?`, opts: ['Amazon', 'Nil', 'Yanszı', 'Missisipi'], ans: 1, exp: 'Nil çayı 6650 km uzunluğu ilə ən uzun çaydır.', topic, difficulty: 'orta' },
      { q: `${g} Azərbaycanın sahəsi təxminən neçə km²-dir?`, opts: ['56600', '76600', '86600', '96600'], ans: 2, exp: 'Azərbaycanın sahəsi 86600 km²-dir.', topic, difficulty: 'orta' },
    ],
    'Azərbaycan dili': [
      { q: `${g} Azərbaycan əlifbasında neçə hərf var?`, opts: ['29', '32', '33', '26'], ans: 2, exp: 'Müasir Azərbaycan latın əlifbasında 33 hərf var.', topic, difficulty: 'asan' },
      { q: `${g} Hansı söz isimdir?`, opts: ['gözəl', 'qaçmaq', 'kitab', 'tez'], ans: 2, exp: '"Kitab" əşyanın adını bildirir — isimdir.', topic, difficulty: 'asan' },
      { q: `${g} Cümlənin əsas üzvləri hansılardır?`, opts: ['Mübtəda və xəbər', 'Tamamlıq və zərflik', 'Təyin və tamamlıq', 'Xəbər və zərflik'], ans: 0, exp: 'Mübtəda və xəbər cümlənin əsas üzvləridir.', topic, difficulty: 'asan' },
      { q: `${g} "Kitabi-Dədə Qorqud" dastanı hansı dildə yazılmışdır?`, opts: ['Ərəb', 'Fars', 'Qədim türk', 'Rus'], ans: 2, exp: 'Qədim türk dilinin oğuz ləhcəsindədir.', topic, difficulty: 'orta' },
    ],
  };

  const topicLower = topic.toLowerCase();
  const topicSpecific: Record<string, object[]> = {
    'fotosintez': [
      { q: 'Fotosintez üçün hansı enerji mənbəyi lazımdır?', opts: ['İstilik', 'Günəş işığı', 'Elektrik', 'Kimyəvi'], ans: 1, exp: 'Fotosintez günəş enerjisindən istifadə edir.', topic, difficulty: 'asan' },
      { q: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ — bu hansı prosesin tənliyi?', opts: ['Tənəffüs', 'Fotosintez', 'Fermentasiya', 'Oksidləşmə'], ans: 1, exp: 'Bu fotosintezin ümumi kimyəvi tənliyidir.', topic, difficulty: 'orta' },
      { q: 'Fotosintezdə CO₂ hansı maddəyə çevrilir?', opts: ['Oksigenə', 'Suya', 'Qlükozaya', 'Azota'], ans: 2, exp: 'CO₂ fotosintezdə qlükozaya çevrilir.', topic, difficulty: 'orta' },
      { q: 'Xlorofil nə üçün lazımdır?', opts: ['Su udmaq', 'Günəş enerjisini udmaq', 'CO₂ buraxmaq', 'Oksigen udmaq'], ans: 1, exp: 'Xlorofil günəş enerjisini udur.', topic, difficulty: 'orta' },
    ],
    'kvadrat': [
      { q: 'ax² + bx + c = 0 tənliyinin diskriminantı necə hesablanır?', opts: ['D = b² + 4ac', 'D = b² - 4ac', 'D = 2b - ac', 'D = b - 2ac'], ans: 1, exp: 'D = b² - 4ac', topic, difficulty: 'orta' },
      { q: 'x² - 4 = 0 tənliyinin kökləri hansılardır?', opts: ['x = 2', 'x = ±2', 'x = 4', 'x = ±4'], ans: 1, exp: 'x² = 4, x = ±2', topic, difficulty: 'asan' },
      { q: 'D < 0 olduqda kvadrat tənliyin neçə həqiqi kökü var?', opts: ['0', '1', '2', 'Sonsuz'], ans: 0, exp: 'D < 0 olduqda həqiqi kök yoxdur.', topic, difficulty: 'orta' },
    ],
    'nyuton': [
      { q: 'Nyutonun I qanunu nəyi bildirir?', opts: ['Hərəkət miqdarının saxlanması', 'İnersiya qanunu', 'Qüvvə-kütlə-təcil', 'Əks-təsir qanunu'], ans: 1, exp: 'Nyutonun I qanunu — inersiya qanunudur.', topic, difficulty: 'orta' },
      { q: 'Nyutonun III qanununa görə nə baş verir?', opts: ['Cisim sürətlənir', 'Hər qüvvəyə bərabər əks qüvvə var', 'Enerji saxlanır', 'Kütlə dəyişmir'], ans: 1, exp: 'Hər təsirə bərabər və əks yönlü əks-təsir var.', topic, difficulty: 'orta' },
    ],
  };

  for (const [key, qs] of Object.entries(topicSpecific)) {
    if (topicLower.includes(key)) pool.push(...qs);
  }
  if (subject && bySubject[subject]) pool.push(...bySubject[subject]);

  if (context && pool.length < count) {
    const sentences = context.split(/[.!?]/).filter(s => s.trim().length > 40).slice(0, 6);
    sentences.forEach((sent, i) => {
      const t = sent.trim().slice(0, 90);
      if (t.length > 40) {
        pool.push({
          q: `"${topic}" mövzusunda: ${t}... — bu nəyi bildirir?`,
          opts: [`${topic}-in əsas xüsusiyyəti`, `${topic}-in tərifi`, `${topic}-in tətbiqi`, `${topic}-in tarixi`],
          ans: i % 4,
          exp: `Bu ${topic} mövzusunun əsas aspektlərindən birini izah edir.`,
          topic, difficulty: 'orta',
        });
      }
    });
  }

  if (pool.length < count) {
    for (let i = pool.length; i < count; i++) {
      pool.push({
        q: `${g} "${topic}" mövzusunda sual ${i + 1}: hansı ifadə doğrudur?`,
        opts: [`${topic} — əsas anlayış`, `${topic} — köməkçi anlayış`, `${topic} — tətbiqi anlayış`, `${topic} — tarixi anlayış`],
        ans: i % 4,
        exp: `${topic} mövzusunun ${i + 1}-ci aspekti.`,
        topic, difficulty: 'asan',
      });
    }
  }

  return pool.slice(0, count);
}
