
/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element == null) {
      throw TypeError("empty element");
    }

    this.element = element;
    this.lastOption = null;
    this.contentElement = this.element.querySelector(".content");
    this.registerEvents();
  }

  static monthArray = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
  ];
  
  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOption);
  }

  /**
   * отслеживает удаление транзакций
   */
  registerTransactionDelete() {
    const transactionsList = this.contentElement.querySelectorAll(".transaction__remove");
    for(const transaction of transactionsList) {
      transaction.addEventListener("click", event => {
        event.preventDefault();
        this.removeTransaction(transaction.dataset["id"]);
      });
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = this.element.querySelector(".remove-account");

    removeAccount.addEventListener("click", event => {
      event.preventDefault();
      this.removeAccount();
    });

    this.registerTransactionDelete();
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOption == null) {
      return;
    }

    if(!confirm("Вы действительно хотите удалить счёт?")) {
      return;
    }

    const accountId = App.getWidget("accounts").accountId;
    console.log(accountId);

    Account.remove({id: accountId}, (err, response) => {
      this.clear();
      if(response && response.success) {
        App.updateWidgets();
        App.updateForms();
      }
    });
    
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    
    if(!confirm("Вы действительно хотите удалить эту транзакцию?")) {
      return;
    }

    Transaction.remove({id}, (err, response) => {
      if(response && response.success) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options == null) {
      return;
    }

    this.lastOption = options;

    Account.get(options.account_id, (err, response) => {
      if(response && response.success) {
        this.renderTitle(response.data.name);
      };
    });

    Transaction.list(options, (err, response) => {
      if(!response || !response.success) {
        console.log(err);
        return;
      }
      this.renderTransactions(response.data);
    });
  }

  /**
   * очистить транзакции со страницы
   * 
   */
  clearTransaction() {
    for(const el of this.contentElement.querySelectorAll(".transaction")) {
      el.remove();
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOption = null;

  } 

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const d = new Date(date);
    return `${d.getDate()} ${TransactionsPage.monthArray[d.getMonth() + 1]} ${d.getFullYear()} г. в ${d.getHours()}:${d.getMinutes()}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
    <!-- либо transaction_expense, либо transaction_income -->
    <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <!-- дата -->
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    this.clearTransaction();
    for(const el of data) {
      this.contentElement.insertAdjacentHTML("afterBegin", this.getTransactionHTML(el));
    }
    this.registerTransactionDelete();
  }
}