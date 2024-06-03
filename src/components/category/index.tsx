export default function Category(props: any) {
  const { title = "", data = [] } = props;
  return (
    <div className="flex justify-between mt-2 py-2">
      <div className="font-medium text-sm">{title}</div>
      <ul className="flex flex-wrap flex-1">
        {data?.map((item: any) => (
          <li key={item.id} className="text-sm cursor-pointer text-blue-600 pl-3 pb-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
