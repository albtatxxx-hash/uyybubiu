/**
 * نبض الأمل لأطفال الغسيل الكلوي - Hope & Vitality
 * Shared JavaScript (JS) for Navigation, Interactivity, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initQuickDonateModal();
  initToastContainer();
  initGlobalDonationCards();
});

/* ========================================================
   1. Active Page Navigation Highlighter
   ======================================================== */
function initNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Normalize root or empty path to index.html
  const activeFileName = (currentPath === '' || currentPath === 'code.html') ? 'index.html' : currentPath;

  const desktopLinks = document.querySelectorAll('nav a, header nav a');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetFile = href.split('/').pop().split('#')[0];
    
    if (targetFile === activeFileName) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetFile = href.split('/').pop().split('#')[0];
    
    if (targetFile === activeFileName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ========================================================
   2. Mobile Menu Drawer Toggle
   ======================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const drawer = document.getElementById('mobileMenuDrawer');
  const backdrop = document.getElementById('mobileMenuBackdrop');

  if (!menuBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ========================================================
   3. Global Toast Notifications
   ======================================================== */
function initToastContainer() {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function(message, type = 'success') {
  initToastContainer();
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
  
  const icon = type === 'error' ? 'error' : 'check_circle';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[22px] text-primary">${icon}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

/* ========================================================
   4. Quick Donation Modal System
   ======================================================== */
function initQuickDonateModal() {
  // Inject modal into document if not present
  if (!document.getElementById('quickDonateModal')) {
    const modalHtml = `
      <div id="quickDonateModal" class="modal-overlay fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="modal-content relative w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button id="closeDonateModal" class="absolute top-5 left-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" type="button">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-primary shadow-md">
              <span class="material-symbols-outlined text-[26px]">volunteer_activism</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">صندوق التبرع الفوري</h3>
              <p class="font-label-sm text-label-sm text-secondary font-medium" id="modalTargetChild">كفالة أطفال الغسيل الكلوي</p>
            </div>
          </div>

          <!-- Donation Frequency -->
          <div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low font-label-md text-label-md mb-5">
            <button class="modal-freq-btn active py-2 rounded-lg bg-surface-container-lowest text-primary font-bold shadow-sm text-center" data-freq="once" type="button">تبرع لمرة واحدة</button>
            <button class="modal-freq-btn py-2 rounded-lg text-on-surface-variant hover:text-on-surface text-center" data-freq="monthly" type="button">كفالة دورية شهرية</button>
          </div>

          <!-- Quick Amounts -->
          <div class="flex flex-col gap-2.5 mb-5">
            <label class="font-label-md text-label-md text-on-surface font-semibold">اختر قيمة التبرع:</label>
            <div class="grid grid-cols-3 gap-2.5" id="modalPresetAmounts">
              <button type="button" class="modal-amt-btn py-3 px-2 rounded-xl bg-surface-container-low hover:bg-primary-fixed/30 text-center font-bold text-primary active border-2 border-primary" data-amount="100">
                100 ر.س
              </button>
              <button type="button" class="modal-amt-btn py-3 px-2 rounded-xl bg-surface-container-low hover:bg-primary-fixed/30 text-center font-bold text-primary border-2 border-transparent" data-amount="250">
                250 ر.س
              </button>
              <button type="button" class="modal-amt-btn py-3 px-2 rounded-xl bg-surface-container-low hover:bg-primary-fixed/30 text-center font-bold text-primary border-2 border-transparent" data-amount="1000">
                1,000 ر.س
              </button>
            </div>
          </div>

          <!-- Custom Amount -->
          <div class="mb-5">
            <div class="flex items-center bg-surface-container-low rounded-2xl px-4 py-2.5 border border-transparent focus-within:border-primary">
              <span class="font-label-md text-label-md text-on-surface-variant font-medium">مبلغ آخر مخصص:</span>
              <input type="number" id="modalCustomAmount" class="w-full bg-transparent text-left font-headline-sm text-headline-sm text-primary px-3 focus:outline-none" placeholder="أدخل القيمة" min="10" />
              <span class="font-label-md text-label-md text-on-surface font-bold">ر.س</span>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="flex flex-col gap-2 mb-6">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">وسيلة الدفع:</span>
            <div class="grid grid-cols-3 gap-2">
              <label class="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-primary bg-primary-fixed/20 cursor-pointer">
                <input type="radio" name="modalPaymentMethod" value="mada" checked class="hidden" />
                <span class="font-label-md text-label-md font-bold text-primary">مدى Mada</span>
              </label>
              <label class="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-transparent bg-surface-container-low hover:bg-surface-container cursor-pointer">
                <input type="radio" name="modalPaymentMethod" value="apple" class="hidden" />
                <span class="font-label-md text-label-md font-bold text-on-surface">Apple Pay</span>
              </label>
              <label class="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-transparent bg-surface-container-low hover:bg-surface-container cursor-pointer">
                <input type="radio" name="modalPaymentMethod" value="card" class="hidden" />
                <span class="font-label-md text-label-md font-bold text-on-surface">Visa / MC</span>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="button" id="modalSubmitDonate" class="w-full py-4 rounded-2xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-[18px] font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
            <span>تأكيد التبرع الآن</span>
            <span class="material-symbols-outlined">favorite</span>
          </button>
          
          <div class="flex items-center justify-center gap-2 text-on-surface-variant font-label-sm text-label-sm mt-3">
            <span class="material-symbols-outlined text-[16px] text-primary">lock</span>
            <span>بوابة تبرع آمنة ومعتمدة 100%</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const modal = document.getElementById('quickDonateModal');
  const closeBtn = document.getElementById('closeDonateModal');
  const submitBtn = document.getElementById('modalSubmitDonate');
  const customInput = document.getElementById('modalCustomAmount');
  const amtButtons = document.querySelectorAll('.modal-amt-btn');
  const freqButtons = document.querySelectorAll('.modal-freq-btn');
  const paymentLabels = modal.querySelectorAll('input[name="modalPaymentMethod"]');

  let currentSelectedAmount = 100;

  // Open modal triggers: any link/button with data-path="quick-donate" or .trigger-donate-modal
  document.querySelectorAll('[data-path="quick-donate"], .trigger-donate-modal').forEach(el => {
    el.addEventListener('click', (e) => {
      // If target specifies child name
      const childName = el.getAttribute('data-child-name');
      const targetSpan = document.getElementById('modalTargetChild');
      if (childName && targetSpan) {
        targetSpan.textContent = `كفالة البطل: ${childName}`;
      } else if (targetSpan) {
        targetSpan.textContent = 'كفالة أطفال الغسيل الكلوي';
      }

      const presetAmt = el.getAttribute('data-preset-amount');
      if (presetAmt) {
        selectModalAmount(parseInt(presetAmt, 10));
      }

      openModal();
    });
  });

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Amount buttons
  amtButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amtButtons.forEach(b => {
        b.classList.remove('active', 'border-primary', 'bg-primary-fixed/30');
        b.classList.add('border-transparent');
      });
      btn.classList.add('active', 'border-primary', 'bg-primary-fixed/30');
      btn.classList.remove('border-transparent');
      currentSelectedAmount = parseInt(btn.getAttribute('data-amount'), 10);
      if (customInput) customInput.value = '';
    });
  });

  function selectModalAmount(val) {
    let matched = false;
    amtButtons.forEach(b => {
      if (parseInt(b.getAttribute('data-amount'), 10) === val) {
        b.click();
        matched = true;
      }
    });
    if (!matched && customInput) {
      amtButtons.forEach(b => {
        b.classList.remove('active', 'border-primary');
        b.classList.add('border-transparent');
      });
      customInput.value = val;
      currentSelectedAmount = val;
    }
  }

  // Custom input change
  if (customInput) {
    customInput.addEventListener('input', () => {
      const val = parseFloat(customInput.value);
      if (val > 0) {
        currentSelectedAmount = val;
        amtButtons.forEach(b => {
          b.classList.remove('active', 'border-primary');
          b.classList.add('border-transparent');
        });
      }
    });
  }

  // Frequency switch
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => {
        b.classList.remove('active', 'bg-surface-container-lowest', 'text-primary', 'font-bold', 'shadow-sm');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-surface-container-lowest', 'text-primary', 'font-bold', 'shadow-sm');
      btn.classList.remove('text-on-surface-variant');
    });
  });

  // Payment radio styled border
  paymentLabels.forEach(radio => {
    radio.addEventListener('change', () => {
      paymentLabels.forEach(r => {
        r.parentElement.classList.remove('border-primary', 'bg-primary-fixed/20');
        r.parentElement.classList.add('border-transparent', 'bg-surface-container-low');
      });
      if (radio.checked) {
        radio.parentElement.classList.add('border-primary', 'bg-primary-fixed/20');
        radio.parentElement.classList.remove('border-transparent', 'bg-surface-container-low');
      }
    });
  });

  // Submit action
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const amt = customInput && customInput.value ? parseFloat(customInput.value) : currentSelectedAmount;
      if (!amt || amt <= 0) {
        showToast('يرجى تحديد مبلغ تبرع صحيح', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="animate-spin material-symbols-outlined">sync</span>
        <span>جارِ المعالجة...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>تأكيد التبرع الآن</span>
          <span class="material-symbols-outlined">favorite</span>
        `;
        closeModal();
        showToast(`جزاكم الله خيراً! تم تسجيل تبرعكم بقيمة ${amt.toLocaleString('ar-SA')} ر.س بنجاح ❤️`);
      }, 1200);
    });
  }
}

