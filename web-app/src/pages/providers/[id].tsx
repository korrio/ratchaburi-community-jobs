import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  BadgeCheck,
  Award,
  History,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { ServiceProvider, JobMatch } from '@/utils/types';

const ProviderDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'reviews'>('overview');

  // Fetch provider details
  const { data: providerData, isLoading: isLoadingProvider, error: providerError } = useQuery(
    ['provider', id],
    () => apiEndpoints.getProvider(Number(id)),
    { enabled: !!id }
  );

  // Fetch provider's job matches
  const { data: matchesData, isLoading: isLoadingMatches } = useQuery(
    ['provider-matches', id],
    () => apiEndpoints.getMatches({ provider_id: Number(id), limit: 10 }),
    { enabled: !!id }
  );

  const provider = providerData?.data?.data;
  const matches = matchesData?.data?.data || [];

  if (isLoadingProvider) {
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

  if (providerError || !provider) {
    return (
      <Layout title="ไม่พบข้อมูล - ราชบุรีงานชุมชน">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ไม่พบข้อมูลผู้ให้บริการ
            </h1>
            <p className="text-gray-600 mb-8">
              ขออภัย ไม่พบผู้ให้บริการที่คุณกำลังค้นหา
            </p>
            <button
              onClick={() => router.push('/providers')}
              className="btn btn-primary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              กลับไปยังรายการผู้ให้บริการ
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
    <Layout title={`${provider.name} - ราชบุรีงานชุมชน`}>
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
            {/* Provider Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {provider.name}
                  </h1>
                  <div className="flex items-center text-primary-600 font-medium mb-2">
                    <span className="text-2xl mr-2">{provider.category_icon}</span>
                    {provider.category_name}
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 text-lg font-medium">
                      {provider.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({provider.total_jobs} งาน)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    provider.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {provider.is_active ? 'พร้อมให้บริการ' : 'ไม่พร้อมให้บริการ'}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">{provider.location}</p>
                    <p className="text-sm text-gray-500">
                      {provider.district}, {provider.subdistrict}, {provider.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">{provider.phone}</p>
                    {provider.line_id && (
                      <p className="text-sm text-gray-500">
                        LINE: {provider.line_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability */}
              {(provider.available_days || provider.available_hours) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {provider.available_days && (
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium">วันที่ให้บริการ</p>
                        <p className="text-sm text-gray-500">
                          {provider.available_days}
                        </p>
                      </div>
                    </div>
                  )}
                  {provider.available_hours && (
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium">เวลาที่ให้บริการ</p>
                        <p className="text-sm text-gray-500">
                          {provider.available_hours}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Range */}
              {provider.price_range && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">ช่วงราคา</h3>
                  <p className="text-lg text-primary-600 font-medium">
                    {provider.price_range}
                  </p>
                </div>
              )}

              {/* Description */}
              {provider.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">รายละเอียด</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {provider.description}
                  </p>
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
                    onClick={() => setActiveTab('jobs')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'jobs'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <History className="h-4 w-4 inline mr-2" />
                    ประวัติงาน ({matches.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Star className="h-4 w-4 inline mr-2" />
                    รีวิว
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {provider.total_jobs}
                      </div>
                      <div className="text-gray-600">งานทั้งหมด</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {matches.filter(m => m.status === 'completed').length}
                      </div>
                      <div className="text-gray-600">งานสำเร็จ</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Star className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {provider.rating.toFixed(1)}
                      </div>
                      <div className="text-gray-600">คะแนนเฉลี่ย</div>
                    </div>
                  </div>
                )}

                {activeTab === 'jobs' && (
                  <div className="space-y-4">
                    {isLoadingMatches ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">กำลังโหลดประวัติงาน...</p>
                      </div>
                    ) : matches.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">ยังไม่มีประวัติงาน</p>
                      </div>
                    ) : (
                      matches.map((match: JobMatch) => (
                        <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {match.customer_name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {match.category_icon} {match.category_name}
                              </p>
                            </div>
                            <div className={`flex items-center text-sm ${getStatusColor(match.status)}`}>
                              {getStatusIcon(match.status)}
                              <span className="ml-1">{getStatusText(match.status)}</span>
                            </div>
                          </div>
                          {match.job_description && (
                            <p className="text-gray-700 text-sm mb-3">
                              {match.job_description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {match.customer_district}, {match.customer_subdistrict}
                            </div>
                            <div>
                              {new Date(match.match_date).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                          {match.rating && (
                            <div className="mt-2 flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="ml-1 text-sm font-medium">
                                {match.rating}/5
                              </span>
                              {match.feedback && (
                                <span className="ml-2 text-sm text-gray-600">
                                  - {match.feedback}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {matches.filter(m => m.rating && m.feedback).length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">ยังไม่มีรีวิว</p>
                      </div>
                    ) : (
                      matches
                        .filter(m => m.rating && m.feedback)
                        .map((match: JobMatch) => (
                          <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {match.customer_name}
                                </h4>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < (match.rating || 0)
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {match.rating}/5
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(match.completion_date || match.match_date).toLocaleDateString('th-TH')}
                              </div>
                            </div>
                            <p className="text-gray-700">
                              {match.feedback}
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">ติดต่อผู้ให้บริการ</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center justify-center w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  โทรเลย
                </a>
                {provider.line_id && (
                  <a
                    href={`https://line.me/ti/p/~${provider.line_id}`}
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

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">สถิติ</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">งานทั้งหมด</span>
                  <span className="font-medium">{provider.total_jobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">คะแนนเฉลี่ย</span>
                  <span className="font-medium">{provider.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">งานสำเร็จ</span>
                  <span className="font-medium">
                    {matches.filter(m => m.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">สมาชิกเมื่อ</span>
                  <span className="font-medium">
                    {new Date(provider.created_at).toLocaleDateString('th-TH')}
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

export default ProviderDetailPage;