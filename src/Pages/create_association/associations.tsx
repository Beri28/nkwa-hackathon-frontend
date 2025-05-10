import { useState } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiPlus, FiX, FiSave, FiUser } from 'react-icons/fi';

type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Association {
  name: string;
  description: string;
  contributionAmount: number;
  contributionFrequency: Frequency;
  members: User[];
}

// Mock user data - in a real app, this would come from your backend
const mockUsers: User[] = [
  { id: '1', username: 'john_doe' },
  { id: '2', username: 'jane_smith' },
  { id: '3', username: 'mike_johnson' },
  { id: '4', username: 'sarah_williams' },
];

const CreateAssociation = () => {
  const [association, setAssociation] = useState<Association>({
    name: '',
    description: '',
    contributionAmount: 0,
    contributionFrequency: 'weekly',
    members: []
  });

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAssociationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssociation(prev => ({
      ...prev,
      [name]: name === 'contributionAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const addMember = (user: User) => {
    if (!association.members.some(m => m.id === user.id)) {
      setAssociation(prev => ({
        ...prev,
        members: [...prev.members, user]
      }));
    }
    setShowUserDropdown(false);
    setSearchTerm('');
  };

  const removeMember = (id: string) => {
    setAssociation(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!association.name) newErrors.name = 'Association name is required';
    if (association.contributionAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (association.members.length === 0) newErrors.members = 'At least one member is required';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    // Submit logic here (e.g., API call)
    console.log('Creating association:', association);
    alert('Association created successfully!');
  };

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !association.members.some(m => m.id === user.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-6 py-5">
            <h2 className="text-2xl font-bold">Create New Association</h2>
            <p className="text-gray-300 mt-1">Set up your group and contribution rules</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Association Details */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Association Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={association.name}
                  onChange={handleAssociationChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Savings Group 2023"
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={association.description}
                  onChange={handleAssociationChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="What's the purpose of this association?"
                />
              </div>
            </div>

            {/* Contribution Settings */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FiDollarSign className="mr-2 text-black" />
                Contribution Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount per member *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">FCFA</span>
                    </div>
                    <input
                      type="number"
                      id="contributionAmount"
                      name="contributionAmount"
                      min="0"
                      step="0.01"
                      value={association.contributionAmount}
                      onChange={handleAssociationChange}
                      className={`w-full pl-16 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
                </div>

                <div>
                  <label htmlFor="contributionFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    id="contributionFrequency"
                    name="contributionFrequency"
                    value={association.contributionFrequency}
                    onChange={handleAssociationChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FiUsers className="mr-2 text-black" />
                Members *
              </h3>
              {errors.members && <p className="mb-4 text-sm text-red-600">{errors.members}</p>}

              {/* Selected Members */}
              <div className="flex flex-wrap gap-3 mb-6">
                {association.members.map(member => (
                  <div key={member.id} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <FiUser className="mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{member.username}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Member Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add Member
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div
                            key={user.id}
                            onClick={() => addMember(user)}
                            className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          >
                            <FiUser className="mr-3 text-gray-500" />
                            <span className="text-sm">{user.username}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          {searchTerm ? 'No users found' : 'No available users'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <FiSave className="mr-2" />
                Create Association
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssociation;