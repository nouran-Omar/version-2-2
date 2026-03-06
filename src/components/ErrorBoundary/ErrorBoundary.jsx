import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // تحديث الحالة عشان المرة الجاية يظهر الـ UI البديل
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // ممكن تبعت الغلط ده لخدمة زي Sentry هنا عشان تعرف السيرفر حصل فيه إيه
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // ده الشكل اللي هيظهر للمستخدم بدل الشاشة البيضاء
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-5 text-center">
          <h1 className="text-2xl font-bold text-red-600">للأسف، حصل مشكلة غير متوقعة.</h1>
          <p className="mt-2 text-gray-600">بنعتذر جداً، حاول تعمل إعادة تحميل للصفحة.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-lg bg-brand-main px-6 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            إعادة تحميل الموقع
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;