import { Dashboard } from './components/dashboard';

export default async function Page() {
    return (
        <div className="flex-1 p-6 animate-fadeIn">
            <Dashboard />
        </div>
    );
}
