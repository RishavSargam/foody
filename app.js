// --- Products & Cart ---
const products = [
  {id:1,title:'Organic Peach Spread',price:199.00,img:'https://images.unsplash.com/photo-1561043433-aaf687c4cf4b?auto=format&fit=crop&w=600&q=60',tag:'Organic'},
  {id:2,title:'Crunchy Chickpeas',price:149.00,img:'https://images.unsplash.com/photo-1514512364185-7f2f6d3f0a1b?auto=format&fit=crop&w=600&q=60',tag:'Snacks'},
  {id:3,title:'Black Forest Berries',price:99.00,img:'https://images.unsplash.com/photo-1505577058444-a3dab5f6f2c8?auto=format&fit=crop&w=600&q=60',tag:'Fruits'},
  {id:4,title:'Organic Soup',price:249.00,img:'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=60',tag:'Grocery'},
  {id:5,title:'Fruit Snacks',price:179.00,img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60',tag:'Snacks'},
  {id:6,title:'Vegan Curry Sauce',price:329.00,img:'https://images.unsplash.com/photo-1514512364185-7f2f6d3f0a1b?auto=format&fit=crop&w=600&q=60',tag:'Sauce'}
];

const productListEl = document.getElementById('productList');
const cartCountEl = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const langSelect = document.getElementById('langSelect');
let cart = JSON.parse(localStorage.getItem('foody_cart') || '[]');

// --- Cart Functions ---
function updateCartUI() {
  cartCountEl.textContent = cart.length;
}
function saveCart() {
  localStorage.setItem('foody_cart', JSON.stringify(cart));
}

// --- Render Products ---
function renderProducts(list) {
  productListEl.innerHTML = '';
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    const inCart = cart.find(item => item.id === p.id);
    col.innerHTML = `
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.img}" class="card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${p.title}</h6>
          <p class="card-text text-muted small mb-2">${p.tag}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong>₹${p.price.toFixed(2)}</strong>
            <button class="btn btn-sm btn-success addBtn">${inCart ? 'Added' : 'Add to cart'}</button>
          </div>
        </div>
      </div>
    `;
    const btn = col.querySelector('.addBtn');
    if(inCart) btn.disabled = true;
    btn.addEventListener('click', () => {
      cart.push({id: p.id, qty: 1, title: p.title, price: p.price});
      saveCart();
      updateCartUI();
      btn.textContent = 'Added';
      btn.disabled = true;
    });
    productListEl.appendChild(col);
  });
}

// --- Initial Render ---
updateCartUI();
renderProducts(products);

// --- Search & Sort ---
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

sortSelect.addEventListener('change', () => {
  const v = sortSelect.value;
  let arr = [...products];
  if(v == 'price-asc') arr.sort((a,b) => a.price - b.price);
  else if(v == 'price-desc') arr.sort((a,b) => b.price - a.price);
  else if(v == 'pop') arr.reverse();
  renderProducts(arr);
});

// --- Track Order (Mock) ---
document.getElementById('trackOrderBtn').addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('trackModal'));
  document.getElementById('trackResult').textContent = '';
  document.getElementById('orderId').value = '';
  modal.show();
});
document.getElementById('trackBtn').addEventListener('click', () => {
  const id = document.getElementById('orderId').value.trim();
  const res = document.getElementById('trackResult');
  if(!id) { res.textContent = 'Please enter an order id.'; return; }
  const statuses = ['Order received','Preparing at shop','Out for delivery','Delivered'];
  const hash = Math.abs(id.split('').reduce((acc,ch) => acc + ch.charCodeAt(0), 0));
  const idx = hash % statuses.length;
  res.textContent = `Status: ${statuses[idx]} (mock)`;
});

// --- Login Modal (Mock) ---
document.getElementById('loginBtn').addEventListener('click', () => {
  const m = new bootstrap.Modal(document.getElementById('loginModal'));
  document.getElementById('loginMsg').textContent = '';
  document.getElementById('emailInput').value = '';
  document.getElementById('passwordInput').value = '';
  m.show();
});
document.getElementById('doLoginBtn').addEventListener('click', () => {
  const email = document.getElementById('emailInput').value.trim();
  const pass = document.getElementById('passwordInput').value.trim();
  const msg = document.getElementById('loginMsg');
  if(!email || !pass) { msg.textContent = 'Please enter email and password.'; return; }
  msg.classList.remove('text-danger'); msg.classList.add('text-success');
  msg.textContent = 'Signed in (mock). Close modal to continue.';
});

