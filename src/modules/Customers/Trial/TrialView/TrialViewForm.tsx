import BloodGroupIcon from "../../../../assets/icons/BloodGroupIcon";
import Boxes from "../../../../assets/icons/Boxes";
import BuildingIcon from "../../../../assets/icons/BuildingIcon";
import EmailIcon from "../../../../assets/icons/EmailIcon";
import LocationIcon from "../../../../assets/icons/LocationIcon";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";
import UserIcon from "../../../../assets/icons/UserIcon";

type Props = {
  onClose: () => void;
  data?: any;
};

const TrialViewForm = ({ onClose, data }: Props) => {
  return (
    <div>
      <div className="p-5 bg-white rounded shadow-md  ">
        <div className="flex justify-between items-center">
          <div className="px-2 ">
            <h1 className="font-bold text-sm">Trial Info</h1>
            <p className="text-xs mt-2 font-normal text-[#8F99A9]">
            A true test is not without challenges.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold "
          >
            <p className="text-xl">&times;</p>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-2 p-2">
          {/* Table Section */}
          <div className="col-span-5 my-2 ">
            <div className="p-4  mx-1 bg-[#F3EEE7] h-60">
              <h1 className="text-sm font-semibold my-2">Basic Details</h1>
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Name
              </h3>
              <div className="flex">
                <UserIcon color="#4B5C79" />
                <p className="text-sm font-semibold ms-2">{data?.trial?.primaryContactName}</p>
              </div>

              <hr />

              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">Organization Name</h3>

              <div className="flex">
              <BuildingIcon color="#4B5C79" size={14} />
                <p className="text-sm font-semibold ms-2 ">{data?.trial?.organizationName}</p>
              </div>



              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Trial ID
              </h3>
              <div className="flex">
                <BloodGroupIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.customerId}</p>
              </div>
            </div>
          </div>
          <div className="col-span-7 my-2 ">
            <div className="p-4  mx-1 bg-[#F3EEE7] h-60">
              <h1 className="text-sm font-semibold my-2">
                Contact Information
              </h1>
             

              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Phone
              </h3>
              <div className="flex">
                <PhoneIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.trial?.primaryContactNum}</p>
              </div>

              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                {" "}
                Email Address
              </h3>
              <div className="flex">
                <EmailIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.trial?.primaryContactEmail}</p>
              </div>
            </div>
          </div>

          {/* <div className="col-span-5 my-2 ">
            <div className="p-4  mx-1 bg-[#F3EEE7] h-60">
              <h1 className="text-sm font-semibold my-2">Identification and Employment Details</h1>
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">Adhar Number</h3>
              <div className="flex">
                <UserIcon color="#4B5C79"/>
                <p className="text-sm font-semibold ms-2">282798467436</p>

              </div>
             
              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">Pan Number</h3>
              <div className="flex">
                <UserIcon color="#4B5C79"/>
                <p className="text-sm font-semibold ms-2">282798463444336</p>

              </div>
              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]"> Date Of Joining</h3>
              
              <div className="flex">
                <CalenderDays color="#4B5C79"/>
                <p className="text-sm font-semibold ms-2 ">Jan 21 , 2023</p>

              </div>
            </div>

          </div> */}
        </div>

        <div className="grid grid-cols-12 gap-2">
          {/* Table Section */}
          <div className="col-span-12 my-2 ">
            <div className="p-4  mx-1 bg-[#F3EEE7] h-[342px]">
              <h1 className="text-sm font-semibold my-2">
                Company Information
              </h1>
              <h3 className="text-xs font-semibold my-2 text-[rgb(143,153,169)]">
                Company ID
              </h3>
              <div className="flex">
                <UserIcon color="#4B5C79" size={20} />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.companyId}</p>
              </div>

              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Company Name
              </h3>
              <div className="flex">
                <BuildingIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.companyName}</p>
              </div>
              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Company Phone
              </h3>
              <div className="flex">
                <PhoneIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.companyPhone}</p>
              </div>

              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Company address
              </h3>
              <div className="flex">
                <LocationIcon size={20} />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.companyAddress}</p>
              </div>
              <hr />
              <h3 className="text-xs font-semibold my-2 text-[#8F99A9]">
                Region
              </h3>
              <div className="flex">
                <Boxes color="#4B5C79" />
                <p className="text-sm font-semibold ms-2">{data?.customerData?.regionDetails?.regionName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialViewForm;
