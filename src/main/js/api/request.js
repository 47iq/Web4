export function register(login, password) {
    return getResponse('/api/users/register', {username: login, password: password, roles: []}, 'POST', false)
}

export function login(login, password) {
    return getResponse('/api/users/login', {username: login, password: password}, 'POST', false)
}

export function getAll() {
    return getResponse('/api/points/get', {}, 'GET')
}

export function check(point) {
    return getResponse('/api/points/check', point)
}

export function refresh() {
    //todo
    return fetch('/api/users/refresh', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify({refreshToken: sessionStorage.getItem("refreshToken")}) // body data type must match "Content-Type" header
    });
    //return getResponse('/api/users/refresh', {refreshToken: sessionStorage.getItem("refreshToken")})
}

export function clear() {
    return getResponse('/api/points/clear')
}

// Пример отправки POST запроса:
function getResponse(url = '', data = null, method='POST', tokenNeeded = true) {
    // Default options are marked with *
    let token = sessionStorage.getItem("token")
    let httpHeaders
    if(tokenNeeded && token && token !== 'null'){
        httpHeaders = {
            'Content-type': 'application/json',
            'Accept' : 'application/json',
            'Authorization' : `Bearer ${token}`
        };
    } else {
        httpHeaders = {
            'Content-type': 'application/json',
            'Accept' : 'application/json'
        };
    }
    let body = {}
    if(method === 'POST') {
        body = data
        return fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
            headers: httpHeaders,
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
    } else {
        if(data !== null)
            url += '?' + new URLSearchParams(data).toString();
        return fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
            headers: httpHeaders
        });
    }

}