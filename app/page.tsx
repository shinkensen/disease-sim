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
import { 
  buildArray,
  runOneFrame,
  runStats,
  runMultipleTests,
  setConfigVars,
  getConfigVars
} from "./simulation/sim";
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
export default function Home(){
  const [ret, setRet] = useState<{dataset: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[], iterations: string[]} | null>(null);
  const [run,setRun] = useState(0);
  const [manual,setManual] = useState (false);
  const [tests, setTests] = useState(7);
  const [iterations,setIterations] = useState(12);
  const configs = getConfigVars();
  useEffect(() => {
    const result = runMultipleTests(tests,iterations);
    setRet(result);
  }, [run]);
  if (!ret) return (<div>Running tests...</div>);
  return (<div>
    <Main auto = {false} info={ret}></Main>
    <Main auto={!manual} info={ret}></Main>
    <div style={{textAlign:"center",border:"2px solid white", borderRadius:"10px"}} onClick={()=>{setRun(run +1 %2)}}>
      <h1>Re-Run</h1>
    </div>
    {/*
    <div style={{textAlign:"center",border:"2px solid white", borderRadius:"10px"}} onClick={()=>{setManual(!manual)}}>
      <h1>Mode: {manual ? "manual": "autotest"}</h1>
    </div>
    */}
    <div>
      <h5>Immunity</h5>
      <input placeholder= {"" + configs[0]} onChange={(e)=>{setConfigVars(parseFloat(e.target.value),configs[1],configs[2],configs[3])}}></input>
      <h5>Immunity Chance</h5>
      <input placeholder= {"" + configs[1]} onChange={(e)=>{setConfigVars(configs[0],parseFloat(e.target.value),configs[2],configs[3])}}></input>
      <h5>Cure Chance</h5>
      <input placeholder= {"" + configs[2]} onChange={(e)=>{setConfigVars(configs[0],configs[1],parseFloat(e.target.value),configs[3])}}></input>
      <h5>Infection Chance</h5>
      <input placeholder= {"" + configs[3]} onChange={(e)=>{setConfigVars(configs[0],configs[1],configs[2],parseFloat(e.target.value),)}}></input>
      <h5>Number of Tests</h5>
      <input placeholder= {"" + tests} onChange={(e)=>{setTests(parseInt(e.target.value))}}></input>
      <h5>Iterations</h5>
      <input placeholder= {"" + iterations} onChange={(e)=>{setIterations(parseInt(e.target.value))}}></input>
    </div>
  </div>);
}
export function Main({auto, info}:{auto:boolean,info:{dataset: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[],iterations:string[]}}) {
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
  const option1= (
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
    <LineChart labels={auto? info!.iterations! :iteration} data1={data} mode2={auto? info.dataset : undefined} size={"50%"}></LineChart>
    </div>
  );
  const option2 = (<div>
    <h1 style={{textAlign:"center",marginTop:"50px"}}>AutoTest</h1>
    <LineChart labels={auto? info!.iterations! :iteration} data1={data} mode2={auto? info.dataset : undefined} size={"50%"}></LineChart>
    </div>)
  return auto ? option2 : option1
}
const LineChart = ({labels, size,data1,mode2}:{labels: string[],size:string, data1?: number[],mode2?:{ label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[]}) => {
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
    <div style={{ width: `${size}`, margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};