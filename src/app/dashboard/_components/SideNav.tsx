import React, { useEffect } from "react";
import {
  BarChart4,
  LibraryBig,
  MessageSquareQuote,
  ShieldPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
function SideNav() {
  const menuList = [
    { id: 1, name: "My Forms", icon: LibraryBig, path: "/dashboard" },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquareQuote,
      path: "/dashboard/responses",
    },
    { id: 3, name: "Analytics", icon: BarChart4, path: "/dashboard/analytics" },
    { id: 4, name: "Upgrade", icon: ShieldPlus, path: "/dashboard/upgrade" },
  ];
  const path = usePathname();
  useEffect(() => {}, [path]);
  return (
    <div className="pt-2 h-screen border-border border-r-2  shadow-xl dark:shadow-gray-800 ">
      <div className="p-4">
        {menuList.map((menu, index) => (
          <h2
            key={index}
            className={`flex items-center gap-3 p-4 mb-3 hover:bg-gradient-to-r from-indigo-500 to-cyan-500 hover:text-white rounded-xl cursor-pointer ${
              path == menu.path &&
              `bg-gradient-to-r from-indigo-500 to-cyan-500  text-white`
            }`}
          >
            <menu.icon />
            {menu.name}
          </h2>
        ))}
      </div>
      <div className="fixed bottom-5 p-6 w-64">
        <Button className="text-white bg-gradient-to-r from-indigo-500 to-cyan-500 w-full">
          Create Form
        </Button>
        <div className="my-7">
          <Progress className="" value={33} />
          <h2 className="text-sm mt-2 ">
            <strong>2</strong> Out of <strong>3</strong> file created
          </h2>
          <h2 className="text-xs mt-2 ">
            upgrade your plan to make unlimited AI forms
          </h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
