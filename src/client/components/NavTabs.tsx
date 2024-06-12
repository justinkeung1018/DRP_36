import React from "react";
import { TabsList, TabsTrigger } from "./shadcn/Tabs";

interface NavTabsListProps {
  children: React.ReactNode;
}

function NavTabsList({ children }: NavTabsListProps) {
  return (
    <TabsList className="fixed bottom-0 left-0 right-0 w-screen h-[8vh] flex shadow-[rgba(0,0,0,0.1)_0_-10px_15px_-3px,rgba(0,0,0,0.1)_0_-4px_6px_-4px]">
      {children}
    </TabsList>
  );
}

interface NavTabsTriggerProps {
  children: React.ReactNode;
  value: string;
}

function NavTabsTrigger({ children, value }: NavTabsTriggerProps) {
  return (
    <TabsTrigger value={value} className="flex-1 data-[state=active]:text-blue">
      {children}
    </TabsTrigger>
  );
}

export { NavTabsList, NavTabsTrigger };
