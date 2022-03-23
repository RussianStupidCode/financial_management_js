/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if(response && response.success) {
        
        App.setState('user-logged');
        App.getModal("register").close();
        this.reset();

      } else {
        console.log(err);
      }
    };

    User.register(data, callback);
  }
}