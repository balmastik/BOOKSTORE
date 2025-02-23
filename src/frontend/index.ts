interface Book {
  title: string,
  author: string,
  genre: string,
  year: number,
  image: string,
  price: number,
  quantity: number
}

interface StoreBook {
  book: Book;
}

interface Customer {
  name: string,
  balance: number,
  image: string
}

// Close popup window
const popup = document.getElementById("popup") as HTMLElement;
const denyPopup = document.getElementById("deny-popup") as HTMLButtonElement;
const confirmPopup = document.getElementById("confirm-popup") as HTMLButtonElement;

function hidePopup() {
  if (popup) {
    popup.style.display = "none";
    localStorage.setItem('popupShown', 'true');
  }
}

// Create book card
function createBookCard(storeBook: StoreBook, handleBook: () => void): HTMLElement {

  const bookCard = document.createElement('div');
  bookCard.className = 'card';

  const bookMedia = storeBook.book.image.endsWith('.mp4')
    ? `<video class="video" autoplay muted loop>
         <source src="${storeBook.book.image}" type="video/mp4">
         Your browser does not support video.
       </video>`
    : `<img src="${storeBook.book.image}" alt="${storeBook.book.title}" class="image">`;

  bookCard.innerHTML = `
    ${bookMedia}
    <h3>${storeBook.book.title}</h3>
    <p class="author">${storeBook.book.author}</p>
    <p class="price">${storeBook.book.price.toFixed(2)} €</p>
    <button class="book-button">Purchase</button>
  `;

  const bookButton = bookCard.querySelector('.book-button') as HTMLElement;
  bookButton.addEventListener('click', handleBook);

  return bookCard;
}

// Display catalogue
function displayCatalogue() {
  const bookList = document.getElementById('book-list') as HTMLElement;
  if (!bookList) return;
  bookList.innerHTML = '';

  fetch('http://localhost:3000/api/catalogue')
    .then(res => res.json())
    .then(catalogue => {
      catalogue.forEach((storeBook: StoreBook) => {
        const bookCard = createBookCard(storeBook, () => purchaseBook(storeBook, bookCard));
        bookList.appendChild(bookCard);
      });
    })
    .catch(error => {
      console.error("Catalogue loading error:", error);
    });
}

// Create customer card
function createCustomerCard(customer: Customer): HTMLElement {
  const customerCard = document.createElement('div');
  customerCard.className = 'card';

  const customerImage = customer.image
    ? `<img src="${customer.image}" alt="${customer.name}" class="image">`
    : `<div class="image-placeholder"></div>`;

  customerCard.innerHTML = `
    ${customerImage}
    <h3>${customer.name}</h3>
    <p class="balance">${customer.balance.toFixed(2)} €</p>
    <button class="customer-button">Increase balance</button>
  `;

  const customerButton = customerCard.querySelector('.customer-button') as HTMLElement;
  customerButton.addEventListener('click', increaseBalance);

  return customerCard;
}

// Increase customer's balance
function increaseBalance(): void {

  const amount: number = parseFloat(prompt('Please enter the amount, 0') || '0');
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid positive number');
    return;
  }

  fetch('http://localhost:3000/api/customer/addFunds', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({amount}),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        displayCustomer();
      } else {
        alert(data.error);
      }
    })
    .catch(error => {
      console.error("Increase balance error:", error);
    });
}

// Display customer
function displayCustomer(): void {
  const customerList = document.getElementById('customer-list') as HTMLElement;
  if (!customerList) return;
  customerList.innerHTML = '';

  fetch('http://localhost:3000/api/customer')
    .then(res => res.json())
    .then(customer => {
      const customerCard = createCustomerCard(customer);
      customerList.appendChild(customerCard);
    })
    .catch(error => {
      console.error("Customer loading error:", error);
    });
}

