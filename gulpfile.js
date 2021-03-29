'use strict';

/**
 *[=] Commandes importantes à exécuter pour démarrer un nouveau projet    *
 *[=] npm install gulp -g                                                 *
 *[=] npm init                                                            *
 *[=] npm install --save-dev gulp chalk gulp-imagemin                     *
 *
 *! Liste des ERREURS possibles                         *
 *! TypeError: lesPlugins.get(...) is not a function    *
 *! |-> Erreur dans le nom du plugin appelé             *
 *
 * TODO Ajouts à faire
 * [ ] Vérifier les tableaux si modifier par un set ne serait pas mieux
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set
 * [ ] Mettre en place task, src, dest
 */

// Requis
const gulp = require('gulp');
////import { task, src, dest as _dest, series, watch } from 'gulp'; // NOTE _dest parce on utilie dest plus loin
////const { task, src, dest } = require('gulp');
// Commande pour installer
const cmdInstall = 'npm install --save-dev';

/***************************************************
 ** Objet Plugin                                   *
 **************************************************/

// Création d'un object Plugin
/**
 *
 * @param {string} name Nom du plugin
 * @param {boolean} installed True si installé, False sinon
 * @param {*} plugin Liste des fonctions du plugin
 */
const Plugin = function (name, installed, plugin) {
    this.name = name;
    this.installed = installed;
    this.plugin = plugin;
};

/**
 * Récupère le nom du plugin
 * @returns {string} Nom du plugin
 */
Plugin.prototype.getName = function () {
    return this.name;
};

/**
 * Permet de savoir si le plugin est installé
 * @returns {boolean} Vrai si le plugin est installé
 */
Plugin.prototype.isInstalled = function () {
    return this.installed;
};

/**
 * Récupère le plugin en lui-même pour utiliser ses méthodes
 * @returns {File} Fichier du plugin
 */
Plugin.prototype.get = function () {
    return this.plugin;
};

/****************************************************
 ** Objet ListPlugins                               *
 ***************************************************/

// Création d'un object ListPlugins
const ListPlugins = function () {
    this.lesPluginsNames = Array.from(arguments);
    this.lesPlugins = [];
    this.launch();
};

/**
 * On lance tous les require et on les ajoute dans un tableau
 * De plus, on enlève tous les 'gulp-' des noms pour les appels futurs
 */
ListPlugins.prototype.launch = function () {
    // On récupère la liste des plugins
    let lesPlugins = this.lesPlugins;
    // Permet de changer la couleur du texte dans la console
    let color = this.get('chalk');
    // On crée un tableau afin d'afficher tous les plugins manquant en une seule commande
    let tabPluginsToInstall = [];
    // Pour chaque plugins
    this.lesPluginsNames.forEach(function (unPlugin) {
        try {
            // On fait le require et on l'ajoute dans le tableau
            lesPlugins.push(new Plugin(unPlugin.replace(/gulp-/i, ''), true, require(unPlugin)));
        } catch (e) {
            // Si une erreur survient
            // On détecte si le module est installé ou non
            if (e.code === 'MODULE_NOT_FOUND') {
                // On affiche un message d'erreur avec une commande pour ajouter le module manquant
                console.log(color.red(`Le module '${color.blue(unPlugin)}' n'est pas installé !`));
                // On l'ajoute au tableau
                tabPluginsToInstall.push(unPlugin);
            } else {
                // Si une autre erreur survient, on stop complètement le script
                throw `Erreur ${e.code} avec le module ${unPlugin} !`;
            }
            // On ajoute tout de même le module dans le tableau en précisant bien que le module n'est pas installé
            // Ca permettra que le script fonctionne tant qu'on n'appelle pas de tache nécessitant celui ci
            lesPlugins.push(new Plugin(unPlugin.replace(/gulp-/i, ''), false, null));
        }
    });
    if (tabPluginsToInstall.length > 0) {
        // On affiche la commande pour installer tous les plugins manquant
        console.log(color.red(`|-- `) + color.green(`${cmdInstall} ${tabPluginsToInstall.join(' ')}`));
    }
};

/**
 * Recherche un plugin et indique s'il est installé ou non
 * @param   {string} unPluginName Nom du plugin à trouver
 * @returns {boolean} Vrai si le plugin est installé, Faux le cas échéant
 */
