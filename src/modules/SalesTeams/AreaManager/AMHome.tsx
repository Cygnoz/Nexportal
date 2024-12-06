import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/modal/Modal";
import HomeCard from "../../../components/ui/HomeCards";
import Table from "../../../components/ui/Table";
import LeadsCardIcon from "../../../assets/icons/LeadsCardIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import AreaManagerIcon from "../../../assets/icons/AreaMangerIcon";
import Licensor from "../../../assets/icons/Licensor";
import RegionIcon from "../../../assets/icons/RegionIcon";
import CalenderDays from "../../../assets/icons/CalenderDays";
import AddAreaManager from "./AMForm";
import { useNavigate } from "react-router-dom";
import useApi from "../../../Hooks/useApi";
import { AMData } from "../../../Interfaces/AM";
import { endPoints } from "../../../services/apiEndpoints";



  
const AMHome = () => {
  const {request:getAllAM}=useApi('get',3002)
  const [allAM,setAllAM]=useState<AMData[]>([]);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate()

    const handleModalToggle = () => {
        setIsModalOpen((prev) => !prev);
        getAM()
      };
      

      const handleView=(id:any)=>{
        navigate(`/amView/${id}`)
      }

      const getAM = async () => {
        try {
          const { response, error } = await getAllAM(endPoints.GET_ALL_AM);
          if (response && !error) {
            //   const transformedAM = response.data.areaManager?.map((item:any) => ({
            //   // ...item,
            //   fullName: item.user.userName,
            //   email: item.email,
            //   phone: item.user.phoneNo,
            //   dateOfJoining: item.dateOfJoining,
            //   area: item.area,
            //   region: item.region,
            // }));
            // setAllAM(transformedAM);
            const transformedAreas = response.data.areaManager?.map((area: any) => ({
              ...area,
              dateOfJoining: area.dateOfJoining
                  ? new Date(area.dateOfJoining).toISOString().split('T')[0]
                  : "N/A",
          })) || [];
          setAllAM(transformedAreas);

          } else {
            console.error(error.response.data.message);
          }
        } catch (err) {
          console.error(err);
        }
      };
      
      useEffect(() => {
        getAM();
      }, []);
      
      console.log(allAM);
      
      // Data for HomeCards
  const homeCardData = [
    { icon: <UserIcon />, number: "189", title: "Total Area Manager",iconFrameColor:'#1A9CF9',iconFrameBorderColor:'#BBD8EDCC' },
    { icon: <AreaManagerIcon />, number: "498", title: "Total BDA's",iconFrameColor:'#D786DD',iconFrameBorderColor:'#FADDFCCC' },
    { icon: <LeadsCardIcon />, number: "46", title: "Total Leads",iconFrameColor:'#9C75D3',iconFrameBorderColor:'#DAC9F1' },
    { icon: <Licensor />, number: "147", title: "Total Licensers",iconFrameColor:'#8695DD',iconFrameBorderColor:'#CAD1F1CC' },
  ];

    // Data for the table
    // const data: AMData[] = [
    //     { name: "Devid Billie", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Sudeep Kumar", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Kathryn Murphy", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Darrell Steward", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Ronald Richards", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Jane Cooper", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Sudeep Kumar", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Kathryn Murphy", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Darrell Steward", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //     { name: "Ronald Richards", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14"},
    //     { name: "Jane Cooper", emailAdrees: "nathan.roberts@example.com", phoneNo: "+91 9878675667", region: "Region 1", area: "Area 2",dateOfJoining:"5/30/14" },
    //   ];
        // Define the columns with strict keys
        const columns: { key: any; label: string }[] = [
          { key: "user.userName", label: "Name" },
          { key: "email", label: "Email Address" },
          { key: "user.phoneNo", label: "Phone No" },
          { key: "region", label: "Region" },
          { key: "area", label: "Area" },
          { key: "dateOfJoining", label: "Date of Joining" },

        ];
      

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-[#303F58] text-xl font-bold">Area Manager</h1>
        <Button variant="primary" size="sm" onClick={handleModalToggle}>
        <span className="font-bold text-xl">+</span> Create AM
        </Button>
      </div>

      {/* HomeCards Section */}
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
        <Table<AMData> data={allAM} columns={columns} headerContents={{
          // title:'Region',
          search:{placeholder:'Search Invoice by client name, invoice number, or date'},
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
        ]}  />
      </div>

      {/* Modal Section */}
      <Modal open={isModalOpen} onClose={handleModalToggle}>
        <AddAreaManager onClose={handleModalToggle} />
      </Modal>
    </div>
  )
}

export default AMHome