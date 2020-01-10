import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncGetStatics } from '../Actions/actionCreators';
import Fetching from '../Components/Fetching';
import './Statics.scss';


////Chart library
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);


class Statics extends React.Component{
    state = {

    }

    componentDidMount () {
        this.props.asyncGetStatics()
    }   

    render() {
        let { chart1Cf, chart2Cf, chart3Cf, chart4Cf} = this.props
        
        if(chart1Cf != null && chart2Cf != null && chart3Cf != null&& chart4Cf != null ){
            return (
                <div id="statics">
                    <div id="title">Understand better about your activity</div>
                    <div id="charts">
                        <div><ReactFC {...chart1Cf}/></div>
                        <div><ReactFC {...chart2Cf}/></div>
                        <div><ReactFC {...chart3Cf}/></div>
                        <div><ReactFC {...chart4Cf}/></div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <Fetching/>
                </div>
            )
        }   
    }
}

const mapStateToProps = (state) => ({
    chart1Cf: state.chartCfs.chart1,
    chart2Cf: state.chartCfs.chart2,
    chart3Cf: state.chartCfs.chart3,
    chart4Cf: state.chartCfs.chart4
    
})

const mapDispatchToProps = (dispatch) => ({
    asyncGetStatics: () => dispatch(asyncGetStatics())
})


export default connect(mapStateToProps, mapDispatchToProps)(Statics) ;