import axios from "axios";

const baseUrl = "/api/notes"

const getAll = () => {
    const req = axios.get(baseUrl);
    const nonExisting = {
        id: 1000,
        content: "Empty note",
        important: true
    }
    return req.then(r => r.data.concat(nonExisting));
}

const create = newObject => {
    const req = axios.post(baseUrl, newObject);
    return req.then(r => r.data);
}

const update = (id, newObject) => {
    const req = axios.put(`${baseUrl}/${id}`, newObject);
    return req.then(r => r.data);
}

export default { getAll, create, update };