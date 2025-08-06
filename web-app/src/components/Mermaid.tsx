import React from 'react';

interface MermaidProps {
  chart: string;
  id?: string;
}

// Create visual representations for the specific charts used in the presentation
const getVisualDiagram = (chart: string) => {
  if (chart.includes('LINE Chatbot') || chart.includes('เริ่มต้น')) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
        <div className="space-y-4">
          {/* LINE Chatbot Flow Visual */}
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">LINE Chatbot User Flow</h4>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Start */}
            <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-center">
              <div className="font-semibold text-green-800">เริ่มต้น</div>
              <div className="text-sm text-green-600">Add Friend LINE Bot</div>
            </div>
            
            <div className="text-2xl">↓</div>
            
            {/* Role Selection */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 text-center">
              <div className="font-semibold text-yellow-800">เลือกบทบาท</div>
            </div>
            
            <div className="flex space-x-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-xl">↙</div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-blue-800">ผู้รับบริการ</div>
                  <div className="text-xs text-blue-600">ค้นหาผู้ให้บริการ</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="text-xl">↘</div>
                <div className="bg-purple-100 border border-purple-300 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-purple-800">ผู้ให้บริการ</div>
                  <div className="text-xs text-purple-600">ลงทะเบียนบริการ</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <div className="text-2xl">↓</div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mt-2">
                <div className="font-semibold text-gray-800">สร้างการจับคู่งาน</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (chart.includes('PENDING') || chart.includes('รอการตอบกลับ')) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200">
        <div className="text-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Job Progress Stages</h4>
        </div>
        
        <div className="flex items-center justify-between space-x-2 overflow-x-auto">
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-yellow-800">PENDING</div>
              <div className="text-xs text-yellow-600">รอการตอบกลับ</div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">→</div>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-green-800">ACCEPTED</div>
              <div className="text-xs text-green-600">ตอบรับแล้ว</div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">→</div>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-blue-800">ARRIVED</div>
              <div className="text-xs text-blue-600">มาถึงแล้ว</div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">→</div>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-purple-100 border border-purple-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-purple-800">STARTED</div>
              <div className="text-xs text-purple-600">เริ่มทำงาน</div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">→</div>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-cyan-100 border border-cyan-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-cyan-800">COMPLETED</div>
              <div className="text-xs text-cyan-600">งานเสร็จ</div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">→</div>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-center mb-2">
              <div className="text-sm font-semibold text-gray-800">CLOSED</div>
              <div className="text-xs text-gray-600">ปิดงาน</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-red-100 border border-red-300 rounded-lg px-3 py-1 inline-block">
            <div className="text-sm font-semibold text-red-800">CANCELLED</div>
            <div className="text-xs text-red-600">ยกเลิก (ทุกขั้นตอน)</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <div className="text-center space-y-4">
        <div className="text-4xl">📊</div>
        <h3 className="text-lg font-semibold text-blue-800">Flowchart Diagram</h3>
        <div className="bg-white p-4 rounded border text-left">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto max-h-48">{chart}</pre>
        </div>
        <p className="text-sm text-blue-600">Visual flowchart representation</p>
      </div>
    </div>
  );
};

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  return (
    <div className="mermaid-container flex justify-center items-center min-h-[300px] w-full">
      {getVisualDiagram(chart)}
    </div>
  );
};