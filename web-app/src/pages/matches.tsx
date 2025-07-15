import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BadgeCheck,
  User,
  MessageCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { JobMatch, ServiceCategory, MatchFilters } from '@/utils/types';
import { MATCH_STATUSES } from '@/utils/types';

const MatchesPage: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>({
    page: 1,
    limit: 12,
    sort_by: 'match_date',
    order: 'DESC'
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const query = router.query;
    setFilters(prev => ({
      ...prev,
      status: query.status as 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' || undefined,
      provider_id: query.provider_id ? Number(query.provider_id) : undefined,
      customer_id: query.customer_id ? Number(query.customer_id) : undefined,
      page: query.page ? Number(query.page) : 1
    }));
  }, [router.query]);

  // Fetch matches
  const { data: matchesData, isLoading, error } = useQuery(
    ['matches', filters],
    () => apiEndpoints.getMatches(filters),
    { keepPreviousData: true }
  );

  // Fetch auto-matches (suggested matches)
  const { data: autoMatchesData } = useQuery(
    'auto-matches',
    () => apiEndpoints.getAutoMatches()
  );

  // Fetch categories for display
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  const matches = matchesData?.data?.data || [];
  const autoMatches = autoMatchesData?.data?.data || [];
  const pagination = matchesData?.data?.pagination;
  const categories = categoriesData?.data?.data || [];

  const handleFilterChange = (key: keyof MatchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL
    const query = Object.entries(newFilters)
      .filter(([_, v]) => v !== undefined && String(v) !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    
    router.push({ pathname: '/matches', query }, undefined, { shallow: true });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: 12,
      sort_by: 'match_date' as const,
      order: 'DESC' as const
    };
    setFilters(clearedFilters);
    router.push('/matches', undefined, { shallow: true });
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
    const statusConfig = MATCH_STATUSES.find(s => s.value === status);
    return statusConfig ? statusConfig.label : status;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = MATCH_STATUSES.find(s => s.value === status);
    if (!statusConfig) return null;

    const colorClass = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    }[statusConfig.color];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusConfig.label}</span>
      </span>
    );
  };

  return (
    <Layout title="การจับคู่งาน - ราชบุรีงานชุมชน">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            การจับคู่งาน
          </h1>
          <p className="text-gray-600">
            ติดตามสถานะการจับคู่งานระหว่างผู้ให้บริการและลูกค้า
          </p>
        </div>

        {/* Auto-matches Section */}
        {autoMatches.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                การจับคู่อัตโนมัติ
              </h2>
              <span className="ml-2 bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {autoMatches.length} รายการ
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              การจับคู่ที่ระบบแนะนำจากความเข้ากันได้สูง
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {autoMatches.slice(0, 3).map((match: JobMatch) => (
                <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-primary-100 rounded-full p-2 mr-3">
                        <Award className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {match.provider_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {match.category_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary-600">
                        {(match.match_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        ความเข้ากัน
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    งาน: {match.customer_name}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {match.provider_district}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              ตัวกรอง
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานะ
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">ทุกสถานะ</option>
                    {MATCH_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เรียงตาม
                  </label>
                  <select
                    value={`${filters.sort_by}-${filters.order}`}
                    onChange={(e) => {
                      const [sort_by, order] = e.target.value.split('-');
                      handleFilterChange('sort_by', sort_by);
                      handleFilterChange('order', order);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="match_date-DESC">วันที่จับคู่ (ล่าสุด)</option>
                    <option value="match_score-DESC">คะแนนความเข้ากัน (สูงสุด)</option>
                    <option value="response_date-DESC">วันที่ตอบกลับ (ล่าสุด)</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? 'กำลังโหลด...' : 
             error ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' :
             `พบ ${pagination?.total || 0} การจับคู่`}
          </p>
        </div>

        {/* Matches Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">ไม่พบการจับคู่งาน</p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {matches.map((match: JobMatch) => (
              <div
                key={match.id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex items-start space-x-6' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {match.provider_name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-1">
                        {match.category_icon} {match.category_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        งาน: {match.customer_name}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      {getStatusBadge(match.status)}
                      <div className="mt-1 text-sm text-gray-500">
                        คะแนน: {(match.match_score * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {match.job_description && (
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {match.job_description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">ผู้ให้บริการ</h4>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.provider_district}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {match.provider_phone}
                        </div>
                        {match.provider_rating && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                            {match.provider_rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">ลูกค้า</h4>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.customer_district}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {match.customer_phone}
                        </div>
                        {match.urgency_level && (
                          <div className="text-sm text-gray-600">
                            ความเร่งด่วน: {
                              match.urgency_level === 'high' ? 'สูง' :
                              match.urgency_level === 'medium' ? 'กลาง' : 'ต่ำ'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {match.provider_response && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        การตอบกลับ:
                      </div>
                      <div className="text-sm text-gray-600">
                        {match.provider_response}
                      </div>
                    </div>
                  )}

                  {match.rating && match.feedback && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">
                          {match.rating}/5
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {match.feedback}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      จับคู่เมื่อ: {new Date(match.match_date).toLocaleDateString('th-TH')}
                    </div>
                    {match.response_date && (
                      <div>
                        ตอบกลับ: {new Date(match.response_date).toLocaleDateString('th-TH')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      pagination.page === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;