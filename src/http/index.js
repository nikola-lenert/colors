import axios from "axios";

const COLOR_API_URL = 'https://www.colr.org/json/color/random'

export function fetchRandomColor() {
    return axios.get(COLOR_API_URL, {
        params: {timestamp: (new Date()).getTime()}
    }).then(response => {
        return response
    })
}