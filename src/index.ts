import {Book, StoreBook, Store, Client, SearchBookDetails} from './store';

// Создание покупателя
const client = new Client({
  name: 'Иван Иванов',
  balance: 40,
  image: 'img/first_client.jpeg'
});

// Создание магазина
const store = new Store();

// Добавление книг в магазин
const books = [
  new StoreBook(new Book({
    title: 'Атлант расправил плечи',
    author: 'Айн Ренд',
    genre: 'Роман',
    year: 1957,
    image: 'img/atlas_shrugged.jpeg'
  }), 24.99),
  new StoreBook(new Book({
    title: 'Сага о Форсайтах',
    author: 'Джон Голсуорси',
    genre: 'Роман',
    year: 1906,
    image: 'img/the_forsyte_saga.jpeg'
  }), 22.99),
  new StoreBook(new Book({
    title: 'Потерянный горизонт',
    author: 'Джеймс Хилтон',
    genre: 'Приключения',
    year: 1933,
    image: 'img/lost_horizon.jpeg'
  }), 17.50),
  new StoreBook(new Book({
    title: 'Острие бритвы',
    author: 'Сомерсет Моэм',
    genre: 'Роман',
    year: 1944,
    image: 'img/the_razors_edge.jpeg'
  }), 20.00),
  new StoreBook(new Book({
    title: 'Нетерпение сердца',
    author: 'Стефан Цвейг',
    genre: 'Роман',
    year: 1939,
    image: 'img/beware_of_pity.jpeg'
  }), 14.99),
  new StoreBook(new Book({
    title: 'Прощайте, мистер Чипс',
    author: 'Джеймс Хилтон',
    genre: 'Приключения',
    year: 1934,
    image: 'img/goodbye_mr_chips.jpeg'
  }), 12.99),
  new StoreBook(new Book({
    title: 'Казино Рояль',
    author: 'Ян Флеминг',
    genre: 'Роман',
    year: 1953,
    image: 'video/casino_royale.mp4'
  }), 28.00),
];
books.forEach(book => store.addBook(book));

// Создание карточки покупателя
function createClientCard(client: Client, addClientFund: () => void): HTMLElement {
  const clientCard = document.createElement('div');
  clientCard.className = 'card';

  const clientImage = client.image
    ? `<img src="${client.image}" alt="${client.name}" class="image">`
    : `<div class="image-placeholder"></div>`;

  clientCard.innerHTML = `
    ${clientImage}
    <h3>${client.name}</h3>
    <p class="balance">${client.balance.toFixed(2)} €</p>
    <button class="client-button">Увеличить баланс</button>
  `;

  const clientButton = clientCard.querySelector('.client-button') as HTMLElement;
  clientButton.addEventListener('click', addClientFund);

  return clientCard;
}

// Создание карточки книги
function createBookCard(storeBook: StoreBook, handleBook: () => void): HTMLElement {
  const bookCard = document.createElement('div');
  bookCard.className = 'card';

  const bookMedia = storeBook.book.image.endsWith('.mp4')
    ? `<video class="video" autoplay muted loop>
         <source src="${storeBook.book.image}" type="video/mp4">
         Ваш браузер не поддерживает видео.
       </video>`
    : `<img src="${storeBook.book.image}" alt="${storeBook.book.title}" class="image">`;

  bookCard.innerHTML = `
    ${bookMedia}
    <h3>${storeBook.book.title}</h3>
   <p class="author">${storeBook.book.author}</p>
   <p class="price">${storeBook.book.price.toFixed(2)} €</p>
   <button class="book-button">Купить</button>
  `;

  const bookButton = bookCard.querySelector('.book-button') as HTMLElement;
  bookButton.addEventListener('click', handleBook);

  return bookCard;
}

// Отображение покупателя
function displayClients(): void {
  const clientList = document.getElementById('client-list') as HTMLElement;
  if (!clientList) return;
  clientList.innerHTML = '';
  const clientCard = createClientCard(client, () => addClientFund(client));
  clientList.appendChild(clientCard);
}

// Отображение книг магазина
function displayBooks(): void {
  const bookList = document.getElementById('book-list') as HTMLElement;
  if (!bookList) return;
  bookList.innerHTML = '';
  Array.from(store.catalogue.values()).forEach(storeBook => {
    const bookCard = createBookCard(storeBook, () => handleBuyBook(storeBook, bookCard));
    bookList.appendChild(bookCard);
  });
}

