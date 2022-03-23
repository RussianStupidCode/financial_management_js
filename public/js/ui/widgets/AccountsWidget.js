/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element == null) {
      throw TypeError("empty element");
    }

    this.element = element;
    this.accountPanel = document.querySelector(".accounts-panel");
    this.registerEvents();
    this.update();
  }

  // текущий активный элемент
  _activeElement = null;

  get activeElement() {
    return this._activeElement;
  }

  getAccountElements() {
    return this.accountPanel.querySelectorAll(".account");
  }

  get accountId() {
    if(this._activeElement == null) {
      return null;
    }

    return this._activeElement.dataset["id"];
  }

  accountsRegisterEvent() {
    const accounts = this.getAccountElements();
    for(const el of accounts) {
      el.addEventListener("click", event => {
        event.preventDefault();
        this.onSelectAccount(el);
      });
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createButton = this.element.querySelector(".create-account");
    createButton.addEventListener("click", event => {
      event.preventDefault();

      App.getModal("createAccount").open();
    });

    this.accountsRegisterEvent();
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current() == null) {
      return;
    }

    Account.list({}, (err, response) => {
      if(response && response.success) {
        this.clear();
        this.renderItem(response["data"]);
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountList = this.getAccountElements()
    for(const el of accountList) {
      el.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if(element === this._activeElement) {
      return;
    }

    if(this._activeElement != null) {
      this._activeElement.classList.remove("active");
    }

    element.classList.add("active");
    this._activeElement = element;

    App.showPage("transactions", {account_id: element.dataset["id"]});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
    <li class="account" data-id="${item.id}">
      <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
      </a>
    </li>
    `
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for(const account of data) {
      const el = this.getAccountHTML(account);
      this.accountPanel.insertAdjacentHTML("beforeEnd", el);
    }

    this.accountsRegisterEvent();
  }
}
