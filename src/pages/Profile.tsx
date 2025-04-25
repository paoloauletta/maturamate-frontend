import React from 'react';
import { UserCircle, Mail, Book, Clock } from 'lucide-react';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserCircle className="w-16 h-16 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">student@example.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Book className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Exercises</p>
                <p className="font-medium">24</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="font-medium">12 hours</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              "Completed Physics Simulation",
              "Solved Math Exercise",
              "Virtual Tutor Session"
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{activity}</span>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;