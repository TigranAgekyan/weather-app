import { motion } from 'motion/react'

const LoadingAnimation = () => {
  return (
    <>
      {Array(3).fill(0).map((_, i) => (
      <motion.span className='font-black inline-block'
        animate={{ y: [0, -7, 0, 0] }}
        transition={{ repeat: Infinity, times: [0, 0.17, 0.33, 1], duration: 2, ease: "easeInOut", delay: i * 0.2 }}
      >.</motion.span>
      ))}
    </>
  );
};

export default LoadingAnimation;