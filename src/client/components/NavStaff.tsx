import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { IoRestaurantSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { Clock } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./shadcn/Tabs";

const NavStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("items");

  function handleTabChange(value: string) {
    setActiveTab(value);
    switch (value) {
      case "items":
        navigate("/items");
        break;
      case "account":
        navigate("/account");
        break;
      case "archive":
        navigate("/archive");
        break;
    }
  }

  // Update the tab triggers immediately when path changes
  useEffect(() => {
    const pathname = location.pathname.slice(1);
    if (pathname.length === 0) {
      setActiveTab("items");
    } else {
      setActiveTab(pathname);
    }
  }, [location]);

  if (location.pathname.slice(1) === "restaurant") {
    // Do not display navigation bar when user is in individual restaurant page
    return null;
  }

  return (
    <Tabs
      value={activeTab}
      defaultValue="items"
      onValueChange={handleTabChange}
    >
      <TabsList className="fixed bottom-0 left-0 right-0 w-screen pb-10 h-[12vh] flex shadow-[rgba(0,0,0,0.1)_0_-10px_15px_-3px,rgba(0,0,0,0.1)_0_-4px_6px_-4px]">
        <TabsTrigger value="items" className="flex-1">
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoRestaurantSharp size={30} />
            </div>
            Current menu
          </div>
        </TabsTrigger>
        <TabsTrigger value="archive" className="flex-1">
          <div className="flex flex-col items-center justify-center">
            <div>
              <Clock size={30} />
            </div>
            Past items
          </div>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex-1">
          <div className="flex flex-col items-center justify-center">
            <div>
              <MdAccountCircle size={30} />
            </div>
            Account
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="items" />
      <TabsContent value="archive" />
      <TabsContent value="account" />
    </Tabs>
  );
};

export default NavStaff;
