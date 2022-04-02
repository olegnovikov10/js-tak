
let  allNotes = []
const addNotes =   (title ='exmaple text', category="text") => {
    const date = new Date().toLocaleString('en', { month: 'short' , year: 'numeric',day: 'numeric'  })
    allNotes.push({
        id: new Date(),
        title : title,
        category : category,
        date : date
    })
}

 export const removeNotes = (id) => {
    console.log('click')
   const newArr =  allNotes.filter((item)=> item.id !== id)
    allNotes = [...newArr]
}

const editNotes = (id) => {
    const arrItem = allNotes.filter((item)=> item.id == id)
    //... fucn modal
}




