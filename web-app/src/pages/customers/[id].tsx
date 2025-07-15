import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  User,
  History,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BadgeCheck,
  Star,
  Zap
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { Customer, JobMatch } from '@/utils/types';
import { URGENCY_LEVELS, CONTACT_METHODS } from '@/utils/types';

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'history'>('overview');

  // Fetch customer details
  const { data: customerData, isLoading: isLoadingCustomer, error: customerError } = useQuery(
    ['customer', id],
    () => apiEndpoints.getCustomer(id as string),
    { enabled: !!id }
  );

  // Fetch customer's job matches
  const { data: matchesData, isLoading: isLoadingMatches } = useQuery(
    ['customer-matches', id],
    () => apiEndpoints.getMatches({ customer_id: Number(id), limit: 10 }),
    { enabled: !!id }
  );

  const customer = customerData?.data?.data;
  const matches = matchesData?.data?.data || [];

  if (isLoadingCustomer) {
    return (
      <Layout title="กำลังโหลด... - ราชบุรีงานชุมชน">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (customerError || !customer) {
    return (
      <Layout title="ไม่พบข้อมูล - ราชบุรีงานชุมชน">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ไม่พบข้อมูลงาน
            </h1>
            <p className="text-gray-600 mb-8">
              ขออภัย ไม่พบงานที่คุณกำลังค้นหา
            </p>
            <button
              onClick={() => router.push('/customers')}
              className="btn btn-primary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              กลับไปยังรายการงาน
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const getUrgencyConfig = (urgency: string) => {
    return URGENCY_LEVELS.find(u => u.value === urgency);
  };

  const getContactMethodConfig = (method: string) => {
    return CONTACT_METHODS.find(c => c.value === method);
  };

  const getUrgencyBadge = (urgency: string) => {
    const config = getUrgencyConfig(urgency);
    if (!config) return null;

    const colorClass = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    }[config.color];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        {config.label}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'accepted': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'accepted': return <BadgeCheck className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'สำเร็จ';
      case 'accepted': return 'ตอบรับแล้ว';
      case 'pending': return 'รอการตอบกลับ';
      case 'rejected': return 'ปฏิเสธ';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  return (
    <Layout title={`งาน: ${customer.name} - ราชบุรีงานชุมชน`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          กลับ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Customer Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {customer.name}
                  </h1>
                  <div className="flex items-center text-primary-600 font-medium mb-3">
                    <span className="text-2xl mr-2">{customer.category_icon}</span>
                    {customer.category_name}
                  </div>
                  <div className="flex items-center space-x-4">
                    {getUrgencyBadge(customer.urgency_level)}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      customer.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.is_active ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    โพสต์เมื่อ
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {new Date(customer.created_at).toLocaleDateString('th-TH')}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">รายละเอียดงาน</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {customer.job_description}
                  </p>
                </div>
              </div>

              {/* Location and Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">ที่อยู่</h3>
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{customer.location}</p>
                      <p className="text-sm text-gray-500">
                        {customer.district}, {customer.subdistrict}, {customer.province}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">ติดต่อ</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">{customer.phone}</span>
                    </div>
                    {customer.line_id && (
                      <div className="flex items-center text-gray-700">
                        <MessageCircle className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="font-medium">LINE: {customer.line_id}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-700">
                      <User className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">
                        ช่องทางที่ต้องการ: {getContactMethodConfig(customer.preferred_contact)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              {customer.budget_range && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">งบประมาณ</h3>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-lg font-medium text-primary-600">
                      {customer.budget_range}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 inline mr-2" />
                    ภาพรวม
                  </button>
                  <button
                    onClick={() => setActiveTab('matches')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'matches'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Zap className="h-4 w-4 inline mr-2" />
                    ผู้ให้บริการที่จับคู่ ({matches.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <History className="h-4 w-4 inline mr-2" />
                    ประวัติ
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Zap className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {matches.length}
                        </div>
                        <div className="text-gray-600">การจับคู่</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {matches.filter((m: any) => m.status === 'accepted').length}
                        </div>
                        <div className="text-gray-600">ตอบรับแล้ว</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {matches.filter((m: any) => m.status === 'pending').length}
                        </div>
                        <div className="text-gray-600">รอการตอบกลับ</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">รายละเอียดเพิ่มเติม</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">ระดับความเร่งด่วน:</span>
                          <div className="mt-1">
                            {getUrgencyBadge(customer.urgency_level)}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">ช่องทางการติดต่อที่ต้องการ:</span>
                          <div className="mt-1 text-sm font-medium text-gray-700">
                            {getContactMethodConfig(customer.preferred_contact)?.label}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">สถานะ:</span>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.is_active ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">อัปเดตล่าสุด:</span>
                          <div className="mt-1 text-sm font-medium text-gray-700">
                            {new Date(customer.updated_at).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'matches' && (
                  <div className="space-y-4">
                    {isLoadingMatches ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">กำลังโหลดข้อมูลการจับคู่...</p>
                      </div>
                    ) : matches.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">ยังไม่มีการจับคู่ผู้ให้บริการ</p>
                      </div>
                    ) : (
                      matches.map((match: JobMatch) => (
                        <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {match.provider_name}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {match.provider_district}, {match.provider_subdistrict}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-1" />
                                {match.provider_phone}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`flex items-center text-sm mb-2 ${getStatusColor(match.status)}`}>
                                {getStatusIcon(match.status)}
                                <span className="ml-1">{getStatusText(match.status)}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                คะแนนความเข้ากัน: {(match.match_score * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          
                          {match.provider_price_range && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-500">ราคา: </span>
                              <span className="text-sm font-medium text-primary-600">
                                {match.provider_price_range}
                              </span>
                            </div>
                          )}

                          {match.provider_rating && (
                            <div className="mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm font-medium">
                                  {match.provider_rating.toFixed(1)}/5
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-gray-500">
                            จับคู่เมื่อ: {new Date(match.match_date).toLocaleDateString('th-TH')}
                          </div>

                          {match.provider_response && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700 mb-1">
                                ผู้ให้บริการตอบกลับ:
                              </div>
                              <div className="text-sm text-gray-600">
                                {match.provider_response}
                              </div>
                            </div>
                          )}

                          {match.rating && match.feedback && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm font-medium">
                                  {match.rating}/5
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {match.feedback}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-900">โพสต์งาน</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(customer.created_at).toLocaleDateString('th-TH')} - งานนี้ถูกโพสต์
                      </div>
                    </div>
                    
                    {customer.updated_at !== customer.created_at && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium text-gray-900">อัปเดตข้อมูล</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {new Date(customer.updated_at).toLocaleDateString('th-TH')} - ข้อมูลงานถูกอัปเดต
                        </div>
                      </div>
                    )}

                    {matches.filter((m: any) => m.response_date).map((match: JobMatch) => (
                      <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          {getStatusIcon(match.status)}
                          <span className="ml-2 font-medium text-gray-900">
                            {match.provider_name} {getStatusText(match.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {match.response_date && new Date(match.response_date).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">ติดต่อเจ้าของงาน</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center justify-center w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  โทรเลย
                </a>
                {customer.line_id && (
                  <a
                    href={`https://line.me/ti/p/~${customer.line_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    LINE
                  </a>
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ข้อมูลงาน</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">หมวดหมู่</span>
                  <span className="font-medium">{customer.category_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ความเร่งด่วน</span>
                  <div>{getUrgencyBadge(customer.urgency_level)}</div>
                </div>
                {customer.budget_range && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">งบประมาณ</span>
                    <span className="font-medium text-primary-600">{customer.budget_range}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ช่องทางติดต่อ</span>
                  <span className="font-medium">{getContactMethodConfig(customer.preferred_contact)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">สถานะ</span>
                  <span className={`font-medium ${customer.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                    {customer.is_active ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">โพสต์เมื่อ</span>
                  <span className="font-medium">
                    {new Date(customer.created_at).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetailPage;