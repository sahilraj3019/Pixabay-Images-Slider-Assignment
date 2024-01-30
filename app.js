const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const search = document.getElementById("search");

// selected image
let sliders = [];

const KEY = "42115440-33e8c18d2dfce49eae92013ec";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
  toggleSpinner();
};

const getImages = (query) => {
  gallery.innerHTML = "";
  galleryHeader.style.display = "none";
  document.getElementById("duration").value = "";
  toggleSpinner();

  fetch(
    `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length < 2) {
        toggleSpinner();
        search.value = "";
        const notFound = document.getElementById("not-enough-images");
        notFound.classList.toggle("d-none");
        setTimeout(() => {
          notFound.classList.toggle("d-none");
        }, 3000);
      } else {
        showImages(data.hits);
        search.value = "";
      }
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  if (item !== -1) {
    sliders.splice(item, 1);
  }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  let duration = document.getElementById("duration").value || 1100;

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};
// searchbutton click event
searchBtn.addEventListener("click", function () {
  if (search.value == "") {
    alert("You have to search something");
  } else {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    const search = document.getElementById("search");
    getImages(search.value);
    sliders.length = 0;
  }
});

// slider button click event
sliderBtn.addEventListener("click", function () {
  let duration = document.getElementById("duration").value || 1000;
  if (duration < 1000) {
    alert("Time gap is too little, you can try the default gap");
  } else {
    createSlider();
  }
});
// enter key press function
search.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
    searchBtn.click();
  }
});
// slider key press function
duration.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
    sliderBtn.click();
  }
});

// toggle spinner function
const toggleSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("d-none");
};