ListPlugins.prototype.find = function (unPluginName) {
    for (let i = 0; i < this.lesPlugins.length; i++) {
        if (this.lesPlugins[i].getName() == unPluginName) {
            return this.lesPlugins[i].isInstalled();
        }
    }
    return false;
};

/**
 * Récupère le module demandé
 * @param   {string} unPluginName Nom du plugin
 * @returns {Plugin} Plugin demandé
 */
ListPlugins.prototype.get = function (unPluginName) {
    for (let i = 0; i < this.lesPlugins.length; i++) {
        if (this.lesPlugins[i].getName() == unPluginName) {
            return this.lesPlugins[i].get();
        }
    }
    return null;
};

/****************************************************
 ** Liste des variables pour configurer les chemins *
 ****************************************************/

// Dossier root
const dir = {
    dev: 'dev/',
    dist: 'dist/',

    assets: 'assets/',
    app: 'app/',
};

// Chemin d'origine
const source = {
    app_images: dir.app + 'images/**/',
    app_icons: dir.app + 'icons/',
    svg: dir.assets + 'images/svg/**/',
    images: dir.assets + 'images/**/',
    sass: dir.assets + 'styles/**/',
    css: dir.assets + 'styles/**/',
    js: dir.assets + 'scripts/**/',
    useref: 'views/',
    sounds: dir.assets + 'sounds/**/',
    fonts: dir.assets + 'fonts/',
    racine: '',
};

// Chemin de destination
const dest = {
    app_images: dir.app + 'images/',
    app_icons: dir.app + 'icons/',
    svg: dir.assets + 'images/sprites/',
    images: dir.assets + 'images/',
    sass: dir.assets + 'styles/',
    css: dir.assets + 'styles/',
    js: dir.assets + 'scripts/',
    useref: '',
    sounds: dir.assets + 'sounds/',
    fonts: dir.assets + 'fonts/',
};

// Fichiers d'origine
// prettier-ignore
const filesIn = {
    useref      : '*.html',
    index       : 'index.html',
    js          : '*.js',
    css         : '*.css',
    html         : '*.html',
    images      : '*.+(png|jpg|gif|jpeg)',
    other_images: '*.+(svg)',
    favicon     : 'favicon.png',
    svg         : '*.svg',
    icons       : '*.png',
    sass        : '*.sass',
    sounds      : '*.+(mp3|flac)',
    fonts       : '*',
    racine      : '+(*.+(html|htaccess)|robots.txt|sitemap.xml|manifest.json|create_zip.bat)',
};

// Fichiers de sortie
const fileOut = {
    svgExt: '.svg', // Extension pour les sprites svg
    minExt: '', // Ajout d'extension pour les fichiers minimisés
};

// Groupe des taches
const groupTasks = {
    // Tâche app : Utile pour ajouter l'application sur le store
    app: ['app:images'],
    // Tâche build : Utile pour exécuter l'application lors des tests
    build: ['svg'],
    useref: ['min:useref', 'min:useref2'],
    min: ['min:images', 'min:js', 'min:css', 'useref'],
    copy: ['copy:racine'],
    // Tâche dist : Compresse et copie l'ensemble des fichiers pour la distribution
    dist: ['clean', 'app', 'build', 'copy', 'min', 'archive'],
    // Tâche par défaut
    default: ['dist'],
};

let tabWatch = ['sass', 'min:images']; // Tache à écouter // TODO Array( files, tasks to call )
/* TODO Développer cette version
//let tabWatch = [
//    [dir.dev + source.images + filesIn.images,'min:images'],
//    [dir.dev + source.svg + filesIn.svg,'svg']
//];
*/

// Compression des fichiers js
let tabJs = [dir.dev + source.js + filesIn.js]; // Fichiers js à compresser, par défaut on les prend tous
let jsInIndex = []; // Afin de ne pas le prendre en compte dans les fichiers js de l'index car compressés via useref
// Compression des fichiers css
let tabCss = [dir.dev + source.css + filesIn.css]; // Fichiers css à compresser, par défaut on les prend tous
let cssInIndex = []; // Afin de ne pas le prendre en compte dans les fichiers css de l'index car compressés via useref

