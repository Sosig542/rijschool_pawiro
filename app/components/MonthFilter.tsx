"use client";

interface MonthFilterProps {
  month?: string;
  onChange: (month: string) => void;
}

export default function MonthFilter({ month, onChange }: MonthFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      name="month"
      defaultValue={month ?? ""}
      onChange={handleChange}
      className="border border-gray-300 rounded px-3 py-1 text-sm"
    >
      <option value="">All Time</option>
      <option value="2025-01">January 2025</option>
      <option value="2025-02">February 2025</option>
      <option value="2025-03">March 2025</option>
      <option value="2025-04">April 2025</option>
      <option value="2025-05">May 2025</option>
      <option value="2025-06">June 2025</option>
      <option value="2025-07">July 2025</option>
      <option value="2025-08">August 2025</option>
      <option value="2025-09">September 2025</option>
      <option value="2025-10">October 2025</option>
      <option value="2025-11">November 2025</option>
      <option value="2025-12">December 2025</option>
    </select>
  );
}
