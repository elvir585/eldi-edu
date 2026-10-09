'use strict';
window.ELDIPortal = Object.freeze({
  mount({root}) {
    root.innerHTML = `<div class="eyebrow">UPINITK / OBRAZOVNI CENTAR</div><h1>ELDI EDU na tvojoj web stranici.</h1><p>Preuzimanja, pregled sadržaja po razredima, upute i podrška na upinitk.com/eldi-edu/.</p><div class="grid"><article class="card"><h2>Obrazovni centar</h2><p>Pregled matematike, Scratcha i programiranja, slike aplikacije i kratki video.</p><button class="primary" data-portal="center">Otvori ELDI EDU centar ↗</button></article><article class="card"><h2>Upute i podrška</h2><p>Koraci za početak, rad s profilima i upute za nastavnike.</p><div class="row"><button data-portal="instructions">Otvori upute ↗</button><button data-portal="support">Podrška ↗</button></div></article><article class="card"><h2>Nova izdanja</h2><p>Windows aplikacija i kompletan ZIP preuzimaju se sa službenog GitHub repozitorija.</p><button data-portal="releases">Preuzimanja na GitHubu ↗</button></article></div><p>Veze se otvaraju u vanjskom pregledniku i zahtijevaju internet. Otvaranje veze ne šalje učenički profil ni radove; oni ostaju na ovom računaru.</p><p id="portal-status" role="status" aria-live="polite"></p>`;
    const status = root.querySelector('#portal-status');
    root.querySelectorAll('[data-portal]').forEach(button => button.addEventListener('click', async () => {
      if (!window.eldiDesktop?.openPortal) {status.textContent='Otvaranje centra dostupno je u Windows aplikaciji. Adresa: https://upinitk.com/eldi-edu/';return;}
      button.disabled=true;
      try {await window.eldiDesktop.openPortal(button.dataset.portal);status.textContent='Veza je otvorena u pregledniku.';}
      catch {status.textContent='Preglednik nije otvoren. Provjeri vezu s internetom ili ručno otvori upinitk.com/eldi-edu/.';}
      finally {button.disabled=false;}
    }));
  }
});
