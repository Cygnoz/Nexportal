import { useNavigate } from "react-router-dom";
import AreaManagerIcon from "../../../assets/icons/AreaMangerIcon";
import LeadsCardIcon from "../../../assets/icons/LeadsCardIcon";
import Licensor from "../../../assets/icons/Licensor";
import UserIcon from "../../../assets/icons/UserIcon";
import Table from "../../../components/ui/Table"
import ViewCard from "../../../components/ui/ViewCard";

interface AMViewData {
  BDAname: string;
  leadAssigned: string;
  conversionRate: string;
  status: string;
  area: string;
}

type Props = {
  bdaDetails:Array<any>;
  insideAmData: any;
}

const AMViewCardandTable = ({bdaDetails ,  insideAmData}: Props) => {

  const navigate= useNavigate()
  const handleView = (id: any) => {
    if (id) {
       navigate(`/bda/${id}`)
    }
  }

  

  const viewCardData = [
    { icon: <UserIcon />, number: "189", title: "Total Area Manager", iconFrameColor: '#1A9CF9', iconFrameBorderColor: '#BBD8EDCC' },
    { icon: <AreaManagerIcon />, number: insideAmData?.totalBdaCount || "N/A", title: "Total BDA's", iconFrameColor: '#D786DD', iconFrameBorderColor: '#FADDFCCC' },
  ];

  const SecondCard = [
    { icon: <LeadsCardIcon />, number:  insideAmData?.totalLeads || "N/A", title: "Total Leads", iconFrameColor: '#1A9CF9', iconFrameBorderColor: '#BBD8EDCC' },
    { icon: <Licensor />, number: insideAmData?.totalLicensers || "N/A", title: "Total Licensers", iconFrameColor: '#D786DD', iconFrameBorderColor: '#FADDFCCC' },
  ];
  const ThirdCard = [
    // { icon: <LeadsCardIcon />, number: "147", title: "Lead Conversion rate", iconFrameColor: '#1A9CF9', iconFrameBorderColor: '#BBD8EDCC' },
    { icon: <Licensor />, number: "147", title: "Closed Licenses", iconFrameColor: '#DD8686', iconFrameBorderColor: '#E9CBCBCC' },
  ];

  // Data for the table
  // const data: AMViewData[] = [
  //   { BDAname: "Devid Billie", leadAssigned: "45", conversionRate: "32%", status: "New", area: "Area 2", },
  //   { BDAname: "Sudeep Kumar", leadAssigned: "45", conversionRate: "32%", status: "New", area: "Area 2", },
  //   { BDAname: "Kathryn Murphy", leadAssigned: "45", conversionRate: "32%", status: "New", area: "Area 2", },
  //   { BDAname: "Darrell Steward", leadAssigned: "45", conversionRate: "32%", status: "New", area: "Area 2", },
  // ];
  // Define the columns with strict keys
  const columns: { key: any; label: string }[] = [
    { key: "bdaName", label: "BDA Name" },
    { key: "leadsAssigned", label: "Leads Assigned" },
    { key: "bdaConversionRate", label: "Conversion Rate" },
    { key: "status", label: "Status" },
    { key: "areaName", label: "Area" },
  ];

  const bdaData =bdaDetails.map((bda:any)=>({
    ...bda,
    bdaName:bda.bdaName,
    leadsAssigned:bda.leadsAssigned,
    bdaConversionRate:bda.bdaConversionRate,
    status:bda.status?bda.status:'N/A',
    areaName:bda.areaName
  }))


  return (

    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-4">
          {/* Cards Section */}
          <div className="flex gap-3 py-2 justify-between mt-4">
            {viewCardData.map((card, index) => (
              <ViewCard
                iconFrameColor={card.iconFrameColor}
                iconFrameBorderColor={card.iconFrameBorderColor}
                key={index}
                icon={card.icon}
                number={card.number}
                title={card.title}
              />
            ))}
          </div>
          <div className="flex gap-3 py-2 justify-between mt-2">
            {SecondCard.map((card, index) => (
              <ViewCard
                iconFrameColor={card.iconFrameColor}
                iconFrameBorderColor={card.iconFrameBorderColor}
                key={index}
                icon={card.icon}
                number={card.number}
                title={card.title}
              />
            ))}
          </div>
          <div className="py-2 w-full mt-2 ">
            {ThirdCard.map((card, index) => (
              <ViewCard
                iconFrameColor={card.iconFrameColor}
                iconFrameBorderColor={card.iconFrameBorderColor}
                key={index}
                icon={card.icon}
                number={card.number}
                title={card.title}
              />
            ))}
          </div>

        </div>
        <div className="col-span-8">
          {/* Table Section */}
          <div className="ms-4 py-2 mt-4">
            <Table<AMViewData> data={bdaData} columns={columns} headerContents={{
              title: "BDA's",
              search: { placeholder: 'Search BDA by Name' },
            }}
              actionList={[
                { label: 'view', function: handleView },
              ]}
              noPagination
              maxHeight="300px" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default AMViewCardandTable