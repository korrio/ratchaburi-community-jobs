import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  X,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  UserCheck,
  Award,
  Heart,
  Zap
} from 'lucide-react';
import { apiEndpoints } from '@/utils/api';

interface CustomerQuestionnaireProps {
  matchId: string;
  providerName: string;
  jobDescription: string;
  serviceCategory: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface CustomerQuestionnaireData {
  service_rating: number;
  service_quality: number;
  timeliness: number;
  communication: number;
  professionalism: number;
  value_for_money: number;
  overall_satisfaction: number;
  would_recommend: boolean;
  would_hire_again: boolean;
  completion_time: 'faster' | 'on_time' | 'slower';
  price_fairness: 'cheap' | 'fair' | 'expensive';
  service_exceeded_expectations: boolean;
  positive_feedback: string;
  areas_for_improvement: string;
  additional_services_received: string;
  problems_encountered: string;
  recommendation_reason: string;
  overall_experience_description: string;
  favorite_aspect: string;
  suggestion_for_provider: string;
  platform_feedback: string;
}

const CustomerQuestionnaire: React.FC<CustomerQuestionnaireProps> = ({
  matchId,
  providerName,
  jobDescription,
  serviceCategory,
  isOpen,
  onClose,
  onSubmit
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CustomerQuestionnaireData>({
    service_rating: 5,
    service_quality: 5,
    timeliness: 5,
    communication: 5,
    professionalism: 5,
    value_for_money: 5,
    overall_satisfaction: 5,
    would_recommend: true,
    would_hire_again: true,
    completion_time: 'on_time',
    price_fairness: 'fair',
    service_exceeded_expectations: true,
    positive_feedback: '',
    areas_for_improvement: '',
    additional_services_received: '',
    problems_encountered: '',
    recommendation_reason: '',
    overall_experience_description: '',
    favorite_aspect: '',
    suggestion_for_provider: '',
    platform_feedback: ''
  });

  const submitQuestionnaireMutation = useMutation(
    (data: any) => apiEndpoints.submitCustomerQuestionnaire?.(matchId, data) || Promise.resolve(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['matches']);
        onSubmit();
        onClose();
      }
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuestionnaireMutation.mutateAsync(formData);
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void, label: string) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-1 ${
              rating <= value ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value} ดาว
        </span>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  แบบประเมินการให้บริการ
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">ข้อมูลการให้บริการ</h4>
                <p className="text-sm text-gray-600">ผู้ให้บริการ: {providerName}</p>
                <p className="text-sm text-gray-600">ประเภทงาน: {serviceCategory}</p>
                <p className="text-sm text-gray-600">รายละเอียด: {jobDescription}</p>
              </div>

              {/* Service Rating Section */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  คะแนนการให้บริการ
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {renderStarRating(
                      formData.service_rating,
                      (rating) => setFormData(prev => ({ ...prev, service_rating: rating })),
                      'คะแนนโดยรวม'
                    )}
                    
                    {renderStarRating(
                      formData.service_quality,
                      (rating) => setFormData(prev => ({ ...prev, service_quality: rating })),
                      'คุณภาพการให้บริการ'
                    )}
                    
                    {renderStarRating(
                      formData.timeliness,
                      (rating) => setFormData(prev => ({ ...prev, timeliness: rating })),
                      'ความตรงต่อเวลา'
                    )}
                    
                    {renderStarRating(
                      formData.communication,
                      (rating) => setFormData(prev => ({ ...prev, communication: rating })),
                      'การสื่อสาร'
                    )}
                  </div>
                  
                  <div>
                    {renderStarRating(
                      formData.professionalism,
                      (rating) => setFormData(prev => ({ ...prev, professionalism: rating })),
                      'ความเป็นมืออาชีพ'
                    )}
                    
                    {renderStarRating(
                      formData.value_for_money,
                      (rating) => setFormData(prev => ({ ...prev, value_for_money: rating })),
                      'ความคุ้มค่าของเงิน'
                    )}
                    
                    {renderStarRating(
                      formData.overall_satisfaction,
                      (rating) => setFormData(prev => ({ ...prev, overall_satisfaction: rating })),
                      'ความพึงพอใจโดยรวม'
                    )}
                  </div>
                </div>
              </div>

              {/* Service Assessment */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  การประเมินบริการ
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ระยะเวลาการทำงาน
                    </label>
                    <select
                      name="completion_time"
                      value={formData.completion_time}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="faster">เร็วกว่าที่คาด</option>
                      <option value="on_time">ตรงเวลาที่กำหนด</option>
                      <option value="slower">ช้ากว่าที่คาด</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ความเหมาะสมของราคา
                    </label>
                    <select
                      name="price_fairness"
                      value={formData.price_fairness}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="cheap">ถูกกว่าที่คาด</option>
                      <option value="fair">เหมาะสมกับคุณภาพ</option>
                      <option value="expensive">แพงกว่าที่คาด</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="service_exceeded_expectations"
                      name="service_exceeded_expectations"
                      checked={formData.service_exceeded_expectations}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="service_exceeded_expectations" className="ml-2 block text-sm text-gray-900">
                      การให้บริการเกินความคาดหวัง
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="would_recommend"
                      name="would_recommend"
                      checked={formData.would_recommend}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="would_recommend" className="ml-2 block text-sm text-gray-900">
                      จะแนะนำให้คนอื่นใช้บริการ
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="would_hire_again"
                      name="would_hire_again"
                      checked={formData.would_hire_again}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="would_hire_again" className="ml-2 block text-sm text-gray-900">
                      จะจ้างผู้ให้บริการรายนี้อีก
                    </label>
                  </div>
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  ความคิดเห็นรายละเอียด
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      สิ่งที่ประทับใจมากที่สุด
                    </label>
                    <textarea
                      name="positive_feedback"
                      value={formData.positive_feedback}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="สิ่งที่ผู้ให้บริการทำได้ดีมาก..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      จุดที่ควรปรับปรุง
                    </label>
                    <textarea
                      name="areas_for_improvement"
                      value={formData.areas_for_improvement}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="สิ่งที่ควรปรับปรุงหรือพัฒนาเพิ่มเติม..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      บริการเพิ่มเติมที่ได้รับ
                    </label>
                    <textarea
                      name="additional_services_received"
                      value={formData.additional_services_received}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="บริการหรือคำแนะนำเพิ่มเติมที่ได้รับ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ปัญหาที่พบ (ถ้ามี)
                    </label>
                    <textarea
                      name="problems_encountered"
                      value={formData.problems_encountered}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="ปัญหาหรือความไม่สะดวกที่พบ..."
                    />
                  </div>
                </div>
              </div>

              {/* Recommendation and Experience */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  ประสบการณ์และคำแนะนำ
                </h4>
                
                <div className="space-y-4">
                  {formData.would_recommend && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        เหตุผลที่จะแนะนำ
                      </label>
                      <textarea
                        name="recommendation_reason"
                        value={formData.recommendation_reason}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="เหตุผลที่จะแนะนำผู้ให้บริการรายนี้..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      อธิบายประสบการณ์โดยรวม
                    </label>
                    <textarea
                      name="overall_experience_description"
                      value={formData.overall_experience_description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="อธิบายประสบการณ์การใช้บริการโดยรวม..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      สิ่งที่ชอบมากที่สุด
                    </label>
                    <textarea
                      name="favorite_aspect"
                      value={formData.favorite_aspect}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="สิ่งที่ชอบมากที่สุดในการให้บริการ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ข้อเสนอแนะสำหรับผู้ให้บริการ
                    </label>
                    <textarea
                      name="suggestion_for_provider"
                      value={formData.suggestion_for_provider}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="ข้อเสนอแนะเพื่อปรับปรุงการให้บริการ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ข้อเสนอแนะสำหรับแพลตฟอร์ม
                    </label>
                    <textarea
                      name="platform_feedback"
                      value={formData.platform_feedback}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="ข้อเสนอแนะเพื่อปรับปรุงแพลตฟอร์ม..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={submitQuestionnaireMutation.isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {submitQuestionnaireMutation.isLoading ? 'กำลังส่ง...' : 'ส่งแบบประเมิน'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuestionnaire;