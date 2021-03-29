var app5 = new Vue({
    el: '#app-5',
    data: {
        message: 'Hello Vue.js!',
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('');
        },
    },
});
var app3 = new Vue({
    el: '#app-3',
    data: {
        seen: false,
    },
});
app3.seen = true;

var app4 = new Vue({
    el: '#app-4',
    data: {
        todos: [{ text: 'Learn JavaScript' }, { text: 'Learn Vue' }, { text: 'Build something awesome' }],
    },
});

Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>',
});

var app7 = new Vue({
    el: '#app-7',
    data: {
        groceryList: [
            { id: 0, text: 'Vegetables' },
            { id: 1, text: 'Cheese' },
            { id: 2, text: 'Whatever else humans are supposed to eat' },
        ],
    },
});

var vm = new Vue({
    el: '#app',
    data: {
        msg: 'Hello !!!!',
    },
});