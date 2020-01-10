import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './SearchTeachers.scss';
import authAxios from '../Utils/authAxios';
import { addError, deleteError } from '../Actions/actionCreators';
import Teacher from '../Components/Teacher';
import Fetching from '../Components/Fetching';



class SearchTeachers extends React.Component{
    // TODO.. set min, max by the data from the server.
    state = {
        langNames: {KR: '한국어', EN: '영어',  DE: '독일어',  FR: '프랑스어' ,  CN: '중국어'},
        filter: {
            lang: 'EN',
            nationality: [],            
            avLangs: [],
            gender: 'ALL',
            price: null,
            professional: 'ALL'
        },
        teachers: null
    }


    asyncGetTeachers = (certainFilters = null) => {
        let thisEl = this

        if(certainFilters){
            //Change the color of the applied filters
            console.log('certainFilters:', certainFilters);
            
            let appliedFilters = []
            let nonAppliedFilters = []
            for(let f_name in certainFilters){
                let val = certainFilters[f_name]
                console.log('f_name:', f_name, 'val:', val);
                
                if(f_name === 'price'&& val != null) appliedFilters.push(f_name)
                else if((f_name === 'gender' || f_name === 'professional') && val !== 'ALL') appliedFilters.push(f_name) 
                else if((f_name === 'nationality' || f_name === 'avLangs' ) && certainFilters[f_name].length !== 0)  appliedFilters.push(f_name)
                else{
                    if(f_name !== 'lang') nonAppliedFilters.push(f_name)
                }
            } 
            console.log('appliedFilters:', appliedFilters);
            console.log('nonAppliedFilters:', nonAppliedFilters);


            appliedFilters.forEach(filter => {
                let el = document.querySelector(`#filters #ft-${filter}`)
                console.log('el:', el);
                
                el.classList.replace('non-applied', 'applied')
            })
            nonAppliedFilters.forEach(filter => document.querySelector(`#filters #ft-${filter}`).classList.replace('applied', 'non-applied'))   

        }

        authAxios({
            url: 'http://localhost:8080/user/teachers', 
            // headers: {'Contet-Type': 'application/json'},            
            method: 'POST',
            data: {filter: certainFilters == null? this.state.filter: certainFilters}, 
        },  (func) =>{},  
        async (teachers) => {
            console.log('[res]teachers:', teachers);
            
            await thisEl.setState({
                ...thisEl.state,
                teachers: teachers
            })
        }, ['teachers'])

    } 

