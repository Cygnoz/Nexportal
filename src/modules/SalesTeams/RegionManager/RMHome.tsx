import { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/ui/Button";
import AddRegionManager from "./RMForm";
import HomeCard from "../../../components/ui/HomeCards";
import UserIcon from "../../../assets/icons/UserIcon";
import AreaIcon from "../../../assets/icons/AreaIcon";
import MutiUserIcon from "../../../assets/icons/MultiUserIcon";
import Table from "../../../components/ui/Table";
import RegionIcon from "../../../assets/icons/RegionIcon";
import AreaManagerIcon from "../../../assets/icons/AreaMangerIcon";
import CalenderDays from "../../../assets/icons/CalenderDays";
import { useNavigate } from "react-router-dom";
import useApi from "../../../Hooks/useApi";
import { RMData } from "../../../Interfaces/RM";
import { endPoints } from "../../../services/apiEndpoints";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
// import { RMData } from "../../../Interfaces/RM";
// import { endPoints } from "../../../services/apiEndpoints";





  // Data for HomeCards
  const homeCardData = [
    { icon: <UserIcon  />, number: "46", title: "Total Regional Manager" ,iconFrameColor:'#51BFDA',iconFrameBorderColor:'#C1E7F1CC' },
    { icon: <AreaIcon  />, number: "147", title: "Total Area Managed" ,iconFrameColor:'#30B777',iconFrameBorderColor:'#B3F0D3CC'},
    { icon: <UserIcon  />, number: "256", title: "Total Area Managed" ,iconFrameColor:'#1A9CF9',iconFrameBorderColor:'#BBD8EDCC' },
    { icon: <MutiUserIcon  />, number: "498", title: "Total BDA's" ,iconFrameColor:'#D786DD',iconFrameBorderColor:'#FADDFCCC'},
  ];



const RMHome = () => {
   const {request:getRM}=useApi('get',3002)
   const [allRms, setAllRms] = useState<RMData[]>([]);
  const navigate = useNavigate()

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle modal visibility
  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    getRMs();
  };


  const handleView=(id:any)=>{
    navigate(`/region-managerView/${id}`)
  }

  // const getAllRM=async()=>{
  //   const url=endPoints.GET_ALL_RM
  //   try{
  //     const {response,error}=await getRM(url)
  //     console.log(response)
  //     console.log(error)
  //     if(response && !error){

  //       // toast.success(response.data.message)
  //       setAllRms(response.data.allRms)
  //     }else{
  //       console.log(error)
  //     }

  //   }catch(err){
  //     console.log(err)
  //   }
  // }

  // useEffect(()=>{
  //   getAllRM()
  // },[])



  const getRMs = async () => {
    try {
      const { response, error } = await getRM(endPoints.GET_ALL_RM);
  
      if (response && !error) {
          const transformedAreas = response.data.regionManager?.map((region: any) => ({
              ...region,
              dateOfJoining: region.dateOfJoining
                  ? new Date(region.dateOfJoining).toISOString().split('T')[0]
                  : "N/A",
          })) || [];
          setAllRms(transformedAreas);
      } else {
          toast.error(error?.response?.data?.message || "Failed to fetch data.");
      }
  } catch (err) {
      console.error("Error:", err);
      toast.error("An unexpected error occurred.");
  }
  
};

useEffect(() => {
    getRMs();
}, []);
  
  
//   // Data for the table
//   const data: RegionManagerData[] = [
//     { regionCode: "R001", regionName: "North America", createdDate: "2023-01-15", phone: "+1-800-123-4567", description: "Regions across North America." },
//     { regionCode: "R002", regionName: "Europe", createdDate: "2022-05-21", phone: "+49-170-1234567", description: "European market regions." },
//     { regionCode: "R003", regionName: "Asia Pacific", createdDate: "2023-03-02", phone: "+86-10-12345678", description: "Regions covering Asia-Pacific." },
//     { regionCode: "R004", regionName: "South America", createdDate: "2021-08-09", phone: "+55-11-12345678", description: "South American markets." },
//     { regionCode: "R004", regionName: "South America", createdDate: "2021-08-09", phone: "+55-11-12345678", description: "South American markets." },
//     { regionCode: "R005", regionName: "Middle East", createdDate: "2022-10-16", phone: "+971-50-1234567", description: "Middle East region with a focus on technology." },
//     { regionCode: "R006", regionName: "Africa", createdDate: "2020-12-01", phone: "+27-21-1234567", description: "African market regions and operations." },
//     { regionCode: "R007", regionName: "Australia", createdDate: "2023-06-10", phone: "+61-2-12345678", description: "Regions within Australia." },
//     { regionCode: "R008", regionName: "India", createdDate: "2021-07-04", phone: "+91-11-12345678", description: "Indian subcontinent markets." },
//     { regionCode: "R009", regionName: "Canada", createdDate: "2023-02-17", phone: "+1-416-123-4567", description: "Canadian market operations." },
//     { regionCode: "R010", regionName: "UK & Ireland", createdDate: "2022-11-25", phone: "+44-20-12345678", description: "United Kingdom and Ireland regions." },
//     { regionCode: "R011", regionName: "South East Asia", createdDate: "2021-09-19", phone: "+65-12345678", description: "Markets in South East Asia." },
//     { regionCode: "R012", regionName: "Latin America", createdDate: "2023-05-05", phone: "+52-55-12345678", description: "Latin American region operations." },
// ];
    // Define the columns with strict keys
    const columns: { key: any; label: string }[] = [
       
      { key: "user.userName", label: "Name" },
      { key: "email", label: "Email Address" },
      { key: "user.phoneNo", label: "Phone No" },
      { key: "region", label: "Region" },
      { key: "dateOfJoining", label: "Date Of Joining" },
    ];

    console.log("All Region Managers:", allRms);
    

  return (
    <div>
         <div className="flex justify-between items-center">
      <h1 className="text-[#303F58] text-xl font-bold">Regional Manager</h1>
     
      <Button variant="primary" size="sm" onClick={handleModalToggle}>
      <span className="font-bold text-xl">+</span> Create RM
      </Button>

      {/* Modal controlled by state */}
      <Modal open={isModalOpen} onClose={handleModalToggle}>
      <AddRegionManager  onClose={handleModalToggle} />
      </Modal>
    </div>

    <div className="flex gap-3 py-2 justify-between mt-6">
        {homeCardData.map((card, index) => (
          <HomeCard 
          iconFrameColor={card.iconFrameColor}
            iconFrameBorderColor={card.iconFrameBorderColor}
            key={index} 
            icon={card.icon} 
            number={card.number} 
            title={card.title} 
          />
        ))}
      </div>

       {/* Table Section */}
       <div>
        <Table< RMData> data={allRms} columns={columns} headerContents={{
          
          search:{placeholder:'Search Region By Name Country'},
          sort: [
                {
                  sortHead: "Filter",
                  sortList: [
                    { label: "Sort by Name", icon: <UserIcon size={14} color="#4B5C79"/> },
                    { label: "Sort by Age", icon: <RegionIcon size={14} color="#4B5C79"/> },
                    { label: "Sort by Name", icon: <AreaManagerIcon size={14} color="#4B5C79"/> },
                    { label: "Sort by Age", icon: <CalenderDays size={14} color="#4B5C79"/> }
                  ]
                }
          ]
        }}
        actionList={[
          { label: 'edit', function:handleView},
          { label: 'view', function: handleView },
        ]} />
      </div>

      {/* Modal Section */}
     



    </div>
   
    
  );
};

export default RMHome;
