

type person = {
    infected: boolean,
    immune:number
}
type r4 ={
    r1: boolean,
    r2:boolean,
    r3:boolean,
    r4:boolean
}
type r3 ={
    r1: boolean,
    r2:boolean,
    r3:boolean,
}
type r2 ={
    r1: boolean,
    r2:boolean,
}
const immunity =1;
const immunityChance = 0.85;
const curePercent = 0.9;
const infectionPercent = 0.7;
export function buildArray(infectedCoords:{x:number,y:number},rows:number,cols:number){
    const ret= [];
    for (let i=0;i<rows;i++){
        const temp = [];
        for (let j=0;j<cols;j++){
            if (infectedCoords.x != i || infectedCoords.y!= j ){
                temp.push({infected:false , immune:0} as person);
            }
            else{
                temp.push({infected:true,immune:immunity} as person);
            }
        }
        ret.push(temp);
    }
    return ret;
}


export function interaction(array:person[][],x1:number,y1:number,x2:number,y2:number){
    return array[x1][y1].infected && Math.random()<.7;
}

export function runInteractionsForASquare(array:person[][],x1:number,y1:number){
    const conditions:r4 = {
        r1: x1 > 0,
        r2: x1 < array.length - 1,
        r3:y1 > 0,
        r4: y1!=array[0].length -1
    }
    let count =0;
    const conditionKeys: (keyof r4)[] = ["r1", "r2", "r3", "r4"];
    for (const key of conditionKeys){
        if (conditions[key]){
            count++;
        }
    }
    let results= [
            conditions.r1? {status: interaction(array,x1,y1,x1-1,y1), coords:{x: x1-1, y: y1}} :{status:false},
            conditions.r2? {status: interaction(array,x1,y1,x1+1,y1), coords:{x: x1+1, y: y1}} :{status:false},
            conditions.r3? {status: interaction(array,x1,y1,x1,y1-1), coords:{x: x1, y: y1-1}} :{status:false},
            conditions.r4? {status: interaction(array,x1,y1,x1,y1+1), coords:{x: x1, y: y1+1}} :{status:false}
    ];
    return results;
}
export function runOneFrame(stateArray:person[][]){
    if (runStats(stateArray).infected ==0){
        return stateArray;
    }
    const future = buildArray({x:-1,y:-1},stateArray.length,stateArray[0].length);
    for (let i=0;i<future.length;i++){
        for (let j=0;j<future[0].length;j++){
            future[i][j].immune = stateArray[i][j].immune;
            future[i][j].infected = stateArray[i][j].infected ? Math.random() <1-curePercent : false;
        }
    }
    for (let i=0;i<stateArray.length;i++){
        for (let j=0;j<stateArray[0].length;j++){
            const res = runInteractionsForASquare(stateArray,i,j);
            res.forEach((value)=>{
                if (value.status && stateArray[value.coords!.x][value.coords!.y].immune == 0){
                    future[value.coords!.x][value.coords!.y] = {infected:true,immune:immunity};
                }
                else if (value.status){
                    future[value.coords!.x][value.coords!.y] = {infected:false,immune: Math.random() <immunityChance ? stateArray[value.coords!.x][value.coords!.y].immune -1 :stateArray[value.coords!.x][value.coords!.y].immune };
                }
            })
        }
    }
    return future;
}
export function runStats(stateArray:person[][]){
    let count =0;
    stateArray.forEach((value)=>{value.forEach((value)=>{if (value.infected) count++;})});
    return {infected: count, safe: (stateArray.length * stateArray[0].length) - count};
}
export function runTest(rounds:number){
    let array =buildArray({x:0,y:0},10,10)
    let data = [1];
    console.log(array);
    const run = ()=>{
        array= runOneFrame(array);
        data.push(runStats(array).infected);
    }
    for (let i=0;i<rounds;i++){
        run();
    }
    return data;
}
export function runMultipleTests(tests:number,rounds:number){
    let dataset = [];
    let iterations = ["0"];
    for (let i=0;i<rounds;i++){
        iterations.push(`${i+1}`);
    }
    for (let i=0;i<tests;i++){
        let data = runTest(rounds);
        dataset.push(
            {
                label: `Test ${i}`,
                data,
                borderColor: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0,
            }
        )
    }
    return {dataset,iterations}
}