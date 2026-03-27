import React from "react";
import RainyBG from './assets/wp8997310-1404774826.jpg'

const App = () => {
  return (
    <div className='flex flex-col w-screen h-screen place-content-center items-center bg-stone-300 p-16 gap-8'>
      <img src={ RainyBG } className="absolute h-full z-0" />
      <div className="z-10 flex flex-col w-full h-full place-content-center items-center gap-8">
        <input type='search' placeholder='Search Cities' className='text-center px-1 py-2 rounded-full focus:outline-none glass drop-shadow-lg'/>
        <div className='w-full h-full flex flex-row place-content-center items-center rounded-2xl drop-shadow-2xl glass'>
          <div className="flex flex-col items-center">
            <span className="text-4xl">City Name</span>
            <span>Chance of Rain</span>
            <span className="text-5xl ">00°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
