import { Header } from "../../components/Header";
import { Items } from "./Items";

export function StaffMenu() {
  return (
    <>
      <Items mode="staff" />
      <Header spritePath="./images/sprites/happy.png">
        Update today's menu!
      </Header>
    </>
  );
}
