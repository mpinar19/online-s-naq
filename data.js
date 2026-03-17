/* ═══════════════════════════════════════════════════════════
   data.js — Hər mövzunun sualları o mövzuya tam uyğundur
   ═══════════════════════════════════════════════════════════ */

const ALL_GRADES = ['1','2','3','4','5','6','7','8','9','10','11'];

const EXAM_CONFIG = {
  '1_all':  [{ subject:'Azərbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Həyat bilgisi', count:5 }],
  '2_all':  [{ subject:'Azərbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Həyat bilgisi', count:5 }],
  '3_all':  [{ subject:'Azərbaycan dili', count:20 },{ subject:'Riyaziyyat', count:15 },{ subject:'Həyat bilgisi', count:5 }],
  '4_all':  [{ subject:'Azərbaycan dili', count:18 },{ subject:'Riyaziyyat', count:14 },{ subject:'Həyat bilgisi', count:8 },{ subject:'İngilis dili', count:5 }],
  '5_all':  [{ subject:'Azərbaycan dili', count:12 },{ subject:'Riyaziyyat', count:12 },{ subject:'Tarix', count:7 },{ subject:'Coğrafiya', count:7 },{ subject:'İngilis dili', count:7 },{ subject:'Biologiya', count:5 }],
  '6_all':  [{ subject:'Azərbaycan dili', count:12 },{ subject:'Riyaziyyat', count:12 },{ subject:'Tarix', count:7 },{ subject:'Coğrafiya', count:7 },{ subject:'İngilis dili', count:7 },{ subject:'Biologiya', count:5 }],
  '7_all':  [{ subject:'Azərbaycan dili', count:10 },{ subject:'Riyaziyyat', count:12 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:5 },{ subject:'Tarix', count:7 },{ subject:'Coğrafiya', count:5 },{ subject:'İngilis dili', count:3 }],
  '8_all':  [{ subject:'Azərbaycan dili', count:10 },{ subject:'Riyaziyyat', count:12 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Tarix', count:6 },{ subject:'Coğrafiya', count:4 },{ subject:'İngilis dili', count:3 }],
  '9_all':  [{ subject:'Azərbaycan dili', count:10 },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:6 },{ subject:'Biologiya', count:6 },{ subject:'Tarix', count:6 }],
  '10_all': [{ subject:'Azərbaycan dili', count:8  },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Biologiya', count:7 },{ subject:'Tarix', count:6 }],
  '11_all': [{ subject:'Azərbaycan dili', count:8  },{ subject:'Riyaziyyat', count:14 },{ subject:'Fizika', count:8 },{ subject:'Kimya', count:7 },{ subject:'Biologiya', count:7 },{ subject:'Tarix', count:6 }],
};

const SUBJECTS_BY_GRADE = {
  '1': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Həyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '2': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Həyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '3': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Həyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' }],
  '4': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Həyat bilgisi', icon:'🌿', bg:'#E8F5E9', color:'#2E7D32' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' }],
  '5': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '6': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '7': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '8': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' }],
  '9': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Ədəbiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
  '10': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Ədəbiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
  '11': [{ name:'Azərbaycan dili', icon:'📝', bg:'#E3F2FD', color:'#1565C0' },{ name:'Riyaziyyat', icon:'🔢', bg:'#EDE7F6', color:'#4527A0' },{ name:'Fizika', icon:'⚡', bg:'#E8EAF6', color:'#1A237E' },{ name:'Kimya', icon:'⚗️', bg:'#E0F2F1', color:'#004D40' },{ name:'Biologiya', icon:'🧬', bg:'#E8F5E9', color:'#2E7D32' },{ name:'Tarix', icon:'📜', bg:'#FFF3E0', color:'#E65100' },{ name:'Coğrafiya', icon:'🌍', bg:'#FBE9E7', color:'#BF360C' },{ name:'İngilis dili', icon:'🔤', bg:'#FFEBEE', color:'#B71C1C' },{ name:'Ədəbiyyat', icon:'📚', bg:'#FCE4EC', color:'#880E4F' }],
};

const SUBJECTS_BY_GROUP = { '1-4': SUBJECTS_BY_GRADE['4'], '5-11': SUBJECTS_BY_GRADE['11'] };

const QBANK_BY_GRADE = {

/* ══════════ 1-Cİ SİNİF ══════════ */
'1': {
  'Azərbaycan dili': {

    /* Sual yalnız hərflər/səslər mövzusuna aiddir */
    'Hərflər və səslər': [
      { q:'Hansı hərf saitdir?', opts:['b','d','a','t'], ans:2, exp:'"a" — ağız açıq, serbest tələffüz edilən sait səsdir', bal:7 },
      { q:'Hansı hərf samitdir?', opts:['e','ə','i','m'], ans:3, exp:'"m" — dodaqlar birləşərək tələffüz edilən samit səsdir', bal:7 },
      { q:'"Ana" sözündə neçə sait var?', opts:['1','2','3','0'], ans:1, exp:'"A-n-a": birinci "a" və sonuncu "a" — 2 sait hərfdir', bal:7 },
      { q:'"Baba" sözündə neçə samit var?', opts:['1','2','3','4'], ans:1, exp:'"B-a-b-a": "b" və "b" — 2 samit hərfdir', bal:7 },
      { q:'"Ev" sözündə neçə hərf var?', opts:['1','2','3','4'], ans:1, exp:'"E" + "v" = 2 hərf', bal:7 },
      { q:'Sait hərflər hansı cərgədə düzgün verilmişdir?', opts:['b, d, g','a, e, i','m, n, l','t, s, z'], ans:1, exp:'a, e, i — sait hərflərdir; qalanlar samitdir', bal:7 },
      { q:'Cümlənin birinci hərfi necə yazılır?', opts:['kiçik hərflə','böyük hərflə','rəqəmlə','işarə ilə'], ans:1, exp:'Cümlənin ilk hərfi həmişə böyük hərflə yazılır', bal:7 },
      { q:'Böyük hərf nə vaxt işlədilir?', opts:['Yalnız şəhər adlarında','Cümlənin əvvəlində və xüsusi adlarda','Yalnız isimlərdə','Hər sözdə'], ans:1, exp:'Böyük hərf: cümlənin əvvəlində və xüsusi adlarda işlədilir', bal:7 },
    ],

    /* Sual yalnız heca mövzusuna aiddir */
    'Heca': [
      { q:'"Top" sözü neçə hecadan ibarətdir?', opts:['1','2','3','4'], ans:0, exp:'"Top" — bir sait var, bir hecalı sözdür', bal:7 },
      { q:'"Alma" sözünü heca böl:', opts:['a-lma','al-ma','a-l-ma','alm-a'], ans:1, exp:'Hər hecada bir sait olur: "al-ma" — 2 heca', bal:7 },
      { q:'"Kitab" sözündə neçə heca var?', opts:['1','2','3','4'], ans:1, exp:'"Ki-tab" — 2 sait, 2 heca', bal:7 },
      { q:'"Su" sözü neçə hecalıdır?', opts:['1','2','3','4'], ans:0, exp:'"Su" — 1 sait, 1 hecalı sözdür', bal:7 },
      { q:'"Bağ" sözü neçə hecalıdır?', opts:['1','2','3','4'], ans:0, exp:'"Bağ" — 1 sait (a), 1 hecalıdır', bal:7 },
      { q:'Heca nədir?', opts:['Sözdəki samitlər','Bir nəfəsin çıxışı ilə tələffüz olunan hissə','Sözün mənası','Sözün uzunluğu'], ans:1, exp:'Heca — sözdə bir nəfəsin çıxışı ilə deyilən, mütləq bir sait olan hissədir', bal:7 },
      { q:'Hər hecada nə mütləq olur?', opts:['Samit','Sait','İki hərf','Üç hərf'], ans:1, exp:'Hər hecada mütləq bir sait olur', bal:7 },
    ],

    /* Sual yalnız söz növləri mövzusuna aiddir */
    'Söz növləri': [
      { q:'"Kitab" sözü nəyin adını bildirir?', opts:['hərəkəti','əlaməti','əşyanın adını','sayı'], ans:2, exp:'"Kitab" — bir əşyanın (cismin) adını bildirir', bal:7 },
      { q:'"Qaç" sözü nəyi bildirir?', opts:['əşyanı','əlaməti','hərəkəti','adı'], ans:2, exp:'"Qaç" — hərəkəti bildirən sözdür', bal:7 },
      { q:'"Böyük" sözü nəyi bildirir?', opts:['əşyanın adını','hərəkəti','əşyanın əlamətini','sayı'], ans:2, exp:'"Böyük" — ölçü, yəni əşyanın əlamətini bildirir', bal:7 },
      { q:'"Alma" sözü hansı qrupa aiddir?', opts:['hərəkət bildirən','əlamət bildirən','ad bildirən','say bildirən'], ans:2, exp:'"Alma" — bir meyvənin adını bildirən sözdür', bal:7 },
      { q:'Hansı söz əlamət bildirir?', opts:['it','get','sarı','beş'], ans:2, exp:'"Sarı" — rəng, yəni əlamət bildirən sözdür', bal:7 },
      { q:'Hansı söz hərəkət bildirir?', opts:['dağ','gözəl','oyna','ağ'], ans:2, exp:'"Oyna" — hərəkəti bildirən sözdür', bal:7 },
      { q:'Hansı söz ad bildirir?', opts:['get','qırmızı','dərya','tez'], ans:2, exp:'"Dərya" — su kütləsinin adını bildirən sözdür', bal:7 },
    ],

    /* Sual yalnız cümlə növləri mövzusuna aiddir */
    'Cümlə növləri': [
      { q:'Xəbər cümləsinin sonuna hansı işarə qoyulur?', opts:['?','!','.','…'], ans:2, exp:'Xəbər cümləsi — məlumat verir, sonuna nöqtə (.) qoyulur', bal:7 },
      { q:'Sual cümləsinin sonuna hansı işarə qoyulur?', opts:['.','!','?','…'], ans:2, exp:'Sual cümlələrinin sonuna sual işarəsi (?) qoyulur', bal:7 },
      { q:'Əmr cümləsi nəyi bildirir?', opts:['xəbər','sual','əmr, xahiş','sevinc'], ans:2, exp:'Əmr cümləsi — bir hərəkəti etməyi əmr edir və ya xahiş edir', bal:7 },
      { q:'"Gəl!" hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:2, exp:'"Gəl!" — əmr bildirən sözdür, əmr cümləsidir', bal:7 },
      { q:'"Hava buluddur." hansı cümlə növüdür?', opts:['sual','əmr','xəbər','nida'], ans:2, exp:'Hava haqqında məlumat verir → xəbər cümləsidir', bal:7 },
      { q:'"Bacın haradadır?" hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:1, exp:'Sual işarəsi (?) ilə bitir → sual cümləsidir', bal:7 },
      { q:'Nida cümləsinin sonuna hansı işarə qoyulur?', opts:['.','?','!','…'], ans:2, exp:'Nida cümləsi güclü duyğu bildirir — sonuna nida işarəsi (!) qoyulur', bal:7 },
    ],
  },

  'Riyaziyyat': {
    'Rəqəmlər 1-10': [
      { q:'2 + 3 = ?', opts:['4','5','6','7'], ans:1, exp:'2 + 3 = 5', bal:7 },
      { q:'7 - 4 = ?', opts:['2','3','4','5'], ans:1, exp:'7 - 4 = 3', bal:7 },
      { q:'4 + 4 = ?', opts:['6','7','8','9'], ans:2, exp:'4 + 4 = 8', bal:7 },
      { q:'9 - 3 = ?', opts:['5','6','7','8'], ans:1, exp:'9 - 3 = 6', bal:7 },
      { q:'Hansı ədəd 5-dən böyükdür?', opts:['2','4','7','3'], ans:2, exp:'7 > 5', bal:7 },
      { q:'3-dən kiçik ədəd hansıdır?', opts:['4','3','2','5'], ans:2, exp:'2 < 3', bal:7 },
      { q:'5 + 0 = ?', opts:['0','1','5','10'], ans:2, exp:'Hər ədədə 0 əlavə etsək, ədəd dəyişmir: 5 + 0 = 5', bal:7 },
    ],
    'Rəqəmlər 11-20': [
      { q:'10 + 4 = ?', opts:['12','13','14','15'], ans:2, exp:'10 + 4 = 14', bal:7 },
      { q:'18 - 5 = ?', opts:['11','12','13','14'], ans:2, exp:'18 - 5 = 13', bal:7 },
      { q:'11 + 6 = ?', opts:['15','16','17','18'], ans:2, exp:'11 + 6 = 17', bal:7 },
      { q:'20 - 7 = ?', opts:['11','12','13','14'], ans:2, exp:'20 - 7 = 13', bal:7 },
      { q:'15 + 3 = ?', opts:['17','18','19','20'], ans:1, exp:'15 + 3 = 18', bal:7 },
      { q:'16-dan böyük ədəd hansıdır?', opts:['14','16','18','15'], ans:2, exp:'18 > 16', bal:7 },
    ],
    'Həndəsi fiqurlar': [
      { q:'Kvadratın neçə tərəfi var?', opts:['3','4','5','6'], ans:1, exp:'Kvadratın 4 bərabər tərəfi var', bal:7 },
      { q:'Üçbucağın neçə küncu var?', opts:['2','3','4','5'], ans:1, exp:'Üçbucağın 3 küncu var', bal:7 },
      { q:'Dairənin neçə küncu var?', opts:['1','2','3','0'], ans:3, exp:'Dairənin heç bir küncu yoxdur', bal:7 },
      { q:'Hansı fiqur dörd bərabər tərəflidir?', opts:['üçbucaq','dairə','kvadrat','düzbucaqlı'], ans:2, exp:'Kvadratın dörd tərəfi bərabərdir', bal:7 },
      { q:'Düzbucaqlının neçə tərəfi var?', opts:['3','4','5','6'], ans:1, exp:'Düzbucaqlının 4 tərəfi var (qarşılıqlı tərəflər bərabərdir)', bal:7 },
    ],
  },

  'Həyat bilgisi': {
    'Ailə': [
      { q:'Atanın atası necə adlanır?', opts:['əmi','dayı','baba','qardaş'], ans:2, exp:'Atanın atası — baba adlanır', bal:7 },
      { q:'Ananın anası necə adlanır?', opts:['bibi','xala','nənə','bacı'], ans:2, exp:'Ananın anası — nənə adlanır', bal:7 },
      { q:'Atanın bacısı necə adlanır?', opts:['xala','bibi','nənə','bacı'], ans:1, exp:'Atanın bacısı — bibi adlanır', bal:7 },
      { q:'Ananın bacısı necə adlanır?', opts:['bibi','xala','nənə','əmi'], ans:1, exp:'Ananın bacısı — xala adlanır', bal:7 },
      { q:'Ailə üzvlərinə necə davranmaq lazımdır?', opts:['kobud','etinasız','hörmətlə, məhəbbətlə','biganə'], ans:2, exp:'Ailə üzvlərinə hörmətlə, məhəbbətlə davranmaq lazımdır', bal:7 },
    ],
    'Məktəb': [
      { q:'Dərs zamanı nə etmək lazımdır?', opts:['oynamaq','danışmaq','müəllimi diqqətlə dinləmək','yatmaq'], ans:2, exp:'Dərs zamanı müəllimi diqqətlə dinləmək lazımdır', bal:7 },
      { q:'Dərsliyi necə saxlamaq lazımdır?', opts:['yırtmaq','cızmaq','qayğı ilə saxlamaq','atmaq'], ans:2, exp:'Dərslik — bilik xəzinəsidir, qayğı ilə saxlanılmalıdır', bal:7 },
    ],
    'Təbiət': [
      { q:'İlin neçə fəsli var?', opts:['2','3','4','5'], ans:2, exp:'Yaz, yay, payız, qış — 4 fəsil', bal:7 },
      { q:'Hansı fəsildə qar yağır?', opts:['yaz','yay','payız','qış'], ans:3, exp:'Qış fəslində hava soyuyur, qar yağır', bal:7 },
      { q:'Bitkilər nə ilə böyüyür?', opts:['daşla','su, torpaq, işıqla','ətlə','dəmirlə'], ans:1, exp:'Bitkilər su, torpaq qidaları və günəş işığı ilə böyüyür', bal:7 },
      { q:'Hansı heyvan məməlidir?', opts:['kərtənkələ','qurbağa','it','qartal'], ans:2, exp:'İt — məməlidir, balasını südlə bəsləyir', bal:7 },
    ],
  },
},

/* ══════════ 2-Cİ SİNİF ══════════ */
'2': {
  'Azərbaycan dili': {

    /* Yalnız heca bölgüsü qaydaları */
    'Heca bölgüsü': [
      { q:'"Məktəb" sözünü düzgün heca böl:', opts:['m-əktəb','mək-təb','məkt-əb','mə-ktəb'], ans:1, exp:'"Mək-təb": heca sərhədi samit-sait arasından keçir', bal:8 },
      { q:'"Kitab" sözündə neçə heca var?', opts:['1','2','3','4'], ans:1, exp:'"Ki-tab" — 2 sait = 2 heca', bal:8 },
      { q:'"Azərbaycan" sözündə neçə heca var?', opts:['3','4','5','6'], ans:1, exp:'"A-zər-bay-can" — 4 sait = 4 heca', bal:8 },
      { q:'"Bahar" sözünü heca böl:', opts:['bah-ar','b-ahar','ba-har','baha-r'], ans:2, exp:'"Ba-har": "a" saiti birinci hecada qalır', bal:8 },
      { q:'"Dost" sözü neçə hecalıdır?', opts:['1','2','3','4'], ans:0, exp:'"Dost" — 1 sait (o) var, 1 hecalıdır', bal:8 },
      { q:'"Çiçək" sözünü heca böl:', opts:['çi-çək','çiç-ək','ç-içək','çiçə-k'], ans:0, exp:'"Çi-çək" — hər hecada bir sait: "i" və "ə"', bal:8 },
      { q:'Hecalar bir-birindən necə ayrılır?', opts:['nöqtə ilə','tire ilə','vergüllə','boşluqla'], ans:1, exp:'Heca bölgüsündə tire (-) işarəsi istifadə olunur', bal:8 },
    ],

    /* Yalnız yaxınmənalı/əksmənalı sözlər */
    'Yaxınmənalı və əksmənalı sözlər': [
      { q:'"Şən" sözünün yaxınmənalısı hansıdır?', opts:['kədərli','xəstə','şad','yorğun'], ans:2, exp:'"Şən" = "şad" — eyni mənaya yaxın sözlərdir', bal:8 },
      { q:'"Böyük" sözünün əksmənalısı hansıdır?', opts:['uzun','geniş','kiçik','qalın'], ans:2, exp:'"Böyük" ↔ "kiçik" — əks mənalı söz cütüdür', bal:8 },
      { q:'Hansı cüt yaxınmənalı sözlərdir?', opts:['gecə — gündüz','ev — dam','alma — armud','isti — soyuq'], ans:1, exp:'"Ev" = "dam" — hər ikisi eyni anlayışı (yaşayış yeri) bildirir', bal:8 },
      { q:'Hansı cüt əksmənalı sözlərdir?', opts:['it — pişik','gəl — get','kitab — dəftər','dağ — təpə'], ans:1, exp:'"Gəl" ↔ "get" — əks istiqaməti bildirən antonimlərdir', bal:8 },
      { q:'"Ağlamaq" sözünün əksmənalısı?', opts:['qaçmaq','gülmək','oynamaq','yatmaq'], ans:1, exp:'"Ağlamaq" ↔ "gülmək" — əks hərəkətlərdir', bal:8 },
      { q:'"Gəlmək" sözünün yaxınmənalısı?', opts:['getmək','çatmaq','uçmaq','qaçmaq'], ans:1, exp:'"Gəlmək" ≈ "çatmaq" — yaxın mənalı sözlərdir', bal:8 },
      { q:'"Uzun" sözünün əksmənalısı?', opts:['enli','yüksək','qısa','ağır'], ans:2, exp:'"Uzun" ↔ "qısa" — əks ölçü bildirən söz cütüdür', bal:8 },
    ],

    /* Yalnız cümlə növlərini (məqsəd/intonasiyaya görə) tədris edir */
    'Cümlənin məqsədə görə növləri': [
      { q:'"Hava buluddur." — hansı cümlə növüdür?', opts:['sual','əmr','xəbər','nida'], ans:2, exp:'Bir hadisə haqqında məlumat verir → xəbər cümləsidir', bal:8 },
      { q:'"Sən hara gedirsən?" — hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:1, exp:'Cavab tələb edir, sual işarəsi (?) ilə bitir → sual cümləsidir', bal:8 },
      { q:'"Kitabı aç!" — hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:2, exp:'"Aç" — əmr formasında fel, əmr cümləsidir', bal:8 },
      { q:'"Necə gözəl gündür!" — hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:3, exp:'Güclü duyğu (sevinc) bildirir, nida işarəsi (!) ilə bitir → nida cümləsidir', bal:8 },
      { q:'"Mən məktəbə gedirəm." — hansı cümlə növüdür?', opts:['sual','əmr','xəbər','nida'], ans:2, exp:'Bir iş haqqında məlumat verir → xəbər cümləsi', bal:8 },
      { q:'"Zəhmət olmasa, suyu ver!" — hansı cümlə növüdür?', opts:['xəbər','sual','əmr','nida'], ans:2, exp:'Xahiş/əmr bildirən cümlədir → əmr cümləsi', bal:8 },
    ],

    /* Durğu işarələri 2-ci sinif səviyyəsində */
    'Durğu işarələri': [
      { q:'Xəbər cümləsinin sonuna hansı işarə qoyulur?', opts:['?','!','.','…'], ans:2, exp:'Xəbər cümləsinin sonuna nöqtə (.) qoyulur', bal:8 },
      { q:'Sual cümləsinin sonuna hansı işarə qoyulur?', opts:['.','!','?','…'], ans:2, exp:'Sual cümləsinin sonuna sual işarəsi (?) qoyulur', bal:8 },
      { q:'Nida cümləsinin sonuna hansı işarə qoyulur?', opts:['.','?','!','…'], ans:2, exp:'Nida cümləsinin sonuna nida işarəsi (!) qoyulur', bal:8 },
      { q:'Sadalamada elementlər arasına hansı işarə qoyulur?', opts:['nöqtə','vergül','ikinoqtə','tire'], ans:1, exp:'Sadalamada elementlər vergüllə (,) ayrılır', bal:8 },
    ],
  },

  'Riyaziyyat': {
    'Toplama və çıxma (100 daxilində)': [
      { q:'34 + 25 = ?', opts:['57','58','59','60'], ans:2, exp:'34 + 25: onluqlar: 3+2=5, birlər: 4+5=9 → 59', bal:8 },
      { q:'76 - 34 = ?', opts:['40','41','42','43'], ans:2, exp:'76 - 34: onluqlar: 7-3=4, birlər: 6-4=2 → 42', bal:8 },
      { q:'48 + 37 = ?', opts:['83','84','85','86'], ans:2, exp:'48 + 37: birlər: 8+7=15 (1 keçirik), onluqlar: 4+3+1=8 → 85', bal:8 },
      { q:'90 - 45 = ?', opts:['43','44','45','46'], ans:2, exp:'90 - 45 = 45', bal:8 },
      { q:'63 + 19 = ?', opts:['80','81','82','83'], ans:2, exp:'63 + 19: birlər: 3+9=12 (1 keçirir), onluqlar: 6+1+1=8 → 82', bal:8 },
      { q:'51 - 28 = ?', opts:['21','22','23','24'], ans:2, exp:'51 - 28 = 23', bal:8 },
    ],
    'Vurma (2, 3, 4, 5 cədvəli)': [
      { q:'2 × 6 = ?', opts:['10','11','12','13'], ans:2, exp:'2 × 6 = 12 (2-nin 6 dəfəsi)', bal:8 },
      { q:'3 × 4 = ?', opts:['10','11','12','13'], ans:2, exp:'3 × 4 = 12 (3-ün 4 dəfəsi)', bal:8 },
      { q:'5 × 7 = ?', opts:['33','34','35','36'], ans:2, exp:'5 × 7 = 35 (5-in 7 dəfəsi)', bal:8 },
      { q:'4 × 6 = ?', opts:['22','23','24','25'], ans:2, exp:'4 × 6 = 24 (4-ün 6 dəfəsi)', bal:8 },
      { q:'2 × 9 = ?', opts:['16','17','18','19'], ans:2, exp:'2 × 9 = 18', bal:8 },
      { q:'3 × 7 = ?', opts:['19','20','21','22'], ans:2, exp:'3 × 7 = 21', bal:8 },
    ],
    'Bölmə (2, 3, 4, 5 cədvəli)': [
      { q:'12 ÷ 4 = ?', opts:['2','3','4','5'], ans:1, exp:'12 ÷ 4 = 3 (4 × 3 = 12)', bal:8 },
      { q:'15 ÷ 3 = ?', opts:['3','4','5','6'], ans:2, exp:'15 ÷ 3 = 5 (3 × 5 = 15)', bal:8 },
      { q:'20 ÷ 5 = ?', opts:['2','3','4','5'], ans:2, exp:'20 ÷ 5 = 4 (5 × 4 = 20)', bal:8 },
      { q:'18 ÷ 2 = ?', opts:['7','8','9','10'], ans:2, exp:'18 ÷ 2 = 9 (2 × 9 = 18)', bal:8 },
      { q:'16 ÷ 4 = ?', opts:['3','4','5','6'], ans:1, exp:'16 ÷ 4 = 4 (4 × 4 = 16)', bal:8 },
    ],
    'Ölçü vahidləri': [
      { q:'1 metr neçə santimetrdir?', opts:['10','50','100','1000'], ans:2, exp:'1 m = 100 sm', bal:8 },
      { q:'1 həftə neçə gündür?', opts:['5','6','7','8'], ans:2, exp:'1 həftə = 7 gün', bal:8 },
      { q:'1 saat neçə dəqiqədir?', opts:['30','60','90','120'], ans:1, exp:'1 saat = 60 dəqiqə', bal:8 },
      { q:'1 gün neçə saatdır?', opts:['12','20','24','48'], ans:2, exp:'1 gün = 24 saat', bal:8 },
    ],
  },

  'Həyat bilgisi': {
    'Fəsillər': [
      { q:'Hansı fəsildə yarpaqlar saralıb tökülür?', opts:['yaz','yay','payız','qış'], ans:2, exp:'Payız fəslinin əsas əlaməti: yarpaqların saralıb tökülməsidir', bal:8 },
      { q:'Ən isti fəsil hansıdır?', opts:['yaz','yay','payız','qış'], ans:1, exp:'Yay fəslində hava ən isti olur, günlər uzun olur', bal:8 },
      { q:'Hansı fəsildə çiçəklər açır?', opts:['qış','yaz','payız','heç vaxt'], ans:1, exp:'Yaz fəslində hava isınır, çiçəklər açır', bal:8 },
      { q:'Qış fəslinin əsas əlaməti?', opts:['çiçəklər açır','yarpaqlar saralır','qar yağır, hava soyuyur','meyvə yetişir'], ans:2, exp:'Qış fəslinin əlaməti: qar yağır, hava soyuyur, günlər qısa olur', bal:8 },
      { q:'İlin neçə fəsli var?', opts:['2','3','4','5'], ans:2, exp:'Yaz, yay, payız, qış — 4 fəsil', bal:8 },
    ],
    'Sağlamlıq': [
      { q:'Dişlər nə vaxt fırçalanmalıdır?', opts:['yalnız axşam','yalnız səhər','səhər və axşam','həftədə bir'], ans:2, exp:'Dişlər gündə iki dəfə — səhər və axşam fırçalanmalıdır', bal:8 },
      { q:'Əllər nə vaxt yuyulmalıdır?', opts:['yalnız göründükdə çirkli','yeməkdən əvvəl/sonra, tualetdən sonra','yalnız axşam','həftədə bir'], ans:1, exp:'Əllər yeməkdən əvvəl/sonra, tualetdən sonra mütləq yuyulmalıdır', bal:8 },
    ],
    'Vətən': [
      { q:'Azərbaycanın dövlət dili hansıdır?', opts:['rus dili','ingilis dili','Azərbaycan dili','türk dili'], ans:2, exp:'Azərbaycan Respublikasının dövlət dili Azərbaycan dilidir', bal:8 },
      { q:'Azərbaycanın paytaxtı?', opts:['Gəncə','Sumqayıt','Bakı','Lənkəran'], ans:2, exp:'Bakı — Azərbaycanın paytaxtı', bal:8 },
      { q:'Novruz bayramı hansı fəslin bayramıdır?', opts:['yay','payız','qış','yaz'], ans:3, exp:'Novruz — yazın gəlişini qarşılayan bahar bayramıdır (21 mart)', bal:8 },
    ],
  },
},

/* ══════════ 3-CÜ SİNİF ══════════ */
'3': {
  'Azərbaycan dili': {
    /* İsim: ad bildirən sözlər, ümumi/xüsusi, tək/cəm */
    'İsim': [
      { q:'İsim nəyin adını bildirir?', opts:['hərəkəti','əşyanın/canlının/hadisənin adını','əlaməti','sayı'], ans:1, exp:'İsim — əşyanın, canlının, hadisənin, yer, zaman adını bildirir', bal:9 },
      { q:'"Gəncə" — ümumi isimdir, yoxsa xüsusi isim?', opts:['ümumi isim','xüsusi isim','sifət','fel'], ans:1, exp:'"Gəncə" — şəhərin xüsusi adıdır, xüsusi isimdir', bal:9 },
      { q:'Xüsusi isimlər necə yazılır?', opts:['kiçik hərflə','böyük hərflə','istənilən şəkildə','rəqəmlə'], ans:1, exp:'Xüsusi isimlər (şəxs, şəhər, ölkə adları) böyük hərflə yazılır', bal:9 },
      { q:'Ümumi isim nümunəsi hansıdır?', opts:['Bakı','Anar','kitab','Kür'], ans:2, exp:'"Kitab" — bütün kitabları bildirən ümumi isimdir', bal:9 },
      { q:'Hansı söz isimdir?', opts:['qaç','gözəl','dəftər','tez'], ans:2, exp:'"Dəftər" — əşyanın adını bildirir → isimdir', bal:9 },
      { q:'İsim hansı suala cavab verir?', opts:['nə edir?','necədir?','kim? nə?','neçə?'], ans:2, exp:'İsim "kim?" (canlı) və "nə?" (cansız) suallarına cavab verir', bal:9 },
      { q:'"Azərbaycan" sözü hansı növ isimdir?', opts:['ümumi isim','xüsusi isim','cəm isim','sifət'], ans:1, exp:'"Azərbaycan" — ölkənin xüsusi adıdır', bal:9 },
    ],

    /* Cəm şəkilçisi: -lar/-lər, saituyumu */
    'Cəm şəkilçisi': [
      { q:'Cəm şəkilçisi hansılardır?', opts:['-da/-də','-lar/-lər','-a/-ə','-ın/-in'], ans:1, exp:'Cəm şəkilçisi: "-lar" (qalın saitlə) / "-lər" (incə saitlə)', bal:9 },
      { q:'"Ev" sözünün cəmi?', opts:['evlar','evlər','evler','evlər'], ans:1, exp:'"Ev" sözündəki "e" incə saitdir → cəm şəkilçisi "-lər": evlər', bal:9 },
      { q:'"Dağ" sözünün cəmi?', opts:['dağlar','dağlər','dağler','dağlər'], ans:0, exp:'"Dağ" sözündəki "a" qalın saitdir → cəm şəkilçisi "-lar": dağlar', bal:9 },
      { q:'"Meşə" sözünün cəmi?', opts:['meşalar','meşəlar','meşələr','meşelər'], ans:2, exp:'"Meşə" — incə saitli söz → meşə-lər', bal:9 },
      { q:'"Kitab" sözünün cəmi?', opts:['kitablar','kitablər','kitab-lar','kitablar'], ans:0, exp:'"Kitab" — qalın saitli söz (son sait "a") → kitab-lar', bal:9 },
      { q:'Hansı sözdə cəm şəkilçisi düzgün işlədilmişdir?', opts:['çiçəklar','çiçəklər','çiçeklər','çiçəkler'], ans:1, exp:'"Çiçək" — incə saitlidir (ə, ə) → çiçək-lər', bal:9 },
      { q:'"Torpaq" sözünün cəmi?', opts:['torpaqlar','torpaqlər','torpaqler','torpaqlər'], ans:0, exp:'"Torpaq" — qalın saitli (o, a) → torpaq-lar', bal:9 },
    ],

    /* Sifət: əşyanın əlamətini bildirən sözlər */
    'Sifət': [
      { q:'Sifət nəyi bildirir?', opts:['əşyanın adını','hərəkəti','əşyanın əlamətini (rəng, forma, keyfiyyət)','sayı'], ans:2, exp:'Sifət — əşyanın rəngini, formasını, keyfiyyətini bildirir', bal:9 },
      { q:'"Qırmızı alma" birləşməsindəki sifət hansıdır?', opts:['alma','qırmızı','birləşmə','hər ikisi'], ans:1, exp:'"Qırmızı" — almanın rəngini (əlamətini) bildirir → sifətdir', bal:9 },
      { q:'Hansı söz sifətdir?', opts:['uçmaq','göy','dəniz','ağlamaq'], ans:1, exp:'"Göy" — rəng bildirən sifətdir', bal:9 },
      { q:'Sifət hansı suala cavab verir?', opts:['kim? nə?','necə? nə cür? hansı?','nə edir?','neçə?'], ans:1, exp:'Sifət "necə? nə cür? hansı?" suallarına cavab verir', bal:9 },
      { q:'"Böyük ev" birləşməsindəki sifət hansıdır?', opts:['ev','böyük','hər ikisi','heç biri'], ans:1, exp:'"Böyük" — evin ölçüsünü (əlamətini) bildirir → sifətdir', bal:9 },
    ],

    /* Fel: hərəkət/hal bildirən sözlər */
    'Fel': [
      { q:'Fel nəyi bildirir?', opts:['əşyanın adını','əlaməti','hərəkəti, prosesi, halı','sayı'], ans:2, exp:'Fel — hərəkəti, işi, prosesi, halı bildirir', bal:9 },
      { q:'Hansı söz feldir?', opts:['gözəl','kitab','oyna','sarı'], ans:2, exp:'"Oyna" — hərəkəti bildirən feldir', bal:9 },
      { q:'Fel hansı suala cavab verir?', opts:['kim? nə?','necədir?','nə edir? nə etdi?','neçə?'], ans:2, exp:'Fel "nə edir? nə etdi? nə edəcək?" suallarına cavab verir', bal:9 },
      { q:'"Oxumaq" sözü hansı nitq hissəsidir?', opts:['isim','sifət','fel','say'], ans:2, exp:'"Oxumaq" — hərəkəti bildirən feldir', bal:9 },
    ],

    /* Saituyumu qaydası */
    'Orfoqrafiya — saituyumu': [
      { q:'Saituyumu nədir?', opts:['cümlə qaydası','sözdəki saitlərin qalın/incə uyğunluğu qaydası','hərflərin sırası','heca sayı'], ans:1, exp:'Saituyumu (ahəng qanunu) — sözdə saitlərin qalın/incə uyğunluq qaydası', bal:9 },
      { q:'"Balalar" sözündə "-lar" şəkilçisi düzgündürmü?', opts:['Bəli, çünki "bala" qalın saitlidir','Xeyr, "-lər" olmalıdır','Fərqi yoxdur','Şəkilçi lazım deyil'], ans:0, exp:'"Bala" sözündəki saitlər "a, a" — qalın, ona görə "-lar" düzgündür', bal:9 },
      { q:'"Gözəllik" sözündəki saitlər hansı qrupdur?', opts:['hamısı qalın','hamısı incə','qarışıq','saitsizdir'], ans:1, exp:'"Gözəllik": ö, ə, i — hamısı incə saitlərdir', bal:9 },
      { q:'Qalın saitlər hansılardır?', opts:['e, ə, i, ü, ö','a, ı, o, u','bütün saitlər','a, e, i'], ans:1, exp:'Qalın saitlər: a, ı, o, u — boğazın arxasında tələffüz edilir', bal:9 },
    ],
  },

  'Riyaziyyat': {
    /* Vurma cədvəli 6-9 */
    'Vurma cədvəli (6, 7, 8, 9)': [
      { q:'6 × 7 = ?', opts:['40','41','42','43'], ans:2, exp:'6 × 7 = 42 (6-nın 7 dəfəsi)', bal:9 },
      { q:'8 × 9 = ?', opts:['70','71','72','73'], ans:2, exp:'8 × 9 = 72 (8-in 9 dəfəsi)', bal:9 },
      { q:'7 × 8 = ?', opts:['54','55','56','57'], ans:2, exp:'7 × 8 = 56', bal:9 },
      { q:'9 × 9 = ?', opts:['79','80','81','82'], ans:2, exp:'9 × 9 = 81', bal:9 },
      { q:'6 × 8 = ?', opts:['46','47','48','49'], ans:2, exp:'6 × 8 = 48', bal:9 },
      { q:'7 × 9 = ?', opts:['61','62','63','64'], ans:2, exp:'7 × 9 = 63', bal:9 },
      { q:'9 × 6 = ?', opts:['52','53','54','55'], ans:2, exp:'9 × 6 = 54', bal:9 },
    ],

    /* Ölçü vahidləri: uzunluq, kütlə, həcm, zaman */
    'Ölçü vahidləri': [
      { q:'1 kq neçə qramdır?', opts:['100','500','1000','10000'], ans:2, exp:'1 kq = 1000 q', bal:9 },
      { q:'1 km neçə metrdir?', opts:['100','500','1000','10000'], ans:2, exp:'1 km = 1000 m', bal:9 },
      { q:'1 litr neçə mililitrdir?', opts:['100','500','1000','10000'], ans:2, exp:'1 l = 1000 ml', bal:9 },
      { q:'1 saat neçə saniyədir?', opts:['600','1800','3600','7200'], ans:2, exp:'1 saat = 60 dəq, 1 dəq = 60 san → 1 saat = 3600 san', bal:9 },
      { q:'1 sm neçə mm-dir?', opts:['5','10','100','1000'], ans:1, exp:'1 sm = 10 mm', bal:9 },
    ],

    /* Kəsrlərə giriş: yarım, tam, hissə */
    'Kəsrlərə giriş': [
      { q:'"Yarım" rəqəmcə necə yazılır?', opts:['1/3','1/2','1/4','2/3'], ans:1, exp:'Yarım = 1/2 (birini 2-yə böl, bir hissəsini götür)', bal:9 },
      { q:'1/4 + 1/4 = ?', opts:['1/8','1/4','2/4 = 1/2','3/4'], ans:2, exp:'1/4 + 1/4 = 2/4, 2/4 = 1/2', bal:9 },
      { q:'Hansı kəsr daha böyükdür: 1/2 yoxsa 1/4?', opts:['1/4','1/2','bərabərdir','bilinmir'], ans:1, exp:'1/2 = 0.5, 1/4 = 0.25 → 1/2 > 1/4', bal:9 },
      { q:'1/3 + 1/3 + 1/3 = ?', opts:['1/9','1/3','2/3','1'], ans:3, exp:'1/3 + 1/3 + 1/3 = 3/3 = 1 (tam)', bal:9 },
      { q:'Bir almanın 1/2-si neçədir?', opts:['1 alma','almanın yarısı','2 alma','1/4 alma'], ans:1, exp:'1/2 — almanı iki bərabər hissəyə bölsək, bir hissəsidir', bal:9 },
    ],

    /* Həndəsə: perimetr, sahə anlayışı */
    'Perimetr': [
      { q:'Kvadratın perimetri: tərəf=4. P=?', opts:['8','12','16','20'], ans:2, exp:'P = 4 × 4 = 16 (4 tərəfin cəmi)', bal:9 },
      { q:'Düzbucaqlının perimetri: uzunluq=5, en=3. P=?', opts:['8','15','16','18'], ans:2, exp:'P = 2 × (5+3) = 2 × 8 = 16', bal:9 },
      { q:'Perimetr nədir?', opts:['Fiqurun sahəsi','Fiqurun bütün tərəflərinin cəmi','Fiqurun yüksəkliyi','Fiqurun diaqonalı'], ans:1, exp:'Perimetr — qapalı fiqurun bütün tərəflərinin uzunluğunun cəmidir', bal:9 },
      { q:'Üçbucağın tərəfləri 3, 4, 5. Perimetri?', opts:['10','11','12','13'], ans:2, exp:'P = 3 + 4 + 5 = 12', bal:9 },
    ],
  },

  'Həyat bilgisi': {
    'Azərbaycanın coğrafiyası': [
      { q:'Azərbaycan hansı dənizin sahilindədir?', opts:['Qara dəniz','Xəzər dənizi','Aralıq dənizi','Hind okeanı'], ans:1, exp:'Azərbaycan Xəzər dənizinin sahilindədir', bal:9 },
      { q:'Azərbaycanda ən böyük çay hansıdır?', opts:['Araz','Kür','Alazan','Samur'], ans:1, exp:'Kür çayı Azərbaycandakı ən uzun çaydır (1515 km)', bal:9 },
      { q:'Azərbaycanda əsas dağlar hansı sıradadır?', opts:['Alp','Böyük Qafqaz','And','Himalay'], ans:1, exp:'Azərbaycanın şimalında Böyük Qafqaz dağları uzanır', bal:9 },
    ],
    'Bitkilər aləmi': [
      { q:'Fotosintez nədir?', opts:['heyvanların nəfəs alması','bitkilərin işıq ilə qida hazırlaması','suyun buxarlanması','torpağın istiləşməsi'], ans:1, exp:'Fotosintez — bitkilərin günəş işığı ilə qida (şəkər) hazırlaması prosesidir', bal:9 },
      { q:'Bitkilərin torpaqdan su alan hissəsi?', opts:['yarpaq','çiçək','kök','gövdə'], ans:2, exp:'Kök torpaqdan su və mineral maddə alır', bal:9 },
      { q:'Fotosintez zamanı bitkilər nə istehsal edir?', opts:['CO₂','su','oksigen','azot'], ans:2, exp:'Fotosintezdə bitkilər günəş enerjisi ilə oksigen buraxır', bal:9 },
    ],
    'İnsan orqanizmi': [
      { q:'Qanı bütün bədənə pompalayan orqan?', opts:['böyrək','ağ ciyər','ürək','mədə'], ans:2, exp:'Ürək — qanı damarlar vasitəsilə bütün bədənə göndərir', bal:9 },
      { q:'Nəfəs almağa cavabdeh orqan?', opts:['ürək','böyrək','ağ ciyər','qaraciyər'], ans:2, exp:'Ağ ciyər — havadan oksigen alır, CO₂ buraxır', bal:9 },
    ],
  },
},

/* ══════════ 4-CÜ SİNİF ══════════ */
'4': {
  'Azərbaycan dili': {
    /* İsmin 6 halı */
    'İsmin halları': [
      { q:'Azərbaycan dilindəki halların sayı?', opts:['4','5','6','7'], ans:2, exp:'6 hal: adlıq, yiyəlik, yönlük, təsirlik, yerlik, çıxışlıq', bal:10 },
      { q:'"Kitabın" sözündə hansı hal şəkilçisi var?', opts:['adlıq (yox)','yiyəlik (-ın)','yönlük (-a)','yerlik (-da)'], ans:1, exp:'"Kitab-ın" — yiyəlik hal şəkilçisi "-ın" (kimin? nəyin?)', bal:10 },
      { q:'"Kitaba" sözündə hansı hal?', opts:['adlıq','yiyəlik','yönlük','yerlik'], ans:2, exp:'"Kitab-a" — yönlük hal (-a/-ə): kimə? nəyə?', bal:10 },
      { q:'"Məktəbdə" sözündə hansı hal?', opts:['yönlük','yerlik','çıxışlıq','adlıq'], ans:1, exp:'"Məktəb-də" — yerlik hal (-da/-də): kimdə? nədə?', bal:10 },
      { q:'"Meşədən" sözündə hansı hal?', opts:['yerlik','yönlük','çıxışlıq','adlıq'], ans:2, exp:'"Meşə-dən" — çıxışlıq hal (-dan/-dən): kimdən? nədən?', bal:10 },
      { q:'Adlıq hal sualı hansıdır?', opts:['kimə? nəyə?','kimdə? nədə?','kim? nə?','kimi? nəyi?'], ans:2, exp:'Adlıq hal şəkilçisizdir, "kim? nə?" sualına cavab verir', bal:10 },
      { q:'Yönlük hal şəkilçisi hansıdır?', opts:['-ın/-in','-a/-ə','-da/-də','-dan/-dən'], ans:1, exp:'Yönlük hal: "-a/-ə" — istiqamət bildirir', bal:10 },
    ],

    /* Sifətin müqayisə və üstünlük dərəcəsi */
    'Sifətin dərəcəsi': [
      { q:'Sifətin müqayisə dərəcəsi necə düzəlir?', opts:['"-lar/-lər" şəkilçisi ilə','daha/ən sözü ilə','hal şəkilçisi ilə','fel şəkilçisi ilə'], ans:1, exp:'"Daha gözəl" (müqayisə), "ən böyük" (üstünlük) — "daha" və "ən" sözləri ilə', bal:10 },
      { q:'"Ən sürətli" — hansı dərəcədir?', opts:['adi dərəcə','müqayisə dərəcəsi','üstünlük dərəcəsi','azaltma dərəcəsi'], ans:2, exp:'"Ən" sözü — üstünlük dərəcəsini bildirir: digərlərindən çox üstün', bal:10 },
      { q:'"Daha yüksək" — hansı dərəcədir?', opts:['adi','müqayisə','üstünlük','azaltma'], ans:1, exp:'"Daha" sözü — müqayisə dərəcəsini bildirir: başqasından üstün', bal:10 },
      { q:'"Göy dəniz" birləşməsindəki sifət hansı dərəcədədir?', opts:['adi dərəcə','müqayisə','üstünlük','azaltma'], ans:0, exp:'"Göy" heç bir dərəcə şəkilçisi almayıb — adi dərəcədir', bal:10 },
      { q:'"Ən kiçik" ifadəsindəki sifətin dərəcəsi?', opts:['adi','müqayisə','üstünlük','şəkil dərəcəsi'], ans:2, exp:'"Ən" — üstünlük dərəcəsi bildirən sözdür', bal:10 },
    ],

    /* Felin zamanları */
    'Felin zamanları': [
      { q:'"Oxuyuram" hansı zamandadır?', opts:['keçmiş','indiki','gələcək','əmr'], ans:1, exp:'"Oxu-yur-am" — indiki zaman (-yır/-yir/-yur şəkilçisi)', bal:10 },
      { q:'"Oxudum" hansı zamandadır?', opts:['keçmiş','indiki','gələcək','əmr'], ans:0, exp:'"Oxu-dum" — qəti keçmiş zaman (-dım/-dim/-dum/-düm)', bal:10 },
      { q:'"Oxuyacam" hansı zamandadır?', opts:['keçmiş','indiki','gələcək','əmr'], ans:2, exp:'"Oxu-yacam" — gələcək zaman (-acaq/-əcək şəkilçisi)', bal:10 },
      { q:'"Getdi" felinin zamanı?', opts:['indiki','gələcək','keçmiş','əmr'], ans:2, exp:'"Get-di" — qəti keçmiş zaman (-dı/-di şəkilçisi)', bal:10 },
      { q:'"Yazır" felinin zamanı?', opts:['keçmiş','indiki','gələcək','əmr'], ans:1, exp:'"Yaz-ır" — indiki zaman (-ır/-ir/-ur/-ür şəkilçisi)', bal:10 },
      { q:'"Gələcək" hansı zaman şəkilçisi ilə düzəlir?', opts:['-dı/-di','-ır/-ir','-acaq/-əcək','-mış/-miş'], ans:2, exp:'Gələcək zaman: "-acaq/-əcək" şəkilçisi ilə düzəlir', bal:10 },
    ],

    /* Cümlənin baş üzvləri (4-cü sinifdə giriş səviyyəsində) */
    'Cümlənin baş üzvləri': [
      { q:'Mübtəda cümlənin hansı sualına cavab verir?', opts:['nə edir?','kim? nə?','necədir?','harada?'], ans:1, exp:'Mübtəda — "kim? nə?" suallarına cavab verir', bal:10 },
      { q:'"Uşaqlar oynayır." cümləsinin mübtədası?', opts:['oynayır','uşaqlar','—','cümlə yoxdur'], ans:1, exp:'"Uşaqlar" — kim? sualına cavab verir → mübtəda', bal:10 },
      { q:'"Günəş parlayır." cümləsinin xəbəri?', opts:['günəş','parlayır','—','hər ikisi'], ans:1, exp:'"Parlayır" — nə edir? sualına cavab verir → xəbər', bal:10 },
      { q:'Xəbər cümlənin hansı sualına cavab verir?', opts:['kim?','necədir? nə edir?','harada?','neçə?'], ans:1, exp:'Xəbər — "nədir? necədir? nə edir?" suallarına cavab verir', bal:10 },
    ],

    /* Söz yaradıcılığı */
    'Söz yaradıcılığı': [
      { q:'Düzəltmə söz nümunəsi?', opts:['kitab','gözəl + lik = gözəllik','ev','dağ'], ans:1, exp:'"Gözəl" kökünə "-lik" şəkilçisi əlavə edilib: gözəl-lik', bal:10 },
      { q:'Mürəkkəb söz nümunəsi?', opts:['uçmaq','gözəl','günəbaxan','böyük'], ans:2, exp:'"Günəbaxan" — "günə" + "baxan" iki kökdən yaranan mürəkkəb sözdür', bal:10 },
      { q:'"-çı/-çi" şəkilçisi nə bildirir?', opts:['yer','peşə/sənət','əlamət','kəmiyyət'], ans:1, exp:'"-çı/-çi/-cu/-cü" — peşə bildirən şəkilçidir: çörək-çi, dəmir-çi', bal:10 },
      { q:'"-lıq/-lik" şəkilçisi nə bildirir?', opts:['peşə','yer, keyfiyyət, hal','hərəkət','say'], ans:1, exp:'"-lıq/-lik" — keyfiyyət, yer bildirən sözdüzəldici şəkilçi: bağ-lıq, gözəl-lik', bal:10 },
    ],
  },

  'Riyaziyyat': {
    'Çoxrəqəmli ədədlər': [
      { q:'5843 ədədinin yüzlüklər rəqəmi?', opts:['5','8','4','3'], ans:1, exp:'5843: minlər=5, yüzlər=8, onlar=4, birlər=3', bal:10 },
      { q:'7000 + 200 + 60 + 5 = ?', opts:['7265','7256','7625','7562'], ans:0, exp:'7000+200+60+5 = 7265', bal:10 },
      { q:'9999-dan sonra gələn ədəd?', opts:['9998','9999','10000','10001'], ans:2, exp:'9999 + 1 = 10000', bal:10 },
      { q:'4762 ədədindəki 7 hansı basamağı bildirir?', opts:['birlər','onlar','yüzlər','minlər'], ans:2, exp:'4-7-6-2: soldan 2-ci rəqəm yüzlər basamağındadır', bal:10 },
    ],
    'Kəsrlər': [
      { q:'3/5 - 1/5 = ?', opts:['1/5','2/5','3/10','4/5'], ans:1, exp:'3/5 - 1/5 = 2/5 (məxrəclər eyni)', bal:10 },
      { q:'2/7 + 3/7 = ?', opts:['4/7','5/7','6/7','5/14'], ans:1, exp:'2/7 + 3/7 = 5/7 (məxrəclər eyni)', bal:10 },
      { q:'Hansı kəsr 1/2-dən böyükdür?', opts:['1/3','1/4','3/4','1/6'], ans:2, exp:'3/4 = 0.75 > 1/2 = 0.5', bal:10 },
    ],
    'Həndəsə (sahə)': [
      { q:'Düzbucaqlının sahəsi: uzunluq=7, en=4. Sahə=?', opts:['11','22','28','32'], ans:2, exp:'S = 7 × 4 = 28 kv.vahid', bal:10 },
      { q:'Kvadratın sahəsi: tərəf=5. S=?', opts:['10','15','20','25'], ans:3, exp:'S = 5 × 5 = 25 kv.vahid', bal:10 },
      { q:'Sahə nə deməkdir?', opts:['Fiqurun ətrafı','Figurun bütün tərəflərinin cəmi','Fiqurun tutduğu yer','Figurun hündürlüyü'], ans:2, exp:'Sahə — fiqurun tutduğu səthin ölçüsüdür', bal:10 },
    ],
  },

  'Həyat bilgisi': {
    'Azərbaycan tarixi (giriş)': [
      { q:'Azərbaycan Xalq Cümhuriyyəti nə vaxt yaradıldı?', opts:['1905','1918','1920','1991'], ans:1, exp:'AXC 28 may 1918-ci ildə elan edildi', bal:10 },
      { q:'Azərbaycan müstəqilliyini nə vaxt bərpa etdi?', opts:['1988','1990','1991','1993'], ans:2, exp:'18 oktyabr 1991-ci ildə müstəqillik bərpa edildi', bal:10 },
    ],
    'Ekologiya': [
      { q:'Ətraf mühiti qorumaq üçün nə etmək lazımdır?', opts:['zibil atmaq','ağac kəsmək','zibilləri xüsusi qutuya atmaq','suyu çirkləndirmək'], ans:2, exp:'Zibilləri xüsusi qutulara atmaq ətraf mühiti qoruyur', bal:10 },
      { q:'Ağac əkmək niyə vacibdir?', opts:['Yalnız görünüş üçün','Havadan CO₂ almaq, oksigen vermək, torpağı qorumaq','Mal-qara üçün','Mebel üçün'], ans:1, exp:'Ağaclar CO₂ udur, oksigen verir, torpağı eroziyadan qoruyur', bal:10 },
    ],
  },

  'İngilis dili': {
    'Əsas sözlər (leksika)': [
      { q:'"Dog" nə deməkdir?', opts:['pişik','it','at','quş'], ans:1, exp:'Dog — it', bal:10 },
      { q:'"Book" nə deməkdir?', opts:['stul','masa','kitab','qələm'], ans:2, exp:'Book — kitab', bal:10 },
      { q:'"Blue" nə deməkdir?', opts:['qırmızı','sarı','yaşıl','mavi'], ans:3, exp:'Blue — mavi', bal:10 },
      { q:'"Five" neçədir?', opts:['3','4','5','6'], ans:2, exp:'Five = 5', bal:10 },
      { q:'"Apple" nə deməkdir?', opts:['armud','üzüm','alma','gilas'], ans:2, exp:'Apple — alma', bal:10 },
      { q:'"Red" nə deməkdir?', opts:['mavi','yaşıl','sarı','qırmızı'], ans:3, exp:'Red — qırmızı', bal:10 },
    ],
    '"To be" feli (am/is/are)': [
      { q:'"I ___ a student." Boşluğa nə?', opts:['is','are','am','be'], ans:2, exp:'"I am" — 1-ci şəxs tək üçün "am" işlədilir', bal:10 },
      { q:'"She ___ my friend." Boşluğa nə?', opts:['am','is','are','be'], ans:1, exp:'"She is" — 3-cü şəxs tək üçün "is" işlədilir', bal:10 },
      { q:'"They ___ students." Boşluğa nə?', opts:['am','is','are','be'], ans:2, exp:'"They are" — cəm üçün "are" işlədilir', bal:10 },
      { q:'"How old are you?" nə deməkdir?', opts:['Adın nədir?','Neçə yaşın var?','Harada yaşayırsan?','Necəsən?'], ans:1, exp:'"How old are you?" — "Neçə yaşın var?"', bal:10 },
    ],
  },
},

/* ══════════ 5-Cİ SİNİF ══════════ */
'5': {
  'Azərbaycan dili': {
    /* Fonetika: sait/samit, ahəng qanunu, qapalı/açıq heca */
    'Fonetika': [
      { q:'Azərbaycan əlifbasındakı hərflərin sayı?', opts:['30','32','33','35'], ans:2, exp:'Azərbaycan əlifbasında 33 hərf var', bal:10 },
      { q:'Ahəng (saituyumu) qanunu nədir?', opts:['cümlə qaydası','sözdəki saitlərin qalın/incə uyğunluğu qaydası','hərflərin sayı','sözün uzunluğu'], ans:1, exp:'Ahəng qanunu — sözdəki saitlərin qalın/incə uyğunluğunu tənzimləyir', bal:10 },
      { q:'Qapalı heca nədir?', opts:['Saitlə bitən heca','Samitlə bitən heca','Uzun heca','İki hecalı söz'], ans:1, exp:'Qapalı heca — samitlə bitmən heca (məs: "al", "dağ", "mək")', bal:10 },
      { q:'Açıq heca nədir?', opts:['Samitlə bitən heca','Saitlə bitən heca','Hecasız söz','Uzun heca'], ans:1, exp:'Açıq heca — saitlə bitmən heca (məs: "ba-", "ki-", "nə-")', bal:10 },
      { q:'"Gəl" sözündə neçə fonem (səs) var?', opts:['1','2','3','4'], ans:2, exp:'"G-ə-l" — 3 fonem', bal:10 },
      { q:'"Kitab" sözündəki son hərf səs mi, yoxsa hərf mi?', opts:['Həm hərf, həm səs','Yalnız hərf','Yalnız səs','Nə hərf, nə səs'], ans:0, exp:'"b" həm yazıda hərf, həm də tələffüzdə səsdir', bal:10 },
    ],

    /* Leksika: sinonim, antonim, omonim, frazeologizm */
    'Leksika': [
      { q:'"İgid" sözünün sinonimu?', opts:['qorxaq','cəsur','zəif','axmaq'], ans:1, exp:'"İgid" = "cəsur" — yaxın mənalı sözlərdir', bal:10 },
      { q:'"Soyuq" sözünün antonimu?', opts:['buz','isti','soyuqluq','donmuş'], ans:1, exp:'"Soyuq" ↔ "isti" — əks mənalı sözlərdir', bal:10 },
      { q:'Omonim nədir?', opts:['mənaca yaxın sözlər','yazılışı eyni, mənası fərqli sözlər','əks mənalı sözlər','yeni sözlər'], ans:1, exp:'Omonim — eyni yazılan/tələffüz olunan, lakin fərqli mənalı sözlər (məs: "yaz" — fəsil / yazmaq)', bal:10 },
      { q:'Frazeologizm nədir?', opts:['tək söz','sabit, məcazi mənalı söz birləşməsi','sadə cümlə','yeni söz'], ans:1, exp:'Frazeologizm — mənası dəyişilmiş sabit söz birləşməsi (məs: "əl uzatmaq" = kömək etmək)', bal:10 },
      { q:'"Gözünün yaşına baxmamaq" frazeologizmi nə deməkdir?', opts:['ağlamaq','kimsəni acımaqsız incitmək','göz damlası işlətmək','göz yumaq'], ans:1, exp:'Bu frazeologizm — rəhm etmədən cəza vermək, acımamaq mənasını daşıyır', bal:10 },
      { q:'"Baş" sözü hansı mənaları bildirir? (omonim)', opts:['Yalnız insan başı','İnsan başı, rəhbər, qazan başı, çay başı (başlanğıcı)','Yalnız rəhbər','Yalnız çay başı'], ans:1, exp:'"Baş" — çoxmənalı/omonim sözdür: insan başı, rəhbər, qazan başı, çayın başlanğıcı', bal:10 },
    ],

    /* İsim — 5-ci sinifdə dərinləşdirmə (hallar, mənsubiyyət) */
    'İsmin quruluşu və halları': [
      { q:'İsmin neçə halı var?', opts:['4','5','6','7'], ans:2, exp:'6 hal: adlıq, yiyəlik, yönlük, təsirlik, yerlik, çıxışlıq', bal:10 },
      { q:'"Uşaqların" sözündə hansı şəkilçilər var?', opts:['-ların (cəm+yiyəlik)','-lar (cəm)','-ın (yiyəlik)','yalnız -ların'], ans:0, exp:'"Uşaq-lar-ın" — cəm şəkilçisi (-lar) + yiyəlik hal (-ın)', bal:10 },
      { q:'Mənsubiyyət şəkilçisi nəyi bildirir?', opts:['cəmi','halı','kimin/nəyin mülkü olduğunu','zamanı'], ans:2, exp:'Mənsubiyyət — kimin olduğunu bildirir: mənim kitabım, onun evi', bal:10 },
    ],

    /* Cümlə üzvləri — 5-ci sinifdə tam verilir */
    'Cümlə üzvləri': [
      { q:'Mübtəda hansı suala cavab verir?', opts:['nə edir?','kim? nə?','necədir?','harada?'], ans:1, exp:'Mübtəda — "kim? nə?" suallarına cavab verir', bal:10 },
      { q:'Xəbər hansı suala cavab verir?', opts:['kim?','necədir? nə edir? nədir?','harada?','neçə?'], ans:1, exp:'Xəbər — "nədir? necədir? nə edir?" suallarına cavab verir', bal:10 },
      { q:'Tamamlıq hansı suala cavab verir?', opts:['kim? nə?','nəyi? kimi? nəyə?','necə?','harada?'], ans:1, exp:'Tamamlıq — "kimi? nəyi? kimə? nəyə?" suallarına cavab verir', bal:10 },
      { q:'Zərflik hansı suala cavab verir?', opts:['kim? nə?','nəyi?','nə vaxt? harada? necə?','hansı?'], ans:2, exp:'Zərflik — "nə vaxt? harada? necə? nə üçün?" suallarına cavab verir', bal:10 },
      { q:'Təyin hansı suala cavab verir?', opts:['kim?','hansı? nə cür? necə?','nə vaxt?','niyə?'], ans:1, exp:'Təyin — "hansı? nə cür? necə?" suallarına cavab verir', bal:10 },
      { q:'"Kitab masadadır." cümləsinin mübtədası?', opts:['masadadır','kitab','masa','—'], ans:1, exp:'"Kitab" — nə? sualına cavab verir → mübtəda', bal:10 },
    ],
  },

  'Riyaziyyat': {
    'Natural ədədlər (ƏBOB, ƏKOB, sadə ədədlər)': [
      { q:'ƏBOB(12, 18) = ?', opts:['3','4','6','9'], ans:2, exp:'12 = 2²×3, 18 = 2×3² → ƏBOB = 2×3 = 6', bal:10 },
      { q:'ƏKOB(4, 6) = ?', opts:['2','6','12','24'], ans:2, exp:'ƏKOB(4,6) = 12 (4 × 3 = 12, 6 × 2 = 12)', bal:10 },
      { q:'Hansı ədəd sadə ədəddir?', opts:['9','12','17','21'], ans:2, exp:'17 — yalnız 1 və özünə bölünür → sadə ədəd', bal:10 },
      { q:'Mürəkkəb ədəd hansıdır?', opts:['7','11','13','15'], ans:3, exp:'15 = 3 × 5 — 1 və özündən başqa bölənləri var → mürəkkəb ədəd', bal:10 },
      { q:'ƏBOB(8, 12) = ?', opts:['2','3','4','6'], ans:2, exp:'8 = 2³, 12 = 2²×3 → ƏBOB = 2² = 4', bal:10 },
    ],
    'Adi kəsrlər': [
      { q:'2/3 + 1/6 = ?', opts:['3/9','5/6','3/6','4/9'], ans:1, exp:'2/3 = 4/6; 4/6 + 1/6 = 5/6', bal:10 },
      { q:'3/4 × 2/3 = ?', opts:['5/12','1/2','5/7','6/7'], ans:1, exp:'(3×2)/(4×3) = 6/12 = 1/2', bal:10 },
      { q:'1/2 ÷ 1/4 = ?', opts:['1/8','1','2','4'], ans:2, exp:'1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2', bal:10 },
      { q:'5/6 - 1/3 = ?', opts:['1/2','2/3','1/6','3/6'], ans:0, exp:'5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2', bal:10 },
    ],
    'Onluq kəsrlər': [
      { q:'0.5 + 0.25 = ?', opts:['0.70','0.75','0.80','0.85'], ans:1, exp:'0.5 + 0.25 = 0.75', bal:10 },
      { q:'1.8 - 0.6 = ?', opts:['1.0','1.1','1.2','1.3'], ans:2, exp:'1.8 - 0.6 = 1.2', bal:10 },
      { q:'0.3 × 4 = ?', opts:['0.7','1.0','1.2','1.5'], ans:2, exp:'0.3 × 4 = 1.2', bal:10 },
    ],
    'Həndəsə — bucaqlar': [
      { q:'Üçbucağın daxili bucaqlarının cəmi?', opts:['90°','180°','270°','360°'], ans:1, exp:'Hər üçbucağın daxili bucaqlarının cəmi = 180°', bal:10 },
      { q:'Dördbucaqlının daxili bucaqlarının cəmi?', opts:['180°','270°','360°','450°'], ans:2, exp:'Hər dördbucaqlının daxili bucaqları = 360°', bal:10 },
      { q:'Düzbucaq neçə dərəcədir?', opts:['45°','60°','90°','120°'], ans:2, exp:'Düzbucaq = 90°', bal:10 },
    ],
  },

  'Tarix': {
    'İbtidai icma': [
      { q:'İlk insanlar hansı dövrdə yaşamışlar?', opts:['Mis dövrü','Dəmir dövrü','Daş dövrü (Paleolit)','Orta əsrlər'], ans:2, exp:'Ən qədim insanlar Daş dövründə (Paleolitdə) yaşamışlar — ~2.5 mln il əvvəl', bal:10 },
      { q:'İbtidai insanlar ilk dəfə hansı materialdan alət düzəltdilər?', opts:['dəmirdən','misdən','daşdan','gümüşdən'], ans:2, exp:'Daş dövrü: ilk alətlər çaxmaq daşından hazırlanmışdır', bal:10 },
      { q:'Neolit dövründə insanlığın ən böyük nailiyyəti?', opts:['ov etmək','od yandırmaq','əkinçilik və maldarlıq','mağarada yaşamaq'], ans:2, exp:'Neolitdə (e.ə. ~10.000) əkinçilik və maldarlığa keçid baş verdi — inqilabi dəyişiklik', bal:10 },
      { q:'Qobustandakı qaya rəsmləri hansı dövrdəndir?', opts:['Orta əsrlərdən','XIX əsrdən','Daş dövrü (12-15 min il əvvəl)','XX əsrdən'], ans:2, exp:'Qobustan qaya rəsmləri 12.000-15.000 il əvvələ, Daş dövrünə aiddir', bal:10 },
    ],
    'Qədim Azərbaycan dövlətləri': [
      { q:'Manna dövlətinin yerləşdiyi yer?', opts:['Şimali Azərbaycanda','Cənubi Azərbaycanda','Gürcüstanda','Ermənistanda'], ans:1, exp:'Manna dövləti (e.ə. IX-VII əsr) Cənubi Azərbaycanda (Urmiya gölü ətrafında) mövcud idi', bal:10 },
      { q:'Albaniya dövlətinin ərazisi?', opts:['Cənubi Azərbaycanda','Şimali Azərbaycanda','Türkiyədə','İraqda'], ans:1, exp:'Albaniya — Şimali Azərbaycanda, e.ə. IV əsrdən etibarən mövcud idi', bal:10 },
      { q:'Atropaten dövlətinin banisi kimdir?', opts:['Kir','Dara','Atropat','Makedoniyalı İsgəndər'], ans:2, exp:'Atropat — e.ə. 321-ci ildə Atropaten (Cənubi Azərbaycan) dövlətini qurdu', bal:10 },
    ],
  },

  'Coğrafiya': {
    'Coğrafiyanın əsasları': [
      { q:'Xəritədə şimal hansı istiqamətdədir?', opts:['sağ','sol','yuxarı','aşağı'], ans:2, exp:'Standart xəritədə şimal — yuxarı', bal:10 },
      { q:'Paralellər nəyi ölçür?', opts:['uzunluğu','coğrafi eni (latitudeni)','hündürlüyü','dərinliyi'], ans:1, exp:'Paralellər — coğrafi en dərəcəsini ölçür', bal:10 },
      { q:'Meridianlar nəyi ölçür?', opts:['en dərəcəsini','coğrafi uzunluq dərəcəsini (longitudeni)','yüksəkliyi','dərinliyi'], ans:1, exp:'Meridianlar — coğrafi uzunluq dərəcəsini ölçür', bal:10 },
      { q:'Miqyas nədir?', opts:['Xəritənin rəngi','Xəritə ilə yerüstü məsafə arasındakı nisbət','Xəritənin ölçüsü','Coğrafi şəbəkə'], ans:1, exp:'Miqyas — xəritədəki məsafənin yerüstü məsafəyə olan nisbətidir', bal:10 },
    ],
    'Azərbaycanın coğrafiyası': [
      { q:'Azərbaycanda ən hündür zirvə?', opts:['Şahdağ','Bazar düzü','Murovdağ','Qapıcıq'], ans:1, exp:'Bazar düzü — 4466 m, Azərbaycanda ən hündür zirvədir', bal:10 },
      { q:'Xəzər dənizinin coğrafi statusu?', opts:['dəniz','göl','körfəz','buxta'], ans:1, exp:'Xəzər qapalı su hövzəsidir — coğrafi baxımdan ən böyük göldür', bal:10 },
      { q:'Azərbaycanda ən böyük göl?', opts:['Xəzər','Sarısu','Ağgöl','Göygöl'], ans:2, exp:'Ağgöl — Azərbaycanın ən böyük şirin su gölüdür', bal:10 },
    ],
  },

  'İngilis dili': {
    'Present Simple — quruluş və istifadə': [
      { q:'"She ___ to school every day."', opts:['go','goes','going','gone'], ans:1, exp:'Present Simple, 3-cü şəxs tək: felə -s/-es artırılır', bal:10 },
      { q:'"They ___ football at weekends."', opts:['plays','play','playing','played'], ans:1, exp:'"They" — 3-cü şəxs cəm, Present Simple-da -s artırılmır', bal:10 },
      { q:'"He does not ___ coffee."', opts:['drinks','drunk','drink','drinking'], ans:2, exp:'"Does not" + felın əsası (base form): drink', bal:10 },
      { q:'Present Simple nə vaxt işlədilir?', opts:['Şu an baş verən hadisə','Adət, qayda, həmişəlik həqiqət','Keçmişdə tamamlanan hadisə','Gələcək plan'], ans:1, exp:'Present Simple — adət, qayda, ümumilikdə həmişəlik həqiqət üçün işlədilir', bal:10 },
    ],
    'Past Simple — quruluş': [
      { q:'"go" felinin Past Simple forması?', opts:['goed','gone','went','going'], ans:2, exp:'"Go" qeyri-düzgün feldir: go → went', bal:10 },
      { q:'"eat" felinin Past Simple forması?', opts:['eated','ate','eaten','eating'], ans:1, exp:'"Eat" qeyri-düzgün feldir: eat → ate', bal:10 },
      { q:'"work" felinin Past Simple forması?', opts:['work','works','worked','working'], ans:2, exp:'"Work" — düzgün fel: worked (-ed artırılır)', bal:10 },
    ],
  },

  'Biologiya': {
    'Canlıların quruluşu': [
      { q:'Canlıların ən kiçik quruluş vahidi?', opts:['toxuma','orqan','hüceyrə','orqanizm'], ans:2, exp:'Hüceyrə — bütün canlıların əsas quruluş vahididir', bal:10 },
      { q:'Fotosintez zamanı bitkilər nə istehsal edir?', opts:['CO₂','azot','oksigen','hidrogen'], ans:2, exp:'Fotosintezdə bitkilər oksigen (O₂) istehsal edir', bal:10 },
      { q:'Bakteriyalar hansı qrupa aiddir?', opts:['eukariot','prokariot','virus','göbələk'], ans:1, exp:'Bakteriyalar — nüvəsiz prokariot orqanizmlərdir', bal:10 },
      { q:'Hüceyrə nəzəriyyəsini kim irəli sürdü?', opts:['Darvin','Mendeleyev','Şlayden və Şvann','Nyuton'], ans:2, exp:'Hüceyrə nəzəriyyəsi 1838-1839-cu illərdə Şlayden (botanik) və Şvann (zooloq) tərəfindən irəli sürüldü', bal:10 },
    ],
  },
},

/* ══════════ 6-CI SİNİF ══════════ */
'6': {
  'Azərbaycan dili': {
    /* Şəkilçi ilə söz yaradıcılığı — konkret şəkilçilər */
    'Söz yaradıcılığı (şəkilçi ilə)': [
      { q:'"-çı/-çi/-cu/-cü" şəkilçisi nə bildirir?', opts:['yer','peşə/sənət','əlamət','hal'], ans:1, exp:'"-çı/-çi/-cu/-cü" — peşə bildirən şəkilçi: çörək-çi, bağ-çı, dəmir-çi', bal:10 },
      { q:'"-lıq/-lik/-luq/-lük" şəkilçisi nə bildirir?', opts:['peşə','yer/keyfiyyət/hal','hərəkət','say'], ans:1, exp:'"-lıq/-lik" — yer, keyfiyyət bildirən şəkilçi: meşə-lik, gözəl-lik', bal:10 },
      { q:'"Müəllim" sözündən "-lik" şəkilçisi ilə hansı söz düzəlir?', opts:['müəllimlər','müəllimə','müəllimlik','müəllimdən'], ans:2, exp:'"Müəllim" + "-lik" = "müəllimlik" (peşə/vəzifə adı)', bal:10 },
      { q:'"-sız/-siz" şəkilçisi nə bildirir?', opts:['mənsubluq','yoxluq/olmama','çoxluq','yer'], ans:1, exp:'"-sız/-siz/-suz/-süz" — yoxluq bildirən şəkilçi: su-suz, ev-siz', bal:10 },
      { q:'"Günəbaxan" sözü hansı üsulla yaranmışdır?', opts:['şəkilçi ilə','iki kökün birləşməsi (mürəkkəb söz)','alınma','qısaltma'], ans:1, exp:'"Günəbaxan" = "günə" + "baxan" — iki kökdən mürəkkəb sözdür', bal:10 },
    ],

    /* Əvəzlik: şəxs, işarə, sual, qeyri-müəyyən əvəzlikləri */
    'Əvəzlik': [
      { q:'Şəxs əvəzliklərini göstər:', opts:['bu, o, bunlar','kim, nə, hansı','mən, sən, o, biz, siz, onlar','özüm, özün, özü'], ans:2, exp:'Şəxs əvəzlikləri: mən, sən, o, biz, siz, onlar', bal:10 },
      { q:'"O" əvəzliyi hansı şəxsi bildirir?', opts:['1-ci şəxs tək','2-ci şəxs tək','3-cü şəxs tək','3-cü şəxs cəm'], ans:2, exp:'"O" — 3-cü şəxs tək şəxs əvəzliyi', bal:10 },
      { q:'"Bu" hansı növ əvəzlikdir?', opts:['şəxs əvəzliyi','işarə əvəzliyi','sual əvəzliyi','qeyri-müəyyən əvəzliyi'], ans:1, exp:'"Bu" — yaxında olan əşyaya işarə edən işarə əvəzliyidir', bal:10 },
      { q:'"Kim?" hansı növ əvəzlikdir?', opts:['şəxs','işarə','sual','qeyri-müəyyən'], ans:2, exp:'"Kim?" — sual əvəzliyidir', bal:10 },
      { q:'"Biz" əvəzliyi hansı şəxsdir?', opts:['1-ci şəxs tək','1-ci şəxs cəm','2-ci şəxs cəm','3-cü şəxs cəm'], ans:1, exp:'"Biz" — 1-ci şəxs cəm şəxs əvəzliyi', bal:10 },
    ],

    /* Zərf: tərz, yer, zaman, miqdar zərfləri */
    'Zərf': [
      { q:'Zərf nəyin əlamətini bildirir?', opts:['əşyanın','hərəkətin (yer, zaman, tərz, miqdar)','şəxsin','ədədin'], ans:1, exp:'Zərf — hərəkətin yer, zaman, keyfiyyət, miqdar əlamətini bildirir', bal:10 },
      { q:'"Tez qaçdı" cümləsindəki zərf hansıdır?', opts:['qaçdı','tez','o','—'], ans:1, exp:'"Tez" — hərəkətin keyfiyyətini bildirən tərz zərfidir', bal:10 },
      { q:'"Sabah gedəcəm" cümləsindəki zərf hansıdır?', opts:['gedəcəm','mən','sabah','—'], ans:2, exp:'"Sabah" — hərəkətin zamanını bildirən zaman zərfidir', bal:10 },
      { q:'"Buraya gəl" cümləsindəki zərf hansıdır?', opts:['gəl','—','buraya','sən'], ans:2, exp:'"Buraya" — hərəkətin istiqamətini bildirən yer zərfidir', bal:10 },
    ],

    /* Say: miqdar/sıra/kəsr/müştərək saylar */
    'Say': [
      { q:'Miqdar sayına nümunə?', opts:['birinci','ikinci','üç','sonuncu'], ans:2, exp:'"Üç" — miqdar sayı: ağsayan sayıdır', bal:10 },
      { q:'Sıra sayına nümunə?', opts:['beş','on','yüz','üçüncü'], ans:3, exp:'"Üçüncü" — sıra sayı: sıra bildirir, "-ıncı/-inci" şəkilçisi ilə düzəlir', bal:10 },
      { q:'Sıra sayı hansı şəkilçi ilə düzəlir?', opts:['-lar/-lər','-ıncı/-inci/-uncu/-üncü','-lıq/-lik','-ın/-in'], ans:1, exp:'Sıra sayı: "-ıncı/-inci/-uncu/-üncü" — birinci, ikinci, üçüncü', bal:10 },
      { q:'"İki adam" ifadəsindəki say hansı növdür?', opts:['sıra sayı','kəsr sayı','miqdar sayı','müştərək say'], ans:2, exp:'"İki" — miqdar sayıdır (neçə?)', bal:10 },
    ],
  },

  'Riyaziyyat': {
    /* Tam ədədlər: müsbət/mənfi, mütləq dəyər */
    'Tam ədədlər': [
      { q:'(-7) + 3 = ?', opts:['-4','4','-10','10'], ans:0, exp:'(-7) + 3 = -4 (mənfi tərəf üstündür)', bal:10 },
      { q:'(-5) × (-6) = ?', opts:['-30','30','-11','11'], ans:1, exp:'(-) × (-) = (+): (-5)×(-6) = 30', bal:10 },
      { q:'|-9| = ?', opts:['-9','0','9','81'], ans:2, exp:'Mütləq dəyər: |-9| = 9 (mənfi işarə götürülür)', bal:10 },
      { q:'(-3)³ = ?', opts:['9','-9','27','-27'], ans:3, exp:'(-3)³ = (-3)×(-3)×(-3) = 9×(-3) = -27', bal:10 },
      { q:'(-12) ÷ 4 = ?', opts:['3','-3','8','-8'], ans:1, exp:'(-12) ÷ 4 = -3 (mənfi ÷ müsbət = mənfi)', bal:10 },
    ],

    /* Nisbət və faiz */
    'Nisbət və faiz': [
      { q:'6:4 nisbəti sadələşdirilmiş forması?', opts:['2:3','3:2','1:2','2:1'], ans:1, exp:'6:4 = 6÷2 : 4÷2 = 3:2', bal:10 },
      { q:'200-ün 15%-i nəçədir?', opts:['20','25','30','35'], ans:2, exp:'200 × 0.15 = 30', bal:10 },
      { q:'80-in 25%-i nəçədir?', opts:['15','18','20','25'], ans:2, exp:'80 × 0.25 = 20', bal:10 },
      { q:'40 ədədin 50%-i nəçədir?', opts:['10','15','20','25'], ans:2, exp:'40 × 0.50 = 20', bal:10 },
    ],

    /* Birməchullu tənliklər */
    'Tənliklər': [
      { q:'2x + 6 = 14. x = ?', opts:['3','4','5','6'], ans:1, exp:'2x = 8 → x = 4', bal:10 },
      { q:'5x - 10 = 15. x = ?', opts:['3','4','5','6'], ans:2, exp:'5x = 25 → x = 5', bal:10 },
      { q:'3x = 21. x = ?', opts:['6','7','8','9'], ans:1, exp:'x = 21 ÷ 3 = 7', bal:10 },
      { q:'x + 15 = 34. x = ?', opts:['17','18','19','20'], ans:2, exp:'x = 34 - 15 = 19', bal:10 },
    ],
  },

  'Tarix': {
    'Orta əsrlər Azərbaycanı': [
      { q:'Şirvanşahlar sarayı harada yerləşir?', opts:['Gəncədə','Şamaxıda','Bakıda (İçərişəhər)','Naxçıvanda'], ans:2, exp:'Şirvanşahlar sarayı kompleksi Bakının İçərişəhərindədir', bal:10 },
      { q:'Atabəylər (Eldənizlər) dövlətinin əsas hökmdarı?', opts:['I Şah İsmayıl','Şamxor','Eldəniz','II Toğrul'], ans:2, exp:'Şəmsəddin Eldəniz — Atabəylər dövlətinin banisi', bal:10 },
      { q:'Nizami Gəncəvi hansı dövrdə yaşamışdır?', opts:['IX əsr','XII əsr','XV əsr','XVI əsr'], ans:1, exp:'Nizami Gəncəvi 1141-1209-cu illərdə, XII əsrdə yaşamışdır', bal:10 },
    ],
    'Orta əsrlər dünya tarixi': [
      { q:'Feodal cəmiyyətinin 2 əsas sinfi?', opts:['varlı-kasıb','feodallar-kəndlilər','işçi-sahibkar','kölədar-kölə'], ans:1, exp:'Feodal cəmiyyəti: torpaq sahibi feodallar + asılı kəndlilər', bal:10 },
      { q:'Xaç yürüşləri nə vaxt başladı?', opts:['IX əsr','1096-cı ildə','XIV əsrdə','XV əsrdə'], ans:1, exp:'Birinci Xaç yürüşü 1096-cı ildə başladı', bal:10 },
    ],
  },

  'Coğrafiya': {
    'Materiklər': [
      { q:'Ən böyük materik?', opts:['Afrika','Avrasiya','Şimali Amerika','Antarktida'], ans:1, exp:'Avrasiya — 54 mln km² ilə ən böyük materikdir', bal:10 },
      { q:'Ən kiçik materik?', opts:['Antarktida','Cənubi Amerika','Afrika','Avstraliya'], ans:3, exp:'Avstraliya — ən kiçik materikdir (~7.7 mln km²)', bal:10 },
      { q:'Nil çayı hansı materikdədir?', opts:['Asiya','Avropa','Afrika','Amerika'], ans:2, exp:'Nil çayı Afrikadadır — dünyanın ən uzun çaylarından biri', bal:10 },
      { q:'Amazon çayı hansı materikdədir?', opts:['Afrika','Avropa','Şimali Amerika','Cənubi Amerika'], ans:3, exp:'Amazon çayı Cənubi Amerikadadır', bal:10 },
    ],
    'Okeanlar': [
      { q:'Ən böyük okean?', opts:['Atlantik','Hind','Arktik','Sakit'], ans:3, exp:'Sakit okean — ~165 mln km² ilə ən böyük okean', bal:10 },
      { q:'Ən dərin okean çökəkliyi?', opts:['Atlantik okeanı çökəkliyi','Mariana çökəkliyi (Sakit)','Hind okeanı çökəkliyi','Qara dəniz çökəkliyi'], ans:1, exp:'Mariana çökəkliyi (~11.034 m) — dünyanın ən dərin nöqtəsidir', bal:10 },
    ],
  },

  'İngilis dili': {
    'Present Continuous — quruluş': [
      { q:'"She ___ a book right now."', opts:['reads','read','is reading','was reading'], ans:2, exp:'Present Continuous: am/is/are + V-ing', bal:10 },
      { q:'"They ___ football at the moment."', opts:['play','plays','are playing','were playing'], ans:2, exp:'"They" + "are" + "playing" → Present Continuous', bal:10 },
      { q:'Present Continuous nə zaman işlədilir?', opts:['adət üçün','şu an baş verən hadisə üçün','keçmiş hadisə üçün','gələcək plan üçün'], ans:1, exp:'Present Continuous — danışıq anında baş verən hadisəni bildirir', bal:10 },
      { q:'"I am not ___ TV." (baxmıram)', opts:['watch','watches','watching','watched'], ans:2, exp:'Present Continuous mənfi: am not + V-ing', bal:10 },
    ],
    'Can / Could': [
      { q:'"___ you swim?" (bacarırsanmı?)', opts:['Do','Are','Can','Have'], ans:2, exp:'Bacarıq üçün "can" işlədilir', bal:10 },
      { q:'"I ___ speak French when I was young."', opts:['can','could','will','should'], ans:1, exp:'Keçmişdə bacarıq üçün "could" işlədilir', bal:10 },
      { q:'"Can" nə vaxt işlədilir?', opts:['məcburlıq üçün','icazə/bacarıq üçün','keçmiş üçün','gələcək üçün'], ans:1, exp:'"Can" — hazırki bacarıq, icazə vermə/istəmə üçün işlədilir', bal:10 },
    ],
  },

  'Biologiya': {
    'Hüceyrənin quruluşu': [
      { q:'Hüceyrənin "idarəetmə mərkəzi"?', opts:['mitoxondri','xloroplast','nüvə','ribosoma'], ans:2, exp:'Nüvə — DNT saxlayır, hüceyrə fəaliyyətini idarə edir', bal:10 },
      { q:'Bitki hüceyrəsini heyvan hüceyrəsindən fərqləndirən xüsusiyyət?', opts:['nüvə','mitoxondri','hüceyrə divarı','ribosoma'], ans:2, exp:'Bitki hüceyrəsinin sellüloz hüceyrə divarı var', bal:10 },
      { q:'Mitoxondri nə funksiya daşıyır?', opts:['zülal sintezi','fotosintez','enerji (ATP) istehsalı','hüceyrəni idarə etmə'], ans:2, exp:'Mitoxondri — hüceyrənin "enerjistansiyası", ATP sintez edir', bal:10 },
      { q:'Xloroplast hansı hüceyrədə olur?', opts:['heyvan hüceyrəsi','bitki hüceyrəsi','bakteriya','göbələk'], ans:1, exp:'Xloroplast — yalnız bitki hüceyrəsindədir, fotosintez edir', bal:10 },
    ],
  },
},

/* ══════════ 7-Cİ SİNİF ══════════ */
'7': {
  'Azərbaycan dili': {
    /* Söz birləşmələri: ismi/feli, əsas/asılı tərəf */
    'Söz birləşmələri': [
      { q:'"Gözəl mənzərə" hansı növ söz birləşməsidir?', opts:['feli birləşmə','ismi birləşmə','zərfi birləşmə','say birləşməsi'], ans:1, exp:'Sifət + isim → ismi birləşmə (əsas tərəf: isim)', bal:10 },
      { q:'"Sürətlə qaçmaq" hansı növ birləşmədir?', opts:['ismi','feli','sayıl','zərfi'], ans:1, exp:'Zərf + fel → feli birləşmə (əsas tərəf: fel)', bal:10 },
      { q:'İsmi birləşmənin əsas tərəfi hansı nitq hissəsidir?', opts:['sifət','zərf','isim','fel'], ans:2, exp:'İsmi birləşmənin əsas tərəfi isimdir', bal:10 },
      { q:'Feli birləşmənin əsas tərəfi hansı nitq hissəsidir?', opts:['isim','sifət','say','fel'], ans:3, exp:'Feli birləşmənin əsas tərəfi feldir', bal:10 },
      { q:'"Böyük ev" birləşməsinin asılı tərəfi hansıdır?', opts:['ev','böyük','hər ikisi','heç biri'], ans:1, exp:'"Böyük" — "ev" sözünə asılıdır, əsas tərəf "ev"-dir', bal:10 },
    ],

    /* İkinci dərəcəli üzvlər: tamamlıq, zərflik, təyin */
    'İkinci dərəcəli cümlə üzvləri': [
      { q:'"O kitabı oxudu." cümləsinin tamamlığı?', opts:['o','kitabı','oxudu','—'], ans:1, exp:'"Kitabı" — nəyi? sualına cavab verir → tamamlıq', bal:10 },
      { q:'Zərflik hansı suala cavab verir?', opts:['kim? nə?','nəyi? kimi?','nə vaxt? harada? necə?','hansı?'], ans:2, exp:'Zərflik: nə vaxt? harada? necə? nə üçün? kimi/hansı yolla?', bal:10 },
      { q:'Təyin hansı suala cavab verir?', opts:['kim?','hansı? nə cür? necə?','nə vaxt?','niyə?'], ans:1, exp:'Təyin — isimi izah edən üzvdür: hansı? nə cür?', bal:10 },
      { q:'"Gözəl qız oxuyur." cümləsindəki "gözəl" sözü hansı cümlə üzvüdür?', opts:['mübtəda','xəbər','tamamlıq','təyin'], ans:3, exp:'"Gözəl" — "qız" isimini izah edir: hansı qız? → təyin', bal:10 },
    ],

    /* Şəxsə görə cümlə növləri */
    'Cümlənin şəxsə görə növləri': [
      { q:'Müəyyən şəxsli cümlənin xüsusiyyəti?', opts:['Mübtədası yoxdur','Mübtəda məlum şəxsdir (I, II, III şəxs)','Yalnız əmr bildirir','Mürəkkəb quruluşludur'], ans:1, exp:'Müəyyən şəxsli cümlə: mübtəda açıq göstərilmir, amma müəyyən şəxsə aiddir', bal:10 },
      { q:'"Sabah imtahan olacaq." — bu hansı növdür?', opts:['müəyyən şəxsli','qeyri-müəyyən şəxsli','ümumi şəxsli','şəxssiz'], ans:1, exp:'Kim edəcək — məlum deyil → qeyri-müəyyən şəxsli cümlə', bal:10 },
      { q:'"İnsanlar bir-birinə kömək etməlidir." — hansı növ?', opts:['müəyyən şəxsli','qeyri-müəyyən şəxsli','ümumi şəxsli','şəxssiz'], ans:2, exp:'Bütün insanlara aiddir, konkret şəxs göstərilmir → ümumi şəxsli', bal:10 },
    ],
  },

  'Riyaziyyat': {
    /* Cəbr: ifadə, tənlik, bərabərsizlik */
    'Cəbri ifadələr və tənliklər': [
      { q:'2x + 7 = 13. x = ?', opts:['2','3','4','5'], ans:1, exp:'2x = 6 → x = 3', bal:10 },
      { q:'(a+b)² açılışı?', opts:['a²+b²','a²+2ab+b²','a²-2ab+b²','2a+2b'], ans:1, exp:'(a+b)² = a² + 2ab + b²', bal:10 },
      { q:'(a-b)(a+b) = ?', opts:['a²+b²','a²-b²','a+b','a-b'], ans:1, exp:'(a-b)(a+b) = a² - b² (tam kvadratların fərqi)', bal:10 },
      { q:'3(x + 4) = 21. x = ?', opts:['2','3','4','5'], ans:1, exp:'3x + 12 = 21 → 3x = 9 → x = 3', bal:10 },
    ],

    /* Funksiyalar: xətti funksiya, qrafik */
    'Funksiyalar': [
      { q:'y = 3x - 2 funksiyasında x=4 olduqda y=?', opts:['8','9','10','11'], ans:2, exp:'y = 3(4) - 2 = 12 - 2 = 10', bal:10 },
      { q:'Xətti funksiyanın qrafiki necədir?', opts:['parabolik','düz xətt','əyri xətt','dairə'], ans:1, exp:'y = kx + b — xətti funksiyanın qrafiki düz xəttdir', bal:10 },
      { q:'y = kx + b funksiyasında "k" nəyi bildirir?', opts:['y-kəsimini','meyil əmsalını (bucaq əmsalı)','maksimumu','minimumu'], ans:1, exp:'"k" — funksiyanın x oxuna nisbəti, meyil əmsalıdır', bal:10 },
    ],

    /* Həndəsə: Pitagor teoremi, oxşarlıq */
    'Həndəsə — Pitagor teoremi': [
      { q:'Pitagor teoremi: a²+b²=c². Bu hansı üçbucaq üçündür?', opts:['bərabər tərəfli','ikibucaqlı','düzbucaqlı','küt bucaqlı'], ans:2, exp:'Pitagor teoremi — yalnız düzbucaqlı üçbucaq üçün keçərlidir', bal:10 },
      { q:'Hipotenuz = 5, bir katet = 3. İkinci katet = ?', opts:['2','3','4','5'], ans:2, exp:'3² + b² = 5² → 9 + b² = 25 → b² = 16 → b = 4', bal:10 },
      { q:'Hipotenuz = 13, bir katet = 5. İkinci katet = ?', opts:['8','10','12','11'], ans:2, exp:'5² + b² = 13² → 25 + b² = 169 → b = 12', bal:10 },
    ],
  },

  'Fizika': {
    /* SI sistemi, fiziki kəmiyyətlər, ölçü vahidləri */
    'Fiziki kəmiyyətlər və SI sistemi': [
      { q:'SI sistemdə sürətin vahidi?', opts:['km/s','m/s','km/h','sm/s'], ans:1, exp:'SI sistemdə sürətin vahidi — m/s (metr/saniyə)', bal:10 },
      { q:'SI sistemdə kütlənin vahidi?', opts:['q','kq','t','mq'], ans:1, exp:'SI sistemdə kütlənin vahidi — kq (kiloqram)', bal:10 },
      { q:'Sıxlıq düsturu?', opts:['ρ=m+V','ρ=m×V','ρ=m/V','ρ=V/m'], ans:2, exp:'Sıxlıq: ρ = m/V (kütlə bölü həcm), vahidi kq/m³', bal:10 },
      { q:'İş düsturu (mexanikada)?', opts:['A=F+s','A=F-s','A=F×s×cosα','A=F/s'], ans:2, exp:'İş: A = F × s × cos α (qüvvə × yol × kosinusun bucağı)', bal:10 },
    ],

    /* Nyuton qanunları */
    'Nyuton qanunları': [
      { q:'Nyutonun 1-ci qanunu (inertsiya qanunu) nə deyir?', opts:['F=ma','Xarici qüvvə olmadıqda cisim hərəkət vəziyyətini saxlayır','Hər fəaliyyətin əks-fəaliyyəti var','İmpulsun saxlanması'], ans:1, exp:'Nyutonun I qanunu: xarici qüvvə olmadıqda cisim sakin durur və ya düzxətli bərabərsürətli hərəkət edir', bal:10 },
      { q:'F = m × a — bu hansı qanundur?', opts:['1-ci Newton','2-ci Newton','3-cü Newton','Arximed'], ans:1, exp:'F = ma — Nyutonun II qanunu: qüvvə = kütlə × sürətlənmə', bal:10 },
      { q:'Nyutonun 3-cü qanunu nəyi deyir?', opts:['inertsiya qanunu','F=ma','Hər fəaliyyətin bərabər əks-fəaliyyəti var','Enerjinin saxlanması'], ans:2, exp:'Nyutonun III qanunu: cismlər bir-birinə bərabər, lakin əks yönlü qüvvələrlə təsir göstərir', bal:10 },
    ],
  },

  'Kimya': {
    /* Atomun quruluşu: proton, neytron, elektron, nüvə */
    'Atomun quruluşu': [
      { q:'Atomun nüvəsini əmələ gətirən hissəciklər?', opts:['elektron+neytron','proton+neytron','proton+elektron','yalnız proton'], ans:1, exp:'Nüvə: proton (müsbət yüklü) + neytron (yüksüz)', bal:10 },
      { q:'Elektronun yükü?', opts:['müsbət (+1)','mənfi (-1)','neytral (0)','dəyişkən'], ans:1, exp:'Elektron — mənfi yüklü hissəcik (-1)', bal:10 },
      { q:'Atom nömrəsi nəyi göstərir?', opts:['neytron sayı','proton sayı','kütlə ədədi','elektron+neytron'], ans:1, exp:'Atom nömrəsi = proton sayı (= neytral atomdakı elektron sayı)', bal:10 },
      { q:'Kütlə ədədi nəyi göstərir?', opts:['yalnız proton sayı','proton + neytron sayı','yalnız neytron sayı','elektron sayı'], ans:1, exp:'Kütlə ədədi = proton sayı + neytron sayı', bal:10 },
    ],
  },

  'Tarix': {
    'Azərbaycan (XVI-XVII əsr)': [
      { q:'Səfəvilər dövlətinin banisi?', opts:['I Şah Abbas','I Şah İsmayıl','Nadir şah','Ağa Məhəmməd şah'], ans:1, exp:'I Şah İsmayıl 1501-ci ildə Səfəvilər dövlətini qurdu', bal:10 },
      { q:'Çaldıran döyüşü (1514) kim ilə kim arasında idi?', opts:['Səfəvilər-Rusiya','Osmanlılar-Səfəvilər','Monqollar-Səfəvilər','Ərəblər-Səfəvilər'], ans:1, exp:'Çaldıran döyüşü — Osmanlı Sultan I Səlim ilə Səfəvi I Şah İsmayıl arasında', bal:10 },
    ],
    'Yeni dövr dünya tarixi': [
      { q:'ABŞ müstəqillik bəyannaməsi nə vaxt imzalandı?', opts:['1765','1776','1789','1800'], ans:1, exp:'ABŞ müstəqillik bəyannaməsi 4 iyul 1776-cı ildə imzalandı', bal:10 },
      { q:'Fransız inqilabının başlanğıcı?', opts:['1776','1789','1799','1815'], ans:1, exp:'Fransız inqilabı 14 iyul 1789-cu ildə Bastilin ələ keçirilməsi ilə başladı', bal:10 },
    ],
  },

  'Coğrafiya': {
    'Avropa': [
      { q:'Avropanın ən uzun çayı?', opts:['Ren','Dunay','Volqa','Sena'], ans:2, exp:'Volqa (3530 km) — Avropanın ən uzun çayıdır', bal:10 },
      { q:'Alp dağları hansı ölkələri əhatə edir?', opts:['Yalnız Fransa','Yalnız İsveçrə','Fransa, İsveçrə, Avstriya, İtaliya','Yalnız Almaniya'], ans:2, exp:'Alp dağları bir neçə ölkə — Fransa, İsveçrə, Avstriya, İtaliya ərazisindədir', bal:10 },
    ],
    'Asiya': [
      { q:'Asiyanın ən hündür dağı?', opts:['K2','Everest','Kançencanqa','Lxotse'], ans:1, exp:'Everest (8849 m) — Asiyanın (və dünyanın) ən hündür dağıdır', bal:10 },
      { q:'Qobi çölü hansı ölkələrdədir?', opts:['Rusiya-Çin','Çin-Monqolustan','Hindistan-Pakistan','Qazaxıstan-Çin'], ans:1, exp:'Qobi çölü Monqolustan və Şimali Çin ərazisindədir', bal:10 },
    ],
  },

  'İngilis dili': {
    'Future Simple (will)': [
      { q:'"I ___ you tomorrow." (will ilə)', opts:['see','will see','am seeing','saw'], ans:1, exp:'Gələcək zaman: will + felın əsası', bal:10 },
      { q:'"Will" nə vaxt işlədilir?', opts:['keçmiş hadisə','spontan qərar, gələcək proqnoz','şu an baş verən','adət'], ans:1, exp:'"Will" — o an qərara gəlinən hadisə, gələcəyə dair proqnoz üçün', bal:10 },
      { q:'"She will not come." — mənfi forması?', opts:['she not will come','she will not come','she won\'t come','hər ikisi (b,c)'], ans:3, exp:'"Will not" = "won\'t" — ikisi də düzgündür', bal:10 },
    ],
    'Sifətin müqayisə dərəcəsi': [
      { q:'"big" sözünün müqayisə dərəcəsi?', opts:['more big','biger','bigger','most big'], ans:2, exp:'Qısa sifətin müqayisə dərəcəsi: -er artırılır. "big" → "bigger" (g ikiqatlanır)', bal:10 },
      { q:'"beautiful" sözünün üstünlük dərəcəsi?', opts:['beautifulest','most beautiful','more beautiful','beautifuller'], ans:1, exp:'Uzun sifətin üstünlük dərəcəsi: "most" + sifət', bal:10 },
      { q:'"good" sözünün müqayisə dərəcəsi?', opts:['gooder','more good','better','goodest'], ans:2, exp:'"Good" qeyri-düzgül müqayisə: good → better → best', bal:10 },
    ],
  },

  'Biologiya': {
    'Toxumalar': [
      { q:'Epiteli toxumasının əsas funksiyası?', opts:['hərəkət','örtük və mühafizə','enerji saxlama','qida daşıma'], ans:1, exp:'Epiteli toxuması orqanları örtür, xarici mühitdən qoruyur', bal:10 },
      { q:'Əzələ toxumasının xüsusiyyəti?', opts:['büzülmə qabiliyyəti','keçiricilik','bölünmə','işıq udma'], ans:0, exp:'Əzələ toxuması — büzülmə xüsusiyyətinə malikdir', bal:10 },
      { q:'Sinir toxuması nə funksiya daşıyır?', opts:['büzülmə','enerji istehsalı','həyəcan keçiricilik (impuls)','qida saxlama'], ans:2, exp:'Sinir toxuması — elektrik siqnallarını (impulsları) ötürür', bal:10 },
    ],
    'İnsan anatomiyası (ürək-damar)': [
      { q:'Ürəyin neçə kamerası var?', opts:['2','3','4','5'], ans:2, exp:'Ürəyin 4 kamerası var: 2 qulaqcıq + 2 mədəcik', bal:10 },
      { q:'Eritrositlər nə funksiya yerinə yetirir?', opts:['immunitet','qan laxtalaşması','oksigen daşıma','qida daşıma'], ans:2, exp:'Eritrositlər — hemoglobin vasitəsilə oksigen daşıyır', bal:10 },
    ],
  },
},

/* ══════════ 8-Cİ SİNİF ══════════ */
'8': {
  'Azərbaycan dili': {
    /* Mürəkkəb cümlə: tabesiz/tabeli, növlər */
    'Mürəkkəb cümlə': [
      { q:'Tabesiz mürəkkəb cümlənin hissələri necə bağlanır?', opts:['tabeli bağlayıcı ilə','tabesizlik bağlayıcısı ilə (və, amma, lakin)','intonasiya ilə','şərt şəkli ilə'], ans:1, exp:'Tabesiz m.c.: "və", "amma", "lakin", "ancaq" kimi bağlayıcılarla', bal:11 },
      { q:'Tabeli mürəkkəb cümlənin budaq hissəsi nədir?', opts:['Əsas fikri bildirən hissə','Əsas cümləyə tabe olan, ona sual verən hissə','Yalnız xəbəri olan hissə','Hər iki hissə'], ans:1, exp:'Budaq cümlə — əsas cümləyə tabe olan, ona "nə vaxt? niyə? necə?" sualı verən hissədir', bal:11 },
      { q:'"Hava gözəl olduğundan gəzdik." — budaq cümlənin növü?', opts:['zaman budaq','şərt budaq','səbəb budaq','tərz budaq'], ans:2, exp:'"Niyə gəzdik?" — səbəb sualına cavab verir → səbəb budaq cümləsidir', bal:11 },
      { q:'"Güclü külək əssəydi, gemi daha tez gedərdi." — hansı budaq cümlə?', opts:['zaman','şərt','səbəb','məqsəd'], ans:1, exp:'"Əssəydi" — şərt şəkli → şərt budaq cümləsidir', bal:11 },
    ],

    /* Birbaşa/dolayı nitq */
    'Birbaşa və dolayı nitq': [
      { q:'Birbaşa nitqdə müəllif sözündən sonra hansı işarə qoyulur?', opts:['nöqtə','vergül','iki nöqtə','tire'], ans:2, exp:'Müəllif sözündən sonra iki nöqtə (:), birbaşa nitq isə tire (—) ilə başlanır', bal:11 },
      { q:'Dolayı nitq nədir?', opts:['Kiminsə sözlərini olduğu kimi vermək','Kiminsə sözlərini öz dilinizdə çatdırmaq','Dialoqda verilən nitq','Şeir formasındakı nitq'], ans:1, exp:'Dolayı nitq — kiminsə sözlərini öz sözlərimlə çatdırmaq, tabe bağlayıcı ilə', bal:11 },
      { q:'"Müəllim dedi: — Sabah imtahan olacaq." — bu hansı növ nitqdir?', opts:['dolayı nitq','birbaşa nitq','monoloji nitq','dialoq'], ans:1, exp:'Kiminsə sözü olduğu kimi verilir → birbaşa nitqdir', bal:11 },
    ],

    /* Feili bağlama, feili sifət, məsdər */
    'Felin qeyri-şəxs formaları': [
      { q:'Məsdər hansı şəkilçi ilə düzəlir?', opts:['-an/-ən','-araq/-ərək','-maq/-mək','-mış/-miş'], ans:2, exp:'Məsdər: "-maq/-mək" şəkilçisi ilə düzəlir: oxu-maq, gəl-mək', bal:11 },
      { q:'"Oxuyan uşaq" birləşməsindəki "oxuyan" sözü hansı formasıdır?', opts:['məsdər','feili sifət','feili bağlama','şəxsli forma'], ans:1, exp:'"Oxu-yan" — feili sifət (-an/-ən şəkilçisi)', bal:11 },
      { q:'Feili bağlama hansı sualına cavab verir?', opts:['nə etmək?','hansı?','necə edərək? nə zaman?','nə vaxt?'], ans:2, exp:'Feili bağlama: "necə edərək? nə edib?" — hərəkətin tərzi/vaxtı', bal:11 },
    ],

    /* Durğu işarələri — 8-ci sinif dərinləşməsi */
    'Durğu işarələri': [
      { q:'Birbaşa nitqdən əvvəl hansı işarə qoyulur?', opts:['nöqtə','vergül','iki nöqtə','sual işarəsi'], ans:2, exp:'Müəllif sözündən sonra ":" qoyulur, sonra "—" ilə birbaşa nitq başlanır', bal:11 },
      { q:'Xitabdan sonra hansı işarə qoyulur?', opts:['nöqtə','vergül','nida işarəsi','sual işarəsi'], ans:1, exp:'Xitabdan (müraciət olunan şəxsin adından) sonra vergül qoyulur', bal:11 },
      { q:'İzahedici söz birləşməsindən əvvəl hansı işarə qoyulur?', opts:['vergül','iki nöqtə','tire','nöqtə'], ans:1, exp:'Sadalamadan/izahedici hissədən əvvəl iki nöqtə (:) qoyulur', bal:11 },
    ],
  },

  'Riyaziyyat': {
    'Kvadrat tənliklər': [
      { q:'x² - 7x + 12 = 0. Köklər?', opts:['3 və 4','3 və -4','-3 və -4','5 və 2'], ans:0, exp:'(x-3)(x-4)=0 → x=3, x=4', bal:11 },
      { q:'x² - 25 = 0. x = ?', opts:['5','-5','5 və -5','25'], ans:2, exp:'x² = 25 → x = ±5', bal:11 },
      { q:'Diskriminant D < 0 nə deməkdir?', opts:['İki həqiqi kök','Bir kök','Həqiqi kök yoxdur','Sonsuz kök'], ans:2, exp:'D < 0 olduqda kvadrat tənliyin həqiqi kökü yoxdur', bal:11 },
      { q:'D = b² - 4ac düsturu nəyin düsturudur?', opts:['Perimetr','Sahə','Diskriminant','Meyil'], ans:2, exp:'D = b² - 4ac — kvadrat tənliyin diskriminantı', bal:11 },
    ],
    'Statistika': [
      { q:'3, 5, 7, 9, 11 ədədlərinin orta hesabı?', opts:['6','7','8','9'], ans:1, exp:'(3+5+7+9+11)/5 = 35/5 = 7', bal:11 },
      { q:'Mediana nədir?', opts:['ən böyük ədəd','sıralanmış cərgənin ortası','orta hesab','ən çox təkrarlanan'], ans:1, exp:'Mediana — sıralanmış cərgənin ortasındakı ədəd', bal:11 },
      { q:'Verilənlər: 2, 4, 4, 7, 9 — modu nədir?', opts:['4','5','6','7'], ans:0, exp:'Mod — ən çox təkrarlanan ədəd: 4 iki dəfə görünür', bal:11 },
    ],
    'Həndəsə': [
      { q:'Dairənin sahəsi (r=6, π≈3.14)?', opts:['37.68','113.04','18.84','75.36'], ans:1, exp:'S = π × r² = 3.14 × 36 = 113.04', bal:11 },
      { q:'Trapesiyanın sahəsi (a=10, b=6, h=4)?', opts:['32','40','64','16'], ans:0, exp:'S = (a+b)/2 × h = (10+6)/2 × 4 = 8 × 4 = 32', bal:11 },
    ],
  },

  'Fizika': {
    'Elektrik dövrəsi': [
      { q:'U = I × R — bu hansı qanundur?', opts:['Kirxof','Om','Nyuton','Faradey'], ans:1, exp:'U = I × R — Om qanunu', bal:11 },
      { q:'Paralel bağlı müqavimətlər üçün ümumi müqavimət?', opts:['R=R₁+R₂','1/R=1/R₁+1/R₂','R=R₁×R₂','R=R₁-R₂'], ans:1, exp:'Paralel bağlamada: 1/R_ümumi = 1/R₁ + 1/R₂', bal:11 },
      { q:'Elektrik gücü düsturu?', opts:['P=U/I','P=UI','P=I/U','P=U+I'], ans:1, exp:'P = U × I (Vatt = Volt × Amper)', bal:11 },
      { q:'Ardıcıl bağlı dövrədə cərəyan necə paylanır?', opts:['bərabər paylanmır','hamısı eynidir','ən böyük müqavimətə daha çox','ən kiçik müqavimətə daha çox'], ans:1, exp:'Ardıcıl dövrədə cərəyan hər yerdə eynidir (I = const)', bal:11 },
    ],
    'İstilik hadisələri': [
      { q:'İstilik miqdarı düsturu?', opts:['Q=mcΔT','Q=mΔT','Q=mcT','Q=cΔT'], ans:0, exp:'Q = m × c × ΔT (kütlə × xüsusi istilik tutumu × temperatur fərqi)', bal:11 },
      { q:'0 Kelvin neçə Celsius dərəcəsidir?', opts:['-100°C','-173°C','-273°C','-373°C'], ans:2, exp:'0 K = -273.15°C — mütləq sıfır temperaturu', bal:11 },
    ],
  },

  'Kimya': {
    'Kimyəvi reaksiyalar': [
      { q:'Oksidləşmə-reduksiya reaksiyasında nə baş verir?', opts:['yalnız turşulaşma','elektron ötürülməsi','yalnız istilik ayrılması','rəng dəyişməsi'], ans:1, exp:'Redoks: bir maddə elektron verir (oksidləşir), digəri elektron alır (reduksiya olunur)', bal:11 },
      { q:'2H₂ + O₂ → ?', opts:['H₂O₂','2H₂O','4H₂O','H₃O'], ans:1, exp:'2H₂ + O₂ → 2H₂O (yanma reaksiyası)', bal:11 },
      { q:'Neytrallaşma reaksiyası: HCl + NaOH → ?', opts:['Na+HCl','NaCl+H₂O','NaO+H₂','NaH+ClO'], ans:1, exp:'HCl + NaOH → NaCl + H₂O (turşu + əsas = duz + su)', bal:11 },
    ],
    'Üzvi kimyaya giriş': [
      { q:'Üzvi kimya nəyi öyrənir?', opts:['metalları','karbon birləşmələrini','qazları','duzları'], ans:1, exp:'Üzvi kimya — karbon (C) əsaslı birləşmələri öyrənir', bal:11 },
      { q:'Metanın düsturu?', opts:['C₂H₆','CH₄','C₃H₈','C₂H₄'], ans:1, exp:'Metan: CH₄ — ən sadə alkan', bal:11 },
      { q:'Alkanların ümumi düsturu?', opts:['CₙH₂ₙ','CₙH₂ₙ₊₂','CₙH₂ₙ₋₂','CₙHₙ'], ans:1, exp:'Alkanlar (doymuş karbohidrogenlər): CₙH₂ₙ₊₂', bal:11 },
    ],
  },

  'Tarix': {
    'XIX əsr Azərbaycan': [
      { q:'Gülüstan müqaviləsi (1813) nə idi?', opts:['Azərbaycan-Osmanlı müqaviləsi','Rusiya-Qacarlar müqaviləsi (Şimali Azərbaycanın bir hissəsini Rusiyaya verdi)','Ticarət müqaviləsi','Sülh müqaviləsi'], ans:1, exp:'Gülüstan 1813: Rusiya-Qacarlar müharibəsini bitirdi, Şimali Azərbaycanın böyük hissəsi Rusiyaya keçdi', bal:11 },
      { q:'Türkmənçay müqaviləsi (1828) nə verdi?', opts:['Azərbaycanı Qacarlar aldı','Qalan Şimali Azərbaycan torpaqları Rusiyaya keçdi','Azərbaycan müstəqil oldu','Rusiya torpaq verdi'], ans:1, exp:'Türkmənçay 1828: Cənubi Azərbaycan Qacarların, Şimali Azərbaycan isə Rusiyanın idarəsində qaldı', bal:11 },
    ],
    'XIX əsr dünya tarixi': [
      { q:'Sənaye inqilabı ilk harada başladı?', opts:['Fransa','Almaniya','İngiltərə','ABŞ'], ans:2, exp:'Sənaye inqilabı XVIII-XIX əsrdə İngiltərədə başladı', bal:11 },
      { q:'Napolyon Bonapartın son məğlubiyyəti hansı döyüşdə oldu?', opts:['Austerlitz','Trafalgar','Vaterlü','Moskva'], ans:2, exp:'Vaterlü döyüşü (18 iyun 1815) — Napoleonun son məğlubiyyəti', bal:11 },
    ],
  },

  'Coğrafiya': {
    'Afrika': [
      { q:'Nil çayının uzunluğu?', opts:['5500 km','6650 km','7000 km','8000 km'], ans:1, exp:'Nil çayı — 6650 km uzunluğu ilə dünyanın ən uzun çaylarından biri', bal:11 },
      { q:'Sahara səhrasının sahəsi?', opts:['~5 mln km²','~7 mln km²','~9 mln km²','~11 mln km²'], ans:2, exp:'Sahara — ~9.2 mln km² ilə dünyanın ən böyük isti çölüdür', bal:11 },
    ],
    'Cənubi Amerika': [
      { q:'Amazon çayı harada başlanır?', opts:['Braziliyada','Peruda','Kolumbiyada','Venesuelada'], ans:1, exp:'Amazon çayının mənbəyi And dağlarında, Peruda yerləşir', bal:11 },
    ],
  },

  'İngilis dili': {
    'Present Perfect — quruluş': [
      { q:'"I ___ this film before."', opts:['see','saw','have seen','was seeing'], ans:2, exp:'Present Perfect: have/has + V3 (keçmiş təcrübə, vaxt göstərilmir)', bal:11 },
      { q:'"She ___ her homework yet." (hələ etməyib)', opts:['didn\'t finish','hasn\'t finished','doesn\'t finish','won\'t finish'], ans:1, exp:'Present Perfect mənfi: has not + V3 → hasn\'t finished', bal:11 },
      { q:'Present Perfect nə vaxt işlədilir?', opts:['keçmiş konkret tarixdə','vaxtı bildirilməyən keçmiş təcrübə üçün','şu an baş verən','gələcək'], ans:1, exp:'PP — keçmişdəki təcrübəni, yaxın keçmişdəki hadisəni bildirir (vaxt göstərilmir)', bal:11 },
    ],
    'Passive Voice (Məchul növ)': [
      { q:'"The book ___ by the teacher." (paylandı)', opts:['gave','was given','is given','gives'], ans:1, exp:'Passive Past Simple: was/were + V3', bal:11 },
      { q:'"She wrote a letter." → Passive:', opts:['A letter was written by her.','A letter wrote by her.','A letter is written by her.','She was written a letter.'], ans:0, exp:'Active → Passive: obyekt mövzu olur, fel was/were + V3 formasını alır', bal:11 },
    ],
  },

  'Biologiya': {
    'Genetika': [
      { q:'DNT-nin forması?', opts:['tək sarmal','ikiqat sarmal','üçlü sarmal','xətti zəncir'], ans:1, exp:'DNT — ikiqat sarmal (double helix) formasındadır', bal:11 },
      { q:'İnsan somatik hüceyrəsindəki xromosom sayı?', opts:['23','46','44','48'], ans:1, exp:'46 xromosom (23 cüt) — somatik hüceyrələrdə', bal:11 },
      { q:'Mendelin birinci qanunu (birlik qanunu) nəyi deyir?', opts:['hər iki valideynin xarakterləri birlikdə görünür','bir xarakter üstün (dominant) digəri gizli (resessiv) qalır','xarakterlər bərabər paylanır','mutasiya baş verir'], ans:1, exp:'Mendelin I qanunu: F1 nəsilbdə dominant xarakter görünür, resessiv gizli qalır', bal:11 },
    ],
  },
},

/* ══════════ 9-CU SİNİF ══════════ */
'9': {
  'Azərbaycan dili': {
    'Üslublar': [
      { q:'Publisistik üslub harada işlədilir?', opts:['elmi məqalələrdə','qəzet, jurnal, ictimai-siyasi yazılarda','rəsmi sənədlərdə','bədii ədəbiyyatda'], ans:1, exp:'Publisistik üslub — qəzet/jurnal məqaləsi, reportaj, müsahibə', bal:12 },
      { q:'Elmi üslubun əsas xüsusiyyəti?', opts:['emosionallıq, obrazlılıq','dəqiqlik, terminoloji dil, məntiqi ardıcıllıq','gündəlik danışıq dili','rəsmi sənəd dili'], ans:1, exp:'Elmi üslub: terminlər, dəqiq ifadə, məntiqi quruluş', bal:12 },
      { q:'Rəsmi-kargüzarlıq üslubunun nümunəsi?', opts:['hekayə','şeir','ərizə, protokol, sərəncam','qəzet məqaləsi'], ans:2, exp:'Rəsmi üslub: ərizə, vəkil etibarnaməsi, protokol, əmr', bal:12 },
      { q:'Bədii üslubda dil necə olmalıdır?', opts:['quru, rəsmi','yalnız terminlər','obrazlı, emosional, məcazi','standart, rəsmi'], ans:2, exp:'Bədii üslub — obrazlı, emosional, məcazi, fərdi dil', bal:12 },
      { q:'Danışıq üslubu nə zaman işlədilir?', opts:['rəsmi məclislərdə','gündəlik həyatda, qeyri-rəsmi söhbətdə','elmi konfranslarda','rəsmi yazışmalarda'], ans:1, exp:'Danışıq üslubu — gündəlik, qeyri-rəsmi nitq üçün', bal:12 },
    ],
    'Nitq mədəniyyəti': [
      { q:'Ədəbi dil norması nədir?', opts:['qrammatik xəta','dialekt xüsusiyyəti','hamı tərəfindən qəbul edilmiş dil qaydası','arxaik söz'], ans:2, exp:'Ədəbi dil norması — cəmiyyət tərəfindən ümumqəbul edilmiş yazı/danışıq qaydalarıdır', bal:12 },
      { q:'Şivə (dialekt) nədir?', opts:['ədəbi dil','rəsmi dil','müəyyən bölgə əhalisinin danışıq dili','yad dil'], ans:2, exp:'Şivə — müəyyən coğrafi ərazinin əhalisinin danışıq xüsusiyyətləri', bal:12 },
    ],
  },
  'Riyaziyyat': {
    'Trikonometriya': [
      { q:'sin²x + cos²x = ?', opts:['0','1','2','x'], ans:1, exp:'Əsas triqonometrik kimlik: sin²x + cos²x = 1', bal:12 },
      { q:'sin(30°) = ?', opts:['√3/2','1/2','1','0'], ans:1, exp:'sin(30°) = 1/2', bal:12 },
      { q:'cos(60°) = ?', opts:['√3/2','1/2','1','0'], ans:1, exp:'cos(60°) = 1/2', bal:12 },
      { q:'tan(45°) = ?', opts:['0','1/√3','1','√3'], ans:2, exp:'tan(45°) = sin(45°)/cos(45°) = 1', bal:12 },
      { q:'sin(90°) = ?', opts:['0','1/2','√2/2','1'], ans:3, exp:'sin(90°) = 1', bal:12 },
      { q:'cos(0°) = ?', opts:['0','1','-1','1/2'], ans:1, exp:'cos(0°) = 1', bal:12 },
    ],
    'Loqarifm': [
      { q:'log₂(8) = ?', opts:['2','3','4','8'], ans:1, exp:'2³ = 8 → log₂(8) = 3', bal:12 },
      { q:'log₁₀(1000) = ?', opts:['1','2','3','4'], ans:2, exp:'10³ = 1000 → log₁₀(1000) = 3', bal:12 },
      { q:'log_a(1) = ?', opts:['a','1','0','∞'], ans:2, exp:'a⁰ = 1 → log_a(1) = 0 (hər hansı əsas üçün)', bal:12 },
      { q:'log_a(a) = ?', opts:['0','1','a','∞'], ans:1, exp:'a¹ = a → log_a(a) = 1', bal:12 },
    ],
    'Ardıcıllıqlar': [
      { q:'2, 5, 8, 11, ... ardıcıllığında fərq nədir?', opts:['2','3','4','5'], ans:1, exp:'Hər həd əvvəlkindən 3 çox: 5-2=3, 8-5=3, 11-8=3', bal:12 },
      { q:'Həndəsi silsilə: 3, 6, 12, 24, ... Növbəti həd?', opts:['36','42','48','52'], ans:2, exp:'Nisbət = 2: 24 × 2 = 48', bal:12 },
    ],
  },
  'Fizika': {
    'Elektromaqnetizm': [
      { q:'Elektromaqnit induksiyasının qanunu kimin adını daşıyır?', opts:['Nyuton','Faradey','Om','Kirxof'], ans:1, exp:'Faradey qanunu (1831) — dəyişən maqnit axısı EMK yaradır', bal:12 },
      { q:'Kondansatorun yükü düsturu?', opts:['Q=C+U','Q=C/U','Q=C×U','Q=U/C'], ans:2, exp:'Q = C × U (yük = tutum × gərginlik)', bal:12 },
    ],
    'Optika': [
      { q:'İşığın boşluqdakı sürəti?', opts:['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','1.5×10⁸ m/s'], ans:1, exp:'c = 3×10⁸ m/s — işığın boşluqdakı sürəti', bal:12 },
      { q:'Snell qanunu nəyi izah edir?', opts:['işığın əksi','işığın sınması (n₁sinθ₁=n₂sinθ₂)','işığın udulması','işığın yayılması'], ans:1, exp:'Snell qanunu: n₁sinθ₁ = n₂sinθ₂ — işığın iki mühit sərhəddindən keçərkən sınması', bal:12 },
    ],
  },
  'Kimya': {
    'Elektrokimya': [
      { q:'Elektroliz nədir?', opts:['istilik ilə parçalanma','elektrik cərəyanı ilə kimyəvi parçalanma','oksidləşmə','neytrallaşma'], ans:1, exp:'Elektroliz — elektrik cərəyanı vasitəsilə maddənin parçalanması', bal:12 },
      { q:'pH = 7 nə deməkdir?', opts:['turş mühit (pH<7)','neytral mühit (pH=7)','qələvi mühit (pH>7)','güclü turşu'], ans:1, exp:'pH = 7 — neytral mühit (saf su 25°C-də)', bal:12 },
    ],
    'Üzvi kimya': [
      { q:'Etilen (C₂H₄) hansı sinifə aiddir?', opts:['alkan','alkin','alken','aromatik'], ans:2, exp:'C₂H₄ — alken (ikiqat C=C rabitəsi var)', bal:12 },
      { q:'Benzolun düsturu?', opts:['C₆H₁₄','C₆H₁₂','C₆H₆','C₆H₁₀'], ans:2, exp:'Benzol C₆H₆ — aromatik birləşmə', bal:12 },
    ],
  },
  'Biologiya': {
    'Evolyusiya': [
      { q:'Darvin nəzəriyyəsinin əsas mexanizmi?', opts:['mutasiya','genetik drift','təbii seçmə','hibridləşmə'], ans:2, exp:'Darvin — təbii seçmə nəzəriyyəsinin banisi', bal:12 },
      { q:'Homoloji orqanlar nədir?', opts:['eyni funksiyanı daşıyan','eyni mənşəli, fərqli funksiyalı','tamamilə eyni','fərqli mənşəli, eyni funksiyalı'], ans:1, exp:'Homoloji orqanlar — eyni mənşəyə, lakin müxtəlif funksiyaya malik (məs: insanın əli, quşun qanadı)', bal:12 },
    ],
    'Sitologiya (hüceyrə biologiyası)': [
      { q:'DNT replikasiyası nədir?', opts:['zülal sintezi','DNT-nin iki eyni nüsxəyə ayrılması','RNT sintezi','mutasiya'], ans:1, exp:'Replikasiya — DNT molekulunun özünü kopyalayaraq iki eyni molekula çevrilməsi', bal:12 },
      { q:'Ribosomaların funksiyası?', opts:['enerji istehsalı','zülal sintezi','fotosintez','hüceyrəni idarə etmə'], ans:1, exp:'Ribosomalar — zülal sintezinin həyata keçirildiyi yerdir', bal:12 },
    ],
  },
  'Tarix': {
    'XX əsr Azərbaycan': [
      { q:'AXC nə vaxt elan edildi?', opts:['28 may 1917','28 may 1918','28 may 1920','28 may 1991'], ans:1, exp:'AXC — 28 may 1918-ci ildə elan edildi', bal:12 },
      { q:'Azərbaycanda sovet hakimiyyəti nə vaxt quruldu?', opts:['1918','1920','1922','1924'], ans:1, exp:'28 aprel 1920-ci ildə sovet qoşunları Azərbaycana daxil oldu', bal:12 },
    ],
    'XX əsr dünya tarixi': [
      { q:'I Dünya müharibəsi nə vaxt başladı?', opts:['1912','1914','1916','1918'], ans:1, exp:'I Dünya müharibəsi 28 iyul 1914-cü ildə başladı', bal:12 },
      { q:'II Dünya müharibəsi nə vaxt sona çatdı?', opts:['1943','1944','1945','1946'], ans:2, exp:'II Dünya müharibəsi 1945-ci ildə: Avropada mayda, Asiyada sentyabrda bitdi', bal:12 },
    ],
  },
  'Coğrafiya': {
    'Dünya iqtisadiyyatı': [
      { q:'ÜDM (GDP) nəyi ölçür?', opts:['əhali sayını','ölkənin ümumi istehsal dəyərini','ticarət balansını','inflyasiyanı'], ans:1, exp:'ÜDM — ölkədə bir ildə istehsal edilmiş mal/xidmətlərin cəmi dəyəri', bal:12 },
      { q:'BRİCS ölkələri?', opts:['ABŞ,İngiltərə,Fransa,Almaniya,Yaponiya','Braziliya,Rusiya,Hindistan,Çin,Cənubi Afrika','Çin,Yaponiya,Koreya,Hindistan,Tailand','Fransa,İtaliya,İspaniya,Portuqaliya,Yunanıstan'], ans:1, exp:'BRİCS: Braziliya, Rusiya, Hindistan, Çin, Cənubi Afrika — inkişaf etməkdə olan iri iqtisadiyyatlar', bal:12 },
    ],
  },
  'İngilis dili': {
    '2nd Conditional': [
      { q:'"If I ___ you, I would help." (2nd conditional)', opts:['am','were','be','was'], ans:1, exp:'2nd conditional: If + Past Simple (were işlədilir şəxsdən asılı olmayaraq) → would + inf.', bal:12 },
      { q:'2nd conditional nə zaman işlədilir?', opts:['həqiqi gələcək şərt','qeyri-həqiqi/xəyali hazırki/gələcək şərt','keçmiş real şərt','keçmiş qeyri-real şərt'], ans:1, exp:'2nd conditional — hazırda/gələcəkdə qeyri-həqiqi, xəyali şərt üçün', bal:12 },
    ],
    'Reported Speech': [
      { q:'"I am tired." → She said that she ___ tired.', opts:['is','was','were','be'], ans:1, exp:'Reported speech-də "am/is" → "was" (zaman geri çəkilir)', bal:12 },
      { q:'"We will go." → She said that they ___ go.', opts:['will','would','shall','should'], ans:1, exp:'Reported speech-də "will" → "would"', bal:12 },
    ],
  },
  'Ədəbiyyat': {
    'Azərbaycan klassik ədəbiyyatı': [
      { q:'"Kitabi-Dədə Qorqud" hansı janradadır?', opts:['roman','dastan (epos)','şeir','hekayə'], ans:1, exp:'"Kitabi-Dədə Qorqud" — oğuz türklərinin qəhrəmanlıq dastanıdır', bal:12 },
      { q:'Nizaminin "Xəmsə"si neçə poemadan ibarətdir?', opts:['3','4','5','6'], ans:2, exp:'"Xəmsə" (beşlik) — beş böyük poemadan ibarətdir: Sirlər xəzinəsi, Xosrov və Şirin, Leyli və Məcnun, Yeddi gözəl, İsgəndərnamə', bal:12 },
      { q:'Füzulinin "Leyli və Məcnun" əsərinin janrı?', opts:['hekayə','roman','lirik-epik poema','dram'], ans:2, exp:'Füzulinin "Leyli və Məcnun" — lirik-epik poemadır', bal:12 },
    ],
    'Ədəbi nəzəriyyə': [
      { q:'Metafora nədir?', opts:['müqayisə','məcazi mənada işlənmiş söz/ifadə','antonim','sinonim'], ans:1, exp:'Metafora — bir əşyanı başqasına bənzədərək məcazi mənada işlətmək', bal:12 },
      { q:'Epitet nədir?', opts:['söz oyunu','obrazlı bədii sifət','zərf','frazeologizm'], ans:1, exp:'Epitet — predmeti bədii cəhətdən xarakterizə edən obrazlı sifət', bal:12 },
    ],
  },
},

/* ══════════ 10-CU SİNİF ══════════ */
'10': {
  'Azərbaycan dili': {
    'Mətn dilçiliyi': [
      { q:'Koheziya nədir?', opts:['mətnin uzunluğu','mətnin dil vasitəsilə (əvəzliklər, bağlayıcılar) formal birliyi','cümlə sayı','söz sırası'], ans:1, exp:'Koheziya — cümlələr arasındakı leksik-qrammatik əlaqə (əvəzliklər, sinonimlər, bağlayıcılar)', bal:12 },
      { q:'Koherensiya nədir?', opts:['cümlənin qrammatik düzgünlüyü','mətnin məntiqi-məzmun birliyi','söz sayı','durğu işarələri'], ans:1, exp:'Koherensiya — mətnin məntiqi ardıcıllığı, məzmun bütövlüyü', bal:12 },
      { q:'Mətnin əsas hissələri?', opts:['giriş, nəticə','giriş, inkişaf, nəticə','yalnız əsas hissə','xülasə, analiz'], ans:1, exp:'Klassik mətn quruluşu: giriş (tezis) → inkişaf (əsas hissə) → nəticə', bal:12 },
    ],
    'Üslub növləri (dərinləşmə)': [
      { q:'Hansı üslubda ən çox terminlər işlədilir?', opts:['bədii','publisistik','elmi','danışıq'], ans:2, exp:'Elmi üslub — terminoloji dil, dəqiq ifadə üstünlük təşkil edir', bal:12 },
      { q:'Esse hansı üsluba aiddir?', opts:['rəsmi','elmi','publisistik/bədii','gündəlik danışıq'], ans:2, exp:'Esse — müəllifin mövqeyini ifadə edən publisistik/bədii üslubda kiçik janrdır', bal:12 },
    ],
  },
  'Riyaziyyat': {
    'Törəmə': [
      { q:"f(x) = x³ törəməsi?", opts:['x²','3x²','3x','x³'], ans:1, exp:"f'(x) = 3x²", bal:12 },
      { q:"f(x) = 5x² - 3x + 2 üçün f'(x) = ?", opts:['5x-3','10x-3','10x+3','5x+3'], ans:1, exp:"f'(x) = 10x - 3", bal:12 },
      { q:"(sin x)' = ?", opts:['sin x','-sin x','cos x','-cos x'], ans:2, exp:"(sin x)' = cos x", bal:12 },
      { q:"(eˣ)' = ?", opts:['eˣ⁻¹','x·eˣ','eˣ','1/eˣ'], ans:2, exp:"(eˣ)' = eˣ — eksponensial funksiyanın törəməsi özündən ibarətdir", bal:12 },
    ],
    'İntegral': [
      { q:'∫2x dx = ?', opts:['2x²+C','x²+C','x+C','2+C'], ans:1, exp:'∫2x dx = x² + C', bal:12 },
      { q:'∫sin(x) dx = ?', opts:['cos x+C','-cos x+C','sin x+C','-sin x+C'], ans:1, exp:'∫sin(x) dx = -cos(x) + C', bal:12 },
      { q:'∫3 dx = ?', opts:['3+C','3x+C','x+C','3x²+C'], ans:1, exp:'∫k dx = kx + C (sabitin inteqralı)', bal:12 },
    ],
    'Kombinatorika': [
      { q:'C(6,2) = ?', opts:['12','15','18','20'], ans:1, exp:'C(6,2) = 6!/(2!×4!) = (6×5)/(2×1) = 15', bal:12 },
      { q:'4! = ?', opts:['12','18','24','30'], ans:2, exp:'4! = 4×3×2×1 = 24', bal:12 },
      { q:'P(5) = 5! = ?', opts:['60','100','120','150'], ans:2, exp:'5! = 5×4×3×2×1 = 120', bal:12 },
    ],
  },
  'Fizika': {
    'Nüvə fizikası': [
      { q:'Alfa hissəciyi nədir?', opts:['elektron','proton','helium nüvəsi (2p+2n)','neytron'], ans:2, exp:'Alfa hissəciyi = He-4 nüvəsi (2 proton + 2 neytron)', bal:12 },
      { q:'Yarılanma dövrü T₁/₂ nədir?', opts:['tam parçalanma müddəti','kütlənin yarıya enmə müddəti','atom ömrü','parçalanma sabiti'], ans:1, exp:'T₁/₂ — radioaktiv maddənin kütləsinin yarıya enmə müddəti', bal:12 },
      { q:'Beta parçalanmasında nüvədən nə ayrılır?', opts:['alfa hissəciyi','elektron (beta hissəciyi)','proton','neytron'], ans:1, exp:'Beta⁻ parçalanması: nüvədən elektron (e⁻) ayrılır', bal:12 },
    ],
    'Dalğa optikası': [
      { q:'Diffraksiyanın mənası?', opts:['işığın sınması','işığın əks olunması','işığın maneənin kənarından əyilməsi','işığın udulması'], ans:2, exp:'Diffraksiqa — işığın dalğa xassəsini sübut edən hadisə: maneənin kənarından əyilmə', bal:12 },
      { q:'İnterferensiya nədir?', opts:['işığın sınması','iki dalğanın üst-üstə düşərək bir-birini gücləndirib ya zəiflətməsi','işığın rəngə ayrılması','işığın sürəti'], ans:1, exp:'İnterferensiya — iki dalğanın superpozisiyası nəticəsində güclənmə/söndürmə', bal:12 },
    ],
  },
  'Kimya': {
    'Kimyəvi termodinamika': [
      { q:'Ekzotermik reaksiyada enerji?', opts:['udulur','xaricə ayrılır','dəyişmir','çevrilir'], ans:1, exp:'Ekzotermik: ΔH < 0 — enerji xaricə ayrılır, sistem soyuyur', bal:12 },
      { q:'Le Şatelye prinsipi nəyi bildirir?', opts:['reaksiyanın sürətini','kimyəvi tarazlığa xarici təsirə sistemin cavabını','katalizator rolunu','enerjinin saxlanmasını'], ans:1, exp:'Le Şatelye: xarici təsirə (T, P, konsentrasiya) cavab olaraq tarazlıq tarazlığı bərpa edən istiqamətə sürüşür', bal:12 },
    ],
    'Polimerlər': [
      { q:'Polietileni əmələ gətirən monomer?', opts:['etilen CH₂=CH₂','etan C₂H₆','metan CH₄','propilen CH₂=CHCH₃'], ans:0, exp:'Polietilen: n(CH₂=CH₂) → (-CH₂-CH₂-)ₙ', bal:12 },
      { q:'Polimer nədir?', opts:['kiçik molekul','çoxsaylı monomer vahidlərindən ibarət böyük molekul','atom','ion'], ans:1, exp:'Polimer — çoxlu monomer vahidlərinin ardıcıl birləşməsindən yaranan makromolekultur', bal:12 },
    ],
  },
  'Biologiya': {
    'Ekosistem': [
      { q:'Prodüsentlər qida zəncirinin neçənci həlqəsidir?', opts:['2-ci','3-cü','1-ci','4-cü'], ans:2, exp:'Prodüsentlər (bitkilər) — qida zəncirinin 1-ci həlqəsi', bal:12 },
      { q:'Biotik faktor nədir?', opts:['temperatur','yağıntı','canlıların bir-birinə göstərdiyi təsir','torpaq tipi'], ans:2, exp:'Biotik faktorlar — canlı orqanizmlərin bir-birinə göstərdiyi biologici təsir', bal:12 },
    ],
    'Hormonlar': [
      { q:'İnsulin hansı vəzidən ifraz olunur?', opts:['hipofiz','qalxanabənzər vəzi','mədəaltı vəzi (pankreas)','böyrəküstü vəzi'], ans:2, exp:'İnsulin — mədəaltı vəzinin (pankreasın) Langerhans adacıqlarından ifraz olunur', bal:12 },
    ],
  },
  'Tarix': {
    'Müasir Azərbaycan': [
      { q:'44 günlük Vətən müharibəsi nə vaxt başladı?', opts:['27 sentyabr 2019','27 sentyabr 2020','10 noyabr 2020','27 sentyabr 2021'], ans:1, exp:'44 günlük Vətən müharibəsi 27 sentyabr 2020-ci ildə başladı', bal:12 },
      { q:'BTC (Bakı-Tbilisi-Ceyhan) neft kəməri nə vaxt açıldı?', opts:['2003','2005','2006','2008'], ans:2, exp:'BTC neft kəməri 2006-cı ildə istifadəyə verildi', bal:12 },
    ],
    'Müasir dünya': [
      { q:'BMT nə vaxt yaradıldı?', opts:['1941','1945','1948','1950'], ans:1, exp:'BMT 24 oktyabr 1945-ci ildə yaradıldı', bal:12 },
      { q:'Soyuq müharibə nə vaxt başa çatdı?', opts:['1989','1991','1993','1995'], ans:1, exp:'SSRİ-nin dağılması ilə 1991-ci ildə Soyuq müharibə sona çatdı', bal:12 },
    ],
  },
  'Coğrafiya': {
    'Azərbaycan iqtisadiyyatı': [
      { q:'Azərbaycanın əsas ixracat məhsulu?', opts:['pambıq','neft və qaz','taxıl','meyvə'], ans:1, exp:'Neft və qaz — Azərbaycan ixracatının böyük hissəsini təşkil edir', bal:12 },
      { q:'SOCAR nədir?', opts:['bank','Azərbaycan Dövlət Neft Şirkəti (State Oil Company of Azerbaijan Republic)','xarici şirkət','nazirlik'], ans:1, exp:'SOCAR — Azərbaycanın dövlət neft şirkətidir', bal:12 },
    ],
    'Qloballaşma': [
      { q:'Qloballaşmanın əsas xüsusiyyəti?', opts:['ölkələrin izolyasiyası','dünya iqtisadiyyatının inteqrasiyası','milli iqtisadiyyatın güclənməsi','ticarətin azalması'], ans:1, exp:'Qloballaşma — ölkələrin iqtisadi, mədəni, siyasi inteqrasiyası prosesi', bal:12 },
    ],
  },
  'İngilis dili': {
    '3rd Conditional': [
      { q:'"If she ___ studied, she would have passed." (3rd conditional)', opts:['has','had','would','did'], ans:1, exp:'3rd conditional: If + Past Perfect (had + V3) → would have + V3', bal:12 },
      { q:'3rd conditional nə zaman işlədilir?', opts:['həqiqi gələcək şərt','hazırdakı xəyali şərt','keçmişdəki qeyri-real şərt','adət üçün'], ans:2, exp:'3rd conditional — keçmişdə baş verməmiş, qeyri-real şərt üçün', bal:12 },
    ],
    'Advanced Vocabulary': [
      { q:'"Ambiguous" nə deməkdir?', opts:['aydın','ikimənalı, qeyri-müəyyən','sadə','mürəkkəb'], ans:1, exp:'Ambiguous — iki mənalı ola bilən, qeyri-müəyyən', bal:12 },
      { q:'"Perseverance" nə deməkdir?', opts:['tənbəllik','qorxu','iradə, dözümlülük, əzmkarlıq','tərəddüd'], ans:2, exp:'Perseverance — çətinliklərə baxmayaraq dözüm, əzmkarlıq', bal:12 },
    ],
  },
  'Ədəbiyyat': {
    'Azərbaycan ədəbiyyatı (XX əsr)': [
      { q:'"Ölülər" əsərinin müəllifi?', opts:['M.Ə.Sabir','C.Məmmədquluzadə','H.Cavid','Ə.Haqverdiyev'], ans:1, exp:'"Ölülər" (1909) — C.Məmmədquluzadənin əsas pyesidir', bal:12 },
      { q:'Hüseyn Cavidin əsas janrı?', opts:['hekayə','roman','romantik dram','şeir'], ans:2, exp:'H.Cavid — romantik dramaturq: "İblis", "Şeyx Sənan", "Afət", "Topal Teymur"', bal:12 },
    ],
    'Dünya ədəbiyyatı': [
      { q:'"Romeo və Juliet" hansı janrdadır?', opts:['komediya','lirik şeir','faciə (tragediya)','roman'], ans:2, exp:'"Romeo və Juliet" — Şekspirin faciəsidir', bal:12 },
      { q:'"Müharibə və Sülh" müəllifi?', opts:['Dostoyevski','Çexov','Tolstoy','Turgenev'], ans:2, exp:'"Müharibə və Sülh" — Lev Tolstoyun epik romanıdır', bal:12 },
    ],
  },
},

/* ══════════ 11-Cİ SİNİF ══════════ */
'11': {
  'Azərbaycan dili': {
    'Dil tarixi': [
      { q:'Azərbaycan dili hansı dil ailəsinə aiddir?', opts:['Hind-Avropa','Türk (Altay/Oğuz)','Sami','Fin-Uqor'], ans:1, exp:'Azərbaycan dili — Türk dil ailəsinin Oğuz qrupuna aiddir', bal:13 },
      { q:'Orxon-Yenisey abidələri hansı yazı sistemi ilə yazılmışdır?', opts:['ərəb əlifbası','latın əlifbası','qədim türk runik yazısı','kiril əlifbası'], ans:2, exp:'Orxon-Yenisey kitabələri (VIII əsr) — qədim türk runik yazısı ilə yazılmışdır', bal:13 },
      { q:'Azərbaycanda müasir latın əlifbasına nə vaxt keçildi?', opts:['1920','1929-cu ildə (sonra 1991-dən bərpa)','1939','2001'], ans:1, exp:'Latın əlifbasına 1929-cu ildə keçildi, 1939-da kirilə, 1991-dən yenidən latına keçildi', bal:13 },
    ],
    'Dilin quruluş səviyyələri': [
      { q:'Dilin əsas quruluş səviyyələri hansılardır?', opts:['fonetik','fonetik, leksik, qrammatik','yalnız qrammatik','fonetik, leksik'], ans:1, exp:'Dilin 3 əsas səviyyəsi: fonetik (səslər), leksik (sözlər), qrammatik (morfologiya+sintaksis)', bal:13 },
      { q:'Morfem nədir?', opts:['dilin ən kiçik vahidi','dilin ən kiçik mənalı vahidi (kök, şəkilçi)','söz','cümlə'], ans:1, exp:'Morfem — dilin ən kiçik mənalı vahididir', bal:13 },
    ],
  },
  'Riyaziyyat': {
    'Kompleks ədədlər': [
      { q:'i² = ?', opts:['1','-1','i','-i'], ans:1, exp:'i — xəyali vahid: i² = -1', bal:13 },
      { q:'(2 + 3i) + (1 - 2i) = ?', opts:['3 + i','3 + 5i','1 + i','3 - i'], ans:0, exp:'(2+1) + (3-2)i = 3 + i', bal:13 },
      { q:'|3 + 4i| = ?', opts:['3','4','5','7'], ans:2, exp:'|a+bi| = √(a²+b²) = √(9+16) = √25 = 5', bal:13 },
    ],
    'Limit': [
      { q:'lim(x→0) sin(x)/x = ?', opts:['0','1','∞','-1'], ans:1, exp:'Məşhur limit: lim(x→0) sin(x)/x = 1', bal:13 },
      { q:'lim(x→∞) 1/x = ?', opts:['1','0','∞','-1'], ans:1, exp:'x sonsuzluğa getdikcə 1/x → 0', bal:13 },
      { q:'lim(x→2) (x² - 4)/(x - 2) = ?', opts:['0','2','4','∞'], ans:2, exp:'(x²-4)/(x-2) = (x-2)(x+2)/(x-2) = x+2 → 2+2 = 4', bal:13 },
    ],
    'Ehtimal': [
      { q:'Ehtimal hansı aralıqda dəyişir?', opts:['0-dan 100-ə','0-dan 50-yə','0-dan 1-ə','1-dən 100-ə'], ans:2, exp:'Ehtimal: 0 ≤ P ≤ 1', bal:13 },
      { q:'6 üzlü zarın bir atışında "3" düşmə ehtimalı?', opts:['1/3','1/4','1/6','1/2'], ans:2, exp:'P(3) = 1/6 (6 bərabər ehtimallı nəticədən biri)', bal:13 },
    ],
  },
  'Fizika': {
    'Kvant fizikası': [
      { q:'Fotoefekt nəyi sübut edir?', opts:['işığın dalğa xassəsini','işığın kvant (foton) xassəsini','elektronun kütləsini','işığın sürətini'], ans:1, exp:'Fotoefekt (Eynşteyn, 1905) — işığın foton (kvant) xassəsini sübut edir', bal:13 },
      { q:'E = hν nəyi ifadə edir?', opts:['kinetik enerji','fotonun enerjisi','potensial enerji','nüvə enerjisi'], ans:1, exp:'E = hν — fotonun enerjisi (h — Plank sabiti, ν — işığın tezliyi)', bal:13 },
    ],
    'Nisbilik nəzəriyyəsi': [
      { q:'E = mc² — kimin kəşfidir?', opts:['Nyuton','Plank','Eynşteyn','Bor'], ans:2, exp:'Albert Eynşteyn — xüsusi nisbilik nəzəriyyəsi (1905): E = mc²', bal:13 },
      { q:'E = mc² nəyi ifadə edir?', opts:['kinetik enerji','kütlə-enerji ekvivalentliyi','potensial enerji','istilik enerjisi'], ans:1, exp:'E = mc² — kütlə ilə enerjinin bir-birinə çevrilə bilən ekvivalent kəmiyyətlər olduğunu göstərir', bal:13 },
    ],
  },
  'Kimya': {
    'Analitik kimya': [
      { q:'pH = 7 nə deməkdir?', opts:['turş mühit','neytral mühit','qələvi mühit','güclü turşu'], ans:1, exp:'pH = 7 — neytral mühit; pH < 7 — turş; pH > 7 — qələvi', bal:13 },
      { q:'Titrimetrik analiz nədir?', opts:['rəng reaksiyası','dəqiq konsentrasiya təyini üsulu','çökmə','kristallaşma'], ans:1, exp:'Titrimetrik analiz — tam reaksiya üçün lazım olan reagentin dəqiq miqdarını tapmaq', bal:13 },
    ],
    'Ali polimerlər': [
      { q:'Nylon (kapron) hansı növ polimerdir?', opts:['polisaxarid','poliamid','poliolefin','polimer-duz'], ans:1, exp:'Nylon — sintetik poliamid lifidir', bal:13 },
    ],
  },
  'Biologiya': {
    'Biotexnologiya': [
      { q:'CRISPR-Cas9 nədir?', opts:['xəstəlik','gen redaktə aləti','protein','ferment'], ans:1, exp:'CRISPR-Cas9 — DNT-ni dəqiq "kəsib-yapışdırmaq" üçün molekular gen redaktə sistemi', bal:13 },
      { q:'PCR nə üçün istifadə olunur?', opts:['zülal sintezi','DNT fragmentini çoxaltmaq','hüceyrə bölünməsi','fotosintez'], ans:1, exp:'PCR — Polimeraz Zəncir Reaksiyası, DNT-nin in vitro çoxaldılması üçün', bal:13 },
    ],
    'İrsi xəstəliklər': [
      { q:'Daun sindromu nəyin nəticəsidir?', opts:['virus infeksiyası','21-ci xromosomun trisomiyası (3 nüsxə)','mutasiya','allergiya'], ans:1, exp:'Daun sindromu — 21-ci xromosomun 3 nüsxəsi (trisomiya 21) nəticəsindədir', bal:13 },
    ],
  },
  'Tarix': {
    'Müasir Azərbaycan siyasəti': [
      { q:'Heydər Əliyev neçənci ildə prezident seçildi?', opts:['1990','1993','1995','1998'], ans:1, exp:'H.Əliyev 1993-cü ildə prezident seçildi', bal:13 },
      { q:'2018-ci ildə Xəzər dənizi ilə bağlı hansı sənəd imzalandı?', opts:['Neft müqaviləsi','Xəzər dənizinin hüquqi statusu haqqında Konvensiya','Hərbi saziş','Mədəniyyət müqaviləsi'], ans:1, exp:'2018-ci ildə Aktau şəhərində Xəzər Konvensiyası imzalandı', bal:13 },
    ],
    'Müasir dünya siyasəti': [
      { q:'NATO nə vaxt yaradıldı?', opts:['1945','1947','1949','1955'], ans:2, exp:'NATO — 4 aprel 1949-cu ildə Vaşinqton müqaviləsi ilə yaradıldı', bal:13 },
      { q:'Avropa Birliyini rəsmi olaraq quran sənəd?', opts:['1957 Roma müqaviləsi','1992 Maastrixt müqaviləsi','1945 Yalta konfransı','1975 Helsinki Aktı'], ans:1, exp:'Maastrixt müqaviləsi (1992) — Avropa Birliyini rəsmi olaraq yaratdı', bal:13 },
    ],
  },
  'Coğrafiya': {
    'Azərbaycanda kənd təsərrüfatı': [
      { q:'Azərbaycanda ən geniş yayılmış taxıl bitkisi?', opts:['çəltik','buğda','arpa','qarğıdalı'], ans:1, exp:'Buğda — Azərbaycanda ən geniş əkin sahəsini tutan taxıl bitkisidir', bal:13 },
      { q:'Lənkəran-Astara zonası hansı məhsullarla məşhurdur?', opts:['taxıl, pambıq','çay, sitrus meyvələri','neft, qaz','meşə məhsulları'], ans:1, exp:'Lənkəran-Astara — subtropik iqlim, çay bağçılığı, limon, portağal', bal:13 },
    ],
    'Geosiyasət': [
      { q:'Azərbaycanın üzv olduğu əsas beynəlxalq təşkilatlar?', opts:['NATO, AB','MDB, İslam Əməkdaşlığı Təşkilatı, ATƏT, BMT','BRICS, ASEAN','NATO, BRICS'], ans:1, exp:'Azərbaycan: MDB, İƏT, ATƏT, BMT, GUAM üzvüdür', bal:13 },
    ],
  },
  'İngilis dili': {
    'Academic Writing': [
      { q:'Akademik inşanın quruluşu?', opts:['giriş, nəticə','giriş, əsas hissə, nəticə','yalnız əsas hissə','xülasə, analiz'], ans:1, exp:'Klassik akademik inşa: giriş (tezis) + əsas hissə (arqumentlər) + nəticə', bal:13 },
      { q:'"Nevertheless" nə mənada işlədilir?', opts:['əlavə etmək','nümunə vermək','buna baxmayaraq (ziddiyyət)','nəticə çıxarmaq'], ans:2, exp:'"Nevertheless" — "buna baxmayaraq" mənasında ziddiyyət bildirən bağlayıcı', bal:13 },
      { q:'"Furthermore" nə mənada işlədilir?', opts:['ziddiyyət','üstəlik, bundan əlavə','nəticə çıxarmaq','sual'], ans:1, exp:'"Furthermore" — "bundan əlavə, üstəlik" mənasında əlavə məlumat bildirir', bal:13 },
    ],
    'Advanced Vocabulary': [
      { q:'"Ubiquitous" nə deməkdir?', opts:['nadir','hər yerdə mövcud olan','qədim','müvəqqəti'], ans:1, exp:'Ubiquitous — hər yerdə olan, geniş yayılmış', bal:13 },
      { q:'"Ephemeral" nə deməkdir?', opts:['əbədi','güclü','keçici, qısamüddətli','zəruri'], ans:2, exp:'Ephemeral — keçici, qısa müddətli, ötəri', bal:13 },
    ],
  },
  'Ədəbiyyat': {
    'Ədəbi cərəyanlar': [
      { q:'Realizm cərəyanı nə vaxt formalaşdı?', opts:['XVII əsr','XVIII əsr','XIX əsr','XX əsr'], ans:2, exp:'Realizm — XIX əsrdə Avropada formalaşdı', bal:13 },
      { q:'Romantizmin əsas xüsusiyyəti?', opts:['reallığa tam sadiqlik','ideal, güclü şəxsiyyətin, azadlığın tərənnümü','gündəlik həyat təsviri','siyasi satira'], ans:1, exp:'Romantizm: ideal, güclü qəhrəman, azadlıq, coşqun hisslər', bal:13 },
      { q:'Simvolizm cərəyanında nəyə üstünlük verilir?', opts:['realist hadisə','simvol, işarə, gizli məna','gündəlik həyat','siyasət'], ans:1, exp:'Simvolizm — simvollar, obrazlar vasitəsilə dərin, gizli mənalar çatdırır', bal:13 },
    ],
    'Azərbaycan müasir ədəbiyyatı': [
      { q:'"Dəli Kür" romanının müəllifi?', opts:['İlyas Əfəndiyev','İsmayıl Şıxlı','Anar','Elçin'], ans:1, exp:'"Dəli Kür" (1968) — İsmayıl Şıxlının tarixi romanıdır', bal:13 },
      { q:'Seyid Əzim Şirvani hansı ədəbi dövrə aiddir?', opts:['XVIII əsr','XIX əsr','XX əsr','XXI əsr'], ans:1, exp:'S.Ə.Şirvani (1835-1888) — XIX əsr Azərbaycan şairidir', bal:13 },
    ],
  },
},

}; /* QBANK_BY_GRADE sonu */

/* ── Köməkçi funksiyalar ── */
function getQBankForGrade(grade) {
  return QBANK_BY_GRADE[String(grade)] || {};
}

const TOPICS = new Proxy({}, {
  get(_, subject) {
    const g = (typeof ST !== 'undefined' && ST.grade) ? ST.grade : '9';
    return Object.keys(getQBankForGrade(g)[subject] || {});
  }
});

const QBANK = new Proxy({}, {
  get(_, subject) {
    const g = (typeof ST !== 'undefined' && ST.grade) ? ST.grade : '9';
    return getQBankForGrade(g)[subject] || {};
  }
});