/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(element == null) {
      throw TypeError("empty element");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.addEventListener("submit", event => {
      if(this.element.checkValidity) {
        this.submit();
        event.preventDefault();
      }
    });
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    // FormData от this.element не работает (всегда пустой)
    const data = {};
    const inputList = this.element.querySelectorAll("input");
    
    for(const input of inputList) {
      const key = input.getAttribute("name");
      const value = input.value;

      if(key != null && value != null) {
        data[key] = value;
      }
    }

    return data;
  }

  /**
   * Сбрасывает данные формы
   */
  reset() {
    this.element.reset();
  }

  onSubmit(options){

  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit() {
    this.onSubmit(this.getData());
  }
}