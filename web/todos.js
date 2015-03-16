$(function() {
    var dbStorage = {};
    var rootURL = 'http://localhost/todo/api/index.php/';
    var model = {
        newEntry : true,
        init : function() {
            dbStorage.todos = JSON.stringify([]);
            $.getJSON(rootURL + 'getItems', function(data) {
            }).success(function(data) {
                if (data && data.todo_items && data.todo_items.length) {
                    dbStorage.todos = data.todo_items;
                    model.newEntry = false;
                }
            }).complete(function() {
                controller.viewInit();
            });
        },

        add : function(obj) {
            var data = JSON.parse(dbStorage.todos);
            data.push(obj);
            dbStorage.todos = JSON.stringify(data);
            // save data to db.
            this.save(dbStorage);
        },

        save : function(data) {
            if (model.newEntry) {
                this.insertItems(data);
            } else {
                this.updateItems(data);
            }
        },

        insertItems : function(data) {
           // console.log(data);
            $.ajax({
                type : "POST",
                contentType : 'application/json',
                data : JSON.stringify(data),
                url : rootURL + 'insertItems',
                dataType : 'json',
                success : function(data) {
                    model.newEntry = false;
                },
                error : function(header, textStatus, errorThrown) {
                    console.log('insertItem error: ' + textStatus);
                }
            });

        },

        updateItems : function(data) {
            $.ajax({
                type : "PUT",
                contentType : 'application/json',
                data : JSON.stringify(data),
                url : rootURL + 'updateItems',
                dataType : 'json',
                success : function(data) {
                    model.newEntry = false;
                },
                error : function(header, textStatus, errorThrown) {
                    console.log('updateItem error: ' + textStatus);
                }
            });

        },

        toggleComplete : function(id) {
            var data = JSON.parse(dbStorage.todos);
            data.forEach(function(obj) {
                if (obj.id == id) {
                    obj.completed = !(obj.completed);
                }
            });
            dbStorage.todos = JSON.stringify(data);
            this.save(data);
        },

        getAllTodos : function() {
            // fetch data from db.
            return JSON.parse(dbStorage.todos);
        }
    };

    var controller = {
        addNewTodo : function(todoStr) {
            var currentTime = new Date().getTime();
            model.add({
                id : currentTime,
                title : todoStr,
                completed : false
            });
            view.render();
        },

        toggleComplete : function(id) {
            return model.toggleComplete(id);
        },

        getTodoList : function() {
            return model.getAllTodos();
        },

        viewInit : function() {
            view.init();
        },

        init : function() {
            model.init();
        }
    };

    var view = {
        init : function() {
            this.todoList = $('#todo-list');
            this.todoItemTemplate = $('script[data-template="todoItem"]').html();
            var newTodoForm = $('#new-todo');

            // Delegated event to listen for checkbox check events
            this.todoList.on('click', ':checkbox', function(e) {
                var todoItem = $(this).parents('li');
                var id = todoItem.attr('todo-id');
                // not persisting across page reload.
                if (this.checked) {
                    todoItem.addClass('completed');
                } else {
                    todoItem.removeClass('completed');
                }
                controller.toggleComplete(id);
                return true;

            });

            newTodoForm.keypress(function(e) {
                if ((e.which == 13) && (newTodoForm.val() !== "")) {
                    controller.addNewTodo(newTodoForm.val());
                    newTodoForm.val('');
                    e.preventDefault();
                }
            });
            view.render();
        },
        render : function() {
            var todoList = this.todoList;
            todoList.html('');
            todoItemTemplate = this.todoItemTemplate;
            controller.getTodoList().forEach(function(obj) {
                var checked = (obj.completed) ? 'checked' : '';
                var classes = (obj.completed) ? 'view completed' : 'view';
                var todoItem = todoItemTemplate.replace(/{{title}}/g, obj.title);

                todoItem = todoItem.replace(/{{id}}/g, obj.id);
                todoItem = todoItem.replace(/{{checked}}/g, checked);
                todoItem = todoItem.replace(/{{classes}}/g, classes);

                todoList.append(todoItem);
            });
        }
    };

    controller.init();
});
