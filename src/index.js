import './css/style.css';
import Notiflix from 'notiflix';
// myFunction FATCH
import { fetchImage } from './fetshForm';
import { createMarkup } from './createMarcup';
// SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// start libery AXIOS
const axios = require('axios').default;
// obj link
const refs = {
  form: document.querySelector('.search-form'),
  myInput: document.querySelector('.search-input'),
  wraperGalery: document.querySelector('.gallery'),
  //   loadMore: document.querySelector('.loadMore'),
  guard: document.querySelector('.wrapper-buton'),
};
// Destructuring
const {
  form,
  myInput,
  wraperGalery,
  //   loadMore,
  guard,
} = refs;

let myPage = 1;

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

//listening
form.addEventListener('submit', onSubmit);
// loadMore.addEventListener('click', addImage);

// start SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
// click search
async function onSubmit(event) {
  event.preventDefault();
  wraperGalery.innerHTML = '';
  myPage = 1;

  const myInputValue = myInput.value;
  const myValue = myInputValue.trim();

  if (!myValue) {
    // loadMore.hidden = true
    return;
  }

  return await fetchThen(myValue);
}

// loadMore.hidden = true // -

//// Processing the request
async function fetchThen(value) {
  try {
    const resp = await fetchImage(value);
    const myArr = resp.data.hits; //arr
    const myNumber = resp.data.total; //number

    if (myArr.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      //   loadMore.hidden = true // -
      return;
    }

    if (myNumber > 0) {
      Notiflix.Notify.info(`Hooray! We found ${myNumber} images.`);
    }

    createMarkup(myArr, wraperGalery);
    observer.observe(guard);
    lightbox.refresh();
    // loadMore.hidden = false // +

    if (myArr.length < 20) {
    //    loadMore.hidden = true // -
    }
  } catch (error) {
    console.log(error);
  }
}

// // click addIMG
async function addImage() {
  const value2 = myInput.value;
  let limitAdd;
  myPage += 1;
  try {
    const resp = await fetchImage(value2, myPage, limitAdd);
    createMarkup(resp.data.hits, wraperGalery);
    onPageScrolling();
    lightbox.refresh();

    if (resp.data.hits.length < limitAdd) {
      //   loadMore.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

// //jump scrole for button
// function onPageScrolling() {
// 	const { height: cardHeight } =
//     wraperGalery.firstElementChild.getBoundingClientRect();
// 	window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// my intersectionObserver
let observer = new IntersectionObserver(onInfinityLoad, options);

function onInfinityLoad(entries, observer) {
//   console.log(entries);
  entries.forEach(entri => {
    if (entri.isIntersecting) {
      addImage();
    }
  });
}