// Display library
function displayLibrary(): void {
  const customerBookList = document.getElementById('customer-book-list') as HTMLElement;
  if (!customerBookList) {
    return;
  }
  customerBookList.innerHTML = '';

  fetch('http://localhost:3000/api/customer/library')
    .then(res => res.json())
    .then(library => {
      library.forEach((storeBook: StoreBook) => {
        const bookCard = createBookCard(storeBook, () => removeCustomerCard(storeBook, bookCard));
        const priceElement = bookCard.querySelector('.price');
        if (priceElement) {
          priceElement.remove();
        }
        const buttonContent = bookCard.querySelector('.book-button');
        if (buttonContent) {
          buttonContent.innerHTML = 'Remove';
        }
        customerBookList.appendChild(bookCard);
      })
    })
    .catch(error => {
      console.error("Catalogue loading error:", error);
    });
}

// Remove library book card
function removeCustomerCard(storeBook: StoreBook, bookCard: HTMLElement): void {
  fetch('http://localhost:3000/api/customer/removeBook', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(storeBook)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        bookCard.remove();
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    })
    .catch(error => {
      console.error("Error removing book:", error);
    });
}

// Book sale/purchase
function purchaseBook(storeBook: StoreBook, bookCard: HTMLElement): void {
  fetch('http://localhost:3000/api/purchase', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(storeBook),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log(data.message);
        bookCard.remove();
        displayCatalogue();
      } else {
        alert(data.error);
        console.log(data.error);
      }
    })
    .catch(error => {
      console.error("Purchase loading error:", error);
    });
}

// Search for books in the store by title, author, and genre
const storeSearchInput = document.getElementById('store-search-input') as HTMLInputElement;
const storeSearchButton = document.getElementById('store-search-button') as HTMLButtonElement;

function searchStoreBooks(): void {
  let query = storeSearchInput.value.toLowerCase().trim();

  fetch('http://localhost:3000/api/catalogue/searchStore', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify({query})
  })
    .then(res => res.json())
    .then(foundBooks => {
      console.log(foundBooks);
      displayStoreSearchResults(foundBooks);
    })
    .catch(error => {
      console.error("Found books loading error:", error);
    });
}

// Display store search results
function displayStoreSearchResults(foundBooks: StoreBook[]): void {
  const bookList = document.getElementById('book-list') as HTMLElement;
  if (!bookList) return;
  bookList.innerHTML = '';

  if (foundBooks.length > 0) {
    foundBooks.forEach(storeBook => {
      const bookCard = createBookCard(storeBook, () => purchaseBook(storeBook, bookCard));
      bookList.appendChild(bookCard);
    });
  } else {
    bookList.innerHTML = '<p>No results found for your query</p>';
  }
}

// Opening and closing the filter panel
const openFilter = document.getElementById('open-filter') as HTMLImageElement;
const closeFilter = document.getElementById('close-filter') as HTMLButtonElement;
const clearFilter = document.getElementById('clear-filter') as HTMLButtonElement;
const applyFilter = document.getElementById('apply-filter') as HTMLButtonElement;

function openFilterPanel(): void {
  const filterPanel = document.getElementById('filter-panel') as HTMLElement;

  if (filterPanel) {
    filterPanel.classList.add('open');
    fillColor();
  }
}

function closeFilterPanel(): void {
  const filterPanel = document.getElementById('filter-panel') as HTMLElement;

  if (filterPanel) {
    filterPanel.classList.remove('open');
  }
}

// Filter books by price and publication date
const priceSlider1 = document.getElementById('price-slider-1') as HTMLInputElement;
const priceSlider2 = document.getElementById('price-slider-2') as HTMLInputElement;
const yearSlider1 = document.getElementById('year-slider-1') as HTMLInputElement;
const yearSlider2 = document.getElementById('year-slider-2') as HTMLInputElement;
let minGap = 2;

