/**
 * DermoPure — Application Logic (ES6 Module, no build step required)
 */
import { STORE_CONFIG, WILAYAS } from "./config.js";
import { PRODUCTS, CATEGORIES } from "./products.js";

/* ==========================================================================
   Utilities
   ========================================================================== */

/** Escape any string before it ever touches innerHTML — prevents DOM-XSS. */
function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Strip anything that isn't a plain search token (letters/numbers/space/Arabic). */
function sanitizeSearchInput(raw = "") {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`;(){}]/g, "")
    .slice(0, 80);
}

function formatPrice(n) {
  return `${n.toLocaleString("en-US")} ${STORE_CONFIG.currency}`;
}

function debounce(fn, delay = 220) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function qs(id) {
  return document.getElementById(id);
}

const ALGERIA_PHONE_RE = /^0[5-7][0-9]{8}$/;

function validateAlgerianPhone(value) {
  return ALGERIA_PHONE_RE.test(value.replace(/[\s-]/g, ""));
}

function categoryName(id) {
  return CATEGORIES.find((c) => c.id === id)?.name || id;
}

function generateOrderId() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `DP-${rand}`;
}

/* ==========================================================================
   Cart state (persisted to localStorage)
   ========================================================================== */

const CART_KEY = "dermopure_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* localStorage unavailable (private mode, etc.) — cart stays in-memory only */
  }
}

let cart = loadCart(); // { [productId]: qty }

function cartItemsDetailed() {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean);
}

function cartCount() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartSubtotal() {
  return cartItemsDetailed().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
}

function addToCart(productId, qty = 1) {
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  renderCartBadge();
  renderCartDrawer();
}

function setQty(productId, qty) {
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
  renderCartBadge();
  renderCartDrawer();
}

function clearCart() {
  cart = {};
  saveCart(cart);
  renderCartBadge();
  renderCartDrawer();
}

/* ==========================================================================
   App / filter state
   ========================================================================== */

const state = {
  category: "all",
  query: "",
  sort: "default", // default | price-asc | price-desc | best
};

/* ==========================================================================
   Rendering: navigation + category grid
   ========================================================================== */

function renderNavPills() {
  const wrap = qs("navCategoryPills");
  wrap.innerHTML = CATEGORIES.map(
    (c) => `<button class="nav-pill" data-cat="${c.id}">${escapeHTML(c.name)}</button>`
  ).join("");
}

function renderCategoryGrid() {
  const grid = qs("categoryGrid");
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category-card" data-cat="${c.id}" aria-label="${escapeHTML(c.name)}">
      <span class="glyph" aria-hidden="true">${c.icon}</span>
      <span class="text-sm font-bold block">${escapeHTML(c.name)}</span>
    </button>`
  ).join("");
}

function syncCategoryActiveStates() {
  document.querySelectorAll(".nav-pill").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.cat === state.category);
  });
  document.querySelectorAll(".category-card").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.cat === state.category);
  });
}

/* ==========================================================================
   Rendering: filter chips (sort)
   ========================================================================== */

const SORT_OPTIONS = [
  { id: "default", label: "الأنسب" },
  { id: "best", label: "الأكثر مبيعًا" },
  { id: "price-asc", label: "السعر: الأقل أولاً" },
  { id: "price-desc", label: "السعر: الأعلى أولاً" },
];

function renderFilterChips() {
  const wrap = qs("filterChips");
  wrap.innerHTML = SORT_OPTIONS.map(
    (o) => `<button class="toolbar-chip ${o.id === state.sort ? "is-active" : ""}" data-sort="${o.id}">${o.label}</button>`
  ).join("");
}

/* ==========================================================================
   Rendering: product grid
   ========================================================================== */

function getFilteredProducts() {
  let list = PRODUCTS.slice();

  if (state.category !== "all") {
    list = list.filter((p) => p.category === state.category);
  }

  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        categoryName(p.category).toLowerCase().includes(q)
    );
  }

  switch (state.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "best":
      list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    default:
      break;
  }

  return list;
}

