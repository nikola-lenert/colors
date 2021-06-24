import axios from "axios";
const COLOR_API_URL = 'https://www.colr.org/json/color/random'

export function fetchRandomColor() {
    return axios.get(COLOR_API_URL).then(response => {
        return response
    })
}