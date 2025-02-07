import {Book, StoreBook, Store, Client, SearchBookDetails} from './store';

// Получение DOM элементов
const storeSearchInput = document.getElementById('store-search-input') as HTMLInputElement;
const storeSearchButton = document.getElementById('store-search-button') as HTMLButtonElement;
const librarySearchInput = document.getElementById('library-search-input') as HTMLInputElement;
const librarySearchButton = document.getElementById('library-search-button') as HTMLButtonElement;
const fileInput = document.getElementById('book-image') as HTMLInputElement;
const addBookButton = document.getElementById('add-book-button') as HTMLButtonElement;
const clearFormButton = document.getElementById('clear-form-button') as HTMLButtonElement;
const newsLetterForm = document.getElementById('newsletter-form') as HTMLFormElement;
const openFilter = document.getElementById('open-filter') as HTMLImageElement;
const closeFilter = document.getElementById('close-filter') as HTMLButtonElement;
const applyFilters = document.getElementById('apply-filters') as HTMLButtonElement;
const clearFilters = document.getElementById('close-filters') as HTMLButtonElement;
const priceRange = document.getElementById('price-range') as HTMLInputElement;
const yearRange = document.getElementById('year-range') as HTMLInputElement;
const popup = document.getElementById("popup") as HTMLElement;
const denyPopup = document.getElementById("deny-popup") as HTMLButtonElement;
const confirmPopup = document.getElementById("confirm-popup") as HTMLButtonElement;

// Создание покупателя
const client = new Client({name: 'Иван Иванов', balance: 40, image: 'img/first_client.jpeg'});

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
];
books.forEach(book => store.addBook(book));

// Создание карточки покупателя
function createClientCard(client: Client, addClientFund: () => void): HTMLElement {
  const clientCard = document.createElement('div');
  clientCard.className = 'client-card';

  const clientImage = client.image
    ? `<img src="${client.image}" alt="${client.name}" class="client-image">`
    : `<div class="client-image-placeholder"></div>`;

  clientCard.innerHTML = `
    ${clientImage}
    <h3>${client.name}</h3>
    <div class="client-details">
      <p class="client-balance">${client.balance.toFixed(2)} €</p>
      <button class="book-button">Увеличить баланс</button>
    </div>
  `;

  const bookButton = clientCard.querySelector('.book-button') as HTMLElement;
  bookButton.addEventListener('click', addClientFund);

  return clientCard;
}

// Создание карточки книги
function createBookCard(storeBook: StoreBook, handleBook: () => void): HTMLElement {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';

  const bookImage = storeBook.book.image
    ? `<img src="${storeBook.book.image}" alt="${storeBook.book.title}" class="book-image">`
    : `<div class="book-image-placeholder"></div>`;

  bookCard.innerHTML = `
    ${bookImage}
    <h3>${storeBook.book.title}</h3>
    <div class="book-details">
      <p class="book-author">${storeBook.book.author}</p>
      <p class="book-price">${storeBook.book.price.toFixed(2)} €</p>
    </div>
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
    const priceElement = bookCard.querySelector('.book-price');
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

  console.log('Текущий список книг клиента:', client.purchasedBooks);
  console.log('Текущий список книг в каталоге:', Array.from(store.catalogue.values()));
}

// Поиск книг в магазине по названию, автору и жанру
function searchStoreBooks(): void {
  let query = storeSearchInput.value.toLowerCase().trim();
  console.log('Поиск по запросу:', query);

  let book: SearchBookDetails = {
    title: query,
    author: query,
    genre: query
  }

  let foundBooks: StoreBook[] = store.searchBook(book);
  console.log(foundBooks);
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
function searchLibraryBooks(): void {
  let query = librarySearchInput.value.toLowerCase().trim();
  console.log('Поиск по запросу:', query);

  let book: SearchBookDetails = {
    title: query,
    author: query,
    genre: query
  }

  let foundBooks: StoreBook[] = client.searchBook(book);
  console.log(foundBooks);
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
function handleFileChange(): void {
  const fileInput = document.getElementById('book-image') as HTMLInputElement;
  const label = document.getElementById('book-image-label') as HTMLLabelElement;

  const file = fileInput.files?.[0];
  if (file) {
    label.textContent = file.name;
  }
}

// Добавление книги покупателем в библиотеку
function addBookToLibrary(event: MouseEvent): void {
  event.preventDefault();
  console.log('Кнопка нажата, обрабатываем добавление книги');

  const fileInput = document.getElementById('book-image') as HTMLInputElement;
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

// Очитка формы добавления книги покупателем в библиотеку
function clearLibraryForm(): void {
  (document.getElementById('book-title') as HTMLInputElement).value = '';
  (document.getElementById('book-author') as HTMLInputElement).value = '';
  (document.getElementById('book-image') as HTMLInputElement).value = '';
  const label = document.getElementById('book-image-label') as HTMLLabelElement;
  label.textContent = 'Обложка';
}

// Обработка события формы рассылки и подтверждение подписки
function confirmNewsLetterForm(event: SubmitEvent) {
  event.preventDefault();

  const newsLetterEmail = document.getElementById('newsletter-email') as HTMLInputElement;
  const confirmationMessage = document.getElementById('confirmation-message') as HTMLElement;
  const email = newsLetterEmail.value.trim();

  if (email) {
    console.log('Email для подписки:', email);

    confirmationMessage.textContent = 'ВЫ ПОДПИСАЛИСЬ НА НОВОСТИ';
    confirmationMessage.style.display = 'block';
    setTimeout(() => {
      confirmationMessage.remove();
    }, 4000);
    newsLetterEmail.value = '';

  } else {
    alert('Пожалуйста, введите корректный email!');
  }
}

// Фильтрация книг по цене и году издания
function openFilterPanel() {
  const filterPanel = document.getElementById('filter-panel') as HTMLElement;

  if (filterPanel) {
    filterPanel.classList.add('open');
  }
}

function closeFilterPanel(): void {
  const filterPanel = document.getElementById('filter-panel') as HTMLElement;

  if (filterPanel) {
    filterPanel.classList.remove('open');
  }
}

function showPriceRange() {
  const priceRange = document.getElementById('price-range') as HTMLInputElement;
  const priceRangeOutput = document.getElementById('price-range-output') as HTMLElement;
  if (priceRange && priceRangeOutput) {
    priceRangeOutput.textContent = priceRange.value + `€`;
  }
}

function showYearRange() {
  const yearRange = document.getElementById('year-range') as HTMLInputElement;
  const yearRangeOutput = document.getElementById('year-range-max') as HTMLElement;
  if (yearRange && yearRangeOutput) {
    yearRangeOutput.textContent = yearRange.value;
  }
}

function applyBooksFilter(event: MouseEvent) {
  event.preventDefault();
  console.log('Кнопка нажата, фильтруем книги');

  const price = +priceRange.value;
  const year = +yearRange.value;

  let foundBooks: StoreBook[] = store.filterBooks(price, year);
  console.log(foundBooks);
  displayStoreSearchResults(foundBooks);
}

function clearBooksFilter() {
  priceRange.value = priceRange.min;
  yearRange.value = yearRange.max;
  displayBooks();
}

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
    if (popup && denyPopup && confirmPopup) {
      console.log('Элементы попап успешно найдены!');

      popup.style.display = "flex";
      denyPopup.addEventListener("click", function () {
        popup.style.display = "none";
      });
      confirmPopup.addEventListener("click", function () {
        popup.style.display = "none";
      });
    } else {
      console.error('Элементы попап не найдены!');
    }

    // Обработчик поиска в магазине
    if (storeSearchInput && storeSearchButton) {
      console.log('Элементы поиска магазина успешно найдены!');

      storeSearchInput.addEventListener('change', searchStoreBooks);
      storeSearchButton.addEventListener('click', searchStoreBooks);
    } else {
      console.error('Элементы поиска магазина не найдены!');
    }

    // Обработчик поиска в библиотеке
    if (librarySearchInput && librarySearchButton) {
      console.log('Элементы поиска библиотеки успешно найдены!');

      librarySearchInput.addEventListener('change', searchLibraryBooks);
      librarySearchButton.addEventListener('click', searchLibraryBooks);
    } else {
      console.error('Элементы поиска библиотеки не найдены!');
    }

    // Обработчик загрузки книги покупателем
    if (fileInput && addBookButton && clearFormButton) {
      console.log('Элементы загрузки книги успешно найдены!');

      fileInput.addEventListener('change', handleFileChange);
      addBookButton.addEventListener('click', addBookToLibrary);
      clearFormButton.addEventListener('click', clearLibraryForm);
    } else {
      console.error('Элементы загрузки книги не найдены!');
    }

    // Обработчик подписки на новости
    if (newsLetterForm) {
      console.log('Элементы формы рассылки успешно найдены!');

      newsLetterForm.addEventListener('submit', confirmNewsLetterForm);
    } else {
      console.error('Элементы формы рассылки не найдены!');
    }

    // Обработчик панели фильтра
    if (openFilter && closeFilter && clearFilters && priceRange && yearRange && applyFilters) {
      console.log('Элементы панели фильтра успешно найден');

      openFilter.addEventListener('click', openFilterPanel);
      closeFilter.addEventListener('click', closeFilterPanel);
      clearFilters.addEventListener('click', clearBooksFilter);
      priceRange.addEventListener('input', showPriceRange);
      yearRange.addEventListener('input', showYearRange);
      applyFilters.addEventListener('click', applyBooksFilter);
    } else {
      console.error('Элементы панели фильтра не найден');
    }

  }
)
;

