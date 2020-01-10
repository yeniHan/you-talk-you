import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncReserveLesson, resetReserveLessonSuccess} from '../Actions/actionCreators';
import './ReservePopup.scss';

class ReservePopup extends React.Component{
    state = {
        date: null,
        time: null,
        pay: false,
        msg: '',
        credits: 100,
        dateMin: null
    }

    onChangeHandleler = (e) => {
        let {name, value} = e.target
        //able the reserve button
        this.setState({
            ...this.state,
            [name]: value
        })
    }

    pay = () => {
        console.log('pay()');
        
        let { pay, date, time} = this.state
        if(date == null|| date===''|| time == null|| time === ''){
            alert('필수 입력사항을 모두 기입해주세요.')
        }else{
            if(!pay){
                let { credits } = this.state
                let leftCreidts = credits - this.props.price
                console.log('credits:', credits, 'props.price:', this.props.price);
                
                this.setState({
                        pay: true,
                        credits: leftCreidts
                })
                alert('결제가 완료되었습니다. ')
                document.querySelector('#reserve-popup #popup-reserve-btn').classList.add('able')
            }else {
                alert('이미 결제가 완료되었습니다.')
            }
        }

    }

    onClickReserveBtn = () => {

        if(!this.state.pay) alert('결제를 완료해주세요.') 
        else {
            //Calculate endTD     
            let { date, time, msg} = this.state
            let unitTime = this.props.unitTime
            let valNunit = unitTime.split('/')
            let val = valNunit[1] === 'H' ? 60: 1
            let diff = parseInt(valNunit[0]) * val
            let dateArr = date.split('-').map(str => parseInt(str))
            let timeArr = time.split(':').map(str => parseInt(str))
            console.log('dtArr:', dateArr);
            console.log('timeArr:', timeArr);
            
            var dt = new Date()
            dt.setUTCFullYear(dateArr[0])
            dt.setUTCMonth(dateArr[1] - 1 )
            dt.setUTCDate(dateArr[2])
            dt.setUTCHours(timeArr[0])
            dt.setUTCMinutes(timeArr[1])
            dt.setUTCSeconds(0)
            dt.setUTCMilliseconds(0)
            var startTS = dt.valueOf()/60000 + new Date().getTimezoneOffset()
            var endTS = startTS + diff

            msg = msg.replace(/'/g, "\\'")
            msg = msg.replace(/"/g, '\\"')
            console.log('startTs:', startTS, 'endTs:', endTS);
            

            this.props.asyncReserveLesson({
                teacherID: this.props.teacherID,
                courseID: this.props.ID, 
                startTS: startTS,
                endTS: endTS,
                msg:  msg,
                coursename: this.props.coursename,
                teacherUsername: this.props.teachername
            })
        }

    }

    clickCloseIc = () => {
        //Reset the value of the inputs for date , time, msg
        document.querySelector('input[name=date]').value = ''
        document.querySelector('input[name=time]').value = ''
        document.querySelector('textarea[name=msg]').value = ''
        
        //reset the store 
        this.setState({
            date: null,
            time: null,
            pay: false,
            msg: '',
            credits: 100,
            dateMin: null
        })
        //Disable the resverBtn
        document.querySelector('#reserve-popup #popup-reserve-btn').classList.remove('able')
        this.props.toggleReservePopup('off')
        
    }

    componentDidMount () {
        let dt = new Date()
        let y = dt.getFullYear()
        let arr = [dt.getMonth() + 1 , dt.getDate()].map(val => {
            return val < 10 ? '0' + val: val
        })
        

        this.setState({
            ...this.state,
            dateMin: [y, arr[0], arr[1]].join('-'),
        })
        
    }

    render() {
        let { coursename, teachername, price, reserveLessonSuccess, unitTime } = this.props
        let { dateMin, timeMin } = this.state
        let valNunit = unitTime.split('/')
        let unit = valNunit[1] === 'H'? 'hour(s)': 'minute(s)'
        let unitTimeStr = valNunit[0] + ' ' + unit
        
        if(this.props.reserveLessonSuccess){ 
            alert('예약을 요청하였습니다. Teacher가 확답을 해주시면 강의 예약이 완료됩니다.')
            this.props.resetReserveLessonSuccess()
        }
        console.log('state:', this.state);
        

        return (
        <div id="reserve-popup-wrapper" className="wrapper">            
            <div id="reserve-popup">   
                <div id="content">
                    <div id="title">Reserve a lesson</div>
                    <div id="coursename"><span className="field-name">COURSE</span>{coursename}</div>                
                    <div id="teacher"><span className="field-name">TEACHER</span>{teachername}</div>
                    <div id="dateNtime">
                        <div><span className="field-name">DATE</span><input name="date" type="date" min={dateMin} onChange={this.onChangeHandleler}/></div>
                        <div><span className="field-name">TIME</span><input name="time" type="time" onChange={this.onChangeHandleler}/> <span>Duration: {unitTimeStr}</span></div>                    
                    </div>
                    <div id="message">
                        <div className="field-name">MESSAGE TO TEACHER</div>
                        <textarea name="msg" onChange={this.onChangeHandleler}/>
                    </div>
                    <div id="payment">
                        <div>Your current credits: $ {this.state.credits}</div>
                        <div id="price"><span className="field-name">PRICE</span>{price}</div>
                        <div id="credit-pay-btn" onClick={this.pay}>youTalkyou credits으로 결제하기</div>
                    </div>
                    <div id="popup-reserve-btn" onClick={this.onClickReserveBtn}>예약 하기</div>
                </div>
                <span id="ic-close"><i class="fas fa-times" onClick={this.clickCloseIc}></i></span>                                
            </div>
        </div>
        )
    }
}



const mapStateToProps = (state) => ({
    reserveLessonSuccess: state.user.reserveLessonSuccess
})

const mapDispatchToProps = (dispatch) => ({
    asyncReserveLesson: (lesson) => dispatch(asyncReserveLesson(lesson)),
    resetReserveLessonSuccess:() => dispatch(resetReserveLessonSuccess())
})


export default connect( mapStateToProps, mapDispatchToProps)(ReservePopup);