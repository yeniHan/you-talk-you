import React from 'react';
import './TeachingLang.scss';

const TeachingLang = (props) => {
    let { langName, crsNum } = props
    return (
        <div className="teaching-langs"><div className="lang-names">{langName}</div><div><span className="crs-nums">{crsNum}</span>  개 코스</div></div>
    )
}

export default TeachingLang;