function priceSlideOne() {
  const displayPriceMin = document.getElementById('price-range-min') as HTMLElement;

  if (priceSlider1 && priceSlider2 && displayPriceMin) {

    let sliderValue1 = +priceSlider1.value;
    let sliderValue2 = +priceSlider2.value;

    if ((sliderValue2 - sliderValue1) <= minGap) {
      sliderValue1 = sliderValue2 - minGap;
      priceSlider1.value = String(sliderValue1);
    }

    displayPriceMin.textContent = sliderValue1 + ` €`;
    fillColor();
  }
}

function priceSlideTwo() {
  const displayPriceMax = document.getElementById('price-range-max') as HTMLElement;

  if (priceSlider1 && priceSlider2 && displayPriceMax) {

    let sliderValue1 = +priceSlider1.value;
    let sliderValue2 = +priceSlider2.value;

    if ((sliderValue2 - sliderValue1) <= minGap) {
      sliderValue2 = sliderValue1 + minGap;
      priceSlider2.value = String(sliderValue2);
    }

    displayPriceMax.textContent = sliderValue2 + ` €`;
    fillColor();
  }
}

function slideOne() {
  const displayYearMin = document.getElementById('year-range-min') as HTMLElement;

  if (yearSlider1 && yearSlider2 && displayYearMin) {

    let sliderValue1 = +yearSlider1.value;
    let sliderValue2 = +yearSlider2.value;

    if ((sliderValue2 - sliderValue1) <= minGap) {
      sliderValue1 = sliderValue2 - minGap;
      yearSlider1.value = String(sliderValue1);
    }

    displayYearMin.textContent = String(sliderValue1);
    fillColor();
  }
}

function slideTwo() {
  const displayYearMax = document.getElementById('year-range-max') as HTMLElement;

  if (yearSlider1 && yearSlider2 && displayYearMax) {

    let sliderValue1 = +yearSlider1.value;
    let sliderValue2 = +yearSlider2.value;

    if ((sliderValue2 - sliderValue1) <= minGap) {
      sliderValue2 = sliderValue1 + minGap;
      yearSlider2.value = String(sliderValue2);
    }

    displayYearMax.textContent = String(sliderValue2);
    fillColor();
  }
}

function fillColor() {
  const priceTrack = document.querySelector('.price-track') as HTMLElement;
  const yearTrack = document.querySelector('.year-track') as HTMLElement;

  if (yearSlider1 && yearSlider2 && priceTrack && yearTrack) {

    const priceSliderMin = +priceSlider1.min;
    const priceSliderMax = +priceSlider1.max;
    const sliderPriceValue1 = +priceSlider1.value;
    const sliderPriceValue2 = +priceSlider2.value;

    const yearSliderMin = +yearSlider1.min;
    const yearSliderMax = +yearSlider1.max;
    const sliderValue1 = +yearSlider1.value;
    const sliderValue2 = +yearSlider2.value;

    let percent1 = ((sliderPriceValue1 - priceSliderMin) / (priceSliderMax - priceSliderMin)) * 100;
    let percent2 = ((sliderPriceValue2 - priceSliderMin) / (priceSliderMax - priceSliderMin)) * 100;
    let percent3 = ((sliderValue1 - yearSliderMin) / (yearSliderMax - yearSliderMin)) * 100;
    let percent4 = ((sliderValue2 - yearSliderMin) / (yearSliderMax - yearSliderMin)) * 100;

    priceTrack.style.background = `linear-gradient(to right, #ccc ${percent1}%, #f99462 ${percent1}%,
     #f99462 ${percent2}%, #ccc ${percent2}%)`;
    yearTrack.style.background = `linear-gradient(to right, #ccc ${percent3}%, #f99462 ${percent3}%,
     #f99462 ${percent4}%, #ccc ${percent4}%)`;
  }
}

