import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Users, 
  UserCheck, 
  GitMerge, 
  Settings, 
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  PlusCircle,
  Presentation
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'JOB ชุมชน',
  description = 'แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชน'
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    // { name: 'หน้าแรก', href: '/', icon: Home },
    { name: 'งานนำเสนอ', href: '/presentation', icon: Presentation },
    { name: 'ผู้ให้บริการ', href: '/providers', icon: UserCheck },
    { name: 'ผู้ต้องการจ้าง', href: '/customers', icon: Users },
    // { name: 'การจับคู่งาน', href: '/matches', icon: GitMerge },
    { name: 'ลงทะเบียนผู้ให้บริการ', href: '/providers/register', icon: UserPlus },
    { name: 'โพสต์งานที่ต้องการจ้าง', href: '/customers/register', icon: PlusCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ร</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    JOB ชุมชน
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isPostJobButton = item.name === 'โพสต์งานที่ต้องการจ้าง';
                  
                  if (isPostJobButton) {
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary-800 hover:bg-primary-900 text-white"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isPostJobButton = item.name === 'โพสต์งานที่ต้องการจ้าง';
                  
                  if (isPostJobButton) {
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors bg-primary-800 hover:bg-primary-900 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ร</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">
                    JOB ชุมชน
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชน 
                  เพื่อสร้างโอกาสการจ้างงานและการเข้าถึงบริการที่ดีขึ้น
                </p>
                <div className="mt-4">
                  <img 
                    src="https://www.eef.or.th/wp-content/uploads/2020/09/th-logo-eef-1400x621.png" 
                    alt="กองทุนเพื่อความเสมอภาคทางการศึกษา" 
                    className="h-24 w-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">ลิงก์ด่วน</h3>
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>0X-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>support@jobforcommunity.com</span>
                  </div>
                  <div className="flex items-start text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 mt-1" />
                    <span>
                      กองทุนเพื่อความเสมอภาคทางการศึกษา<br />
                      อาคารเอส. พี. (อาคารเอ) ชั้น 13
เลขที่ 388 ถนนพหลโยธิน
แขวงสามเสนใน เขตพญาไท
กรุงเทพมหานคร 10400
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2025 JOB ชุมชน. ลิขสิทธิ์ของกองทุนเพื่อความเสมอภาคทางการศึกษา.
                </p>
                <p className="text-gray-400 text-sm mt-2 md:mt-0">
                  พัฒนาโดยกองทุนเพื่อความเสมอภาคทางการศึกษา
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;