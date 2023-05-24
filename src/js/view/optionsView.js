import 'core-js/stable';

class OptionsView {
  _selectedOptions = document.querySelector('.selected--options');
  _selectedCount = document.querySelector('.selected--options--header--count');
  _selectedOptionsContainer = document.querySelector('.selected--options--links');
  _btnPin = document.querySelector('.options__pinned');
  _btnImportant = document.querySelector('.options__important');

  
  toggleSelOption(selectedNotesCount = 0, statePath = 'saved', isPinned = false, isImportant = false){
    // set the count of selected notes
    this._selectedCount.innerHTML = selectedNotesCount;

    // show or hide selected options
    if (selectedNotesCount) {
      this._selectedOptions.classList.add('show');
    } else {
      this._selectedOptions.classList.remove('show');
    }

    // show or hide varieties of buttons in selected option container
    if (statePath === 'trash') {
      this._selectedOptionsContainer.classList.add('modified');
    } else {
      this._selectedOptionsContainer.classList.remove('modified');
    }

    if (isPinned) {
      this._btnPin.classList.add('pinned')
    } else {
      this._btnPin.classList.remove('pinned')
    }

    if (isImportant) {
      this._btnImportant.classList.add('star')
    } else {
      this._btnImportant.classList.remove('star')
    }
 
  }

  

  addHandlerSelOptionBtn(handler){
    this._selectedOptionsContainer.addEventListener('click', function(e){
      const element = e.target.closest('.btn__default')
      if(!element) return;
      handler(element);
    });
  }
}

export default new OptionsView();



