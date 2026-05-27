import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, MapPin, Navigation, UserCheck, Plus, Trash2, Shield, Settings, Info, Loader2, Clock, CheckCircle, Play, Square, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { 
  useRoutes, useAddRouteStop, useDeleteRouteStop, useAssignStudentStop, useMarkBusAttendance
} from '../../transport/hooks/useTransport';
import api from '../../../lib/api';
import io from 'socket.io-client';

export const DriverDashboard = () => {
  const queryClient = useQueryClient();
  const { data: routes = [], isLoading: routesLoading, refetch: refetchRoutes } = useRoutes();
  const addStopMutation = useAddRouteStop();
  const deleteStopMutation = useDeleteRouteStop();
  const assignStopMutation = useAssignStudentStop();
  const markAttendanceMutation = useMarkBusAttendance();

  // Selected route (Driver's route)
  const activeRoute = routes[0]; // If driver is assigned to one route, it will be routes[0]

  // Add stop state
  const [newStopName, setNewStopName] = useState('');
  const [newStopLat, setNewStopLat] = useState('13.0780');
  const [newStopLng, setNewStopLng] = useState('80.2180');
  const [newStopSchedTime, setNewStopSchedTime] = useState('08:00 AM');

  // Attendance state
  const [tripType, setTripType] = useState('Pickup');
  const [attendanceRecords, setAttendanceRecords] = useState({}); // studentId -> 'Boarded' / 'Absent' / 'Left'

  // Live Location state
  const [isSharing, setIsSharing] = useState(false);
  const [currentLat, setCurrentLat] = useState(13.0850);
  const [currentLng, setCurrentLng] = useState(80.2120);
  const [telemetrySpeed, setTelemetrySpeed] = useState(0);
  const [nextStopName, setNextStopName] = useState('N/A');

  const socketRef = useRef(null);
  const simulationRef = useRef(null);
  const watchIdRef = useRef(null);
  const stopIndexRef = useRef(0);
  const stepRef = useRef(0);

  // Map references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Load Leaflet dynamically
  useEffect(() => {
    // Check if stylesheet is already loaded
    let leafletCss = document.getElementById('leaflet-css');
    if (!leafletCss) {
      leafletCss = document.createElement('link');
      leafletCss.id = 'leaflet-css';
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);
    }

    // Load Script
    const loadScript = () => {
      if (window.L) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Initialize map
      const map = window.L.map(mapContainerRef.current).setView([currentLat, currentLng], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add route path line if stops exist
      if (activeRoute?.stops && activeRoute.stops.length > 0) {
        const pathCoords = activeRoute.stops.map(stop => [stop.latitude, stop.longitude]);
        window.L.polyline(pathCoords, { color: '#4f46e5', weight: 4, opacity: 0.7 }).addTo(map);
        
        // Add markers for stops
        activeRoute.stops.forEach(stop => {
          window.L.circleMarker([stop.latitude, stop.longitude], {
            radius: 6,
            fillColor: '#ef4444',
            color: 'white',
            weight: 2,
            fillOpacity: 1
          }).addTo(map).bindPopup(`<b>Stop:</b> ${stop.stopName}<br/><b>Scheduled:</b> ${stop.scheduledTime}`);
        });
      }

      // Add driver current location marker
      const busIcon = window.L.divIcon({
        html: `<div class="bg-indigo-600 p-2.5 rounded-full border-2 border-white shadow-lg text-white flex items-center justify-center"><svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: rotate(0deg);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></div>`,
        className: 'custom-bus-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = window.L.marker([currentLat, currentLng], { icon: busIcon }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    loadScript();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [activeRoute]);

  // Update marker position dynamically
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([currentLat, currentLng]);
      mapInstanceRef.current.panTo([currentLat, currentLng]);
    }
  }, [currentLat, currentLng]);

  // Initialize socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token: `Bearer ${token}` }
    });

    socketRef.current.on('connect', () => {
      console.log('Driver Socket Connected successfully');
      if (activeRoute) {
        socketRef.current.emit('join-route', activeRoute._id);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (simulationRef.current) clearInterval(simulationRef.current);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [activeRoute]);

  // Set default attendance records when route loads
  useEffect(() => {
    if (activeRoute?.studentsAllocated) {
      const records = {};
      activeRoute.studentsAllocated.forEach(item => {
        records[item.student?._id] = 'Boarded';
      });
      setAttendanceRecords(records);
    }
  }, [activeRoute]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateETA = () => {
    if (!currentLat || !currentLng || !activeRoute?.stops || activeRoute.stops.length === 0) return null;

    const nextStop = activeRoute.stops.find(s => s.stopName === nextStopName) || activeRoute.stops[0];
    if (!nextStop) return null;

    const dist = getDistance(currentLat, currentLng, nextStop.latitude, nextStop.longitude);
    const speed = Math.max(telemetrySpeed || 35, 5);
    const etaMinutes = Math.round((dist / speed) * 60);

    return {
      distance: dist.toFixed(2),
      etaMinutes: etaMinutes === 0 ? "Arrived" : `${etaMinutes} mins`
    };
  };

  // Telemetry Simulation loop fallback
  const startSimulationFallback = () => {
    stopIndexRef.current = 0;
    stepRef.current = 0;

    // Set initial position to first stop
    setCurrentLat(activeRoute.stops[0].latitude);
    setCurrentLng(activeRoute.stops[0].longitude);
    setNextStopName(activeRoute.stops[1]?.stopName || 'School Campus');

    simulationRef.current = setInterval(() => {
      const routeStops = activeRoute.stops;
      const totalStops = routeStops.length;
      
      const currentStopIndex = stopIndexRef.current;
      const nextStopIndex = (currentStopIndex + 1) % totalStops;

      const currentStop = routeStops[currentStopIndex];
      const nextStop = routeStops[nextStopIndex];

      setNextStopName(nextStop.stopName);

      // Interpolate position between currentStop and nextStop (10 steps)
      const totalSteps = 10;
      stepRef.current += 1;
      
      const ratio = stepRef.current / totalSteps;
      const interpLat = currentStop.latitude + (nextStop.latitude - currentStop.latitude) * ratio;
      const interpLng = currentStop.longitude + (nextStop.longitude - currentStop.longitude) * ratio;

      setCurrentLat(parseFloat(interpLat.toFixed(6)));
      setCurrentLng(parseFloat(interpLng.toFixed(6)));

      // Emit update via socket with speed
      if (socketRef.current) {
        socketRef.current.emit('driver-location-update', {
          routeId: activeRoute._id,
          latitude: interpLat,
          longitude: interpLng,
          speed: telemetrySpeed || 45
        });
      }

      if (stepRef.current >= totalSteps) {
        // Arrived at next stop
        stepRef.current = 0;
        stopIndexRef.current = nextStopIndex;
        setTelemetrySpeed(0); // Pause briefly at stop
        setTimeout(() => setTelemetrySpeed(45), 2000);
      }
    }, 3000); // Update location every 3 seconds
  };

  // Start sharing driver location using GPS with Simulation fallback
  const startLocationSharing = () => {
    if (!activeRoute || !activeRoute.stops || activeRoute.stops.length === 0) {
      alert('Cannot share location without stop configurations.');
      return;
    }

    if (navigator.geolocation) {
      setIsSharing(true);
      setTelemetrySpeed(35); // Default start speed

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const speed = position.coords.speed ? Math.round(position.coords.speed * 3.6) : 35; // Convert to km/h or fallback

          setCurrentLat(parseFloat(lat.toFixed(6)));
          setCurrentLng(parseFloat(lng.toFixed(6)));
          setTelemetrySpeed(speed);

          // Dynamically predict the closest upcoming stop
          if (activeRoute.stops && activeRoute.stops.length > 0) {
            const closest = activeRoute.stops.reduce((prev, curr) => {
              const prevDist = Math.abs(prev.latitude - lat) + Math.abs(prev.longitude - lng);
              const currDist = Math.abs(curr.latitude - lat) + Math.abs(curr.longitude - lng);
              return prevDist < currDist ? prev : curr;
            });
            setNextStopName(closest.stopName || 'School Campus');
          }

          // Emit real-time GPS coordinates via socket with speed
          if (socketRef.current) {
            socketRef.current.emit('driver-location-update', {
              routeId: activeRoute._id,
              latitude: lat,
              longitude: lng,
              speed
            });
          }
        },
        (error) => {
          console.warn('GPS location tracking error, starting route simulation fallback:', error);
          alert('GPS location tracking error or permission denied. Starting route simulation mode.');
          startSimulationFallback();
        },
        options
      );
    } else {
      alert('Geolocation is not supported by your browser. Starting route simulation mode.');
      startSimulationFallback();
    }
  };

  const stopLocationSharing = () => {
    setIsSharing(false);
    setTelemetrySpeed(0);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!newStopName) return;
    addStopMutation.mutate({
      routeId: activeRoute._id,
      stopData: {
        stopName: newStopName,
        latitude: Number(newStopLat),
        longitude: Number(newStopLng),
        scheduledTime: newStopSchedTime
      }
    }, {
      onSuccess: () => {
        setNewStopName('');
        refetchRoutes();
      }
    });
  };

  const handleMarkAttendance = () => {
    if (!activeRoute) return;
    const attList = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status
    }));

    markAttendanceMutation.mutate({
      routeId: activeRoute._id,
      date: new Date().toISOString().split('T')[0],
      tripType,
      attendanceList: attList
    });
  };

  const handleUpdateStudentStop = (studentId, stopName) => {
    if (!activeRoute) return;
    assignStopMutation.mutate({
      routeId: activeRoute._id,
      studentId,
      stopName
    }, {
      onSuccess: () => {
        refetchRoutes();
      }
    });
  };

  if (routesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-bold text-slate-600">Retrieving assigned route information...</p>
      </div>
    );
  }

  if (!activeRoute) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-12 text-center max-w-lg mx-auto mt-20">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">No Assigned Transit Route</h3>
        <p className="text-xs text-slate-400 mt-1">You are not currently assigned as a driver/helper to any route. Please contact Admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Truck className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider rounded">
              Route: {activeRoute.routeNumber}
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-1">{activeRoute.routeName}</h1>
            <p className="text-slate-400 font-semibold text-xs mt-0.5">Assigned Bus: {activeRoute.vehicleNumber}</p>
          </div>

          {/* Live Telemetry Panel */}
          <div className="flex gap-4 items-center bg-white/10 px-5 py-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <div>
              <span className="block text-[8px] text-slate-300 font-black uppercase tracking-wider">Sharing Status</span>
              <span className="font-extrabold text-xs flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isSharing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                {isSharing ? 'Sharing Live' : 'Offline'}
              </span>
            </div>
            {isSharing && (
              <>
                <div className="border-l border-white/10 h-8 pl-4">
                  <span className="block text-[8px] text-slate-300 font-black uppercase tracking-wider">Speed</span>
                  <span className="font-extrabold text-xs">{telemetrySpeed} km/h</span>
                </div>
                <div className="border-l border-white/10 h-8 pl-4">
                  <span className="block text-[8px] text-slate-300 font-black uppercase tracking-wider">Next Stop</span>
                  <span className="font-extrabold text-[10px] truncate max-w-[120px] block">{nextStopName}</span>
                </div>
                <div className="border-l border-white/10 h-8 pl-4">
                  <span className="block text-[8px] text-indigo-300 font-black uppercase tracking-wider">ETA</span>
                  <span className="font-extrabold text-xs text-indigo-300 block">
                    {calculateETA() ? `${calculateETA().etaMinutes} (${calculateETA().distance} km)` : 'Calculating...'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Driver Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Location Sharing & Stops Config */}
        <div className="space-y-6">
          {/* Share Location Control Card */}
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Telemetry Controls</h3>
            
            {isSharing ? (
              <button
                onClick={stopLocationSharing}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                Stop Location Sharing
              </button>
            ) : (
              <button
                onClick={startLocationSharing}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Location Sharing
              </button>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-400">Current Lat:</span>
                <span className="font-extrabold text-slate-700">{currentLat}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-400">Current Lng:</span>
                <span className="font-extrabold text-slate-700">{currentLng}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden relative z-0 shadow-inner">
              <div 
                ref={mapContainerRef} 
                className="w-full h-[220px]"
              />
            </div>
          </Card>

          {/* Quick Add Stop */}
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Add Temporary Stop</h3>
            <form onSubmit={handleAddStop} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Near Police Station"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                  <input 
                    type="text"
                    value={newStopLat}
                    onChange={(e) => setNewStopLat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                  <input 
                    type="text"
                    value={newStopLng}
                    onChange={(e) => setNewStopLng(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addStopMutation.isPending}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {addStopMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Stop
              </button>
            </form>
          </Card>
        </div>

        {/* Right pane: Attendance marking & allocated students stop editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-extrabold text-slate-800">Trip Boarding Attendance</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Mark students boarding or alighting the vehicle.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTripType('Pickup')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-colors cursor-pointer ${
                    tripType === 'Pickup' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  Pickup (AM)
                </button>
                <button
                  onClick={() => setTripType('Dropoff')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-colors cursor-pointer ${
                    tripType === 'Dropoff' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  Dropoff (PM)
                </button>
              </div>
            </div>

            {/* List Students */}
            <div className="space-y-4">
              {activeRoute.studentsAllocated?.map((alloc) => (
                <div key={alloc.student?._id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">{alloc.student?.user?.name}</h5>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Assigned Stop: {alloc.stopName}</p>
                    
                    {/* Direct Stop Assignment for driver */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-bold">Change Stop:</span>
                      <select
                        value={alloc.stopName}
                        onChange={(e) => handleUpdateStudentStop(alloc.student?._id, e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        {activeRoute.stops?.map((stop, sIdx) => (
                          <option key={sIdx} value={stop.stopName}>{stop.stopName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex gap-2">
                    {['Boarded', 'Absent', 'Left'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setAttendanceRecords({ ...attendanceRecords, [alloc.student?._id]: status })}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          attendanceRecords[alloc.student?._id] === status
                            ? status === 'Boarded' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : status === 'Absent' 
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {(!activeRoute.studentsAllocated || activeRoute.studentsAllocated.length === 0) && (
                <div className="text-center py-8 text-slate-400 italic">No students allocated to this route.</div>
              )}
            </div>

            {/* Submit Attendance */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleMarkAttendance}
                disabled={markAttendanceMutation.isPending || !activeRoute.studentsAllocated?.length}
                className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
              >
                {markAttendanceMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Attendance Log
              </button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
