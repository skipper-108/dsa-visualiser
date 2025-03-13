import { Play, Pause, UndoDot, RedoDot, RotateCcw, LayoutDashboard,X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

function Controller({ input, setInput, speed, setSpeed, isPlaying, setIsPlaying, currentStep, setCurrentStep, steps, algorithm, handleInput, raceMode, raceCurrentSteps, setRaceCurrentSteps, raceSteps,winner,searchTarget,setSearchTarget,algorithmType }) {

  const [showLeaderboard, setShowLeaderboard] = useState(false); 

  const handleNewInput = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      alert('Please enter the array in input field first!');
      return;
    }
    setCurrentStep(0);
    setRaceCurrentSteps({});
    setIsPlaying(false);
    handleInput();
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-col'>
        <label htmlFor="input" className='font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 '>Enter the Input:</label>
        <input
          type="text"
          id='input'
          value={input}
          placeholder='Eg. 1 2 3'
          className='w-[80%] rounded-md p-2 outline-none text-pink-700 font-semibold shadow shadow-pink-900'
          onChange={(e) => setInput(e.target.value)}
        />
          {
               algorithmType === "searching" && (
                        <div className='mt-4'>
                            <label htmlFor="searchTarget" className='font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
                                Search Target:
                            </label>
                            <input
                                type="number"
                                id='searchTarget'
                                value={searchTarget || ''}
                                placeholder='Enter the number to search'
                                className='w-[80%] rounded-md p-2 outline-none text-pink-700 font-semibold shadow shadow-pink-900'
                                onChange={(e) => setSearchTarget(Number(e.target.value))}
                            />
                        </div>
                    )
                }
        <button className='p-2 mt-2 border border-blue-500 bg-blue-500 text-white active:bg-blue-600 rounded-md cursor-pointer' onClick={handleNewInput}>Apply</button>
      </div>

      <div className='flex items-center'>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className='w-[50%] h-5 bg-gray-300 appearance-none cursor-pointer rounded-md 
          [&::-webkit-slider-thumb]:appearance-none
           [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-5 
           [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-xl
          [&::-webkit-slider-thumb]:border-1 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow-lg'
        />
        <label className='ml-2 text-amber-400'>{speed} ms</label>
      </div>

      <div className='flex gap-4 justify-center'>
        <button onClick={() => {
          if (algorithm.length === 0) {
            alert('Please first select the algorithm!');
            return;
          }
          if (!raceMode && steps.length === 0 && !isPlaying) {
            alert("Please apply an input array first!");
            return;
          }
      if(algorithmType === "searching" && searchTarget === null){
          alert("please enter a search target!🎯")
            return
            }
          setIsPlaying(!isPlaying);
        }}
          disabled={isPlaying && (!raceMode ? steps.length === 0 : Object.keys(raceCurrentSteps).length === 0)}
        >
          {
            isPlaying ? <Pause className='size-10 text-red-400 cursor-pointer' /> : <Play className='size-10 text-green-400 cursor-pointer' />
          }
        </button>

        <button onClick={() => {
          if (algorithm.length === 0) {
            alert('Please first select the algorithm!');
            return;
          }
          if (raceMode) {
            setRaceCurrentSteps((prev) => {
              const newSteps = { ...prev };
              Object.keys(newSteps).forEach((algo) => {
                newSteps[algo] = Math.max(0, newSteps[algo] - 1);
              });
              return newSteps;
            });
          }
          else {
            setCurrentStep((prev) => Math.max(0, prev - 1));
          }
        }}
          disabled={isPlaying || (!raceMode ? currentStep === 0 : Object.keys(raceCurrentSteps).every((step) => step === 0))}>
          <UndoDot className='size-10 active:text-purple-500 text-purple-400 cursor-pointer' />
        </button>

        <button onClick={() => {
          if (algorithm.length === 0) {
            alert('Please first select the algorithm!');
            return;
          }
          if (raceMode) {
            setRaceCurrentSteps((prev) => {
              const newSteps = { ...prev };
              Object.keys(newSteps).forEach((algo) => {
                newSteps[algo] = Math.min((raceSteps[algo]?.length || 1) - 1, newSteps[algo] + 1);
              });
              return newSteps;
            });
          }
          else {
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
          }
        }}
          disabled={isPlaying || (!raceMode ? currentStep === steps.length - 1 : Object.entries(raceCurrentSteps).every(([algo, step]) => step === (raceSteps[algo]?.length || 1) - 1))}>
          <RedoDot className='size-10 active:text-purple-500 text-purple-400 cursor-pointer' />
        </button>

        <button onClick={() => {
          setIsPlaying(false);
          if (raceMode) {
            setRaceCurrentSteps((prev) => {
              const resetSteps = {};
              Object.keys(prev).forEach((algo) => {
                resetSteps[algo] = 0;
              });
              return resetSteps;
            })
          }
          else {
            setCurrentStep(0);
          }
        }
        }>
          <RotateCcw className='size-10 text-pink-400 active:text-pink-500 cursor-pointer' />
        </button>
      </div>
      {winner && raceMode && <motion.button whileTap={{scale:0.5}}  dragConstraints={{top:-190, bottom:250, left:-320, right:0}} drag onClick={() => setShowLeaderboard(!showLeaderboard)} className="shadow-2xl shadow-yellow-200 bg-white md:hidden rounded-full pr-6 fixed top-60 z-15 right-6 h-15 w-15">
        {showLeaderboard?<X className='h-10 w-10 ml-2'/>:<LayoutDashboard className='h-10 w-10 ml-2' />}
      </motion.button>}
      {
        winner && raceMode && (
          <motion.div
            initial={false}
            animate={{ y: showLeaderboard ? 450 : 0 }}
            transition={{ duration: 0.7, ease: 'anticipate' }}
            className='mt-20 fixed md:relative bg-[#3c0318f1] backdrop-blur-2xl md:bg-transparent w-[90%] top-[-60%] md:top-0 md:w-[100%] z-5 rounded-lg lg:mt-5'>
              {
                <div className='shadow-gray-400 shadow-md p-2 rounded-lg text-white w-[100%]'>
                    <h2 className='text-2xl md:text-xl font-bold mb-2'>🏆Leaderboard</h2>
                    {
                      winner && (
                        <div className='shadow-md shadow-purple-300 text-white md:text-[12px] lg:text-[95%] p-2 rounded-lg text-center mb-2 font-bold'>
                          Winner : <strong className='text-green-500 font-extrabold'>🥇{winner}</strong>
                        </div>
                      )
                    }
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b'>
                          <th className='text-left p-1'>Algorithms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          algorithm.map((algo)=>(
                            <tr key={algo} className={`border-t ${algo===winner?"bg-green-600 font-semibold  text-white":""}`}>
                                <td className={`${algorithm.length<=3?"py-4 px-2 text-[0.8rem] md:text-[0.8rem]":"md:text-[0.8rem]"} md:p-2 lg:p-[0.6rem]`}>
                                  {algo}
                                </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                </div>
              }

          </motion.div>
        )
      }
    </div>
  );
}

export default Controller;
