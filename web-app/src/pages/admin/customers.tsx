import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { apiEndpoints } from '@/utils/api';
import { Customer, CustomerFormData, CustomerFormErrors, ServiceCategory } from '@/utils/types';
import { DISTRICTS, SUBDISTRICTS, URGENCY_LEVELS, CONTACT_METHODS } from '@/utils/types';

const AdminCustomers: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'urgency_level'>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    line_id: '',
    location: '',
    district: '',
    subdistrict: '',
    province: 'ราชบุรี',
    service_category_id: 0,
    job_description: '',
    budget_range: '',
    urgency_level: 'medium',
    preferred_contact: 'phone',
    is_active: true
  });

  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({});

  // Fetch customers
  const { data: customersData, isLoading } = useQuery(
    ['admin-customers', currentPage, searchQuery, selectedCategory, selectedDistrict, selectedUrgency, sortBy, sortOrder],
    () => apiEndpoints.getCustomers({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
      category_id: selectedCategory,
      district: selectedDistrict || undefined,
      urgency_level: selectedUrgency || undefined,
      sort_by: sortBy,
      order: sortOrder
    }),
    { keepPreviousData: true }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  // Create customer mutation
  const createCustomerMutation = useMutation(
    (data: CustomerFormData) => apiEndpoints.createCustomer(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-customers');
        setIsModalOpen(false);
        resetForm();
      }
    }
  );

  // Update customer mutation
  const updateCustomerMutation = useMutation(
    ({ id, data }: { id: string; data: CustomerFormData }) => apiEndpoints.updateCustomer(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-customers');
        setIsModalOpen(false);
        resetForm();
      }
    }
  );

  // Delete customer mutation
  const deleteCustomerMutation = useMutation(
    (id: string) => apiEndpoints.deleteCustomer(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-customers');
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
      }
    }
  );

  const customers = customersData?.data?.data || [];
  const pagination = customersData?.data?.pagination;
  const categories = categoriesData?.data?.data || [];

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      line_id: '',
      location: '',
      district: '',
      subdistrict: '',
      province: 'ราชบุรี',
      service_category_id: 0,
      job_description: '',
      budget_range: '',
      urgency_level: 'medium',
      preferred_contact: 'phone',
      is_active: true
    });
    setFormErrors({});
    setSelectedCustomer(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof CustomerFormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setFormData(prev => ({
      ...prev,
      district,
      subdistrict: ''
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: CustomerFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    if (!formData.service_category_id) {
      newErrors.service_category_id = 'กรุณาเลือกหมวดหมู่บริการ';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'กรุณากรอกที่อยู่';
    }

    if (!formData.district) {
      newErrors.district = 'กรุณาเลือกอำเภอ';
    }

    if (!formData.subdistrict) {
      newErrors.subdistrict = 'กรุณาเลือกตำบล';
    }

    if (!formData.job_description.trim()) {
      newErrors.job_description = 'กรุณากรอกรายละเอียดงาน';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (selectedCustomer) {
      await updateCustomerMutation.mutateAsync({
        id: selectedCustomer.id.toString(),
        data: formData
      });
    } else {
      await createCustomerMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      line_id: customer.line_id || '',
      location: customer.location,
      district: customer.district,
      subdistrict: customer.subdistrict,
      province: customer.province,
      service_category_id: customer.service_category_id,
      job_description: customer.job_description,
      budget_range: customer.budget_range || '',
      urgency_level: customer.urgency_level,
      preferred_contact: customer.preferred_contact,
      is_active: customer.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomerMutation.mutate(selectedCustomer.id.toString());
    }
  };

  const getSubdistricts = (district: string) => {
    return SUBDISTRICTS[district] || [];
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = URGENCY_LEVELS.find(u => u.value === urgency);
    if (!urgencyConfig) return null;

    const colorClass = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    }[urgencyConfig.color];

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {urgencyConfig.label}
      </span>
    );
  };

  const getContactMethodLabel = (method: string) => {
    const contactConfig = CONTACT_METHODS.find(c => c.value === method);
    return contactConfig ? contactConfig.label : method;
  };

  return (
    <AdminLayout title="จัดการลูกค้า">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">จัดการลูกค้า</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            เพิ่มลูกค้า
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อลูกค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map((category: ServiceCategory) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อำเภอ
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">ทุกอำเภอ</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ความเร่งด่วน
              </label>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">ทุกระดับ</option>
                {URGENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เรียงตาม
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as typeof sortBy);
                  setSortOrder(order as typeof sortOrder);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="created_at-DESC">ล่าสุด</option>
                <option value="name-ASC">ชื่อ A-Z</option>
                <option value="urgency_level-DESC">ความเร่งด่วนสูงสุด</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ที่อยู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ความเร่งด่วน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
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
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  customers.map((customer: Customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            {customer.phone} | {getContactMethodLabel(customer.preferred_contact)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.category_icon} {customer.category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {customer.job_description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.district}, {customer.subdistrict}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.budget_range || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getUrgencyBadge(customer.urgency_level)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.is_active ? 'เปิด' : 'ปิด'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(customer.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
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

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    แสดง <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> ถึง{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, pagination.total)}
                    </span>{' '}
                    จาก <span className="font-medium">{pagination.total}</span> รายการ
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedCustomer ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้า'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อ *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์ *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">LINE ID</label>
                      <input
                        type="text"
                        name="line_id"
                        value={formData.line_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ช่องทางการติดต่อ</label>
                      <select
                        name="preferred_contact"
                        value={formData.preferred_contact}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {CONTACT_METHODS.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ที่อยู่ *</label>
                      <textarea
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        rows={2}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                          formErrors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.location && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">อำเภอ *</label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleDistrictChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                            formErrors.district ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">เลือกอำเภอ</option>
                          {DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        {formErrors.district && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.district}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">ตำบล *</label>
                        <select
                          name="subdistrict"
                          value={formData.subdistrict}
                          onChange={handleInputChange}
                          disabled={!formData.district}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 disabled:bg-gray-100 ${
                            formErrors.subdistrict ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">เลือกตำบล</option>
                          {getSubdistricts(formData.district).map((subdistrict) => (
                            <option key={subdistrict} value={subdistrict}>
                              {subdistrict}
                            </option>
                          ))}
                        </select>
                        {formErrors.subdistrict && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.subdistrict}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">หมวดหมู่ *</label>
                      <select
                        name="service_category_id"
                        value={formData.service_category_id}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                          formErrors.service_category_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map((category: ServiceCategory) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.service_category_id && (
                        <p className="mt-1 text-sm text-red-600">กรุณาเลือกหมวดหมู่</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">รายละเอียดงาน *</label>
                      <textarea
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleInputChange}
                        rows={3}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                          formErrors.job_description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.job_description && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.job_description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">งบประมาณ</label>
                        <input
                          type="text"
                          name="budget_range"
                          value={formData.budget_range}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">ความเร่งด่วน</label>
                        <select
                          name="urgency_level"
                          value={formData.urgency_level}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          {URGENCY_LEVELS.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        เปิดใช้งาน
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createCustomerMutation.isLoading || updateCustomerMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createCustomerMutation.isLoading || updateCustomerMutation.isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeleteModalOpen(false)} />
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
                        คุณแน่ใจหรือไม่ที่จะลบลูกค้า "{selectedCustomer.name}" ข้อมูลนี้จะไม่สามารถกู้คืนได้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteCustomerMutation.isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteCustomerMutation.isLoading ? 'กำลังลบ...' : 'ลบ'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
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

export default AdminCustomers;