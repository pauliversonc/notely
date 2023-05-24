import 'core-js/stable';

class ToastView {
  _toast = document.querySelector('.toast');
  _toastMessage = document.querySelector('.toast--message');

  openToast(message, seconds){
    this._toastMessage.innerHTML = message;
    this._toast.classList.add('show');
    setTimeout(()=>{
      this._toast.classList.remove('show');
    }, seconds * 1000);
  }
}

export default new ToastView();