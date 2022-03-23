/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */

  static _URL = "/account";

  static get(id = '', callback){
    createRequest({
      callback, 
      url: `${this.URL}/${id}`,
      method: "GET"
    });
  }
}
