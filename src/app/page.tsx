import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";

export default function Home() {
  return (
    <div className="flex items-center min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Column: User Profile & Skills */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Profile />
          <div className="bg-white rounded-3xl shadow-lg p-6 h-48 flex items-center justify-center">
            Skills Card Placeholder
          </div>
        </div>

        {/* Right Main Content Grid */}
        <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Row 2 & 3: Education, Contests, Job History (left part of main content) and Line of Code, Problem Solved (right part of main content) */}
          <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side of the inner grid (Education, Contests, Job History) */}
            <div className="lg:col-span-2 space-y-6">
              <Education />
              <Experience />
            </div>

            {/* Right side of the inner grid (Line of Code, Problem Solved) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl shadow-lg p-6 h-64 flex items-center justify-center">
                Leetcode
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 h-64 flex items-center justify-center">
                Github
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 h-64 flex items-center justify-center">
                Stackoverflow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
