
(function () {
  // helper
  const $ = (id) => document.getElementById(id);
  const statusEl = $('status');

  function showStatus(text) { if (statusEl) statusEl.textContent = text; }

  // wait until auth available
  function ready(fn) {
    if (window.auth) return fn();
    const t = setInterval(() => { if (window.auth) { clearInterval(t); fn(); } }, 100);
  }

  ready(() => {
    // auth state listener
    auth.onAuthStateChanged(user => {
      if (user) {
        showStatus(`Signed in as ${user.displayName || user.email || user.phoneNumber}`);
      } else {
        showStatus('Not signed in');
      }
    });

    // --- Email login ---
    const emailBtn = $('emailLoginBtn');
    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        const email = $('email').value.trim();
        const pass = $('password').value;
        if (!email || !pass) return alert('Enter email and password');
        auth.signInWithEmailAndPassword(email, pass)
          .then(res => console.log('Email login:', res))
          .catch(err => alert(err.message));
      });
    }

    // --- Google ---
    const gBtn = $('googleLogin');
    if (gBtn) {
      gBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert(err.message));
      });
    }

    // --- Apple ---
    const appleBtn = $('appleLogin');
    if (appleBtn) {
      appleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        auth.signInWithPopup(provider).catch(err => alert(err.message));
      });
    }

    // --- Microsoft ---
    const msBtn = $('microsoftLogin');
    if (msBtn) {
      msBtn.addEventListener('click', () => {
        const provider = new firebase.auth.OAuthProvider('microsoft.com');
        auth.signInWithPopup(provider).catch(err => alert(err.message));
      });
    }

    // --- Phone flow (simple) ---
    const phoneBtn = $('phoneLogin');
    const phoneFlow = $('phoneFlow');
    const sendOtpBtn = $('sendOtpBtn');
    const verifyOtpBtn = $('verifyOtpBtn');
    const otpRow = $('otpRow');

    if (phoneBtn) {
      phoneBtn.addEventListener('click', () => {
        phoneFlow.style.display = phoneFlow.style.display === 'none' ? 'block' : 'none';
      });
    }

    // init recaptcha (invisible)
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });

    if (sendOtpBtn) {
      sendOtpBtn.addEventListener('click', () => {
        const phone = $('phoneNumber').value.trim();
        if (!phone) return alert('Enter phone number with country code, e.g. +919876543210');
        auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
          .then(confirmationResult => {
            window.confirmationResult = confirmationResult;
            alert('OTP sent — check your phone');
            otpRow.style.display = 'flex';
            verifyOtpBtn.style.display = 'block';
          })
          .catch(err => {
            console.error(err);
            alert('Phone error: ' + err.message);
          });
      });
    }

    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => {
        // collect OTP from .otp-input fields if visible, else prompt
        const inputs = document.querySelectorAll('.otp-input');
        let code = '';
        if (inputs.length && inputs[0].offsetParent !== null) {
          inputs.forEach(i => code += i.value.trim());
        } else {
          code = prompt('Enter the OTP you received:');
        }
        if (!code) return alert('Enter OTP');
        window.confirmationResult.confirm(code)
          .then(res => console.log('Phone auth success', res))
          .catch(err => alert('OTP verify failed: ' + err.message));
      });
    }

    // sign out helper (optional)
    window.logout = function () {
      auth.signOut().then(() => showStatus('Not signed in')).catch(e => console.error(e));
    };
  });
})();
