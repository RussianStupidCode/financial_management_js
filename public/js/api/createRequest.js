/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    data = options.data;
    url = options.url;
    

    if(options.data != null && Object.keys(options.data).length > 0) {
        if(options.method.toUpperCase() !== "GET") {
            data = new FormData();
            
            for(const [key, value] of Object.entries(options.data)) {
                data.append(key, value);
            }
        } else {
            url = options.url + `?${new URLSearchParams(options.data).toString()}`;
        }    
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    try {
        xhr.open(options.method, url);
        xhr.send(data);
    } catch(error) {
        callback(error);
    }

    xhr.addEventListener("readystatechange", event => {
        if(xhr.readyState === xhr.DONE) {
            const response = xhr.response;

            if(response == null) {
                options.callback("empty response");
                return 
            }

            if(response["success"]) {
                options.callback(null, response);
            } else {
                options.callback(response["error"], response);
            }
        }
    });
};
