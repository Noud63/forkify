import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js'

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function( url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {                       // if uploadData exist
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uploadData),
        }) : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);   
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)

        //console.log(data)   // data returned from api with createdAt, id and key

        return data

} catch (err) {
    throw err;              // to get the error from the model and not the helper file
    }
}


/*
// Old version before refactoring
export const getJSON = async (url) => {

    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json()
        //console.log(data)

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)

        return data

    } catch (err) {
        throw err;   // to get the error from the model and not the helper file
    }

}


export const sendJSON = async (url, uploadData) => {

    try {
        const fetchPro = fetch(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uploadData),
        })

        const res = await Promise.race([ fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)

        console.log(data)   // data returned from api with createdAt, id and key

        return data

    } catch (err) {
        throw err;   // to get the error from the model and not the helper file
    }

}
*/