function productCardHTML(p) {
  const discount = p.oldPrice ? Math.round(100 - (p.price / p.oldPrice) * 100) : null;
  return `
  <article class="product-card fade-in" data-id="${p.id}">
    <div class="product-media">
      <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy" width="700" height="700" />
      <span class="badge badge-category">${escapeHTML(categoryName(p.category))}</span>
      ${p.isBestSeller ? `<span class="badge badge-best">الأكثر مبيعًا</span>` : ""}
      ${!p.inStock ? `<span class="badge-oos">نفدت الكمية</span>` : ""}
      <button class="quick-view-btn" data-quickview="${p.id}">عرض سريع</button>
    </div>
    <div class="product-body">
      <p class="product-brand">${escapeHTML(p.brand)}</p>
      <h3 class="product-title">${escapeHTML(p.name)}</h3>
      <div class="price-row">
        <span class="price-now">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
        ${discount ? `<span class="badge" style="background:var(--c-gold-tint);color:var(--c-gold)">-${discount}%</span>` : ""}
      </div>
      <div class="stock-row ${p.inStock ? "stock-in" : "stock-out"}">
        <span class="stock-dot"></span>${p.inStock ? "متوفر في المخزون" : "غير متوفر حاليًا"}
      </div>
      <button class="add-cart-btn" data-add="${p.id}" ${!p.inStock ? "disabled" : ""}>
        ${p.inStock ? "أضف إلى السلة" : "غير متوفر"}
      </button>
    </div>
  </article>`;
}

function skeletonCardHTML() {
  return `
  <div class="product-card" aria-hidden="true">
    <div class="skeleton" style="aspect-ratio:1/1"></div>
    <div class="product-body">
      <div class="skeleton" style="height:10px;width:40%;margin-bottom:8px"></div>
      <div class="skeleton" style="height:14px;width:90%;margin-bottom:6px"></div>
      <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
      <div class="skeleton" style="height:36px;width:100%"></div>
    </div>
  </div>`;
}

function renderProductGrid() {
  const grid = qs("productGrid");
  const empty = qs("emptyState");
  const list = getFilteredProducts();

  qs("resultsCount").textContent = `${list.length} منتج`;

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.innerHTML = list.map(productCardHTML).join("");
}

function showSkeletonGrid(count = 8) {
  qs("productGrid").innerHTML = Array.from({ length: count }, skeletonCardHTML).join("");
}

/* ==========================================================================
   Cart badge + drawer
   ========================================================================== */

function renderCartBadge() {
  const count = cartCount();
  const badge = qs("cartCount");
  badge.textContent = count > 99 ? "99+" : count;
  badge.hidden = count === 0;
}

function cartLineHTML(product, qty) {
  return `
  <div class="cart-line" data-line="${product.id}">
    <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy" width="64" height="64" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--c-line)" />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-bold truncate">${escapeHTML(product.name)}</p>
      <p class="text-xs text-ink-soft mt-0.5">${escapeHTML(product.brand)}</p>
      <div class="flex items-center justify-between mt-2">
        <div class="qty-stepper">
          <button data-qty-minus="${product.id}" aria-label="إنقاص الكمية">−</button>
          <span>${qty}</span>
          <button data-qty-plus="${product.id}" aria-label="زيادة الكمية">+</button>
        </div>
        <span class="text-sm font-black">${formatPrice(product.price * qty)}</span>
      </div>
    </div>
    <button data-remove="${product.id}" class="text-ink-soft hover:text-red-600 shrink-0" aria-label="حذف">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
  </div>`;
}