// On crée l'objet pour gérer les plugins
let lesPlugins = new ListPlugins(
    'chalk',
    'gulp-load-plugins',
    'gulp-plumber',
    'gulp-imagemin',
    'gulp-cache',
    'gulp-svg-sprite',
    'del',
    'child_process',
    'gulp-rename',
    'gulp-minify-css',
    'gulp-if',
    'gulp-terser',
    'gulp-svgmin',
    'gulp-cheerio',
    'gulp-replace',
    'imagemin-jpegtran',
    'merge-stream',
    'path',
    'gulp-useref',
    'glob',
);

// Préfixer pour le CSS
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
];

// Permet de changer la couleur du texte dans la console
const color = lesPlugins.get('chalk');

/****************************************************
 ** Liste des fonctions                             *
 ***************************************************/

/**
 * Permet de créer une tache vide lorsque les plugins requis ne sont pas installés
 */
const createEmptyTask = (taskName) => {
    gulp.task(taskName, (done) => {
        console.log(
            color.red(
                'Certains plugins de la tache ' +
                    color.yellow(taskName) +
                    " n'ont pas été trouvé, donc n'a pas été exécutée.",
            ),
        );
        return done();
    });
};

/**
 * Vérifie si tous les plugins requis sont bien installés
 * @returns {boolean} allGood
 */
const checkPluginsRequired = function () {
    let allGood = true; // Si tous les plugins sont installés, sa valeur restera à vrai
    Array.from(arguments).forEach(function (unPlugin) {
        ////console.log("Vérification pour : " + unPlugin);
        ////console.log(lesPlugins.find(unPlugin.replace(/gulp-/i, '')));
        // Si le plugin n'est pas trouvé ou installé
        if (!lesPlugins.find(unPlugin.replace(/gulp-/i, ''))) {
            //console.log(`Le plugin ${unPlugin} est nécessaire pour cette tâche !`);
            allGood = false;
        }
    });
    return allGood;
};

// Prototype Array.last()
/*if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};*/

// Configuration pour la compression des images
const configCompImg = [
    lesPlugins.get('imagemin').gifsicle({
        interlaced: true,
    }),
    lesPlugins.get('imagemin').mozjpeg({
        quality: 75,
        progressive: true,
    }),
    lesPlugins.get('imagemin-jpegtran')({
        progressive: true,
    }),
    lesPlugins.get('imagemin').optipng({
        optimizationLevel: 7, //7 for max
    }),
    lesPlugins.get('imagemin').svgo({
        plugins: [
            {
                removeViewBox: true,
            },
            {
                cleanupIDs: false,
            },
        ],
    }),
]; // Version réduite // Efface le cache des images
/****************************************************
 ** Taches liées à linstallation des plugins        *
 ***************************************************/
/*const configCompImg = {
    interlaced: true,
    quality: 75,
    optimizationLevel: 7,
    progressive: true,
    svgoPlugins: [{
        removeViewBox: false
    }]
};*/ if (
    checkPluginsRequired('gulp-cache')
) {
    gulp.task('clear-cache', function (done) {
        lesPlugins.get('cache').clearAll();
        done();
    });
} else {
    createEmptyTask('clear-cache');
}

/****************************************************
 ** Taches liées à l'application en elle-même       *
 ** |-- Compression des images pour la promotion    *
 ** |-- Compression des icones pour la promotion    *
 ***************************************************/

// Compresse les images
if (checkPluginsRequired('gulp-plumber', 'gulp-cache', 'gulp-imagemin')) {
    gulp.task('app:images', function () {
        return (
            gulp
                .src([dir.dev + source.app_images + filesIn.images, dir.dev + source.app_icons + filesIn.icons])
                .pipe(lesPlugins.get('plumber')())
                .pipe(
                    lesPlugins.get('cache')(
                        lesPlugins.get('imagemin')(configCompImg, {
                            verbose: true,
                        }),
                    ),
                )
                /*.pipe(lesPlugins.get('imagemin')(configCompImg, {
                verbose: true
            }))*/
                .pipe(
                    gulp.dest(
                        // On retire les / du chemin de départ et d'arrivée
                        // Pour ensuite envoyer chaque fichier dans les dossiers correspondant
                        (file) => file.base.replace(dir.dev.replace('/', ''), dir.dist.replace('/', '')),
                    ),
                )
        );
    });
} else {
    createEmptyTask('app:images');
}

/****************************************************
 ** Taches liées à l'execution de l'application     *
 ** |-- Compilation des svg en sprites              *
 ** |-- Compilation des sass en css                 *
 ***************************************************/

