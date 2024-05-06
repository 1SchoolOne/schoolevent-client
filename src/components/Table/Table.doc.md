# Table

## Required props

```ts
tableId: string
// An object or a promise returning an object
dataSource: { data: Array<T>, totalCount: number } | ((
			filters: TFilters<keyof T> | undefined,
			sorter: ISorter<T> | undefined,
			pagination: IPagination | undefined,
			globalSearch: string | null,
	  ) => Promise<{ data: Array<T>, totalCount: number }>)
// An array of object.
columns: ColumnsType<T>
// Values **MUST** be null, not undefined.
defaultFilters: TFilters<keyof T, null>
```

## How to use
⚠️**DISCLAIMER:** the fetch mode examples below are for Supabase only. If you are using an external API, you'll need to create your own utils functions to parse filters, sorter, pagination and global search.

### Basic setup - static data
```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={[
    {
      title: 'toto',
      description: 'hello there',
      role: 'student'
    },
    {
      title: 'titi',
      description: 'good morning',
      role: 'teacher'
    }
  ]}
  columns={[
    {
      key: 'title',
      dataIndex: 'title',
    },
    {
      key: 'description',
      dataIndex: 'description',
    },
    {
      key: 'role',
      dataIndex: 'role',
    }
  ]}
  defaultFilters={{
    title: null,
    description: null,
    role: null,
  }}
/>
```

### Basic setup - fetch data
```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={async () => {
    return await fetchMyData()
  }}
  columns={[
    {
      key: 'title',
      dataIndex: 'title',
    },
    {
      key: 'description',
      dataIndex: 'description',
    },
    {
      key: 'role',
      dataIndex: 'role',
    }
  ]}
  defaultFilters={{
    title: null,
    description: null,
    role: null,
  }}
/>
```

### Filters - static data

There are 2 utils functions available to use either a radio/checkbox dropdown or a search input dropdown:
- `getStaticRadioOrCheckboxFilterConfig`
- `getStaticColumnSearchFilterConfig`

```tsx
const inputRef = useRef<InputRef>(null)

// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={[
    {
      school_name: 'Lycée Jean Perrin',
      school_city: "Saint Ouen l'Aumone",
      school_postal_code: '95310'
    }
  ]}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
      ...getStaticColumnSearchFilterConfig('school_name', inputRef)
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
      ...getStaticColumnSearchFilterConfig('school_city', inputRef)
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
      ...getStaticColumnSearchFilterConfig('school_postal_code', inputRef)
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```

### Filters - fetch data

There are 2 utils functions available to use either a radio/checkbox dropdown or a search input dropdown (not bound to Supabase):
- `getRadioOrCheckboxFilterConfig`
- `getColumnSearchFilterConfig`

```tsx
const inputRef = useRef<InputRef>(null)

// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={async (filters) => {
    const parsedFilters = parseFiltersForSupabase(filters)

    let sup = supabase.from('favorites').select('*', { count: 'exact' })

    if (parsedFilters) {
      sup = sup.or(parsedFilters)
    }

    const { data, error, count } = await sup

    if(error) {
      throw error
    }

    return { data, totalCount: count ?? 0 }
  }}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
      ...getColumnSearchFilterConfig(inputRef)
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
      ...getColumnSearchFilterConfig(inputRef)
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
      ...getColumnSearchFilterConfig(inputRef)
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```

### Sorter - static data

```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={[
    {
      school_name: 'Lycée Jean Perrin',
      school_city: "Saint Ouen l'Aumone",
      school_postal_code: '95310'
    }
  ]}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
      sorter: (rowA, rowB) => {
        if(rowA.school_name < rowB.school_name) {
          return -1
        } else if(rowA.school_name > rowB.school_name) {
          return 1
        }

        return 0
      }
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
      sorter: (rowA, rowB) => {
        if(rowA.school_city < rowB.school_city) {
          return -1
        } else if(rowA.school_city > rowB.school_city) {
          return 1
        }

        return 0
      }
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
      sorter: (rowA, rowB) => {
        if(rowA.school_postal_code < rowB.school_postal_code) {
          return -1
        } else if(rowA.school_postal_code > rowB.school_postal_code) {
          return 1
        }

        return 0
      }
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```

### Sorter - fetch data

```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={async (filters, sorter) => {
    const parsedFilters = parseFiltersForSupabase(filters)

    let sup = supabase.from('favorites').select('*', { count: 'exact' })

    if (parsedFilters) {
      sup = sup.or(parsedFilters)
    }

    if (sorter) {
      sup = sup.order(sorter.field, {
        ascending: sorter.order === 'ascend',
      })
    }

    const { data, error, count } = await sup

    if(error) {
      throw error
    }

    return { data, totalCount: count ?? 0 }
  }}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```

### Pagination

The global search works only in **fetch mode** currently.


```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  dataSource={async (filters, sorter, pagination) => {
    const parsedFilters = parseFiltersForSupabase(filters)

    const from = pagination?.offset
    const to = pagination?.offset + pagination?.size

    let sup = supabase.from('favorites').select('*', { count: 'exact' }).range(from, to)

    if (parsedFilters) {
      sup = sup.or(parsedFilters)
    }

    if (sorter) {
      sup = sup.order(sorter.field, {
        ascending: sorter.order === 'ascend',
      })
    }

    const { data, error, count } = await sup

    if(error) {
      throw error
    }

    return { data, totalCount: count ?? 0 }
  }}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```

### Global search

The global search works only in **fetch mode** currently.


```tsx
// Not mandatory but useful for autocompletion.
<Table<Database["public"]["Tables"]["favorites"]["Row"]>
  tableId="myTable"
  globalSearch={{
    // Does not have any effect on the fetch process. It is used to display a tooltip to indicate
    // on which fields the global search is active.
    searchedFields: ['École', 'Ville', 'Code postal']
  }}
  dataSource={async (filters, sorter, pagination, globalSearch) => {
    const parsedFilters = parseFiltersForSupabase(filters)

    const from = pagination?.offset
    const to = pagination?.offset + pagination?.size

    let sup = supabase.from('favorites').select('*', { count: 'exact' }).range(from, to)

    if(globalSearch) {
      const gblSearch = parseGlobalSearchForSupabase<Database["public"]["Tables"]["favorites"]["Row"]>(globalSearch, ['school_name', 'school_city', 'school_postal_code'])
      sup = sup.or(gblSearch)
    } else if (parsedFilters) {
      sup = sup.or(parsedFilters)
    }

    if (sorter) {
      sup = sup.order(sorter.field, {
        ascending: sorter.order === 'ascend',
      })
    }

    const { data, error, count } = await sup

    if(error) {
      throw error
    }

    return { data, totalCount: count ?? 0 }
  }}
  columns={[
    {
      dataIndex: 'school_name',
      title: 'École',
    },
    {
      dataIndex: 'school_city',
      title: 'Ville',
    },
    {
      dataIndex: 'school_postal_code',
      title: 'Code postal',
    },
  ]}
  defaultFilters={{
    school_city: null,
    school_name: null,
    school_postal_code: null,
  }}
  // Will display a button to reset filters
  showResetFilters
/>
```