// select element
const inpSearch = document.querySelector('#inp-search')
const mainVideo = document.querySelector('#main')
const counterPage = document.querySelector('#counter-page')
const prevPage = document.querySelector('#prev-page')
const nextPage = document.querySelector('#next-page')
const loading = document.querySelector('.spinner-box')
const pagination = document.querySelector('#pagination')
const h2Temp = document.querySelector('#temp')
// select element


// reload
let page = 1
let userInput = 'Avengers'
let allData = []
getAllData()
// reload


// get all data
async function getAllData() {
    loading.style.display = 'flex'
    pagination.style.display = 'none'

    allData = []

    let currentPage = 1
    let totalResults = 0

    let res = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&s=${userInput}&page=${currentPage}&type=movie`)
    if (res.ok) {
        let initialRes = await res.json()
        totalResults = parseInt(initialRes.totalResults)
    } else {
        loading.style.display = 'none'
        return
    }

    const totalPages = Math.ceil(totalResults / 10)

    while (currentPage <= totalPages) {
        let data = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&s=${userInput}&page=${currentPage}&type=movie`)
        if (data.ok) {
            let res = await data.json()
            if (res.Search) allData = allData.concat(res.Search)
        }
        currentPage++
    }

    loading.style.display = 'none'
    pagination.style.display = 'flex'
    searchInput(allData)
    renderToDom(allData.slice(0, 10))
}
// get all data


// render to DOM
function renderToDom(data) {
    mainVideo.innerHTML = '';

    if (!data || data.length === 0) {
        h2Temp.style.display = 'block'
        pagination.style.display = 'none'
        return
    } else {
        h2Temp.style.display = 'none'
        pagination.style.display = 'flex'
    }

    data.forEach(val => {
        let div = document.createElement('div')
        div.className = 'w-[280px] lg:w-[23.5%] h-[170px] flex border border-slate-400 border-opacity-60 rounded-lg overflow-hidden'

        div.innerHTML = `
            <figure class="w-1/3 h-full">
                <img src="${val.Poster}" alt="" class="w-full h-full object-cover">
            </figure>
            <div class="w-[55%] h-full flex flex-col pl-4 pt-5 gap-2">
                <a href="#" class="text-gray-700 hover:text-[#F73867] text-lg font-semibold">${val.Title}</a>
                <p class="font-semibold text-gray-800">Type : <span id="video-type">${val.Type}</span></p>
                <p class="font-semibold text-gray-800">Year: <span id="video-year">${val.Year}</span></p>
            </div>
            <div class="w-[15%] flex justify-center h-[35%] pt-6">
                <i class="bi bi-bookmark-fill text-xl cursor-pointer"></i>
            </div>
        `
        mainVideo.append(div)
    })
}
// render to DOM


// previous page
prevPage.addEventListener('click', () => {
    page--
    counterPage.innerText = page
    if (page < 1) {
        page = 1
        counterPage.innerText = 1
    }
    const startIndex = (page - 1) * 10
    const endIndex = startIndex + 10
    renderToDom(allData.slice(startIndex, endIndex))
})
// previous page


// next page
nextPage.addEventListener('click', () => {
    page++
    counterPage.innerText = page
    if (page > Math.ceil(allData.length / 10)) {
        page = Math.ceil(allData.length / 10)
        counterPage.innerText = page
    }
    const startIndex = (page - 1) * 10
    const endIndex = startIndex + 10
    renderToDom(allData.slice(startIndex, endIndex))
})
// next page


// search input
function searchInput(data) {
    inpSearch.addEventListener('input', () => {
        let value = inpSearch.value.trim().toLowerCase()

        if (value === '') {
            renderToDom(allData.slice(0, 10))
            page = 1
            counterPage.innerText = page
            h2Temp.style.display = 'none'
            pagination.style.display = 'flex'
            return
        }

        let filterData = data.filter(val => val.Title.toLowerCase().includes(value))
        renderToDom(filterData)

        if (filterData.length === 0) {
            h2Temp.style.display = 'block'
            pagination.style.display = 'none'
        } else {
            h2Temp.style.display = 'none'
            pagination.style.display = 'flex'
        }
    })
}
// search input