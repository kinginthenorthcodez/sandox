/* Storage test surport */

function storageAvailable(type){
  let storage;
  try {
    const test = '__storage_test__';
    storage = window[type];
    storage.setItem(test,test);
    storage.removeItem(test);
    return true;
  } catch(e){
    return (
    e instanceof DOMException 
    && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') 
    && storage
    && storage.length !== 0
    );
  }
};

const bookShelf = document.querySelector('#bookShelf');
const bookTitle = document.querySelector('#bookTitle');
const bookAuthor = document.querySelector('#bookAuthor');
const bookInfo = document.querySelector('#bookInfo');
const addBtn = document.querySelector('#addBtn');
const infoBtns = document.querySelectorAll('.book-info');
const menuLinks = document.querySelectorAll('.link-item')
const contact = document.querySelector('.contact');
const inputsContainer = document.querySelector('#inputsContainer');
const welcomeMsg = document.querySelector('.welcome-msg');
const titleHead = document.querySelector('.title');
const timeDate = document.querySelector('.date-item');

/* Book constructor template */
class BookManager{
  constructor(){
    this.library = JSON.parse(localStorage.getItem('BookStore')) || [];
    this.favorite = JSON.parse(localStorage.getItem('favoriteBooks')) || [];
  };
  
  statusBook(e){
    console.log("Book Status");
    e.target.classList.toggle('bk-state');
    if( e.target.classList.contains('bk-state')) {
      e.target.style.backgroundColor = '#32cd32';
      e.target.innerHTML= 'Read';
    } else {
      e.target.style.backgroundColor = '#4169e1';
      e.target.innerHTML= 'Unread';
    }
  };

  favoriteBook(e){
    console.log("Book favoriteBook");
    this.library = JSON.parse(localStorage.getItem('BookStore')) || [];
    this.favorite = JSON.parse(localStorage.getItem('favoriteBooks'));
    e.target.classList.toggle('add-fav');
    if ( e.target.classList.contains('add-fav')) {
      e.target.style.backgroundColor = '#32cd32';
      this.library.forEach((booky) => {
          if(e.target.id === booky.id){
            this.favorite.push(booky);
            return;
          }
        });
      localStorage.setItem('favoriteBooks', JSON.stringify(this.favorite)); 
    } else {
      e.target.style.backgroundColor = '#4169e1';
      let removeFav = this.favorite.filter((item) => e.target.id !== item.id);
      console.log(removeFav)
      localStorage.setItem('favoriteBooks', JSON.stringify(removeFav));
    }
  };

  remarkBook(){
    console.log("Book remarkBook");
  };

  updateBook(){
    console.log("Book updateBook");
  };

  removeBook(e){
    console.log("Book removeBook");
    this.library = JSON.parse(localStorage.getItem('BookStore')) || [];
    let removeBook = this.library.filter((book) => e.target.id !== book.id);
    localStorage.setItem('BookStore',JSON.stringify(removeBook));

    e.target.parentElement.remove();
    infoBtns.forEach((infoBtn) => {
      if(e.target.id === infoBtn.id){
        infoBtn.remove();
      }
    });
    
  };

 
  addBook(title,author,bookinfo){
    /* Generate random id and store book in library */
    const bookId = Math.random().toString(36).replace(/[^a-z]+/g, '').slice(2,5);
    let newBook = {id: bookId, title, author,bookinfo};
    this.library.push(newBook);
    localStorage.setItem('BookStore', JSON.stringify(this.library));
    this.setStorage();
    this.getBook();
    clearInputs();
   
  };
  
