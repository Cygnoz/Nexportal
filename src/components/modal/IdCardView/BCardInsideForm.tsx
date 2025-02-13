// import EmailIcon from "../../../assets/icons/EmailIcon";
// import LocationIcon from "../../../assets/icons/LocationIcon";
// import PhoneIcon from "../../../assets/icons/PhoneIcon";
// import cygnoz from '../../../assets/image/cygnoz.com.png';
// import profile from '../../../assets/image/AvatarImg.png';
// import previewFront from '../../../assets/image/preview-card-front.png'
// import previewBack from '../../../assets/image/preview-card-back.png'
import { Layout1Back, Layout1Front, Layout2Back, Layout2Front, Layout3Back, Layout3Front } from "../../ui/BSLayout";
import { useRegularApi } from "../../../context/ApiContext";
import { useEffect } from "react";

type Props = {
    onClose: () => void; // Prop for handling modal close
    role:any;
    staffData:any;
}

const BCardInsideForm = ({ onClose, role, staffData }: Props) => {

    const {businessCardData,refreshContext}=useRegularApi()
    useEffect(()=>{
        refreshContext({businessCard:true})
    },[])
    interface LayoutProps {
        toggleState?: Record<string, boolean>;
        role?: any;
        staffData?: any;
    }
    const layoutComponents: Record<
        any,
        { Front: React.FC<LayoutProps>; Back: React.FC<LayoutProps> }
    > = {
        Layout1: {
            Front: Layout1Front,
            Back: Layout1Back,
        },
        Layout2: {
            Front: Layout2Front,
            Back: Layout2Back,
        },
        Layout3: {
            Front: Layout3Front,
            Back: Layout3Back,
        },
    };

    // State to manage the active layout
    const { Front: ActiveFront, Back: ActiveBack } = layoutComponents[businessCardData?.layout];
    const { layout, ...toggles } = businessCardData;
    const toggle = {
        "profilePhoto": toggles?.profilePhoto,
        "companyLogo": toggles?.companyLogo,
        "name": toggles?.name,
        "employeeId": toggles?.employeeId,
        "email": toggles?.email,
        "logoTitle": toggles?.logoTitle,
        "designation": toggles?.designation,
        "region": toggles?.region,
        "address": toggles?.address,
        "phoneNo": toggles?.phoneNo,
        "companyInfo": toggles?.companyInfo,
    }

    return (
        <div>
            <div>

            </div>
            <div className="flex justify-end px-6 py-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-600 text-3xl cursor-pointer hover:text-gray-900"
                >
                    &times;
                </button>

            </div>

            <div className="px-24">
                {/* <div
    className="bg-cover bg-center bg-no-repeat w-[400px] h-fit rounded-lg relative flex justify-center"
    style={{ backgroundImage: `url(${previewFront})`, minHeight: '250px' }}
>
    <div className="absolute inset-0 rounded-lg"></div>

    <div className="relative p-3">
        <div className="flex gap-1">
                <div>
                    <img className="w-8 h-8 rounded-full" src={profile} alt="Profile" />
                </div>
                <div className="border-r">
                    <p className="text-[#FFFFFF] font-light text-[10px] mx-2">Name</p>
                    <p className="text-[#FFFFFF] font-semibold text-xs mx-2">John Doe</p>
                </div>
                <div>
                    <p className="text-[#FFFFFF] font-light text-[10px]">Designation</p>
                    <p className="text-[#FFFFFF] font-semibold text-xs">Regional Manager</p>
                </div>
        </div>

        <div className="flex gap-4 mt-8">
                <div>
                    <p className="text-[#FFFFFF] font-light text-[10px]">Employee ID</p>
                    <p className="text-[#FFFFFF] font-medium text-xs">RM-210215</p>
                </div>
                <div className="me-6">
                    <p className="text-[#FFFFFF] font-light text-[10px]">Region</p>
                    <p className="text-[#FFFFFF] font-medium text-xs">Ernakulam</p>
                </div>
        </div>

        <div className="px-3 mt-4">
            <p className="text-[#FFFFFF] font-light text-[10px] my-2">Personal Address & Mail</p>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-2 items-center">
                    <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                        <EmailIcon size={11} color="#FFFFFF" />
                    </div>
                        <p className="text-[#FFFFFF] font-light text-[9px]">john.doe@example.com</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                        <PhoneIcon size={11} color="#FFFFFF" />
                    </div>
                        <p className="text-[#FFFFFF] font-light text-[9px]">+919633564547</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                        <LocationIcon size={12} color="#FFFFFF" />
                    </div>
                        <p className="text-[#FFFFFF] font-light text-[9px]">
                            2972 Westheimer Rd. Santa Ana, Illinois 85486
                        </p>
                </div>
            </div>
        </div>

        <div className="flex justify-between mt-4">
                <img src={cygnoz} className="w-14 h-5" alt="companyLogo" />
                <p className="text-[#FFFFFF] font-normal text-[10px] py-1">
                    Engineering your business for the world
                </p>
        </div>
    </div>
                    </div> */}
                <ActiveFront toggleState={toggle} role={role} staffData={staffData} />


            </div>

            <div className="px-24 mb-4">
                {/* <div
                    className="bg-cover bg-center bg-no-repeat w-[400px] h-fit items-center rounded-lg relative"
                    style={{ backgroundImage: `url(${previewBack})`, minHeight: '200px' }}
                >
                    <div className="absolute inset-0 rounded-lg"></div>

                    <div className="relative flex gap-1 p-3">
                        <div>
                            <img className="w-32 h-8" src={cygnoz} alt="companyLogo" />
                            <p className="text-[#FFFFFF] font-normal text-[10px] py-1">
                                Engineering your business for the world
                            </p>
                        </div>
                    </div>

                    <div className="relative px-3 py-8">
                        <p className="text-[#FFFFFF] font-light text-[10px] my-2">Company Info</p>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="flex gap-2 items-center">
                                <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                                    <EmailIcon size={11} color="#FFFFFF" />
                                </div>
                                <p className="text-[#FFFFFF] font-light text-[9px]">
                                    john.doe@example.com
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                                    <PhoneIcon size={11} color="#FFFFFF" />
                                </div>
                                <p className="text-[#FFFFFF] font-light text-[9px]">
                                    +919633564547
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="bg-gradient-to-l from-[#87D2FE] to-[#248DE5] rounded-full w-5 h-5 flex items-center justify-center">
                                    <LocationIcon size={12} color="#FFFFFF" />
                                </div>
                                <p className="text-[#FFFFFF] font-light text-[9px]">
                                    2972 Westheimer Rd. Santa Ana, Illinois 85486
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
                <ActiveBack toggleState={toggle} role={role} staffData={staffData} />

            </div>

        </div>
    )
}

export default BCardInsideForm