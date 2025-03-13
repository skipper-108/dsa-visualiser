import { motion } from "motion/react";
import Controller from "./Controller";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { PanelLeft } from "lucide-react";
import RenderBars from './RenderBars';
import handleAlgorithm from "./handleAlgorithm";
import Pseudocode from "./Pseudocode";

function Visualizer({ algorithm, setAlgorithm}) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [arr, setArr] = useState([76, 89, 35, 57, 79, 97, 75, 53, 31, 47, 70, 52]);
    const [input, setInput] = useState("");
    const [speed, setSpeed] = useState(200);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [raceMode, setRaceMode] = useState(false);
    const [raceSteps, setRaceSteps] = useState({});
    const [raceCurrentSteps, setRaceCurrentSteps] = useState({});
    const [winner,setWinner] = useState(null);
    const [searchTarget,setSearchTarget] = useState(null);
    const [algorithmType,setAlgorithmType] = useState("sorting");

    useEffect(() => {
        if (algorithm.length > 0) {
            if (raceMode) {
                handleAlgorithm.initializeRaceMode(arr, algorithm, setRaceSteps, setRaceCurrentSteps, setIsPlaying,searchTarget);
            } else {
                handleAlgorithm.initializeSteps(arr, algorithm[0], setSteps, setCurrentStep, setIsPlaying,searchTarget);
            }
        };
    }, [arr, algorithm, raceMode,searchTarget]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            if (raceMode) {
                setRaceCurrentSteps((prev) => {
                    const newSteps = { ...prev };
                    let allDone = true;
                    let fastestAlgo = null;
                    let minSteps = Infinity;
                    algorithm.forEach((algo) => {
                        const maxSteps = (raceSteps[algo]?.length || 0) - 1;
                        if (maxSteps >= 0 && newSteps[algo] < maxSteps) {
                            newSteps[algo] += 1;
                            allDone = false;
                        }
                        if(newSteps[algo]>=maxSteps&&maxSteps<minSteps){
                            minSteps = maxSteps;
                            fastestAlgo = algo;
                        }
                    });
                    if (allDone){
                        setIsPlaying(false);
                        setWinner(fastestAlgo);
                    }
                    return newSteps;
                });
            } else {
                if (currentStep < steps.length - 1) {
                    setCurrentStep((prev) => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }
        }, [speed]);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps, raceMode, raceSteps, algorithm, speed]);

    return (
        <div className="relative md:max-w-[95vw] container m-auto lg:container lg:m-auto">
            <motion.div
                initial={false}
                animate={{
                    width: showSidebar ? "28.5%" : "0px", opacity: showSidebar ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-9 text-[12px] md:top-0 left-0 z-15 h-full rounded-2xl [&::-webkit-scrollbar]:hidden border-l-2 border-r-2 border-pink-500 home bg-gray-950 overflow-auto p-4"
            >
                <Sidebar algorithm={algorithm} algorithmType={algorithmType} setAlgorithmType={setAlgorithmType} setAlgorithm={setAlgorithm} raceMode={raceMode} setRaceMode={setRaceMode} />
            </motion.div>

            <div className="flex flex-col-reverse md:flex-row h-full md:h-[84vh]  md:mt-1 md:mb-3 lg:mt-4 gap-2">
                <div className="border-r-2 mb-14 md:mb-0 rounded-2xl shadow-[0px_0px_10px_inset] md:shadow-[0px_0px_20px_inset] shadow-pink-700 md:w-[40%]">
                    <Controller
                        input={input}
                        setInput={setInput}
                        speed={speed}
                        setSpeed={setSpeed}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        steps={steps}
                        algorithm={algorithm}
                        handleInput={() => handleAlgorithm.handleInput(input, setArr, algorithm, setSteps, setCurrentStep, setIsPlaying,)}
                        raceMode={raceMode}
                        setRaceMode={setRaceMode}
                        raceCurrentSteps={raceCurrentSteps}
                        setRaceCurrentSteps={setRaceCurrentSteps}
                        raceSteps={raceSteps}
                        winner={winner}
                        searchTarget={searchTarget}
                        setSearchTarget={setSearchTarget}
                        algorithmType={algorithmType}
                    />
                    {!raceMode && algorithm.length > 0 && (
                        <Pseudocode algorithm={algorithm[0]} />
                    )}
                </div>
                <div className="w-full shadow-[0px_0px_10px_inset] md:shadow-[0px_0px_20px_inset] shadow-pink-700  md:h-full border-t-2 border-b-2  border-pink-900 rounded-2xl">
                    <div className="flex p-2 items-center justify-between">
                        <button className="cursor-pointer font-semibold text-center inline-flex text-sm text-white" onClick={() => setShowSidebar(!showSidebar)}>
                            <PanelLeft /> &nbsp; Select algorithms
                        </button>
                        <h2 className="text-[9px] sm:text-[15px] font-bold text-blue-500 shadow rounded-md p-1  shadow-[#a63deac8]">
                            Selected Algorithm : {algorithm.length > 0 ? <strong className="text-[#a3ff12]"> {algorithm.join(", ")}</strong> : <strong className="text-red-600">None</strong>}
                        </h2>
                    </div>
                    <div>
                        {raceMode ? (
                            <div className={`flex md:mt-10 lg:mt-5 md:flex-row ${algorithm.length == 2 ? "flex-row" : "flex-col"} text-white gap-1 m-1 md:gap-2`}>
                                {algorithm.map((algo) => (
                                    <div key={algo} className="border p-2 rounded-2xl border-gray-300">
                                        <h3 className={`text-sm md:text-md lg:text-xl md:text-center`}>
                                            {algo}
                                        </h3>
                                        <RenderBars arr={arr} steps={raceSteps[algo] || []} currentStep={raceCurrentSteps[algo] || 0} raceMode={raceMode} algorithm={algorithm} searchTarget={searchTarget} algorithmType={algorithmType} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <RenderBars arr={arr} steps={steps} currentStep={currentStep} raceMode={raceMode} algorithm={algorithm} searchTarget={searchTarget} algorithmType={algorithmType}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Visualizer
