//for filtering todos

type ChildProp = {
  filteredstatus: string,
  setFilteredstatus: React.Dispatch<React.SetStateAction<string>>
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

function FilterBar({
  filteredstatus,
  setFilteredstatus,
  setSearchTerm,
  searchTerm,
} : ChildProp) {
  return (
    <div className="max-w-[500px] h-auto px-6 py-6 flex flex-col justify-center items-center mx-auto">
      <header>
        <h1 className="text-2xl text-center md:text-4xl mb-4">Todo App</h1>
      </header>

      <form
        role="search"
        className="flex gap-4 w-full"
        onSubmit={(e) => e.preventDefault()} 
      >
        <div className="relative flex-1">
          <label htmlFor="todo-search" className="sr-only">
            Search todos
          </label>
          <div className="flex items-center border border-[#37cdbe] rounded-lg px-3 py-2">
            <svg
              className="h-[1em] opacity-50 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              id="todo-search"
              type="search"
              required
              placeholder="Search for a todo"
              className="w-full pl-2 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search todos"
              aria-controls="todo-list" //
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="todo-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="todo-filter"
            value={filteredstatus}
            onChange={(e) => setFilteredstatus(e.target.value)}
            className="select select-accent w-32 outline-none"
            aria-label="Filter todos by completion status"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
          </select>
        </div>
      </form>
    </div>
  );
}

export default FilterBar;
