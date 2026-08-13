/**
 * FreshBite - Auth Module
 * Login, Register, Logout, Password validation
 */

const Auth = {

  // ── REGISTER ──────────────────────────────────────

  register(name, email, phone, password, confirmPassword) {
    const errors = [];

    if (!name.trim() || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
    if (!Utils.isValidEmail(email)) errors.push('Please enter a valid email address.');
    if (!Utils.isValidPhone(phone)) errors.push('Please enter a valid 10-digit phone number.');
    if (!Utils.isValidPassword(password)) errors.push('Password must be at least 6 characters.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');
    if (Storage.findUserByEmail(email)) errors.push('An account with this email already exists.');

    if (errors.length) return { success: false, errors };

    const user = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: btoa(password), // simple encode (not for production)
      avatar: null,
      joinDate: new Date().toISOString(),
    };

    Storage.addUserToDB(user);
    // Auto-login after register
    const { password: _p, ...safeUser } = user;
    Storage.setUser(safeUser);

    return { success: true, user: safeUser };
  },

  // ── LOGIN ─────────────────────────────────────────

  login(email, password) {
    const errors = [];

    if (!Utils.isValidEmail(email)) errors.push('Please enter a valid email address.');
    if (!password.trim()) errors.push('Please enter your password.');

    if (errors.length) return { success: false, errors };

    const user = Storage.findUserByEmail(email);
    if (!user) return { success: false, errors: ['No account found with this email.'] };
    if (atob(user.password) !== password) return { success: false, errors: ['Incorrect password. Please try again.'] };

    const { password: _p, ...safeUser } = user;
    Storage.setUser(safeUser);

    return { success: true, user: safeUser };
  },

  // ── LOGOUT ────────────────────────────────────────

  logout() {
    Storage.clearUser();
    UI.updateAuthNav();
    UI.toast('You have been logged out.', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  },

  // ── UPDATE PROFILE ────────────────────────────────

  updateProfile(updates) {
    const user = Storage.getUser();
    if (!user) return { success: false, errors: ['Not logged in.'] };

    const updatedUser = { ...user, ...updates };
    Storage.setUser(updatedUser);

    // Also update in users DB
    const users = Storage.getUsersDB().map(u =>
      u.id === user.id ? { ...u, ...updates } : u
    );
    Storage.set(Storage.KEYS.USERS_DB, users);

    return { success: true, user: updatedUser };
  },

  // ── GUARD (redirect if not logged in) ─────────────

  requireAuth(redirectTo = 'login.html') {
    if (!Storage.getUser()) {
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    return true;
  },

  // ── INIT REGISTER PAGE ────────────────────────────

  initRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form) return;

    // If already logged in, redirect
    if (Storage.getUser()) {
      window.location.href = 'index.html';
      return;
    }

    // Password strength indicator
    const passInput = document.getElementById('reg-password');
    if (passInput) {
      passInput.addEventListener('input', () => {
        this.updatePasswordStrength(passInput.value);
      });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.innerHTML = isText ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
      });
    });

    // Social login (mock)
    document.querySelectorAll('.social-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.toast(`${btn.dataset.provider} sign-up coming soon!`, 'info');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value?.trim();
      const email = document.getElementById('reg-email')?.value?.trim();
      const phone = document.getElementById('reg-phone')?.value?.trim();
      const password = document.getElementById('reg-password')?.value;
      const confirm = document.getElementById('reg-confirm')?.value;
      if (!name || !email || !phone || !password || !confirm) {
        UI.toast('Please fill in all required fields.', 'error'); return;
      }

      this.clearErrors();
      const result = this.register(name, email, phone, password, confirm);

      if (!result.success) {
        result.errors.forEach(err => this.showError(err));
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 600);
        return;
      }

      UI.toast(`Welcome to FreshBite, ${result.user.name}! 🎉`, 'success');
      const redirect = Utils.getParam('redirect') || 'index.html';
      setTimeout(() => { window.location.href = redirect; }, 900);
    });
  },

  // ── INIT LOGIN PAGE ───────────────────────────────

  initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    // If already logged in, redirect
    if (Storage.getUser()) {
      const redirect = Utils.getParam('redirect') || 'index.html';
      window.location.href = redirect;
      return;
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.innerHTML = isText ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
      });
    });

    // Social login (mock)
    document.querySelectorAll('.social-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        UI.toast(`${provider} login coming soon!`, 'info');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      const password = document.getElementById('login-password')?.value;
      if (!email || !password) { UI.toast('Please fill in all fields.', 'error'); return; }

      this.clearErrors();
      const result = this.login(email, password);

      if (!result.success) {
        result.errors.forEach(err => this.showError(err));
        const form = document.getElementById('login-form');
        if (form) form.classList.add('shake');
        setTimeout(() => form?.classList.remove('shake'), 600);
        return;
      }

      UI.toast(`Welcome back, ${result.user.name}! 👋`, 'success');
      const redirect = Utils.getParam('redirect') || 'index.html';
      setTimeout(() => { window.location.href = redirect; }, 900);
    });
  },

  // ── PASSWORD STRENGTH ─────────────────────────────

  updatePasswordStrength(password) {
    const bar = document.getElementById('password-strength-bar');
    const label = document.getElementById('password-strength-label');
    if (!bar || !label) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: '', color: 'transparent', width: '0%' },
      { label: 'Very Weak', color: '#e74c3c', width: '20%' },
      { label: 'Weak', color: '#e67e22', width: '40%' },
      { label: 'Fair', color: '#f1c40f', width: '60%' },
      { label: 'Strong', color: '#2ecc71', width: '80%' },
      { label: 'Very Strong', color: '#27ae60', width: '100%' },
    ];

    const level = levels[strength] || levels[0];
    bar.style.width = level.width;
    bar.style.backgroundColor = level.color;
    label.textContent = level.label;
    label.style.color = level.color;
  },

  // ── HELPERS ───────────────────────────────────────

  showError(message) {
    const container = document.getElementById('auth-errors');
    if (!container) { UI.toast(message, 'error'); return; }
    container.classList.remove('hidden');
    const err = document.createElement('p');
    err.textContent = `• ${message}`;
    container.querySelector('.error-list')?.appendChild(err);
  },

  clearErrors() {
    const container = document.getElementById('auth-errors');
    if (!container) return;
    container.classList.add('hidden');
    const list = container.querySelector('.error-list');
    if (list) list.innerHTML = '';
  },
};
