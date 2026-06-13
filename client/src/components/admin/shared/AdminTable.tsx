type AdminTableProps = {
  headers: string[];
  rows: string[][];
};

export function AdminTable({ headers, rows }: AdminTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-black/10 px-3 py-3 font-black text-neutral-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="hover:bg-neutral-50">
              {row.map((cell) => (
                <td key={cell} className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