// --- Language Switch ---
langSelect.addEventListener('change', () => {
  const lang = langSelect.value;
  if(lang==='hi'){
    document.querySelectorAll('.brand, .brand-small').forEach(el => el.textContent = 'FOODY');
    document.getElementById('trackModalLabel').textContent = 'ऑर्डर ट्रैक करें';
    document.getElementById('loginModalLabel').textContent = 'FOODY में साइन इन करें';
    document.querySelector('.hero .display-5').textContent = 'ताज़ा खाना। तेज डिलीवरी।';
    document.querySelector('.hero .lead').textContent = 'स्थानीय स्रोत से प्राप्त सामग्री — आपके दरवाज़े तक घंटों में।';
    document.querySelector('#about h4').textContent = '100% ताज़ा — हमेशा ताज़ा';
  } else {
    document.querySelector('.hero .display-5').textContent = 'Fresh food. Faster delivery.';
    document.querySelector('.hero .lead').textContent = 'Locally sourced produce & groceries — delivered to your door in hours.';
    document.querySelector('#about h4').textContent = '100% Fresh — Always Fresh';
    document.getElementById('trackModalLabel').textContent = 'Track your order';
    document.getElementById('loginModalLabel').textContent = 'Sign in to FOODY';
  }
});

// --- Cursor Widget & Mini Popup ---
const cursorUrls = {
  spoon: 'https://cdn-icons-png.flaticon.com/32/3075/3075977.png',
  knife: 'https://cdn-icons-png.flaticon.com/32/3075/3075984.png',
  plate: 'https://cdn-icons-png.flaticon.com/32/3075/3075987.png',
  screw: 'https://cdn-icons-png.flaticon.com/32/3075/3075980.png'
};

function makeDraggable(el, movePopup = false, popupEl = null) {
  let dragging = false, offsetX = 0, offsetY = 0;
  el.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.cursor = 'grabbing';
    el.style.transition = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (movePopup && popupEl) {
      popupEl.style.left = x + 'px';
      popupEl.style.top = (y - popupEl.offsetHeight - 10) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      el.style.cursor = 'grab';
      el.style.transition = '';
    }
  });

  // Optional click toggle for popup
  if (movePopup && popupEl) {
    el.addEventListener('click', () => {
      if (!dragging) {
        popupEl.style.display = popupEl.style.display === 'block' ? 'none' : 'block';
      }
    });
  }
}

// Mini button & popup
const miniBtn = document.getElementById('cursorMiniBtn');
const popup = document.getElementById('cursorPopup');
makeDraggable(miniBtn, true, popup);

// Cursor change for interactive elements
const specialElements = document.querySelectorAll(' .btn, .category-card, .product-card');
document.getElementById('cursorSelect').addEventListener('change', e => {
  const selected = e.target.value;
  specialElements.forEach(el => {
    el.style.cursor = `url('${cursorUrls[selected]}') 4 28, pointer`;
  });
  // --- Cursor Options ---
const cursorUrls = {
  default:'', 
  spoon:'https://cdn-icons-png.flaticon.com/32/3075/3075977.png',
  knife:'https://cdn-icons-png.flaticon.com/32/3075/3075984.png',
  plate:'https://cdn-icons-png.flaticon.com/32/3075/3075987.png',
  screw:'https://cdn-icons-png.flaticon.com/32/3075/3075980.png'
};

const specialElements = document.querySelectorAll('.navbar a, .btn, .category-card, .product-card');

document.getElementById('cursorSelect').addEventListener('change', e => {
  const selected = e.target.value;  // <-- This gets the selected option
  specialElements.forEach(el => {
    if(selected === 'default'){
      el.style.cursor = 'pointer'; // default pointer
    } else {
      el.style.cursor = `url('${cursorUrls[selected]}') 4 28, pointer`; // custom cursor
    }
  });
});

// --- Chat & Help Buttons ---
document.getElementById('chatBtn').addEventListener('click', () => {
  alert('Hello! How can we help you today? (mock chat)');
});

document.getElementById('helpBtn').addEventListener('click', () => {
  alert('Help & FAQ: Visit our website or contact support@foody.com');
});

// --- Make Mini Button Draggable and Toggle Popup ---
function makeDraggable(el, movePopup = false, popupEl = null) {
  let dragging = false, offsetX = 0, offsetY = 0;
  el.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.cursor = 'grabbing';
    el.style.transition = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (movePopup && popupEl) {
      popupEl.style.left = x + 'px';
      popupEl.style.top = (y - popupEl.offsetHeight - 10) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      el.style.cursor = 'grab';
      el.style.transition = '';
    }
  });

  if (movePopup && popupEl) {
    el.addEventListener('click', () => {
      if (!dragging) {
        popupEl.style.display = popupEl.style.display === 'block' ? 'none' : 'block';
      }
    });
  }
}

const miniBtn = document.getElementById('cursorMiniBtn');
const popup = document.getElementById('cursorPopup');
makeDraggable(miniBtn, true, popup);

});