import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Truck, MapPin, Navigation, UserCheck, Plus, Trash2, Shield, Settings, Info, Loader2, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { 
  useVehicles, useCreateVehicle, useUpdateVehicle,
  useRoutes, useCreateRoute, useAddRouteStop, useDeleteRouteStop, useAllocateStudent,
  useStaff
} from '../../../features/transport/hooks/useTransport';
import api from '../../../lib/api';

export const AdminTransport = () => {
  const [activeTab, setActiveTab] = useState('routes');

  // Queries
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: routes = [], isLoading: routesLoading } = useRoutes();
  const { data: staff = [], isLoading: staffLoading } = useStaff();

  // Mutations
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const createRouteMutation = useCreateRoute();
  const addStopMutation = useAddRouteStop();
  const deleteStopMutation = useDeleteRouteStop();
  const allocateStudentMutation = useAllocateStudent();

  // Local state - Add Vehicle
  const [newVehNum, setNewVehNum] = useState('');
  const [newVehCap, setNewVehCap] = useState('');
  const [newVehModel, setNewVehModel] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedHelper, setSelectedHelper] = useState('');

  // Local state - Add Route
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteNum, setNewRouteNum] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [routeDriver, setRouteDriver] = useState('');
  const [routeHelper, setRouteHelper] = useState('');

  // Local state - Add Stop
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [newStopName, setNewStopName] = useState('');
  const [newStopLat, setNewStopLat] = useState('18.5308');
  const [newStopLng, setNewStopLng] = useState('73.8475');
  const [newStopSchedTime, setNewStopSchedTime] = useState('08:00 AM');

  // Local state - Student Allocation
  const [selectedAllocRoute, setSelectedAllocRoute] = useState('');
  const [selectedAllocStudent, setSelectedAllocStudent] = useState('');
  const [selectedAllocStop, setSelectedAllocStop] = useState('');

  // Fetch all students to allocate
  const { data: students = [] } = useQuery({
    queryKey: ['adminTransportStudents'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.data;
    }
  });

  // Handlers
  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehNum || !newVehCap) return;
    createVehicleMutation.mutate({
      vehicleNumber: newVehNum,
      capacity: Number(newVehCap),
      model: newVehModel,
      driverId: selectedDriver || null,
      assistantId: selectedHelper || null
    }, {
      onSuccess: () => {
        setNewVehNum('');
        setNewVehCap('');
        setNewVehModel('');
        setSelectedDriver('');
        setSelectedHelper('');
      }
    });
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRouteName || !newRouteNum) return;
    const vehObj = vehicles.find(v => v._id === selectedVehicle);
    createRouteMutation.mutate({
      routeName: newRouteName,
      routeNumber: newRouteNum,
      vehicleNumber: vehObj ? vehObj.vehicleNumber : 'N/A',
      vehicleId: selectedVehicle || null,
      driverId: routeDriver || null,
      assistantId: routeHelper || null
    }, {
      onSuccess: () => {
        setNewRouteName('');
        setNewRouteNum('');
        setSelectedVehicle('');
        setRouteDriver('');
        setRouteHelper('');
      }
    });
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!selectedRouteId || !newStopName) return;
    addStopMutation.mutate({
      routeId: selectedRouteId,
      stopData: {
        stopName: newStopName,
        latitude: Number(newStopLat),
        longitude: Number(newStopLng),
        scheduledTime: newStopSchedTime
      }
    }, {
      onSuccess: () => {
        setNewStopName('');
        setNewStopLat('18.5308');
        setNewStopLng('73.8475');
        setNewStopSchedTime('08:00 AM');
      }
    });
  };

  const handleAllocateStudent = (e) => {
    e.preventDefault();
    if (!selectedAllocRoute || !selectedAllocStudent || !selectedAllocStop) return;
    allocateStudentMutation.mutate({
      routeId: selectedAllocRoute,
      studentId: selectedAllocStudent,
      stopName: selectedAllocStop
    }, {
      onSuccess: () => {
        setSelectedAllocStudent('');
        setSelectedAllocStop('');
      }
    });
  };

  const driversList = staff.filter(s => s.role === 'Driver' || s.role === 'Teacher' || s.role === 'Admin');
  const helpersList = staff.filter(s => s.role === 'Helper' || s.role === 'Assistant' || s.role === 'Staff');

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Truck className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">Transport & Fleet Management</h1>
          <p className="text-slate-400 font-semibold mt-1">
            Configure vehicle routes, establish geographic stop coordinates, allocate student transport, and track bus telemetry.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'routes', label: 'Routes & Stops', icon: Navigation },
          { id: 'vehicles', label: 'Fleet Vehicles', icon: Truck },
          { id: 'allocations', label: 'Student Allocations', icon: UserCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Route */}
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">Create Transit Route</h3>
                <form onSubmit={handleAddRoute} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Viman Nagar Route"
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. R-101"
                      value={newRouteNum}
                      onChange={(e) => setNewRouteNum(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Vehicle</label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.model})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</label>
                    <select
                      value={routeDriver}
                      onChange={(e) => setRouteDriver(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                    >
                      <option value="">Select Driver</option>
                      {driversList.map(d => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={createRouteMutation.isPending}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
                  >
                    {createRouteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Transit Route
                  </button>
                </form>
              </Card>

              {/* Add Stop to Route */}
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">Configure Stops</h3>
                <form onSubmit={handleAddStop} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Route</label>
                    <select
                      value={selectedRouteId}
                      onChange={(e) => setSelectedRouteId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                    >
                      <option value="">Select Route</option>
                      {routes.map(r => (
                        <option key={r._id} value={r._id}>{r.routeNumber} - {r.routeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Phoenix Mall Gate 1"
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                      <input 
                        type="text"
                        value={newStopLat}
                        onChange={(e) => setNewStopLat(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                      <input 
                        type="text"
                        value={newStopLng}
                        onChange={(e) => setNewStopLng(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Stop Time</label>
                    <input 
                      type="text"
                      placeholder="e.g. 07:45 AM"
                      value={newStopSchedTime}
                      onChange={(e) => setNewStopSchedTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addStopMutation.isPending || !selectedRouteId}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
                  >
                    {addStopMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Stop Point
                  </button>
                </form>
              </Card>
            </div>

            {/* List Routes */}
            <div className="lg:col-span-2 space-y-6">
              {routesLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : routes.length > 0 ? (
                routes.map(route => (
                  <Card key={route._id} className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider rounded">
                            Route: {route.routeNumber}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm">{route.routeName}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          Vehicle: <span className="text-slate-600 font-bold">{route.vehicleNumber}</span> • Driver: <span className="text-slate-600 font-bold">{route.driver?.name || 'Unassigned'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stops List */}
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">Scheduled Stop Details</h5>
                      <div className="relative border-l border-indigo-100 ml-3 pl-4 space-y-4 py-2">
                        {route.stops?.map((stop, sIdx) => (
                          <div key={sIdx} className="relative flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {/* Bullet */}
                            <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></span>
                            
                            <div>
                              <p className="font-bold text-slate-800 text-xs">{stop.stopName}</p>
                              <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-2 mt-0.5">
                                <span>GPS: {stop.latitude}, {stop.longitude}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {stop.scheduledTime || 'TBD'}
                              </span>

                              <button
                                onClick={() => deleteStopMutation.mutate({ routeId: route._id, stopName: stop.stopName })}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!route.stops || route.stops.length === 0) && (
                          <p className="text-xs text-slate-400 italic">No stops added to this route yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Allocated Students */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <h5 className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">Allocated Students ({route.studentsAllocated?.length || 0})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {route.studentsAllocated?.map((alloc, aIdx) => (
                          <div key={aIdx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{alloc.student?.user?.name || 'Unknown Student'}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Pickup: {alloc.stopName}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50/50 border border-dashed rounded-[2.5rem]">
                  <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">No transport routes configured.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Vehicle */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">Register Bus</h3>
                <form onSubmit={handleAddVehicle} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Registration Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. MH-12-EQ-8844"
                      value={newVehNum}
                      onChange={(e) => setNewVehNum(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passenger Capacity</label>
                    <input 
                      type="number"
                      placeholder="e.g. 40"
                      value={newVehCap}
                      onChange={(e) => setNewVehCap(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Model/Make</label>
                    <input 
                      type="text"
                      placeholder="e.g. Tata Starbus"
                      value={newVehModel}
                      onChange={(e) => setNewVehModel(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Account</label>
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value="">Select Driver</option>
                      {driversList.map(d => (
                        <option key={d._id} value={d._id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assistant / Helper</label>
                    <select
                      value={selectedHelper}
                      onChange={(e) => setSelectedHelper(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value="">Select Helper</option>
                      {helpersList.map(h => (
                        <option key={h._id} value={h._id}>{h.name} ({h.email})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={createVehicleMutation.isPending}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
                  >
                    {createVehicleMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Fleet Vehicle
                  </button>
                </form>
              </Card>
            </div>

            {/* Vehicles List */}
            <div className="lg:col-span-2 space-y-4">
              {vehiclesLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : vehicles.map(vehicle => (
                <Card key={vehicle._id} className="p-5 bg-white border border-slate-200/60 rounded-[2rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl">
                      <Truck className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{vehicle.vehicleNumber}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{vehicle.model || 'Tata School Bus'} • Capacity: {vehicle.capacity} seats</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 border-t sm:border-t-0 pt-3 sm:pt-0 sm:border-l border-slate-100 pl-0 sm:pl-6">
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Driver</span>
                      <span className="font-bold text-slate-700">{vehicle.driver?.name || 'Unassigned'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Helper / Assistant</span>
                      <span className="font-bold text-slate-700">{vehicle.assistant?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Allocation Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">Allocate Transport</h3>
                <form onSubmit={handleAllocateStudent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Route</label>
                    <select
                      value={selectedAllocRoute}
                      onChange={(e) => {
                        setSelectedAllocRoute(e.target.value);
                        setSelectedAllocStop('');
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value="">Select Route</option>
                      {routes.map(r => (
                        <option key={r._id} value={r._id}>{r.routeNumber} - {r.routeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</label>
                    <select
                      value={selectedAllocStudent}
                      onChange={(e) => setSelectedAllocStudent(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.user?.name} (Roll: {s.rollNumber})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Stop Point</label>
                    <select
                      value={selectedAllocStop}
                      onChange={(e) => setSelectedAllocStop(e.target.value)}
                      disabled={!selectedAllocRoute}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                    >
                      <option value="">Select Stop</option>
                      {routes.find(r => r._id === selectedAllocRoute)?.stops?.map((stop, sIdx) => (
                        <option key={sIdx} value={stop.stopName}>{stop.stopName}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={allocateStudentMutation.isPending || !selectedAllocStudent || !selectedAllocStop}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-750 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
                  >
                    {allocateStudentMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Allocate Student
                  </button>
                </form>
              </Card>
            </div>

            {/* Allocation Grid */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Active Allocations</h3>

                <div className="divide-y divide-slate-100">
                  {routes.map(r => 
                    r.studentsAllocated?.map((alloc, idx) => (
                      <div key={`${r._id}-${idx}`} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{alloc.student?.user?.name || 'Unknown Student'}</h4>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Route: {r.routeNumber} ({r.routeName})</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {alloc.stopName}
                        </span>
                      </div>
                    ))
                  )}

                  {routes.every(r => !r.studentsAllocated || r.studentsAllocated.length === 0) && (
                    <div className="text-center py-12 text-slate-400 font-bold text-xs italic">
                      No active transport allocations.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
