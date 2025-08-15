
window.PRODUCTS = [{"id": 1, "slug": "orange-1l", "name": "Orange 1L Concentrate", "price": 1200, "desc": "Zesty citrus flavor kids love.", "image": "assets/prod-orange-1l.jpg"}, {"id": 2, "slug": "apple-1l", "name": "Apple 1L Concentrate", "price": 1200, "desc": "Crisp apple taste, great for lunch.", "image": "assets/prod-apple-1l.jpg"}, {"id": 3, "slug": "grape-1l", "name": "Grape 1L Concentrate", "price": 1200, "desc": "Sweet grape, classroom favorite.", "image": "assets/prod-grape-1l.jpg"}, {"id": 4, "slug": "lemon-1l", "name": "Lemon 1L Concentrate", "price": 1300, "desc": "Bright lemon for a refreshing sip.", "image": "assets/prod-lemon-1l.jpg"}, {"id": 5, "slug": "mango-1l", "name": "Mango 1L Concentrate", "price": 1500, "desc": "Tropical mango, smooth and sweet.", "image": "assets/prod-mango-1l.jpg"}, {"id": 6, "slug": "pineapple-1l", "name": "Pineapple 1L Concentrate", "price": 1400, "desc": "Tangy pineapple, full of sunshine.", "image": "assets/prod-pineapple-1l.jpg"}, {"id": 7, "slug": "strawberry-1l", "name": "Strawberry 1L Concentrate", "price": 1300, "desc": "Classic strawberry \u2014 sweet and fruity.", "image": "assets/prod-strawberry-1l.jpg"}, {"id": 8, "slug": "kiwi-1l", "name": "Kiwi 1L Concentrate", "price": 1500, "desc": "Unique kiwi flavor, slightly tart.", "image": "assets/prod-kiwi-1l.jpg"}, {"id": 9, "slug": "watermelon-1l", "name": "Watermelon 1L Concentrate", "price": 1200, "desc": "Light and juicy watermelon.", "image": "assets/prod-watermelon-1l.jpg"}, {"id": 10, "slug": "passionfruit-1l", "name": "Passionfruit 1L Concentrate", "price": 1600, "desc": "Exotic and aromatic passionfruit.", "image": "assets/prod-passionfruit-1l.jpg"}];

