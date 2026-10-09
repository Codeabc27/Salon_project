import React, { useState, useEffect } from 'react';
import api, {
  getOwnerSalons,
  getDashboardStats,
  getSalonBookings,
  updateBookingStatus,
  createWalkInBooking,
  getSalonServices,
  createService,
  deleteService,
  getSalonStaff,
  getSalonCustomers,
  getSalonOffers
} from '../services/api';

import OwnerLayout from '../components/OwnerLayout';
import WalkInModal from '../components/WalkInModal';
import DashboardTab from '../views/DashboardTab';
import BookingsTab from '../views/BookingsTab';
import ServicesTab from '../views/ServicesTab';
import StaffTab from '../views/StaffTab';
import CustomersTab from '../views/CustomersTab';
import OffersTab from '../views/OffersTab';

export default function DashboardPage({ onLogout }) {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data States (initialized to safe defaults)
  const [stats, setStats] = useState({
    today_total_bookings: 0,
    today_revenue: 0,
    new_customers_count: 0,
    customer_rating: 4.8,
    queue_arrived: [],
    queue_waiting: [],
    queue_in_service: [],
    queue_completed: []
  });
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchInitialSalons();
  }, []);

  useEffect(() => {
    if (selectedSalon?.id) {
      loadSalonData(selectedSalon.id);
    }
  }, [selectedSalon]);

  const fetchInitialSalons = async () => {
    try {
      const res = await getOwnerSalons();
      const salonList = Array.isArray(res?.data) ? res.data : [];
      setSalons(salonList);
      if (salonList.length > 0) {
        setSelectedSalon(salonList[0]);
      }
    } catch (err) {
      console.error('Error fetching salons', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSalonData = async (salonId) => {
    try {
      const [statsRes, bookingsRes, srvRes, staffRes, custRes, offRes] = await Promise.all([
        getDashboardStats(salonId).catch(() => ({ data: {} })),
        getSalonBookings(salonId).catch(() => ({ data: [] })),
        getSalonServices(salonId).catch(() => ({ data: [] })),
        getSalonStaff(salonId).catch(() => ({ data: [] })),
        getSalonCustomers(salonId).catch(() => ({ data: [] })),
        getSalonOffers(salonId).catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (Array.isArray(bookingsRes?.data)) setBookings(bookingsRes.data);
      if (Array.isArray(srvRes?.data)) setServices(srvRes.data);
      if (Array.isArray(staffRes?.data)) setStaff(staffRes.data);
      if (Array.isArray(custRes?.data)) setCustomers(custRes.data);
      if (Array.isArray(offRes?.data)) setOffers(offRes.data);
    } catch (err) {
      console.error('Error loading salon modules', err);
    }
  };

  const handleStatusChange = async (bookingId, nextStatus) => {
    try {
      await updateBookingStatus(bookingId, nextStatus);
      if (selectedSalon?.id) loadSalonData(selectedSalon.id);
    } catch (err) {
      alert('Could not update status');
    }
  };

  const handleWalkInSave = async (payload) => {
    if (!selectedSalon?.id) return;
    try {
      await createWalkInBooking(selectedSalon.id, payload);
      loadSalonData(selectedSalon.id);
    } catch (err) {
      alert('Failed to register walk-in');
    }
  };

  const handleAddService = async (formData) => {
    if (!selectedSalon?.id) return;
    try {
      await createService(selectedSalon.id, formData);
      loadSalonData(selectedSalon.id);
    } catch (err) {
      alert('Failed to add service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!selectedSalon?.id) return;
    try {
      await deleteService(selectedSalon.id, serviceId);
      loadSalonData(selectedSalon.id);
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#5B4BDB] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OwnerLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={onLogout}
        selectedSalon={selectedSalon}
        salons={salons}
        onSalonChange={(id) => {
          const found = salons.find((s) => s.id === id);
          if (found) setSelectedSalon(found);
        }}
        onOpenWalkIn={() => setIsWalkInOpen(true)}
      >
        {currentTab === 'dashboard' && (
          <DashboardTab
            stats={stats || {}}
            onOpenWalkIn={() => setIsWalkInOpen(true)}
            onStatusChange={handleStatusChange}
          />
        )}
        {currentTab === 'bookings' && (
          <BookingsTab
            bookings={bookings || []}
            onUpdateStatus={handleStatusChange}
          />
        )}
        {currentTab === 'services' && (
          <ServicesTab
            services={services || []}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
          />
        )}
        {currentTab === 'staff' && (
          <StaffTab
            staffList={staff || []}
            onAddStaff={() => {}}
          />
        )}
        {currentTab === 'customers' && (
          <CustomersTab
            customers={customers || []}
          />
        )}
        {currentTab === 'offers' && (
          <OffersTab
            offers={offers || []}
          />
        )}

        {/* Safe Placeholder for in-progress tabs */}
        {['calendar', 'earnings', 'analytics', 'profile', 'reviews'].includes(currentTab) && (
          <div className="bg-white p-12 rounded-xl border border-[#E8EAF0] text-center space-y-2">
            <h3 className="text-base font-bold text-slate-800 capitalize">{currentTab}</h3>
            <p className="text-xs text-slate-400">This module is connected and ready for full view template.</p>
          </div>
        )}
      </OwnerLayout>

      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        onSave={handleWalkInSave}
        services={services || []}
        staff={staff || []}
      />
    </>
  );
}