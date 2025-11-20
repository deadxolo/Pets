import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [heroSections, setHeroSections] = useState([]);
  const [features, setFeatures] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [heroRes, featuresRes, navRes, settingsRes] = await Promise.all([
        axios.get('/api/site/hero-sections'),
        axios.get('/api/site/features'),
        axios.get('/api/site/navigation'),
        axios.get('/api/site/settings'),
      ]);

      setHeroSections(heroRes.data.data || []);
      setFeatures(featuresRes.data.data || []);
      setNavigation(navRes.data.data || []);
      setSiteSettings(settingsRes.data.data || {});
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null, type) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      // Default empty form based on type
      if (type === 'hero') {
        setFormData({ title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', image: '', active: true, order: 0 });
      } else if (type === 'feature') {
        setFormData({ title: '', description: '', icon: '', active: true, order: 0 });
      } else if (type === 'navigation') {
        setFormData({ name: '', path: '', icon: '', active: true, order: 0 });
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let method = 'post';

      if (activeTab === 'hero') {
        endpoint = '/api/site/hero-sections';
        if (editingItem) {
          endpoint += `/${editingItem.id}`;
          method = 'put';
        }
      } else if (activeTab === 'features') {
        endpoint = '/api/site/features';
        if (editingItem) {
          endpoint += `/${editingItem.id}`;
          method = 'put';
        }
      } else if (activeTab === 'navigation') {
        endpoint = '/api/site/navigation';
        if (editingItem) {
          endpoint += `/${editingItem.id}`;
          method = 'put';
        }
      }

      await axios[method](endpoint, formData);
      toast.success(`${editingItem ? 'Updated' : 'Created'} successfully`);
      handleCloseModal();
      fetchAllContent();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      let endpoint = '';
      if (type === 'hero') endpoint = `/api/site/hero-sections/${id}`;
      else if (type === 'feature') endpoint = `/api/site/features/${id}`;
      else if (type === 'navigation') endpoint = `/api/site/navigation/${id}`;

      await axios.delete(endpoint);
      toast.success('Deleted successfully');
      fetchAllContent();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/site/settings', siteSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Sections' },
    { id: 'features', label: 'Features' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'settings', label: 'Site Settings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Sections Tab */}
      {activeTab === 'hero' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal(null, 'hero')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add Hero Section
            </button>
          </div>
          <div className="grid gap-4">
            {heroSections.map((hero) => (
              <div key={hero.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{hero.title}</h3>
                  <p className="text-gray-600">{hero.subtitle}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${hero.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {hero.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      Order: {hero.order}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(hero, 'hero')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id, 'hero')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal(null, 'feature')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add Feature
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(feature, 'feature')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id, 'feature')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${feature.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {feature.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal(null, 'navigation')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add Navigation Item
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Path</th>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {navigation.map((nav) => (
                  <tr key={nav.id} className="border-b">
                    <td className="px-4 py-3">{nav.name}</td>
                    <td className="px-4 py-3">{nav.path}</td>
                    <td className="px-4 py-3">{nav.order}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${nav.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {nav.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(nav, 'navigation')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(nav.id, 'navigation')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleUpdateSettings}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Site Name</label>
                <input
                  type="text"
                  value={siteSettings.siteName || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Site Email</label>
                <input
                  type="email"
                  value={siteSettings.email || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  value={siteSettings.phone || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={siteSettings.whatsapp || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Address</label>
                <textarea
                  value={siteSettings.address || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'hero' ? 'Hero Section' : activeTab === 'features' ? 'Feature' : 'Navigation'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              {activeTab === 'hero' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText || ''}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Button Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink || ''}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Image URL</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}

              {activeTab === 'features' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Icon (emoji or text)</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ⭐ or text"
                    />
                  </div>
                </>
              )}

              {activeTab === 'navigation' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Path</label>
                    <input
                      type="text"
                      value={formData.path || ''}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="/services"
                      required
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Active</label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
