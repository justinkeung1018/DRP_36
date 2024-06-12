import { Header } from "../../components/Header";
import { Items } from "./Items";

export function StaffMenu() {
  return (
    <>
      <Header spritePath="./images/sprites/happy.png">
        Update today's menu!
      </Header>
      <Items mode="staff" />
    </>
  );
}
