import { Label, Listbox, ListboxButton, ListboxOption } from "@headlessui/react";
import { Link } from "@inertiajs/react";

const perPageCount = [
  {
    id: 1, value: '10'
  },
  {
    id: 2, value: '20'
  },
  {
    id: 3, value: '30'
  },
  {
    id: 4, value: '50'
  },
  {
    id: 5, value: '100'
  },
]

export default function Pagination({ params }) {
  return (
    <nav className='flex justify-center text-center mt-4'>
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