function applyBooksFilter(event: MouseEvent) {
  event.preventDefault();

  if (priceSlider1 && priceSlider2 && yearSlider1 && yearSlider2) {
    const priceMin = +priceSlider1.value;
    const priceMax = +priceSlider2.value;
    const yearMin = +yearSlider1.value;
    const yearMax = +yearSlider2.value;

    fetch('http://localhost:3000/api/catalogue/filterStore', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
    })
      .then(res => res.json())
      .then(foundBooks => {
        displayStoreSearchResults(foundBooks);
      })
      .catch(error => {
        console.error("Found books loading error:", error);
      });
  }
}

function clearBooksFilter() {
  priceSlider1.value = '0';
  priceSlider2.value = '100';
  yearSlider1.value = '1800';
  yearSlider2.value = '2000';
  priceSlideOne();
  priceSlideTwo();
  slideOne();
  slideTwo();
  displayCatalogue();
}

// Download book catalogue PDF
const catalogueButton = document.getElementById("catalogueButton") as HTMLButtonElement;
const downloadLink = document.getElementById("downloadLink") as HTMLAnchorElement;

function downloadCatalogue() {
  fetch('http://localhost:3000/api/catalogue')
    .then(response => response.json())
    .then(catalogue => {
      if (window.jspdf) {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        doc.setFont('Helvetica');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("KNIGBOOM Catalogue", 80, 20);

        doc.setFontSize(12);

        const catalogueText = catalogue
          .map((item: StoreBook): string => {
            return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
              `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
              `Price: ${item.book.price.toFixed(2)} EUR. In stock: ${item.book.quantity}.`
          })
          .join('\n\n');

        doc.text(catalogueText, 20, 40);

        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        downloadLink.href = url;
        downloadLink.download = "KNIGBOOM Catalogue.pdf";
        downloadLink.click();
        URL.revokeObjectURL(url);
      } else {
        console.log('jsPDF has not been loaded');
      }
    })
    .catch(error => {
      console.error('Error fetching catalogue:', error);
    });
}

// Search for books in the library by title, author, and genre
const librarySearchInput = document.getElementById('library-search-input') as HTMLInputElement;
const librarySearchButton = document.getElementById('library-search-button') as HTMLButtonElement;

function searchLibraryBooks(): void {
  let query = librarySearchInput.value.toLowerCase().trim();

  fetch('http://localhost:3000/api/customer/searchLibrary', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify({query})
  })
    .then(res => res.json())
    .then(foundBooks => {
      console.log(foundBooks);
      displayLibrarySearchResults(foundBooks);
    })
    .catch(error => {
      console.error("Found books loading error:", error);
    });
}

// Display library search results
function displayLibrarySearchResults(foundBooks: StoreBook[]): void {
  const customerBookList = document.getElementById('customer-book-list') as HTMLElement;
  if (!customerBookList) return;
  customerBookList.innerHTML = '';

  if (foundBooks.length > 0) {
    foundBooks.forEach(storeBook => {
      const bookCard = createBookCard(storeBook, () => removeCustomerCard(storeBook, bookCard));
      const priceElement = bookCard.querySelector('.price');
      if (priceElement) {
        priceElement.remove();
      }
      const buttonContent = bookCard.querySelector('.book-button');
      if (buttonContent) {
        buttonContent.innerHTML = 'Remove';
      }
      customerBookList.appendChild(bookCard);
    });
  } else {
    customerBookList.innerHTML = '<p>No results found for your query</p>';
  }
}

// Add image to the library (add book form)
const fileInput = document.getElementById('add-image') as HTMLInputElement;

function handleFileChange(): void {

  const label = document.getElementById('book-image-label') as HTMLLabelElement;
  const file = fileInput.files?.[0];
  if (file) {
    label.textContent = file.name;
  }
}

// Add book to the library
const addBookButton = document.getElementById('add-book-button') as HTMLButtonElement;

function addBookToLibrary(event: MouseEvent): void {
  event.preventDefault();

  const title = (document.getElementById('book-title') as HTMLInputElement).value.trim().toLowerCase();
  const author = (document.getElementById('book-author') as HTMLInputElement).value.trim().toLowerCase();

  if (!title || !author) {
    alert('Please fill in all fields');
    return;
  }

  const file = fileInput.files?.[0];
  if (!file) {
    alert('Please upload the book cover');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('image', file);

  fetch('http://localhost:3000/api/customer/addBook', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        displayLibrary();
        clearLibraryForm();
        setTimeout(() => alert(data.message), 1000);
      }
    })
    .catch(error => {
      console.error("Loading error:", error);
    });
}

// Clearing the form when adding a book to the library
const clearFormButton = document.getElementById('clear-form-button') as HTMLButtonElement;

function clearLibraryForm(): void {
  (document.getElementById('book-title') as HTMLInputElement).value = '';
  (document.getElementById('book-author') as HTMLInputElement).value = '';
  (document.getElementById('add-image') as HTMLInputElement).value = '';
  const label = document.getElementById('book-image-label') as HTMLLabelElement;
  label.textContent = 'Cover';
}

document.addEventListener('DOMContentLoaded', () => {
  displayCatalogue();
  displayCustomer();
  displayLibrary();

  // Popup handler
  const popupShown = localStorage.getItem('popupShown');
  if (!popupShown && popup && denyPopup && confirmPopup) {
    popup.style.display = "flex";

    denyPopup.addEventListener("click", hidePopup);
    confirmPopup.addEventListener("click", hidePopup);
  }

  // Store search handler
  if (storeSearchInput && storeSearchButton) {
    storeSearchInput.addEventListener('change', searchStoreBooks);
    storeSearchButton.addEventListener('click', searchStoreBooks);
  }

  // Filter events handler
  if (openFilter && closeFilter && priceSlider1 && priceSlider2 && yearSlider1 &&
    yearSlider2 && clearFilter && applyFilter) {
    openFilter.addEventListener('click', openFilterPanel);
    closeFilter.addEventListener('click', closeFilterPanel);
    priceSlider1.addEventListener('input', priceSlideOne);
    priceSlider2.addEventListener('input', priceSlideTwo);
    yearSlider1.addEventListener('input', slideOne);
    yearSlider2.addEventListener('input', slideTwo);
    clearFilter.addEventListener('click', clearBooksFilter);
    applyFilter.addEventListener('click', applyBooksFilter);
  }

  // Catalogue download handler
  if (downloadLink && catalogueButton) {
    catalogueButton.addEventListener('click', downloadCatalogue);
  }

  // Library search handler
  if (librarySearchInput && librarySearchButton) {
    librarySearchInput.addEventListener('change', searchLibraryBooks);
    librarySearchButton.addEventListener('click', searchLibraryBooks);
  }

  // Add book handler
  if (fileInput && addBookButton && clearFormButton) {
    fileInput.addEventListener('change', handleFileChange);
    addBookButton.addEventListener('click', addBookToLibrary);
    clearFormButton.addEventListener('click', clearLibraryForm);
  }
})


/*
// Newsletter subscription
const newsLetterForm = document.getElementById('newsletter-form') as HTMLFormElement;

function confirmNewsLetterForm(event: SubmitEvent) {
  event.preventDefault();

  const newsLetterEmail = document.getElementById('newsletter-email') as HTMLInputElement;
  const newsletterMessage = document.getElementById('newsletter-message') as HTMLElement;
  const email = newsLetterEmail.value.trim();

  if (email) {
    console.log('Subscription email:', email);

    newsletterMessage.textContent = 'You have successfully subscribed to our newsletter.';
    newsletterMessage.style.display = 'block';
    setTimeout(() => {
      newsletterMessage.remove();
    }, 5000);
    newsLetterEmail.value = '';

  } else {
    alert('Please enter a valid email!');
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Newsletter subscription handler
  if (newsLetterForm) {
    newsLetterForm.addEventListener('submit', confirmNewsLetterForm);
  }

});
*/
