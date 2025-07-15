import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  CheckCircle,
  Star,
  Clock,
  DollarSign,
  MessageCircle,
  User,
  Award,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import Layout from '@/components/Layout';
import ProviderQuestionnaire from '@/components/ProviderQuestionnaire';
import CustomerQuestionnaire from '@/components/CustomerQuestionnaire';
import { apiEndpoints } from '@/utils/api';
import { JobMatch } from '@/utils/types';

const JobCompletionPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<'provider' | 'customer' | null>(null);
  const [isProviderQuestionnaireOpen, setIsProviderQuestionnaireOpen] = useState(false);
  const [isCustomerQuestionnaireOpen, setIsCustomerQuestionnaireOpen] = useState(false);
  const [completionStep, setCompletionStep] = useState(1);

  // Fetch match details
  const { data: matchData, isLoading } = useQuery(
    ['match-detail', id],
    () => apiEndpoints.getMatch(id as string),
    {
      enabled: !!id
    }
  );

  const match: JobMatch = matchData?.data?.data;

  useEffect(() => {
    // Auto-trigger questionnaires when job is completed
    if (match && match.status === 'completed' && completionStep === 1) {
      setCompletionStep(2);
      // Show success message first, then questionnaires
      setTimeout(() => {
        setCompletionStep(3);
      }, 2000);
    }
  }, [match, completionStep]);

  const handleProviderQuestionnaireComplete = () => {
    setIsProviderQuestionnaireOpen(false);
    setActiveQuestionnaire('customer');
    setIsCustomerQuestionnaireOpen(true);
  };

  const handleCustomerQuestionnaireComplete = () => {
    setIsCustomerQuestionnaireOpen(false);
    setCompletionStep(4);
    
    // Redirect to home after completion
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (isLoading) {
    return (
      <Layout title="กำลังโหลด...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout title="ไม่พบข้อมูล">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบข้อมูลการจับคู่งาน</h1>
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="การทำงานเสร็จสิ้น">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Job Details */}
          {completionStep === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  การทำงานกำลังดำเนินการ
                </h1>
                <p className="text-gray-600">
                  รายละเอียดการจับคู่งาน
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">ข้อมูลผู้ให้บริการ</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.provider_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.provider_phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.provider_district}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">ข้อมูลลูกค้า</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.customer_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.customer_phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{match.customer_district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">รายละเอียดงาน</h3>
                  <p className="text-sm text-gray-600">{match.job_description}</p>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-500">หมวดหมู่:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {match.category_icon} {match.category_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Completion Success */}
          {completionStep === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  งานเสร็จสิ้นแล้ว!
                </h1>
                <p className="text-gray-600">
                  ขอบคุณที่ใช้บริการแพลตฟอร์มของเรา
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Questionnaire Selection */}
          {completionStep === 3 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ช่วยประเมินการให้บริการ
                </h1>
                <p className="text-gray-600">
                  กรุณาประเมินการให้บริการเพื่อปรับปรุงคุณภาพ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    สำหรับผู้ให้บริการ
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    แบบสอบถามหลังการให้บริการ รวมถึงข้อมูลการชำระเงิน
                  </p>
                  <button
                    onClick={() => {
                      setActiveQuestionnaire('provider');
                      setIsProviderQuestionnaireOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เริ่มแบบสอบถาม
                  </button>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    สำหรับลูกค้า
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    แบบประเมินความพึงพอใจและให้คะแนนการให้บริการ
                  </p>
                  <button
                    onClick={() => {
                      setActiveQuestionnaire('customer');
                      setIsCustomerQuestionnaireOpen(true);
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    เริ่มแบบประเมิน
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ข้ามไปหน้าหลัก
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Thank You */}
          {completionStep === 4 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ขอบคุณสำหรับการประเมิน!
                </h1>
                <p className="text-gray-600 mb-4">
                  ข้อมูลที่ท่านให้จะช่วยเราปรับปรุงการให้บริการ
                </p>
                <div className="text-sm text-gray-500">
                  กำลังนำท่านกลับไปหน้าหลัก...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Provider Questionnaire */}
      <ProviderQuestionnaire
        matchId={match.id.toString()}
        customerName={match.customer_name || ''}
        jobDescription={match.job_description || ''}
        isOpen={isProviderQuestionnaireOpen}
        onClose={() => setIsProviderQuestionnaireOpen(false)}
        onSubmit={handleProviderQuestionnaireComplete}
      />

      {/* Customer Questionnaire */}
      <CustomerQuestionnaire
        matchId={match.id.toString()}
        providerName={match.provider_name || ''}
        jobDescription={match.job_description || ''}
        serviceCategory={match.category_name || ''}
        isOpen={isCustomerQuestionnaireOpen}
        onClose={() => setIsCustomerQuestionnaireOpen(false)}
        onSubmit={handleCustomerQuestionnaireComplete}
      />
    </Layout>
  );
};

export default JobCompletionPage;