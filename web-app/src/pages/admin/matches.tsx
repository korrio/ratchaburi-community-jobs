import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Search,
  Filter,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BadgeCheck,
  X,
  Plus,
  Users,
  UserCheck,
  GitMerge,
  Zap,
  TrendingUp,
  BarChart3,
  DollarSign,
  PlayCircle,
  MapPin as MapPinIcon,
  Truck,
  Settings,
  CheckCircle2,
  Flag
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import ProviderQuestionnaire from '@/components/ProviderQuestionnaire';
import CustomerQuestionnaire from '@/components/CustomerQuestionnaire';
import { apiEndpoints } from '@/utils/api';
import { JobMatch, ServiceCategory, MatchStatusUpdateData } from '@/utils/types';
import { MATCH_STATUSES } from '@/utils/types';

const AdminMatches: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProviderQuestionnaireOpen, setIsProviderQuestionnaireOpen] = useState(false);
  const [isCustomerQuestionnaireOpen, setIsCustomerQuestionnaireOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'match_date' | 'match_score' | 'response_date'>('match_date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [updateData, setUpdateData] = useState<MatchStatusUpdateData>({
    status: 'pending',
    provider_response: '',
    customer_response: '',
    rating: undefined,
    feedback: ''
  });

  const [createMatchData, setCreateMatchData] = useState({
    provider_id: '',
    customer_id: ''
  });

  // Fetch matches
  const { data: matchesData, isLoading } = useQuery(
    ['admin-matches', currentPage, searchQuery, selectedStatus, selectedCategory, sortBy, sortOrder],
    () => apiEndpoints.getMatches({
      page: currentPage,
      limit: 10,
      status: selectedStatus || undefined,
      sort_by: sortBy,
      order: sortOrder
    }),
    { keepPreviousData: true }
  );

  // Fetch job progress data
  const { data: jobProgressData } = useQuery(
    'job-progress',
    () => apiEndpoints.getJobProgress(),
    { keepPreviousData: true }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => apiEndpoints.getCategories()
  );

  // Fetch providers for create modal
  const { data: providersData } = useQuery(
    'all-providers',
    () => apiEndpoints.getProviders({ limit: 1000 }),
    { enabled: isCreateModalOpen }
  );

  // Fetch customers for create modal
  const { data: customersData } = useQuery(
    'all-customers',
    () => apiEndpoints.getCustomers({ limit: 1000 }),
    { enabled: isCreateModalOpen }
  );

  // Update match status mutation
  const updateMatchMutation = useMutation(
    ({ id, data }: { id: string; data: MatchStatusUpdateData }) => apiEndpoints.updateMatchStatus(id, data),
    {
      onSuccess: (response, variables) => {
        queryClient.invalidateQueries('admin-matches');
        queryClient.invalidateQueries('job-progress');
        setIsModalOpen(false);
        
        // Trigger questionnaires when job is completed
        if (variables.data.status === 'completed') {
          // Show questionnaire modals after a brief delay
          setTimeout(() => {
            setIsProviderQuestionnaireOpen(true);
          }, 500);
          setTimeout(() => {
            setIsCustomerQuestionnaireOpen(true);
          }, 1000);
        } else {
          setSelectedMatch(null);
          resetUpdateData();
        }
      }
    }
  );

  // Create match mutation
  const createMatchMutation = useMutation(
    (data: any) => apiEndpoints.createMatch(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-matches');
        queryClient.invalidateQueries('job-progress');
        setIsCreateModalOpen(false);
        setCreateMatchData({ provider_id: '', customer_id: '' });
      }
    }
  );

  const matches = matchesData?.data?.data || [];
  const pagination = matchesData?.data?.pagination;
  const categories = categoriesData?.data?.data || [];
  const providers = providersData?.data?.data || [];
  const customers = customersData?.data?.data || [];
  const progressStageStats = jobProgressData?.data?.stage_stats || {};

  const resetUpdateData = () => {
    setUpdateData({
      status: 'pending',
      provider_response: '',
      customer_response: '',
      rating: undefined,
      feedback: ''
    });
  };

  const handleUpdateMatch = (match: JobMatch) => {
    setSelectedMatch(match);
    setUpdateData({
      status: match.status,
      provider_response: match.provider_response || '',
      customer_response: match.customer_response || '',
      rating: match.rating,
      feedback: match.feedback || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMatch) {
      // Clean the data to only include relevant fields
      const cleanData: MatchStatusUpdateData = {
        status: updateData.status,
        provider_response: updateData.provider_response,
        customer_response: updateData.customer_response
      };

      // Only include rating and feedback if status is completed
      if (updateData.status === 'completed') {
        if (updateData.rating && updateData.rating > 0) {
          cleanData.rating = updateData.rating;
        }
        if (updateData.feedback && updateData.feedback.trim() !== '') {
          cleanData.feedback = updateData.feedback;
        }
      }

      await updateMatchMutation.mutateAsync({
        id: selectedMatch.id.toString(),
        data: cleanData
      });
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMatchMutation.mutateAsync({
      provider_id: Number(createMatchData.provider_id),
      customer_id: Number(createMatchData.customer_id)
    });
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

  const getJobProgressStage = (matchId: number) => {
    if (!jobProgressData?.data?.data) return 'pending';
    const progressData = jobProgressData.data.data.find((p: any) => p?.id === matchId);
    return progressData?.job_progress || 'pending';
  };

  const getJobProgressSteps = (stage: string) => {
    const steps = [
      { key: 'pending', label: 'รอการตอบรับ', icon: Clock, color: 'gray' },
      { key: 'accepted', label: 'รับงานแล้ว', icon: CheckCircle, color: 'blue' },
      { key: 'arrived', label: 'ถึงหน้างาน', icon: MapPinIcon, color: 'orange' },
      { key: 'started', label: 'เริ่มดำเนินงาน', icon: PlayCircle, color: 'yellow' },
      { key: 'completed', label: 'เสร็จงาน', icon: CheckCircle2, color: 'green' },
      { key: 'closed', label: 'ปิดงาน', icon: Flag, color: 'purple' }
    ];

    const currentStepIndex = steps.findIndex(step => step.key === stage);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex,
      current: index === currentStepIndex
    }));
  };

  const renderJobProgressIndicator = (matchId: number) => {
    const stage = getJobProgressStage(matchId);
    const steps = getJobProgressSteps(stage);
    
    return (
      <div className="flex items-center space-x-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          let colorClass = 'text-gray-300';
          
          if (step.completed) {
            colorClass = {
              gray: 'text-gray-500',
              blue: 'text-blue-500',
              orange: 'text-orange-500',
              yellow: 'text-yellow-500',
              green: 'text-green-500',
              purple: 'text-purple-500'
            }[step.color] || 'text-gray-500';
          }
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`relative ${step.current ? 'animate-pulse' : ''}`}>
                <Icon className={`h-4 w-4 ${colorClass}`} />
                {step.current && (
                  <div className="absolute -inset-1 rounded-full border-2 border-blue-400 opacity-50 animate-ping" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-2 h-0.5 mx-1 ${
                  step.completed ? 'bg-blue-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getJobProgressText = (stage: string) => {
    const stageLabels = {
      pending: 'รอการตอบรับ',
      accepted: 'รับงานแล้ว',
      arrived: 'ถึงหน้างาน',
      started: 'เริ่มดำเนินงาน',
      completed: 'เสร็จงาน',
      closed: 'ปิดงาน'
    };
    return stageLabels[stage as keyof typeof stageLabels] || 'ไม่ระบุ';
  };

  return (
    <AdminLayout title="จัดการการจับคู่">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">จัดการการจับคู่</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            สร้างการจับคู่
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GitMerge className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">การจับคู่ทั้งหมด</p>
                <p className="text-2xl font-semibold text-gray-900">{pagination?.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">รับงานแล้ว</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {progressStageStats.accepted || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">ถึงหน้างาน</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {progressStageStats.arrived || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">กำลังทำงาน</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {progressStageStats.started || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">เสร็จงาน</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {progressStageStats.completed || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Flag className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">ปิดงาน</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {progressStageStats.closed || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ให้บริการหรือลูกค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
                <option value="match_date-DESC">วันที่จับคู่ (ล่าสุด)</option>
                <option value="match_score-DESC">คะแนนความเข้ากัน (สูงสุด)</option>
                <option value="response_date-DESC">วันที่ตอบกลับ (ล่าสุด)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Matches Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจับคู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คะแนนความเข้ากัน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ความคืบหน้างาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะปัจจุบัน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่จับคู่
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : matches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  matches.map((match: JobMatch) => {
                    const jobStage = getJobProgressStage(match.id);
                    return (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {match.provider_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                → {match.customer_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {match.category_icon} {match.category_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${match.match_score * 100}%` }}
                              />
                            </div>
                            <div className="ml-2 text-sm text-gray-900">
                              {(match.match_score * 100).toFixed(0)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {renderJobProgressIndicator(match.id)}
                            <div className="text-xs text-gray-500">
                              5 ขั้นตอน
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {getJobProgressText(jobStage)}
                            </div>
                            <div className="text-xs text-gray-500">
                              อัพเดท: {new Date().toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(match.match_date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUpdateMatch(match)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
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

      {/* Update Match Modal */}
      {isModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitUpdate}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      อัปเดตสถานะการจับคู่
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{selectedMatch.provider_name}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium">{selectedMatch.customer_name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedMatch.category_icon} {selectedMatch.category_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        คะแนนความเข้ากัน: {(selectedMatch.match_score * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        value={updateData.status}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {MATCH_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">การตอบกลับจากผู้ให้บริการ</label>
                      <textarea
                        value={updateData.provider_response}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, provider_response: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="ข้อความตอบกลับจากผู้ให้บริการ..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">การตอบกลับจากลูกค้า</label>
                      <textarea
                        value={updateData.customer_response}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, customer_response: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="ข้อความตอบกลับจากลูกค้า..."
                      />
                    </div>

                    {updateData.status === 'completed' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">คะแนน (1-5)</label>
                          <select
                            value={updateData.rating || ''}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, rating: e.target.value ? Number(e.target.value) : undefined }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          >
                            <option value="">ไม่ระบุคะแนน</option>
                            <option value="1">1 - แย่มาก</option>
                            <option value="2">2 - แย่</option>
                            <option value="3">3 - ปานกลาง</option>
                            <option value="4">4 - ดี</option>
                            <option value="5">5 - ดีมาก</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">ความคิดเห็น</label>
                          <textarea
                            value={updateData.feedback}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, feedback: e.target.value }))}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="ความคิดเห็นเกี่ยวกับการให้บริการ..."
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={updateMatchMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {updateMatchMutation.isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
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

      {/* Create Match Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCreateModalOpen(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitCreate}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      สร้างการจับคู่ใหม่
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ผู้ให้บริการ</label>
                      <select
                        value={createMatchData.provider_id}
                        onChange={(e) => setCreateMatchData(prev => ({ ...prev, provider_id: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">เลือกผู้ให้บริการ</option>
                        {providers.map((provider: any) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name} - {provider.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ลูกค้า</label>
                      <select
                        value={createMatchData.customer_id}
                        onChange={(e) => setCreateMatchData(prev => ({ ...prev, customer_id: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">เลือกลูกค้า</option>
                        {customers.map((customer: any) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMatchMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createMatchMutation.isLoading ? 'กำลังสร้าง...' : 'สร้าง'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
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

      {/* Provider Questionnaire */}
      {selectedMatch && (
        <ProviderQuestionnaire
          matchId={selectedMatch.id.toString()}
          customerName={selectedMatch.customer_name || ''}
          jobDescription={selectedMatch.job_description || ''}
          isOpen={isProviderQuestionnaireOpen}
          onClose={() => {
            setIsProviderQuestionnaireOpen(false);
            setSelectedMatch(null);
            resetUpdateData();
          }}
          onSubmit={() => {
            // Questionnaire submitted successfully
            console.log('Provider questionnaire submitted');
          }}
        />
      )}

      {/* Customer Questionnaire */}
      {selectedMatch && (
        <CustomerQuestionnaire
          matchId={selectedMatch.id.toString()}
          providerName={selectedMatch.provider_name || ''}
          jobDescription={selectedMatch.job_description || ''}
          serviceCategory={selectedMatch.category_name || ''}
          isOpen={isCustomerQuestionnaireOpen}
          onClose={() => {
            setIsCustomerQuestionnaireOpen(false);
            setSelectedMatch(null);
            resetUpdateData();
          }}
          onSubmit={() => {
            // Questionnaire submitted successfully
            console.log('Customer questionnaire submitted');
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminMatches;