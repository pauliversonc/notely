class ModalView {
  _note;
  _update = false;
  _btnAdd = document.querySelector('.btn.add');
  _btnPin = document.querySelector('.modal--card--pin');
  _modalFooter = document.querySelector('.modal--card--footer');  
  _modal = document.querySelector('.modal');
  _modalCard = document.querySelector('.modal--card');
  _title = document.querySelector('.form__title');
  _body = document.querySelector('.form__body');

  constructor() {
    this._addHandlerBtnAdd();
    this._addHandlerInputTitle();
    this._addHandlerInputBody();
  }

  // create new note via pinned
  addHandlerPinNote(handler) {
    this._btnPin.addEventListener('click', (e) => {
      const btn = e.target.closest('.modal--card--pin')
      if(!btn) return
      const obj = this._getFormValue();

      // check if current modal is for update
      const isUpdate = this._update;
      // run handler
      handler('pin',obj, isUpdate, this._note?.id);
      // show modal
      this._toggleModal();
      // clears title
      this._clearModal(true); 
      // clears body
      this._clearModal(false); 
      // set modal pin to default
      this._hidePinned();
      // set modal to default ui / form
      this._unsetModalUpdate();
       // resize modal base on its value
      this._resizeModal() 



    });
  }


  // save note or close modal
  addHandlerModalFooter(handler) {
    this._modalFooter.addEventListener('click', (e) => {
      const btn = e.target.closest('.modal--footer--btn')
      if(!btn) return
      const {btnType} = btn.dataset;

      // get the value in the form
      // pass btntype and value from the form to controlModal
      if(btnType === 'save' || btnType === 'update') {
        const obj = this._getFormValue();
        const isUpdate = this._update;
   
        handler(btnType, obj, isUpdate, this._note?.id);        
      }
      
        // set update to fasle
        this._update = false;
        // hide pinned button in modal
        this._hidePinned();
        // hide modal
        this._toggleModal();
        // clears title
        this._clearModal(true); 
        // clears body
        this._clearModal(false); 
        // remove update btn
        this._unsetModalUpdate(); 
      
    })
  }



  _getFormValue() {
    const title = this._title.value;
    const body = this._body.value;

    return {
      title,
      body
    }
  }

  setFormValue(note){
    // set note
    this._note = note;
    this._update = true;

    const {title, body, pinned} = this._note;
    this._title.value = title;
    this._body.value = body;

    // set the design of modal to update-on
    this._setModalUpdate(); 
    // show solid pinned icon or outline pinned icon
    if (pinned) this._showPinned();
    // resize modal base on its value
    this._resizeModal() 
    // show modal
    this._toggleModal(); 
  }

  _resizeModal() {
    // setTimeout is used to delay the execution code
    // so that this._body.scrollHeight will return an accurate value
    setTimeout(() => {
      let lineHeightBody = parseInt(window.getComputedStyle(this._body).lineHeight);
      let rowsBody = Math.ceil(this._body.scrollHeight / lineHeightBody);
      this._body.rows = rowsBody - 1;
  
  
    
      let lineHeightTitle = parseInt(window.getComputedStyle(this._title).lineHeight);
      let rowsTitle = Math.ceil(this._title.scrollHeight / lineHeightTitle);
      this._title.rows = rowsTitle - 1;
    }, 0);

  }


  _toggleModal() {
      this._modal.classList.toggle('show');
  }

  _addHandlerBtnAdd() {
    this._btnAdd.addEventListener('click', this._toggleModal.bind(this));
  }

  _inputEvent(e){
    
    if (e.target.value.length) {
      e.target.style.height = "auto";
      e.target.style.height = (e.target.scrollHeight) + "px";
    } else {
      const isTitle = e.target.classList.contains('form__title');

      this._clearModal(isTitle);
      // this._resetModal(isTitle);
    }
  }

  _addHandlerInputTitle() {
    this._title.addEventListener('input', this._inputEvent.bind(this));
  }

  _addHandlerInputBody() {
    this._body.addEventListener('input', this._inputEvent.bind(this));
  }

  // on input run this
  _clearModal(isTitle) {

    if (isTitle) {
      this._title.value = '';
      this._title.rows = 2;
      this._title.style.height = "auto";
    } else {
      this._body.value = '';
      this._body.rows = 2;
      this._body.style.height = "auto";
    }
  }

  // _resetModal(isTitle) {
  //   // set the modal size to its default value
  //   if (isTitle) {
  //     this._title.rows = 2;
  //     this._title.value = '';
  //   } 

  //   // clear note title and body to 
  //   else {
  //     this._body.rows = 2;
  //     this._body.value = '';
  //   }
  // }

  hideBtnAdd() {
    this._btnAdd.classList.add('d-none');
  }

  showBtnAdd() {
    this._btnAdd.classList.remove('d-none');
  }

  _showPinned() {
    this._modalCard.classList.add('pinned')
  }

  _hidePinned() {
    this._modalCard.classList.remove('pinned')
  }

  // hide save btn and pinned btn to focus on firing the update
  _setModalUpdate(){
    this._modal.classList.add('update-on');
  }

  // revert changes happened in setModalUpdate()
  _unsetModalUpdate(){
    this._modal.classList.remove('update-on');
  }

}

export default new ModalView();