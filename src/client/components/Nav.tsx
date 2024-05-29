import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { IoRestaurantSharp } from "react-icons/io5";
import { FaBowlFood } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./shadcn/Tabs";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("restaurant-list");

  function handleTabChange(value: string) {
    setActiveTab(value);
    switch (value) {
      case "restaurant-list":
        navigate("/");
        break;
      case "items":
        navigate("/items");
        break;
    }
  }

  // Update the tab triggers immediately when path changes
  useEffect(() => {
    const pathname = location.pathname.slice(1);
    if (pathname.length === 0) {
      setActiveTab("restaurant-list");
    } else {
      setActiveTab(pathname);
    }
  }, [location]);

  return (
    <Tabs
      value={activeTab}
      defaultValue="restaurant-list"
      onValueChange={handleTabChange}
    >
      <TabsList className="absolute bottom-0 w-screen h-fit flex">
        <TabsTrigger value="restaurant-list" className="flex-1">
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoRestaurantSharp size={30} />
            </div>
            Restaurants
          </div>
        </TabsTrigger>
        <TabsTrigger value="items" className="flex-1">
          <div className="flex flex-col items-center justify-center">
            <div>
              <FaBowlFood size={30} />
            </div>
            Items
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="restaurant-list" />
      <TabsContent value="items" />
    </Tabs>
  );
};

export default Nav;
