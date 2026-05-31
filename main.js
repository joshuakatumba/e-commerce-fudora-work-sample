lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});

// --- TESTIMONIALS (Next/Prev + dots) ---
(function () {
  const prevBtn = document.getElementById("tPrev");
  const nextBtn = document.getElementById("tNext");
  const avatarEl = document.getElementById("tAvatar");
  const quoteEl = document.getElementById("tQuote");
  const nameEl = document.getElementById("tName");
  const roleEl = document.getElementById("tRole");
  const dotsEl = document.getElementById("tDots");

  if (!prevBtn || !nextBtn || !avatarEl || !quoteEl || !nameEl || !roleEl || !dotsEl) return;

  const testimonials = [
    {
      avatar: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
      quote: "The layout feels premium and effortless. Our conversion rate went up within the first week after switching.",
      name: "Ava Thompson",
      role: "Verified Buyer",
    },
    {
      avatar: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg",
      quote: "Beautiful motion, clean hierarchy, and it loads fast. It finally looks like a modern brand, not a template.",
      name: "Noah Patel",
      role: "Store Owner",
    },
    {
      avatar: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp",
      quote: "The product grids and collection cards are so easy to scan. Customers find what they want faster now.",
      name: "Mia Laurent",
      role: "Verified Buyer",
    },
    {
      avatar: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
      quote: "It feels like Apple-level polish with ecommerce practicality. Smooth, minimal, and confident.",
      name: "Ethan Rivera",
      role: "Creative Director",
    },
  ];

  let index = 0;

  // Small fade transition (no dependencies)
  function animateSwap() {
    const targets = [avatarEl, quoteEl, nameEl, roleEl, dotsEl];
    targets.forEach((el) => {
      el.style.transition = "opacity 240ms ease, transform 240ms ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
    });

    window.setTimeout(() => {
      render();
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }, 220);
  }

  function renderDots() {
    dotsEl.innerHTML = "";
    testimonials.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      b.className = "h-2.5 rounded-full transition-all duration-300 " + (i === index ? "w-10 bg-gray-900" : "w-2.5 bg-gray-300 hover:bg-gray-400");
      b.addEventListener("click", () => {
        if (i === index) return;
        index = i;
        animateSwap();
      });
      dotsEl.appendChild(b);
    });
  }

  function render() {
    const t = testimonials[index];
    avatarEl.src = t.avatar;
    avatarEl.alt = `${t.name} avatar`;
    quoteEl.textContent = t.quote;
    nameEl.textContent = t.name;
    roleEl.textContent = t.role;
    renderDots();

    // Lucide re-scan (safe to call; fixes any icon updates elsewhere too)
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function next() {
    index = (index + 1) % testimonials.length;
    animateSwap();
  }
  function prev() {
    index = (index - 1 + testimonials.length) % testimonials.length;
    animateSwap();
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Optional: keyboard support when section is in view
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // First paint
  render();

  // Start visible (so the first transition doesn’t flash)
  [avatarEl, quoteEl, nameEl, roleEl, dotsEl].forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
})();


// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelectorAll('#mobile-menu-btn');
  const mobileMenu = document.querySelectorAll('#mobile-menu');
  
  if (mobileMenuBtn.length && mobileMenu.length) {
    mobileMenuBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.forEach(menu => {
          menu.classList.toggle('hidden');
          const icon = menu.classList.contains('hidden') ? 'menu' : 'x';
          btn.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i>`;
          if (window.lucide) {
            window.lucide.createIcons();
          }
        });
      });
    });
  }
});


// ==========================================
// CART LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Create Cart Modal HTML and append to body
  const cartHTML = `
    <!-- Cart Overlay -->
    <div id="cart-overlay" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <!-- Cart Drawer -->
    <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] translate-x-full transition-transform duration-300 flex flex-col">
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-xl font-semibold tracking-tight">Your Cart</h2>
        <button id="close-cart-btn" class="p-2 -mr-2 text-gray-400 hover:text-black transition-colors focus:outline-none">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div id="cart-items-container" class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Cart Items Go Here -->
      </div>
      <div class="border-t border-gray-100 p-6 bg-gray-50">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-600">Subtotal</span>
          <span id="cart-subtotal" class="text-xl font-semibold">$0.00</span>
        </div>
        <button class="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors flex justify-center items-center gap-2">
          Proceed to Checkout
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);

  // Initialize Lucide icons for newly added elements
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. State & DOM Elements
  let cart = JSON.parse(localStorage.getItem('fudora_cart')) || [];
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  const toggleBtns = document.querySelectorAll('#cart-toggle-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const itemsContainer = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const countBadges = document.querySelectorAll('#cart-count-badge');
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

  // 3. Helper Functions
  const saveCart = () => localStorage.setItem('fudora_cart', JSON.stringify(cart));
  
  const updateUI = () => {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadges.forEach(badge => {
      badge.textContent = totalItems;
      if (totalItems > 0) {
        badge.classList.remove('scale-0');
        badge.classList.add('scale-100');
      } else {
        badge.classList.remove('scale-100');
        badge.classList.add('scale-0');
      }
    });

    // Render Items
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
          <i data-lucide="shopping-bag" class="w-12 h-12 opacity-20"></i>
          <p>Your cart is empty</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex gap-4 items-center">
          <div class="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain mix-blend-multiply">
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">${item.name}</h4>
            <p class="text-sm text-gray-500 mt-1">$${item.price}</p>
            <div class="flex items-center gap-3 mt-2">
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:text-black hover:border-black transition-colors" onclick="updateQuantity(${index}, -1)">
                <i data-lucide="minus" class="w-3 h-3"></i>
              </button>
              <span class="text-sm font-medium w-4 text-center">${item.quantity}</span>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:text-black hover:border-black transition-colors" onclick="updateQuantity(${index}, 1)">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
            </div>
          </div>
          <button class="p-2 text-gray-300 hover:text-red-500 transition-colors ml-auto flex-shrink-0" onclick="removeFromCart(${index})">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `).join('');
    }

    // Update Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    subtotalEl.textContent = '$' + subtotal.toFixed(2);

    if (window.lucide) window.lucide.createIcons();
  };

  // Global functions for inline onclick handlers
  window.updateQuantity = (index, delta) => {
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart();
      updateUI();
    }
  };

  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateUI();
  };

  // 4. Toggle Logic
  const openCart = () => {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeCart = () => {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  };

  toggleBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  // 5. Add to Cart Logic
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const image = btn.getAttribute('data-image');

      if (!id) return; // Ignore if no data

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, name, price, image, quantity: 1 });
      }

      saveCart();
      updateUI();
      openCart();
    });
  });

  // Initial render
  updateUI();
});
