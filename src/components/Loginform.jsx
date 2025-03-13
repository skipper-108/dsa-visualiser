import { motion, useMotionTemplate, useMotionValue, animate } from 'motion/react'
import React, { useEffect } from 'react'

function Loginform() {
  const Colors = ["#DD335C", "#ff5e57", "#e073c5", "#1E67C6", "#CE84CF"];

  const color = useMotionValue(Colors[0]);

  useEffect(() => {
    animate(color, Colors, {
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    })
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%,#020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  return (

    <motion.div style={{backgroundImage }} className='h-[87vh] flex  gap-5 items-center justify-center '>

      <motion.div  className='rounded-2xl flex flex-col justify-center items-center space-y-6 p-4 h-[80%] w-[80%] md:w-[60%] lg:h-[70%] lg:w-[45%] shadow-md shadow-pink-500'>
        <h1 className='text-5xl h-25 md:h-20 md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
          {/* <Code size={48} className='text-purple-500 inline-flex' />  */}
          Login now</h1>
        <form action="" className='flex flex-col w-full relative z-5'>
          <div className='flex flex-col gap-10 justify-center items-center container m-auto w-[90%]  my-5'>
            <motion.input style={{ border}}  type="text" className='h-[2.5rem] font-semibold outline-none shadow shadow-pink-800 text-gray-500 w-full rounded-md p-4' placeholder='👤 Your Name' />
            <motion.input  style={{ border}}  type="email" className='h-[2.5rem] font-semibold outline-none shadow  shadow-pink-800  text-gray-500 w-full rounded-md p-4' placeholder='✉️ Your Email' />
            <motion.input  whileTap={{
              scale: 0.8,
              transition: { duration: 1 },
            }}
              type="submit" value='Login' className=' p-2 rounded-2xl text-white font-semibold text-sm md:text-xl w-[50%] md:w-[30%] shadow-purple-900 shadow-md' />
          </div>
        </form>
      </motion.div>
    </motion.div>

  )
}

export default Loginform