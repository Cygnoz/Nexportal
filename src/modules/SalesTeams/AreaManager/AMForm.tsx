import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/Button";
import Input from "../../../components/form/Input";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Files from "../../../assets/icons/Files";
import CheckIcon from "../../../assets/icons/CheckIcon";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import Trash from "../../../assets/icons/Trash";
import ImagePlaceHolder from "../../../components/form/ImagePlaceHolder";
import ViewIcon from "../../../assets/icons/ViewIcon";
import bcardfront from "../../../assets/image/Business-card-front.svg";
import bcardback from "../../../assets/image/Business-card-back.svg";
import idcard from "../../../assets/image/ID-card 1.svg";
import { AMData } from "../../../Interfaces/AM";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { endPoints } from "../../../services/apiEndpoints";
import { AreaData } from "../../../Interfaces/Area";

interface RegionData {
  label: string;
  value: string;
}

interface AddAreaManagerProps {
  onClose: () => void; // Prop for handling modal close
}

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  // emailAddress: Yup.string()
  //   .email("Invalid email address")
  //   .required("Email address is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  // age: Yup.string(),
  // bloodGroup: Yup.string(),
  // addressStreet1: Yup.string(),
  // addressStreet2: Yup.string(),
  // city: Yup.string(),
  // state: Yup.string(),
  // adhaarNo: Yup.string()
  //   .matches(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  // panNo: Yup.string()
  //   .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN number"),
  // dateOfJoining: Yup.string(),
  // // Additional validation
  // bankName: Yup.string(),
  // branchName: Yup.string(),
  // accountNumber: Yup.string(),
  // ifscCode: Yup.string(),
  // companyId: Yup.string(),
  // workEmail: Yup.string().email("Invalid work email"),
  // workPhone: Yup.string().matches(/^\d+$/, "Work phone number must contain only digits"),
  // role: Yup.string(),
  // region: Yup.string(),
  // area:Yup.string(),
  loginEmail: Yup.string()
    .email("Invalid email address")
    .required("Login Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const AMForm: React.FC<AddAreaManagerProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AMData>({
    resolver: yupResolver(validationSchema),
  });

  const { request: addAM } = useApi("post", 3002);
  const { request: getAllRegion } = useApi("get", 3003);
  const [allAreas, setAllAreas] = useState<AreaData[]>([]);
  // State to manage modal visibility
  const { request: getAllArea } = useApi("get", 3003);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [submit, setSubmit] = useState(false);

  const onSubmit: SubmitHandler<AMData> = async (data) => {
    console.log(data);

    if (submit) {
      try {
        const { response, error } = await addAM(endPoints.AM, data);
        console.log("res", response);
        console.log("err", error);
        if (response && !error) {
          toast.success(response.data.message);
          onClose();
          setSubmit(false);
        } else {
          toast.error(error.response.data.message);
        }
      } catch (err) {
        console.error("Error submitting region data:", err);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const tabs = [
    "Personal Information",
    "Company Information",
    "Upload Files",
    "Bank Information",
    "ID & Business Card",
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const handleNext = async (tab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    let fieldsToValidate: any[] = [];

    if (tab === "Personal Information") {
      fieldsToValidate = ["fullName", "phone"];
    } else if (tab === "Company Information") {
      fieldsToValidate = ["loginEmail", "password", "confirmPassword"];
    }

    const isValid = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;

    if (isValid && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      clearErrors();
    }
  };
  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const getAllRegions = async () => {
    try {
      const { response, error } = await getAllRegion(endPoints.GET_REGIONS);

      if (response && !error) {
        // Extract only `regionName` and `_id` from each region
        const filteredRegions = response.data.regions?.map((region: any) => ({
          label: region.regionName,
          value: String(region._id), // Ensure `value` is a string
        }));

        // Update the state with the filtered regions
        setRegionData(filteredRegions);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllRegions();
  }, []);

  const getAreas = async (regionId: any) => {
    try {
      const { response, error } = await getAllArea(endPoints.GET_AREAS);
      console.log(response);

      if (response && !error) {
        const transformedAreas = response.data.areas?.filter(
          (area: any) => area.region?._id === regionId
        );

        // Then set the transformed regions into state
        setAllAreas(transformedAreas);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const regionId = watch("region");
    getAreas(regionId);
  }, [watch("region")]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click propagation

    // Clear the leadImage value
    setValue("image", "");
  };

  return (
    <div className="p-5 bg-white rounded shadow-md">
      {/* Close button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Create Area Manager</h1>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 font-bold"
        >
          <p className="text-xl">&times;</p>
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt.
      </p>

      <div className="flex gap-8 items-center justify-center text-base font-bold my-5">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className={`cursor-pointer py-3 px-[16px] ${
              activeTab === tab
                ? "text-deepStateBlue border-b-2 border-secondary2"
                : "text-gray-600"
            }`}
          >
            <p>
              {index < tabs.indexOf(activeTab) ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckIcon /> {tab}
                </div>
              ) : (
                tab
              )}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="transition-all duration-300"
          style={{ minHeight: "450px" }}
        >
          {activeTab === "Personal Information" && (
            <div className="grid grid-cols-12">
              <div className="col-span-2">
                <label
                  className="cursor-pointer text-center"
                  htmlFor="file-upload"
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    //   onChange={(e) => handleFileUpload(e)}
                  />
                  <ImagePlaceHolder uploadedImage={watch("image")} />
                </label>
                {watch("image") && (
                  <div
                    onClick={handleRemoveImage} // Remove image handler
                    className="flex ms-14"
                  >
                    <div className="border-2 cursor-pointer rounded-full h-7 w-7 flex justify-center items-center -ms-2 mt-2">
                      <Trash color="red" size={16} />
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-10">
                <Input
                  required
                  placeholder="Enter Full Name"
                  label="Full Name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  placeholder="Enter Email Address"
                  label="Email Address"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  required
                  placeholder=" Phone"
                  label="Phone "
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <div className="flex gap-4 w-full">
                  <Input
                    placeholder="Enter Age"
                    label="Age"
                    error={errors.age?.message}
                    {...register("age")}
                  />
                  <Input
                    label="Blood Group"
                    placeholder="Enter Blood Group"
                    error={errors.bloodGroup?.message}
                    {...register("bloodGroup")}
                  />
                </div>
                <Input
                  label="Address"
                  placeholder="Street 1"
                  error={errors.address?.street1?.message}
                  {...register("address.street1")}
                />
                <Input
                  label="Address"
                  placeholder="Street 2"
                  error={errors.address?.street2?.message}
                  {...register("address.street2")}
                />
                <Input
                  label="City"
                  placeholder="Enter City"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <Select
                  label="State"
                  placeholder="Select State"
                  error={errors.state?.message}
                  options={[
                    { value: "Kerala", label: "Kerala" },
                    { value: "Tamilnadu", label: "Tamilnadu" },
                    { value: "Karnataka", label: "Karnataka" },
                  ]}
                  {...register("state")}
                />
                <Input
                  label="Aadhaar Number"
                  placeholder="Enter Aadhar"
                  error={errors.adhaarNo?.message}
                  {...register("adhaarNo")}
                />
                <Input
                  label="PAN Number"
                  placeholder="Enter Pan Number"
                  error={errors.panNo?.message}
                  {...register("panNo")}
                />

                <Input
                  type="date"
                  label="Date of Joining"
                  error={errors.dateOfJoining?.message}
                  {...register("dateOfJoining")}
                />
              </div>
            </div>
          )}

          {activeTab === "Company Information" && (
            <div>
              <p className="my-4 text-[#303F58] text-sm font-semibold">
                Set Login Credential
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4 mb-6">
                <Input
                  required
                  placeholder="Enter Email"
                  label="Email"
                  error={errors.loginEmail?.message}
                  {...register("loginEmail")}
                />
                <Input
                  required
                  placeholder="Enter Password"
                  label="Create Password"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  required
                  placeholder="Re-enter Password"
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>
              <hr className="" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  placeholder="Enter Work Email"
                  label="Work Email"
                  error={errors.workEmail?.message}
                  {...register("workEmail")}
                />
                <Input
                  placeholder="Enter Work Phone"
                  label="Work Phone"
                  error={errors.workPhone?.message}
                  {...register("workPhone")}
                />
                <Select
                  label="Select Region"
                  placeholder="Choose Region"
                  value={watch("region")}
                  error={errors.region?.message}
                  options={regionData}
                  {...register("region")}
                />
                <Select
                  label="Select Area"
                  placeholder="Choose Area"
                  value={watch("area")}
                  error={errors.area?.message}
                  options={allAreas.map((area) => ({
                    value: area.areaCode,
                    label: area.areaName,
                  }))}
                  {...register("area")}
                />
                <Select
                  label="Choose Commission Profile"
                  placeholder="Commission Profile"
                  error={errors.commission?.message}
                  options={[
                    { value: "aa", label: "aa" },
                    { value: "bb", label: "bb" },
                  ]}
                  {...register("commission")}
                />
              </div>
            </div>
          )}

          {activeTab === "Upload Files" && (
            <div>
              <h6 className="font-bold text-sm text-[#303F58]">
                Upload ID Proofs
              </h6>
              <p className="font-normal text-[#8F99A9] text-xs my-1 ">
                Please Upload Your Scanned Adhaar and Pan card files
              </p>
              <div className="border-2 border-dashed h-[145px] rounded-lg bg-[#f5f5f5] text-[#4B5C79] flex items-center justify-center flex-col mt-6">
                <PlusCircle color="#4B5C79" size={25} />
                <p className="font-medium text-xs mt-2">
                  Drag & Drop or Click to Choose Files
                </p>
                <p className="text-xs mt-1 font-medium">Max file size: 5 MB</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                {/* Uploaded Files */}

                <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex w-full items-center space-x-4">
                    <div className="flex items-center justify-center">
                      <Files />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Adhaar
                      </p>
                      <p className="text-xs text-gray-500">.PDF | 9.83MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <DownloadIcon size={20} />
                    <Trash size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center">
                      <Files />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pancard
                      </p>
                      <p className="text-xs text-gray-500">.PDF | 9.83MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <DownloadIcon size={20} />
                    <Trash size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Bank Information" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Enter Bank Name"
                  label="Bank Name"
                  error={errors.bankDetails?.bankName?.message}
                  {...register("bankDetails.bankName")}
                />
                <Input
                  placeholder="Enter Bank Branch"
                  label="Bank Branch"
                  error={errors.bankDetails?.bankBranch?.message}
                  {...register("bankDetails.bankBranch")}
                />
                <Input
                  placeholder="Enter Account No"
                  label="Bank Account No"
                  error={errors.bankDetails?.bankAccountNo?.message}
                  {...register("bankDetails.bankAccountNo")}
                />
                <Input
                  placeholder="Enter IFSC Code"
                  label="IFSC Code"
                  error={errors.bankDetails?.ifscCode?.message}
                  {...register("bankDetails.ifscCode")}
                />
              </div>
            </div>
          )}
          {activeTab === "ID & Business Card" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F9FC] p-3 rounded-2xl">
                  <p className="text-[#303F58] text-base font-bold">
                    Business Card
                  </p>
                  <p className="text-xs font-normal text-[#8F99A9] mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                  <img src={bcardfront} className="my-3" alt="" />
                  <img src={bcardback} className="mb-3" alt="" />
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="tertiary"
                      size="sm"
                      className="text-xs text-[#565148] font-medium rounded-md"
                    >
                      <ViewIcon size="13" color="#565148" />
                      View
                    </Button>
                    {/* <Button className="text-xs text-[#FEFDF9] font-medium" variant="primary" size="sm">
                <DownloadIcon size={13} color="#FFFFFF"/>Download</Button> */}
                  </div>
                </div>
                <div className="bg-[#F5F9FC] p-3 rounded-2xl">
                  <p className="text-[#303F58] text-base font-bold">ID Card</p>
                  <p className="text-xs font-normal text-[#8F99A9] mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                  <img src={idcard} className="my-3" alt="" />
                  <div className="flex gap-3 bg-[#FEFDFA] justify-end">
                    <Button
                      variant="tertiary"
                      size="sm"
                      className="text-xs text-[#565148] font-medium rounded-md"
                    >
                      <ViewIcon size="13" color="#565148" />
                      View
                    </Button>
                    {/* <Button className="text-xs text-[#FEFDF9] font-medium" variant="primary" size="sm">
                <DownloadIcon size={13} color="#FFFFFF"/>Download</Button> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bottom-0 left-0 w-full bg-white flex justify-end gap-2">
          {tabs.indexOf(activeTab) > 0 ? (
            <Button
              variant="tertiary"
              className="h-8 text-sm border rounded-lg"
              size="lg"
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="tertiary"
              className="h-8 text-sm border rounded-lg"
              size="lg"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          {tabs.indexOf(activeTab) === tabs.length - 1 ? (
            <Button
              variant="primary"
              className="h-8 text-sm border rounded-lg"
              size="lg"
              type="submit"
              onClick={() => setSubmit(true)}
            >
              Done
            </Button>
          ) : (
            <Button
              variant="primary"
              className="h-8 text-sm border rounded-lg"
              size="lg"
              type="submit"
              onClick={() => handleNext(activeTab)}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AMForm;
