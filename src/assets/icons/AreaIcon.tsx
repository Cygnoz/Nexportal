type AreaIconProps = {
    color?: string;
    width?: number;
    size?:number
  };
  
  const AreaIcon = ({ color, width,size=19 }: AreaIconProps) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color ? color : "currentColor"}
        strokeWidth={width ? width : 1.7}
      >
        <path
          d="M9.49998 5.66699L14.5 3.16699L9.49998 0.666992V9.00033M6.16674 8.99198L1.58341 11.6087C1.45516 11.6813 1.34848 11.7867 1.27427 11.9141C1.20005 12.0415 1.16095 12.1862 1.16095 12.3337C1.16095 12.4811 1.20005 12.6258 1.27427 12.7532C1.34848 12.8806 1.45516 12.986 1.58341 13.0587L8.66674 17.1087C8.92011 17.2549 9.20751 17.3319 9.50007 17.3319C9.79263 17.3319 10.08 17.2549 10.3334 17.1087L17.4167 13.0587C17.545 12.986 17.6517 12.8806 17.7259 12.7532C17.8001 12.6258 17.8392 12.4811 17.8392 12.3337C17.8392 12.1862 17.8001 12.0415 17.7259 11.9141C17.6517 11.7867 17.545 11.6813 17.4167 11.6087L12.8334 9.00032M4.9083 9.70874L14.0916 14.9587M14.0916 9.70874L4.91665 14.9587"
          stroke={color ? color : "#F7E7CE"}
        />
      </svg>
    );
  };
  
  export default AreaIcon;
  