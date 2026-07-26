const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const dialogCaption = dialog.querySelector('p');
document.querySelectorAll('.gallery-image').forEach(button => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.image;
  dialogImage.alt = button.querySelector('img').alt;
  dialogCaption.textContent = button.dataset.caption;
  dialog.showModal();
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

document.querySelector('#year').textContent = new Date().getFullYear();

(() => {
  const calendar = document.querySelector('.availability-calendar');
  if (!calendar) return;
  const months = calendar.querySelector('.calendar-months');
  const status = calendar.querySelector('.availability-calendar-status');
  const labels = {
    en: ['Live availability', 'Dates shown in terracotta are unavailable.', 'Available', 'Unavailable', 'Loading availability…', 'Availability is temporarily unavailable. Please send an enquiry to confirm your dates.', 'Updated', 'Show previous months', 'Show next months'],
    es: ['Disponibilidad en directo', 'Las fechas en terracota no están disponibles.', 'Disponible', 'No disponible', 'Cargando disponibilidad…', 'La disponibilidad no está disponible temporalmente. Envíanos una consulta para confirmar tus fechas.', 'Actualizado', 'Mostrar meses anteriores', 'Mostrar los próximos meses'],
    fr: ['Disponibilités en direct', 'Les dates en terre cuite ne sont pas disponibles.', 'Disponible', 'Indisponible', 'Chargement des disponibilités…', 'Les disponibilités sont temporairement indisponibles. Envoyez-nous une demande pour confirmer vos dates.', 'Mis à jour', 'Afficher les mois précédents', 'Afficher les mois suivants'],
    de: ['Aktuelle Verfügbarkeit', 'In Terrakotta angezeigte Daten sind nicht verfügbar.', 'Verfügbar', 'Nicht verfügbar', 'Verfügbarkeit wird geladen…', 'Die Verfügbarkeit ist vorübergehend nicht verfügbar. Senden Sie uns eine Anfrage, um Ihre Daten zu bestätigen.', 'Aktualisiert', 'Vorherige Monate anzeigen', 'Nächste Monate anzeigen']
  };
  const locales = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' };
  let language = document.documentElement.lang || 'en'; let unavailable = []; let offset = 0; let updatedAt = null; let loadFailed = false;
  const today = new Date(); const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const text = () => labels[language] || labels.en;
  function render() {
    const copy = text(); const locale = locales[language] || locales.en;
    calendar.querySelector('#availability-title').textContent = copy[0]; calendar.querySelector('.availability-calendar-intro').textContent = copy[1];
    calendar.querySelector('.calendar-legend-available + b').textContent = copy[2]; calendar.querySelector('.calendar-legend-unavailable + b').textContent = copy[3];
    calendar.querySelector('[data-calendar-previous]').setAttribute('aria-label', copy[7]); calendar.querySelector('[data-calendar-next]').setAttribute('aria-label', copy[8]);
    status.textContent = updatedAt ? `${copy[6]} ${new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(updatedAt)}.` : (loadFailed ? copy[5] : copy[4]);
    months.replaceChildren();
    for (let display = 0; display < 2; display += 1) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset + display, 1); const year = date.getFullYear(); const month = date.getMonth();
      const section = document.createElement('section'); const title = document.createElement('h3'); title.className = 'calendar-month-title'; title.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date); section.append(title);
      const weekdays = document.createElement('div'); weekdays.className = 'calendar-weekdays';
      for (let day = 0; day < 7; day += 1) { const item = document.createElement('span'); item.textContent = new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + day)); weekdays.append(item); }
      section.append(weekdays); const days = document.createElement('div'); days.className = 'calendar-days';
      for (let empty = 0; empty < (date.getDay() + 6) % 7; empty += 1) days.append(document.createElement('span'));
      const totalDays = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= totalDays; day += 1) { const key = dateKey(year, month, day); const blocked = unavailable.some(range => key >= range.start && key < range.end); const cell = document.createElement('span'); cell.className = `calendar-day${blocked ? ' is-unavailable' : ''}${key < dateKey(today.getFullYear(), today.getMonth(), today.getDate()) ? ' is-past' : ''}`; cell.textContent = day; cell.setAttribute('aria-label', `${day} ${title.textContent}: ${blocked ? copy[3] : copy[2]}`); days.append(cell); }
      section.append(days); months.append(section);
    }
  }
  calendar.querySelector('[data-calendar-previous]').addEventListener('click', () => { offset -= 2; render(); });
  calendar.querySelector('[data-calendar-next]').addEventListener('click', () => { offset += 2; render(); });
  document.addEventListener('casa-feliz-language-change', event => { language = event.detail.language; render(); });
  fetch('availability.json', { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error('Availability request failed'); return response.json(); }).then(data => { unavailable = Array.isArray(data.unavailable) ? data.unavailable : []; const date = new Date(data.updatedAt); updatedAt = Number.isNaN(date.valueOf()) ? null : date; render(); }).catch(() => { loadFailed = true; render(); });
  render();
})();
