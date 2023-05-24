import 'core-js/stable';

class MainView {
  _notes;
  _pinnedNotes;
  _unpinnedNotes;
  
  _trashContainer = document.querySelector(".main--card--grid__trash");
  _pinnedContainer = document.querySelector(".main--card--grid__pinned");
  _savedContainer = document.querySelector(".main--card--grid__saved");

  _pinnedTitle = document.querySelector(".main--card--title.pinned");
  _savedTitle = document.querySelector(".main--card--title.saved");

  _notesWrapper = document.querySelector('.main--card--container--wrapper');

  _BtnViewAndSortContainer = document.querySelector('.main--control--btns');
  _btnView = document.querySelector('.btn__view');
  _btnSort = document.querySelector('.btn__sort');

  _header = document.querySelector('.header');
  _btnOptions = document.querySelector('.btn.options');
  

  constructor() {
    this._addHandlerObserver();
    this._addHandlerBtnOptions();
  }

  _addHandlerBtnOptions() {
    this._btnOptions.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn.options')
      if(!btn) return
      this._btnOptions.classList.toggle('active');
    });
  }

  scrollToTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render saved, important
  render(notes) {
    // object destructure
    const { pinned, unpinned, status } = notes;

    // set notes
    this._pinnedNotes = pinned;
    this._unpinnedNotes = unpinned;

    // return boolean if notes exist
    const hasNotes = pinned.length || unpinned.length;

    // clear container
    this._clearContainer();

    // clear pined and saved title if note status is trash
    this._updateTitles(status, hasNotes);
    
    // clear message
    this._clearMessage();

    // check if has notes count is true
    if (hasNotes) {
      
      // if status = 'trash', pinned and unpinned notes will be rendered in trash container
      if (status === 'trash') { 
        // render trash notes
        this._pinnedNotes.forEach((note) => {
          this._renderTrash(note);
        });
        // render trash notes
        this._unpinnedNotes.forEach((note) => {
          this._renderTrash(note);
        });
      } 

      // else it will render saved and important notes
      else {
        // render pinned notes
        this._pinnedNotes.forEach((note) => {
          this.renderPinned(note);
        });

        // render unpinned notes
        this._unpinnedNotes.forEach((note) => {
          this.renderUnpinned(note);
        });
      }

    } 

    // if not true render a message
    else {
      this._renderMessage(status);
    }
  }

  renderSearch(notes) {
    // set notes
    this._notes = notes;

    // return boolean if query notes exist
    const hasNotes = notes.length;

    // clear container
    this._clearContainer();

    // clear pined and saved title if note status is trash
    this._updateTitles('trash', hasNotes);

    // clear message
    this._clearMessage();

    // render notes -- if there is matched
    if (hasNotes) {
      // reusing trash container for the search
      this._notes.forEach((note) => {
        this._renderTrash(note);
      });
    } 
    
    // render message
    else {
      this._renderMessage('search');
    }

  }

  // _addHandlerBtnView() {
  //   this._btnView.addEventListener('click', this._toggleBtnView.bind(this));
  // }

  _toggleBtnView() {
    const [line, square] = this._btnView.children;
    this._trashContainer.classList.toggle('alt-grid');
    this._pinnedContainer.classList.toggle('alt-grid');
    this._savedContainer.classList.toggle('alt-grid');

    line.classList.toggle('d-none');
    square.classList.toggle('d-none');
  }

  // Event listener for sort and view
  addHandlerBtnViewAndSort(handler) {
    this._BtnViewAndSortContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.main--control--btn');
      if(!btn) return;
      
      // check if btn that clicked is the sort btn
      const isSort = btn.classList.contains("btn__sort");
      
      if (isSort) {

        // change the btn sort icon
        this._btnSort.classList.toggle('on');

        // handle the event
        handler();

      } else {
        this._toggleBtnView();
      }
    });
  }

  addHandlerNotesWrapper(handler){
    this._notesWrapper.addEventListener('click', function(e){

      const btnCheckBox = e.target.closest('.card--checkbox');
      const btnFooter = e.target.closest('.btn');
      const cardWrapper = e.target.closest('.card--wrapper');
      const mainCard = e.target.closest('.main--card');

      // this is nullish coalescing operator it immediately returns the value that is true;
      const element = btnCheckBox ?? btnFooter ?? cardWrapper ?? mainCard;

      // set the elements to array
      const elements = [btnCheckBox, cardWrapper, btnFooter];
      
      // guard clauses
      if(!element) return

      // extract cardId in maincard element
      const {cardId} = mainCard.dataset;

      // find the index of elements where value isn't null
      const index = elements.findIndex(element => element !== null);

      // pass the element and index that is clicked
      handler(element, index, +cardId);

    });
  }

  // Toggle checkbox by element
  toggleCheckbox(element){
    element.classList.toggle('selected');
  }

  // remove class in the selected maincard element
  removeSelNotes(){
    const elements = document.querySelectorAll('.main--card.selected');
    if (elements.length) { // check if elements are length are true
      for (const element of elements) {
        element.classList.remove('selected'); // remove selected in main--card class
      }
    }
  }

  _clearContainer(){
    this._trashContainer.innerHTML = "";
    this._pinnedContainer.innerHTML = "";
    this._savedContainer.innerHTML = "";
  }

  _updateTitles(status, hasNotes){
    this._pinnedTitle.textContent = status === 'trash' || !hasNotes ? '' : 'Pinned';
    this._savedTitle.textContent = status === 'trash' || !hasNotes ? '' : 'Saved';
  }

  _renderTrash(note) {
    const markup = this._generateMarkup(note);
    this._trashContainer.insertAdjacentHTML("afterbegin", markup);
  }

  renderPinned(note) {
    const markup = this._generateMarkup(note);
    this._pinnedContainer.insertAdjacentHTML("afterbegin", markup);
  }

  renderUnpinned(note) {
    const markup = this._generateMarkup(note);
    this._savedContainer.insertAdjacentHTML("afterbegin", markup);
  }

  scrollIntoView(btnType){
    // scroll to save container
    if (btnType === 'save') {
      this._savedTitle.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    } 
    // scroll to pinned container
    else {
      this._pinnedTitle.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      
    }

  }

  _generateMarkup(note) {
    const formattedTittle = this._transformText(note.title);
    const formattedBody =  this._transformText(note.body);

    return `
    <div class="main--card--wrapper">
    <div class="main--card " data-card-id="${note.id}">

      <div class="card--checkbox" role="button">
        <svg class="svg-icon icon__sm" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M883.2 226.133333c-17.066667-17.066667-42.666667-17.066667-59.733333 0L384 665.6l-183.466667-183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0s-17.066667 42.666667 0 59.733334l213.333333 213.333333c8.533333 8.533333 17.066667 12.8 29.866667 12.8s21.333333-4.266667 29.866667-12.8l469.333333-469.333333c17.066667-17.066667 17.066667-42.666667 0-59.733334z" />
        </svg>
      </div>

      <div class="card--wrapper">
      <div class="card--header">
        <span class="card--title">${formattedTittle}</span>
      </div>

      <div class="card--body" >
        <p class="card--paragraph">${formattedBody}</p>
      </div>
      </div>

      <div class="card--footer ${(note.status === 'trash') ? 'justify-start' : ''}">

      <!-- OPTIONS| pinned, active -->
      ${note.status === 'trash'? '': `
      <button class="btn btn__default pin  ${note.pinned ? 'pinned' : ''}" data-btn-type="pinned">
        <svg class="svg-icon icon__sm pin__outlined" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M768 128v85.333333h-42.666667v256l85.333334 128v85.333334h-256v298.666666h-85.333334v-298.666666H213.333333v-85.333334l85.333334-128V213.333333H256V128h512zM384 213.333333v281.856L315.904 597.333333h392.192L640 495.189333V213.333333H384z" />
        </svg>

        <svg class="svg-icon icon__sm pin__solid" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M768 128v85.333333h-42.666667v256l85.333334 128v85.333334h-256v298.666666h-85.333334v-298.666666H213.333333v-85.333334l85.333334-128V213.333333H256V128z" />
        </svg>
      </button>`}

      <!-- OPTIONS| active -->
      ${note.status === 'trash'? '': `
      <button class="btn btn__default  star " data-btn-type="important">
      
        <!-- OPTIONS| icon__solid -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6 icon__sm ${(note.status === 'important') ? 'icon__solid' : ''}">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>`}

    ${note.status !== 'trash'? '': `
    <button class="btn btn__default restore " data-btn-type="restore">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="w-6 h-6 icon__sm">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
      </svg>
    </button>`}

      <button class="btn btn__default trash" data-btn-type="trash">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6 icon__sm">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>

    </div>
    </div>
    </div>
  `;
  }

  _transformText(text) {
    return text.replace(/\n/g, "<br>");
  };

  _clearMessage(){
    const element = document.querySelector('.main--card--message');
    if(!element) return
    element.remove();
  }

  _renderMessage(status){
    const markup = this._generateMarkupMessage(status)
    this._notesWrapper.insertAdjacentHTML('beforeend', markup);
  }

  // Markup for display message when notes is not set;
  _generateMarkupMessage(status){
    let icon = '';
    let message = '';

    if(status === 'saved'){
      icon = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />';
      message = 'Add new notes';
    }
  
    if(status === 'important'){
      icon = '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />';
      message = 'Save important notes';
  
    }
  
    if(status === 'trash'){
      icon = '<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />';
      message = 'No notes in trash';
    }

    if(status === 'search'){
      icon = '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />';
      message = 'No results found';
    }


  return `
    <div class="main--card--message">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 icon icon__lg">
        ${icon}
      </svg>
      <p class="main--card--message--paragraph">
        ${message}
      </p>
    </div>  
  `;
  }

  _addHandlerObserver(){
    const obsCallback = (entries) => {
      // use array destructuring to avoid loop
      const [entry] = entries;
      if(!entry.isIntersecting) this._header.classList.add('sticky');
      else this._header.classList.remove('sticky');
    }
    
    const obsOptions = {
      root: null,
      threshold: [0.1, 0.5], // passing multiple value to check the in and out of the element in viewport.
    }
    
    // Observe
    const observer = new IntersectionObserver(obsCallback, obsOptions);
    observer.observe(this._BtnViewAndSortContainer);

  }

}



export default new MainView();
