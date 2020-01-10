export const getLastDate = (month) => {
    let dt = new Date()
    return new Date(dt.getFullYear(), month + 1, 0).getDate()
}

// /Sun - Sat ; 0- 6
export const getFirstDay = (month) => {
    let dt = new Date()
    return new Date(dt.getFullYear(), month, 1).getDay()
}



export const  getTimeString = (ts) => {
    let DO = new Date(ts)
    let h = DO.getHours()
    let m = DO.getDate() 
    return [h < 10? '0' + h: h , m < 10? '0' + m : m].join(':')

}