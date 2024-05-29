interface HeaderProps {
  rest: String;
}

const RestaurantHeader = (props: HeaderProps) => {
  console.log(props.rest);
  return (
    <div>
      <h1>{props.rest}</h1>
    </div>
  );
};

export default RestaurantHeader;
