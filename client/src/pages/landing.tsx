export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-project-diagram text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Project Manager</h2>
          <p className="text-slate-600 mt-2">Manage your projects efficiently</p>
        </div>

        <div className="space-y-4">
          <a
            href="/api/login"
            data-testid="button-login"
            className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all font-medium text-center block"
          >
            Sign In to Continue
          </a>
          
          <div className="text-center text-sm text-slate-600">
            New to Project Manager?{" "}
            <a
              href="/api/login"
              data-testid="link-register"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Create an account
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Create and manage projects
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Track project status
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Upload project images
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Admin analytics dashboard
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
