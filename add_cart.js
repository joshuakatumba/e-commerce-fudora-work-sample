const fs = require('fs');

const files = ['home.html', 'shop.html', 'blog.html', 'support.html', 'collections.html'];

const newCartIcon = `
        <div class="relative">
          <button id="cart-toggle-btn" class="text-gray-600 hover:text-black transition-colors focus:outline-none">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          </button>
          <span id="cart-count-badge" class="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-medium transition-all scale-0">
            0
          </span>
        </div>`;

const oldCartIconRegex = /<div class="relative">\s*<button class="text-gray-600 hover:text-black transition-colors">\s*<i data-lucide="shopping-bag" class="w-5 h-5"><\/i>\s*<\/button>\s*<span[^>]*>\s*0\s*<\/span>\s*<\/div>/;

// For the products in the grid
const productsData = [
  {
    name: "Retro Handheld Console",
    id: "retro-console",
    cat: "Technology",
    price: "59.99",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/156448c9-cf4f-480c-ac45-61157b204a8e_1600w.png"
  },
  {
    name: "Horizon Glow Sneakers",
    id: "horizon-sneakers",
    cat: "Footwear",
    price: "129.99",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/27666450-2d55-4c41-ade0-c14b1a69f54e_1600w.png"
  },
  {
    name: "Tropical Paradise Plant",
    id: "tropical-plant",
    cat: "Home",
    price: "39.99",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1b4ea31d-51d9-4e24-9acc-575762bd29f5_1600w.png"
  }
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace cart icon
  if (oldCartIconRegex.test(content)) {
    content = content.replace(oldCartIconRegex, newCartIcon);
  }

  // Replace product info blocks if it's home, shop, or collections
  if (['home.html', 'shop.html', 'collections.html'].includes(file)) {
    for (const p of productsData) {
      const regexStr = `<div class="space-y-1">\\s*<h3 class="text-xl font-semibold text-gray-900 tracking-tight">\\s*${p.name}\\s*</h3>\\s*<p class="text-base font-normal text-gray-700">${p.cat}</p>\\s*<p class="text-sm font-normal text-gray-500">USD \\$${p.price}</p>\\s*</div>`;
      const replaceRegex = new RegExp(regexStr);
      
      const newBlock = `
          <div class="space-y-1 mt-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 tracking-tight">${p.name}</h3>
                <p class="text-sm font-normal text-gray-500">${p.cat}</p>
              </div>
              <p class="text-base font-semibold text-gray-900">$${p.price}</p>
            </div>
            <button class="add-to-cart-btn w-full py-2 mt-3 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 active:scale-95 group/btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.img}">
              <span>Add to Cart</span>
              <i data-lucide="plus" class="w-4 h-4 transition-transform group-hover/btn:rotate-90"></i>
            </button>
          </div>`;
          
      content = content.replace(replaceRegex, newBlock);
    }
    
    // Also update Minimalist Chair in home.html
    if (file === 'home.html') {
      const chairBtnRegex = /<button\s+class="[^"]*add-to-cart-btn[^"]*"[^>]*>[\s\S]*?<\/button>/; // if it already has class
      const origChairBtnRegex = /<button\s+class="w-full py-2.5 mt-2 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black\/10 active:scale-95 group\/btn">\s*<span>Add to Cart<\/span>\s*<i data-lucide="shopping-bag"[^>]*><\/i>\s*<\/button>/;
      
      const newChairBtn = `
                    <button class="add-to-cart-btn w-full py-2.5 mt-2 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 group/btn" data-id="minimalist-chair" data-name="Minimalist Chair" data-price="249.00" data-image="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/45211788-2848-430a-9e43-0a8eea33cea9_800w.jpg">
                      <span>Add to Cart</span>
                      <i data-lucide="shopping-bag" class="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5"></i>
                    </button>`;
      content = content.replace(origChairBtnRegex, newChairBtn);
    }
  }

  fs.writeFileSync(file, content);
}
