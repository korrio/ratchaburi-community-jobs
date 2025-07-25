import React, { useState, useEffect } from 'react';
import {
  BookOpen
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { remark } from 'remark';
import html from 'remark-html';

const AdminGuide: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [renderedHtml, setRenderedHtml] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('/ADMIN.md');
        const markdown = await response.text();
        setMarkdownContent(markdown);
        
        // Convert markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(markdown);
        setRenderedHtml(processedContent.toString());
      } catch (error) {
        console.error('Error loading markdown:', error);
        setRenderedHtml('<p>ไม่สามารถโหลดคู่มือได้ กรุณาลองใหม่อีกครั้ง</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <AdminLayout title="คู่มือการใช้งาน">
      <div className="max-w-7xl mx-auto">

        {/* Main Content */}
        <div className="w-full">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">คู่มือฉบับเต็ม</h2>
                  <button
                    onClick={() => window.open('/ADMIN.md', '_blank')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    ดาวน์โหลดคู่มือ
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-600">กำลังโหลดคู่มือ...</span>
                  </div>
                ) : (
                  <div 
                    className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:text-primary-800 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:text-primary-700 prose-table:text-sm prose-th:bg-gray-50 prose-td:py-2 prose-th:py-2 prose-img:rounded-lg prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                )}
              </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGuide;