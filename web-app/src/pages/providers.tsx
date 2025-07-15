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
  SlidersHorizontal
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { ServiceProvider, ServiceCategory, ProviderFilters } from '@/utils/types';
import { DISTRICTS, SUBDISTRICTS } from '@/utils/types';

const ProvidersPage: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProviderFilters>({
    page: 1,
    limit: 12,
    sort_by: 'rating',
    order: 'DESC'
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const query = router.query;
    setFilters(prev => ({
      ...prev,
      search: query.search as string || '',
      category_id: query.category_id ? Number(query.category_id) : undefined,
      district: query.district as string || '',
      subdistrict: query.subdistrict as string || '',
      page: query.page ? Number(query.page) : 1
    }));
  }, [router.query]);

  // Fetch providers
  const { data: providersData, isLoading, error } = useQuery(
    ['providers', filters],
    () => apiEndpoints.getProviders(filters),
    { keepPreviousData: true }
  );

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  const providers = providersData?.data?.data || [];
  const pagination = providersData?.data?.pagination;
  const categories = categoriesData?.data?.data || [];

  const handleFilterChange = (key: keyof ProviderFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL
    const query = Object.entries(newFilters)
      .filter(([_, v]) => v !== undefined && v !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    
    router.push({ pathname: '/providers', query }, undefined, { shallow: true });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: 12,
      sort_by: 'rating' as const,
      order: 'DESC' as const
    };
    setFilters(clearedFilters);
    router.push('/providers', undefined, { shallow: true });
  };

  const getSubdistricts = (district: string) => {
    return SUBDISTRICTS[district] || [];
  };

  return (
    <Layout title="ผู้ให้บริการ - ราชบุรีงานชุมชน">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ผู้ให้บริการ
          </h1>
          <p className="text-gray-600">
            ค้นหาและติดต่อผู้ให้บริการที่เชื่อถือได้ในชุมชนราชบุรี
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ให้บริการ..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    value={filters.category_id || ''}
                    onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
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

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อำเภอ
                  </label>
                  <select
                    value={filters.district || ''}
                    onChange={(e) => {
                      handleFilterChange('district', e.target.value);
                      handleFilterChange('subdistrict', '');
                    }}
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

                {/* Subdistrict Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตำบล
                  </label>
                  <select
                    value={filters.subdistrict || ''}
                    onChange={(e) => handleFilterChange('subdistrict', e.target.value)}
                    disabled={!filters.district}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">ทุกตำบล</option>
                    {filters.district && getSubdistricts(filters.district).map((subdistrict) => (
                      <option key={subdistrict} value={subdistrict}>
                        {subdistrict}
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
                    <option value="rating-DESC">คะแนนสูงสุด</option>
                    <option value="total_jobs-DESC">งานที่ทำมากที่สุด</option>
                    <option value="name-ASC">ชื่อ A-Z</option>
                    <option value="created_at-DESC">ล่าสุด</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? 'กำลังค้นหา...' : 
             error ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' :
             `พบ ${pagination?.total || 0} ผู้ให้บริการ`}
          </p>
        </div>

        {/* Providers Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
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
        ) : providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">ไม่พบผู้ให้บริการที่ตรงกับเงื่อนไขการค้นหา</p>
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
            {providers.map((provider: ServiceProvider) => (
              <div
                key={provider.id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {provider.name}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {provider.category_icon} {provider.category_name}
                      </p>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {provider.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{provider.district}, {provider.subdistrict}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{provider.phone}</span>
                    </div>
                    {provider.price_range && (
                      <div className="text-sm text-gray-600">
                        ราคา: {provider.price_range}
                      </div>
                    )}
                  </div>

                  {provider.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {provider.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      งานที่ทำ: {provider.total_jobs} งาน
                    </div>
                    <button
                      onClick={() => router.push(`/providers/${provider.id}`)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                    >
                      ดูรายละเอียด
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
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

export default ProvidersPage;