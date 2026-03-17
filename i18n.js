/* ═══════════════════════════════════════════
   i18n.js — İnterfeys tərcümələri
   Dillər: az (Azərbaycan), ru (Русский), en (English)
   ═══════════════════════════════════════════ */

const LANG_NAMES = { az: 'AZ', ru: 'RU', en: 'EN' };

const T = {
  az: {
    /* AUTH */
    appName:        'Məktəb Sınaği',
    appSub:         '700 ballıq sistem',
    login:          'Giriş',
    register:       'Qeydiyyat',
    username:       'İstifadəçi adı',
    password:       'Şifrə',
    fullname:       'Ad Soyad',
    grade:          'Sinif',
    selectGrade:    'Sinif seçin...',
    enterUsername:  'İstifadəçi adınızı daxil edin',
    enterPassword:  'Şifrənizi daxil edin',
    enterName:      'Adınızı daxil edin',
    chooseUsername: 'İstifadəçi adı seçin',
    createPassword: 'Şifrə yaradın (min. 4 simvol)',
    signIn:         'Daxil ol',
    signUp:         'Qeydiyyatdan keç',
    noAccount:      'Hesabınız yoxdur?',
    hasAccount:     'Hesabınız var?',
    registerLink:   'Qeydiyyatdan keçin',
    loginLink:      'Daxil olun',
    errFill:        'Bütün xanaları doldurun.',
    errWrongCreds:  'İstifadəçi adı və ya şifrə yanlışdır.',
    errPassShort:   'Şifrə ən az 4 simvol olmalıdır.',
    errUserExists:  'Bu istifadəçi adı artıq mövcuddur.',

    /* HEADER */
    gradeLabel:     '-ci sinif',
    history:        'Nəticələrim',
    logout:         'Çıxış',
    themeToggle:    'Tema',

    /* HOME */
    step1:          'Sinif seçin',
    step2:          'Sınaq növü',
    step3:          'Fən seçin',
    step4:          'Mövzu seçin',
    allMixed:       'Bütün fənlər (qarışıq)',
    allMixedDesc:   'Real imtahan kimi — hər fəndən uyğun sual sayı',
    bySubject:      'Fənn üzrə sınaq',
    bySubjectDesc:  'Seçdiyiniz fəndən suallar',
    allTopics:      'Bütün mövzular',
    startBtn:       'Sınaqa başla',
    totalQ:         'Cəmi',
    questions:      'sual',
    subject:        'Fən',
    topic:          'Mövzu',
    time:           'Vaxt',
    timePerQ:       'hər suala ~90 san',
    minutes:        'dəqiqə',

    /* QUIZ */
    exitBtn:        '✕ Çıx',
    questionOf:     'Sual',
    of:             '/',
    answered:       'cavablandı',
    finishExam:     'İmtahanı bitir',
    finishConfirm:  'İmtahanı bitirmək istəyirsiniz?',
    finishNow:      'İmtahanı bitir və yoxla',
    allAnswered:    'Bütün sualları cavabladınız!',
    unanswered:     'sual hələ cavabsız.',
    easy:           'Asan',
    medium:         'Orta',
    hard:           'Çətin',
    bal:            'bal',
    prev:           '← Əvvəlki',
    next:           'Növbəti →',

    /* EXIT MODAL */
    stopExam:       'Sınaqi dayandır?',
    stopDesc:       'İrəliləyişiniz silinəcək. Davam etmək istəyirsiniz?',
    goBack:         'Geri qayıt',
    yesExit:        'Bəli, çıx',

    /* RESULT */
    excellent:      'Əla nəticə!',
    good:           'Yaxşı cəhd!',
    average:        'Orta səviyyə',
    poor:           'Daha çox məşq lazımdır',
    correct:        'Doğru',
    wrong:          'Yanlış',
    percent:        'Faiz',
    rawScore:       'xam bal',
    newExam:        'Yeni sınaq',

    /* RESULT TABS */
    tabResult:      'Nəticə',
    tabErrors:      'Səhvlərin izahı',
    tabAll:         'Bütün suallar',
    tabAI:          '🤖 Yeni suallar',

    /* REVIEW */
    noErrors:       'Bütün sualları düzgün cavabladınız!',
    errorsFound:    'səhv cavab — aşağıda izahat',
    yourAnswer:     'Sizin cavab',
    correctAnswer:  'Doğru cavab',
    unansweredLbl:  'Cavabsız',

    /* HISTORY */
    histTitle:      'Nəticə tarixi',
    noHistory:      'Hələ sınaq götürməmisiniz.',

    /* AI GEN */
    aiTitle:        'PDF-dən yeni suallar yarat',
    aiDesc:         'PDF faylınızı yükləyin — AI sualları oxuyub yeni suallar yaradacaq',
    uploadStep:     'PDF faylı seçin',
    uploadClick:    'PDF faylı seçmək üçün klikləyin',
    uploadHint:     'Sualların olduğu PDF faylı yükləyin',
    paramsStep:     'Parametrlər',
    qCount:         'Sual sayı',
    difficulty:     'Çətinlik',
    language:       'Dil',
    diffMixed:      'Qarışıq',
    diffEasy:       'Asan',
    diffMed:        'Orta',
    diffHard:       'Çətin',
    langAz:         'Azərbaycan',
    langRu:         'Rus',
    langEn:         'İngilis',
    generateBtn:    'Suallar yarat',
    generating:     'Suallar yaradılır...',
    startGenQuiz:   'Sınaq kimi başla',
    reupload:       'Yenidən yüklə',
    createdQ:       'yeni sual yaradıldı',
    translating:    'Suallar tərcümə edilir...',
    noQFound:       'Sual tapılmadı!',
  },

  ru: {
    /* AUTH */
    appName:        'Школьный Тест',
    appSub:         'Система 700 баллов',
    login:          'Вход',
    register:       'Регистрация',
    username:       'Имя пользователя',
    password:       'Пароль',
    fullname:       'Имя и Фамилия',
    grade:          'Класс',
    selectGrade:    'Выберите класс...',
    enterUsername:  'Введите имя пользователя',
    enterPassword:  'Введите пароль',
    enterName:      'Введите ваше имя',
    chooseUsername: 'Выберите имя пользователя',
    createPassword: 'Создайте пароль (мин. 4 символа)',
    signIn:         'Войти',
    signUp:         'Зарегистрироваться',
    noAccount:      'Нет аккаунта?',
    hasAccount:     'Уже есть аккаунт?',
    registerLink:   'Зарегистрируйтесь',
    loginLink:      'Войти',
    errFill:        'Заполните все поля.',
    errWrongCreds:  'Неверное имя пользователя или пароль.',
    errPassShort:   'Пароль должен содержать не менее 4 символов.',
    errUserExists:  'Это имя пользователя уже занято.',

    /* HEADER */
    gradeLabel:     ' класс',
    history:        'Мои результаты',
    logout:         'Выйти',
    themeToggle:    'Тема',

    /* HOME */
    step1:          'Выберите класс',
    step2:          'Тип теста',
    step3:          'Выберите предмет',
    step4:          'Выберите тему',
    allMixed:       'Все предметы (смешанный)',
    allMixedDesc:   'Как реальный экзамен — нужное количество из каждого предмета',
    bySubject:      'Тест по предмету',
    bySubjectDesc:  'Вопросы по выбранному предмету',
    allTopics:      'Все темы',
    startBtn:       'Начать тест',
    totalQ:         'Итого',
    questions:      'вопросов',
    subject:        'Предмет',
    topic:          'Тема',
    time:           'Время',
    timePerQ:       '~90 сек на вопрос',
    minutes:        'мин',

    /* QUIZ */
    exitBtn:        '✕ Выйти',
    questionOf:     'Вопрос',
    of:             '/',
    answered:       'отвечено',
    finishExam:     'Завершить тест',
    finishConfirm:  'Завершить тест?',
    finishNow:      'Завершить и проверить',
    allAnswered:    'Вы ответили на все вопросы!',
    unanswered:     'вопросов без ответа.',
    easy:           'Лёгкий',
    medium:         'Средний',
    hard:           'Сложный',
    bal:            'балл',
    prev:           '← Назад',
    next:           'Вперёд →',

    /* EXIT MODAL */
    stopExam:       'Остановить тест?',
    stopDesc:       'Ваш прогресс будет потерян. Продолжить?',
    goBack:         'Вернуться',
    yesExit:        'Да, выйти',

    /* RESULT */
    excellent:      'Отличный результат!',
    good:           'Хорошая попытка!',
    average:        'Средний уровень',
    poor:           'Нужно больше практики',
    correct:        'Правильно',
    wrong:          'Неверно',
    percent:        'Процент',
    rawScore:       'сырой балл',
    newExam:        'Новый тест',

    /* RESULT TABS */
    tabResult:      'Результат',
    tabErrors:      'Анализ ошибок',
    tabAll:         'Все вопросы',
    tabAI:          '🤖 Новые вопросы',

    /* REVIEW */
    noErrors:       'Вы ответили на все вопросы правильно!',
    errorsFound:    'ошибок — объяснения ниже',
    yourAnswer:     'Ваш ответ',
    correctAnswer:  'Правильный ответ',
    unansweredLbl:  'Без ответа',

    /* HISTORY */
    histTitle:      'История результатов',
    noHistory:      'Вы ещё не проходили тест.',

    /* AI GEN */
    aiTitle:        'Создать вопросы из PDF',
    aiDesc:         'Загрузите PDF — AI прочитает вопросы и создаст новые',
    uploadStep:     'Выберите PDF файл',
    uploadClick:    'Нажмите для выбора PDF',
    uploadHint:     'Загрузите PDF файл с вопросами',
    paramsStep:     'Параметры',
    qCount:         'Количество вопросов',
    difficulty:     'Сложность',
    language:       'Язык',
    diffMixed:      'Смешанный',
    diffEasy:       'Лёгкий',
    diffMed:        'Средний',
    diffHard:       'Сложный',
    langAz:         'Азербайджанский',
    langRu:         'Русский',
    langEn:         'Английский',
    generateBtn:    'Создать вопросы',
    generating:     'Создаём вопросы...',
    startGenQuiz:   'Начать тест',
    reupload:       'Загрузить снова',
    createdQ:       'новых вопросов создано',
    translating:    'Переводим вопросы...',
    noQFound:       'Вопросов не найдено!',
  },

  en: {
    /* AUTH */
    appName:        'School Exam',
    appSub:         '700-point system',
    login:          'Login',
    register:       'Register',
    username:       'Username',
    password:       'Password',
    fullname:       'Full Name',
    grade:          'Grade',
    selectGrade:    'Select grade...',
    enterUsername:  'Enter your username',
    enterPassword:  'Enter your password',
    enterName:      'Enter your name',
    chooseUsername: 'Choose a username',
    createPassword: 'Create password (min. 4 chars)',
    signIn:         'Sign In',
    signUp:         'Create Account',
    noAccount:      "Don't have an account?",
    hasAccount:     'Already have an account?',
    registerLink:   'Register',
    loginLink:      'Sign in',
    errFill:        'Please fill in all fields.',
    errWrongCreds:  'Incorrect username or password.',
    errPassShort:   'Password must be at least 4 characters.',
    errUserExists:  'This username is already taken.',

    /* HEADER */
    gradeLabel:     'th grade',
    history:        'My Results',
    logout:         'Logout',
    themeToggle:    'Theme',

    /* HOME */
    step1:          'Select Grade',
    step2:          'Exam Type',
    step3:          'Select Subject',
    step4:          'Select Topic',
    allMixed:       'All Subjects (Mixed)',
    allMixedDesc:   'Like a real exam — correct number from each subject',
    bySubject:      'Subject Exam',
    bySubjectDesc:  'Questions from selected subject',
    allTopics:      'All Topics',
    startBtn:       'Start Exam',
    totalQ:         'Total',
    questions:      'questions',
    subject:        'Subject',
    topic:          'Topic',
    time:           'Time',
    timePerQ:       '~90 sec per question',
    minutes:        'min',

    /* QUIZ */
    exitBtn:        '✕ Exit',
    questionOf:     'Question',
    of:             '/',
    answered:       'answered',
    finishExam:     'Finish Exam',
    finishConfirm:  'Finish the exam?',
    finishNow:      'Finish & Review',
    allAnswered:    'You answered all questions!',
    unanswered:     'questions unanswered.',
    easy:           'Easy',
    medium:         'Medium',
    hard:           'Hard',
    bal:            'pts',
    prev:           '← Previous',
    next:           'Next →',

    /* EXIT MODAL */
    stopExam:       'Stop the exam?',
    stopDesc:       'Your progress will be lost. Continue?',
    goBack:         'Go Back',
    yesExit:        'Yes, Exit',

    /* RESULT */
    excellent:      'Excellent result!',
    good:           'Good effort!',
    average:        'Average level',
    poor:           'More practice needed',
    correct:        'Correct',
    wrong:          'Wrong',
    percent:        'Percent',
    rawScore:       'raw score',
    newExam:        'New Exam',

    /* RESULT TABS */
    tabResult:      'Result',
    tabErrors:      'Error Analysis',
    tabAll:         'All Questions',
    tabAI:          '🤖 New Questions',

    /* REVIEW */
    noErrors:       'You answered all questions correctly!',
    errorsFound:    'errors — explanations below',
    yourAnswer:     'Your answer',
    correctAnswer:  'Correct answer',
    unansweredLbl:  'Unanswered',

    /* HISTORY */
    histTitle:      'Result History',
    noHistory:      'You have not taken any exams yet.',

    /* AI GEN */
    aiTitle:        'Generate Questions from PDF',
    aiDesc:         'Upload a PDF — AI will read it and create new questions',
    uploadStep:     'Select PDF file',
    uploadClick:    'Click to select a PDF file',
    uploadHint:     'Upload a PDF file with questions',
    paramsStep:     'Parameters',
    qCount:         'Question count',
    difficulty:     'Difficulty',
    language:       'Language',
    diffMixed:      'Mixed',
    diffEasy:       'Easy',
    diffMed:        'Medium',
    diffHard:       'Hard',
    langAz:         'Azerbaijani',
    langRu:         'Russian',
    langEn:         'English',
    generateBtn:    'Generate Questions',
    generating:     'Generating questions...',
    startGenQuiz:   'Start as Exam',
    reupload:       'Upload Again',
    createdQ:       'new questions created',
    translating:    'Translating questions...',
    noQFound:       'No questions found!',
  },
};

/* Aktiv dil */
let LANG = localStorage.getItem('az_lang') || 'az';

function t(key) {
  return (T[LANG] && T[LANG][key]) || T['az'][key] || key;
}

function setLang(lang) {
  LANG = lang;
  localStorage.setItem('az_lang', lang);
  // Dil dəyişdikdə ana səhifəni yenilə (type-grid, allTopics chip)
  applyTranslations();
  // Type grid varsa yenilə
  if (typeof buildExamTypes === 'function' && document.getElementById('type-section') &&
      document.getElementById('type-section').style.display !== 'none') {
    buildExamTypes();
  }
  // allTopics chip
  document.querySelectorAll('.chip').forEach(c => {
    if (c._isAllTopics) c.textContent = t('allTopics');
  });
}

/* Bütün [data-t] elementlərini yenilə */
function applyTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const attr = el.getAttribute('data-t-attr');
    if (attr) {
      el.setAttribute(attr, t(key));
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-t-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-t-html'));
  });
  // Dil düymələrini yenilə
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === LANG);
  });
}