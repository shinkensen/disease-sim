"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { buildArray,runOneFrame, runStats,runMultipleTests} from "./simulation/sim";
import { useEffect, useState } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function Home(){
  const [ret, setRet] = useState<{dataset: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[], iterations: string[]} | null>(null);
  const [run,setRun] = useState(0)
  useEffect(() => {
    const result = runMultipleTests(1,200000);
    setRet(result);
  }, [run]);
  if (!ret) return (<div>Running tests...</div>);
  return (<div>
    <Main auto={true} info={ret}></Main>
    <div style={{textAlign:"center",border:"2px solid white", borderRadius:"10px"}} onClick={()=>{setRun(run+1)}}>
      <h1>Re-Run</h1>
    </div>
  </div>);
}
export function Main({auto, info}:{auto:boolean, info:{dataset: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[],iterations:string[]}}) {
  const [array,setArray] = useState(buildArray({x:0,y:0},11,13));
  let [iteration,setIteration] = useState(["0"]);
  const [data,setData] = useState([1]);
  const run = ()=>{
      let temp = runOneFrame(array);
      setArray(temp);
      let temp2 = data;
      temp2.push(runStats(temp).infected);
      setData(temp2);
      iteration.push("" +(parseInt(iteration[iteration.length-1]) +1));
      setIteration(iteration);
    }
  return (
    <div>
    <div style={{ display: "grid", gap: 8, padding: 16 }}>
      {array.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", gap: 8 }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              aria-label={cell.infected ? "infected" : "safe"}
              title={cell.infected ? "infected" : "safe"}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: cell.infected ? "red" : "green",
              }}
            />
          ))}
        </div>
      ))}
    </div>
    <div style={{textAlign:"center",border:"2px solid white", borderRadius:"10px"}} onClick={run}>
      <h1>Next Frame</h1>
    </div>
    <LineChart labels={auto? info!.iterations! :iteration} data1={data} mode2={auto? info.dataset : undefined}></LineChart>
    </div>
  );
}
const LineChart = ({labels, data1,mode2}:{labels: string[], data1?: number[],mode2?:{ label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[]}) => {
  const data = {
    labels: labels,
    datasets: mode2? mode2 :[
      {
        label: 'Infected',
        data: data1,
        borderColor: 'rgb(212, 30, 30)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Infected vs Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ width: '`00%', margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};