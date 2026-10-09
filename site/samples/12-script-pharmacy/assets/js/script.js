/* ============================================================
   SCRIPT PHARMACY — Shared JavaScript
   Basket, filtering, checkout, prescription upload
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Product Data ---------- */
  const PRODUCTS = [
    { id: 'PRD-001', name: 'Paracetamol 500mg', form: 'Tablet', pack: '20 tablets', price: 500, rx: false, category: 'otc' },
    { id: 'PRD-002', name: 'Ibuprofen 400mg', form: 'Tablet', pack: '30 tablets', price: 800, rx: false, category: 'otc' },
    { id: 'PRD-003', name: 'Amoxicillin 500mg', form: 'Capsule', pack: '21 capsules', price: 2500, rx: true, category: 'rx' },
    { id: 'PRD-004', name: 'Azithromycin 250mg', form: 'Tablet', pack: '6 tablets', price: 3500, rx: true, category: 'rx' },
    { id: 'PRD-005', name: 'Vitamin C 1000mg', form: 'Effervescent', pack: '20 tablets', price: 1500, rx: false, category: 'vitamins' },
    { id: 'PRD-006', name: 'Vitamin D3 2000IU', form: 'Softgel', pack: '60 softgels', price: 2800, rx: false, category: 'vitamins' },
    { id: 'PRD-007', name: 'Omega-3 Fish Oil', form: 'Softgel', pack: '90 softgels', price: 4500, rx: false, category: 'vitamins' },
    { id: 'PRD-008', name: 'Multivitamin Complex', form: 'Tablet', pack: '60 tablets', price: 3200, rx: false, category: 'vitamins' },
    { id: 'PRD-009', name: 'Cetirizine 10mg', form: 'Tablet', pack: '30 tablets', price: 1200, rx: false, category: 'otc' },
    { id: 'PRD-010', name: 'Loratadine 10mg', form: 'Tablet', pack: '30 tablets', price: 1000, rx: false, category: 'otc' },
    { id: 'PRD-011', name: 'Omeprazole 20mg', form: 'Capsule', pack: '28 capsules', price: 2200, rx: true, category: 'rx' },
    { id: 'PRD-012', name: 'Metformin 500mg', form: 'Tablet', pack: '60 tablets', price: 1800, rx: true, category: 'rx' },
    { id: 'PRD-013', name: 'Amlodipine 5mg', form: 'Tablet', pack: '30 tablets', price: 1500, rx: true, category: 'rx' },
    { id: 'PRD-014', name: 'Atorvastatin 20mg', form: 'Tablet', pack: '30 tablets', price: 2800, rx: true, category: 'rx' },
    { id: 'PRD-015', name: 'Salbutamol Inhaler', form: 'Inhaler', pack: '200 doses', price: 3500, rx: true, category: 'rx' },
    { id: 'PRD-016', name: 'Hydrocortisone Cream 1%', form: 'Cream', pack: '30g tube', price: 1800, rx: false, category: 'personal-care' },
    { id: 'PRD-017', name: 'Antibacterial Hand Gel', form: 'Gel', pack: '100ml', price: 800, rx: false, category: 'personal-care' },
    { id: 'PRD-018', name: 'Sunscreen SPF 50+', form: 'Lotion', pack: '50ml', price: 2500, rx: false, category: 'personal-care' },
    { id: 'PRD-019', name: 'Cough Syrup 100ml', form: 'Syrup', pack: '100ml bottle', price: 1200, rx: false, category: 'otc' },
    { id: 'PRD-020', name: 'ORS Sachets', form: 'Sachet', pack: '10 sachets', price: 600, rx: false, category: 'otc' },
    { id: 'PRD-021', name: 'Insulin Glargine 100IU', form: 'Injection', pack: '3ml pen', price: 8500, rx: true, category: 'rx' },
    { id: 'PRD-022', name: 'Levothyroxine 50mcg', form: 'Tablet', pack: '30 tablets', price: 1400, rx: true, category: 'rx' },
    { id: 'PRD-023', name: 'Biotin 10000mcg', form: 'Tablet', pack: '60 tablets', price: 3800, rx: false, category: 'vitamins' },
    { id: 'PRD-024', name: 'Zinc 50mg', form: 'Tablet', pack: '60 tablets', price: 2000, rx: false, category: 'vitamins' },
  ];

  const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'otc', label: 'OTC' },
    { key: 'rx', label: 'Prescription' },
    { key: 'vitamins', label: 'Vitamins' },
    { key: 'personal-care', label: 'Personal Care' },
  ];

  /* ---------- State ---------- */
  let basket = [];
  let currentCategory = 'all';
  let currentSort = 'name-asc';
  let searchQuery = '';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function() {
    initProductGrid();
    initBasket();
    initCheckout();
    initPrescriptionUpload();
    initSubscriptionForm();
  });

  /* ---------- Product Grid ---------- */
  function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    renderProducts(grid);
    initControls(grid);
  }

  function renderProducts(grid) {
    let filtered = PRODUCTS.filter(function(p) {
      const matchCategory = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Sort
    filtered.sort(function(a, b) {
      switch (currentSort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; padding: 3rem; text-align: center; font-family: var(--font-mono); color: var(--grey-500);">No products found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function(p) {
      const inBasket = basket.find(function(item) { return item.id === p.id; });
      const btnClass = inBasket ? 'add-btn added' : 'add-btn';
      const btnText = inBasket ? 'Added ✓' : 'Add to Basket';

      return '' +
        '<article class="product-card" data-id="' + p.id + '">' +
          '<span class="product-sku">' + p.id + '</span>' +
          '<h3 class="product-name">' + p.name + '</h3>' +
          '<div class="product-meta">' +
            '<span class="product-tag">' + p.form + '</span>' +
            '<span class="product-tag">' + p.pack + '</span>' +
            (p.rx ? '<span class="product-tag rx">Rx Required</span>' : '') +
          '</div>' +
          '<span class="product-price"><span class="currency">₦</span>' + formatPrice(p.price) + '</span>' +
          '<button class="' + btnClass + '" data-action="add" data-id="' + p.id + '">' + btnText + '</button>' +
        '</article>';
    }).join('');
  }

  function initControls(grid) {
    // Category filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderProducts(grid);
      });
    });

    // Sort buttons
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sortBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderProducts(grid);
      });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchQuery = this.value.trim();
        renderProducts(grid);
      });
    }

    // Add to basket (event delegation)
    grid.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-action="add"]');
      if (btn) {
        const id = btn.dataset.id;
        addToBasket(id);
        renderProducts(grid);
      }
    });
  }

  /* ---------- Basket ---------- */
  function initBasket() {
    const drawer = document.getElementById('basket-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const openBtn = document.getElementById('basket-open');
    const closeBtn = document.getElementById('drawer-close');
    const itemsContainer = document.getElementById('drawer-items');
    const totalEl = document.getElementById('drawer-total');
    const countEl = document.getElementById('basket-count');

    if (!drawer || !openBtn) return;

    openBtn.addEventListener('click', function() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Quantity controls (event delegation)
    itemsContainer.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'increase') {
        updateQuantity(id, 1);
      } else if (action === 'decrease') {
        updateQuantity(id, -1);
      } else if (action === 'remove') {
        removeFromBasket(id);
      }
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        closeDrawer();
        openCheckoutModal();
      });
    }

    // Expose render function
    window.renderBasket = function() {
      updateBasketUI(itemsContainer, totalEl, countEl);
    };

    // Initial render
    updateBasketUI(itemsContainer, totalEl, countEl);
  }

  function addToBasket(id) {
    const product = PRODUCTS.find(function(p) { return p.id === id; });
    if (!product) return;

    const existing = basket.find(function(item) { return item.id === id; });
    if (existing) {
      existing.qty++;
    } else {
      basket.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }

    if (window.renderBasket) window.renderBasket();
  }

  function updateQuantity(id, delta) {
    const item = basket.find(function(i) { return i.id === id; });
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromBasket(id);
      return;
    }

    if (window.renderBasket) window.renderBasket();
  }

  function removeFromBasket(id) {
    basket = basket.filter(function(i) { return i.id !== id; });
    if (window.renderBasket) window.renderBasket();
  }

  function updateBasketUI(itemsContainer, totalEl, countEl) {
    if (!itemsContainer) return;

    const totalItems = basket.reduce(function(sum, i) { return sum + i.qty; }, 0);
    const totalPrice = basket.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);

    if (countEl) countEl.textContent = totalItems;
    if (totalEl) totalEl.innerHTML = '<span class="currency">₦</span> ' + formatPrice(totalPrice);

    if (basket.length === 0) {
      itemsContainer.innerHTML = '<div class="drawer-empty">Your basket is empty.<br>Add products to get started.</div>';
      return;
    }

    itemsContainer.innerHTML = basket.map(function(item) {
      return '' +
        '<div class="basket-item">' +
          '<div>' +
            '<div class="basket-item-name">' + item.name + '</div>' +
            '<div class="basket-item-meta">' + item.id + ' · ₦' + formatPrice(item.price) + ' each</div>' +
            '<div class="qty-controls">' +
              '<button class="qty-btn" data-action="decrease" data-id="' + item.id + '">−</button>' +
              '<span class="qty-value">' + item.qty + '</span>' +
              '<button class="qty-btn" data-action="increase" data-id="' + item.id + '">+</button>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="basket-item-price">₦' + formatPrice(item.price * item.qty) + '</div>' +
            '<button class="rx-file-remove" data-action="remove" data-id="' + item.id + '" style="margin-top:0.5rem; font-size:0.6875rem;">Remove</button>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* ---------- Checkout ---------- */
  function initCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('checkout-form');
    const reviewEl = document.getElementById('checkout-review');
    const formEl = document.getElementById('checkout-form-container');
    const confirmEl = document.getElementById('checkout-confirmation');
    const confirmRef = document.getElementById('order-reference');
    const confirmTotal = document.getElementById('confirm-total');
    const newOrderBtn = document.getElementById('new-order-btn');

    window.openCheckoutModal = function() {
      if (basket.length === 0) {
        alert('Your basket is empty. Add products before checking out.');
        return;
      }

      // Show review, hide form and confirmation
      reviewEl.style.display = 'block';
      formEl.style.display = 'none';
      confirmEl.style.display = 'none';

      // Populate review
      const reviewItems = document.getElementById('review-items');
      const reviewTotal = document.getElementById('review-total');
      const totalPrice = basket.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);

      reviewItems.innerHTML = basket.map(function(item) {
        return '<div class="order-summary-row"><span>' + item.name + ' × ' + item.qty + '</span><span>₦' + formatPrice(item.price * item.qty) + '</span></div>';
      }).join('');

      reviewTotal.innerHTML = '<div class="order-summary-row total"><span>Total</span><span>₦' + formatPrice(totalPrice) + '</span></div>';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Proceed to form
    const proceedBtn = document.getElementById('proceed-to-form');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', function() {
        reviewEl.style.display = 'none';
        formEl.style.display = 'block';
      });
    }

    // Submit order
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        const totalPrice = basket.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);
        const ref = 'SCP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        confirmRef.textContent = ref;
        confirmTotal.textContent = '₦' + formatPrice(totalPrice);

        formEl.style.display = 'none';
        confirmEl.style.display = 'block';

        // Clear basket
        basket = [];
        if (window.renderBasket) window.renderBasket();
      });
    }

    // New order
    if (newOrderBtn) {
      newOrderBtn.addEventListener('click', function() {
        closeModal();
        // Re-render products to reset buttons
        const grid = document.getElementById('product-grid');
        if (grid) renderProducts(grid);
      });
    }
  }

  /* ---------- Prescription Upload ---------- */
  function initPrescriptionUpload() {
    const zone = document.getElementById('rx-upload-zone');
    if (!zone) return;

    const input = zone.querySelector('input[type="file"]');
    const fileList = document.getElementById('rx-file-list');

    zone.addEventListener('click', function() {
      input.click();
    });

    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', function() {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    input.addEventListener('change', function() {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      if (!fileList) return;

      Array.from(files).forEach(function(file) {
        const item = document.createElement('div');
        item.className = 'rx-file-item';
        item.innerHTML = '<span>' + file.name + ' (' + formatFileSize(file.size) + ')</span><button class="rx-file-remove" aria-label="Remove file">×</button>';
        fileList.appendChild(item);

        item.querySelector('.rx-file-remove').addEventListener('click', function() {
          item.remove();
        });
      });
    }
  }

  /* ---------- Subscription Form ---------- */
  function initSubscriptionForm() {
    const form = document.getElementById('subscription-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Processing...';
      btn.disabled = true;

      setTimeout(function() {
        btn.textContent = '✓ Subscribed Successfully';
        btn.style.background = 'var(--accent)';

        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1500);
    });
  }

  /* ---------- Utilities ---------- */
  function formatPrice(num) {
    return num.toLocaleString('en-NG');
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

})();
