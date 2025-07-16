import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  X,
  DollarSign,
  Clock,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Users,
  Zap
} from 'lucide-react';
import { apiEndpoints } from '@/utils/api';

interface ProviderQuestionnaireProps {
  matchId: string;
  customerName: string;
  jobDescription: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface ProviderQuestionnaireData {
  payment_received: boolean;
  payment_amount: number;
  payment_method: string;
  job_completion_date: string;
  actual_hours_worked: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  customer_satisfaction: number;
  would_work_again: boolean;
  additional_services_offered: string;
  challenges_faced: string;
  suggestions_for_improvement: string;
  overall_experience: number;
  recommendation_likelihood: number;
  feedback_for_platform: string;
}

interface ProviderQuestionnaireErrors {
  payment_amount?: string;
  payment_method?: string;
  job_completion_date?: string;
  actual_hours_worked?: string;
  additional_services_offered?: string;
  challenges_faced?: string;
  suggestions_for_improvement?: string;
  feedback_for_platform?: string;
}

const ProviderQuestionnaire: React.FC<ProviderQuestionnaireProps> = ({
  matchId,
  customerName,
  jobDescription,
  isOpen,
  onClose,
  onSubmit
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProviderQuestionnaireData>({
    payment_received: false,
    payment_amount: 0,
    payment_method: '',
    job_completion_date: '',
    actual_hours_worked: 0,
    difficulty_level: 'medium',
    customer_satisfaction: 5,
    would_work_again: true,
    additional_services_offered: '',
    challenges_faced: '',
    suggestions_for_improvement: '',
    overall_experience: 5,
    recommendation_likelihood: 5,
    feedback_for_platform: ''
  });

  const [errors, setErrors] = useState<ProviderQuestionnaireErrors>({});

  const submitQuestionnaireMutation = useMutation(
    (data: any) => apiEndpoints.submitProviderQuestionnaire?.(matchId, data) || Promise.resolve(),
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

    // Clear error when user starts typing
    if (errors[name as keyof ProviderQuestionnaireErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProviderQuestionnaireErrors = {};

    if (!formData.job_completion_date) {
      newErrors.job_completion_date = 'กรุณาระบุวันที่ทำงานเสร็จ';
    }

    if (formData.actual_hours_worked <= 0) {
      newErrors.actual_hours_worked = 'กรุณาระบุจำนวนชั่วโมงที่ทำงาน';
    }

    if (formData.payment_received && formData.payment_amount <= 0) {
      newErrors.payment_amount = 'กรุณาระบุจำนวนเงินที่ได้รับ';
    }

    if (formData.payment_received && !formData.payment_method) {
      newErrors.payment_method = 'กรุณาระบุวิธีการชำระเงิน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await submitQuestionnaireMutation.mutateAsync(formData);
  };

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
                  แบบสอบถามสำหรับผู้ให้บริการ
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Job Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">ข้อมูลงาน</h4>
                <p className="text-sm text-gray-600">ลูกค้า: {customerName}</p>
                <p className="text-sm text-gray-600">รายละเอียด: {jobDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    ข้อมูลการชำระเงิน
                  </h4>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payment_received"
                      name="payment_received"
                      checked={formData.payment_received}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="payment_received" className="ml-2 block text-sm text-gray-900">
                      ได้รับเงินค่าจ้างแล้ว
                    </label>
                  </div>

                  {formData.payment_received && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">จำนวนเงินที่ได้รับ (บาท)</label>
                        <input
                          type="number"
                          name="payment_amount"
                          value={formData.payment_amount}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                            errors.payment_amount ? 'border-red-500' : 'border-gray-300'
                          }`}
                          min="0"
                          step="0.01"
                        />
                        {errors.payment_amount && (
                          <p className="mt-1 text-sm text-red-600">{errors.payment_amount}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">วิธีการชำระเงิน</label>
                        <select
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                            errors.payment_method ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">เลือกวิธีการชำระเงิน</option>
                          <option value="cash">เงินสด</option>
                          <option value="bank_transfer">โอนเงิน</option>
                          <option value="mobile_banking">แอปธนาคาร</option>
                          <option value="promptpay">พร้อมเพย์</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                        {errors.payment_method && (
                          <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Job Completion Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    ข้อมูลการทำงาน
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">วันที่ทำงานเสร็จ</label>
                    <input
                      type="date"
                      name="job_completion_date"
                      value={formData.job_completion_date}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.job_completion_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.job_completion_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.job_completion_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">จำนวนชั่วโมงที่ทำงานจริง</label>
                    <input
                      type="number"
                      name="actual_hours_worked"
                      value={formData.actual_hours_worked}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.actual_hours_worked ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="0"
                      step="0.5"
                    />
                    {errors.actual_hours_worked && (
                      <p className="mt-1 text-sm text-red-600">{errors.actual_hours_worked}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">ระดับความยากของงาน</label>
                    <select
                      name="difficulty_level"
                      value={formData.difficulty_level}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="easy">ง่าย</option>
                      <option value="medium">ปานกลาง</option>
                      <option value="hard">ยาก</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <Users className="h-5 w-5 mr-2" />
                  ความพึงพอใจของลูกค้า
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ความพึงพอใจของลูกค้า (1-5 ดาว)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, customer_satisfaction: rating }))}
                          className={`p-1 ${
                            rating <= formData.customer_satisfaction ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.customer_satisfaction} ดาว
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="would_work_again"
                      name="would_work_again"
                      checked={formData.would_work_again}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="would_work_again" className="ml-2 block text-sm text-gray-900">
                      ยินดีทำงานกับลูกค้ารายนี้อีก
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  ข้อมูลเพิ่มเติม
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">บริการเพิ่มเติมที่เสนอ</label>
                  <textarea
                    name="additional_services_offered"
                    value={formData.additional_services_offered}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="บริการหรือคำแนะนำเพิ่มเติมที่เสนอให้ลูกค้า..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ปัญหาหรือความท้าทายที่พบ</label>
                  <textarea
                    name="challenges_faced"
                    value={formData.challenges_faced}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ปัญหาหรือความยากลำบากที่พบระหว่างการทำงาน..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ข้อเสนอแนะเพื่อปรับปรุง</label>
                  <textarea
                    name="suggestions_for_improvement"
                    value={formData.suggestions_for_improvement}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ข้อเสนอแนะเพื่อปรับปรุงกระบวนการทำงาน..."
                  />
                </div>
              </div>

              {/* Overall Experience */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 flex items-center mb-4">
                  <Zap className="h-5 w-5 mr-2" />
                  ประสบการณ์โดยรวม
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ประสบการณ์โดยรวม (1-5 ดาว)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, overall_experience: rating }))}
                          className={`p-1 ${
                            rating <= formData.overall_experience ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.overall_experience} ดาว
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ความน่าจะเป็นที่จะแนะนำแพลตฟอร์มนี้ (1-5 ดาว)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, recommendation_likelihood: rating }))}
                          className={`p-1 ${
                            rating <= formData.recommendation_likelihood ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.recommendation_likelihood} ดาว
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">ข้อเสนอแนะสำหรับแพลตฟอร์ม</label>
                  <textarea
                    name="feedback_for_platform"
                    value={formData.feedback_for_platform}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ข้อเสนอแนะเพื่อปรับปรุงแพลตฟอร์ม..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={submitQuestionnaireMutation.isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {submitQuestionnaireMutation.isLoading ? 'กำลังส่ง...' : 'ส่งแบบสอบถาม'}
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

export default ProviderQuestionnaire;