import styles from './index.module.css';
import { use_global_state } from '../../state';
import { useRef, useEffect, useState } from 'react';
import Title from '../Title';
import { Chart as GChart } from 'react-google-charts';
import Chart from 'chart.js'
import { query_api } from '../../data/api_query';


function Map() {

  // const [ chartData, setChartData ] = useState([])
//   const today = new Date()
//   const [ dateSlider, setSlider ] = useState(`${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`)

//   const fetcher = async (httpQuery) => {
//       console.log(httpQuery);
//       return await query_api(httpQuery)
//   }

//   const { data, error } = useSWR(`/api/worldmap?date=${dateSlider}`, fetcher)

//   console.log(data)

    const chartData = [
        [ 'Country', 'Cases per 100.000' ],
        [ 'Germany', 200 ],
        [ 'United States', 300 ],
        [ 'Brazil', 400 ],
        [ 'Canada', 500 ],
        [ 'France', 600 ],
        [ 'RU', 700 ]
    ];

    return (
        <div className={styles.container}>
            <GChart
                chartEvents={[
                    {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart();
                            const selection = chartData.getSelection();
                            if (selection.length === 0) return;
                            const region = chartData[selection[0].row + 1];
                            console.log('Selected : ' + region);
                        }
                    }
                ]}
                chartType="GeoChart"
                width="100%"
                height="400px"
                data={chartData}
            />
        </div>
    );
}

export default Map;
