import { createOptimizedPicture } from '../../scripts/aem.js';

function events(parent) {
  const paragraphs = parent.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();

    if (text.startsWith('Location:')) {
      p.textContent = text.replace(/^Location:\s*/, '');
      p.classList.add('location');
    }

    if (text.startsWith('Date:')) {
      p.textContent = text.replace(/^Date:\s*/, '');
      p.classList.add('date');
    }
  });
  const details = document.createElement('div');
  details.className = 'details';

  const location = parent.querySelector('.location');
  const date = parent.querySelector('.date');
  if (date) {
    details.appendChild(date);
  }
  if (location) {
    details.appendChild(location);
  }
  if (details.children.length > 0) {
    parent.appendChild(details);
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const link = block.querySelector('a');
    if (link) {
      a.href = link.href;
      a.target = link.target;
      a.rel = link.rel;
      link.remove();
    }
    li.append(a);
    while (row.firstElementChild) a.append(row.firstElementChild);
    [...a.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    if (block.classList.contains('events')) {
      events(a);
    }
    ul.append(li);
  });

  // replace images with optimized versions
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
