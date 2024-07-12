export default function Logo() {
    return (
        <div className="p-4 text-3xl text-black">{process.env.NEXT_PUBLIC_TITLE}</div>
    )
}