function renderCartDrawer() {
  const body = qs("cartBody");
  const footer = qs("cartFooter");
  const items = cartItemsDetailed();

  if (items.length === 0) {
    body.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-16">
        <div class="w-16 h-16 rounded-full bg-[var(--c-bg-soft)] flex items-center justify-center mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#51606F" stroke-width="2"><path d="M6 6h15l-1.5 9h-13z"/><path d="M6 6 5 2H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>
        </div>
        <p class="font-bold">سلتك فارغة</p>
        <p class="text-sm text-ink-soft mt-1">أضف منتجات لتبدأ طلبك</p>
      </div>`;
    footer.classList.add("hidden");
    return;
  }

  body.innerHTML = items.map(({ product, qty }) => cartLineHTML(product, qty)).join("");
  footer.classList.remove("hidden");

  const subtotal = cartSubtotal();
  qs("cartSubtotal").textContent = formatPrice(subtotal);
  qs("cartTotal").textContent = formatPrice(subtotal);
}

/* ==========================================================================
   Quick View modal
   ========================================================================== */

function quickViewHTML(p) {
  return `
  <div class="grid md:grid-cols-2 gap-0">
    <div class="product-media" style="border-radius:0">
      <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover" />
      ${p.isBestSeller ? `<span class="badge badge-best">الأكثر مبيعًا</span>` : ""}
    </div>
    <div class="p-6 md:p-7">
      <button id="qvCloseBtn" class="icon-btn float-left" aria-label="إغلاق">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <p class="product-brand mb-1">${escapeHTML(p.brand)}</p>
      <h2 id="qvTitle" class="text-xl font-black leading-snug mb-2">${escapeHTML(p.name)}</h2>
      <div class="price-row mb-3">
        <span class="price-now text-xl">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
      </div>
      <div class="stock-row ${p.inStock ? "stock-in" : "stock-out"} mb-5">
        <span class="stock-dot"></span>${p.inStock ? "متوفر في المخزون" : "غير متوفر حاليًا"}
      </div>

      <div class="flex items-center gap-1 border-b border-[var(--c-line)] mb-4" role="tablist">
        <button class="tab-btn is-active" data-tab="desc" role="tab">الوصف</button>
        <button class="tab-btn" data-tab="usage" role="tab">طريقة الاستخدام</button>
        <button class="tab-btn" data-tab="ingredients" role="tab">المكونات</button>
      </div>
      <div class="text-sm text-ink-soft leading-relaxed mb-6" style="min-height:5.5em">
        <p data-tabpanel="desc">${escapeHTML(p.description)}</p>
        <p data-tabpanel="usage" class="hidden">${escapeHTML(p.usage)}</p>
        <p data-tabpanel="ingredients" class="hidden">${escapeHTML(p.ingredients)}</p>
      </div>

      <button class="add-cart-btn" data-add="${p.id}" data-qv-add ${!p.inStock ? "disabled" : ""}>
        ${p.inStock ? "أضف إلى السلة" : "غير متوفر"}
      </button>
    </div>
  </div>`;
}

function openQuickView(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return;
  qs("quickViewContent").innerHTML = quickViewHTML(p);
  openOverlay("quickViewScrim", "quickViewModal");

  qs("qvCloseBtn").addEventListener("click", () => closeOverlay("quickViewScrim", "quickViewModal"));
  document.querySelectorAll('#quickViewContent [data-tab]').forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('#quickViewContent [data-tab]').forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.querySelectorAll("#quickViewContent [data-tabpanel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.tabpanel !== btn.dataset.tab);
      });
    });
  });
}

/* ==========================================================================
   Overlay helpers (modals / drawer)
   ========================================================================== */

function openOverlay(scrimId, panelId) {
  qs(scrimId).classList.add("is-open");
  qs(panelId).classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeOverlay(scrimId, panelId) {
  qs(scrimId).classList.remove("is-open");
  qs(panelId).classList.remove("is-open");
  if (!anyOverlayOpen()) document.body.style.overflow = "";
}

function anyOverlayOpen() {
  return ["quickViewModal", "cartDrawer", "checkoutModal", "successModal"].some((id) =>
    qs(id).classList.contains("is-open")
  );
}

/* ==========================================================================
   Toast
   ========================================================================== */

let toastTimer;
function showToast(msg) {
  const toast = qs("toast");
  qs("toastMsg").textContent = msg;
  toast.classList.add("is-open");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-open"), 2200);
}

/* ==========================================================================
   Checkout: wilaya select, validation, order summary
   ========================================================================== */

function populateWilayaSelect() {
  const select = qs("wilaya");
  const options = WILAYAS.map(
    (w) => `<option value="${escapeHTML(w.name)}">${w.code} - ${escapeHTML(w.name)}</option>`
  ).join("");
  select.insertAdjacentHTML("beforeend", options);
}

function renderCheckoutSummary() {
  const items = cartItemsDetailed();
  qs("checkoutSummary").innerHTML = items
    .map(
      ({ product, qty }) => `
      <div class="flex items-center justify-between text-ink-soft">
        <span>${escapeHTML(product.name)} × ${qty}</span>
        <span class="font-semibold text-ink">${formatPrice(product.price * qty)}</span>
      </div>`
    )
    .join("");
  const total = cartSubtotal();
  qs("checkoutTotal").textContent = formatPrice(total);
}

function setFieldError(fieldName, hasError) {
  const input = qs(fieldName);
  const err = document.querySelector(`[data-error-for="${fieldName}"]`);
  input.classList.toggle("has-error", hasError);
  if (err) err.classList.toggle("hidden", !hasError);
}

function validateCheckoutForm(data) {
  let valid = true;

  if (!data.fullName || data.fullName.trim().length < 3) {
    setFieldError("fullName", true);
    valid = false;
  } else setFieldError("fullName", false);

  if (!validateAlgerianPhone(data.phone || "")) {
    setFieldError("phone", true);
    valid = false;
  } else setFieldError("phone", false);

  if (!data.wilaya) {
    setFieldError("wilaya", true);
    valid = false;
  } else setFieldError("wilaya", false);

  if (!data.commune || data.commune.trim().length < 2) {
    setFieldError("commune", true);
    valid = false;
  } else setFieldError("commune", false);

  return valid;
}

/* ==========================================================================
   Order dispatch: Telegram Bot API (fetch, no backend) + optional Sheet webhook
   ========================================================================== */

function buildOrderText(order) {
  const lines = order.items
    .map((i) => `• ${i.name} × ${i.qty} = ${formatPrice(i.price * i.qty)}`)
    .join("\n");

  return [
    `🛍️ طلب جديد — DermoPure`,
    `رقم الطلب: ${order.orderId}`,
    `الاسم: ${order.fullName}`,
    `الهاتف: ${order.phone}`,
    `الولاية: ${order.wilaya}`,
    `البلدية: ${order.commune}`,
    order.address ? `العنوان: ${order.address}` : null,
    ``,
    `المنتجات:`,
    lines,
    ``,
    `الإجمالي: ${formatPrice(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendOrderToTelegram(order) {
  const { botToken, chatId, enabled } = STORE_CONFIG.telegram;
  if (!enabled || !botToken || botToken.startsWith("YOUR_")) {
    console.info("[DermoPure] Telegram not configured — skipping API call. Order payload:", order);
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildOrderText(order),
      }),
    });
    return { ok: res.ok };
  } catch (err) {
    console.error("[DermoPure] Telegram send failed:", err);
    return { ok: false, error: true };
  }
}

