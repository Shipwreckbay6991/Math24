import {useState, useTransition} from "react";


export const Cards = ()=> {
    const patterns = ["clubs", "diamonds", "hearts", "spades"]
    const initialDeckParams = []
    for(let i = 1; i < 14; i++){
        for(let j = 0; j < 4; j++){
            initialDeckParams.push([i, patterns[j]])
        }
    }
    const [shuffledDeck, setShuffledDeck] = useState(() => shuffleArray(initialDeckParams));
    const [started, setStarted] = useState(false);

    function startGame() {
        setStarted(true);
    }

    const [index, setIndex] = useState(0)
    const [solutionExpr, setSolutionExpr] = useState("")
    const [isPending, startTransition] = useTransition()
    const w = "160"
    const h = "240"
    const handleNextClick = () => {
        setIndex(prevIndex => prevIndex + 4)
        setSolutionExpr("")
    }
    const handleShowSolution = () => {
        startTransition(() => setSolutionExpr(getSolution(shuffledDeck, index)))
    }

    const handleNewGame = () => {
        setShuffledDeck(() => shuffleArray(initialDeckParams))
        setIndex(0)
        setSolutionExpr("")
    }
    return <div>
        {started ? (
            <div>
                <div className={"remaining"}>
                    <h4>Remaining Cards: {52 - index - 4}</h4>
                </div>
                <div className={"container"}>
                    <div className={"flex-item card1"}><img src={`cards/${toCard(shuffledDeck[index])}`} alt=""
                                                            width={w}
                                                            height={h}></img></div>
                    <div className={"flex-item card2"}><img src={`cards/${toCard(shuffledDeck[index + 1])}`} alt=""
                                                            width={w}
                                                            height={h}></img></div>
                    <div className={"flex-item card3"}><img src={`cards/${toCard(shuffledDeck[index + 2])}`} alt=""
                                                            width={w}
                                                            height={h}></img></div>
                    <div className={"flex-item card4"}><img src={`cards/${toCard(shuffledDeck[index + 3])}`} alt=""
                                                            width={w}
                                                            height={h}></img></div>
                </div>
                <div className={"buttons"}>{
                    index < 48? (<button className={"button"} onClick={handleNextClick}>Next</button>) : (<button className={"button"} onClick={handleNewGame}>New Game</button>)
                }
                    <button className={"button"} onClick={handleShowSolution}>Show Solution</button>
                </div>
                <div className={"solution"}>
                    <h3>{isPending && <p> computing... </p>}</h3>
                    <h3>{solutionExpr}</h3>
                </div>
            </div>
        )
            : (
                <div className={"startPage"}>
                    <button className={"button"} onClick={startGame}>Start Game</button>
            </div>
        )}
    </div>

}

const shuffleArray = array => { //The Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

const toCard = ([i, pattern]) => {
    return `English_pattern_${i}_of_${pattern}.svg`
}


const getSolution = (shuffledDeck, index) => {
    const n1 = shuffledDeck[index][0]
    const n2 = shuffledDeck[index + 1][0]
    const n3 = shuffledDeck[index + 2][0]
    const n4 = shuffledDeck[index + 3][0]
    const numbers = [n1, n2, n3, n4]
    const indices = [0, 1, 2, 3]

    const permutations = []
    for (let c1 of indices) {
        let indices1 = indices.filter(t => t !== c1)
        for (let c2 of indices1) {
            let indices2 = indices1.filter(t => t !== c2)
            for (let c3 of indices2) {
                let indices3 = indices2.filter(t => t !== c3)
                for (let c4 of indices3) {
                    for (let o1 = 0; o1 < 4; o1++) {
                        for (let o2 = 0; o2 < 4; o2++) {
                            for (let o3 = 0; o3 < 4; o3++) {
                                for (let p = 0; p < 2; p++) {
                                    permutations.push([numbers[c1],numbers[c2],numbers[c3],numbers[c4],o1,o2,o3,p])
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    for(let perm of permutations){
        if(evaluate(perm) === 24){
            return convert(perm)
        }
    }
    return "No solution"
}




const evaluate = (perm)=>{
    let value = perm[0]
    if(perm[7] === 0){
        for (let i = 0; i < 3; i++) {
            value = calculate(value, perm[i + 1], perm[i + 4])
            console.log(value)
        }
    }
    else{
        let lhs = calculate(value, perm[1], perm[4])
        let rhs = calculate(perm[2], perm[3], perm[6])
        value = calculate(lhs, rhs, perm[5])
        console.log(value)
    }
    return value
}


const calculate = (lhs, rhs, operator)=>{
    switch(operator){
        case 0:
            return lhs + rhs
        case 1:
            return lhs - rhs
        case 2:
            return lhs * rhs
        case 3:
            return lhs / rhs
    }
}

const convert = (perm)=>{
    let value = perm[0]
    if(perm[7] === 0){
        for (let i = 0; i < 3; i++){
            value = convertOperator(value, perm[i+1], perm[i+4])
            console.log(value)
        }

    }
    else{
        let lhs = convertOperator(value, perm[1], perm[4])
        let rhs = convertOperator(perm[2], perm[3], perm[6])
        value = convertOperator(lhs, rhs, perm[5])
        console.log(value)
    }
    return value + " = 24"
}

const convertOperator = (lhs, rhs, operator)=>{
    switch(operator){
        case 0:
            return "(" + lhs + " + " + rhs + ")"
        case 1:
            return "(" + lhs + " - " + rhs + ")"
        case 2:
            return "(" + lhs + " * " + rhs + ")"
        case 3:
            return "(" + lhs + " / " + rhs + ")"
        default:
            return "Well, a mistake has happened..."
    }
}
