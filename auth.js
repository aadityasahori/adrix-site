// assets/js/auth.js
(function () {
  // helper: find first existing element among many possible IDs
  const $ = (id) => document.getElementById(id);
  const findEl = (...ids) => ids.map($).find(Boolean);

  // UI elements (we try multiple id variants so code is tolerant)
  const emailBtn = findEl('emailLoginBtn', 'email-login', 'emailLogin');
  const googleBtn = findEl('googleLogin', 'google-login', 'googleBtn');
  const appleBtn = findEl('appleLogin', 'apple-login', 'appleBtn');
  const msBtn = findEl('microsoftLogin', 'microsoft-login', 'msBtn');
  const phoneBtn = findEl('phoneLogin', 'phone-login', 'phoneBtn');
  const sendOtpBtn = findEl('sendOtpBtn', 'send-otp-btn');
  const verifyOtpBtn = findEl('verifyOtpBtn', 'verify-otp-btn');
  const phoneFlow = findEl('phoneFlow', 'phone-flow');
  const statusEl = findEl('status', 'authStatus');

  // input fields
  const emailInput = findEl('email', 'emailInput');
  const passInput = findEl('password', 'pwd', 'passwordInput');
  const phoneInput = findEl('phoneNumber', 'phone', 'phoneInput');
  const otpRow = findEl('otpRow');
  const otpInputs = () => document.querySelectorAll('.otp-input');

  // small safe-logger
  const log = (...a) => console.log('[AUTH]', ...a);
  const showStatus = (t) => { if (statusEl) statusEl.textContent = t; else log('STATUS:', t); };

  // Wait until firebase+auth available (firebase-init.js should set window.auth)
  function whenReady(fn) {
    if (window.firebase && (window.auth || firebase.auth)) return fn();
    const t = setInterval(() => {
      if (window.firebase && (window.auth || firebase.auth)) {
        clearInterval(t);
        fn();
      }
    }, 100);
    // timeout after 10s
    setTimeout(() => {
      clearInterval(t);
      if (!(window.firebase && (window.auth || firebase.auth))) {
        console.error('[AUTH] Firebase not found. Make sure firebase scripts and firebase-init.js are loaded BEFORE auth.js');
        showStatus('Firebase not loaded');
      }
    }, 10000);
  }

  whenReady(() => {
    // ensure we have compat auth object
    const auth = window.auth || firebase.auth();

    // auth state listener
    auth.onAuthStateChanged(user => {
      if (user) {
        showStatus(`Signed in as ${user.displayName || user.email || user.phoneNumber}`);
        log('User:', user);
      } else {
        showStatus('Not signed in');
      }
    });

    // ---------------- Email / Password ----------------
    if (emailBtn && emailInput && passInput) {
      emailBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passInput.value;
        if (!email || !password) return alert('Enter email and password');
        try {
          showStatus('Signing in...');
          await auth.signInWithEmailAndPassword(email, password);
          showStatus('Signed in');
        } catch (err) {
          console.error(err);
          alert('Email login error: ' + err.message);
          showStatus('Not signed in');
        }
      });
    } else {
      log('Email login UI not found (skipping)');
    }

    // ---------------- Google ----------------
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        try {
          showStatus('Opening Google sign-in...');
          const provider = new firebase.auth.GoogleAuthProvider();
          await auth.signInWithPopup(provider);
          showStatus('Signed in with Google');
        } catch (err) {
          console.error(err);
          alert('Google login error: ' + err.message);
          showStatus('Not signed in');
        }
      });
    }

    // ---------------- Apple (OAuthProvider) ----------------
    if (appleBtn) {
      appleBtn.addEventListener('click', async () => {
        try {
          showStatus('Opening Apple sign-in...');
          const provider = new firebase.auth.OAuthProvider('apple.com');
          await auth.signInWithPopup(provider);
          showStatus('Signed in with Apple');
        } catch (err) {
          console.error(err);
          alert('Apple login error: ' + err.message);
          showStatus('Not signed in');
        }
      });
    }

    // ---------------- Microsoft (OAuthProvider) ----------------
    if (msBtn) {
      msBtn.addEventListener('click', async () => {
        try {
          showStatus('Opening Microsoft sign-in...');
          const provider = new firebase.auth.OAuthProvider('microsoft.com');
          await auth.signInWithPopup(provider);
          showStatus('Signed in with Microsoft');
        } catch (err) {
          console.error(err);
          alert('Microsoft login error: ' + err.message);
          showStatus('Not signed in');
        }
      });
    }

    // ---------------- Phone (OTP) ----------------
    // Make sure you have: <div id="recaptcha-container"></div> in HTML
    try {
      // initialize recaptcha invisible
      if (window.recaptchaVerifier === undefined) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            log('reCAPTCHA solved');
          }
        }, auth);
      }
    } catch (e) {
      console.warn('Recaptcha init error (ok if no phone login):', e);
    }

    if (phoneBtn) {
      phoneBtn.addEventListener('click', () => {
        if (phoneFlow) phoneFlow.style.display = phoneFlow.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (sendOtpBtn && phoneInput) {
      sendOtpBtn.addEventListener('click', async () => {
        const phone = phoneInput.value.trim();
        if (!phone) return alert('Enter phone with country code (e.g. +919876543210)');
        try {
          showStatus('Sending OTP...');
          const confirmationResult = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
          window.confirmationResult = confirmationResult;
          alert('OTP sent to ' + phone);
          if (otpRow) otpRow.style.display = 'flex';
          if (verifyOtpBtn) verifyOtpBtn.style.display = 'block';
          showStatus('OTP sent — enter code');
        } catch (err) {
          console.error(err);
          alert('Send OTP error: ' + err.message);
          showStatus('OTP send failed');
          // reset reCAPTCHA if needed
          try { window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId)); } catch (_) {}
        }
      });
    }

    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', async () => {
        // collect code from single-box OTP inputs OR fallback to prompt
        const inputs = otpInputs();
        let code = '';
        if (inputs.length && inputs[0].offsetParent !== null) {
          inputs.forEach(i => code += i.value.trim());
        } else {
          code = prompt('Enter OTP');
        }
        if (!code) return alert('Enter OTP');
        try {
          showStatus('Verifying OTP...');
          const res = await window.confirmationResult.confirm(code);
          log('Phone auth success', res);
          showStatus('Phone verified');
        } catch (err) {
          console.error(err);
          alert('OTP verify failed: ' + err.message);
          showStatus('OTP verify failed');
        }
      });
    }

    // ---------------- Sign out helper ----------------
    window.logout = function () {
      auth.signOut().then(() => {
        showStatus('Not signed in');
        alert('Signed out');
      }).catch(e => {
        console.error('Sign out error', e);
      });
    };

    log('Auth bindings attached');
  }); // whenReady end
})();