// Отображения книг библиотеки
function displayClientBooks(): void {
  const clientBookList = document.getElementById('client-book-list') as HTMLElement;
  if (!clientBookList) {
    console.error('Элемент clientBookList не найден!');
    return;
  }

  clientBookList.innerHTML = '';
  client.purchasedBooks.forEach(storeBook => {
    const bookCard = createBookCard(storeBook, () => removeClientBook(storeBook, bookCard));
    const priceElement = bookCard.querySelector('.price');
    if (priceElement) {
      priceElement.remove();
    }
    const buttonContent = bookCard.querySelector('.book-button');
    if (buttonContent) {
      buttonContent.innerHTML = 'Удалить';
    }
    clientBookList.appendChild(bookCard);
    console.log('В библиотеку добавлена новая карточка книги.');
  });
}

// Удаление карточки книги магазина
function removeBookCard(bookCard: HTMLElement): void {
  bookCard.remove();
}

// Удаление карточки книги библиотеки
function removeClientBook(storeBook: StoreBook, bookCard: HTMLElement): void {
  if (client.purchasedBooks.includes(storeBook)) {
    client.purchasedBooks.splice(client.purchasedBooks.indexOf(storeBook), 1);
    bookCard.remove();
    saveData();  // Сохраняем изменения после удаления книги
    console.log('Карта книги успешно удалена.');
  }
}

// Увеличение клиентского баланса
function addClientFund(client: Client): void {
  const result = client.addFunds(40);

  if (result === client) {
    displayClients();
    saveData();
  } else {
    alert(result);
  }
}

// Купля-продажа книги
function handleBuyBook(storeBook: StoreBook, bookCard: HTMLElement): void {
  if (store.bookIsAvailable(storeBook) && storeBook.book.quantity > 0) {
    const result = client.buyBooks(storeBook);

    if (result === client) {
      store.removeBook(storeBook);
      removeBookCard(bookCard);
      displayClientBooks();
      saveData();
    } else {
      alert(result);
    }
  } else {
    alert('Эта книга недоступна.');
  }
}

// Поиск книг в магазине по названию, автору и жанру
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

// Отображение результатов поиска книг в магазине
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
    bookList.innerHTML = '<p>По вашему запросу ничего не найдено.</p>';
  }
}

// Поиск книг в библиотеке по названию, автору и жанру
const librarySearchInput = document.getElementById('library-search-input') as HTMLInputElement;
const librarySearchButton = document.getElementById('library-search-button') as HTMLButtonElement;

function searchLibraryBooks(): void {
  let query = librarySearchInput.value.toLowerCase().trim();

  let book: SearchBookDetails = {
    title: query,
    author: query,
    genre: query
  }

  let foundBooks: StoreBook[] = client.searchBook(book);
  displayLibrarySearchResults(foundBooks);
}

// Отображение результатов поиска книг в библиотеке
function displayLibrarySearchResults(foundBooks: StoreBook[]): void {
  const clientBookList = document.getElementById('client-book-list') as HTMLElement;
  if (!clientBookList) return;
  clientBookList.innerHTML = '';

  if (foundBooks.length > 0) {
    foundBooks.forEach(storeBook => {
      const bookCard = createBookCard(storeBook, () => removeClientBook(storeBook, bookCard));
      const priceElement = bookCard.querySelector('.book-price');
      if (priceElement) {
        priceElement.remove();
      }
      const buttonContent = bookCard.querySelector('.book-button');
      if (buttonContent) {
        buttonContent.innerHTML = 'Удалить';
      }
      clientBookList.appendChild(bookCard);
    });
  } else {
    clientBookList.innerHTML = '<p>По вашему запросу ничего не найдено.</p>';
  }
}

// Изменение наименования Обложка при загрузке картинки
const fileInput = document.getElementById('add-image') as HTMLInputElement;

function handleFileChange(): void {
  const label = document.getElementById('book-image-label') as HTMLLabelElement;

  const file = fileInput.files?.[0];
  if (file) {
    label.textContent = file.name;
  }
}

// Добавление книги покупателем в библиотеку
const addBookButton = document.getElementById('add-book-button') as HTMLButtonElement;

