'use client';

import { useState } from 'react';

interface User {
  name: string;
  age: number;
}

export function FormWithTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      setUsers([...users, { name, age }]);
      setName('');
      setAge(0);
    }
  };

  return (
    <div className="flex gap-12 h-[500px]">
      {/* Form Section */}
      <div className="w-[300px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              User Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-gray-700 font-medium mb-2"
            >
              User Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={e => setAge(parseInt(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Save
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="flex-1">
        <div className="border border-gray-200 rounded-md h-full">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-gray-700 font-semibold p-4">
                  Users
                </th>
                <th className="text-left text-gray-700 font-semibold p-4">
                  Ages
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="p-4 text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-900">{user.age}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center p-4 text-gray-500">
                    No users added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