    onChangeHandler = (e) => {
        let {name, value} = e.target

        if( name === 'nationality' || name === 'avLangs'){
            let arr  = this.state.filter[name]
            let idx = arr.indexOf(value)
            if(idx !== -1) {
                arr.splice(idx, 1)
                value = arr
            }    
            else {
                arr.push(value)
                value = arr
            }
        }
        else if((name === 'price'|| name === 'professional'||name === 'gender') && value !== 'ALL') value = parseInt(value)
        else if(name ==='lang' && value === 'ALL') value = null


        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                [name]: value
            }
        })
    }

    toggleDropDownMenu = (eventOrName, closeThis = false) => {

        if( closeThis) {
            let name = eventOrName            
            document.getElementById(`dm-${name}`).style.display = 'none'
        
        }else{
            let name = eventOrName.target.id.split('-')[1]
            let dropMenus = document.getElementsByClassName('drop-menu')

            Array.prototype.forEach.call( dropMenus, (el) => {
                let id = el.id
                if(id === `dm-${name}`) el.style.display = 'block'
                else{
                    if(el.style.display === 'block') el.style.display = 'none'
                }
            });
        }
    }
    
    applyOnlyThisFilter = (e) =>{
        let field = e.target.id.split('-')[2]
        let filter =  {
            lang: this.state.filter.lang,
            nationality: [],            
            avLangs: [],
            gender: 'ALL',
            price: null,
            professional: 'ALL'
        }
        filter[field] = this.state.filter[field]
        console.log('appliy only filter:', filter);
        
        this.asyncGetTeachers(filter)
        this.toggleDropDownMenu(field, true)
    }

    showTeacher = (ID) => {

        this.props.history.push(`/teacher/${ID}`)
    }

    applyMultipleFilters = () => {
        let dropMenus = document.getElementsByClassName('drop-menu')

        Array.prototype.forEach.call( dropMenus, (el) => {
            if(el.style.display === 'block') el.style.display = 'none'
        });
        this.asyncGetTeachers(this.state.filter)

    }

    componentDidMount(){
        this.asyncGetTeachers()
    }
    render() {
        let { lang, langNames, teachers, filter } = this.state
        let teacherEls;
        if(teachers){
            teacherEls = teachers.length === 0? <div id="no-result">No results</div> : teachers.map(teacher => {
                return <Teacher showTeacher={this.showTeacher} ID={teacher.ID} photo={teacher.photo} username={teacher.username} nationality={teacher.nationality} teachingLangs={teacher.teachingLangs} KR={teacher.KR} EN={teacher.EN} CN={teacher.CN} DE={teacher.DE} FR={teacher.FR} avr_score={teacher.avr_score} professional={teacher.professional}/>
            })
        }else{
            teacherEls = <Fetching/>
        }
        return (
            <div id="search-teachers"> 
                <div id="filters">
                    <select name="lang" onChange={this.onChangeHandler}>
                        <option value="EN">영어</option>
                        <option value="KR">한국어</option>
                        <option value="CN">중국어</option>
                        <option value="FR">프랑스어</option>
                        <option value="DE">독일어</option>
                        <option value="ALL">ALL</option>                                                
                    </select>
                    <div id="ft-nationality" className="filter non-applied" onClick={(e) =>this.toggleDropDownMenu(e)}>From</div>
                    <div id="ft-avLangs" className="filter non-applied" onClick={(e) =>this.toggleDropDownMenu(e)}>Also speaks</div>
                    <div id="ft-gender" className="filter non-applied" onClick={(e) =>this.toggleDropDownMenu(e)}>Gender</div>
                    <div id="ft-price" className="filter non-applied" onClick={(e) =>this.toggleDropDownMenu(e)}>Price(per 1 hour)</div>
                    <div id="ft-professional" className="filter non-applied" onClick={(e) =>this.toggleDropDownMenu(e)}>Teacher types</div>
                    <div id="search-btn" onClick={this.applyMultipleFilters}>검색</div>
                </div>
                <div className="drop-menu" id="dm-nationality">
                    <input id="na-KR" name="nationality" type="checkbox" value="KR" onClick={this.onChangeHandler}/><label for="na-KR">대한한국</label>
                    <input id="na-EN" name="nationality" type="checkbox" value="US" onClick={this.onChangeHandler}/><label for="na-EN">미국</label>
                    <input id="na-CN" name="nationality" type="checkbox" value="CN" onClick={this.onChangeHandler}/><label for="na-CN">중국</label>
                    <input id="na-FR" name="nationality" type="checkbox" value="FR" onClick={this.onChangeHandler}/><label for="na-FR">프랑스</label>
                    <input id="na-DE" name="nationality" type="checkbox" value="DE" onClick={this.onChangeHandler}/><label for="na-DE">독일</label>
                    <div id="apply-btn-nationality" className="apply-btn" onClick={this.applyOnlyThisFilter}>적용</div>
                </div>
                <div className="drop-menu" id="dm-avLangs">
                    <input id="av-KR" name="avLangs" type="checkbox" value="KR" onClick={this.onChangeHandler}/><label for="av-KR">한국어</label>
                    <input id="av-EN" name="avLangs" type="checkbox" value="EN" onClick={this.onChangeHandler}/><label for="av-EN">영어</label>
                    <input id="av-CN" name="avLangs" type="checkbox" value="CN" onClick={this.onChangeHandler}/><label for="av-CN">중국어</label>
                    <input id="av-FR" name="avLangs" type="checkbox" value="FR" onClick={this.onChangeHandler}/><label for="av-FR">프랑스어</label>
                    <input id="av-DE" name="avLangs" type="checkbox" value="DE" onClick={this.onChangeHandler}/><label for="av-DE">독일어</label>
                    <div id="apply-btn-avLangs" className="apply-btn" onClick={this.applyOnlyThisFilter}>적용</div>
                </div>
                <div className="drop-menu" id="dm-gender">
                    <select name="gender" onChange={this.onChangeHandler}>
                        <option value="ALL">ALL</option>                        
                        <option value="1">여성</option>
                        <option value="0">남성</option>
                    </select>
                    <div id="apply-btn-gender" className="apply-btn" onClick={this.applyOnlyThisFilter}>적용</div>                    
                </div>
                <div className="drop-menu" id="dm-price">
                    <input name="price" type="range" min="0" max="100" onChange={this.onChangeHandler}/>
                    <div id="selectedPrice">{filter.price != null ? '$' + filter.price: '$ 0'}</div>
                    <div id="apply-btn-price" className="apply-btn" onClick={this.applyOnlyThisFilter}>적용</div>                    
                </div>
                <div className="drop-menu" id="dm-professional">
                    <select name="professional"  onChange={this.onChangeHandler}>
                        <option value="ALL">ALL</option>                        
                        <option value="1">전문 강사</option>
                        <option value="0">커뮤니티 강사</option>
                    </select>
                    <div id="apply-btn-professional" className="apply-btn" onClick={this.applyOnlyThisFilter}>적용</div>                    
                </div>
                <div id="teacher-list">
                    {teacherEls}
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    error: state.error
})

const mapDispatchToProps = (dispatch) => ({
    addError: (msg, code) => dispatch(addError(msg, code))
})
export default withRouter( connect(mapStateToProps, mapDispatchToProps) (SearchTeachers));