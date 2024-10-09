import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from 'react';

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

export default function Index({ projects, queryParams }) {
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
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }

    if (name === 'image' || name === 'actions' || name === 'created_by') {
      return;
    }

    router.get(route('project.index'), queryParams);
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

              <table className='w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                  <tr className='text-nowrap'>
                    {Object.entries(TABLE_LABEL_MAP).map(([key, label], idx) => (
                      <th onClick={e => sortChanged(key)} className='px-3 py-3' key={idx}>{label}</th>
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
              {status}
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
