'use strict'

var app = angular.module('marvel_cinematic', ['ngRoute', 'ngResource'])

app.constant('$globals', {
  api_key: '032c03fbcaf94c05b55ddf4ec973ad16',
  endpoint: 'https://api.themoviedb.org/3/',
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
      'it': 'Lista dei film principali'
    },
    'xmen_list': {
      'en': 'X-Men movies list',
      'it': 'Lista dei film sugli X-Men'
    },
    'main_title': {
      'en': 'Suggested order',
      'it': 'Ordine consigliato'
    },
    'read_more': {
      'en': 'See more',
      'it': 'Leggi di più'
    },
    'imdb_text': {
      'en': 'View it on IMdB',
      'it': 'Aprilo in IMdB'
    },
    'footer_text': {
      'en': 'This website shows some useful informations to guide you through the huuuge list of movies made by Marvel Studios.',
      'it': "Questo sito web mostra alcune informazioni utile per guidarti all'interno del gigantesco universo creato dai Marvel Studio."
    }
  },
  languages: ['en', 'it']
})

// Basic url routing
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/en'
    })
    .when('/404', {
      // redirectTo: '/'
      templateUrl: 'views/404.html'
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
  var languages = $globals.languages
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
app.controller('MainController', function ($scope, $globals, $routeParams, $location, $http) {
  $scope.go = function (p) { $location.path(p) }

  $scope.movies_list = []
  var list = $routeParams.list
  $scope.list = list
  console.log(list)
  var languages = $globals.languages
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')
  $scope.ln = ln
  $scope.main_title = $globals.strings.main_title[ln]
  $scope.read_more = $globals.strings.read_more[ln]
  $scope.footer_text = $globals.strings.footer_text[ln]
  $scope.english_path = '#' + $location.path().replace('/' + ln, '/en')
  $scope.italian_path = '#' + $location.path().replace('/' + ln, '/it')

  $http.get('/res/' + list + '_' + ln + '.json').success(function (data) {
    var movies = data
    angular.forEach(movies, function (obj, key) {
      console.log('Loading movie: ' + key)
      obj['backdrop_path'] = 'https://image.tmdb.org/t/p/w600/' + obj['backdrop_path']
      $scope.movies_list.push(obj)
    })
  })
})

app.controller('MovieController', function ($scope, $globals, $routeParams, $location, $http) {
  var languages = $globals.languages
  var list = $routeParams.list
  var id = $routeParams.id
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')
  $scope.ln = ln
  $scope.footer_text = $globals.strings.footer_text[ln]
  $scope.imdb_text = $globals.strings.imdb_text[ln]
  $scope.english_path = '#' + $location.path().replace('/' + ln, '/en')
  $scope.italian_path = '#' + $location.path().replace('/' + ln, '/it')

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
