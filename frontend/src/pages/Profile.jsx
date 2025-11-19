import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="max-w-2xl mx-auto card">
        <form className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" className="input-field" defaultValue={userProfile?.profile?.name || ''} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-field" defaultValue={userProfile?.profile?.email || ''} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input-field" defaultValue={userProfile?.phoneNumber || ''} disabled />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input-field" rows="3" defaultValue={userProfile?.profile?.address || ''}></textarea>
          </div>
          <button type="submit" className="btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
