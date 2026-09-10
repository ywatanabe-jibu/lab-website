/* main.js — shared utilities */

// Active nav link
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// Mobile menu
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

/* ---- Members page ---- */
async function loadMembers() {
  const wrap = document.getElementById('members-wrap');
  if (!wrap) return;

  const res = await fetch('data/members.json');
  const data = await res.json();

  const sections = [
    { key: 'professor', label_ja: '教授', label_en: 'Professor' },
    { key: 'staff',     label_ja: 'スタッフ', label_en: 'Staff' },
    { key: 'phd',       label_ja: '博士課程', label_en: 'Ph.D. Students' },
    { key: 'master',    label_ja: '修士課程', label_en: 'Master Students' },
    { key: 'undergrad', label_ja: '学部生',   label_en: 'Undergraduate' },
  ];

  wrap.innerHTML = sections.map(s => {
    const members = data[s.key];
    if (!members || members.length === 0) return '';
    return `
      <div class="member-section">
        <div class="member-section-title">${s.label_ja} / ${s.label_en}</div>
        <ul class="member-list">
          ${members.map(m => `
            <li class="member-item ${s.key === 'professor' ? 'professor' : ''}">
              <div class="member-name">${m.name_ja}</div>
              <div class="member-name-en">${m.name_en}</div>
              <div class="member-role">${m.role_ja ? m.role_ja + ' / ' + m.role_en : ''}</div>
              ${m.email ? `<div class="member-email">✉ ${m.email}</div>` : ''}
              ${m.interests ? `<div class="member-email" style="margin-top:6px">${m.interests}</div>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

/* ---- Papers page ---- */
async function loadPapers() {
  const wrap = document.getElementById('papers-wrap');
  if (!wrap) return;

  const res = await fetch('data/papers.json');
  const papers = await res.json();

  if (!papers.length) {
    wrap.innerHTML = '<p style="color:var(--text-sub)">論文データを data/papers.json に追加してください。</p>';
    return;
  }

  const byYear = {};
  papers.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = [];
    byYear[p.year].push(p);
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);

  wrap.innerHTML = years.map(year => `
    <div style="margin-bottom:40px">
      <div class="section-heading" style="font-size:18px;margin-bottom:16px">${year}</div>
      <ul class="papers-list">
        ${byYear[year].map(p => `
          <li class="paper-item">
            <div class="paper-title">${p.title}</div>
            <div class="paper-meta">
              ${p.authors}<br>
              <em>${p.journal}</em>${p.volume ? `, ${p.volume}` : ''}${p.pages ? `:${p.pages}` : ''}
              ${p.doi ? `&nbsp;— <a href="${p.doi}" target="_blank" rel="noopener">DOI</a>` : ''}
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

loadMembers();
loadPapers();
