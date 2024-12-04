// src/components/Timeline.tsx
import React from "react";
import UserIcon from "../../../assets/icons/UserIcon";
import AreaIcon from "../../../assets/icons/AreaIcon";

// Mock data
const activities = [
  {
    date: "30/05/2024",
    time: "02:30 PM",
    icon: <AreaIcon />, // Example icon type
    description: "New Area Added",
    user: "Kiran Roa",
  },
  {
    date: "30/05/2024",
    time: "02:30 PM",
    icon: <UserIcon />,
    description: "Area Manager Assigned for Area 2",
    user: "Dilna Devaraj",
  },
  {
    date: "30/05/2024",
    time: "02:30 PM",
    icon: <UserIcon color="white" />,
    description: "Area 2 Info Updated",
    user: "Dilna Devaraj",
  },
  {
    date: "30/05/2024",
    time: "02:30 PM",
    icon: <UserIcon />,
    description: "New Area Added",
    user: "David Hussey",
  },
  {
    date: "30/05/2024",
    time: "02:35 PM",
    icon: <UserIcon />,
    description: "Another Activity",
    user: "Someone Else",
  },
  {
    date: "30/05/2024",
    time: "02:35 PM",
    icon: <UserIcon />,
    description: "Another Activity",
    user: "Someone Else",
  },
  {
    date: "30/05/2024",
    time: "02:35 PM",
    icon: <UserIcon />,
    description: "Another Activity",
    user: "Someone Else",
  },
  // Add more activities to test scrolling behavior
];

// Timeline Component
const RRecentActivityView: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-3 -mt-2">
        <h1 className="font-bold text-base my-3">Recent Activities</h1>
      {/* Scrollable container */}
      <div className="h-96 overflow-y-auto mx-3">
        <ul className="relative space-y-6">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start space-x-6 relative">
              {/* Vertical line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 h-full w-0.5 ml-6 bg-gray-300"></div>
              )}

              {/* Icon */}
              <div className="bg-blue-400 rounded-full flex items-center justify-center w-10 h-10 z-10">
                {activity.icon}
              </div>

              {/* Activity Details */}
              <div>
                <p className="text-gray-600 text-xs font-normal">
                  {activity.date} <span className="text-xs font-normal ml-4">{activity.time}</span>
                </p>
                <p className="text-gray-800 font-semibold text-xs">{activity.description}</p>
                <p className="text-gray-500 font-medium text-xs">{activity.user}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RRecentActivityView;
