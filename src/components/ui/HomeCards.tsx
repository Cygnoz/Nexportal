interface HomeCardProps {
  icon: React.ReactNode; // Accepts rendered JSX, e.g., <UserIcon color="red" />
  title: string;
  number: any;
  iconFrameColor: string; // Frame background color
  iconFrameBorderColor: string; // Frame border color
  bgColor?:string
  titleColor?:string
  numberColor?:string
  border?:string
}

const HomeCard = ({ icon: Icon, title, number, iconFrameColor, iconFrameBorderColor,bgColor,titleColor,numberColor,border }: HomeCardProps) => {
  return (
    <div className={`flex justify-between items-start w-full  p-4 ${bgColor ? `bg-[${bgColor}]` : 'bg-white'} ${border ? `border border-[${border}]` : ''}   rounded-lg  `}>
    {/* Title and Number */}
    <div>
      <h4 className={`text-sm font-semibold ${titleColor ? `text-[${titleColor}]` : 'text-[#8392A9]'}`}>{title}</h4>
      <p className={`text-[24px] font-bold ${numberColor ? `text-[${numberColor}]` : 'text-gray-900'}`}>{number}</p>
    </div>
      {/* Icon Frame */}
      <div
        className="flex-shrink-0 flex justify-center items-center w-[40px] h-[40px] rounded-lg"
        style={{
          backgroundColor: iconFrameColor,
          border: `3px solid ${iconFrameBorderColor}`,
        }}
      >
        {Icon}
      </div>
    </div>
  );
};
 
export default HomeCard;
 