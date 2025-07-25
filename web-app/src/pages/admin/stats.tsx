import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  TrendingUp,
  Users,
  UserCheck,
  GitMerge,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { apiEndpoints } from '@/utils/api';
import { ServiceProvider, Customer, JobMatch, ServiceCategory } from '@/utils/types';

const AdminStats: React.FC = () => {
  const [dateRange, setDateRange] = useState('30'); // days
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const getDateRange = (days: string) => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - parseInt(days));
    return {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  // Fetch statistics
  const { data: statsData, isLoading: isLoadingStats, refetch: refetchStats } = useQuery(
    ['match-stats', dateRange],
    () => apiEndpoints.getMatchStats()
  );

  // Fetch providers
  const { data: providersData, isLoading: isLoadingProviders } = useQuery(
    'stats-providers',
    () => apiEndpoints.getProviders({ limit: 1000 })
  );

  // Fetch customers
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    'stats-customers',
    () => apiEndpoints.getCustomers({ limit: 1000 })
  );

  // Fetch matches
  const { data: matchesData, isLoading: isLoadingMatches } = useQuery(
    'stats-matches',
    () => apiEndpoints.getMatches({ limit: 1000 })
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  const stats = statsData?.data?.data;
  const providers = providersData?.data?.data || [];
  const customers = customersData?.data?.data || [];
  const matches = matchesData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];

  // Calculate additional statistics
  const totalProviders = providers.length;
  const activeProviders = providers.filter((p: ServiceProvider) => p.is_active).length;
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c: Customer) => c.is_active).length;
  const totalMatches = matches.length;

  // Match status distribution
  const matchStatusDistribution = {
    pending: matches.filter((m: JobMatch) => m.status === 'pending').length,
    accepted: matches.filter((m: JobMatch) => m.status === 'accepted').length,
    completed: matches.filter((m: JobMatch) => m.status === 'completed').length,
    rejected: matches.filter((m: JobMatch) => m.status === 'rejected').length,
    cancelled: matches.filter((m: JobMatch) => m.status === 'cancelled').length
  };

  // Category distribution
  const categoryStats = categories.map((category: ServiceCategory) => ({
    ...category,
    providers: providers.filter((p: ServiceProvider) => p.service_category_id === category.id).length,
    customers: customers.filter((c: Customer) => c.service_category_id === category.id).length,
    matches: matches.filter((m: JobMatch) => m.category_name === category.name).length
  }));

  // District distribution
  const districtStats = Array.from(new Set(providers.map((p: ServiceProvider) => p.district)) as Set<string>).map((district: string) => ({
    district,
    providers: providers.filter((p: ServiceProvider) => p.district === district).length,
    customers: customers.filter((c: Customer) => c.district === district).length,
    matches: matches.filter((m: JobMatch) => m.provider_district === district || m.customer_district === district).length
  }));

  // Rating distribution
  const ratingDistribution = {
    1: matches.filter((m: JobMatch) => m.rating === 1).length,
    2: matches.filter((m: JobMatch) => m.rating === 2).length,
    3: matches.filter((m: JobMatch) => m.rating === 3).length,
    4: matches.filter((m: JobMatch) => m.rating === 4).length,
    5: matches.filter((m: JobMatch) => m.rating === 5).length
  };

  // Top performers
  const topProviders = providers
    .sort((a: ServiceProvider, b: ServiceProvider) => b.rating - a.rating)
    .slice(0, 10);

  const topCustomers = customers
    .sort((a: Customer, b: Customer) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting statistics...');
  };

  const handleRefresh = () => {
    refetchStats();
  };

  const isLoading = isLoadingStats || isLoadingProviders || isLoadingCustomers || isLoadingMatches;

  return (
    <AdminLayout title="สถิติและรายงาน">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">สถิติและรายงาน</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              รีเฟรช
            </button>
            <button
              onClick={handleExport}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
            >
              <Download className="h-5 w-5 mr-2" />
              ส่งออก
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ช่วงเวลา
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="1">วันนี้</option>
                <option value="7">7 วันล่าสุด</option>
                <option value="30">30 วันล่าสุด</option>
                <option value="90">90 วันล่าสุด</option>
                <option value="365">1 ปีล่าสุด</option>
                <option value="all">ทั้งหมด</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map((category: any) => (
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
                {districtStats.map((district) => (
                  <option key={district.district} value={district.district}>
                    {district.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
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
                      {isLoading ? '...' : totalProviders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  {isLoading ? '...' : activeProviders}
                </span>
                <span className="text-gray-500"> ใช้งาน</span>
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
                      {isLoading ? '...' : totalCustomers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  {isLoading ? '...' : activeCustomers}
                </span>
                <span className="text-gray-500"> ใช้งาน</span>
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
                      {isLoading ? '...' : totalMatches}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  {isLoading ? '...' : matchStatusDistribution.completed}
                </span>
                <span className="text-gray-500"> สำเร็จ</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      คะแนนเฉลี่ย
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? '...' : (stats?.avg_rating || 0).toFixed(1)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-gray-500">จาก 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">การกระจายสถานะการจับคู่</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-700">รอการตอบกลับ</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${totalMatches > 0 ? (matchStatusDistribution.pending / totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {matchStatusDistribution.pending}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">ตอบรับแล้ว</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${totalMatches > 0 ? (matchStatusDistribution.accepted / totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {matchStatusDistribution.accepted}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">สำเร็จ</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${totalMatches > 0 ? (matchStatusDistribution.completed / totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {matchStatusDistribution.completed}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-gray-700">ปฏิเสธ</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${totalMatches > 0 ? (matchStatusDistribution.rejected / totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {matchStatusDistribution.rejected}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">ยกเลิก</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full"
                      style={{ width: `${totalMatches > 0 ? (matchStatusDistribution.cancelled / totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {matchStatusDistribution.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">การกระจายคะแนน</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-700">{rating} ดาว</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ 
                          width: `${matches.filter((m: JobMatch) => m.rating).length > 0 ? 
                            (ratingDistribution[rating as keyof typeof ratingDistribution] / matches.filter((m: JobMatch) => m.rating).length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">สถิติตามหมวดหมู่</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ให้บริการ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจับคู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อัตราความสำเร็จ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryStats.map((category: any) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.icon} {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.providers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.customers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.matches}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.matches > 0 ? 
                          ((matches.filter((m: JobMatch) => m.category_name === category.name && m.status === 'completed').length / category.matches) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* District Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">สถิติตามอำเภอ</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อำเภอ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ให้บริการ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจับคู่
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {districtStats.map((district) => (
                  <tr key={district.district}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {district.district}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{district.providers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{district.customers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{district.matches}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ผู้ให้บริการยอดเยี่ยม</h3>
            <div className="space-y-3">
              {topProviders.slice(0, 5).map((provider: ServiceProvider, index: number) => (
                <div key={provider.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-sm text-gray-500">{provider.category_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ลูกค้าใหม่ล่าสุด</h3>
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((customer: Customer, index: number) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.category_name}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString('th-TH')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;