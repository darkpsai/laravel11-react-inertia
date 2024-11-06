import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';

const TABLE_LABEL_MAP = {
  'id': 'ID',
  'image': 'Image',
  'name': 'Name',
  'status': 'Status',
  'created_at': 'Create Date',
  'due_date': 'Due Date',
  'created_by': 'Created By',
  'actions': 'Actions'
};

const NON_SORTABLE_FIELDS = new Set(['image', 'actions', 'created_by']);

export default function Index({ projects, queryParams = null }) {
  queryParams = queryParams || {};

  const searchFieldChange = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }

    router.get(route('project.index'), queryParams);
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;

    searchFieldChange(name, e.target.value);
  }

  const sortChanged = (name) => {
    let debounceTimeouts = {}; // useRef to store timeout IDs

    // Do nothing if the field is non-sortable
    if (NON_SORTABLE_FIELDS.has(name)) {
      return;
    }

    // Clear previous timeouts for the specific field
    if (debounceTimeouts[name]) {
      clearTimeout(debounceTimeouts[name]);
    }

    debounceTimeouts[name] = setTimeout(() => {
      // Checked if the clicked column is the same as the current sorted field
      const isSameField = name === queryParams.sort_field;

      // Toggle sorting direction or reset to 'asc' if it's a new field
      const sortDirection = isSameField ? queryParams.sort_direction === 'asc' ? 'desc' : 'asc' : 'asc';

      // Create new queryParams to avoid mutation
      const newQueryParams = {
        ...queryParams, // Spread current queryParams
        sort_field: isSameField ? queryParams.sort_field : name,
        sort_direction: sortDirection,
      }

      router.get(route('project.index'), newQueryParams);
    }, 300)
  }

  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Projects
        </h2>
      }
    >
      <Head title="Projects" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className='w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                    <tr className='text-nowrap'>
                      {Object.entries(TABLE_LABEL_MAP).map(([key, label], idx) => (
                        <th onClick={() => sortChanged(key)} key={idx} className={`${!NON_SORTABLE_FIELDS.has(key) ? 'cursor-pointer' : ''}`}>
                          <div className={'flex items-center gap-1 px-3 py-3' + (key === 'name' ? ' w-[320px]' : '')}>
                            {label}
                            {!NON_SORTABLE_FIELDS.has(key) && (
                              <div>
                                <ChevronUpIcon className={"w-4 " + (queryParams.sort_field === key && queryParams.sort_direction === 'asc' ? 'text-white' : '')} />
                                <ChevronDownIcon className={"w-4 -mt-2 " + (queryParams.sort_field === key && queryParams.sort_direction === 'desc' ? 'text-white' : '')} />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                    <tr className='text-nowrap'>
                      <th className='px-3 py-3'></th>
                      <th className='px-3 py-3'></th>
                      <th className='px-3 py-3'>
                        <TextInput
                          className='w-full'
                          placeholder='Project Name'
                          defaultValue={queryParams.name}
                          onBlur={e => searchFieldChange('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        />
                      </th>
                      <th className='px-3 py-3'>
                        <SelectInput
                          className='w-full'
                          defaultValue={queryParams.status}
                          onChange={e => searchFieldChange('status', e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </SelectInput>
                      </th>
                      <th className='px-3 py-3'></th>
                      <th className='px-3 py-3'></th>
                      <th className='px-3 py-3'></th>
                      <th className='px-3 py-3'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.data.map((project) => (
                      <tr className='bg-white border-b hover:bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700' key={project.id}>
                        <td className='px-3 py-2'>{project.id}</td>
                        <td className='px-3 py-2'>
                          <img className='w-[120px]' src={project.image_path} alt="" />
                        </td>
                        <td className='px-3 py-2'>{project.name}</td>
                        <td className='px-3 py-2'>
                          <span className={'px-2 py-1 rounded text-white ' + PROJECT_STATUS_CLASS_MAP[project.status]}>
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                        </td>
                        <td className='px-3 py-2 text-nowrap'>{project.created_at}</td>
                        <td className='px-3 py-2 text-nowrap'>{project.due_date}</td>
                        <td className='px-3 py-2'>{project.createdBy.name}</td>
                        <td className='px-3 py-2'>
                          <Link href={route('project.edit', project.id)} className='font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1'>Edit</Link>
                          <Link href={route('project.destroy', project.id)} className='font-medium text-red-600 dark:text-red-500 hover:underline mx-1'>Delete</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flex flex-row'>
                <Pagination params={projects} queryParams={queryParams} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}
