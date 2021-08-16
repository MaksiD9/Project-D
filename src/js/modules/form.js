export default class Form {
    constructor(forms) {
      this.forms = document.querySelectorAll(forms);
      this.inputs = document.querySelectorAll('input');
      this.messages = {
        loading: 'Loading...',
        success: 'Success!',
        failure: 'error',
      };
      this.path = 'assets/question.php';
    }
   
    clearInputs() {
      this.inputs.forEach((input) => (input.value = ''));
    }
   
    toggleBtn(boolean) {
      this.forms.forEach((form) => {
        let btn = form.querySelector('.btn');
        btn.disabled = boolean;
      });
    }
   
    checkInputsEmptyWarning() {
      this.inputs.forEach((input) => {
        input.addEventListener('blur', () => {
          if (input.value.trim() === '') {
            input.style.border = '1px solid red';
            input.placeholder = 'please add text';
            this.toggleBtn(true);
          } else {
            input.placeholder = '';
            input.style.border = '';
            this.toggleBtn(false);
          }
        });
      });
    }
   
    checkMailInputs() {
      const mailInputs = document.querySelectorAll('[type="email"]');
   
      mailInputs.forEach((input) => {
        // запрет кирилицы и email
        input.addEventListener('keypress', function (e) {
          if (e.key.match(/[^a-z 0-9 @ \.]/gi)) {
            e.preventDefault();
          }
        });
      });
    }
   
    initMask() {
      let setCursorPosition = (pos, elem) => {
        elem.focus();
   
        if (elem.setSelectionRange) {
          elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
          let range = elem.createTextRange();
   
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      };
   
      function createMask(event) {
        let matrix = '+1 (___) ___-____',
          i = 0,
          def = matrix.replace(/\D/g, ''),
          val = this.value.replace(/\D/g, '');
   
        if (def.length >= val.length) {
          val = def;
        }
   
        this.value = matrix.replace(/./g, function (a) {
          return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        });
   
        if (event.type === 'blur') {
          if (this.value.length == 2) {
            this.value = '';
          }
        } else {
          setCursorPosition(this.value.length, this);
        }
      }
   
      let inputs = document.querySelectorAll('[name="phone"]');
   
      inputs.forEach((input) => {
        input.addEventListener('input', createMask);
        input.addEventListener('focus', createMask);
        input.addEventListener('blur', createMask);
      });
    }
   
    async postData(url, data) {
      let res = await fetch(url, {
        method: 'POST',
        body: data,
      });
   
      return await res.text();
    }
   
    init() {
      this.toggleBtn(true);
      this.checkInputsEmptyWarning();
      this.checkMailInputs();
      this.initMask();
   
      this.forms.forEach((item) => {
        item.addEventListener('submit', (event) => {
          event.preventDefault();
   
          // блок для вывода сообщений
          let statusMessage = document.createElement('div');
          statusMessage.classList.add('animated');
          statusMessage.classList.add('tada');
          statusMessage.style.cssText = `
            margin-top: 45px;
            font-size: 35px;
            color: grey;
            text-align: center;
          `;
          item.parentNode.appendChild(statusMessage);
   
          item.classList.add('animated');
          item.classList.add('fadeOutRight');
   
          setTimeout(() => {
            item.style.display = 'none';
          }, 500);
   
          const { loading, success, failure } = this.messages;
   
          setTimeout(() => {
            statusMessage.textContent = loading;
          }, 500);
   
          const formData = new FormData(item);
          this.postData(this.path, formData)
            .then((response) => {
              console.log(response);
   
              setTimeout(() => {
                statusMessage.textContent = success;
              }, 500);
            })
            .catch((error) => {
              statusMessage.textContent = failure;
              console.log(error);
            })
            .finally(() => {
              this.clearInputs();
              setTimeout(() => {
                statusMessage.remove();
              }, 7000);
            });
        });
      });
    }
  }