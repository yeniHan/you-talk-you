function getDateRage(m, utcOffset){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
        console.log('Monthe:', monthNames[m-1] );
        
        let startDt = new Date()
        startDt.setUTCFullYear(startDt.getFullYear())
        startDt.setUTCMonth(m -1)
        startDt.setUTCDate(1)
        startDt.setUTCHours(0)
        startDt.setUTCMinutes(0)
        startDt.setUTCSeconds(00)
        startDt.setUTCMilliseconds(000)
        
        let startTs = startDt.valueOf()/60000 + utcOffset
    
        let endDt = new Date()
        endDt.setUTCFullYear(endDt.getFullYear())
        endDt.setUTCMonth(m -1)
        endDt.setUTCDate(getLastDate(m -1))
        endDt.setUTCHours(23)
        endDt.setUTCMinutes(59)
        endDt.setUTCSeconds(59)
        endDt.setUTCMilliseconds(999)
        
        let endTs = endDt.valueOf()/60000 + utcOffset
        return[startTs, endTs]
    
}


function getLastDate (month)  {
    let dt = new Date()
    return new Date(dt.getFullYear(), month + 1, 0).getDate()
}

// /Sun - Sat ; 0- 6
function getFirstDay (month) {
    let dt = new Date()
    return new Date(dt.getFullYear(), month, 1).getDay()
}


module.exports = {
    getDateRage: getDateRage,
    getFirstDay: getFirstDay,
    getLastDate: getLastDate
}