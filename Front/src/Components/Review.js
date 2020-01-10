import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Score from './Score';
import './Review.scss';

const Review = (props) => {
    let {score, review, writer} = props
    return(
        <div className="reviews">
            <Score score={score}/>
            <div className="content">{review}</div>
            <div className="username">From {writer}</div>
        </div>
    )
}

export default Review ;