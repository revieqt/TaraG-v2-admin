import { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getStoredToken } from '@/services/authService';
import { BACKEND_URL } from '@/constants/Config';

interface User {
  _id: string;
  fname: string;
  lname?: string;
  username: string;
  email: string;
  type: 'admin' | 'guide' | 'traveler';
  contactNumber?: string;
  status: string;
  createdOn: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const secondaryColor = useThemeColor({}, "secondary");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getStoredToken();
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return '#FF6B6B';
      case 'guide':
        return '#4ECDC4';
      case 'traveler':
        return '#95E1D3';
      default:
        return secondaryColor;
    }
  };

  return (
    <div
      style={{ backgroundColor }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ color: textColor }} className="text-4xl font-bold font-poppins mb-2">
            Users Management
          </h1>
          <p style={{ color: textColor }} className="text-lg opacity-70 font-poppins">
            Manage and view all registered users on the platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{ backgroundColor: '#FF6B6B' }}
            className="p-4 rounded-lg mb-6 font-poppins text-white"
          >
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ color: textColor }} className="text-center py-12 font-poppins">
            <div className="inline-block">
              <div
                className="animate-spin h-12 w-12 border-4 border-opacity-30 rounded-full"
                style={{
                  borderColor: textColor,
                  borderTopColor: secondaryColor,
                }}
              ></div>
            </div>
            <p className="mt-4">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div
            style={{ backgroundColor: primaryColor }}
            className="rounded-lg shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full font-poppins">
                <thead style={{ backgroundColor: secondaryColor }}>
                  <tr>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Name
                    </th>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Username
                    </th>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Email
                    </th>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Type
                    </th>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th style={{ color: primaryColor }} className="px-6 py-4 text-left font-semibold">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr
                      key={user._id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? primaryColor : textColor,
                        color: idx % 2 === 0 ? textColor : primaryColor,
                      }}
                      className="border-t border-opacity-20"
                    >
                      <td className="px-6 py-4 font-medium">
                        {user.fname} {user.lname || ''}
                      </td>
                      <td className="px-6 py-4">@{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          style={{ backgroundColor: getTypeColor(user.type) }}
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        >
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          style={{
                            backgroundColor: user.status === 'active' ? '#4ECDC4' : '#FFD93D',
                          }}
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.createdOn).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && !error && (
          <div
            style={{
              backgroundColor: primaryColor,
              color: textColor,
            }}
            className="rounded-lg p-12 text-center shadow-md"
          >
            <p className="text-xl font-poppins opacity-70">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
