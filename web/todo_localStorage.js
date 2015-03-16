$(function() {
    var model = {
        init : function() {
            // get data from db.
            if (!localStorage.todos) {
                localStorage.todos = JSON.stringify([]);
            }
        },
        
        add : function(obj) {
            var data = JSON.parse(localStorage.todos);
            data.push(obj);
            // save data to db.

            localStorage.todos = JSON.stringify(data);
        },
        
        save : function(data) {
            // save data to db.
        },

        toggleComplete : function(id) {
            var data = JSON.parse(localStorage.todos);
            data.forEach(function(obj) {
                if (obj.id == id) {
                    obj.completed = !(obj.completed);
                }
            });
            localStorage.todos = JSON.stringify(data);
        },

        getAllTodos : function() {
            // fetch data from db.
            return JSON.parse(localStorage.todos);
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

        init : function() {
            model.init();
            view.init();
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
                if (e.which == 13) {
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
