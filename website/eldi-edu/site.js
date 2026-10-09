'use strict';
(() => {
  const catalog = document.getElementById('catalog');
  const status = document.getElementById('catalog-status');
  const subject = document.getElementById('subject');
  const gradeButtons = [...document.querySelectorAll('[data-grade]')];
  let grade = 5;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function render() {
    const rows = window.ELDI_WEB_CATALOG.filter(row => row.grade === grade && (subject.value === 'all' || row.subject === subject.value));
    status.textContent = `${grade}. razred · ${rows.length} oblasti · sadržaj izdanja 12.0.0`;
    catalog.innerHTML = rows.map(row => `<article class="course-card"><span class="course-icon" aria-hidden="true">${escape(row.icon)}</span><h3>${escape(row.title)}</h3><p>${escape(row.description)}</p><ul>${row.topics.slice(0,5).map(topic=>`<li>${escape(topic)}</li>`).join('')}</ul>${row.topics.length>5?`<details><summary>Još ${row.topics.length-5} tema</summary><ul>${row.topics.slice(5).map(topic=>`<li>${escape(topic)}</li>`).join('')}</ul></details>`:''}<a class="text-link" href="#preuzimanje">Dostupno u Windows aplikaciji ↗</a></article>`).join('');
  }
  gradeButtons.forEach(button => button.addEventListener('click', () => {
    grade = Number(button.dataset.grade);
    gradeButtons.forEach(item=>item.setAttribute('aria-pressed', String(item===button)));
    render();
  }));
  subject.addEventListener('change', render);
  render();
})();
