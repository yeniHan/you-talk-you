import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  aysncGetMySchedule, addError } from '../Actions/actionCreators';
import Fetching from '../Components/Fetching';
import Day from '../Components/Day';
import { getLastDate, getFirstDay} from '../Utils/dateFunctions';
import './MySchedule.scss';
import ExpiredStorage from 'expired-storage';
import { Carousel } from 'react-responsive-carousel';
import AwesomeSlider from 'react-awesome-slider';
import SchedulePopup from '../Components/SchedulePopup';


const storage = new ExpiredStorage()


class MySchedule extends React.Component{
    state = {
        monthNames:  ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        currCar: 0,
        schedule: null,
        tZoneInfo: new Date().toTimeString().split(' ')[1]
    }


    slideCalendar = (right) => {
        let carEl = document.querySelector('#carousel')
        let { currCar } = this.state

        
        let nextCar; 
        if(right){
            if(currCar === 0){
                carEl.className = 'zero_one'
                nextCar = 1
                this.setState({
                    ...this.state,
                    currCar: nextCar
                })
            }else if(currCar === -1){
                carEl.className = 'mone_zero' 
                nextCar = 0
                this.setState({
                    ...this.state,
                    currCar: nextCar
                })
            }

        }else{
            if(currCar === 0){
                carEl.className = 'zero_mone'
                nextCar = -1
                this.setState({
                    ...this.state,
                    currCar: nextCar
                })
            }else if(currCar === 1) {
                
                carEl.className = 'one_zero'
                nextCar = 0    
                this.setState({
                    ...this.state,
                    currCar: nextCar
                })            
            }
        }
    }

    togglePopup = (on, schedule = null) => {
        
        if(on){
            this.setState({
                schedule: schedule
            })
            document.querySelector('.wrapper').classList.add('show-popup')
        }else{
            document.querySelector('.wrapper').classList.remove('show-popup')   
        }
    }

    componentDidMount () {


        // xxM: [ montValue, montName:str, firstDay:int, lastDate:int]

        let userType = parseInt(storage.getItem('userType'))
        if(userType !== 0 && userType !== 1) addError('Invalid userType.', 'Ut')
        else{
            this.props.aysncGetMySchedule(userType)
        }
        
    } 

    render(){
        let {infoForCals} = this.props
        if(infoForCals) {

            let {monthNames, tZoneInfo} = this.state
            let dt = new Date()
            let currM = dt.getMonth() + 1
            let prevM = currM - 1  === 0? 12: currM - 1
            let nextM = currM + 1  === 13? 1: currM + 1
     
            

            
            //***Create the calendar **

            //Each array'll be [lastDay, [[date(dd: int), lesson(:object)], ...]]
            
            let prevDays = infoForCals[0].map((info, idx) =>{
                return <Day key={prevM+ '_' + idx} month={prevM} date={info[0]} lessons={info[1]} togglePopup={this.togglePopup}/>
            })
            let currDays = infoForCals[1].map((info, idx )=>{
                return <Day key={currM + '_' +idx} month={currM} date={info[0]} lessons={info[1]} togglePopup={this.togglePopup}/>
            })
            let nextDays = infoForCals[2].map((info, idx) =>{
                return <Day key={nextM + '_' + idx} month={nextM} date={info[0]} lessons={info[1]} togglePopup={this.togglePopup}/>
            })

            

            return (
                <div id="my-schedule">
                    <div id="tzone-info">{tZoneInfo}</div>
                    <div id="carousel">
                        <div className="cal">
                            <div className="month-name">{prevM + ' ' +  monthNames[prevM -1]}</div>
                            <div className="days">{prevDays}</div>
                        </div>  
                        <i id="left-arrow" class="fas fa-chevron-left arrow" onClick={() => this.slideCalendar(false)}></i>
                        <div className="cal">
                            <div className="month-name">{currM + ' ' + monthNames[currM -1]}</div>
                            <div className="days">{currDays}</div>
                        </div> 
                        <i id="right-arrow" class="fas fa-chevron-right arrow" onClick={() => this.slideCalendar(true)}></i>
                        <div className="cal">
                            <div className="month-name">{nextM + ' ' + monthNames[nextM -1]}</div>
                            <div className="days">{nextDays}</div>
                        </div>
                    </div>
                    <SchedulePopup schedule={this.state.schedule} togglePopup={this.togglePopup}/>
                </div>
            )
        }else{

            return (
                <div id="my-schedule">
                    <Fetching/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    infoForCals: state.user.infoForCals
})

const mapDispatchToProps = (dispatch) => ({
    aysncGetMySchedule: (userType) => dispatch(aysncGetMySchedule(userType))
})

export default connect (mapStateToProps, mapDispatchToProps) (MySchedule)