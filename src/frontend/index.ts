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

document.addEventListener('DOMContentLoaded', () => {
  displayCatalogue();
  displayCustomer();
  displayLibrary();
})


/*

// Searching for books in the store by title, author, and genre
const storeSearchInput = document.getElementById('store-search-input') as HTMLInputElement;
const storeSearchButton = document.getElementById('store-search-button') as HTMLButtonElement;

function searchStoreBooks(): void {
  let query = storeSearchInput.value.toLowerCase().trim();

  let book: SearchBookDetails = {
    title: query,
    author: query,
    genre: query
  }

  let foundBooks: StoreBook[] = store.searchBook(book);
  displayStoreSearchResults(foundBooks);
}

// Displaying the search results of store books
function displayStoreSearchResults(foundBooks: StoreBook[]): void {
  const bookList = document.getElementById('book-list') as HTMLElement;
  if (!bookList) return;
  bookList.innerHTML = '';

  if (foundBooks.length > 0) {
    foundBooks.forEach(storeBook => {
      const bookCard = createBookCard(storeBook, () => handleBuyBook(storeBook, bookCard));
      bookList.appendChild(bookCard);
    });
  } else {
    bookList.innerHTML = '<p>No results found for your query.</p>';
  }
}

// Searching for books in the library by title, author, and genre
const librarySearchInput = document.getElementById('library-search-input') as HTMLInputElement;
const librarySearchButton = document.getElementById('library-search-button') as HTMLButtonElement;

function searchLibraryBooks(): void {
  let query = librarySearchInput.value.toLowerCase().trim();

  let book: SearchBookDetails = {
    title: query,
    author: query,
    genre: query
  }

  let foundBooks: StoreBook[] = customer.searchBook(book);
  displayLibrarySearchResults(foundBooks);
}

// Displaying the search results of library books
function displayLibrarySearchResults(foundBooks: StoreBook[]): void {
  const customerBookList = document.getElementById('customer-book-list') as HTMLElement;
  if (!customerBookList) return;
  customerBookList.innerHTML = '';

  if (foundBooks.length > 0) {
    foundBooks.forEach(storeBook => {
      const bookCard = createBookCard(storeBook, () => removecustomerBook(storeBook, bookCard));
      const priceElement = bookCard.querySelector('.book-price');
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
    customerBookList.innerHTML = '<p>No results found for your query.</p>';
  }
}

// Downloading the book catalogue
const catalogueButton = document.getElementById("catalogueButton") as HTMLButtonElement;
const downloadLink = document.getElementById("downloadLink") as HTMLAnchorElement;

function downloadCatalogue() {
  if (window.jspdf) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('Helvetica');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("KNIGBOOM Catalogue", 80, 20);

    doc.setFontSize(12);
    doc.text(store.toString(), 20, 40);

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);

    downloadLink.href = url;
    downloadLink.download = "KNIGBOOM Catalogue.pdf";
    downloadLink.click();
    URL.revokeObjectURL(url);
  } else {
    console.log('jsPDF has been not loaded');
  }
}

// Change the label "Cover" when the image is uploaded
const fileInput = document.getElementById('add-image') as HTMLInputElement;

function handleFileChange(): void {
  const label = document.getElementById('book-image-label') as HTMLLabelElement;

  const file = fileInput.files?.[0];
  if (file) {
    label.textContent = file.name;
  }
}

// Adding a book to the library by a customer
const addBookButton = document.getElementById('add-book-button') as HTMLButtonElement;

function addBookToLibrary(event: MouseEvent): void {
  event.preventDefault();

  const title = (document.getElementById('book-title') as HTMLInputElement).value.trim().toLowerCase();
  const author = (document.getElementById('book-author') as HTMLInputElement).value.trim().toLowerCase();

  if (!title || !author) {
    alert('Please fill in all fields.');
    return;
  }

  const file = fileInput.files?.[0];
  if (!file) {
    alert('Please upload the book cover.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target?.result as string;

    const newBook = new Book({
      title: title,
      author: author,
      genre: 'Not specified',
      year: 0.00,
      image: imageUrl
    });

    const storeBook = new StoreBook(newBook, 0);
    customer.purchasedBooks.push(storeBook);

    displaycustomerBooks();
    clearLibraryForm();
    saveData();
  };

  reader.readAsDataURL(file);
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

// Filtering books by price and publication year
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

    let foundBooks: StoreBook[] = store.filterBooks(priceMin, priceMax, yearMin, yearMax);
    console.log(foundBooks);
    displayStoreSearchResults(foundBooks);
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
  displayBooks();
}

// Closing the popup window
const popup = document.getElementById("popup") as HTMLElement;
const denyPopup = document.getElementById("deny-popup") as HTMLButtonElement;
const confirmPopup = document.getElementById("confirm-popup") as HTMLButtonElement;

function hidePopup() {
  if (popup) {
    popup.style.display = "none";
    localStorage.setItem('popupShown', 'true');
  }
}

// Saving data to localStorage
function saveData(): void {
  const customerData = customer.exportcustomerData();
  const catalogueData = store.exportCatalogue();

  console.log('Saving customer data to localStorage:', customerData);
  console.log('Saving catalogue data to localStorage:', catalogueData);

  localStorage.setItem('customerData', customerData);
  localStorage.setItem('catalogueData', catalogueData);
}

// Loading customer data from localStorage
function loadcustomerData() {
  const savedcustomerData = localStorage.getItem('customerData');
  if (savedcustomerData) {
    try {
      customer.importcustomerData(savedcustomerData);
      console.log('customer data loaded.');
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  }
}

// Loading store data from localStorage
function loadStoreData() {
  const savedCatalogueData = localStorage.getItem('catalogueData');
  if (savedCatalogueData) {
    try {
      store.importCatalogue(savedCatalogueData);
      console.log('Catalogue data loaded.');
    } catch (error) {
      console.error('Error loading catalogue data:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Loading data from localStorage
  loadStoreData();
  loadcustomerData();

  // Loading books from the server
  fetchBooks().then(() => {
    console.log('Books loaded from the server');

    // Display customers and books when the page is loaded
    displaycustomers();
    displayBooks();
    displaycustomerBooks();

  }).catch((error) => {
    console.error('Error loading books from the server', error);
    displaycustomers();
    displayBooks();
    displaycustomerBooks();
  });

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

  // Library search handler
  if (librarySearchInput && librarySearchButton) {
    librarySearchInput.addEventListener('change', searchLibraryBooks);
    librarySearchButton.addEventListener('click', searchLibraryBooks);
  }

  // Catalogue download handler
  if (downloadLink && catalogueButton) {
    catalogueButton.addEventListener('click', downloadCatalogue);
  }

  // Add book handler
  if (fileInput && addBookButton && clearFormButton) {
    fileInput.addEventListener('change', handleFileChange);
    addBookButton.addEventListener('click', addBookToLibrary);
    clearFormButton.addEventListener('click', clearLibraryForm);
  }

  // Newsletter subscription handler
  if (newsLetterForm) {
    newsLetterForm.addEventListener('submit', confirmNewsLetterForm);
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
});
*/
