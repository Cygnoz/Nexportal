
import ImagePlaceHolder from "../../../components/form/ImagePlaceHolder";
import Input from "../../../components/form/Input";
import PrefixInput from "../../../components/form/PrefixInput";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomPhoneInput from "../../../components/form/CustomPhone";
import { LicenserData } from "../../../Interfaces/Licenser";
import useApi from "../../../Hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useRegularApi } from "../../../context/ApiContext";
import { endPoints } from "../../../services/apiEndpoints";
import toast from "react-hot-toast";
import Trash from "../../../assets/icons/Trash";
import { useUser } from "../../../context/UserContext";


type Props = {
  onClose: () => void;
  editId?:string
};



const validationSchema = Yup.object({
   firstName: Yup.string().required("First name is required"),
   email: Yup.string()
     .email("Invalid email format")
     .required("Email is required"),
   phone: Yup.string().required("Phone is required"),
   regionId:Yup.string().required('Region is required'),
   areaId:Yup.string().required('Area is required'),
   bdaId:Yup.string().required('Bda is required'),
   startDate:Yup.string().required('StartDate is required'),
  endDate:Yup.string().required('EndDate is required')
});

function LicenserForm({ onClose ,editId}: Props) {
  const {user}=useUser()
  const {request:addLicenser}=useApi('post',3001)
  const {request:editLicenser}=useApi('put',3001)
 const {request:getLicenser}=useApi('get',3001)
  const {allRegions,allAreas,allBDA,allCountries}=useRegularApi()
    const [data, setData] = useState<{
      regions: { label: string; value: string }[];
      areas: { label: string; value: string }[];
      bdas:{ label: string; value: string }[];
      country: { label: string; value: string }[];
      state: { label: string; value: string }[]

    }>({ regions:[], areas: [],bdas:[],state:[] ,country:[]});

    // const [isOpenOrg,setIsOpenOrg]=useState(false)
    // const [licenserId,setLicenserId]=useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    setValue,
  } = useForm<LicenserData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      salutation: "Mr.", // Default value for salutation
    },
  });

  

 

  const onSubmit: SubmitHandler<LicenserData> = async (data:any, event) => {
    event?.preventDefault(); // Prevent default form submission behavior
    console.log("Form Data", data);
    try {
      const fun = editId ? editLicenser : addLicenser; // Select the appropriate function based on editId
      let response, error;
      if (editId) {
        // Call updateLead if editId exists (editing a lead)
        ({ response, error } = await fun(`${endPoints.LICENSER}/${editId}`, data));
      } else {
        // Call addLead if editId does not exist (adding a new lead)
        ({ response, error } = await fun(endPoints.LICENSER, data));
      }
      console.log("Response:", response);
      console.log("Error:", error);
      
      if (response && !error) {
        //console.log(response.data);
        
         toast.success(response.data.message); // Show success toast
         onClose()
        //  setTimeout(() => {
        //   setIsOpenOrg(true)
        //  }, 1500);
      } else {
        toast.error(error.response?.data?.message || "An error occurred."); // Show error toast
      }
    } catch (err) {
      console.error("Error submitting license data:", err);
      toast.error("An unexpected error occurred."); // Handle unexpected errors
    }
  };

  
  




  const salutation = [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Ms.", label: "Ms." },
    { value: "Miss.", label: "Miss." },
    { value: "Dr.", label: "Dr." },
  ];
  // console.log(editId)

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click propagation
 
    // Clear the image value
    setValue("image","")
 
    // Reset the file input value
    if (fileInputRef?.current) {
      fileInputRef.current.value = ""; // Clear the input field
    }
  };

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

    // UseEffect for updating regions
    useEffect(() => {
      const filteredRegions = allRegions?.map((region: any) => ({
        value: String(region._id),
        label: region.regionName,
      }));
      // Update the state without using previous `data` state
      setData((prevData:any) => ({
        ...prevData,
        regions: filteredRegions,
      }));
    }, [allRegions]);
  
    // UseEffect for updating areas based on selected region
    useEffect(() => {
      const filteredAreas = allAreas?.filter(
        (area: any) => area.region?._id === watch("regionId")
      );
      const transformedAreas = filteredAreas?.map((area: any) => ({
        label: area.areaName,
        value: String(area._id),
      }));
  
      // Update areas
      setData((prevData:any) => ({
        ...prevData,
        areas: transformedAreas,
      }));
    }, [watch("regionId"), allAreas]);
  
    // UseEffect for updating regions
    useEffect(() => {
      const filteredBDA = allBDA?.filter(
        (bda: any) => bda.area?._id === watch("areaId")
      );
      const transformedBda:any = filteredBDA?.map((bda: any) => ({
        value: String(bda?._id),
        label: bda?.bdaName,
      }));
      
      // Update the state without using previous `data` state
      setData((prevData:any) => ({
        ...prevData,
        bdas: transformedBda,
      }));
    }, [allBDA,watch("areaId")]);

    useEffect(()=>{
      console.log("allBDA",allBDA);
      
      if(user?.role=="BDA"){
        const filteredBDA:any = allBDA?.find(
          (bda: any) => bda?.user?.employeeId === user?.employeeId
        );
  
        console.log("Filtered BDA:", filteredBDA?._id);
        setValue("areaId", filteredBDA?.area?._id || "");
          setValue("regionId", filteredBDA?.region?._id || "");
          setValue("bdaId", filteredBDA?._id || "");
          
      }
    },[user,allBDA])
    
  useEffect(() => {
    const filteredCountries = allCountries?.map((items: any) => ({
      label: items.name,
      value: String(items.name), // Ensure `value` is a string
    }));
    setData((prevData: any) => ({ ...prevData, country: filteredCountries }));
  }, [allCountries])

  // // Effect to fetch and populate states based on selected country
  useEffect(() => {
    const selectedCountry = watch("country");
    if (selectedCountry) {
      const filteredStates = allCountries.filter(
        (country: any) => country.name === selectedCountry
      );

      const transformedStates = filteredStates.flatMap((country: any) =>
        country.states.map((states: any) => ({
          label: states,
          value: states,
        }))
      );
      setData((prevData: any) => ({ ...prevData, state: transformedStates }));
    }
  }, [watch("country"), allCountries]);


   const setFormValues = (data: LicenserData) => {
    console.log(data);
    
      Object.keys(data).forEach((key) => {
        setValue(key as keyof LicenserData, data[key as keyof LicenserData]);
      });
    };
  
    const getOneLicenser = async () => {
      try {
        const { response, error } = await getLicenser(`${endPoints.LICENSER}/${editId}`);
        if (response && !error) {
          const Licenser = response.data; // Return the fetched data
          console.log("Fetched Licenser data:", Licenser);
          const{licensers,...filteredLicencers}=Licenser
          setFormValues(filteredLicencers);
        } else {
          // Handle the error case if needed (for example, log the error)
          console.error('Error fetching Lead data:', error);
        }
      } catch (err) {
        console.error('Error fetching Lead data:', err);
      }
    };

    useEffect(() => {
      getOneLicenser()
    }, [editId]);


  const handleInputChange = (field: keyof LicenserData) => {
    clearErrors(field); // Clear the error for the specific field when the user starts typing
  };

  // const orgFormClose=()=>{
  //   setIsOpenOrg(false)
  // }

  return (
    <>
    <div className="px-5 py-3 bg-white rounded shadow-md">
      <div className="flex justify-between">
      <div>

<h3 className="text-[#303F58] font-bold text-lg">{editId ? "Edit" : "Create"} Licenser</h3>
<p className="text-[11px] text-[#8F99A9] mt-1">
  {editId
    ? "Edit the details of the Licenser."
    : "Fill in the details to create a new Licenser."}
</p>
</div>
        <p onClick={onClose} className="text-2xl cursor-pointer">
          &times;
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-2 mt-3"
      >
        <div className="col-span-2">
        <label className="cursor-pointer text-center flex justify-center" htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <ImagePlaceHolder uploadedImage={watch("image")} />
          </label>
          {watch('image') && (
        <div
          onClick={handleRemoveImage} // Remove image handler
          className="flex justify-center  items-center"
        >
          <div  className="border-2 cursor-pointer rounded-full h-7 w-7 flex justify-center items-center -ms-2 mt-2">
           <Trash color="red" size={16}/>
          </div>
        </div>
      )}
        </div>
        <div className="col-span-10">
          <div className="grid grid-cols-2 gap-4">
            <PrefixInput
              required
              label="First Name"
              selectName="salutation"
              inputName="firstName"
              selectValue={watch("salutation")} // Dynamic select binding
              inputValue={watch("firstName")} // Dynamic input binding
              options={salutation}
              placeholder="Enter First Name"
              error={errors.firstName?.message} // Display error message if any
              onSelectChange={(e) => setValue("salutation", e.target.value)} // Update salutation value
              onInputChange={(e) => {
                clearErrors("firstName"); // Clear error for input field
                setValue("firstName", e.target.value); // Update firstName value
              }}
            />

            <Input
          
              label="Last Name"
              placeholder="Enter Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
             // onChange={() => handleInputChange("lastName")}
            />
            
            <Input
              required
              label="Email"
              type="email"
              placeholder="Enter Email"
              error={errors.email?.message}
              {...register("email")}
             // onChange={() => handleInputChange("email")}
            />

            <CustomPhoneInput
              required
              label="Phone"
              name="phone"
              error={errors.phone?.message}
              placeholder="Enter Phone No"
              value={watch("phone")} // Watch phone field for changes
              onChange={(value) => {
                handleInputChange("phone");
                setValue("phone", value); // Update the value of the phone field in React Hook Form
              }}
            />

            <Input
              label="Address"
              placeholder="Address"
              error={errors.address?.message}
              {...register("address")}
            />
             <Input
              label="City"
              placeholder="Enter Company Name"
              error={errors.city?.message}
              {...register("city")}
            />
            
           
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
         
          <Select
                  placeholder="Select Country"
                  label="Country"
                  error={errors.country?.message}
                  value={watch("country")}
                  onChange={(selectedValue) => {
                    // Update the country value and clear the state when country changes
                    setValue("country", selectedValue);
                    handleInputChange("country");
                    setValue("state", ""); // Reset state when country changes
                  }}
                  options={data.country}
                />
                <Select
                  placeholder={
                    data.state.length === 0 ? "Choose Country" : "Select State"
                  }
                  value={watch("state")}
                  onChange={(selectedValue) => {
                    setValue("state", selectedValue);
                    handleInputChange("state");
                  }}
                  label="State"
                  error={errors.state?.message}
                  options={data.state}
                />
             <Input
              label="Company ID"
              placeholder="Enter Company ID"
              {...register("companyId")}
              error={errors.companyId?.message}
            />
            <Input
              label="Company Name"
              placeholder="Enter Company Name"
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <Input
              required
              label="Start Date"
              type="date"
              placeholder="Select Start Date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <Input
            required
            label="End Date"
            type="date"
            placeholder="Select End Date"
            error={errors.endDate?.message}
            {...register("endDate")}
          />
         <div className="col-span-2 gap-3 grid grid-cols-3">
         <Select
            readOnly={user?.role=="BDA"?true:false}
            required
            placeholder="Select Region"
            label="Select Region"
            value={watch("regionId")}
            onChange={(selectedValue) => {
              setValue("regionId", selectedValue); // Manually update the region value
              handleInputChange("regionId");
              setValue("areaId", "");
              setValue("bdaId", "");
            }}
            error={errors.regionId?.message}
            options={data.regions}
            />
            <Select
              readOnly={user?.role=="BDA"?true:false}
              required
                  label="Select Area"
                  placeholder={watch("regionId")?"Select Area":"Select Region"}
                  value={watch("areaId")}
                  onChange={(selectedValue) => {
                    setValue("areaId", selectedValue); // Manually update the region value
                    setValue("bdaId","")
                    handleInputChange("areaId");
                  }}
                  error={errors.areaId?.message}
                  options={data.areas}
            />
            <Select
              readOnly={user?.role=="BDA"?true:false}
              required
                  label="Assigned BDA"
                  placeholder={watch("areaId")?"Select BDA":"Select Area"}
                  value={watch("bdaId")}
                  onChange={(selectedValue) => {
                    setValue("bdaId", selectedValue); // Manually update the region value
                    handleInputChange("bdaId");
                  }}
                  error={errors.bdaId?.message}
                  options={data.bdas}
            />
         </div>
        
        </div>
        <div className="bottom-0 left-0 w-full pt-2 ps-2 bg-white flex gap-2 justify-end">
          <Button
            variant="tertiary"
            className="h-8 text-sm border rounded-lg"
            size="xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="h-8 text-sm border rounded-lg"
            size="xl"
            type="submit"
          >
            Done
          </Button>
        </div>
        </div>
     
     
        </form>
    </div>
    {/* <Modal
                open={isOpenOrg}
                align="center"
                onClose={orgFormClose}
                className="w-[35%]"
            >
                <OrganisationForm licenserId={licenserId}  licenserData={watch()}   type="licenser"  onClose={orgFormClose} />
            </Modal> */}
    </>
  );
}

export default LicenserForm;
