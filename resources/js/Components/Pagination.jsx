import { Link } from "@inertiajs/react";

export default function Pagination({ params }) {
  return (
    <nav className='flex justify-center text-center mt-4'>
      <div>
        <label htmlFor="page-select">Items:</label>
        <select name="page-select" id="page-select" value={perPage}></select>
      </div>
      <div>
        {params.meta.links.map((link) => (
          <Link
            href={link.url || ""}
            key={link.label}
            className={'inline-block py-2 px-3 rounded-lg text-gray-200 text-xs ' + (link.active ? "bg-gray-950 " : " ") + (!link.url ? "!text-gray-500 cursor-not-allowed " : "hover:bg-gray-950")}
            dangerouslySetInnerHTML={{ __html: link.label }}>
          </Link>
        ))}
      </div>
    </nav>
  );
}