  getBook(){
      this.library = JSON.parse(localStorage.getItem('BookStore'));
      let tempBox = document.querySelector('#tempBox');
       if(tempBox) tempBox.remove();

      tempBox = document.createElement('div');
      tempBox.classList.add('temp-box');
      tempBox.id ='tempBox';

      if(this.library.length !== 0){
        this.library.forEach((bookItem) => {
          const bookContainer = document.createElement('div');
          bookContainer.classList.add('book-container');
          
          const innerBookContainer =document.createElement('div');
          innerBookContainer.classList.add('inner-bookCont');

          const bookData = document.createElement('h2');
          bookData.classList.add('book-data');
          bookData.textContent = ` "${bookItem.title}" by ${bookItem.author}`;
          innerBookContainer.appendChild(bookData);

          const bookStatus = document.createElement('button');
           bookStatus.classList.add('book-status');
           bookStatus.id = bookItem.id;
           bookStatus.textContent = 'Status';
           innerBookContainer.appendChild(bookStatus);

          const bookFavorite = document.createElement('button');
          bookFavorite.classList.add('book-favorite');
          bookFavorite.id = bookItem.id;
          bookFavorite.textContent = 'Add Favorite';
          innerBookContainer.appendChild(bookFavorite);

          const bookRemarks = document.createElement('button');
          bookRemarks.classList.add('book-remark');
          bookRemarks.id = bookItem.id;
          bookRemarks.textContent = 'Add Remarks';
          innerBookContainer.appendChild(bookRemarks);

          const bookUpdate = document.createElement('button');
          bookUpdate.classList.add('book-update');
          bookUpdate.id = bookItem.id;
          bookUpdate.textContent = 'Edit';
          innerBookContainer.appendChild(bookUpdate);

          const bookRemove = document.createElement('button');
          bookRemove.classList.add('book-remove');
          bookRemove.id = bookItem.id;
          bookRemove.textContent = 'Remove';
          innerBookContainer.appendChild(bookRemove);

          bookStatus.addEventListener('click', this.statusBook);
          bookFavorite.addEventListener('click', this.favoriteBook);
          bookRemarks.addEventListener('click', this.remarkBook);
          bookUpdate.addEventListener('click', this.updateBook);
          bookRemove.addEventListener('click', this.removeBook)

          bookContainer.appendChild(innerBookContainer);
          
          const bookInfo = document.createElement('p');
          bookInfo.classList.add('book-info');
          bookInfo.id = bookItem.id;
          bookInfo.textContent = bookItem.bookinfo;
          bookContainer.appendChild(bookInfo);

          tempBox.appendChild(bookContainer);

        });
        bookShelf.appendChild(tempBox);
      }
  };

  setStorage(){
    if(storageAvailable('localStorage')){
      if(this.library.length !== 0){
      localStorage.setItem('favoriteBooks', JSON.stringify(this.favorite));
      }
    }
  };
}

 
/* BookManager Object */
let book = new BookManager();

/* clear inputs */

const clearInputs = () => {
  bookTitle.value = '';
  bookAuthor.value = '';
  bookInfo.value = '';
}


// Nav bar Menu

function showSection(e) {
  if (e.target.id === 'list') {
    bookShelf.style.display = 'block';
    contact.style.display = 'none';
    inputsContainer.style.display = 'none';
    welcomeMsg.style.display = 'none';
  } else if (e.target.id === 'add-new') {
    bookShelf.style.display = 'none';
    inputsContainer.style.display = 'block';
    contact.style.display = 'none';
    titleHead.style.display = 'block';
    welcomeMsg.style.display = 'none';
  } else if (e.target.id === 'contact') {
    bookShelf.style.display = 'none';
    inputsContainer.style.display = 'none';
    contact.style.display = 'flex';
    welcomeMsg.style.display = 'none';
    titleHead.style.display = 'none';
  }
}

menuLinks.forEach((link) => {
  link.addEventListener('click', showSection);
});


/* Event Listners */
if(storageAvailable('localStorage')) {
window.addEventListener('load', () => {
  clearInputs();
});
addBtn.addEventListener('click', () => {
  book.addBook(bookTitle.value, bookAuthor.value, bookInfo.value);
});
} else {
  console.log("Awesome Book can Not run on your Browser!")
}


