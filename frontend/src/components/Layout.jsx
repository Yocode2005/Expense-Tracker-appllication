
import { Activity, useState } from 'react'
import {styles} from '../assets/dummyStyles.js'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import { ArrowUp, Car, CreditCard, Gift, Home, PiggyBank, ShoppingCart, Utensils, Zap } from 'lucide-react';


const API_BASE = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Entertainment: <Gift className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Healthcare: <Activity className="w-4 h-4" />,
  Salary: <ArrowUp className="w-4 h-4" />,
  Freelance: <CreditCard className="w-4 h-4" />,
  Savings: <PiggyBank className="w-4 h-4" />,
};


// to filter
const filterTransactions = (transactions, frame) => {
  const now = new Date();
  const today = new Date(now).setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily":
      return transactions.filter((t) => new Date(t.date) >= today);
    case "weekly": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return transactions.filter((t) => new Date(t.date) >= startOfWeek);
    }
    case "monthly":
      return transactions.filter(
        (t) => new Date(t.date).getMonth() === now.getMonth()
      );
    default:
      return transactions;
  }
};

const safeArrayFromResponse = (res) => {
  const body = res?.data;
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.incomes)) return body.incomes;
  if (Array.isArray(body.expenses)) return body.expenses;
  return [];
};


const Layout = ({onLogout,user}) => {
   const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className={styles.layout.root}>
        <Navbar  user={user} onLogout={onLogout} />
        <Sidebar user={user} isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed} />
        <div className={styles.layout.mainContainer(sidebarCollapsed)}>
          <div className={styles.header.container}>
            <div>
              <h1 className={styles.header.title}>Dashboard</h1>
              <p className={styles.header.subtitle}>Welcome back</p>
            </div>
          </div>
          <div className={styles.statCards.grid}>
            <div className={styles.statCards.card}>
              <div className={styles.statCards.cardHeader}>
                <div>
                  <p className={styles.statCards.cardTitle}>Total Balance</p>
                  <p className={styles.statCards.cardValue}>
                    ${stats}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
    </div>
  )
}

export default Layout