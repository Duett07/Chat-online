import { isToday, isYesterday } from "./formatTime";

const DateDivider = ({ date }: { date: string }) => {
  let label = "";

  if (isToday(date)) label = "Hôm nay";
  else if (isYesterday(date)) label = "Hôm qua";
  else label = new Date(date).toLocaleDateString("vi-VN");

  return (
    <div className="flex justify-center">
      <p className="bg-[#d0d0d0] text-white px-6 py-1 rounded-2xl text-xs">
        {label}
      </p>
    </div>
  );
};

export default DateDivider;
