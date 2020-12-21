import httpService from './httpService.js'
import {
    SphericalUtil
} from "node-geometry-library";
const BASE_URL = '/pet'

export const petService = {
    query,
    getPetById,
    save,
    remove
}

async function query(filterBy) {
    let queryStr = '';
    const res = await httpService.get(`${BASE_URL}${queryStr}`, {
        params: filterBy
    });
    const filtered = filterPets(res, filterBy);
    return filtered;
}
async function getPetById(id) {
    const res = await httpService.get(`${BASE_URL}/${id}`);
    return res;
}
async function save(pet) {
    if (pet._id) {
        const res = await httpService.put(`${BASE_URL}/${pet._id}`, pet)
        return res;
    } else {
        const res = await httpService.post(`${BASE_URL}`, pet)
        return res;
    }
}
async function remove(petId) {
    await httpService.delete(`${BASE_URL}/${petId}`)
}

function filterPets(pets, filterBy) {
    if (!filterBy) return pets
    let filteredPets = pets
    if (filterBy.txt) {
        filterBy.txt = filterBy.txt.trim();
        let words = filterBy.txt.split(' ');
        if (words.length === 1) words = filterBy.txt.split(',');

        words.forEach(word => {
            filteredPets = filteredPets.filter(pet => {
                if (pet.name.toLowerCase().includes(word) ||
                    pet.type.toLowerCase().includes(word) ||
                    pet.size.toLowerCase().includes(word) ||
                    pet.shop.fullName.toLowerCase().includes(word)) return pet
            })
        })
    }

    filteredPets = filteredPets.filter(pet => {
        return pet.type.toLowerCase().includes(filterBy.type)
    })

    if (filterBy.distance.range) {
        const userLoc = {
            lat: filterBy.distance.lat,
            lng: filterBy.distance.lng
        };
        filteredPets = filteredPets.filter(pet => {
            const petLoc = {
                lat: pet.location.lat,
                lng: pet.location.lng
            };
            const distanceFromUser = SphericalUtil.computeDistanceBetween(userLoc, petLoc) / 1000
            return distanceFromUser <= filterBy.distance.range
        })
    }

    return filteredPets
}