/* ========================================================
   5. Interactive Quick-Donation Widget on Home / Pages
   ======================================================== */
function initGlobalDonationCards() {
  window.selectDonation = function(amount, element) {
    const parent = element.closest('#donationOptions') || element.parentElement;
    if (parent) {
      parent.querySelectorAll('.donation-card').forEach(card => card.classList.remove('active'));
    }
    element.classList.add('active');
    const customInput = document.getElementById('customAmountInput');
    if (customInput) customInput.value = '';
    window.currentDonationAmount = amount;
  };

  const customInput = document.getElementById('customAmountInput');
  if (customInput) {
    customInput.addEventListener('input', () => {
      const options = document.getElementById('donationOptions');
      if (options) {
        options.querySelectorAll('.donation-card').forEach(card => card.classList.remove('active'));
      }
      window.currentDonationAmount = parseFloat(customInput.value) || 0;
    });
  }

  // Big donation button on Hero widget
  const heroDonateBtn = document.getElementById('heroDonateBtn');
  if (heroDonateBtn) {
    heroDonateBtn.addEventListener('click', () => {
      const amt = window.currentDonationAmount || 250;
      showToast(`شكراً لك! جاري توجيهك لكفالة جلسة بقيمة ${amt} ر.س...`);
      setTimeout(() => {
        window.location.href = `donate.html?amount=${amt}`;
      }, 800);
    });
  }
}

/* ========================================================
   6. Copy to Clipboard Utility
   ======================================================== */
window.copyToClipboard = function(text, successMsg = 'تم النسخ إلى الحافظة!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('تعذر النسخ، يرجى النسخ يدوياً', 'error');
  }
  document.body.removeChild(textArea);
}
