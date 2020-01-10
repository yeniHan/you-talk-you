import React from 'react';
import './Tag.scss';

const Tag = (props) => {
    let {tag, changeTags} = props
    return(
        <div className="tags"><span>{tag}</span><i id={'close-ic-for-' + tag} class="fas fa-times" onClick={(e) => changeTags(e, 'del')}></i></div>
    )
}

export default Tag;