import { Router } from 'express';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Sample screen data for Isaac
const screens = [
  {
    id: 1,
    name: 'Hello World Screen',
    type: 'welcome',
    description: 'A simple Hello World screen to demonstrate the application',
    components: ['welcome-message', 'hello-text', 'timestamp', 'action-button'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Employee Scheduling Screen',
    type: 'employee',
    description: 'Advanced employee scheduling interface with availability management and shift planning',
    components: ['schedule-grid', 'availability-editor', 'shift-management', 'employee-profile', 'messages-tab', 'profile-tab'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Login Screen',
    type: 'authentication',
    description: 'User login interface with email and password',
    components: ['email-input', 'password-input', 'login-button', 'forgot-password-link'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Dashboard Screen',
    type: 'main',
    description: 'Main user dashboard with navigation and overview',
    components: ['navigation-bar', 'user-profile', 'quick-actions', 'recent-activity'],
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Profile Settings',
    type: 'settings',
    description: 'User profile management and preferences',
    components: ['profile-form', 'avatar-upload', 'preferences-panel', 'save-button'],
    status: 'draft',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

// GET /api/screens - Get all screens
router.get('/', (req, res) => {
  const { type, status } = req.query;
  
  let filteredScreens = screens;
  
  if (type) {
    filteredScreens = filteredScreens.filter(screen => screen.type === type);
  }
  
  if (status) {
    filteredScreens = filteredScreens.filter(screen => screen.status === status);
  }
  
  res.json({
    success: true,
    data: filteredScreens,
    count: filteredScreens.length,
    filters: { type, status },
    timestamp: new Date().toISOString()
  });
});

// GET /api/screens/employee-scheduling - Get Employee Scheduling screen as HTML
router.get('/employee-scheduling', (req, res, next) => {
  const employeeScreen = screens.find(screen => screen.name === 'Employee Scheduling Screen');
  
  if (!employeeScreen) {
    return next(createError('Employee Scheduling screen not found', 404));
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Employee Scheduling - User Screens 4 Isaac</title>
        <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <div id="root"></div>
        
        <script type="text/babel">
            const { useState, useEffect, useRef } = React;
            
            // Simple SVG icon components
            const Calendar = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            );
            
            const User = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            );
            
            const MessageSquare = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            );
            
            const Edit = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            );
            
            const ChevronDown = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            );

            const EmployeeManagementUI = () => {
              const [activeTab, setActiveTab] = useState('schedule');

              const tabs = [
                { id: 'schedule', name: 'Schedule', icon: Calendar },
                { id: 'messages', name: 'Messages', icon: MessageSquare },
                { id: 'profile', name: 'Profile', icon: User }
              ];

              const renderTabContent = () => {
                switch(activeTab) {
                  case 'schedule':
                    return <ScheduleTab />;
                  case 'messages':
                    return <MessagesTab />;
                  case 'profile':
                    return <ProfileTab />;
                  default:
                    return <ScheduleTab />;
                }
              };

              return (
                <div className="min-h-screen bg-gray-50">
                  <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sarah Johnson</h1>
                            <p className="text-gray-600">Front Desk Associate • EMP-1234</p>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Full-Time</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 border-b -mb-px">
                        {tabs.map(tab => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={\`px-6 py-3 font-medium border-b-2 transition-colors \${
                                activeTab === tab.id
                                  ? 'border-blue-600 text-blue-600'
                                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                              }\`}
                            >
                              <Icon className="w-4 h-4 inline mr-2" />
                              {tab.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-w-7xl mx-auto">
                    {renderTabContent()}
                  </div>
                </div>
              );
            };

            const ScheduleTab = () => {
              const [viewMode, setViewMode] = useState('week');
              const [showOpenShifts, setShowOpenShifts] = useState(false);
              const [editingAvailability, setEditingAvailability] = useState(false);
              const [availabilityBrush, setAvailabilityBrush] = useState('available');
              const [isDrawing, setIsDrawing] = useState(false);
              const brushRef = useRef(availabilityBrush);
              
              useEffect(() => {
                brushRef.current = availabilityBrush;
              }, [availabilityBrush]);


              const roleColors = {
                barista: '#3b82f6',
                manager: '#f97316'
              };

              const shifts = [
                {
                  id: 1,
                  dayIndex: 1,
                  startHour: 9,
                  startMinute: 0,
                  endHour: 13,
                  endMinute: 0,
                  role: 'barista',
                  location: 'Main Store',
                  status: 'accepted'
                },
                {
                  id: 2,
                  dayIndex: 3,
                  startHour: 14,
                  startMinute: 0,
                  endHour: 19,
                  endMinute: 0,
                  role: 'manager',
                  location: 'Branch',
                  status: 'assigned'
                },
                {
                  id: 3,
                  dayIndex: 4,
                  startHour: 10,
                  startMinute: 30,
                  endHour: 15,
                  endMinute: 30,
                  role: 'barista',
                  location: 'Main Store',
                  status: 'open'
                }
              ];

              const getStoreHours = (dayIndex) => {
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                return {
                  open: isWeekend ? 10 : 9,
                  close: isWeekend ? 22 : 19
                };
              };

              const weekDays = ['Sun 21', 'Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Sat 27'];
              
              const generateTimeSlots = () => {
                const slots = [];
                // Consider the entire week's hours + 1 hour buffer
                // Find the earliest opening and latest closing times across all days
                let earliestOpen = 24;
                let latestClose = 0;
                
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                  const dayHours = getStoreHours(dayIndex);
                  earliestOpen = Math.min(earliestOpen, dayHours.open);
                  latestClose = Math.max(latestClose, dayHours.close);
                }
                
                const startHour = earliestOpen - 1; // 1 hour before earliest open
                const endHour = latestClose + 1; // 1 hour after latest close
                
                for (let hour = startHour; hour < endHour; hour += 0.5) {
                  const hourInt = Math.floor(hour);
                  const minute = (hour % 1 === 0) ? 0 : 30;
                  slots.push({ 
                    hour: hourInt, 
                    minute, 
                    label: (hour % 1 === 0 && (hour === startHour || hourInt % 2 === 0)) ? formatHour(hourInt) : '' 
                  });
                }
                return slots;
              };

              const formatHour = (hour) => {
                if (hour === 0) return '12a';
                if (hour < 12) return \`\${hour}a\`;
                if (hour === 12) return '12p';
                return \`\${hour - 12}p\`;
              };

              const isOutsideStoreHours = (dayIndex, hour) => {
                const storeHours = getStoreHours(dayIndex);
                // Show business hours + 1 hour buffer, mark buffer hours as closed
                return hour < storeHours.open || hour >= storeHours.close;
              };

              const [timeSlots, setTimeSlots] = useState(() => generateTimeSlots());

              const [availability, setAvailability] = useState(() => {
                const initial = {};
                const generateInitialAvailability = () => {
                  weekDays.forEach((day, dayIndex) => {
                    const slots = generateTimeSlots();
                    slots.forEach((slot, slotIndex) => {
                      const key = \`\${dayIndex}-\${slotIndex}\`;
                      if (isOutsideStoreHours(dayIndex, slot.hour)) {
                        initial[key] = 3;
                      } else {
                        if (dayIndex === 0 && slotIndex < 4) {
                          initial[key] = 0;
                        } else if (dayIndex === 1 && slotIndex < 6) {
                          initial[key] = 0;
                        } else if (dayIndex === 2 && slotIndex >= 10 && slotIndex < 14) {
                          initial[key] = 2;
                        } else {
                          initial[key] = 1;
                        }
                      }
                    });
                  });
                };
                generateInitialAvailability();
                return initial;
              });

              const handleCellMouseDown = (dayIndex, slotIndex) => {
                if (!editingAvailability) return;
                const key = \`\${dayIndex}-\${slotIndex}\`;
                const currentState = availability[key];
                if (currentState === 3) return;
                
                setIsDrawing(true);
                const brush = brushRef.current;
                let newState;
                if (brush === 'unavailable') {
                  newState = 0;
                } else if (brush === 'available') {
                  newState = 1;
                } else {
                  newState = 2;
                }
                
                setAvailability(prev => {
                  const updated = { ...prev, [key]: newState };
                  return updated;
                });
              };

              const handleCellMouseEnter = (dayIndex, slotIndex) => {
                if (!editingAvailability || !isDrawing) return;
                const key = \`\${dayIndex}-\${slotIndex}\`;
                const currentState = availability[key];
                if (currentState === 3) return;
                
                const brush = brushRef.current;
                let newState;
                if (brush === 'unavailable') {
                  newState = 0;
                } else if (brush === 'available') {
                  newState = 1;
                } else {
                  newState = 2;
                }
                
                setAvailability(prev => {
                  const updated = { ...prev, [key]: newState };
                  return updated;
                });
              };

              const handleMouseUp = () => {
                setIsDrawing(false);
              };

              const getCellColor = (state) => {
                switch(state) {
                  case 0: return 'bg-gray-100';
                  case 1: return 'bg-white';
                  case 2: return 'bg-green-100';
                  case 3: return 'bg-gray-400';
                  default: return 'bg-white';
                }
              };

              const timeToSlotIndex = (hour, minute) => {
                const startHour = 8; // Always start from 8am (earliest opening - 1 hour buffer)
                const hourOffset = hour - startHour;
                const slotIndex = hourOffset * 2 + (minute === 30 ? 1 : 0);
                return slotIndex;
              };

              const getShiftAtSlot = (dayIndex, slotIndex) => {
                const slot = timeSlots[slotIndex];
                if (!slot) return null;

                for (const shift of shifts) {
                  if (shift.dayIndex !== dayIndex) continue;

                  const shiftStartSlot = timeToSlotIndex(shift.startHour, shift.startMinute);
                  const shiftEndSlot = timeToSlotIndex(shift.endHour, shift.endMinute);

                  if (slotIndex >= shiftStartSlot && slotIndex < shiftEndSlot) {
                    const totalSlots = shiftEndSlot - shiftStartSlot;
                    const middleSlot = shiftStartSlot + Math.floor(totalSlots / 2);
                    return {
                      ...shift,
                      isFirst: slotIndex === shiftStartSlot,
                      isLast: slotIndex === shiftEndSlot - 1,
                      isMiddle: slotIndex === middleSlot,
                      totalHeight: totalSlots * 20
                    };
                  }
                }
                return null;
              };

              const formatTime = (hour, minute) => {
                const period = hour >= 12 ? 'p' : 'a';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                return \`\${displayHour}:\${minute.toString().padStart(2, '0')}\${period}\`;
              };

              return (
                <div className="p-6 select-none" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                  <div className="bg-white rounded border border-gray-300 mb-4 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">

                      <button 
                        onClick={() => setEditingAvailability(!editingAvailability)}
                        className={\`px-3 py-1 rounded text-sm border \${
                          editingAvailability 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }\`}
                      >
                        Edit Availability
                      </button>

                      <label className="flex items-center gap-1 cursor-pointer text-sm">
                        <input 
                          type="checkbox" 
                          checked={showOpenShifts}
                          onChange={(e) => setShowOpenShifts(e.target.checked)}
                          className="w-3 h-3"
                        />
                        <span>Open Shifts</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">
                          Now
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                      </div>

                      <div className="flex gap-1 bg-gray-100 rounded p-0.5">
                        {['D', 'W', '2W', 'M'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => setViewMode(mode.toLowerCase())}
                            className={\`px-2 py-1 rounded text-sm \${
                              viewMode === mode.toLowerCase() 
                                ? 'bg-white shadow' 
                                : 'hover:bg-gray-200'
                            }\`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {editingAvailability && (
                    <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Paint mode:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="brush"
                            value="unavailable"
                            checked={availabilityBrush === 'unavailable'}
                            onChange={() => setAvailabilityBrush('unavailable')}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
                            <span className="text-sm">Unavailable</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="brush"
                            value="available"
                            checked={availabilityBrush === 'available'}
                            onChange={() => setAvailabilityBrush('available')}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                            <span className="text-sm">Available</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="brush"
                            value="preferred"
                            checked={availabilityBrush === 'preferred'}
                            onChange={() => setAvailabilityBrush('preferred')}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 border border-gray-300 rounded"></div>
                            <span className="text-sm">Preferred</span>
                          </div>
                        </label>
                        <span className="text-sm text-gray-600 ml-auto">
                          Click and drag to paint availability • Current: <strong>{availabilityBrush}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded border border-gray-300 relative" style={{overflow: 'visible'}}>
                    <div className="grid" style={{gridTemplateColumns: 'auto repeat(7, 1fr)', overflow: 'visible'}}>
                      <div className="border-r border-b border-gray-300 bg-gray-50 p-2"></div>
                      {weekDays.map((day, i) => (
                        <div key={i} className="border-r border-b border-gray-300 bg-gray-50 p-2 text-center">
                          <div className="text-sm font-medium">{day}</div>
                        </div>
                      ))}

                      {timeSlots.map((slot, slotIndex) => (
                        <React.Fragment key={slotIndex}>
                          <div className="border-r border-b border-gray-300 bg-gray-50 px-2 text-xs text-gray-600 text-right flex items-center justify-end select-none pointer-events-none" style={{height: '20px'}}>
                            {slot.label}
                          </div>
                          {weekDays.map((day, dayIndex) => {
                            const key = \`\${dayIndex}-\${slotIndex}\`;
                            const cellState = availability[key];
                            const cellColor = getCellColor(cellState);
                            const shift = getShiftAtSlot(dayIndex, slotIndex);
                            
                            return (
                              <div 
                                key={key}
                                className={\`border-r border-b border-gray-300 \${cellColor}\`}
                                style={{
                                  height: '20px',
                                  cursor: editingAvailability && cellState !== 3 ? 'crosshair' : 'default',
                                  position: 'relative'
                                }}
                                onMouseDown={() => handleCellMouseDown(dayIndex, slotIndex)}
                                onMouseEnter={() => handleCellMouseEnter(dayIndex, slotIndex)}
                              >
                                {shift && (
                                  <div 
                                    className="rounded"
                                    style={{
                                      position: 'absolute',
                                      top: shift.isFirst ? '0' : '-1px',
                                      bottom: shift.isLast ? '0' : '-1px',
                                      left: '4px',
                                      right: '4px',
                                      backgroundColor: roleColors[shift.role],
                                      border: \`2px solid \${roleColors[shift.role]}\`,
                                      borderTop: shift.isFirst ? \`2px solid \${roleColors[shift.role]}\` : 'none',
                                      borderBottom: shift.isLast ? \`2px solid \${roleColors[shift.role]}\` : 'none',
                                      borderRadius: shift.isFirst && shift.isLast ? '4px' : 
                                                   shift.isFirst ? '4px 4px 0 0' : 
                                                   shift.isLast ? '0 0 4px 4px' : '0',
                                      zIndex: shift.isFirst ? 50 : 10
                                    }}
                                  >
                                    {shift.status === 'assigned' && (
                                      <div 
                                        className="rounded"
                                        style={{
                                          position: 'absolute',
                                          inset: '0',
                                          background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 4px)',
                                          borderRadius: 'inherit'
                                        }}
                                      />
                                    )}
                                    {shift.status === 'open' && (
                                      <div 
                                        className="rounded"
                                        style={{
                                          position: 'absolute',
                                          inset: '0',
                                          backgroundColor: 'rgba(255,255,255,0.5)',
                                          borderRadius: 'inherit'
                                        }}
                                      />
                                    )}
                                    
                                    {/* Shift Labels - render once on first slot, span full shift height */}
                                    {shift.isFirst && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '0',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          height: (shift.totalHeight) + 'px',
                                          pointerEvents: 'none',
                                          zIndex: 50
                                        }}
                                      >
                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '30%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(90deg)',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            lineHeight: '1.2',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          <div>{formatTime(shift.startHour, shift.startMinute)} - {formatTime(shift.endHour, shift.endMinute)}</div>
                                          <div>{shift.role.charAt(0).toUpperCase() + shift.role.slice(1)}</div>
                                          <div>{shift.location}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded"></div>
                      <span>Closed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-100 border border-gray-300 rounded"></div>
                      <span>Preferred</span>
                    </div>
                    <div className="ml-4 h-4 border-l border-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-4 rounded" style={{backgroundColor: roleColors.barista}}></div>
                      <span>Accepted Shift</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-4 rounded relative" style={{backgroundColor: roleColors.barista}}>
                        <div className="absolute inset-0 rounded" style={{
                          background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 4px)'
                        }}></div>
                      </div>
                      <span>Assigned Shift</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-4 rounded relative" style={{backgroundColor: roleColors.barista}}>
                        <div className="absolute inset-0 rounded" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}></div>
                      </div>
                      <span>Open Shift</span>
                    </div>
                  </div>
                </div>
              );
            };

            const MessagesTab = () => (
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg p-12 text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Messages Tab</p>
                  <p className="text-sm">To be implemented</p>
                </div>
              </div>
            );

            const ProfileTab = () => (
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg p-12 text-center text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Profile Tab</p>
                  <p className="text-sm">To be implemented</p>
                </div>
              </div>
            );

            // Use ReactDOM.render for compatibility
            ReactDOM.render(<EmployeeManagementUI />, document.getElementById('root'));
        </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// GET /api/screens/hello-world - Get Hello World screen as HTML
router.get('/hello-world', (req, res, next) => {
  const helloWorldScreen = screens.find(screen => screen.name === 'Hello World Screen');
  
  if (!helloWorldScreen) {
    return next(createError('Hello World screen not found', 404));
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World Screen - User Screens 4 Isaac</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .container {
                text-align: center;
                max-width: 600px;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .welcome-message {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .hello-text {
                font-size: 1.5rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            
            .timestamp {
                font-size: 1rem;
                opacity: 0.7;
                margin-bottom: 2rem;
                font-family: 'Monaco', 'Consolas', monospace;
            }
            
            .action-button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 1.1rem;
            }
            
            .action-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .components-info {
                margin-top: 2rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                font-size: 0.9rem;
            }
            
            .components-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
                margin-top: 0.5rem;
            }
            
            .component-tag {
                background: rgba(255, 255, 255, 0.2);
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="welcome-message">👋 Hello World!</div>
            <div class="hello-text">Welcome to User Screens 4 Isaac</div>
            <div class="timestamp" id="timestamp">Loading...</div>
            <button class="action-button" onclick="updateTimestamp()">Update Time</button>
            
            <div class="components-info">
                <strong>Screen Components:</strong>
                <div class="components-list">
                    ${helloWorldScreen.components.map(component => 
                        `<span class="component-tag">${component}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
        
        <script>
            function updateTimestamp() {
                const timestamp = new Date().toLocaleString();
                document.getElementById('timestamp').textContent = timestamp;
            }
            
            // Initialize timestamp
            updateTimestamp();
        </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// GET /api/screens/:id - Get specific screen
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screen = screens.find(s => s.id === id);
  
  if (!screen) {
    return next(createError('Screen not found', 404));
  }
  
  res.json({
    success: true,
    data: screen,
    timestamp: new Date().toISOString()
  });
});

// POST /api/screens - Create new screen
router.post('/', (req, res, next) => {
  const { name, type, description, components, status = 'draft' } = req.body;
  
  if (!name || !type || !description) {
    return next(createError('Name, type, and description are required', 400));
  }
  
  const newScreen = {
    id: screens.length + 1,
    name,
    type,
    description,
    components: components || [],
    status,
    createdAt: new Date().toISOString()
  };
  
  screens.push(newScreen);
  
  res.status(201).json({
    success: true,
    data: newScreen,
    message: 'Screen created successfully',
    timestamp: new Date().toISOString()
  });
});

// PUT /api/screens/:id - Update screen
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screenIndex = screens.findIndex(s => s.id === id);
  
  if (screenIndex === -1) {
    return next(createError('Screen not found', 404));
  }
  
  const { name, type, description, components, status } = req.body;
  
  if (!name || !type || !description) {
    return next(createError('Name, type, and description are required', 400));
  }
  
  screens[screenIndex] = {
    ...screens[screenIndex],
    name,
    type,
    description,
    components: components || screens[screenIndex].components,
    status: status || screens[screenIndex].status
  };
  
  res.json({
    success: true,
    data: screens[screenIndex],
    message: 'Screen updated successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/screens/:id - Delete screen
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const screenIndex = screens.findIndex(s => s.id === id);
  
  if (screenIndex === -1) {
    return next(createError('Screen not found', 404));
  }
  
  const deletedScreen = screens.splice(screenIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedScreen,
    message: 'Screen deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// GET /api/screens/types - Get available screen types
router.get('/meta/types', (req, res) => {
  const types = [...new Set(screens.map(screen => screen.type))];
  
  res.json({
    success: true,
    data: types,
    count: types.length,
    timestamp: new Date().toISOString()
  });
});

export default router;
