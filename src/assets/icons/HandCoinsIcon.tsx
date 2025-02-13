
type Props = {
    size?:number,
    color?:string
};

function HandCoinsIcon({size,color}: Props) {
  return (
    <>
 
 <svg width={size} height={size} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="34" height="34" rx="8" fill="#1A9CF9"/>
<rect x="1.5" y="1.5" width="31" height="31" rx="6.5" stroke={color} stroke-opacity="0.8" stroke-width="3"/>
<g clip-path="url(#clip0_15105_16301)">
<path d="M16.25 19.25H17.75C18.1478 19.25 18.5294 19.092 18.8107 18.8107C19.092 18.5294 19.25 18.1478 19.25 17.75C19.25 17.3522 19.092 16.9706 18.8107 16.6893C18.5294 16.408 18.1478 16.25 17.75 16.25H15.5C15.05 16.25 14.675 16.4 14.45 16.7L10.25 20.75M13.25 23.75L14.45 22.7C14.675 22.4 15.05 22.25 15.5 22.25H18.5C19.325 22.25 20.075 21.95 20.6 21.35L24.05 18.05C24.3394 17.7765 24.5083 17.3992 24.5196 17.0012C24.5308 16.6032 24.3835 16.2169 24.11 15.9275C23.8365 15.6381 23.4592 15.4692 23.0612 15.4579C22.6631 15.4467 22.2769 15.594 21.9875 15.8675L18.8375 18.7925M9.5 20L14 24.5M22.1751 14.7501C22.1751 15.9513 21.2013 16.9251 20.0001 16.9251C18.7989 16.9251 17.8251 15.9513 17.8251 14.7501C17.8251 13.5489 18.7989 12.5751 20.0001 12.5751C21.2013 12.5751 22.1751 13.5489 22.1751 14.7501ZM14.75 11.75C14.75 12.9926 13.7426 14 12.5 14C11.2574 14 10.25 12.9926 10.25 11.75C10.25 10.5074 11.2574 9.5 12.5 9.5C13.7426 9.5 14.75 10.5074 14.75 11.75Z" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_15105_16301">
<rect width="18" height="18" fill="white" transform="translate(8 8)"/>
</clipPath>
</defs>
</svg>



    </>
  );
}

export default HandCoinsIcon;
