import React from "react";
import RainyBG from './assets/wp8997310-1404774826.jpg'
import WeatherCard from "./components/WeatherCard";

const App = () => {
  
  const [cityName, setCityName] = React.useState<string>("Tel-Aviv");
  
return (
    <div className='flex flex-col w-screen h-screen place-content-center items-center bg-stone-300 p-16 gap-8'>
      <img src={ RainyBG } className="absolute h-full z-0" />
      <div className="z-10 flex flex-col w-full h-full place-content-center items-center gap-8 text-stone-100">
        <input type='search' placeholder='Search Cities' className='text-center px-1 py-2 rounded-full focus:outline-none glass drop-shadow-lg font-semibold'/>
        <div className='w-full h-full flex flex-row justify-between items-center rounded-2xl drop-shadow-2xl glass p-8 gap-8'>
          <WeatherCard day={"1"} rainChance={50} temperature={26} today={true} />
          {
            Array(4).fill(0).map((_, i) => (
              <WeatherCard key={i} day={"" + (i+2)} rainChance={100} temperature={40} today={false}/>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default App;
