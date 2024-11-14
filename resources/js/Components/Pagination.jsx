import { useState } from 'react';
import { Link, router } from "@inertiajs/react";
import SelectInput from "./SelectInput";

const itemsPerPage = [
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

export default function Pagination({ params, queryParams }) {
  const [countPerPage, setCountPerPage] = useState(queryParams.per_page || 10);

  const pageFieldChange = (e) => {
    const newPerPage = e.target.value;
    setCountPerPage(newPerPage);
    // router.get(route('project.index'), { per_page: newPerPage }, { preserveState: true });
  }

  return (
    <div className='w-full flex flex-row items-center justify-center mt-4' role='pagination' aria-label='pagination'>
      <div className='relative'>
        <SelectInput
          className='text-gray-200 text-xs'
          defaultValue={countPerPage}
          onChange={pageFieldChange}
        >
          {itemsPerPage.map((item) => (
            <option value={item.value} key={item.id}>{item.value} items per page</option>
          ))}
        </SelectInput>
      </div>
      <nav className='w-full flex relative'>
        <div className='w-full flex'>
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
      <div className='px-3 text-nowrap text-gray-200 text-xs'>
        <span>Total: {params.meta.total}</span>
      </div>
    </div>
  );
}
