import React from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  GitMerge,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { apiEndpoints } from '@/utils/api';

const AdminDashboard: React.FC = () => {
  // Fetch statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery(
    'admin-stats',
    () => apiEndpoints.getMatchStats()
  );

  // Fetch recent providers
  const { data: providersData, isLoading: isLoadingProviders } = useQuery(
    'admin-recent-providers',
    () => apiEndpoints.getProviders({ limit: 5, sort_by: 'created_at', order: 'DESC' })
  );

  // Fetch recent customers
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    'admin-recent-customers',
    () => apiEndpoints.getCustomers({ limit: 5, sort_by: 'created_at', order: 'DESC' })
  );

  // Fetch recent matches
  const { data: matchesData, isLoading: isLoadingMatches } = useQuery(
    'admin-recent-matches',
    () => apiEndpoints.getMatches({ limit: 5, sort_by: 'match_date', order: 'DESC' })
  );

  const stats = statsData?.data?.data;
  const providers = providersData?.data?.data || [];
  const customers = customersData?.data?.data || [];
  const matches = matchesData?.data?.data || [];

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
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      ผู้ให้บริการ
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingStats ? '...' : providersData?.data?.pagination?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/providers" className="font-medium text-blue-700 hover:text-blue-900">
                  จัดการผู้ให้บริการ
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      ลูกค้า
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingStats ? '...' : customersData?.data?.pagination?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/customers" className="font-medium text-green-700 hover:text-green-900">
                  จัดการลูกค้า
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GitMerge className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      การจับคู่
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingStats ? '...' : stats?.total_matches || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/matches" className="font-medium text-purple-700 hover:text-purple-900">
                  จัดการการจับคู่
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      งานสำเร็จ
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingStats ? '...' : stats?.completed_matches || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/stats" className="font-medium text-orange-700 hover:text-orange-900">
                  ดูสถิติทั้งหมด
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        {stats && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">สถิติการจับคู่</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending_matches}</div>
                <div className="text-sm text-gray-600">รอการตอบกลับ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.accepted_matches}</div>
                <div className="text-sm text-gray-600">ตอบรับแล้ว</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed_matches}</div>
                <div className="text-sm text-gray-600">สำเร็จ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected_matches}</div>
                <div className="text-sm text-gray-600">ปฏิเสธ</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">คะแนนความแม่นยำเฉลี่ย</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {(stats.avg_match_score * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.avg_rating.toFixed(1)}/5.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Providers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">ผู้ให้บริการใหม่</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {isLoadingProviders ? (
                <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>
              ) : providers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">ไม่มีข้อมูล</div>
              ) : (
                providers.map((provider: any) => (
                  <div key={provider.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-600">
                          {provider.category_icon} {provider.category_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {provider.district}, {provider.subdistrict}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(provider.created_at).toLocaleDateString('th-TH')}
                        </div>
                        <div className={`text-sm ${provider.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {provider.is_active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <Link href="/admin/providers" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ดูทั้งหมด →
              </Link>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">งานใหม่</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {isLoadingCustomers ? (
                <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>
              ) : customers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">ไม่มีข้อมูล</div>
              ) : (
                customers.map((customer: any) => (
                  <div key={customer.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{customer.name}</h4>
                        <p className="text-sm text-gray-600">
                          {customer.category_icon} {customer.category_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {customer.job_description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString('th-TH')}
                        </div>
                        <div className={`text-sm ${
                          customer.urgency_level === 'high' ? 'text-red-600' :
                          customer.urgency_level === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {customer.urgency_level === 'high' ? 'เร่งด่วน' :
                           customer.urgency_level === 'medium' ? 'ปานกลาง' :
                           'ไม่เร่งด่วน'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <Link href="/admin/customers" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ดูทั้งหมด →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">การจับคู่ล่าสุด</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoadingMatches ? (
              <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>
            ) : matches.length === 0 ? (
              <div className="p-6 text-center text-gray-500">ไม่มีข้อมูล</div>
            ) : (
              matches.map((match: any) => (
                <div key={match.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{match.provider_name}</h4>
                        <span className="mx-2 text-gray-400">↔</span>
                        <h4 className="font-medium text-gray-900">{match.customer_name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {match.category_icon} {match.category_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        คะแนนความเข้ากัน: {(match.match_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-sm ${getStatusColor(match.status)}`}>
                        {getStatusIcon(match.status)}
                        <span className="ml-1">
                          {match.status === 'pending' ? 'รอการตอบกลับ' :
                           match.status === 'accepted' ? 'ตอบรับแล้ว' :
                           match.status === 'completed' ? 'สำเร็จ' :
                           match.status === 'rejected' ? 'ปฏิเสธ' : 'ยกเลิก'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(match.match_date).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link href="/admin/matches" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              ดูทั้งหมด →
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;