function request(url, method, body, headers) {
  return fetch(url, {
    method: method,
    body: body,
    headers: headers
  }).then(response => {
    if (!response.ok) {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
        method,
        url: response.url
      });
    }

    return response.json().catch(() => { });
  });
}

const app = new Vue({
  el: '#app',
  data: {
    newTodoText: '',
    todos: [
      // {
      //   id: 1,
      //   text: 'Donald Duck'
      // }
    ],
    error: null
  },
  methods: {
    addNewTodo: function () {
      if (!this.newTodoText) { return; }

      this.error = null;
      request('/api/todos', 'POST', JSON.stringify({ text: this.newTodoText }))
        .then(todo => this.todos.push(todo))
        .catch(error => this.error = error);

      this.newTodoText = '';
    },
    deleteTodo: function (todo, event) {
      if (event) event.preventDefault()

      this.error = null;
      request('/api/todos/' + todo.id, 'DELETE')
        .then(() => {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
        })
        .catch(error => {
          this.error = error;
        });
    },
    dragover: function () {
      this.error = "Dragover!"
    },
    upload: function (event) {
      if (event) event.preventDefault()
      this.error = event.dataTransfer.files[0]
      this.error = null
      let formData = new FormData()
      formData.append('file', event.dataTransfer.files[0])
      let headers = new Headers()
      // headers.append('Content-Type', 'multipart/form-data')
      // headers.append('Content-Disposition', 'form-data; "name=file"; filename="myfile.txt"')
      request('/api/upload', 'POST', formData, headers)
        .then(() => {
          console.log("File uploaded")
        })
        .catch(error => {
          this.error = error
        })
    }
  }
});

app.error = null;
request('/api/todos', 'GET')
  .then(todos => app.todos = todos)
  .catch(error => app.error = error);