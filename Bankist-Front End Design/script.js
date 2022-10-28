'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');
const header = document.querySelector('.header');

const tabsCont = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const lazyimgs = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionalites and analytics.<button class="btn btn--close--cookie">Got it!!</button>';
header.prepend(message);
message.style.width = '120%';
////deleting
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.parentNode.removeChild(message);
  });
//scrolling
btnScrollTo.addEventListener('click', function () {
  const section1 = document.querySelector('#section--1');
  //const sec1Pos = section1.getBoundingClientRect();
  // window.scrollTo(
  //   sec1Pos.left + window.pageXOffset,
  //   sec1Pos.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: sec1Pos.left + window.pageXOffset,
  //   top: sec1Pos.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});
// ///page navigation

//event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//////
//tabbed components
tabsCont.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return; ///guard clause

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  clicked.classList.add('operations__tab--active');
});

////hovering effect
const hoverHandle = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', hoverHandle.bind(0.5));
nav.addEventListener('mouseout', hoverHandle.bind(1));

////sticky navigation
const stickynav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});
headerObserver.observe(header);

///revealing elements
const revealElements = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealElements, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
///lazy loading
const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const lazyObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyimgs.forEach(lazyimg => {
  lazyObserver.observe(lazyimg);
});
/////slider effects
const sliderMovements = function () {
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  const init = function () {
    gotoSlide(0);
    createDots();
    activateDots(0);
  };
  init();
  let curSlide = 0;
  const maxSlide = slides.length;
  const nextSlide = function () {
    if (curSlide == maxSlide - 1) curSlide = 0;
    else curSlide++;
    gotoSlide(curSlide);
    activateDots(curSlide);
  };
  const prevSlide = function () {
    if (curSlide == 0) curSlide = maxSlide - 1;
    else curSlide--;
    gotoSlide(curSlide);
    activateDots(curSlide);
  };
  sliderBtnLeft.addEventListener('click', prevSlide);
  sliderBtnRight.addEventListener('click', nextSlide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDots(slide);
    }
  });
};
sliderMovements();
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////
////selecting
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.querySelector('.header'));
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// const header = document.querySelector('.header');
////inserting

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionalites and analytics.<button class="btn btn--close--cookie">Got it!!</button>';
// header.prepend(message);
// ////deleting
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.parentNode.removeChild(message);
//   });
///////////
//styles
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 10 + 'px';
// console.log(message.style.height);
// message.style.width = '120%';
// message.style.backgroundColor = '#37383d';

//document.documentElement.style.setProperty('--color-primary', 'orangered');
/////////
//scrolling
// btnScrollTo.addEventListener('click', function () {
//   const section1 = document.querySelector('#section--1');
//   const sec1Pos = section1.getBoundingClientRect();
//   // window.scrollTo(
//   //   sec1Pos.left + window.pageXOffset,
//   //   sec1Pos.top + window.pageYOffset
//   // );
//   // window.scrollTo({
//   //   left: sec1Pos.left + window.pageXOffset,
//   //   top: sec1Pos.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });
//   section1.scrollIntoView({ behavior: 'smooth' });
// });
//////Event propagation
// const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randColor = () =>
//   `rgb(${randNum(0, 255)},${randNum(0, 255)},${randNum(0, 255)})`;
// navLinks.addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   e.stopPropagation();
// });
// navLink.addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   e.stopPropagation();
// });
