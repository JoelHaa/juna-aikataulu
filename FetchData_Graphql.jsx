import React from "react";
import { useQuery } from "react-query";
/*
    Same issue as with the static api, you'd think that 'arrvingTrains'
    query would limit the data to trains that have yet to arrive at the station,
    but it doesn't. Furthermore in this graphql query there is no parameter
    for indicating whether a column in the timeTableRows indicates an
    'arrival' or a 'departure'. And so the static api offers the cleaner
    solution.
*/
const endpoint = "https://rata.digitraffic.fi/api/v2/graphql/graphql";
const trainScheduleQuery = `
  {
  trainsByStationAndQuantity(station: "VMO", arrivingTrains: 5) {
    trainNumber
    timeTableRows {
      scheduledTime
      station {
        name
      }
    }
  }
}
`;

export default function FetchData() {
  const { data, isLoading, error } = useQuery("launches", () => {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trainScheduleQuery })
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Error fetching data");
        } else {
          return response.json();
        }
      })
      .then((data) => data.data);
  });

  if (isLoading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  return (
    <div style={{backgroundColor: "offwhite"}}>
      <h3>Valimon (VMO) seuraavan 10 pysähtyvän junan aikataulut</h3>
      <table>
        <tbody>
            {data.trainsByStationAndQuantity.map((train) => (
                <tr key={train.id}>
                    <th style={{border: "1px solid black", backgroundColor: "lightblue"}}>Juna:{train.trainNumber}</th>
                    {train.timeTableRows.map((timeTableRow) => (
                        <React.Fragment key={timeTableRow.id}>
                            <td style={{border: "1px solid black", backgroundColor: "lightcyan"}}>{timeTableRow.station.name}</td>
                            <td style={{border: "1px solid black", backgroundColor: "lightyellow"}}>{timeTableRow.scheduledTime}</td>
                        </React.Fragment>
                    ))}
                </tr>
            ))}
        </tbody>
      </table>
      <ul>
        
      </ul>
    </div>
  );
}