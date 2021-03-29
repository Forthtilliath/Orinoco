Vue.component('todo-item', {
    props: ['todo'],
    template:
        '<li :class="todo.classes"><a class="nav-link" :href="todo.link">{{ todo.text }}<span v-html="todo.current"></span></a></li>',
});

// On adapte le path en fonction de la page en cours
let pathIndex = idPage == 0 ? '#' : '../';
let pathViews = idPage == 0 ? 'views/' : '';

var vm = new Vue({
    el: '#vue_nav',
    data: {
        website: 'Orinoco',
        pathIndex: pathIndex,
        currentNav: ' <span class="sr-only">(current)</span>',
        navList: [
            { id: 0, text: 'Home', link: pathIndex + 'index.html', classes: 'nav-item', current: '' },
            { id: 1, text: 'Produits', link: pathViews + 'products.html', active: 'nav-item', current: '' },
            { id: 2, text: 'Panier', link: pathViews + 'basket.html', active: 'nav-item', current: '' },
            { id: 3, text: 'Vue', link: pathViews + 'view.html', active: 'nav-item', current: '' },
        ],
    },
});

// On met la page en cours en active
vm.navList[idPage].classes += ' active';
vm.navList[idPage].current = ' <span class="sr-only">(current)</span>';
vm.navList[idPage].link = '#';