function addBookToLibrary(event: MouseEvent): void {
  event.preventDefault();

  const title = (document.getElementById('book-title') as HTMLInputElement).value.trim().toLowerCase();
  const author = (document.getElementById('book-author') as HTMLInputElement).value.trim().toLowerCase();

  if (!title || !author) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  const file = fileInput.files?.[0];
  if (!file) {
    alert('Пожалуйста, загрузите обложку книги.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target?.result as string;

    const newBook = new Book({
      title: title,
      author: author,
      genre: 'Не указан',
      year: 0.00,
      image: imageUrl
    });

    const storeBook = new StoreBook(newBook, 0);
    client.purchasedBooks.push(storeBook);

    displayClientBooks();
    clearLibraryForm();
    saveData();
  };

  reader.readAsDataURL(file);
}

// Очистка формы добавления книги покупателем в библиотеку
const clearFormButton = document.getElementById('clear-form-button') as HTMLButtonElement;

function clearLibraryForm(): void {
  (document.getElementById('book-title') as HTMLInputElement).value = '';
  (document.getElementById('book-author') as HTMLInputElement).value = '';
  (document.getElementById('add-image') as HTMLInputElement).value = '';
  const label = document.getElementById('book-image-label') as HTMLLabelElement;
  label.textContent = 'Обложка';
}

// Подписка на рассылку
const newsLetterForm = document.getElementById('newsletter-form') as HTMLFormElement;

function confirmNewsLetterForm(event: SubmitEvent) {
  event.preventDefault();

  const newsLetterEmail = document.getElementById('newsletter-email') as HTMLInputElement;
  const newsletterMessage = document.getElementById('newsletter-message') as HTMLElement;
  const email = newsLetterEmail.value.trim();

  if (email) {
    console.log('Email для подписки:', email);

    newsletterMessage.textContent = 'Вы подписались на новости';
    newsletterMessage.style.display = 'block';
    setTimeout(() => {
      newsletterMessage.remove();
    }, 5000);
    newsLetterEmail.value = '';

  } else {
    alert('Пожалуйста, введите корректный email!');
  }
}

// Открытие и закрытие панели фильтра
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

// Фильтрация книг по цене и году издания
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
  priceSlider1.value = '30';
  priceSlider2.value = '60';
  yearSlider1.value = '1945';
  yearSlider2.value = '1975';
  priceSlideOne();
  priceSlideTwo();
  slideOne();
  slideTwo();
  displayBooks();
}

// Получение элементов DOM для всплывающего окна
const popup = document.getElementById("popup") as HTMLElement;
const denyPopup = document.getElementById("deny-popup") as HTMLButtonElement;
const confirmPopup = document.getElementById("confirm-popup") as HTMLButtonElement;


// Сохранение данных в localStorage
function saveData(): void {
  const clientData = client.exportClientData();
  const catalogueData = store.exportCatalogue();

  console.log('Сохраняем данные клиента в localStorage:', clientData);
  console.log('Сохраняем данные каталога в localStorage:', catalogueData);

  localStorage.setItem('clientData', clientData);
  localStorage.setItem('catalogueData', catalogueData);
}

document.addEventListener('DOMContentLoaded', () => {

  // Загрузка данных клиента из localStorage
  const savedClientData = localStorage.getItem('clientData');
  if (savedClientData) {
    try {
      client.importClientData(savedClientData);
      console.log('Данные клиента загружены.');
    } catch (error) {
      console.error('Ошибка при загрузке данных клиента:', error);
    }
  }

  // Загрузка данных магазина из localStorage
  const savedCatalogueData = localStorage.getItem('catalogueData');
  if (savedCatalogueData) {
    try {
      store.importCatalogue(savedCatalogueData);
      console.log('Данные каталога загружены.');
    } catch (error) {
      console.error('Ошибка при загрузке данных каталога:', error);
    }
  }

  // Отображение клиентов и книг при загрузке страницы
  displayClients();
  displayBooks();
  displayClientBooks();

  // Обработчик popup
  const popupShown = localStorage.getItem('popupShown');

  if (!popupShown) {
    if (popup && denyPopup && confirmPopup) {

      popup.style.display = "flex";
      denyPopup.addEventListener("click", function () {
        popup.style.display = "none";
        localStorage.setItem('popupShown', 'true');
      });

      confirmPopup.addEventListener("click", function () {
        popup.style.display = "none";
        localStorage.setItem('popupShown', 'true');
      });
    }
  }

  // Обработчик поиска в магазине
  if (storeSearchInput && storeSearchButton) {
    storeSearchInput.addEventListener('change', searchStoreBooks);
    storeSearchButton.addEventListener('click', searchStoreBooks);
  }

  // Обработчик поиска в библиотеке
  if (librarySearchInput && librarySearchButton) {
    librarySearchInput.addEventListener('change', searchLibraryBooks);
    librarySearchButton.addEventListener('click', searchLibraryBooks);
  }

  // Обработчик загрузки книги покупателем
  if (fileInput && addBookButton && clearFormButton) {
    fileInput.addEventListener('change', handleFileChange);
    addBookButton.addEventListener('click', addBookToLibrary);
    clearFormButton.addEventListener('click', clearLibraryForm);
  }

  // Обработчик подписки на новости
  if (newsLetterForm) {
    newsLetterForm.addEventListener('submit', confirmNewsLetterForm);
  }

  // Обработчик событий фильтра
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
