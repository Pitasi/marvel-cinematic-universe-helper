#!/usr/bin/env python3

import json
import requests

api_key = '032c03fbcaf94c05b55ddf4ec973ad16'
path = 'app/res/{}_{}.json'

languages = ['it', 'en']
movies = [
    '1771', # Captain America - Il primo vendicatore
    '1726', # Iron Man
    '1724', # The Incredible Hulk
    '10138', # Iron Man 2
    '10195', # Thor
    '24428', # The Avengers
    '68721', # Iron Man 3
    '76338', # Thor: The Dark World
    '100402', # Captain America: Winter Soldier
    '118340', # Guardians of the Galaxy
    '99861', # Avengers: Age of Ultron
    '102899', # Ant-Man
    '271110' # Captain America: Civil War
]
xmen_movies = [
    '36657', # X-Men
    '36658', # X-Men 2
    '36668', # X-Men - Conflitto finale
    '2080', # X-Men le origini - Wolverine
    '49538', # X-Men - L'inizio
    '76170', # Wolverine - L'immortale
    '127585', # X-Men - Giorni di un futuro passato
    '293660', # Deadpool
    '246655' # X-Men - Apocalisse
]

res = {}
base_url = 'https://api.themoviedb.org/3/movie/{}?api_key={}&language={}'

# Download main movies
for l in languages:
    for i in range(0, len(movies)):
        r = requests.request('get', base_url.format(movies[i], api_key, l))
        if r.ok:
            while True:
                response = json.loads(r.text)
                response['order'] = i+1

                if i+1 in range(0, len(movies)):
                    response['next'] = movies[i+1]

                if i-1 in range(0, len(movies)):
                    response['previous'] = movies[i-1]

                res[movies[i]] = response
                try:
                    if response['status_code'] == 25:
                        print('Limit reached. Sleep for a while...')
                        sleep(1)
                except Exception:
                    print("Download complete: " + movies[i])
                    break
    with open(path.format('main', l), 'w') as f:
        json.dump(res, f)


res = {}
# Download X-Men movies
for l in languages:
    for i in range(0, len(xmen_movies)):
        r = requests.request('get', base_url.format(xmen_movies[i], api_key, l))
        if r.ok:
            while True:
                response = json.loads(r.text)
                response['order'] = i+1

                if i+1 in range(0, len(xmen_movies)):
                    response['next'] = xmen_movies[i+1]

                if i-1 in range(0, len(xmen_movies)):
                    response['previous'] = xmen_movies[i-1]

                res[xmen_movies[i]] = response
                try:
                    if response['status_code'] == 25:
                        print('Limit reached. Sleep for a while...')
                        sleep(1)
                except Exception:
                    print("Download complete: " + xmen_movies[i])
                    break
    with open(path.format('xmen', l), 'w') as f:
        json.dump(res, f)
