import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { motion } from "framer-motion";

interface Anomaly {
  type: string;
  count: number;
}

export const AnomalyTable = ({ data }: { data: Anomaly[] }) => {
  const columns = [
    {
      accessorKey: "type",
      header: "Anomaly Type",
    },
    {
      accessorKey: "count",
      header: "Count",
    },
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-2 border-cyber-green rounded-lg overflow-hidden shadow-cyber"
    >
      <table className="w-full">
        <thead className="bg-cyber-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left font-orbitron text-cyber-green"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-cyber-secondary">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 font-mono text-cyber-green"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
