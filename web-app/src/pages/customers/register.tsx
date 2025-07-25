import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from 'react-query';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Save,
  Clock
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { CustomerFormData, CustomerFormErrors, ServiceCategory } from '@/utils/types';
import { DISTRICTS, SUBDISTRICTS, URGENCY_LEVELS, CONTACT_METHODS } from '@/utils/types';

const CustomerRegisterPage: React.FC = () => {
  const router = useRouter();
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
    preferred_date: '',
    preferred_time: '',
    urgency_level: 'medium',
    preferred_contact: 'phone',
    is_active: true
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  // Submit mutation
  const createCustomerMutation = useMutation(
    (data: CustomerFormData) => apiEndpoints.createCustomer(data),
    {
      onSuccess: (response) => {
        if (response.data.success) {
          router.push(`/customers/${response.data.data.id}`);
        }
      },
      onError: (error: any) => {
        console.error('Registration failed:', error);
      }
    }
  );

  const categories = categoriesData?.data?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CustomerFormErrors]) {
      setErrors(prev => ({
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
      subdistrict: '' // Reset subdistrict when district changes
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
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createCustomerMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubdistricts = (district: string) => {
    return SUBDISTRICTS[district] || [];
  };

  return (
    <Layout title="โพสต์งานที่ต้องการจ้าง - JOB ชุมชน">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            กลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            โพสต์งานที่ต้องการจ้าง
          </h1>
          <p className="text-gray-600">
            ลงประกาศหาผู้ให้บริการที่ตรงกับความต้องการของคุณ
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              ข้อมูลผู้ติดต่อ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="08X-XXX-XXXX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LINE ID (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  name="line_id"
                  value={formData.line_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="@your-line-id"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ช่องทางการติดต่อที่ต้องการ *
                </label>
                <select
                  name="preferred_contact"
                  value={formData.preferred_contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {CONTACT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              ที่อยู่งาน
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่เต็ม *
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="เลขที่ หมู่ ตรอก/ซอย ถนน..."
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อำเภอ *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">เลือกอำเภอ</option>
                    {DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตำบล *
                  </label>
                  <select
                    name="subdistrict"
                    value={formData.subdistrict}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                      errors.subdistrict ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">เลือกตำบล</option>
                    {getSubdistricts(formData.district).map((subdistrict) => (
                      <option key={subdistrict} value={subdistrict}>
                        {subdistrict}
                      </option>
                    ))}
                  </select>
                  {errors.subdistrict && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.subdistrict}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              รายละเอียดงาน
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่งาน *
                </label>
                <select
                  name="service_category_id"
                  value={formData.service_category_id}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.service_category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">เลือกประเภทงาน</option>
                  {categories.map((category: ServiceCategory) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.service_category_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    กรุณาเลือกหมวดหมู่งาน
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียดงาน *
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.job_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="อธิบายรายละเอียดงานที่ต้องการจ้าง เช่น ประเภทงาน ขนาดงาน เงื่อนไขเฉพาะ ฯลฯ"
                />
                {errors.job_description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.job_description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    งบประมาณ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="เช่น 1,000-2,000 บาท หรือ ตามตกลง"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ความเร่งด่วน *
                  </label>
                  <select
                    name="urgency_level"
                    value={formData.urgency_level}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {URGENCY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Time Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    วันที่ต้องการจ้าง (ไม่บังคับ)
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.preferred_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.preferred_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.preferred_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    เวลาที่ต้องการจ้าง (ไม่บังคับ)
                  </label>
                  <input
                    type="time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.preferred_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferred_time && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.preferred_time}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    ระบุช่วงเวลาที่ต้องการให้เริ่มงาน
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              สถานะ
            </h2>
            
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
                เปิดรับสมัคร
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              เมื่อเลือกช่องนี้ งานของคุณจะแสดงในระบบและรับการจับคู่กับผู้ให้บริการ
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  โพสต์งาน
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {createCustomerMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    เกิดข้อผิดพลาด
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    ไม่สามารถโพสต์งานได้ กรุณาลองใหม่อีกครั้ง
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {createCustomerMutation.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    สำเร็จ!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    งานของคุณถูกโพสต์เรียบร้อยแล้ว
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default CustomerRegisterPage;