
type Props = {
    size?:number;
    color?:string;
}

const UserRoundCheckIcon = ({size=16, color}: Props) => {
  return (
<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.3335 14C1.33344 12.9735 1.62959 11.9689 2.18639 11.1066C2.7432 10.2443 3.53701 9.56095 4.47256 9.13865C5.40811 8.71634 6.44565 8.57297 7.46067 8.72575C8.47568 8.87854 9.42505 9.32097 10.1948 9.99997M10.6668 12.6667L12.0002 14L14.6668 11.3333M10.0002 5.33333C10.0002 7.17428 8.50778 8.66667 6.66683 8.66667C4.82588 8.66667 3.3335 7.17428 3.3335 5.33333C3.3335 3.49238 4.82588 2 6.66683 2C8.50778 2 10.0002 3.49238 10.0002 5.33333Z" 
stroke={color?color:"#FFF4B6"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  )
}

export default UserRoundCheckIcon