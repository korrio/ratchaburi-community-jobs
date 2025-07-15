import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Settings,
  Save,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Database,
  Shield,
  Mail,
  Bell,
  Globe,
  Users,
  Key,
  Server,
  Activity,
  Info
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { apiEndpoints } from '@/utils/api';
import { ServiceCategory } from '@/utils/types';

const AdminSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'system' | 'security'>('general');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    site_name: 'ราชบุรีงานชุมชน',
    site_description: 'แพลตฟอร์มจับคู่งานชุมชนราชบุรี',
    contact_email: 'support@ratchaburicommunity.co.th',
    contact_phone: '032-XXX-XXXX',
    auto_match_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    line_notifications: true,
    maintenance_mode: false,
    registration_enabled: true,
    max_matches_per_day: 10,
    match_expiry_hours: 48
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '⚙️'
  });

  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    environment: 'production',
    database_status: 'connected',
    last_backup: '2024-01-15T10:00:00Z',
    total_storage: '500 MB',
    used_storage: '150 MB',
    uptime: '7 days, 14 hours'
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery(
    'admin-categories',
    () => apiEndpoints.getCategories()
  );

  // Create category mutation
  const createCategoryMutation = useMutation(
    (data: any) => apiEndpoints.createCategory?.(data) || Promise.resolve(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        setIsAddCategoryModalOpen(false);
        resetCategoryForm();
      }
    }
  );

  // Update category mutation
  const updateCategoryMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => apiEndpoints.updateCategory?.(id, data) || Promise.resolve(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        setIsEditCategoryModalOpen(false);
        resetCategoryForm();
      }
    }
  );

  // Delete category mutation
  const deleteCategoryMutation = useMutation(
    (id: string) => apiEndpoints.deleteCategory?.(id) || Promise.resolve(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        setIsDeleteCategoryModalOpen(false);
        setSelectedCategory(null);
      }
    }
  );

  const categories = categoriesData?.data?.data || [];

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      icon: '⚙️'
    });
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
    setIsEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCategory) {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id.toString(),
        data: categoryForm
      });
    } else {
      await createCategoryMutation.mutateAsync(categoryForm);
    }
  };

  const handleSaveSettings = () => {
    // Save general settings
    console.log('Saving settings:', generalSettings);
    // This would typically call an API endpoint
  };

  const handleBackupDatabase = () => {
    // Trigger database backup
    console.log('Backing up database...');
  };

  const handleClearCache = () => {
    // Clear application cache
    console.log('Clearing cache...');
  };

  const tabs = [
    { id: 'general', name: 'ทั่วไป', icon: Settings },
    { id: 'categories', name: 'หมวดหมู่', icon: Database },
    { id: 'system', name: 'ระบบ', icon: Server },
    { id: 'security', name: 'ความปลอดภัย', icon: Shield }
  ];

  return (
    <AdminLayout title="ตั้งค่าระบบ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <button
            onClick={handleSaveSettings}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
          >
            <Save className="h-5 w-5 mr-2" />
            บันทึกการตั้งค่า
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลทั่วไป</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อเว็บไซต์
                      </label>
                      <input
                        type="text"
                        value={generalSettings.site_name}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        อีเมลติดต่อ
                      </label>
                      <input
                        type="email"
                        value={generalSettings.contact_email}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เบอร์โทรติดต่อ
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.contact_phone}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        การจับคู่สูงสุดต่อวัน
                      </label>
                      <input
                        type="number"
                        value={generalSettings.max_matches_per_day}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, max_matches_per_day: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      คำอธิบายเว็บไซต์
                    </label>
                    <textarea
                      value={generalSettings.site_description}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_description: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ตั้งค่าระบบ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">เปิดการจับคู่อัตโนมัติ</label>
                        <p className="text-sm text-gray-500">ระบบจะจับคู่ผู้ให้บริการกับลูกค้าอัตโนมัติ</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.auto_match_enabled}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, auto_match_enabled: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">เปิดการลงทะเบียน</label>
                        <p className="text-sm text-gray-500">อนุญาตให้ผู้ใช้งานใหม่ลงทะเบียนได้</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.registration_enabled}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, registration_enabled: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">โหมดบำรุงรักษา</label>
                        <p className="text-sm text-gray-500">ปิดเว็บไซต์ชั่วคราวเพื่อบำรุงรักษา</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.maintenance_mode}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">การแจ้งเตือน</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">แจ้งเตือนทางอีเมล</label>
                        <p className="text-sm text-gray-500">ส่งการแจ้งเตือนผ่านอีเมล</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.email_notifications}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">แจ้งเตือนทาง SMS</label>
                        <p className="text-sm text-gray-500">ส่งการแจ้งเตือนผ่าน SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.sms_notifications}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, sms_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">แจ้งเตือนทาง LINE</label>
                        <p className="text-sm text-gray-500">ส่งการแจ้งเตือนผ่าน LINE</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.line_notifications}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, line_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">จัดการหมวดหมู่บริการ</h3>
                  <button
                    onClick={() => {
                      resetCategoryForm();
                      setIsAddCategoryModalOpen(true);
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มหมวดหมู่
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          หมวดหมู่
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          คำอธิบาย
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่สร้าง
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoadingCategories ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            กำลังโหลด...
                          </td>
                        </tr>
                      ) : categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            ไม่พบข้อมูล
                          </td>
                        </tr>
                      ) : (
                        categories.map((category: ServiceCategory) => (
                          <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.icon} {category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {category.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(category.created_at).toLocaleDateString('th-TH')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลระบบ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Info className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">เวอร์ชัน</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{systemInfo.version}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">สภาพแวดล้อม</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{systemInfo.environment}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Database className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">สถานะฐานข้อมูล</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-lg font-semibold text-green-700">เชื่อมต่อแล้ว</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">เวลาการทำงาน</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{systemInfo.uptime}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">การจัดการระบบ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">สำรองข้อมูล</div>
                        <div className="text-sm text-gray-500">
                          สำรองข้อมูลล่าสุด: {new Date(systemInfo.last_backup).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                      <button
                        onClick={handleBackupDatabase}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        สำรองข้อมูล
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">ล้าง Cache</div>
                        <div className="text-sm text-gray-500">
                          ล้างข้อมูลแคชของระบบ
                        </div>
                      </div>
                      <button
                        onClick={handleClearCache}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        ล้าง Cache
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">พื้นที่จัดเก็บ</div>
                        <div className="text-sm text-gray-500">
                          ใช้ไปแล้ว {systemInfo.used_storage} จาก {systemInfo.total_storage}
                        </div>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ความปลอดภัย</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-yellow-800">
                            การตั้งค่าความปลอดภัย
                          </div>
                          <div className="text-sm text-yellow-700">
                            ส่วนนี้จะใช้สำหรับการจัดการความปลอดภัยของระบบ
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">การเข้ารหัส HTTPS</div>
                          <div className="text-sm text-gray-500">บังคับใช้ HTTPS สำหรับการเชื่อมต่อทั้งหมด</div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-700">เปิดใช้งาน</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">การป้องกัน Rate Limiting</div>
                          <div className="text-sm text-gray-500">จำกัดจำนวนคำขอต่อนาที</div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-700">เปิดใช้งาน</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">การป้องกัน CSRF</div>
                          <div className="text-sm text-gray-500">ป้องกันการโจมตี Cross-Site Request Forgery</div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-700">เปิดใช้งาน</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">การบันทึก Log</div>
                          <div className="text-sm text-gray-500">บันทึกกิจกรรมของผู้ใช้งาน</div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-700">เปิดใช้งาน</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">การจัดการผู้ใช้งาน</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">เปลี่ยนรหัสผ่าน Admin</div>
                          <div className="text-sm text-gray-500">เปลี่ยนรหัสผ่านสำหรับบัญชี Admin</div>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700">
                          <Key className="h-4 w-4 mr-2" />
                          เปลี่ยนรหัสผ่าน
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-700">ออกจากระบบทุกอุปกรณ์</div>
                          <div className="text-sm text-gray-500">บังคับให้ออกจากระบบในทุกอุปกรณ์</div>
                        </div>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700">
                          <Users className="h-4 w-4 mr-2" />
                          ออกจากระบบทั้งหมด
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddCategoryModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitCategory}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      เพิ่มหมวดหมู่ใหม่
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อหมวดหมู่</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ไอคอน</label>
                      <input
                        type="text"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="🔧"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createCategoryMutation.isLoading ? 'กำลังสร้าง...' : 'สร้าง'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditCategoryModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitCategory}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      แก้ไขหมวดหมู่
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditCategoryModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อหมวดหมู่</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ไอคอน</label>
                      <input
                        type="text"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="🔧"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={updateCategoryMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {updateCategoryMutation.isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditCategoryModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteCategoryModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeleteCategoryModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      ยืนยันการลบ
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "{selectedCategory.name}" ข้อมูลนี้จะไม่สามารถกู้คืนได้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => deleteCategoryMutation.mutate(selectedCategory.id.toString())}
                  disabled={deleteCategoryMutation.isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteCategoryMutation.isLoading ? 'กำลังลบ...' : 'ลบ'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteCategoryModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;