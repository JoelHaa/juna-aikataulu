import React, { useEffect, useState } from 'react'
import axios from 'axios'

function FetchData() {
    const currentTime = new Date()
    console.log(currentTime)
    const [trainSchedule, setTrainSchedule] = useState([])
    useEffect(() => {
        /*
            This api call should return the next 10 arrving trains to the station Valimo (VMO),
            however it actually returns the first 10 arrived trains of the day. I tried also fetching
            every train of the day and then filtering out the next 10 arrving trains by comparing the
            current time with the scheduledtime, however the scheduledTime variable is in the nested array
            'timeTableRows' so I'm not entirely sure about how to map that into my table. I also tried parsing
            the dates with Date.parse() and then filtering out the trains that had already departed VMO, but
            that didn't work.
         */
        axios.get('https://rata.digitraffic.fi/api/v1/live-trains/station/VMO?arriving_trains=5')
        .then(res => setTrainSchedule(res.data))
        .then (console.log(trainSchedule))
        .catch(err => console.log(err))
    },[])

    return (
        <div style={{backgroundColor: "offwhite"}} className='container'>
            <div className='mt-3'>
                <h3>Valimon (VMO) seuraavan 10 pysähtyvän junan aikataulut</h3>
                <table className='table'>
                    <tbody >
                                            
                        {
                        trainSchedule.filter((train) => train.trainCategory === 'Commuter')
                        
                        
                        .map((train, index) => {
                                return <tr key={index}>
                                    <th style={{border: "1px solid black", backgroundColor: "lightblue"}}>Juna:{train.trainNumber}</th>
                                     {/* 
                                        Here we filter out the departure timetablerows, since it's
                                        always just 30 seconds after the arrival, so not really
                                        useful information in our timetable 
                                        
                                        furthermore, in the future we should parse the date out of the scheduledTime rows,
                                        so that it would only show the time in the format of HH:MM
                                    */}
                                    {train.timeTableRows.filter((row) => row.type === 'DEPARTURE')
                                    .map((timeTableRow, innerIndex) => (
                                        <React.Fragment key={innerIndex}>
                                            <td style={{border: "1px solid black", backgroundColor: "lightcyan"}}>{timeTableRow.stationShortCode}</td>
                                            <td style={{border: "1px solid black", backgroundColor: "lightyellow"}}>{timeTableRow.scheduledTime}</td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                        })}
                                
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FetchData