async function sendOrderToSheet(order) {
  const url = STORE_CONFIG.googleSheetWebhookUrl;
  if (!url) return { ok: false, skipped: true };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
      mode: "no-cors", // Apps Script webhooks are typically opaque
    });
    return { ok: true };
  } catch (err) {
    console.error("[DermoPure] Sheet webhook failed:", err);
    return { ok: false, error: true };
  }
}

function buildWhatsAppUrl(order) {
  const text = buildOrderText(order);
  return `https://wa.me/${STORE_CONFIG.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

/* ==========================================================================
   Event wiring
   ========================================================================== */

function wireHeaderAndSearch() {
  const applyQuery = debounce((val) => {
    state.query = sanitizeSearchInput(val).trim();
    renderProductGrid();
  });

  qs("searchInput").addEventListener("input", (e) => applyQuery(e.target.value));
  qs("searchInputMobile").addEventListener("input", (e) => {
    qs("searchInput").value = e.target.value;
    applyQuery(e.target.value);
  });

  qs("mobileSearchBtn").addEventListener("click", () => {
    qs("mobileSearchWrap").classList.toggle("hidden");
    if (!qs("mobileSearchWrap").classList.contains("hidden")) qs("searchInputMobile").focus();
  });

  document.querySelectorAll("[data-cat]").forEach((el) => {
    // handled via delegation below (grid + nav injected dynamically)
  });

  document.addEventListener("click", (e) => {
    const catBtn = e.target.closest("[data-cat]");
    if (catBtn) {
      state.category = catBtn.dataset.cat;
      syncCategoryActiveStates();
      renderProductGrid();
      document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const sortBtn = e.target.closest("[data-sort]");
    if (sortBtn) {
      state.sort = sortBtn.dataset.sort;
      renderFilterChips();
      renderProductGrid();
    }
  });
}

function wireProductGridDelegation() {
  qs("productGrid").addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn && !addBtn.disabled) {
      addToCart(addBtn.dataset.add, 1);
      showToast("تمت الإضافة إلى السلة ✓");
      return;
    }
    const qvBtn = e.target.closest("[data-quickview]");
    if (qvBtn) {
      openQuickView(qvBtn.dataset.quickview);
      return;
    }
    // clicking media/title also opens quick view
    const card = e.target.closest(".product-card");
    if (card && !e.target.closest("[data-add]")) {
      openQuickView(card.dataset.id);
    }
  });
}

function wireQuickViewDelegation() {
  qs("quickViewContent").addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-qv-add]");
    if (addBtn && !addBtn.disabled) {
      addToCart(addBtn.dataset.add, 1);
      showToast("تمت الإضافة إلى السلة ✓");
    }
  });
  qs("quickViewScrim").addEventListener("click", () => closeOverlay("quickViewScrim", "quickViewModal"));
}

function wireCart() {
  qs("cartBtn").addEventListener("click", () => {
    renderCartDrawer();
    openOverlay("cartScrim", "cartDrawer");
  });
  qs("cartCloseBtn").addEventListener("click", () => closeOverlay("cartScrim", "cartDrawer"));
  qs("cartScrim").addEventListener("click", () => closeOverlay("cartScrim", "cartDrawer"));

  qs("cartBody").addEventListener("click", (e) => {
    const plus = e.target.closest("[data-qty-plus]");
    const minus = e.target.closest("[data-qty-minus]");
    const remove = e.target.closest("[data-remove]");

    if (plus) setQty(plus.dataset.qtyPlus, (cart[plus.dataset.qtyPlus] || 0) + 1);
    if (minus) setQty(minus.dataset.qtyMinus, (cart[minus.dataset.qtyMinus] || 0) - 1);
    if (remove) setQty(remove.dataset.remove, 0);
  });

  qs("checkoutBtn").addEventListener("click", () => {
    if (cartCount() === 0) return;
    closeOverlay("cartScrim", "cartDrawer");
    renderCheckoutSummary();
    openOverlay("checkoutScrim", "checkoutModal");
  });

  qs("whatsappOrderBtn").addEventListener("click", () => {
    if (cartCount() === 0) return;
    const order = {
      orderId: generateOrderId(),
      fullName: "—",
      phone: "—",
      wilaya: "—",
      commune: "—",
      address: "",
      items: cartItemsDetailed().map(({ product, qty }) => ({ name: product.name, qty, price: product.price })),
      total: cartSubtotal(),
    };
    window.open(buildWhatsAppUrl(order), "_blank", "noopener,noreferrer");
  });
}

function wireCheckoutForm() {
  qs("checkoutCloseBtn").addEventListener("click", () => closeOverlay("checkoutScrim", "checkoutModal"));
  qs("checkoutScrim").addEventListener("click", () => closeOverlay("checkoutScrim", "checkoutModal"));

  qs("checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    if (!validateCheckoutForm(data)) return;
    if (cartCount() === 0) return;

    const submitBtn = qs("checkoutSubmitBtn");
    const submitLabel = qs("checkoutSubmitLabel");
    submitBtn.disabled = true;
    const originalLabel = submitLabel.textContent;
    submitLabel.textContent = "جارٍ إرسال الطلب...";

    const order = {
      orderId: generateOrderId(),
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      wilaya: data.wilaya,
      commune: data.commune.trim(),
      address: (data.address || "").trim(),
      items: cartItemsDetailed().map(({ product, qty }) => ({ name: product.name, qty, price: product.price })),
      total: cartSubtotal(),
    };

    await Promise.allSettled([sendOrderToTelegram(order), sendOrderToSheet(order)]);

    submitBtn.disabled = false;
    submitLabel.textContent = originalLabel;

    closeOverlay("checkoutScrim", "checkoutModal");
    qs("successOrderId").textContent = `#${order.orderId}`;
    qs("successTotal").textContent = formatPrice(order.total);
    openOverlay("successScrim", "successModal");

    clearCart();
    e.target.reset();
  });
}

