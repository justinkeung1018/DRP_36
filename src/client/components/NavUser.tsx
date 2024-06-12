import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { IoRestaurantSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./shadcn/Tabs";

const NavUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("restaurant-list");

  function handleTabChange(value: string) {
    setActiveTab(value);
    switch (value) {
      case "restaurant-list":
        navigate("/restaurants");
        break;
      case "account":
        navigate("/account");
        break;
      case "favourites":
        navigate("/favourites");
        break;
    }
  }

  // Update the tab triggers immediately when path changes
  useEffect(() => {
    const pathname = location.pathname.slice(1);
    if (pathname.length === 0 || pathname === "restaurants") {
      setActiveTab("restaurant-list");
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
      defaultValue="restaurant-list"
      onValueChange={handleTabChange}
    >
      <TabsList className="fixed bottom-0 left-0 right-0 w-screen h-[8vh] flex shadow-[rgba(0,0,0,0.1)_0_-10px_15px_-3px,rgba(0,0,0,0.1)_0_-4px_6px_-4px] bg-blue-100">
        <TabsTrigger
          value="restaurant-list"
          className="flex-1 h-full data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50"
        >
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoRestaurantSharp size={30} />
            </div>
            Restaurants
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="favourites"
          className="flex-1 h-full data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50"
        >
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoHeartOutline size={30} />
            </div>
            Favourites
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="account"
          className="flex-1 h-full data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50"
        >
          <div className="flex flex-col items-center justify-center">
            <div>
              <MdAccountCircle size={30} />
            </div>
            Account
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="restaurant-list" />
      <TabsContent value="account" />
      <TabsContent value="favourites" />
    </Tabs>
  );
};

export default NavUser;
