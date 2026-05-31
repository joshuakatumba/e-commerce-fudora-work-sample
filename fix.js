const fs = require('fs');

// 1. Rebuild collections.html
const homeContent = fs.readFileSync('home.html', 'utf8');
const shopContent = fs.readFileSync('shop.html', 'utf8');

const navEndIndex = shopContent.indexOf('</nav>') + 6;
const navAndHead = shopContent.substring(0, navEndIndex).replace('<title>Fudora Ecommerce</title>', '<title>Fudora Ecommerce - Collections</title>');
const footerStartIndex = shopContent.indexOf('<!-- Main Footer Card -->');
const footerAndEnd = shopContent.substring(footerStartIndex);

const collectionsStart = homeContent.indexOf('<!-- Our Collections -->');
const blogStart = homeContent.indexOf('<!-- NEW BLOG SECTION -->');
const collectionsSections = homeContent.substring(collectionsStart, blogStart);

const collectionsHtml = navAndHead + '\n<main class="max-w-[1440px] mx-auto px-4 sm:px-6 pb-20">\n' + collectionsSections + '\n' + footerAndEnd;
fs.writeFileSync('collections.html', collectionsHtml);

// 2. Add Mobile Nav to all files
const files = ['home.html', 'shop.html', 'blog.html', 'support.html', 'collections.html'];

const mobileBtnHtml = `
        <button id="mobile-menu-btn" class="md:hidden text-gray-600 hover:text-black transition-colors ml-2 focus:outline-none">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>`;

const mobileMenuHtml = `
    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute top-full left-0 w-full shadow-lg origin-top">
      <div class="px-6 py-6 flex flex-col gap-5">
        <a href="home.html" class="text-lg font-medium text-gray-600 hover:text-black transition-colors">Home</a>
        <a href="shop.html" class="text-lg font-medium text-gray-600 hover:text-black transition-colors">Shop</a>
        <a href="collections.html" class="text-lg font-medium text-gray-600 hover:text-black transition-colors">Collections</a>
        <a href="blog.html" class="text-lg font-medium text-gray-600 hover:text-black transition-colors">Blog</a>
        <a href="support.html" class="text-lg font-medium text-gray-600 hover:text-black transition-colors">Support</a>
      </div>
    </div>
  </nav>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add the button
    if (!content.includes('id="mobile-menu-btn"')) {
        content = content.replace(/<\/span>\s*<\/div>\s*<\/div>/, '</span>\n        </div>' + mobileBtnHtml);
    }
    
    // Add the menu
    if (!content.includes('id="mobile-menu"')) {
        content = content.replace(/<\/nav>/, mobileMenuHtml);
    }
    
    fs.writeFileSync(file, content);
}

// 3. Add script to main.js
let mainJs = fs.readFileSync('main.js', 'utf8');
if (!mainJs.includes('mobile-menu-btn')) {
    mainJs += `

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
          btn.innerHTML = \`<i data-lucide="\${icon}" class="w-6 h-6"></i>\`;
          if (window.lucide) {
            window.lucide.createIcons();
          }
        });
      });
    });
  }
});
`;
    fs.writeFileSync('main.js', mainJs);
}

console.log("Done!");
