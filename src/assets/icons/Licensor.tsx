type Props = {
  color?: string;
  width?: number;
  height?:number;
};

const Licensor = ({ color, width = 20, height = 19 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1666 1.66699V5.00033C10.1666 5.44235 10.3422 5.86628 10.6548 6.17884C10.9674 6.4914 11.3913 6.66699 11.8333 6.66699H15.1666M10.1666 10.417L11 15.0003L8.49998 14.167L5.99998 15.0003L6.83331 10.417M11 1.66699H3.49998C3.05795 1.66699 2.63403 1.84259 2.32147 2.15515C2.00891 2.46771 1.83331 2.89163 1.83331 3.33366V16.667C1.83331 17.109 2.00891 17.5329 2.32147 17.8455C2.63403 18.1581 3.05795 18.3337 3.49998 18.3337H13.5C13.942 18.3337 14.3659 18.1581 14.6785 17.8455C14.9911 17.5329 15.1666 17.109 15.1666 16.667V5.83366L11 1.66699ZM11 8.33366C11 9.71437 9.88069 10.8337 8.49998 10.8337C7.11927 10.8337 5.99998 9.71437 5.99998 8.33366C5.99998 6.95295 7.11927 5.83366 8.49998 5.83366C9.88069 5.83366 11 6.95295 11 8.33366Z"
        stroke={color ? color : "#F7E7CE"}
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Licensor;
