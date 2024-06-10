import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { getAuth } from "firebase/auth";
import { IoAddOutline } from "react-icons/io5";
import { Search } from "lucide-react";

import { Button } from "../../components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/shadcn/Dialog";
import { Input } from "../../components/shadcn/Input";
import { Separator } from "../../components/shadcn/Separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shadcn/Tabs";

import { MenuItemInfo } from "../../types";
import { ItemInformationForm } from "../../components/ItemInformationForm";
import { MenuItemCard } from "../../components/MenuItemCard";
import { Items } from "./Items";

interface StaffHeaderProps {
  restaurantName: string;
}

function StaffHeader({ restaurantName }: StaffHeaderProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4 mt-10">
        <h1 className="text-2xl font-bold">{restaurantName}</h1>
        <h2 className="text-lg font-light">Staff page</h2>
      </div>
      <Separator className="mb-2" />
      <h1 className="text-xl text-center font-bold mx-4 py-2">Menu</h1>
    </>
  );
}

export function StaffMenu() {
  return <Items mode="staff" />;
}
