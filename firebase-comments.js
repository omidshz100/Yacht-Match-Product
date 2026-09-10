(async function () {
  const [{ initializeApp }, firestore] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js')
  ]);

  const {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
  } = firestore;

  const firebaseConfig = {
    apiKey: 'AIzaSyA8jAWCwAkdBISpIfOlt-w7qEF0fp_jwis',
    authDomain: 'yacht-match-product.firebaseapp.com',
    projectId: 'yacht-match-product',
    storageBucket: 'yacht-match-product.firebasestorage.app',
    messagingSenderId: '276668315706',
    appId: '1:276668315706:web:bbaad4de5071e15cc2dd03'
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  function lang() {
    return window.currentLang || document.documentElement.lang || 'en';
  }

  function labels() {
    const l = lang();
    if (l === 'fa') {
      return {
        empty: 'هنوز نظری ثبت نشده است.',
        loading: 'در حال بارگذاری کامنت‌ها…',
        failed: 'اتصال به کامنت‌های مشترک برقرار نشد.',
        posting: 'در حال ارسال…',
        error: 'ارسال کامنت انجام نشد. لطفاً Firestore و Rules را بررسی کنید.',
        name: 'عضو تیم',
        handle: '@team'
      };
    }
    if (l === 'it') {
      return {
        empty: 'Nessun commento ancora.',
        loading: 'Caricamento commenti…',
        failed: 'Impossibile connettersi ai commenti condivisi.',
        posting: 'Invio…',
        error: 'Impossibile pubblicare il commento. Controlla Firestore e le regole.',
        name: 'Team member',
        handle: '@team'
      };
    }
    return {
      empty: 'No comments yet.',
      loading: 'Loading comments…',
      failed: 'Could not connect to shared comments.',
      posting: 'Posting…',
      error: 'Could not post the comment. Please check Firestore and its rules.',
      name: 'Team member',
      handle: '@team'
    };
  }

  function sectionIdFor(box) {
    if (box.dataset.sectionId) return box.dataset.sectionId;
    const section = box.closest('section');
    const id = section?.id || `section-${box.dataset.sectionIndex || 'unknown'}`;
    box.dataset.sectionId = id;
    return id;
  }

  window.postSocialComment = async function (box) {
    const input = box.querySelector('.social-input');
    const text = input?.value.trim();
    if (!text) return;

    const button = box.querySelector('.social-post');
    const original = button.textContent;
    const l = labels();
    button.disabled = true;
    button.textContent = l.posting;

    try {
      await addDoc(collection(db, 'comments'), {
        sectionId: sectionIdFor(box),
        text,
        author: 'Team member',
        language: lang(),
        createdAt: serverTimestamp()
      });
      input.value = '';
    } catch (error) {
      console.error('Firebase comment error:', error);
      alert(labels().error);
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  };

  window.renderSocialThread = function (box) {
    const thread = box.querySelector('.social-thread');
    if (!thread) return;
    thread.innerHTML = `<div class="social-empty">${labels().loading}</div>`;

    if (box._firebaseUnsubscribe) {
      box._firebaseUnsubscribe();
      box._firebaseUnsubscribe = null;
    }

    const q = query(
      collection(db, 'comments'),
      where('sectionId', '==', sectionIdFor(box))
    );

    box._firebaseUnsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ts: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
        };
      }).sort((a, b) => (b.ts || 0) - (a.ts || 0));

      const l = labels();
      if (!items.length) {
        thread.innerHTML = `<div class="social-empty">${l.empty}</div>`;
        return;
      }

      thread.innerHTML = items.map(item => {
        const d = new Date(item.ts || Date.now());
        const locale = lang() === 'fa' ? 'fa-IR' : lang() === 'it' ? 'it-IT' : 'en-GB';
        const time = d.toLocaleString(locale, {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        const safe = String(item.text || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `
          <div class="social-post-item">
            <div class="social-avatar">T</div>
            <div class="social-post-content">
              <div class="social-meta">
                <span class="social-name">${l.name}</span>
                <span class="social-handle">${l.handle}</span>
                <span class="social-time">· ${time}</span>
              </div>
              <div class="social-text">${safe}</div>
            </div>
          </div>`;
      }).join('');
    }, error => {
      console.error('Firestore subscription error:', error);
      thread.innerHTML = `<div class="social-empty">${labels().failed}</div>`;
    });
  };

  // Switch existing local/demo comment boxes to Firestore immediately.
  document.querySelectorAll('.social-comments').forEach(box => {
    sectionIdFor(box);
    window.renderSocialThread(box);
  });

  console.info('Yacht Match comments are connected to Firebase Firestore.');
})();
