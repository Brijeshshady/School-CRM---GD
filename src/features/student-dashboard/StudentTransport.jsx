import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Truck, MapPin, Navigation, Loader2, Sparkles, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useRoutes, useBusAttendance } from '../transport/hooks/useTransport';
import api from '../../lib/api';
import io from 'socket.io-client';

export const StudentTransport = () => {
  // 1. Fetch student profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const res = await api.get('/students/profile');
      return res.data.data;
    }
  });

  const studentId = profile?._id;

  // 2. Fetch routes and filter to the student's route
  const { data: routes = [], isLoading: routesLoading, refetch: refetchRoutes } = useRoutes();
  const studentRoute = routes.find(route => 
    route.studentsAllocated?.some(alloc => alloc.student?._id === studentId)
  );

  // Student specific allocation details
  const myAllocation = studentRoute?.studentsAllocated?.find(alloc => alloc.student?._id === studentId);

  // 3. Fetch attendance boarding log for this student today
  const today = new Date().toISOString().split('T')[0];
  const { data: attendanceLogs = [], isLoading: attendanceLoading } = useBusAttendance({
    studentId,
    date: today
  });

  const todayBoardingRecord = attendanceLogs[0]; // boarding log for today

  // Real-time location state
  const [busLat, setBusLat] = useState(null);
  const [busLng, setBusLng] = useState(null);
  const [busSpeed, setBusSpeed] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  const socketRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const stopsGroupRef = useRef(null);
  const polylineRef = useRef(null);

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
    if (!busLat || !busLng || !studentRoute?.stops || studentRoute.stops.length === 0) return null;

    let closestStop = null;
    let minDistance = Infinity;

    studentRoute.stops.forEach(stop => {
      const dist = getDistance(busLat, busLng, stop.latitude, stop.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closestStop = stop;
      }
    });

    if (!closestStop) return null;

    const speed = Math.max(busSpeed || 35, 5);
    const etaMinutes = Math.round((minDistance / speed) * 60);

    return {
      stopName: closestStop.stopName,
      distance: minDistance.toFixed(2),
      etaMinutes: etaMinutes === 0 ? "Arrived" : `${etaMinutes} mins`
    };
  };

  // Load Leaflet dynamically
  useEffect(() => {
    if (!studentRoute) return;

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

      const initialLat = studentRoute.stops?.[0]?.latitude || 13.0850;
      const initialLng = studentRoute.stops?.[0]?.longitude || 80.2120;

      // Initialize map
      const map = window.L.map(mapContainerRef.current).setView([initialLat, initialLng], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      stopsGroupRef.current = window.L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    };

    loadScript();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [studentRoute]);

  // Update stops and polyline on map when route/stops change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !studentRoute) return;

    // Clear old polyline and stop markers
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    if (stopsGroupRef.current) {
      stopsGroupRef.current.clearLayers();
    }

    // Draw route path line if stops exist
    if (studentRoute.stops && studentRoute.stops.length > 0) {
      const pathCoords = studentRoute.stops.map(stop => [stop.latitude, stop.longitude]);
      polylineRef.current = window.L.polyline(pathCoords, { color: '#4f46e5', weight: 4, opacity: 0.7 }).addTo(map);
      
      // Add markers for stops
      studentRoute.stops.forEach(stop => {
        const isMyStop = stop.stopName === myAllocation?.stopName;
        window.L.circleMarker([stop.latitude, stop.longitude], {
          radius: isMyStop ? 8 : 6,
          fillColor: isMyStop ? '#4f46e5' : '#ef4444',
          color: 'white',
          weight: 2,
          fillOpacity: 1
        }).addTo(stopsGroupRef.current).bindPopup(`<b>Stop:</b> ${stop.stopName}<br/><b>Scheduled:</b> ${stop.scheduledTime}${isMyStop ? ' (My Stop)' : ''}`);
      });
    }
  }, [studentRoute, myAllocation]);

  // Update marker position dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !busLat || !busLng) return;

    if (!markerRef.current) {
      const busIcon = window.L.divIcon({
        html: `<div class="bg-indigo-600 p-2.5 rounded-full border-2 border-white shadow-lg text-white flex items-center justify-center animate-bounce"><svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></div>`,
        className: 'custom-bus-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      markerRef.current = window.L.marker([busLat, busLng], { icon: busIcon }).addTo(mapInstanceRef.current);
    } else {
      markerRef.current.setLatLng([busLat, busLng]);
    }
    mapInstanceRef.current.panTo([busLat, busLng]);
  }, [busLat, busLng]);

  // Socket listener for live location sharing and stop updates
  useEffect(() => {
    if (!studentRoute) return;

    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token: `Bearer ${token}` }
    });

    socketRef.current.on('connect', () => {
      console.log('Student Sockets connection initiated');
      socketRef.current.emit('join-route', studentRoute._id);
    });

    socketRef.current.on('route-location-changed', (data) => {
      if (data.routeId === studentRoute._id) {
        setBusLat(parseFloat(data.latitude.toFixed(6)));
        setBusLng(parseFloat(data.longitude.toFixed(6)));
        setLastUpdate(new Date(data.timestamp || new Date()).toLocaleTimeString());
      }
    });

    socketRef.current.on('route-stops-updated', (data) => {
      if (data.routeId === studentRoute._id) {
        refetchRoutes();
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [studentRoute]);

  const isLoading = profileLoading || routesLoading || attendanceLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-bold text-slate-600">Retrieving transit tracking database...</p>
      </div>
    );
  }

  if (!studentRoute) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-12 text-center max-w-lg mx-auto mt-20">
        <AlertCircle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">No Transport Allocation</h3>
        <p className="text-xs text-slate-400 mt-1">You are not currently allocated to any school bus routes. Please contact Admin.</p>
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
              Route Number: {studentRoute.routeNumber}
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">{studentRoute.routeName}</h1>
            <p className="text-slate-400 font-semibold mt-1">
              Live tracking dashboard for your daily school transport.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
              <Clock className="w-6 h-6 text-indigo-300" />
              <div>
                <span className="block text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Designated Stop</span>
                <span className="font-extrabold text-sm">{myAllocation?.stopName || 'N/A'}</span>
              </div>
            </div>

            {busLat && busLng && (
              <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
                <Navigation className="w-6 h-6 text-emerald-300 animate-pulse" />
                <div>
                  <span className="block text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">ETA to Next Stop</span>
                  <span className="font-extrabold text-sm text-emerald-300">
                    {calculateETA() ? `${calculateETA().etaMinutes} (${calculateETA().distance} km)` : 'Calculating...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Driver Contacts & Boarding Status */}
        <div className="space-y-6">
          {/* Driver details */}
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Bus & Crew Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold">Bus Number:</span>
                <span className="font-extrabold text-slate-800 text-xs">{studentRoute.vehicleNumber}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold">Driver Name:</span>
                <span className="font-bold text-slate-800 text-xs">{studentRoute.driver?.name || studentRoute.driverName || 'N/A'}</span>
              </div>
              {studentRoute.driverPhone && (
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-bold">Contact:</span>
                  <a href={`tel:${studentRoute.driverPhone}`} className="text-indigo-600 font-bold text-xs flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {studentRoute.driverPhone}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Today's boarding status */}
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Today's Boarding Log</h3>

            {todayBoardingRecord ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <p className="font-black text-xs uppercase tracking-wide">Boarded Bus</p>
                  <p className="text-[10px] opacity-75 font-semibold mt-0.5">Marked: {new Date(todayBoardingRecord.markedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl">
                <Clock className="w-8 h-8 animate-pulse" />
                <div>
                  <p className="font-black text-xs uppercase tracking-wide">Waiting for Boarding</p>
                  <p className="text-[10px] opacity-75 font-semibold mt-0.5">Please board at your scheduled pickup time.</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right pane: Visual Live Telemetry Tracker map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-800">Live Telemetry Route Tracker</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Bus progress advances along stops in real-time.</p>
              </div>

              {lastUpdate && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Last signal: {lastUpdate}
                </span>
              )}
            </div>

            {/* Live Interactive Map */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden relative z-0 shadow-inner">
              <div 
                ref={mapContainerRef} 
                className="w-full h-[300px]"
              />
            </div>

            {/* Transit progression line */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Transit Schedule & Stops</h5>
                <span className="text-[9px] font-bold text-slate-400">Scale: Active</span>
              </div>

              <div className="relative py-6">
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>

                <div className="flex justify-between relative">
                  {studentRoute.stops?.map((stop, sIdx) => {
                    const isAllocatedStop = stop.stopName === myAllocation?.stopName;
                    
                    return (
                      <div key={sIdx} className="flex flex-col items-center space-y-3 relative z-10">
                        {/* Dot */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isAllocatedStop 
                            ? 'bg-indigo-600 border-white ring-4 ring-indigo-500/30' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          <MapPin className={`w-4 h-4 ${isAllocatedStop ? 'text-white' : 'text-slate-400'}`} />
                        </div>

                        {/* Labels */}
                        <div className="text-center">
                          <p className="font-extrabold text-[10px] text-slate-700 max-w-[80px] truncate">{stop.stopName}</p>
                          <p className="text-[8px] text-slate-400 font-bold mt-0.5">{stop.scheduledTime}</p>
                          {isAllocatedStop && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-[7px] font-black uppercase tracking-wider">
                              My Stop
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live coordinates display */}
              {busLat && busLng ? (
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Bus GPS Latitude</span>
                    <span className="font-extrabold text-slate-700 text-xs mt-0.5 block">{busLat}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Bus GPS Longitude</span>
                    <span className="font-extrabold text-slate-700 text-xs mt-0.5 block">{busLng}</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 font-bold text-xs italic bg-white rounded-2xl border border-dashed border-slate-200">
                  <Navigation className="w-4 h-4 mx-auto mb-1 text-slate-450 animate-pulse" />
                  Waiting for driver to start location sharing...
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
