
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {} from '../Actions/actionCreators';

class extends React.Component{
    state = {

    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

const  = (props) => {
    return(
        <div>

        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})


export default ;







//Pages with no protected rsc; handle network error
if(this.props.error.code === 'Net1'){
    alert('네트워크 장애가 발생하였습니다. 다시 접속해주십시오.')
    this.props.deleteError()
}

//Pages with protected rsc; handle network error & session(tokens) expiration
if(this.props.error.code === 'Net1'){
    alert('네트워크 장애가 발생하였습니다. 다시 접속해주십시오.')
    this.props.deleteError()
}else if(this.props.error.code === 403){
    this.props.history.push('/login')
    this.props.deleteError()    
}