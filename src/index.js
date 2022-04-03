import './styles.scss'
import 'material-icons/iconfont/material-icons.css';

window.onload = function () {
    let allNotes = []
    let editArr = []
    let objResult = {}
    let isEdit = false
    const regDate = '^([0-2][0-9]||3[0-1])/(0[0-9]||1[0-1])/([0-9][0-9])?[0-9][0-9]$'

    const nameNotes = document.querySelector('.notes-name')
    const title = document.querySelector('.notes-title')
    let select = document.querySelector('.select')
    let options = document.querySelector('.select').options
    const content = document.querySelector('.content')
    const categoryArhive = document.querySelector('.category-arhive')
    const isOpenFrom = document.querySelector('#isOpenFrom')
    const closeForm = document.querySelector('#closeForm')
    const myForm = document.querySelector('.form-wrapper')
    const categoryContent = document.querySelector('#category__content-count')
    const notesArchive = document.querySelector('#notes-archive')

    // закрываем форму
    closeForm.addEventListener('click', (e) => {
        e.preventDefault()
        myForm.classList.add('hidden')

    })
    // показываем форму
    isOpenFrom.addEventListener('click', (e) => {
            e.preventDefault()
            myForm.classList.remove('hidden')
        }
    )

    // удаление из архива
    categoryArhive.addEventListener('click', (e)=>{
        let id = e.target.getAttribute('data-id');
        if ((e.target.getAttribute('data-type')) === 'unarchive') {
            unarchive(id)
        }
    })
    // добавление событие кликов (  редактировать , удалить , архивировать )
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
    //заполняем форму содержимом для редактировании
    const editNotes = (id) => {

        editArr = allNotes.filter((item) => item.id == id)
        title.value = editArr[0].title;
        nameNotes.value = editArr[0].nameNotes;
        select.value = editArr[0].categoryText
        myForm.classList.remove('hidden')
    }

    //удаляем из архива
    const unarchive = (id) => {
        allNotes = allNotes.map(item => {
            if (item.id == id) {
                item.archive = !item.archive
                return item
            }
            return item
        })
        render()
        renderCategories()
        renderArchives()
    }
    // Добавляем в архив запись
    const archivedCategories = (id) => {
        allNotes = allNotes.map(item => {
            if (item.id == id) {
                item.archive = !item.archive
                return item
            }
            return item
        })
        render()
        renderCategories()
        renderArchives()
    }
    // функция удаления записи
    const removeNotes = (id) => {
        const res = allNotes.filter((item) => {
            return item.id != id
        })
        allNotes = [...res]
        render()
        renderCategories()
    }
    //доавление или редактивоние записи
    const addNotes = (nameNotes = '', title = 'exmaple text', category = "text", code, id = null) => {
        if (title.length < 2) {
            return false
        }
        let datesArr = []
        let reg = /[\r\n]+/g;

        let titleSplit = title.replace(reg," ").split(' ')
        titleSplit.forEach((item) => {
            if (item.match(regDate)) {
                datesArr.push(item)
            }
        })

        if (!isEdit) {

            const date = new Date().toLocaleString('en', {month: 'short', year: 'numeric', day: 'numeric'})
            allNotes.push({
                id: Date.now(),
                nameNotes: nameNotes,
                title: title,
                category: category,
                categoryText: code,
                created: date,
                archive: false,
                dates: datesArr.join(' ')
            })
        }

        if (isEdit) {
            const date = new Date().toLocaleString('en', {month: 'short', year: 'numeric', day: 'numeric'})
            allNotes = allNotes.map((item) => {

                if (item.id == editArr[0].id) {
                    const obj = {
                        ...editArr[0],
                        nameNotes: nameNotes,
                        title: title,
                        category: category,
                        created: date,
                        categoryText: code,
                        dates: datesArr.join(' ')
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
    // собтыие на клик формы.
    const btn = document.querySelector('.sendForm')
    btn.onclick = function (e) {
        e.preventDefault()
        if (title.value.length < 2) {
            alert('More text please')
            return false
        }
        addNotes(nameNotes.value, title.value, options[select.selectedIndex].text, select.value)

        nameNotes.value = ''
        title.value = ''
        select.value = 'task'
        myForm.classList.add('hidden')
        render()
        renderCategories()

    }

    // рендер записей
    const render = () => {
        content.innerHTML = ''
        if (allNotes.length > 0) {
            allNotes.filter(it => it.archive == false).forEach((item) => {
                content.insertAdjacentHTML('beforeend',
                    `<div class="content__item">
                <div class="content__name"> ${item.nameNotes} </div>
                <div class="content__name"> ${item.created} </div>
                <div class="content__name"> ${item.category} </div>
                <div class="content__name"> ${item.title} </div>
              
               
                <div class="content__name"> ${item.dates.length > 0 ? item.dates : ""} </div>
                
                <div class="content__name">
                    <span class="material-icons links" data-type="edit" data-id=${item.id}>edit</span>
                    <span class="material-icons links" data-type="archived" data-id=${item.id}>archive</span>
                    <span class="material-icons links" data-type="delete" data-id=${item.id}>delete</span>
                 </div>
                
               </div>`)
            })

        }
        return false
    }
    // считаем записи активных и архивных
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
                        if (item.archive) {
                            objResult[categories].archiveCount += 1
                        } else {
                            objResult[categories].activeCount += 1
                        }
                    }
                })

            })
        }
    }
    // рендер количество активных и архивных категорий
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
    renderCategories()
    const renderArchives = () => {
        notesArchive.innerHTML = ''
        if (allNotes.length > 0) {
            allNotes.filter(it => it.archive == true).forEach((item) => {
                notesArchive.insertAdjacentHTML('beforeend',
                    `<div class="content__item">
                <div class="content__name"> ${item.nameNotes} </div>
                <div class="content__name"> ${item.category} </div>
                <div class="content__name"> ${item.title} </div>
                <div class="content__name">
                    <span class="material-icons links"  data-type="unarchive" data-id=${item.id}>unarchive</span>
                 </div>
               </div>`)
            })

        }
        return false
    }

}


