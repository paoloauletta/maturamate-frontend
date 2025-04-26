import { UserCircle, Mail, Book, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Il Tuo Profilo</h1>
                <p className="text-gray-600">Gestisci le tue impostazioni e preferenze</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Book className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Esercizi Completati</p>
                <p className="font-medium">{user?.user_metadata?.completedExercises?.length || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Tempo di Studio</p>
                <p className="font-medium">{user?.user_metadata?.studyTime || '0'} ore</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-border bo p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attività Recente</h2>
          <div className="space-y-4">
            {(user?.user_metadata?.recentActivity || []).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{activity.description}</span>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            ))}
            {(!user?.user_metadata?.recentActivity || user.user_metadata.recentActivity.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                Nessuna attività recente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;