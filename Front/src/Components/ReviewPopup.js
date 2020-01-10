import React from 'react';
import './ReviewPopup.scss';
import { connect } from 'react-redux';
import Score from '../Components/Score';
import { asyncAddReview, resetAddReviewSuccess } from '../Actions/actionCreators';

class ReviewPopup extends React.Component{
    state = {
        review: null,
        score: 0.0
    }

    onChangeHandler = (e) => {
        let {name, value} = e.target
        
        this.setState({
            ...this.state,
            [name]: name === 'score'?  parseFloat(value): value
        })
    }

    closeWindow = () => {
        let options = document.querySelectorAll('#review-popup option')
        options.forEach(op => {
            if(op.value === "0.0") op.selected = true
            else op.selected = false
        })
        document.querySelector('#review-popup textarea').value = ''
        this.setState({review: null, score: 0.0}); 
        this.props.toggleReviewPopup('off')
    }

    clickSendReviewBtn = () => {
        let {review} = this.state
        review = review.replace(/"/gi,`\\"`)
        review = review.replace(/'/gi,`\\'`)

        this.props.asyncAddReview({
            reviewKind: this.props.reviewKind,
            ID: this.props.ID,
            score: this.state.score,
            review: review
        })

    }


    render () {
        if(this.props.addReviewSuccess) {
            alert('리뷰가 등록되었습니다. 감사합니다.')
            this.props.resetAddReviewSuccess()
        }
        return (
            <div id="review-popup-wrapper" className="wrapper">
                <div id="review-popup">
                    <div>
                        <div id="score">
                            <div id="fieldnameNscore"><div className="field-name">SCORE</div> <Score review={"review"} score={this.state.score}/></div>
                            <select name="score" onChange={this.onChangeHandler}>
                                <option value="0.0">0</option>
                                <option value="0.5">0.5</option>
                                <option value="1.0">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2.0">2</option>
                                <option value="2.5">2.5</option>
                                <option value="3.0">3</option>
                                <option value="3.5">3.5</option>
                                <option value="4.0">4</option>
                                <option value="4.5">4.5</option>
                                <option value="5.0">5</option>
                            </select>
                        </div>
                        <div id="review">
                            <div className="field-name">REVIEW</div>
                            <textarea name="review" onChange={this.onChangeHandler}/>
                        </div>
                        <div id="send-review-btn" onClick={this.clickSendReviewBtn}>남기기</div>
                    </div>
                    <span className="ic-close"><i class="fas fa-times" onClick={this.closeWindow}></i></span>                
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    addReviewSuccess: state.user.addReviewSuccess
})

const mapDispatchToProps = (dispatch) => ({
    asyncAddReview: (review) => dispatch(asyncAddReview(review)),
    resetAddReviewSuccess: () => dispatch(resetAddReviewSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPopup);