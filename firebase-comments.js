(async function () {
  const [{ initializeApp }, firestore] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js')
  ]);

  const { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } = firestore;

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

  function getLang() {
    return document.documentElement.lang || 'en';
  }

  function labels() {
    const l = getLang();
    if (l === 'fa') return {
      empty:'هنوز نظری ثبت نشده است.', loading:'در حال بارگذاری کامنت‌ها…', failed:'اتصال به کامنت‌های مشترک برقرار نشد.', posting:'در حال ارسال…', error:'ارسال کامنت انجام نشد. لطفاً Firestore و Rules را بررسی کنید.', name:'عضو تیم'
    };
    if (l === 'it') return {
      empty:'Nessun commento ancora.', loading:'Caricamento commenti…', failed:'Impossibile connettersi ai commenti condivisi.', posting:'Invio…', error:'Impossibile pubblicare il commento. Controlla Firestore e le regole.', name:'Team member'
    };
    return {
      empty:'No comments yet.', loading:'Loading comments…', failed:'Could not connect to shared comments.', posting:'Posting…', error:'Could not post the comment. Please check Firestore and its rules.', name:'Team member'
    };
  }

  function sectionIdFor(box) {
    const section = box.closest('section');
    return section?.id || `section-${box.dataset.i || 'unknown'}`;
  }

  window.post = async function (box) {
    const input = box.querySelector('.cinput');
    const text = input?.value.trim();
    if (!text) return;

    const button = box.querySelector('.cbtn');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = labels().posting;

    try {
      await addDoc(collection(db, 'comments'), {
        sectionId: sectionIdFor(box),
        text,
        author: 'Team member',
        language: getLang(),
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

  window.render = function (box) {
    const thread = box.querySelector('.thread');
    if (!thread) return;
    thread.innerHTML = `<div class="empty">${labels().loading}</div>`;

    if (box._firebaseUnsubscribe) box._firebaseUnsubscribe();

    const q = query(collection(db, 'comments'), where('sectionId', '==', sectionIdFor(box)));

    box._firebaseUnsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ts: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0
        };
      }).sort((a,b) => (b.ts || 0) - (a.ts || 0));

      const l = labels();
      if (!items.length) {
        thread.innerHTML = `<div class="empty">${l.empty}</div>`;
        return;
      }

      const locale = getLang() === 'fa' ? 'fa-IR' : getLang() === 'it' ? 'it-IT' : 'en-GB';
      thread.innerHTML = items.map(item => {
        const safe = String(item.text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const time = item.ts ? new Date(item.ts).toLocaleString(locale,{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
        return `<div class="postitem"><div class="avatar">T</div><div><div class="meta"><strong>${l.name}</strong>${time ? ' · '+time : ''}</div><div>${safe}</div></div></div>`;
      }).join('');
    }, error => {
      console.error('Firestore subscription error:', error);
      thread.innerHTML = `<div class="empty">${labels().failed}</div>`;
    });
  };

  // Rebind the already-rendered comment buttons to Firebase and subscribe each section.
  document.querySelectorAll('.comments').forEach(box => {
    const button = box.querySelector('.cbtn');
    if (button) button.onclick = () => window.post(box);
    window.render(box);
  });

  // When the language changes, the existing page calls render(box); since window.render
  // now points here, Firestore threads remain live and translated.
  console.info('Yacht Match shared comments connected to Firebase Firestore.');
})();
