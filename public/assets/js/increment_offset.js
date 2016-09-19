function increment_offset() {
    var offset = get_param('offset');
    if (offset === '' || offset === null) {
        offset = 5;
    } else {
        offset = parseInt(offset) + 5
    }

    location.href = '/?offset=' + offset;
}

function get_param(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}