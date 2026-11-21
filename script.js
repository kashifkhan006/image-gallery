// Replace these with your own images (e.g. put files in an /images folder and use "images/photo1.jpg")
const photos = [
  ["Misty forest","nature"],["Mountain lake","nature"],["Desert dunes","nature"],["Waterfall","nature"],
  ["Skyline at dusk","city"],["Old town street","city"],["Night bridge","city"],["Rooftops","city"],
  ["Red fox","animals"],["Sleeping cat","animals"],["Owl portrait","animals"],["Deer in field","animals"]
].map(([title, cat], i) => ({
  title, cat, src: `https://picsum.photos/seed/${cat}${i}/1000/750`, thumb: `https://picsum.photos/seed/${cat}${i}/500/375`
}));

const gallery = document.getElementById('gallery');
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
let visible = [], current = 0;

photos.forEach((p, i) => {
  const el = document.createElement('div');
  el.className = 'item';
  el.tabIndex = 0;
  el.dataset.cat = p.cat;
  el.innerHTML = `<img src="${p.thumb}" alt="${p.title}" loading="lazy"><span>${p.title}</span>`;
  el.addEventListener('click', () => open(el));
  el.addEventListener('keydown', e => { if (e.key === 'Enter') open(el); });
  el._photo = p;
  gallery.appendChild(el);
});

function refresh() { visible = [...gallery.children].filter(el => !el.classList.contains('hide')); }
refresh();

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('active', b === btn));
  [...gallery.children].forEach(el => el.classList.toggle('hide', btn.dataset.filter !== 'all' && el.dataset.cat !== btn.dataset.filter));
  refresh();
});

function show() {
  const p = visible[current]._photo;
  lbImg.src = p.src; lbImg.alt = p.title; lbCap.textContent = `${p.title} (${current + 1}/${visible.length})`;
}
function open(el) { current = visible.indexOf(el); lb.hidden = false; show(); }
const close = () => lb.hidden = true;
const step = d => { current = (current + d + visible.length) % visible.length; show(); };

lb.querySelector('.close').onclick = close;
lb.querySelector('.prev').onclick = () => step(-1);
lb.querySelector('.next').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
