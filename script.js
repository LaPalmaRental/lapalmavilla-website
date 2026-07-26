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

const enquiryNote = document.querySelector('.enquiry-form small');
const enquiryNoteCopy = {
  en: 'Your enquiry is sent securely to',
  es: 'Tu consulta se envía de forma segura a',
  fr: 'Votre demande est envoyée en toute sécurité à',
  de: 'Ihre Anfrage wird sicher an folgende Adresse gesendet:'
};
const updateEnquiryNote = () => {
  const text = enquiryNoteCopy[document.documentElement.lang] || enquiryNoteCopy.en;
  const markup = `${text} <a href="mailto:johnandmariegelder@icloud.com">johnandmariegelder@icloud.com</a>.`;
  if (enquiryNote.innerHTML !== markup) enquiryNote.innerHTML = markup;
};
new MutationObserver(updateEnquiryNote).observe(enquiryNote, { childList: true, subtree: true, characterData: true });
new MutationObserver(updateEnquiryNote).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
updateEnquiryNote();
