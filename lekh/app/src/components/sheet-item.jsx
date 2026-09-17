import { useRouter } from "next/navigation";

const SheetItem = ({ name, route }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <a onClick={handleClick}>
      <div className="grid gap-3 border-y p-3 cursor-pointer">
        { name }
      </div>
    </a>
  )
};

export { SheetItem };
