/**
 * Wamsgoat peripheral reviews — search engine, theme toggle, and dropdown navigation
 */

(function () {
  'use strict';

  // Complete in-memory catalog for instant client-side search without CORS/fetch restrictions
  const REVIEWS = [
    // Mice
    { title: "Hitscan Hyperlight", category: "Mice", tag: "Wireless", url: "hitscan-hyperlight-review.html", date: "27/07/2026" },
    { title: "ATK U2 Pro", category: "Mice", tag: "Wireless", url: "atk-u2-pro-review.html", date: "27/07/2026" },
    { title: "PMM Zen Mini 8k", category: "Mice", tag: "Wireless", url: "pmm-zen-8k-mini-review.html", date: "27/07/2026" },
    { title: "PMM Cyber 4.1", category: "Mice", tag: "Wireless", url: "pmm-cyber-4.1-review.html", date: "27/07/2026" },
    { title: "Lamzu Inca", category: "Mice", tag: "Wireless", url: "lamzu-inca-review.html", date: "27/07/2026" },
    { title: "G-Wolves Lycan", category: "Mice", tag: "Wireless", url: "gw-lycan-review.html", date: "27/07/2026" },
    { title: "G-Wolves VUK", category: "Mice", tag: "Wireless", url: "gw-vuk-review.html", date: "27/07/2026" },
    { title: "Waizowl Cloud", category: "Mice", tag: "Wireless", url: "waizowl-cloud-review.html", date: "27/07/2026" },
    { title: "WLMouse Beast X Mini Pro", category: "Mice", tag: "Wireless", url: "wlm-bx-mini-pro-review.html", date: "27/07/2026" },

    // Mousepads
    { title: "Artisan FX Zero", category: "Mousepads", tag: "Balanced", url: "artisan-fx-zero-review.html", date: "27/07/2026" },
    { title: "PMM S2P 2.0", category: "Mousepads", tag: "Speed", url: "pmm-s2p-2.0-review.html", date: "27/07/2026" },
    { title: "The Masterpiece Vortex v1", category: "Mousepads", tag: "Speed", url: "the-masterpiece-vortex-v1-review.html", date: "27/07/2026" },

    // Accessories
    { title: "Ducklabs Green dots", category: "Accessories", tag: "Skates", url: "ducklabs-green-review.html", date: "27/07/2026" },

    // Guides
    { title: "Hall effect recommendation list", category: "Guides", tag: "Keyboards", url: "hall-effect-recommendation-list-guide.html", date: "14/08/2026" },
    { title: "How to find the right mousepad", category: "Guides", tag: "Mousepads", url: "how-to-find-the-right-mousepad-guide.html", date: "27/07/2026" },
    { title: "How to select the right mouse", category: "Guides", tag: "Mice", url: "how-to-select-the-right-mouse-guide.html", date: "27/07/2026" },
    { title: "How to wash your mousepad", category: "Guides", tag: "Mousepads", url: "how-to-wash-your-mousepad-guide.html", date: "27/07/2026" }
  ];

  /* -------------------------------------------------------------
     1. Theme Management
     ------------------------------------------------------------- */
  function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', function () {
      const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = curTheme === 'light' ? 'dark' : 'light';
      if (nextTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try {
        localStorage.setItem('wamsgoat-theme', nextTheme);
      } catch (e) {}
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'wamsgoat-theme') {
        if (e.newValue === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  }

  /* -------------------------------------------------------------
     2. Dropdown Menus
     ------------------------------------------------------------- */
  function initDropdowns() {
    function setupDropdown(buttonId) {
      const btn = document.getElementById(buttonId);
      if (!btn) return;
      const menu = btn.nextElementSibling;
      if (!menu) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown-menu.show').forEach(function (m) {
          if (m !== menu) m.classList.remove('show');
        });
        menu.classList.toggle('show');
      });
    }

    setupDropdown('top-nav-btn');
    setupDropdown('cat-dropdown-btn');

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown-wrap')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(function (m) {
          m.classList.remove('show');
        });
      }
    });
  }

  /* -------------------------------------------------------------
     3. Search Engine
     ------------------------------------------------------------- */
  function initSearch() {
    const searchInput = document.getElementById('site-search-input');
    const resultsContainer = document.getElementById('search-results');
    if (!searchInput || !resultsContainer) return;

    let selectedIndex = -1;

    function renderResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('show');
        selectedIndex = -1;
        return;
      }

      const terms = q.split(/\s+/).filter(Boolean);
      const matches = REVIEWS.filter(function (item) {
        const fullText = (item.title + ' ' + item.category + ' ' + item.tag).toLowerCase();
        return terms.every(function (t) { return fullText.includes(t); });
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="search-empty">No reviews or guides found for "<b>' + escapeHtml(query) + '</b>"</div>';
        resultsContainer.classList.add('show');
        selectedIndex = -1;
        return;
      }

      let html = '';
      matches.forEach(function (item, idx) {
        html += '<a href="' + item.url + '" class="search-result-item" data-index="' + idx + '">';
        html += '  <div class="search-result-header">';
        html += '    <span class="search-badge">' + escapeHtml(item.category) + '</span>';
        html += '    <span class="search-title">' + highlightText(item.title, terms) + '</span>';
        html += '  </div>';
        html += '  <span class="search-date">' + escapeHtml(item.date) + '</span>';
        html += '</a>';
      });

      resultsContainer.innerHTML = html;
      resultsContainer.classList.add('show');
      selectedIndex = -1;
    }

    searchInput.addEventListener('input', function () {
      renderResults(this.value);
    });

    searchInput.addEventListener('focus', function () {
      if (this.value.trim().length > 0) {
        renderResults(this.value);
      }
    });

    // Keyboard navigation: Arrow Up, Arrow Down, Enter, Escape
    searchInput.addEventListener('keydown', function (e) {
      const items = resultsContainer.querySelectorAll('.search-result-item');
      if (!items.length || !resultsContainer.classList.contains('show')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          items[selectedIndex].click();
        }
      } else if (e.key === 'Escape') {
        resultsContainer.classList.remove('show');
        searchInput.blur();
      }
    });

    function updateSelection(items) {
      items.forEach(function (el, idx) {
        if (idx === selectedIndex) {
          el.classList.add('selected');
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('selected');
        }
      });
    }

    // Dismiss search dropdown on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrap')) {
        resultsContainer.classList.remove('show');
      }
    });

    // Global shortcut (Ctrl + K or /) to focus search
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function highlightText(text, terms) {
    let result = escapeHtml(text);
    terms.forEach(function (term) {
      if (!term) return;
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });
    return result;
  }

  /* -------------------------------------------------------------
     Initialization
     ------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDropdowns();
    initSearch();
  });
})();
