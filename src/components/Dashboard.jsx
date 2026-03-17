import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, UserCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // 1. Updated both to use State
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const BLUE_THEME = ['#3b82f6', '#1e3a8a', '#93c5fd'];
  const [totalUserNo, setTotalUserNo] = useState(0);
  const [totalToday, settotalToday] = useState(0);

  // 2. Updated useEffect to fetch both APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Gender Data
        const genderResponse = await fetch("http://localhost:8081/data-service/get-gender-data");
        const genderMap = await genderResponse.json();
        const formattedGender = Object.entries(genderMap).map(([key, val]) => ({
          name: key,
          value: val
        }));
        setGenderData(formattedGender);

        // Fetch Age Data
        const ageResponse = await fetch("http://localhost:8081/data-service/age-data");
        const ageMap = await ageResponse.json();
        const formattedAge = Object.entries(ageMap).map(([key, val]) => ({
          range: key,
          count: val
        }));
        setAgeData(formattedAge);

        const totalUsersResonse = await fetch("http://localhost:8082/auth-service/get-totalUser");
        const totalUserNo = await totalUsersResonse.json();
        setTotalUserNo(totalUserNo);

        const todayResponse = await fetch("http://localhost:8081/data-service/get-today-EnterData");
        const totalToday = await todayResponse.json();
        settotalToday(totalToday);
        console.log(totalToday);
        console.log(totalUsers);
        
        
        //const percentage = (totalToday / totalUserNo) * 100;
        

        
        
        
        


      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate total dynamically based on fetched data
  const totalUsers = genderData.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className="dashboard-container">
      {/* 1. Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-light"><Users size={24} /></div>
          <div className="stat-info">
            <p>Total Data</p>
            <h3>{totalUsers.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-light"><UserCheck size={24} /></div>
          <div className="stat-info">
            <p>Active Users</p>
            <h3>{totalUserNo}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-cyan-light"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <p>Growth</p>
            <h3>{((totalToday/totalUsers)*100).toFixed(1)}</h3>
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Gender Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_THEME[index % BLUE_THEME.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Users by Age Range</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;