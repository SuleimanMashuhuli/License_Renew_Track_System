import React from "react";
import clsx from "clsx";


export function Button({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


export function Select({ options = [], className = "", ...props }) {
  return (
    <select className={`px-3 py-2 border rounded-md ${className}`} {...props}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}


export function Table({ headers = [], data = [], className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse border ${className}`}>
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="border px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
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


export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-md border border-gray-200 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={clsx("p-2", className)} {...props}>
      {children}
    </div>
  );
};