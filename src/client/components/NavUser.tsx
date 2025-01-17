import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { IoRestaurantSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./shadcn/Tabs";
import { NavTabsList, NavTabsTrigger } from "./NavTabs";

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
      <NavTabsList>
        <NavTabsTrigger value="restaurant-list">
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoRestaurantSharp size={30} />
            </div>
            Restaurants
          </div>
        </NavTabsTrigger>
        <NavTabsTrigger value="favourites">
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoHeartOutline size={30} />
            </div>
            Favourites
          </div>
        </NavTabsTrigger>
        <NavTabsTrigger value="account">
          <div className="flex flex-col items-center justify-center">
            <div>
              <MdAccountCircle size={30} />
            </div>
            Account
          </div>
        </NavTabsTrigger>
      </NavTabsList>
      <TabsContent value="restaurant-list" />
      <TabsContent value="account" />
      <TabsContent value="favourites" />
    </Tabs>
  );
};

export default NavUser;
