import type { FC } from 'react';

interface WeatherCardProps {
  day: string;
  rainChance: number;
  temperature: number;
  today: boolean;
}

const styleStates = [
  "bg-cyan-800/10 backdrop-blur-2xl border-stone-500 border h-full",
  "bg-stone-100/10 backdrop-blur-2xl border-stone-500 border h-[90%]"
]

const WeatherCard: FC<WeatherCardProps> = ({ day, rainChance, temperature, today}) => {
  return (
    <div className={`flex flex-col justify-evenly items-center glass-inner rounded-xl p-8 gap-4 drop-shadow-xl ${today ? styleStates[0] : styleStates[1]}`}>
      <span className="text-4xl font-semibold"> {day} </span>
      <span>Rain Chance: {rainChance} </span>
      <span className="text-5xl font-semibold"> {temperature} °</span>
    </div>
  );
};

export default WeatherCard;