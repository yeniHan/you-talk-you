import { SUCCESS_GET_STATICS } from "../../Actions/ActionTypes";
import * as ActionTypes from '../../Actions/ActionTypes';

const initialState = {
    chart1: null,
    chart2: null,
    chart3: null,
    chart4: null
}

const trendlinesCf =  {
        "color": "#29C3BE",
        "displayvalue": "Average",
        "valueOnRight": "1",
        "thickness": "2"
        }
const configForm = {
    chart1: {
        type: 'line',
        width: '450',
        height: '340',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "theme": "fusion",
                "caption": 'Lesson numbers of the past 5 months',
                "subCaption": null,
                "xAxisName": 'Month',
                "yAxisName": 'Lesson number',
                "lineThickness": "2"
            },
            "data": null
        }
    },
    chart2: {
        type: 'column2d',// The chart type
        width: '450', // Width of the chart
        height: '340', // Height of the chart
        dataFormat: 'json', // Data type
        dataSource: {
            "chart": {
            "caption": 'Lesson numbers of the 5 most popular courses',
            "subCaption": null,
            "xAxisName": 'Coursename',
            "yAxisName": 'Lesson number',
            "numberSuffix": null,
            "theme": "fusion",
            },
            "data": null
        }
    },
    chart3: {
        type: 'pie2d',
        width: '450',
        height: '340',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": 'Student numbers by nationality',
                "subCaption": null,
                "numberSuffix": 'students',
                "showPercentValues": "1",
                "decimals": "1",
                "useDataPlotColorForLabels": "1",
                "theme": "fusion"
            },
            "data": null
        }
    }, chart4: {
        type: 'line',
        width: '450',
        height: '340',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "theme": "fusion",
                "caption": 'Average review scores of the past 5 months',
                "subCaption": null,
                "xAxisName": 'Month',
                "yAxisName": 'Score',
                "lineThickness": "2"
            },
            "data": null,
            "trendlines": [{
                "line": [{
                    "color": "#29C3BE",
                    "displayvalue": "Average",
                    "valueOnRight": "1",
                    "thickness": "2"
                    }]
            }]
        }
    }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];


const chartCfs = (state = initialState, action) => {
    switch(action.type){
        case ActionTypes.SUCCESS_GET_STATICS:
            //action.statics'll {char1: ... , chart2: ..., chart3:..., chart4:...}

            // char1: [[monthVal, lessonsNum],* 5]
            let {chart1, chart2, chart3, chart4} = action.statics
            let chart1Dt = chart1.map(mNlessNum => {
                return { "label": monthNames[mNlessNum[0] - 1], "value": mNlessNum[1]}
            })
            
            // chart2: [{ID:.. , coursename:..., lessNum: ...}, {..}, ...]
            let chart2Dt = chart2.map(crsInfo => {
                return {"label": crsInfo.coursename, "value": crsInfo.lessNum}
            })
            // chart3: {KR:.. , US: ..., ... }
            let chart3Dt = Object.keys(chart3).map(nt =>{
                return { "label": nt , "value": chart3[nt] }
            })
            // chart4 : [[monthVal, avScore], * 5 ]
            let num = chart4.length
            let sum = 0
            let chart4Dt = chart4.map( mNAv => {
                sum +=  parseFloat(mNAv[1])
                return { "label": monthNames[mNAv[0] -1] , "value": mNAv[1] }
            })
            
            

            return Object.assign({}, state, {
                chart1: {...configForm.chart1, dataSource: { ...configForm.chart1.dataSource, "data": chart1Dt}},
                chart2: {...configForm.chart2, dataSource: { ...configForm.chart2.dataSource, "data": chart2Dt}},
                chart3: {...configForm.chart3, dataSource: { ...configForm.chart3.dataSource, "data": chart3Dt}},
                chart4: {...configForm.chart4, dataSource: { ...configForm.chart4.dataSource, "data": chart4Dt, "trendlines": [{"line":[{...trendlinesCf,  startvalue: parseFloat(sum/num).toFixed(2),
                endValue: ""}]}]}},
                // hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 

        default :
            return state
    }
}


// const getValTsFromHasNewMsg = (str) => {
//     let valNts = str.split('_')
//     let val = valNts[0] ==='true'? true: false
//     return {
//         val: val,
//         ts: parseInt(valNts[1])
//     }
// }


export default chartCfs;