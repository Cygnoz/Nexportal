import { useState } from "react";
import ActivityTimeline from "./ActivityTimeline";
import Mails from "./Mails";
import Notes from "./Notes";
import Tasks from "./Tasks";
import Meetings from "./Meetings";


type Props = {}

const ViewActivities = ({}: Props) => {
    const tabs=["Activity Timeline","Mails", "Notes","Task","Meetings"]
    const [activeTab, setActiveTab] = useState<string>("Activity Timeline");
     // Data for the table
  
  
  return (
    <div>
      <div className="flex gap-14 text-base font-bold my-5 border-b border-gray-200">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer py-3 px-[16px] ${
            activeTab === tab
              ? "text-deepStateBlue"
              : "text-gray-400"
          }`}
        >
          {tab}
        </div>
      ))}
    </div>

    {activeTab==="Activity Timeline"&&(
        <div>
            <ActivityTimeline/>
        </div>
    )}

    {activeTab==="Mails"&&(
    <Mails/>
    )}

    {activeTab==="Notes"&&(
    <Notes/>
    )}

    {activeTab==="Task"&&(
    <Tasks/>
    )}

    {activeTab==="Meetings"&&(
    <Meetings/>
    )}


    </div>
  )
}

export default ViewActivities;