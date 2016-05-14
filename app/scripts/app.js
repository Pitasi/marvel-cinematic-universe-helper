'use strict'

var app = angular.module('marvel_cinematic', ['ngRoute', 'ngResource'])

app.constant('$globals', {
  api_key: '032c03fbcaf94c05b55ddf4ec973ad16',
  endpoint: 'https://api.themoviedb.org/3/',
  strings: {
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
      'it': 'Questo sito web mostra alcune informazioni utile per guidarti all\'interno del gigantesco universo creato dai Marvel Studio'
    }
  },
  languages: ['en', 'it']
})

// Basic url routing
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })
    .when('/:ln/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })
    .when('/movies.json', {
      templateUrl: ' '

    })
    .when('/movie/:id', {
      templateUrl: 'views/movie_details.html',
      controller: 'MovieController'
    })
    .when('/movie/:id/:ln', {
      templateUrl: 'views/movie_details.html',
      controller: 'MovieController'
    })
    .otherwise({
      redirectTo: '/'
    })
})

// This controls home.html
app.controller('MainController', function ($scope, $globals, $routeParams, $location, $http) {
  $scope.movies_list = []
  var languages = $globals.languages
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')
  $scope.ln = ln
  $scope.main_title = $globals.strings.main_title[ln]
  $scope.read_more = $globals.strings.read_more[ln]
  $scope.footer_text = $globals.strings.footer_text[ln]

  $http.get('/res/movies_' + ln + '.json').success(function (data){
    var movies = data
    angular.forEach(movies, function (obj, key) {
      console.log('Loading movie: ' + key)
      obj['backdrop_path'] = 'https://image.tmdb.org/t/p/w600/' + obj['backdrop_path']
      $scope.movies_list.push(obj)
    })
  });
})

app.controller('MovieController', function ($scope, $globals, $routeParams, $location, $http) {
  var languages = $globals.languages
  var id = $routeParams.id
  var ln = $routeParams.ln
  if (ln === undefined) ln = 'en'
  if (languages.indexOf(ln) === -1) $location.path('/404')
  $scope.ln = ln
  $scope.footer_text = $globals.strings.footer_text[ln]
  $scope.imdb_text = $globals.strings.imdb_text[ln]

  $http.get('/res/movies_' + ln + '.json').success(function (data){
    var movies = data
    $scope.genres_list = []
    if (movies[id] !== undefined) {
      var obj = movies[id]
      angular.forEach(obj.genres, function(k){
        $scope.genres_list.push(k.name)
      })
      $scope.title = obj.title
      $scope.poster = 'https://image.tmdb.org/t/p/w600/' + obj.poster_path
      $scope.poster_large = 'https://image.tmdb.org/t/p/w1000/' + obj.poster_path
      $scope.tagline = obj.tagline
      $scope.plot = obj.overview
      $scope.imdb_link = 'http://www.imdb.com/title/' + obj.imdb_id
    }
    else $location.path('/404')

  });
})
