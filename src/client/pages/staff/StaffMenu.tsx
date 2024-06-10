import { Separator } from "../../components/shadcn/Separator";
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
