import './style.css'
import '@fortawesome/fontawesome-free/js/fontawesome'


window.onload = function () {
    let allNotes = []
    let editArr = []
    let objResult = {}
    let isEdit = false

    const title = document.querySelector('.notes-title')
    let select = document.querySelector('.select')
    let options = document.querySelector('.select').options
    const content = document.querySelector('.content')
    const categoryContent = document.querySelector('.category__content')

    content.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.getAttribute('data-id');
        if ((e.target.getAttribute('data-type')) === 'edit') {
            isEdit = true;
            editNotes(id)

        }
        if ((e.target.getAttribute('data-type')) === 'delete') {
            removeNotes(id)
        }
        if ((e.target.getAttribute('data-type')) === 'archived') {
            archivedCategories(id)
        }
    })

    const editNotes = (id) => {
        editArr = allNotes.filter((item) => item.id == id)
        title.value = editArr[0].title;
        select.value = editArr[0].categoryText
    }
    const archivedCategories = (id) => {
        allNotes = allNotes.map(item => {
            if (item.id == id) {
                item.arhived = !item.arhived
                return item
            }
            return item
        })
        render()
        renderCategories()
    }
    const removeNotes = (id) => {
        const res = allNotes.filter((item) => {
            return item.id != id
        })
        allNotes = [...res]
        render()
        renderCategories()
    }
    const addNotes = (title = 'exmaple text', category = "text", code, id = null) => {
        if (title.length < 2) {
            return false
        }
        if (!isEdit) {
            const date = new Date().toLocaleString('en', {month: 'short', year: 'numeric', day: 'numeric'})
            allNotes.push({
                id: Date.now(),
                title: title,
                category: category,
                categoryText: code,
                date: date,
                arhived: false
            })
        }

        if (isEdit) {
            const date = new Date().toLocaleString('en', {month: 'short', year: 'numeric', day: 'numeric'})
            allNotes = allNotes.map((item) => {
                if (item.id == editArr[0].id) {
                    const obj = {
                        ...editArr[0],
                        title: title,
                        category: category,
                        date: date,
                        categoryText: code,
                    }
                    return obj
                } else {
                    return item
                }


            })

            render()

            isEdit = false
            editArr = null
        }


    }

    const btn = document.querySelector('.sendForm')
    btn.onclick = function (e) {
        e.preventDefault()

        if (title.value.length < 2) {
            alert('More text please')
            return false
        }
        addNotes(title.value, options[select.selectedIndex].text, select.value)

        title.value = ''
        select.value = 'task'
        render()
        renderCategories()

    }


    const render = () => {
        content.innerHTML = ''
        if (allNotes.length > 0) {
            allNotes.forEach((item) => {
                content.insertAdjacentHTML('beforeend',
                    `<div class="content__item">
                <div class="content__name"> ${item.title} </div>
                <div class="content__name"> ${item.category} </div>
                <div class="content__name"> ${item.date} </div>
                
                <div>
                    <button data-type="delete" data-id=${item.id}>delete</button>
                    <button data-type="edit" data-id=${item.id}>Edit</button>
                    <button data-type="archived" data-id=${item.id}>Arhived</button>
                 </div>
                
               </div>`)
            })

        }
        return false
    }

    const countCategories = () => {
        objResult = {
            Task: {
                activeCount: 0,
                archiveCount: 0
            },
            'Random Thought': {
                activeCount: 0,
                archiveCount: 0
            },
            'Idea': {
                activeCount: 0,
                archiveCount: 0
            },
            'Quote': {
                activeCount: 0,
                archiveCount: 0
            }
        }

        if (allNotes.length > 0) {
            Object.keys(objResult).forEach((categories) => {
                allNotes.forEach((item) => {
                    if (categories == item.category) {
                        if (item.arhived) {
                            objResult[categories].archiveCount += 1
                        } else {
                            objResult[categories].activeCount += 1
                        }
                    }
                })

            })
        }
    }
    const renderCategories = () => {
        categoryContent.innerHTML = ''
        countCategories();

        for (let key in objResult) {
            if (objResult.hasOwnProperty(key)) {

                categoryContent.insertAdjacentHTML(
                'beforeend',
                    `<div class="category__items">
                        <div class="category__item">${key}</div>
                        <div class="category__item">${objResult[key].activeCount}</div>
                        <div class="category__item">${objResult[key].archiveCount}</div>
                      </div>`)

            }
        }

    }
}


