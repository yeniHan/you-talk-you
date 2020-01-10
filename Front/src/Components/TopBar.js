import React from 'react';
import { withRouter } from 'react-router-dom';
import TopBarHome from './TopBarHome';
import TopBarLS from './TopBarLS';
import TopBarDash from './TopBarDash';




const TopBar = (props) => {

    let tbID; 
    let { pathname } = props.history.location
  
    if(pathname === '/'){
      tbID = 'top-bar__home'
    }else if(pathname === '/login'|| pathname === '/signup'){
      tbID = 'top-bar__ls'
    }else{
      tbID = 'top-bar__else'
    }
    
    if(tbID === 'top-bar__home'){
        
        return (
            <div>
                <TopBarHome/>
            </div>
        )
    
    }else if(tbID === 'top-bar__ls'){
        let btName  = props.history.location.pathname === '/login'? '등록': '로그인'
        
        return (
            <div>
                <TopBarLS btName={btName}/>
            </div>
        )

    }
    else {
        return(
            <div>
                <TopBarDash/>
            </div>
        )
    }

}

export default withRouter(TopBar);