// Unify les fichiers svg pour en faire un sprite
if (
    checkPluginsRequired(
        'gulp-plumber',
        'gulp-svgmin',
        'gulp-cheerio',
        'gulp-svg-sprite',
        'gulp-replace',
        'merge-stream',
        'path',
        'glob',
    )
) {
    gulp.task('svg', async function (done) {
        // On utilise merge afin de nommer le svg par le nom du dossier
        // 1 dossier donnera donc 1 svg
        // Ca permet d'avoir par exemple 1 dossier pour les boutons, 1 pour les réseaux sociaux, etc
        return lesPlugins.get('merge-stream')(
            lesPlugins
                .get('glob')
                .sync(dir.dev + source.svg)
                .map(function (svgDir) {
                    var svgName = lesPlugins.get('path').basename(svgDir); // On récupère le nom du dossier
                    return gulp
                        .src(svgDir + filesIn.svg) // Récupère les fichiers
                        .pipe(lesPlugins.get('plumber')()) // Controles les erreurs
                        .pipe(
                            lesPlugins.get('svgmin')({
                                js2svg: {
                                    pretty: true,
                                },
                            }),
                        )
                        .pipe(
                            lesPlugins.get('cheerio')({
                                // Supprime les attributs non utilisés pour la suite
                                run: function ($) {
                                    //$('[fill]').removeAttr('fill');
                                    $('[stroke]').removeAttr('stroke');
                                    $('[style]').removeAttr('style');
                                    $('[xmlns]').removeAttr('xmlns'); // Pas utile car obligatoirement ajouté via le code
                                    $('[class]').removeAttr('class');
                                },
                                parserOptions: {
                                    xmlMode: true,
                                },
                            }),
                        )
                        .pipe(lesPlugins.get('replace')('&gt;', '>')) // cheerio plugin create unnecessary string '&gt;', so replace it.
                        .pipe(
                            lesPlugins.get('svg-sprite')({
                                // Crée le sprite
                                mode: {
                                    symbol: {
                                        dest: '.', // Ne pas toucher
                                        sprite: svgName + fileOut.svgExt, // Le fichier porte le nom du dossier
                                    },
                                },
                            }),
                        )
                        .pipe(gulp.dest(dir.dev + dest.svg)) // Envoi le résultat sur dev
                        .pipe(gulp.dest(dir.dist + dest.svg)); // Envoi le résultat sur dist
                }),
        );
    });
} else {
    createEmptyTask('svg');
}

// TODO Faire ca pour toutes les taches
// Voir pour mettre directement dans la fonction
if (checkPluginsRequired('gulp-sass')) {
    gulp.task('sass', function () {
        return gulp
            .src(dir.dev + source.sass + filesIn.sass) // Gets all files ending with .scss in app/scss and children directories
            .pipe(lesPlugins.get('sass')())
            .pipe(gulp.dest(dir.dev + dest.sass));
    });
} else {
    createEmptyTask('sass');
}

/****************************************************
 ** Taches liées à la distribution de l'application *
 ** |-- Supprime le dossier dist                    *
 ** |-- Compression des images                      *
 ** |-- Compression des js/css                      *
 ** |-- Minimisation des js/css                     *
 ** |-- Copie des fonts                             *
 ** |-- Copie des fichiers à la racine              *
 ***************************************************/

// Supprime le dossier dist
if (checkPluginsRequired('del')) {
    gulp.task('clean', function () {
        return lesPlugins.get('del')('dist');
    });
} else {
    createEmptyTask('clean');
}

// Compresse les images
// TODO fix avec svg
if (checkPluginsRequired('plumber', 'imagemin')) {
    gulp.task('min:images', function () {
        ////return gulp.src([dir.dev + source.images + filesIn.images, '!' + dir.dev + source.svg + filesIn.svg])
        return gulp
            .src(dir.dev + source.images + filesIn.images)
            .pipe(lesPlugins.get('plumber')())
            .pipe(
                lesPlugins.get('imagemin')({
                    interlaced: true,
                }),
            )
            .pipe(gulp.dest(dir.dist + dest.images));
    });
} else {
    createEmptyTask('min:images');
}

