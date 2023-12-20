(function () {

  let listArray = [],
    listName = '';


  //создаем и возвращаем загловок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела  возвращает обьект form, input, button
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    //проверяем поле инпут и если в нем пусто деактивируем кнопку
    input.addEventListener('input', function () {
      if (input.value !== "") {
        button.disabled = false
      } else {
        button.disabled = true
      }
    })

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов ul - return list
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }



  //создаем и возвращаем список дел ITEM
  function createTodoItem(obj) {
    let item = document.createElement('li');
    //кнопки помещаем в элемент
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в  его правой части с помощью flex

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    //при добавлении все записи проверяются на выполнено или нет если выполнено добавляем класс
    if (obj.done == true) item.classList.add('list-group-item-success');

    //добавляем обработчики на кнопки

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const listItem of listArray) {
        if (listItem.id == obj.id) listItem.done = !listItem.done
      }
      //сохраняем при любом изменении дела
      saveList(listArray, listName);
    });


    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        //удаление из самого массива
        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) listArray.splice(i, 1)
        }
        console.log(listArray);
        //сохраняем при любом изменении дела
        saveList(listArray, listName);
      }
    });

    //вкладываем кнопки в отдельный элемент, чтобы они обьединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия поэтому возвращаем обьект
    return {
      item,
      doneButton,
      deleteButton,
    };
  }


  //функция генерирует id
  function getNewID(arr) {
    let max = 0;
    for (let item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  //создаем функцию для сохранения массива в локал сторедж
  //локал сторедж может хранить строки и булевые значения или числа --- ВАЖНО
  function saveList(arr, keyName) {
    console.log(JSON.stringify(arr))  //преобразовывает обьект в строчку
    //передаем название переменной keyName,  даннные из нашего массива в виде строки
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    listArray = defArray;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //получаем данные из локал сторедж
    let localData = localStorage.getItem(listName);

    //проверяем есть ли данные в локалсторедж, если есть то распарсиваем строку
    //в локалсторедже в джсон и помещаем в наш массив listArray
    if (localData !== null && localData !== '') listArray = JSON.parse(localData)

    //выводим список дел из массива
    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима, чтобы предотвратить стандартное дейсвтие браузера
      //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      //создаем обьект элементов
      let newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false,
      }

      //передаем наш обьект
      let todoItem = createTodoItem(newItem);

      //добавляем новую запись (обьект newItem) в наш массив
      listArray.push(newItem);


      //сохраняем при любом изменении дела
      saveList(listArray, listName);

      //создаем и добавляем в список новое дело с название из поля для ввода
      todoList.append(todoItem.item);

      //деактивируем кнопку
      todoItemForm.button.disabled = true;

      //обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
    });


    todoItemForm.button.setAttribute("disabled", "");
    todoItemForm.input.addEventListener('input', function () {
      if (todoItemForm.input.value !== '') {
        todoItemForm.button.removeAttribute("disabled", "");
      }
      else {
        todoItemForm.button.setAttribute("disabled", "");
      };
    });

  };

  //зарегистрируем функцию в обьекте window
  window.createTodoApp = createTodoApp;
})();
