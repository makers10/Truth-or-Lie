// ── Tab switching ──────────────────────────────────────
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.form;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
    clearErrors();
  });
});

// ── Password visibility toggle ─────────────────────────
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── Password strength ──────────────────────────────────
document.getElementById('signup-pass')?.addEventListener('input', function () {
  const val = this.value;
  const fill = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');

  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%',   color: 'transparent', text: '' },
    { pct: '25%',  color: '#ef4444',     text: 'Weak' },
    { pct: '50%',  color: '#f59e0b',     text: 'Fair' },
    { pct: '75%',  color: '#3b82f6',     text: 'Good' },
    { pct: '100%', color: '#a855f7',     text: 'Strong' },
  ];

  fill.style.width      = levels[score].pct;
  fill.style.background = levels[score].color;
  label.textContent     = levels[score].text;
  label.style.color     = levels[score].color;
});

// ── Validation helpers ─────────────────────────────────
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
}

function markError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add('error');
  setError(errId, msg);
}

// ── Login submit ───────────────────────────────────────
document.getElementById('login').addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  let valid   = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    markError('login-email', 'login-email-err', 'Enter a valid email address.');
    valid = false;
  }
  if (pass.length < 6) {
    markError('login-pass', 'login-pass-err', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (valid) {
    // Simulate login → redirect to app
    simulateLoading(this, () => {
      sessionStorage.setItem('tf_authed', '1');
      window.location.href = 'index.html';
    });
  }
});

// ── Signup submit ──────────────────────────────────────
document.getElementById('signup').addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const name    = document.getElementById('signup-name').value.trim();
  const email   = document.getElementById('signup-email').value.trim();
  const pass    = document.getElementById('signup-pass').value;
  const confirm = document.getElementById('signup-confirm').value;
  const terms   = document.getElementById('terms').checked;
  let valid     = true;

  if (name.length < 3) {
    markError('signup-name', 'signup-name-err', 'Username must be at least 3 characters.');
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    markError('signup-email', 'signup-email-err', 'Enter a valid email address.');
    valid = false;
  }
  if (pass.length < 8) {
    markError('signup-pass', 'signup-pass-err', 'Password must be at least 8 characters.');
    valid = false;
  }
  if (pass !== confirm) {
    markError('signup-confirm', 'signup-confirm-err', 'Passwords do not match.');
    valid = false;
  }
  if (!terms) {
    setError('terms-err', 'You must agree to the Terms of Service.');
    valid = false;
  }

  if (valid) {
    simulateLoading(this, () => {
      sessionStorage.setItem('tf_authed', '1');
      window.location.href = 'index.html';
    });
  }
});

// ── Loading state ──────────────────────────────────────
function simulateLoading(form, callback) {
  const btn = form.querySelector('.btn-primary');
  const original = btn.textContent;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    callback();
  }, 1200);
}
