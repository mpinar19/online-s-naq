/* ═══════════════════════════════════════════════════
   firebase.js — Firebase Realtime Database inteqrasiyası
   
   QURAŞDIRMA:
   1. https://console.firebase.google.com — yeni layihə yarat
   2. "Realtime Database" → "Qaydalar" → test mode seç
   3. "Layihə parametrləri" → firebaseConfig dəyərlərini aşağıya kopyala
   ═══════════════════════════════════════════════════ */

const FIREBASE_CONFIG = {
  apiKey:            "BURAYA_API_KEY",
  authDomain:        "BURAYA_AUTH_DOMAIN",
  databaseURL:       "BURAYA_DATABASE_URL",
  projectId:         "BURAYA_PROJECT_ID",
  storageBucket:     "BURAYA_STORAGE_BUCKET",
  messagingSenderId: "BURAYA_MESSAGING_ID",
  appId:             "BURAYA_APP_ID"
};

/* ── Firebase konfiqurasiyanın doldurulub-doldurulmadığını yoxla ── */
const FB_READY = FIREBASE_CONFIG.apiKey !== "BURAYA_API_KEY";

let _db = null;

async function initFirebase() {
  if (!FB_READY) {
    console.log('Firebase konfiqurasyonu doldurulmayıb — lokal rejim aktiv');
    return false;
  }
  try {
    // Firebase SDK CDN-dən yüklənir (index.html-də)
    firebase.initializeApp(FIREBASE_CONFIG);
    _db = firebase.database();
    console.log('Firebase bağlandı ✓');
    return true;
  } catch(e) {
    console.warn('Firebase xətası:', e.message);
    return false;
  }
}

/* ── Universal oxuma/yazma — Firebase varsa buluda, yoxdursa localStorage ── */
const DB = {
  async get(path) {
    if (_db) {
      const snap = await _db.ref(path).get();
      return snap.exists() ? snap.val() : null;
    }
    return JSON.parse(localStorage.getItem('az_' + path.replace(/\//g,'_')) || 'null');
  },

  async set(path, val) {
    if (_db) {
      await _db.ref(path).set(val);
      return;
    }
    localStorage.setItem('az_' + path.replace(/\//g,'_'), JSON.stringify(val));
  },

  async update(path, val) {
    if (_db) {
      await _db.ref(path).update(val);
      return;
    }
    const cur = await this.get(path) || {};
    localStorage.setItem('az_' + path.replace(/\//g,'_'), JSON.stringify({...cur, ...val}));
  },

  async push(path, val) {
    if (_db) {
      const ref = await _db.ref(path).push(val);
      return ref.key;
    }
    const cur = await this.get(path) || {};
    const key = 'loc_' + Date.now();
    cur[key] = val;
    localStorage.setItem('az_' + path.replace(/\//g,'_'), JSON.stringify(cur));
    return key;
  },

  async delete(path) {
    if (_db) {
      await _db.ref(path).remove();
      return;
    }
    localStorage.removeItem('az_' + path.replace(/\//g,'_'));
  },

  onValue(path, callback) {
    if (_db) {
      _db.ref(path).on('value', snap => callback(snap.exists() ? snap.val() : null));
      return;
    }
    // localStorage üçün real-time yoxdur, yalnız bir dəfə oxu
    callback(JSON.parse(localStorage.getItem('az_' + path.replace(/\//g,'_')) || 'null'));
  }
};

/* ── İstifadəçi əməliyyatları ── */
const FBUsers = {
  async getAll() {
    const data = await DB.get('users');
    return data || {};
  },

  async get(username) {
    const data = await DB.get('users/' + username);
    return data;
  },

  async save(username, userData) {
    await DB.set('users/' + username, userData);
  },

  async saveAll(users) {
    await DB.set('users', users);
  },

  async delete(username) {
    await DB.delete('users/' + username);
  },

  async addHistory(username, entry) {
    const user = await this.get(username);
    if (!user) return;
    if (!user.history) user.history = [];
    user.history.unshift(entry);
    if (user.history.length > 30) user.history.length = 30;
    await this.save(username, user);
  }
};

/* ── Ödev əməliyyatları ── */
const FBHomework = {
  async create(hw) {
    return await DB.push('homework', { ...hw, createdAt: Date.now() });
  },

  async getAll() {
    return await DB.get('homework') || {};
  },

  async complete(hwId, username, result) {
    await DB.set(`homework_results/${hwId}/${username}`, { ...result, completedAt: Date.now() });
  },

  async getResults(hwId) {
    return await DB.get('homework_results/' + hwId) || {};
  },

  async delete(hwId) {
    await DB.delete('homework/' + hwId);
    await DB.delete('homework_results/' + hwId);
  }
};