document.addEventListener('DOMContentLoaded', function() {
  // Theme handling (softer dark)
  const body = document.body;
  if (localStorage.getItem('pj_theme') === 'dark') body.classList.add('dark');
  document.getElementById('theme-toggle').addEventListener('click', function() { body.classList.toggle('dark'); localStorage.setItem('pj_theme', body.classList.contains('dark') ? 'dark' : 'light'); });

  // Mobile menu
  const hamburger = document.getElementById('hamburger-btn');
  const mobileLinks = document.getElementById('mobile-links');
  if (hamburger) hamburger.addEventListener('click', function() { if (mobileLinks.style.display === 'block') { mobileLinks.style.display = ''; } else { mobileLinks.style.display = 'block'; } });

  // CART and storage keys
  const CART_KEY = 'pj_cart_final';
  const SHIP_KEY = 'pj_ship_final';
  function readCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function writeCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); updateMiniCart(); }
  function addToCart(id, qty=1) { const cart = readCart(); const idx = cart.findIndex(i => i.id === id); if (idx > -1) cart[idx].qty += qty; else cart.push({id, qty}); writeCart(cart); animateCart(); }
  function removeFromCart(id) { let cart = readCart(); cart = cart.filter(i => i.id !== id); writeCart(cart); }
  function setQty(id, qty) { let cart = readCart(); const item = cart.find(i => i.id === id); if (!item) return; item.qty = Math.max(1, qty); writeCart(cart); }

  function getProduct(id) { return window.PRODUCTS.find(p => p.id === id); }

  // shipping helpers
  function calculateShippingFee(option) { if (!option) return 0; if (option === 'standard') return 0; if (option === 'express') return 300; if (option === 'international') return 2500; return 0; }
  function estimateDelivery(option) { const today = new Date(); let min=5, max=7; if (option === 'express') { min=2; max=3; } else if (option === 'international') { min=7; max=14; } const a = new Date(); a.setDate(a.getDate() + min); const b = new Date(); b.setDate(b.getDate() + max); return a.toLocaleDateString() + ' — ' + b.toLocaleDateString(); }

  // render mini-cart
  function updateMiniCart() { const body = document.getElementById('mini-cart-body'); const totalEl = document.getElementById('mini-cart-total'); const cart = readCart(); if (!body) return; body.innerHTML = ''; if (cart.length === 0) { body.innerHTML = '<div style="padding:.75rem;color:var(--muted)">No items yet</div>'; if (totalEl) totalEl.textContent = '₦0'; return; } let total=0; cart.forEach(item => { const p = getProduct(item.id); if (!p) return; const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center'; row.style.marginBottom='8px'; row.innerHTML = '<div style="display:flex;gap:.6rem;align-items:center"><img src="'+p.image+'" style="width:56px;height:56px;object-fit:cover;border-radius:8px"/><div><div style="font-weight:700">'+p.name+'</div><div style="color:var(--muted);font-size:13px">₦'+p.price+'</div></div></div><div style="text-align:right"><div style="font-weight:700">x'+item.qty+'</div><button data-remove="'+item.id+'" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button></div>'; body.appendChild(row); total += p.price * item.qty; }); if (totalEl) totalEl.textContent = '₦' + total; body.querySelectorAll('button[data-remove]').forEach(b => b.addEventListener('click', function(e) { removeFromCart(Number(e.target.dataset.remove)); })); updateCartCount(); }

  function updateCartCount() { const cart = readCart(); const count = cart.reduce((s,i)=>s+i.qty,0); const badge = document.getElementById('cart-count'); if (badge) badge.textContent = count; }

  // render cart page
  function renderCart() { const el = document.getElementById('cart-list'); if (!el) return; const cart = readCart(); el.innerHTML = ''; if (cart.length === 0) { el.innerHTML = '<div class="card">Your cart is empty</div>'; document.getElementById('cart-total').textContent = '₦0'; return; } let total = 0; cart.forEach(it => { const p = getProduct(it.id); if (!p) return; const row = document.createElement('div'); row.className = 'cart-item'; row.innerHTML = '<img src="'+p.image+'" style="width:96px;height:96px;object-fit:cover;border-radius:8px"/><div style="flex:1"><div style="font-weight:700">'+p.name+'</div><div style="color:var(--muted)">₦'+p.price+'</div></div><div><div class="qty"><button data-dec="'+p.id+'">-</button><div style="padding:.4rem .6rem;border-radius:6px;border:1px solid rgba(0,0,0,.06)">'+it.qty+'</div><button data-inc="'+p.id+'">+</button></div><div style="margin-top:.6rem"><button data-remove="'+p.id+'" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button></div></div>'; el.appendChild(row); total += p.price * it.qty; }); document.getElementById('cart-total').textContent = '₦' + total; // bind handlers
    el.querySelectorAll('button[data-inc]').forEach(b => b.addEventListener('click', function(e) { setQty(Number(e.target.dataset.inc), getQty(Number(e.target.dataset.inc))+1); }));
    el.querySelectorAll('button[data-dec]').forEach(b => b.addEventListener('click', function(e) { const id = Number(e.target.dataset.dec); const q = getQty(id)-1; if (q <= 0) removeFromCart(id); else setQty(id,q); }));
    el.querySelectorAll('button[data-remove]').forEach(b => b.addEventListener('click', function(e) { removeFromCart(Number(e.target.dataset.remove)); }));
  }

  function getQty(id) { const c = readCart().find(i => i.id === id); return c ? c.qty : 0; }

  // attach add-to-cart actions (delegation)
  document.addEventListener('click', function(e) { const t = e.target; if (t && t.dataset && t.dataset.addToCart) { addToCart(Number(t.dataset.addToCart),1); } });

  // mini-cart toggle
  const cartBtn = document.getElementById('cart-btn');
  const mini = document.getElementById('mini-cart');
  if (cartBtn) cartBtn.addEventListener('click', function() { if (mini) mini.classList.toggle('open'); });
  document.addEventListener('click', function(ev) { if (mini && !mini.contains(ev.target) && !cartBtn.contains(ev.target)) mini.classList.remove('open'); });

  // shipping handling on checkout page
  const shipSelect = document.getElementById('shipping-option');
  if (shipSelect) { const stored = JSON.parse(localStorage.getItem(SHIP_KEY) || 'null'); if (stored) shipSelect.value = stored.option; const updateShip = function() { const opt = shipSelect.value; const data = { option: opt, fee: calculateShippingFee(opt), estimate: estimateDelivery(opt) }; localStorage.setItem(SHIP_KEY, JSON.stringify(data)); document.getElementById('delivery-estimate').textContent = data.estimate; renderCheckoutSummary(); }; shipSelect.addEventListener('change', updateShip); updateShip(); }

  function renderCheckoutSummary() { const el = document.getElementById('checkout-summary'); if (!el) return; const cart = readCart(); let subtotal = 0; let lines = ''; cart.forEach(it => { const p = getProduct(it.id); if (!p) return; lines += '<div style="display:flex;justify-content:space-between"><div>'+p.name+' x'+it.qty+'</div><div>₦'+(p.price*it.qty)+'</div></div>'; subtotal += p.price*it.qty; }); const ship = JSON.parse(localStorage.getItem(SHIP_KEY) || 'null'); const shipFee = calculateShippingFee(ship ? ship.option : 'standard'); const total = subtotal + shipFee; el.innerHTML = lines + '<hr/><div style="display:flex;justify-content:space-between;font-weight:800;margin-top:.6rem"><div>Subtotal</div><div>₦'+subtotal+'</div></div><div style="display:flex;justify-content:space-between;margin-top:.4rem"><div>Shipping</div><div>₦'+shipFee+'</div></div><div style="display:flex;justify-content:space-between;font-weight:900;margin-top:.6rem"><div>Total</div><div>₦'+total+'</div></div>'; updateCartCount(); }

  // checkout submit (demo)
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) checkoutForm.addEventListener('submit', function(e) { e.preventDefault(); const name = checkoutForm.querySelector('[name=name]').value; if (!name) { alert('Please enter your name'); return; } // simulate order
    localStorage.removeItem(CART_KEY); renderCart(); updateMiniCart(); alert('Thanks ' + name + '. Order placed (demo).'); window.location.href = 'home.html'; });

  // login/register demo
  const reg = document.getElementById('register-form');
  if (reg) reg.addEventListener('submit', function(e) { e.preventDefault(); const name = document.getElementById('reg-name').value || ''; const email = document.getElementById('reg-email').value; const pw = document.getElementById('reg-password').value; localStorage.setItem('pj_user', JSON.stringify({name,email,password:pw})); alert('Registered. Please login.'); window.location.href = 'login.html'; });
  const login = document.getElementById('login-form');
  if (login) login.addEventListener('submit', function(e) { e.preventDefault(); const email = document.getElementById('login-email').value; const pw = document.getElementById('login-password').value; const u = JSON.parse(localStorage.getItem('pj_user') || 'null'); if (u && u.email === email && u.password === pw) { localStorage.setItem('pj_logged_in','1'); localStorage.setItem('pj_name', u.name || email.split('@')[0]); alert('Welcome ' + (u.name || email.split('@')[0]) + '!'); window.location.href = 'home.html'; } else alert('Invalid credentials'); });

  // initial render
  updateMiniCart(); renderCart(); renderCheckoutSummary();

  // render shop listings if present (safe: read from window.PRODUCTS)
  const shopGrid = document.getElementById('shop-grid');
  if (shopGrid && window.PRODUCTS) { shopGrid.innerHTML = ''; window.PRODUCTS.forEach(p => { const card = document.createElement('div'); card.className = 'card product'; card.innerHTML = '<img src="'+p.image+'" alt="'+p.name+'"/><h4 style="margin:.6rem 0">'+p.name+'</h4><div style="color:var(--muted);margin-bottom:.6rem">₦'+p.price+'</div><div style="display:flex;gap:.5rem"><button class="cta" data-add-to-cart="'+p.id+'">Add to cart</button><a href="product-'+p.slug+'.html" style="align-self:center;padding:.5rem .6rem;border-radius:8px;background:transparent;border:1px solid rgba(0,0,0,.06);text-decoration:none;color:var(--muted)">Details</a></div>'; shopGrid.appendChild(card); }); }

  function animateCart() { const btn = document.getElementById('cart-btn'); if (!btn) return; btn.classList.add('cart-bounce'); setTimeout(() => btn.classList.remove('cart-bounce'), 600); }

});
