import React from 'react';
import { getTimeString } from '../Utils/dateFunctions';

const Day = (props) => {
    let {month, date, lessons, togglePopup} = props
    let slicedLessons = lessons.slice(0, 2)

    let lessonEls = slicedLessons.map(ls => {
        let {startTS, endTS, coursename, username, confirm } = ls
        console.log('startTS:', startTS, );
        
        let stTime = getTimeString(startTS*60000)
        let endTime = getTimeString(endTS*60000)
        
        

        let slicedCrsName = coursename.length > 14? coursename.slice(0, 14) + '...': coursename.slice(0, 14)
        let classesConfirm = confirm === 1? "time confirm": "time"
        
        return (
            <div className="lesson">
                <div className={classesConfirm}>{stTime + '~'+ endTime}</div>
                <div>{slicedCrsName}</div>
            </div>
        )            
    })


    let className = date == null? 'day no-date': 'day'
            
    return(
        <div className={className} onClick={() => togglePopup(true, {
            datetime: [new Date().getFullYear(), month, date].join('-'),
            lessons: lessons 
        })}>
            <div className="date">{date}</div>
            <div>{lessonEls}</div>
        </div>
    )

}



export default Day;