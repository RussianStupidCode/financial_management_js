/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static _URL = "";

  static createRequestData(data, callback, method) {
    return {
      data,
      callback,
      url: this.URL,
      method
    }
  }

  static get URL() {
    return this._URL;
  };
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
    const requestData = this.createRequestData(data, callback, "GET");
    createRequest(requestData);
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    const requestData = this.createRequestData(data, callback, "PUT");
    createRequest(requestData);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
    const requestData = this.createRequestData(data, callback, "DELETE");
    createRequest(requestData);
  }
}
