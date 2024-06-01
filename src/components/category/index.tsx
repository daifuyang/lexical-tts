export default function Category() {
  return (
    <div className="flex mt-2">
      <div className="w-12">类型</div>
      <ul className="flex flex-wrap flex-1">
        {new Array(10).fill(0).map((_, index) => (
          <li className="pr-2 pb-2">类型</li>
        ))}
      </ul>
    </div>
  );
}