function wireSuccessModal() {
  qs("successCloseBtn").addEventListener("click", () => closeOverlay("successScrim", "successModal"));
  qs("successScrim").addEventListener("click", () => closeOverlay("successScrim", "successModal"));
}

function wireEscToClose() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    ["quickViewModal", "cartDrawer", "checkoutModal", "successModal"].forEach((panelId) => {
      const scrimId = panelId.replace("Modal", "Scrim").replace("Drawer", "Scrim");
      if (qs(panelId).classList.contains("is-open")) closeOverlay(scrimId, panelId);
    });
  });
}

/* ==========================================================================
   Footer WhatsApp link + init
   ========================================================================== */

function wireFooterLinks() {
  qs("footerWhatsapp").href = `https://wa.me/${STORE_CONFIG.whatsapp.number}`;
}

function init() {
  document.title = `${STORE_CONFIG.storeName} | ${STORE_CONFIG.storeNameAr} - ${STORE_CONFIG.storeTagline}`;

  renderNavPills();
  renderCategoryGrid();
  renderFilterChips();
  populateWilayaSelect();
  wireFooterLinks();

  showSkeletonGrid(8);
  // Simulate a brief network/render pass so skeleton loaders are visible,
  // then paint real content (also plays nicely with lazy image loading).
  setTimeout(() => {
    renderProductGrid();
    wireProductGridDelegation();
  }, 350);

  wireHeaderAndSearch();
  wireQuickViewDelegation();
  wireCart();
  wireCheckoutForm();
  wireSuccessModal();
  wireEscToClose();

  renderCartBadge();
  renderCartDrawer();
}

document.addEventListener("DOMContentLoaded", init);
