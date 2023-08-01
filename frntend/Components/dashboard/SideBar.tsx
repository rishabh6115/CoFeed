"use-client";

import logo from "@/public/logo.png";
import Image from "next/image";
import { AiFillHome } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { FiSettings } from "react-icons/fi";

export default function SideBar() {
  const Items = [
    {
      icon: <AiFillHome />,
      name: "Home",
    },
    {
      icon: <ImProfile />,
      name: "Profile",
    },
    {
      icon: <FiSettings />,
      name: "Settings",
    },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-slate-900 p-4">
      <div className="text-white font-bold text-2xl mb-8">
        <Image src={logo} alt="logo" className="w-28 m-auto" />
      </div>
      {Items.map((item, index) => (
        <div className="space-y-6" key={index}>
          <div className="flex items-center text-white hover:bg-gray-700 rounded-md p-4 px-4 my-2 cursor-pointer">
            <span className="mr-3 text-2xl">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
