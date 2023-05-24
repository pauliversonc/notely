class SideNavView {
  _sideNav = document.querySelector('.side-nav');
  _btnMenu = document.querySelector('.btn__menu');
  _btnNavMenu = document.querySelector('.side-nav--btn__menu');


  _notesEl = document.querySelector('.count__notes');
  _imporantEl = document.querySelector('.count__important');
  _trashEl = document.querySelector('.count__trash');
  _sidenavLinksContainer = document.querySelector('.side-nav--links');
  _sidanavLinks = document.querySelectorAll('.side-nav--link');

  _form = document.querySelector('form');
  _formSearch = document.querySelector('input[type="text"].search');
  

  constructor(){
    // use to initialize the live connection of event
    this._addHandlerFormSubmit();
    this._addHandlerBtnToggle();
    this._addHandlerNavBtnToggle();
  }

  _toggleSideNav() {
    this._sideNav.classList.toggle('show');
  }

  _addHandlerBtnToggle() {
    this._btnMenu.addEventListener('click', this._toggleSideNav.bind(this));
  }

  _addHandlerNavBtnToggle() {
    this._btnNavMenu.addEventListener('click', this._toggleSideNav.bind(this));
  }



  // Prevent form from submitting
  _addHandlerFormSubmit(){
    this._form.addEventListener('submit', function(e){
      e.preventDefault();
    })
  }

  // add keyup event to input form for searching
  addHandlerFormSearch(handler){
    this._formSearch.addEventListener('keyup', function(e){
      const keyword = e.target.value.trim();
      handler(keyword, e)
    })
  }

  // add event to search form when clicking it (focus)
  addHandlerFormFocus(handler){
    this._formSearch.addEventListener('focus', function(){
      handler();
    })
  }

  clearFormSearch(){
    this._formSearch.value = "";
  }

  getSearchFieldValue() {
    return this._formSearch.value.trim()
  }


  render(notes){
    // Destructure notes
    const {saved, important, trash} = notes;

    // Set the count of each element
    this._notesEl.innerHTML = saved;
    this._imporantEl.innerHTML = important;
    this._trashEl.innerHTML = trash;
  }

  addHandlerSidenavLink(handler){
    this._sidenavLinksContainer.addEventListener('click', function(e){
      e.preventDefault();
      const link = e.target.closest('.side-nav--link');
      if(!link) return;

      // pass link element to the handler
      handler(link);


    });
  }

  // Remove active to the class in all of the sidenav links
  removeActive(){
    // get sidenav links
    const links = Array.from(this._sidanavLinks);

    // loop and delete active if exists
    links.forEach((link) => {
      if (link.classList.contains("active")) 
      link.classList.remove("active");
    });

  }

  // Add active to the element
  addActive(link){
    // check if active is not exists in the element, if not then add active
    if (!link.classList.contains("active")) 
    link.classList.add("active");
  }






}

export default new SideNavView();