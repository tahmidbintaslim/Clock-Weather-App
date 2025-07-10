import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="max-w-md mx-auto text-center p-8">
                        <div className="bg-white rounded-lg shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                            <div className="mb-6">
                                <svg
                                    className="w-16 h-16 text-red-500 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    We're sorry, but something unexpected happened. Please try refreshing the page.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Refresh Page
                                </button>

                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <details className="text-left mt-4">
                                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                            Error Details (Development)
                                        </summary>
                                        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                                            {this.state.error.toString()}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
