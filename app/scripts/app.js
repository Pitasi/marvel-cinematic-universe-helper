'use strict'

var app = angular.module('marvel_cinematic', ['ngRoute', 'ngResource', 'ngCookies', 'angular-google-analytics'])

app.config(function (AnalyticsProvider) {
  AnalyticsProvider.setAccount('UA-45070618-4');
});

app.constant('$globals', {
  api_key: '032c03fbcaf94c05b55ddf4ec973ad16',
  endpoint: 'https://api.themoviedb.org/3/',
  cookie_name: 'cookie_agreement',
  available_lists: ['main', 'xmen'],
  available_languages: ['en', 'it'],
  strings: {
    'home_title': {
      'en': 'Homepage',
      'it': 'Homepage'
    },
    'home_subtitle': {
      'en': 'Heavily under construction',
      'it': 'Ancora in stato embrionale'
    },
    'main_list': {
      'en': 'Main movies list',
      'it': 'Lista film principali'
    },
    'xmen_list': {
      'en': 'X-Men movies list',
      'it': 'Lista film X-Men'
    },
    'main_title': {
      'en': 'Suggested order',
      'it': 'Ordine consigliato'
    },
    'read_more': {
      'en': 'See more',
      'it': 'Leggi di più'
    },
    'mark': {
      'en': 'Mark as ',
      'it': 'Segna come '
    },
    'marked': {
      'en': 'Marked as ',
      'it': 'Segnato come '
    },
    'viewed': {
      'en': 'watched',
      'it': 'visto'
    },
    'unviewed': {
      'en': 'unwatched',
      'it': 'non visto'
    },
    'imdb_text': {
      'en': 'View it on IMdB',
      'it': 'Aprilo in IMdB'
    },
    'footer_text': {
      'en': 'This website shows some useful informations to guide you through the huuuge list of movies made by Marvel Studios.',
      'it': "Questo sito web mostra alcune informazioni utile per guidarti all'interno del gigantesco universo creato dai Marvel Studio."
    }
  }
})

// Basic url routing
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/en'
    })
    .when('/404', {
      templateUrl: 'views/404.html'
    })
    .when('/about', {
      templateUrl: 'views/about.html'
    })
    .when('/:ln/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/list/:list', {
      redirectTo: '/list/:list/en'
    })
    .when('/list/:list/:ln', {
      templateUrl: 'views/movie_list.html',
      controller: 'MainController'
    })
    .when('/movie/:list/:id', {
      redirectTo: '/movie/:list/:id/en'
    })
    .when('/movie/:list/:id/:ln', {
      templateUrl: 'views/movie_details.html',
      controller: 'MovieController'
    })
    .otherwise({
      redirectTo: '/404'
    })
})

// This controls home.html
app.controller('HomeController', function ($scope, $globals, $routeParams, $location) {
  var languages = $globals.available_languages
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')

  $scope.ln = ln
  $scope.home_title = $globals.strings.home_title[ln]
  $scope.home_subtitle = $globals.strings.home_subtitle[ln]
  $scope.main_list = $globals.strings.main_list[ln]
  $scope.xmen_list = $globals.strings.xmen_list[ln]
  $scope.footer_text = $globals.strings.footer_text[ln]

  $scope.english_path = '#' + $location.path().replace('/' + ln, '/en')
  $scope.italian_path = '#' + $location.path().replace('/' + ln, '/it')
})
// This controls movie_list.html
app.controller('MainController', function ($scope, $globals, $routeParams, $location, $http, $cookies) {
  $scope.movies_list = []

  var list = $routeParams.list
  if ($globals.available_lists.indexOf(list) === -1) $location.path('/404')
  $scope.list = list
  var languages = $globals.available_languages
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')

  $scope.go = function (p) { $location.path(p) }
  $scope.mark_movie = function (p, v) {
    $cookies.put(p.id, v)
    p.viewed = v
    Materialize.toast($globals.strings.marked[ln] + (v ? $globals.strings.viewed[ln] : $globals.strings.unviewed[ln]) + '!', 2000)
  }

  $scope.ln = ln
  $scope.main_title = $globals.strings.main_title[ln]
  $scope.read_more = $globals.strings.read_more[ln]
  $scope.footer_text = $globals.strings.footer_text[ln]
  $scope.main_list = $globals.strings.main_list[ln]
  $scope.xmen_list = $globals.strings.xmen_list[ln]
  $scope.mark = $globals.strings.mark[ln]
  $scope.viewed = $globals.strings.viewed[ln]
  $scope.unviewed = $globals.strings.unviewed[ln]
  $scope.english_path = '#' + $location.path().replace('/' + ln, '/en')
  $scope.italian_path = '#' + $location.path().replace('/' + ln, '/it')

  $http.get('/res/' + list + '_' + ln + '.json').success(function (data) {
    var movies = data
    var v
    angular.forEach(movies, function (obj, key) {
      v = $cookies.get(key)
      obj['viewed'] = v === 'true'
      obj['backdrop_path'] = 'https://image.tmdb.org/t/p/w600/' + obj['backdrop_path']
      $scope.movies_list.push(obj)
    })
  })
})

app.controller('MovieController', function ($scope, $globals, $routeParams, $location, $http, $cookies) {
  var languages = $globals.available_languages
  var list = $routeParams.list
  var id = $routeParams.id
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')
  $scope.ln = ln
  $scope.footer_text = $globals.strings.footer_text[ln]
  $scope.imdb_text = $globals.strings.imdb_text[ln]
  $scope.main_list = $globals.strings.main_list[ln]
  $scope.xmen_list = $globals.strings.xmen_list[ln]
  $scope.is_viewed = $cookies.get(id) === 'true'
  $scope.english_path = '#' + $location.path().replace('/' + ln, '/en')
  $scope.italian_path = '#' + $location.path().replace('/' + ln, '/it')

  $scope.mark_movie = function (p, v) {
    $cookies.put(p, v)
    $scope.is_viewed = v
    Materialize.toast($globals.strings.marked[ln] + (v ? $globals.strings.viewed[ln] : $globals.strings.unviewed[ln]) + '!', 2000)
  }

  $http.get('/res/' + list + '_' + ln + '.json').success(function (data) {
    var movies = data
    $scope.genres_list = []
    if (movies[id] !== undefined) {
      var obj = movies[id]
      angular.forEach(obj.genres, function (k) {
        $scope.genres_list.push(k.name)
      })
      if (obj.next !== undefined) $scope.next = '#/movie/' + list + '/' + obj.next + '/' + ln
      if (obj.previous !== undefined) $scope.previous = '#/movie/' + list + '/' + obj.previous + '/' + ln
      $scope.id = obj.id
      $scope.order = obj.order
      $scope.title = obj.title
      $scope.poster = 'https://image.tmdb.org/t/p/w600/' + obj.poster_path
      $scope.poster_large = 'https://image.tmdb.org/t/p/w1000/' + obj.poster_path
      $scope.tagline = obj.tagline
      $scope.plot = obj.overview
      $scope.imdb_link = 'http://www.imdb.com/title/' + obj.imdb_id
    }
    else $location.path('/404')
  })
})

app.controller('CookieController', function($scope, $cookies, $globals){
  var cookie = $globals.cookie_name
  var accepted = $cookies.get('cookie_agreement') === 'true'
  $scope.accepted = accepted
  var save_cookie = function() {
    $cookies.put(cookie, true)
    accepted = true
    $scope.accepted = true
  }
  var opt = {
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      complete: save_cookie // Callback for Modal close
    }
  if (!accepted) $('#modal1').openModal(opt);

})