// Compression + Minimisation des js/css du fichier html
if (checkPluginsRequired('useref', 'if', 'terser', 'minify-css')) {
    gulp.task('min:useref', () => {
        return (
            gulp
                ////.src([dir.dev + filesIn.useref, dir.dev + source.useref + filesIn.useref])
                .src(dir.dev + filesIn.useref)
                .pipe(lesPlugins.get('useref')())
                .pipe(lesPlugins.get('if')(filesIn.js, lesPlugins.get('terser')())) // pour minifier les fichiers Javascript
                .pipe(lesPlugins.get('if')(filesIn.css, lesPlugins.get('minify-css')())) // pour minifier les fichiers CSS
                .pipe(gulp.dest(dir.dist))
        );
    });
} else {
    createEmptyTask('min:useref');
}
if (checkPluginsRequired('useref', 'if', 'terser', 'minify-css')) {
    gulp.task('min:useref2', () => {
        return (
            gulp
                ////.src([dir.dev + filesIn.useref, dir.dev + source.useref + filesIn.useref])
                .src(dir.dev + source.useref + filesIn.useref)
                .pipe(lesPlugins.get('useref')())
                .pipe(lesPlugins.get('if')(filesIn.js, lesPlugins.get('terser')())) // pour minifier les fichiers Javascript
                .pipe(lesPlugins.get('if')(filesIn.css, lesPlugins.get('minify-css')())) // pour minifier les fichiers CSS
                .pipe(lesPlugins.get('if')(filesIn.html, gulp.dest(dir.dist + source.useref)))
        );
    });
} else {
    createEmptyTask('min:useref2');
}

// Compression + Minimisation des js du dossier scripts
if (checkPluginsRequired('rename', 'terser')) {
    gulp.task('min:js', function () {
        jsInIndex.forEach(function (js) {
            tabJs.push('!' + dir.dev + source.js + js);
        });
        return (
            gulp
                .src(tabJs)
                ////.pipe(lesPlugins.get('terser')()) // pour minifier les fichiers Javascript
                .pipe(
                    lesPlugins.get('rename')({
                        extname: fileOut.minExt + '.js',
                    }),
                )
                .pipe(gulp.dest(dir.dist + dest.js))
        );
    });
} else {
    createEmptyTask('min:js');
}

// Compression + Minimisation des css du dossier styles
if (checkPluginsRequired('rename')) {
    gulp.task('min:css', function () {
        cssInIndex.forEach(function (css) {
            tabCss.push('!' + dir.dev + source.css + css);
        });
        return (
            gulp
                .src(tabCss)
                ////.pipe(lesPlugins.get('minify-css')()) // pour minifier les fichiers Javascript
                .pipe(
                    lesPlugins.get('rename')({
                        extname: fileOut.minExt + '.css',
                    }),
                )
                .pipe(gulp.dest(dir.dist + dest.css))
        );
    });
} else {
    createEmptyTask('min:css');
}

// Copie des fonts
gulp.task('copy:fonts', function () {
    return gulp.src(dir.dev + source.fonts + filesIn.fonts).pipe(gulp.dest(dir.dist + dest.fonts));
});

// Copie des sons
gulp.task('copy:sounds', function () {
    return gulp.src(dir.dev + source.sounds + filesIn.sounds).pipe(gulp.dest(dir.dist + dest.sounds));
});

// Copie des fichiers à la racine de l'application
gulp.task('copy:racine', function () {
    return gulp.src(dir.dev + source.racine + filesIn.racine).pipe(gulp.dest(dir.dist));
});

// Permet d'executer create_zip à partir du dossier dist
// (ca permet d'avoir uniquement le contenu du dossier dist dans le zip)
if (checkPluginsRequired('child_process')) {
    gulp.task('archive', function (done) {
        lesPlugins.get('child_process').execSync('call_create_zip.bat');
        done();
    });
} else {
    createEmptyTask('archive');
}

/****************************************************
 ** Creation des groupes de taches                  *
 ** Creation des watchers                           *
 ***************************************************/

// Création des groupes de taches
for (let key in groupTasks) {
    gulp.task(key, gulp.series(...groupTasks[key]));
}

// Tâche "watch"
gulp.task('watch', function () {
    // Lance un watch pour chaque tache dans le tableau
    tabWatch.forEach(function (uneTache) {
        console.log('Démarrage du watch de ' + uneTache + '...');
        gulp.watch(dir.dev + source[uneTache] + filesIn[uneTache], gulp.series(uneTache));
    });
});
