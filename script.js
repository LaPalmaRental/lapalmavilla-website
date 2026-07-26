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
  en: 'Prefer WhatsApp?',
  es: '¿Prefieres WhatsApp?',
  fr: 'Vous préférez WhatsApp ?',
  de: 'Lieber per WhatsApp?'
};
const whatsappCopy = {
  en: 'Message us on WhatsApp',
  es: 'Escríbenos por WhatsApp',
  fr: 'Écrivez-nous sur WhatsApp',
  de: 'Schreiben Sie uns auf WhatsApp'
};
const updateEnquiryNote = () => {
  const lang = document.documentElement.lang;
  const text = enquiryNoteCopy[lang] || enquiryNoteCopy.en;
  const whatsappText = whatsappCopy[lang] || whatsappCopy.en;
  const markup = `${text} <a href="https://wa.me/447968485664" target="_blank" rel="noopener noreferrer" aria-label="Chat with Casa Feliz on WhatsApp">${whatsappText}</a>.`;
  if (enquiryNote.innerHTML !== markup) enquiryNote.innerHTML = markup;
};
new MutationObserver(updateEnquiryNote).observe(enquiryNote, { childList: true, subtree: true, characterData: true });
new MutationObserver(updateEnquiryNote).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
updateEnquiryNote();
