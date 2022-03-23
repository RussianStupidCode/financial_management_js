
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.expenseListElement = document.querySelector("#expense-accounts-list");
    this.incomeListElement = document.querySelector("#income-accounts-list");
    this.renderAccountsList();
  }

  /**
   * Формирует HTML разметку для выбора транзакции
   */
  getOptionHTML(data) {
    return `
      <option value="${data.id}">${data.name}</option>
    `
  }

  /**
   * Очистить выпадающие списки
   */
  clear() {
    for(const el of this.expenseListElement.querySelectorAll("option")) {
      el.remove();
    }

    for(const el of this.incomeListElement.querySelectorAll("option")) {
      el.remove();
    }
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if(!response || !response.success) {
        console.log(err);
        return;
      }

      this.clear();

      for(const account of response.data) {
        this.expenseListElement.insertAdjacentHTML("afterBegin", this.getOptionHTML(account));
        this.incomeListElement.insertAdjacentHTML("afterBegin", this.getOptionHTML(account));
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const requestData = {
      ...data,
      account_id: App.getWidget("accounts").accountId,
    }

    Transaction.create(requestData, (err, response) => {
      if(response && response.success) {
        App.update();
        this.reset();

        if(data.type == "expense") {
          App.getModal("newExpense").close();
        } else {
          App.getModal("newIncome").close();
        }

        
        
      } else {
        console.log(err);
      }
    }); 
  }
}