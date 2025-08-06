import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import {
  Users,
  UserCheck,
  GitMerge,
  Search,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  MessageCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiEndpoints } from '@/utils/api';
import { ServiceProvider, Customer, MatchStats } from '@/utils/types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured providers
  const { data: providersData } = useQuery('featured-providers', () =>
    apiEndpoints.getProviders({ limit: 6, sort_by: 'rating' })
  );

  // Fetch recent customers
  const { data: customersData } = useQuery('recent-customers', () =>
    apiEndpoints.getCustomers({ limit: 6, sort_by: 'created_at' })
  );

  // Fetch match statistics
  const { data: statsData } = useQuery('match-stats', () =>
    apiEndpoints.getMatchStats()
  );

  const featuredProviders = providersData?.data?.data || [];
  const recentCustomers = customersData?.data?.data || [];
  const stats = statsData?.data?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/providers?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <Layout title="JOB ชุมชน - แพลตฟอร์มจับคู่งานชุมชน">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              JOB ชุมชน
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              เชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชนราชบุรี
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex rounded-lg overflow-hidden shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาผู้ให้บริการ เช่น ช่างไฟฟ้า ช่างประปา..."
                  className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary-800 hover:bg-primary-900 px-6 py-2 text-white font-medium transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/providers"
                className="bg-white text-primary-700 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                <UserCheck className="h-5 w-5 mr-2" />
                ดูผู้ให้บริการ
              </Link>
              <Link
                href="/customers"
                className="bg-primary-800 hover:bg-primary-900 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Users className="h-5 w-5 mr-2" />
                ดูงานที่ต้องการจ้าง
              </Link>
              <a
                href="https://lin.ee/9G2yLV0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                คุยกับ Chatbot
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <UserCheck className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.total_matches}
                </div>
                <div className="text-gray-600">การจับคู่งาน</div>
              </div>
              <div className="text-center">
                <div className="bg-success-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.completed_matches}
                </div>
                <div className="text-gray-600">งานสำเร็จ</div>
              </div>
              <div className="text-center">
                <div className="bg-warning-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-warning-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.avg_rating.toFixed(1)}
                </div>
                <div className="text-gray-600">คะแนนเฉลี่ย</div>
              </div>
              <div className="text-center">
                <div className="bg-secondary-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-secondary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {(stats.avg_match_score * 100).toFixed(0)}%
                </div>
                <div className="text-gray-600">ความแม่นยำ</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Providers Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ผู้ให้บริการแนะนำ
            </h2>
            <p className="text-gray-600">
              ผู้ให้บริการที่ได้รับคะแนนสูงและมีประสบการณ์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProviders.map((provider: ServiceProvider) => (
              <div key={provider.id} className="bg-white rounded-lg shadow-md p-6">
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
                      {provider.rating}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {provider.district}, {provider.subdistrict}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {provider.phone}
                  </div>
                  {provider.price_range && (
                    <div className="text-sm text-gray-600">
                      ราคา: {provider.price_range}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    งานที่ทำ: {provider.total_jobs} งาน
                  </div>
                  <Link
                    href={`/providers/${provider.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    ดูรายละเอียด
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/providers"
              className="btn btn-primary btn-lg"
            >
              ดูผู้ให้บริการทั้งหมด
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Job Requests Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              งานที่ต้องการจ้างล่าสุด
            </h2>
            <p className="text-gray-600">
              รายการงานที่ผู้ใช้ต้องการจ้างคนทำ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentCustomers.map((customer: Customer) => (
              <div key={customer.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {customer.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {customer.category_icon} {customer.category_name}
                    </p>
                  </div>
                  <div className={`badge ${
                    customer.urgency_level === 'high' ? 'badge-error' :
                    customer.urgency_level === 'medium' ? 'badge-warning' :
                    'badge-success'
                  }`}>
                    {customer.urgency_level === 'high' ? 'เร่งด่วน' :
                     customer.urgency_level === 'medium' ? 'ปานกลาง' :
                     'ไม่เร่งด่วน'}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {customer.job_description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {customer.district}, {customer.subdistrict}
                  </div>
                  {customer.budget_range && (
                    <div className="text-sm text-gray-600">
                      ค่าจ้าง: {customer.budget_range}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(customer.created_at).toLocaleDateString('th-TH')}
                  </div>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    ดูรายละเอียด
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/customers"
              className="btn btn-primary btn-lg"
            >
              ดูงานทั้งหมด
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมจะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            ลงทะเบียนเป็นผู้ให้บริการหรือโพสต์งานที่ต้องการจ้างได้แล้ววันนี้
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/providers/register"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              ลงทะเบียนผู้ให้บริการ
            </Link>
            <Link
              href="/customers/register"
              className="bg-primary-800 hover:bg-primary-900 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              โพสต์งานที่ต้องการจ้าง
            </Link>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default HomePage;