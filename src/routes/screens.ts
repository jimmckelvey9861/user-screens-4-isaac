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
            const { useState, useEffect, useRef, useMemo } = React;
            
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
            
            const InfinityIcon = ({ className, ...props }) => (
              <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.5 9.5c-1.657 0-3.5 1.5-6.5 3.5 3 2 4.843 3.5 6.5 3.5 2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5zM5.5 9.5c1.657 0 3.5 1.5 6.5 3.5-3 2-4.843 3.5-6.5 3.5C3.015 16.5 1 14.485 1 12s2.015-4.5 4.5-4.5z" />
              </svg>
            );
            
            // Global scheduling template saved from Profile > Scheduling Preferences
            let savedAvailabilityTemplate = null; // { [dow:0..6]: number[48] }

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
              const [is24HourView, setIs24HourView] = useState(false);
              const [editingAvailability, setEditingAvailability] = useState(false);
              const [availabilityBrush, setAvailabilityBrush] = useState('available');
              const [isDrawing, setIsDrawing] = useState(false);
              const brushRef = useRef(availabilityBrush);
              const prevTimeSlotsRef = useRef(null);
              const [startOffsetDays, setStartOffsetDays] = useState(0);
              // Base date drives all calendar views (today by default)
              const [baseDate, setBaseDate] = useState(() => {
                const d = new Date();
                d.setHours(0,0,0,0);
                return d;
              });
              const monthLength = 31; // simple month length for demo; wraps after 31
              const [modalShift, setModalShift] = useState(null);
              
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
                    status: 'accepted',
                    workerName: 'Sarah Johnson'
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
                  status: 'open'
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
                },
                // Samples: Assigned but unaccepted (solid 50% white cover)
                {
                  id: 4,
                  dayIndex: 0, // Sunday
                  startHour: 12,
                  startMinute: 0,
                  endHour: 16,
                  endMinute: 0,
                  role: 'barista',
                  location: 'Main Store',
                  status: 'assigned'
                },
                {
                  id: 5,
                  dayIndex: 2, // Tuesday
                  startHour: 8,
                  startMinute: 0,
                  endHour: 12,
                  endMinute: 0,
                  role: 'manager',
                  location: 'Branch',
                  status: 'assigned'
                },
                {
                  id: 6,
                  dayIndex: 1, // Monday
                  startHour: 15,
                  startMinute: 0,
                  endHour: 19,
                  endMinute: 0,
                  role: 'manager',
                  location: 'Branch',
                    status: 'accepted',
                    workerName: 'Miguel Santos'
                }
              ];

              // When in 2W view, duplicate the same shifts into week 2 (dayIndex + 7)
              const weeksToShow = viewMode === '2w' ? 2 : 1;
              const displayShifts = useMemo(() => {
                if (weeksToShow === 2) {
                  const duplicated = shifts.map(s => ({ ...s, id: s.id + 1000, dayIndex: s.dayIndex + 7 }));
                  return shifts.concat(duplicated);
                }
                return shifts;
              }, [weeksToShow]);

              const getStoreHours = (dayIndex) => {
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                return {
                  open: isWeekend ? 10 : 9,
                  close: isWeekend ? 22 : 19
                };
              };

              // Canonical calendar model based on baseDate
              const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
              const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
              const calendarYear = baseDate.getFullYear();
              const calendarMonth = baseDate.getMonth();
              const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
              const baseWeekDays = Array.from({length: 7}, (_, i) => {
                const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - baseDate.getDay() + i);
                return dayNames[d.getDay()] + ' ' + d.getDate();
              });

              const startOfWeek = (date) => {
                const d = new Date(date);
                const diff = d.getDay();
                d.setDate(d.getDate() - diff);
                d.setHours(0,0,0,0);
                return d;
              };
              const addDays = (date, n) => {
                const d = new Date(date);
                d.setDate(d.getDate() + n);
                return d;
              };
              const getWeekDays = (weeks) => {
                const start = startOfWeek(baseDate);
                const result = [];
                for (let i = 0; i < weeks * 7; i++) {
                  const d = addDays(start, i);
                  result.push(dayNames[d.getDay()] + ' ' + d.getDate());
                }
                return result;
              };

              const baseSelectedDayIndex = 1; // Monday as the initial Day view target
              const getDaysForView = () => {
                if (viewMode === 'd') {
                  const d = new Date(baseDate);
                  const label = dayNames[d.getDay()] + ' ' + d.getDate();
                  return { labels: [label], indices: [d.getDay()] };
                }
                if (weeksToShow === 2) {
                  const labels = getWeekDays(2);
                  return { labels, indices: labels.map((_, i) => (startOfWeek(baseDate).getDay() + i) % 7) };
                }
                const labels = getWeekDays(1);
                return { labels, indices: labels.map((_, i) => (startOfWeek(baseDate).getDay() + i) % 7) };
              };
              const daysForView = getDaysForView();
              const weekDays = daysForView.labels;
              const dayIndices = daysForView.indices;
              const currentDayGlobalIndex = dayIndices && dayIndices.length === 1 ? dayIndices[0] : null;

              const periodLabel = (() => {
                if (viewMode === 'd') {
                  return weekDays[0];
                }
                if (viewMode === 'm' || viewMode === 'month') {
                  return monthNames[calendarMonth] + ' ' + calendarYear;
                }
                // Week or 2-week: show date range from first to last label
                if (weekDays.length > 0) {
                  const first = weekDays[0];
                  const last = weekDays[weekDays.length - 1];
                  return first + ' – ' + last;
                }
                return 'Week';
              })();

              // Month view renderer
              const renderMonthView = () => {
                // Show full calendar month grid (start from Sunday on/before 1st, 6 weeks)
                const first = new Date(calendarYear, calendarMonth, 1);
                const monthStartGrid = new Date(first);
                monthStartGrid.setDate(1 - monthStartGrid.getDay());
                const visibleYear = first.getFullYear();
                const cells = [];
                for (let i = 0; i < 42; i++) { // 6 weeks x 7 days
                  const d = new Date(monthStartGrid);
                  d.setDate(monthStartGrid.getDate() + i);
                  const dayNum = d.getDate();
                  const dow = d.getDay();
                  const inCurrentMonth = d.getMonth() === calendarMonth;
                  const shiftsForDow = displayShifts.filter(s => s.dayIndex === dow && (showOpenShifts || s.status !== 'open'));
                  const single = shiftsForDow.length === 1;
                  const chipHeight = single ? 40 : 26;
                  const chipsToShow = single ? shiftsForDow.slice(0, 1) : shiftsForDow.slice(0, 2);
                  cells.push({ dayNum, dow, inCurrentMonth, chipsToShow, chipHeight, dateObj: d });
                }

                return (
                  <div className="bg-white rounded border border-gray-300" style={{overflow: 'hidden'}}>
                    <div className="grid" style={{gridTemplateColumns: 'repeat(7, 1fr)'}}>
                      {dayNames.map((d, i) => (
                        <div key={i} className="border-r border-b border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium">{d}</div>
                      ))}
                      {cells.map((cell, idx) => (
                        <div key={idx} className={"border-r border-b cursor-pointer " + (cell.inCurrentMonth ? 'border-gray-200' : 'bg-gray-50 text-gray-400 border-gray-100')} style={{minHeight: '100px', padding: '6px'}} onClick={() => {
                          setBaseDate(new Date(cell.dateObj.getFullYear(), cell.dateObj.getMonth(), cell.dateObj.getDate()));
                          setViewMode('d');
                        }}>
                          <div className="text-xs mb-1">{cell.dayNum}</div>
                          <div className="flex flex-col gap-1">
                          {cell.chipsToShow.map((shift, si) => (
                            <div 
                              key={si} 
                              className="rounded relative cursor-pointer" 
                              style={{height: cell.chipHeight + 'px', backgroundColor: roleColors[shift.role], border: '1px solid ' + roleColors[shift.role]}}
                              onClick={(e) => { e.stopPropagation(); setModalShift(shift); }}
                            >
                              {shift.status === 'assigned' && (
                                <div className="absolute inset-0 rounded" style={{backgroundColor: 'rgba(255,255,255,0.5)', pointerEvents: 'none'}}></div>
                              )}
                              {shift.status === 'open' && (
                                <div className="absolute inset-0 rounded" style={{background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 10px, transparent 10px, transparent 20px)', pointerEvents: 'none'}}></div>
                              )}
                              <div className="absolute left-1 right-1 top-1 text-[10px] font-semibold text-white drop-shadow-sm truncate" style={{lineHeight: '1', pointerEvents: 'none'}}>
                                {(shift.status === 'accepted' && shift.workerName) ? shift.workerName : (shift.role.charAt(0).toUpperCase() + shift.role.slice(1))}
                              </div>
                            </div>
                          ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              };

              const generateTimeSlotsForView = (use24HourView) => {
                const slots = [];
                let startHour;
                let endHour;
                if (use24HourView) {
                  startHour = 0;
                  endHour = 24;
                } else {
                  // If Day view, use that day's hours to compute the visible range
                  if (viewMode === 'd' && dayIndices && dayIndices.length === 1) {
                    const dow = (dayIndices[0] % 7 + 7) % 7;
                    const hours = getStoreHours(dow);
                    startHour = hours.open - 1;
                    endHour = hours.close + 1;
                  } else {
                    // Week / 2W: use min/max across the week so all days fit
                let earliestOpen = 24;
                let latestClose = 0;
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                  const dayHours = getStoreHours(dayIndex);
                  earliestOpen = Math.min(earliestOpen, dayHours.open);
                  latestClose = Math.max(latestClose, dayHours.close);
                }
                    startHour = earliestOpen - 1; // 1 hour before earliest open
                    endHour = latestClose + 1; // 1 hour after latest close
                  }
                }
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

              const generateTimeSlots = () => generateTimeSlotsForView(is24HourView);

              const formatHour = (hour) => {
                if (hour === 0) return '12a';
                if (hour < 12) return hour + 'a';
                if (hour === 12) return '12p';
                return (hour - 12) + 'p';
              };

              const isOutsideStoreHours = (dayIndex, hour) => {
                const storeHours = getStoreHours(dayIndex % 7);
                // Show business hours + 1 hour buffer, mark buffer hours as closed
                return hour < storeHours.open || hour >= storeHours.close;
              };

              const [timeSlots, setTimeSlots] = useState(() => generateTimeSlots());
              
              // Canonical availability storage: per absolute day number (1..monthLength), 48 half-hour slots
              const [availabilityByDay, setAvailabilityByDay] = useState({});

              const dayNameToDow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
              const getAbsDayNumForColumn = (dayIndex) => {
                const label = weekDays[dayIndex] || '';
                const parts = label.split(' ');
                const num = parseInt(parts[1], 10);
                return isNaN(num) ? 1 : num;
              };
              const getDowForColumn = (dayIndex) => {
                const label = weekDays[dayIndex] || '';
                const name = label.split(' ')[0];
                return typeof dayNameToDow[name] === 'number' ? dayNameToDow[name] : 0;
              };
              const ensureDayArray = (absDayNum, dow) => {
                const key = String(absDayNum);
                const existing = availabilityByDay[key];
                if (Array.isArray(existing) && existing.length === 48) return existing;
                // build defaults for this day based on store hours
                const hours = getStoreHours(dow);
                const arr = new Array(48).fill(1); // available by default inside hours
                for (let i = 0; i < 48; i++) {
                  const hour = Math.floor(i / 2);
                  if (hour < hours.open || hour >= hours.close) arr[i] = 3; // closed
                }
                setAvailabilityByDay((prev) => ({ ...prev, [key]: arr }));
                return arr;
              };
              const getSlotIndex = (slot) => slot.hour * 2 + (slot.minute === 30 ? 1 : 0);

              // Regenerate slots when toggling 24h view
              useEffect(() => {
                // store previous before regenerating for mapping
                prevTimeSlotsRef.current = timeSlots;
                setTimeSlots(generateTimeSlots());
              }, [is24HourView]);

              // Regenerate slots when switching Day view day (so labels and banding align to the day's hours)
              useEffect(() => {
                if (viewMode === 'd') {
                  prevTimeSlotsRef.current = timeSlots;
                  setTimeSlots(generateTimeSlots());
                }
              }, [viewMode, JSON.stringify(dayIndices)]);

              const [availability, setAvailability] = useState(() => {
                const initial = {};
                const generateInitialAvailability = () => {
                  weekDays.forEach((day, dayIndex) => {
                    const slots = generateTimeSlots();
                    slots.forEach((slot, slotIndex) => {
                      const key = dayIndex + '-' + slotIndex;
                      const globalDow = (dayIndices && dayIndices[dayIndex] !== undefined) ? (dayIndices[dayIndex] % 7) : (dayIndex % 7);
                      if (isOutsideStoreHours(globalDow, slot.hour)) {
                        initial[key] = 3;
                      } else {
                        if (globalDow === 0 && slotIndex < 4) {
                          initial[key] = 0;
                        } else if (globalDow === 1 && slotIndex < 6) {
                          initial[key] = 0;
                        } else if (globalDow === 2 && slotIndex >= 10 && slotIndex < 14) {
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

              // Rebuild availability defaults when the number of time slots or days changes
              useEffect(() => {
                const prevSlots = prevTimeSlotsRef.current;
                if (prevSlots && Array.isArray(prevSlots) && prevSlots.length > 0) {
                  const prevStart = prevSlots[0].hour * 60 + (prevSlots[0].minute || 0);
                  const newStart = timeSlots.length > 0 ? (timeSlots[0].hour * 60 + (timeSlots[0].minute || 0)) : 0;
                  setAvailability(prev => {
                    const next = {};
                    // Map previous availability to new grid by minute-of-day
                    for (let dayIndex = 0; dayIndex < weekDays.length; dayIndex++) {
                      const globalDow = (dayIndices && dayIndices[dayIndex] !== undefined) ? (dayIndices[dayIndex] % 7) : (dayIndex % 7);
                      for (let prevIdx = 0; prevIdx < prevSlots.length; prevIdx++) {
                        const prevKey = dayIndex + '-' + prevIdx;
                        const state = prev[prevKey];
                        if (state === undefined) continue;
                        const absMin = prevStart + prevIdx * 30;
                        const newIdx = Math.floor((absMin - newStart) / 30);
                        if (newIdx >= 0 && newIdx < timeSlots.length) {
                          const newKey = dayIndex + '-' + newIdx;
                          next[newKey] = state;
                        }
                      }
                      // Fill any gaps using store-hours defaults
                      for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
                        const key = dayIndex + '-' + slotIndex;
                        if (next[key] === undefined) {
                          const slot = timeSlots[slotIndex];
                          next[key] = isOutsideStoreHours(globalDow, slot.hour) ? 3 : 1;
                        }
                      }
                    }
                    return next;
                  });
                  // clear ref so subsequent changes rebuild normally
                  prevTimeSlotsRef.current = null;
                  return;
                }

                setAvailability(prev => {
                  const next = {};
                  for (let dayIndex = 0; dayIndex < weekDays.length; dayIndex++) {
                    for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
                      const slot = timeSlots[slotIndex];
                      const key = dayIndex + '-' + slotIndex;
                      const prevVal = prev[key];
                      const globalDow = (dayIndices && dayIndices[dayIndex] !== undefined) ? (dayIndices[dayIndex] % 7) : (dayIndex % 7);
                      next[key] = (typeof prevVal === 'number') ? prevVal : (isOutsideStoreHours(globalDow, slot.hour) ? 3 : 1);
                    }
                  }
                  return next;
                });
              }, [timeSlots, weekDays.length, JSON.stringify(dayIndices)]);

              const handleCellMouseDown = (dayIndex, slotIndex) => {
                if (!editingAvailability) return;
                const dow = getDowForColumn(dayIndex);
                const absDay = getAbsDayNumForColumn(dayIndex);
                const slot = timeSlots[slotIndex];
                const minuteIdx = getSlotIndex(slot);
                const dayArr = ensureDayArray(absDay, dow).slice();
                if (dayArr[minuteIdx] === 3) return; // closed
                
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
                
                dayArr[minuteIdx] = newState;
                setAvailabilityByDay((prev) => ({ ...prev, [String(absDay)]: dayArr }));
              };

              const handleCellMouseEnter = (dayIndex, slotIndex) => {
                if (!editingAvailability || !isDrawing) return;
                const dow = getDowForColumn(dayIndex);
                const absDay = getAbsDayNumForColumn(dayIndex);
                const slot = timeSlots[slotIndex];
                const minuteIdx = getSlotIndex(slot);
                const dayArr = ensureDayArray(absDay, dow).slice();
                if (dayArr[minuteIdx] === 3) return; // closed
                
                const brush = brushRef.current;
                let newState;
                if (brush === 'unavailable') {
                  newState = 0;
                } else if (brush === 'available') {
                  newState = 1;
                } else {
                  newState = 2;
                }
                
                dayArr[minuteIdx] = newState;
                setAvailabilityByDay((prev) => ({ ...prev, [String(absDay)]: dayArr }));
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
                if (!timeSlots || timeSlots.length === 0) return 0;
                const first = timeSlots[0];
                const startMinutes = first.hour * 60 + (first.minute || 0);
                const currentMinutes = hour * 60 + (minute || 0);
                const diff = currentMinutes - startMinutes;
                return Math.max(0, Math.floor(diff / 30));
              };

              const getShiftAtSlot = (dow, slotIndex) => {
                const slot = timeSlots[slotIndex];
                if (!slot) return null;

                for (const shift of displayShifts) {
                  if (shift.dayIndex !== dow) continue;

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
                const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                return displayHour + ':' + minute.toString().padStart(2, '0') + period;
              };

              return (
                <div className="p-6 select-none" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                  <div className="bg-white rounded border border-gray-300 mb-4 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">

                      <button 
                        onClick={() => setEditingAvailability(!editingAvailability)}
                        className={("px-3 py-1 rounded text-sm border " + (editingAvailability 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'))}
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
                      <label className="flex items-center gap-1 cursor-pointer text-sm">
                        <input 
                          type="checkbox" 
                          checked={is24HourView}
                          onChange={(e) => setIs24HourView(e.target.checked)}
                          className="w-3 h-3"
                        />
                        <span>24h View</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded border" onClick={() => setBaseDate(new Date())}>
                        Now
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Previous" onClick={() => {
                          if (viewMode === 'm' || viewMode === 'month') setBaseDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
                          else if (viewMode === '2w') setBaseDate(d => addDays(d, -14));
                          else if (viewMode === 'w' || viewMode === 'week') setBaseDate(d => addDays(d, -7));
                          else setBaseDate(d => addDays(d, -1));
                        }}>
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <div className="px-3 py-1 text-sm text-gray-700">
                          {periodLabel}
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Next" onClick={() => {
                          if (viewMode === 'm' || viewMode === 'month') setBaseDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1));
                          else if (viewMode === '2w') setBaseDate(d => addDays(d, 14));
                          else if (viewMode === 'w' || viewMode === 'week') setBaseDate(d => addDays(d, 7));
                          else setBaseDate(d => addDays(d, 1));
                        }}>
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                      </div>

                      <div className="flex gap-1 bg-gray-100 rounded p-0.5">
                        {['D', 'W', '2W', 'M'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => setViewMode(mode.toLowerCase())}
                            className={("px-2 py-1 rounded text-sm " + (viewMode === mode.toLowerCase() 
                                ? 'bg-white shadow' 
                                : 'hover:bg-gray-200'))}
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

                  {viewMode === 'd' && (
                    <div className="bg-white rounded border border-gray-300 px-4 py-2 mb-3 flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-800">Day: {weekDays[0]}</div>
                      {(() => {
                        const dayFilter = (currentDayGlobalIndex !== null ? currentDayGlobalIndex : undefined);
                        const ds = displayShifts.filter(s => (dayFilter === undefined) ? true : (s.dayIndex === dayFilter));
                        const accepted = ds.filter(s => s.status === 'accepted').length;
                        const assigned = ds.filter(s => s.status === 'assigned').length;
                        const open = ds.filter(s => s.status === 'open').length;
                        return (
                          <div className="text-xs text-gray-600">
                            Shifts: {ds.length} • Accepted: {accepted} • Assigned: {assigned} • Open: {open}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {viewMode === 'm' ? (
                    renderMonthView()
                  ) : (
                  <div className="bg-white rounded border border-gray-300 relative" style={{overflow: 'visible'}}>
                      <div className="grid" style={{gridTemplateColumns: (viewMode === 'd' ? ('auto minmax(320px, 1fr)') : ('auto repeat(' + weekDays.length + ', 1fr)')), overflow: 'visible'}}>
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
                              const dow = getDowForColumn(dayIndex);
                              const absDay = getAbsDayNumForColumn(dayIndex);
                              const slot = timeSlots[slotIndex];
                              const minuteIdx = getSlotIndex(slot);
                              const dayArr = ensureDayArray(absDay, dow);
                              let cellState = dayArr[minuteIdx];
                              const outside = isOutsideStoreHours(dow, slot.hour);
                              // If user saved a template, project its weekly state as the baseline background
                              if (savedAvailabilityTemplate && savedAvailabilityTemplate[dow]) {
                                const tplVal = savedAvailabilityTemplate[dow][minuteIdx];
                                if (tplVal === 0 || tplVal === 1 || tplVal === 2) {
                                  // Only override default white/unset values; keep explicit closed (3) and user-painted states
                                  if (cellState === 1) cellState = tplVal;
                                }
                              }
                              const finalState = outside ? 3 : (cellState === 3 ? 1 : cellState);
                              const cellColor = getCellColor(finalState);
                            return (
                              <div 
                                  key={dayIndex + '-' + slotIndex}
                                  className={"border-r border-b border-gray-300 relative select-none " + cellColor}
                                  style={{height: '20px'}}
                                onMouseDown={() => handleCellMouseDown(dayIndex, slotIndex)}
                                onMouseEnter={() => handleCellMouseEnter(dayIndex, slotIndex)}
                              >
                                  {(() => {
                                    const shift = getShiftAtSlot(dow, slotIndex);
                                    const hideOpen = !showOpenShifts && shift && shift.status === 'open';
                                    if (!shift || hideOpen) return null;
                                    return (
                                  <div 
                                    className="rounded cursor-pointer"
                                    style={{
                                      position: 'absolute',
                                      top: shift.isFirst ? '0' : '-1px',
                                      bottom: shift.isLast ? '0' : '-1px',
                                          left: '12px',
                                          width: '50%',
                                      backgroundColor: roleColors[shift.role],
                                          border: '2px solid ' + roleColors[shift.role],
                                          borderTop: shift.isFirst ? ('2px solid ' + roleColors[shift.role]) : 'none',
                                          borderBottom: shift.isLast ? ('2px solid ' + roleColors[shift.role]) : 'none',
                                      borderRadius: shift.isFirst && shift.isLast ? '4px' : 
                                                   shift.isFirst ? '4px 4px 0 0' : 
                                                   shift.isLast ? '0 0 4px 4px' : '0',
                                      zIndex: shift.isFirst ? 50 : 10
                                    }}
                                    onClick={(e) => { e.stopPropagation(); setModalShift(shift); }}
                                    onMouseDown={(e) => { e.stopPropagation(); }}
                                  >
                                        {shift.status === 'assigned' && shift.isFirst && (
                                      <div 
                                        className="rounded"
                                        style={{
                                          position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              height: (shift.totalHeight) + 'px',
                                              backgroundColor: 'rgba(255,255,255,0.5)',
                                              borderRadius: 'inherit',
                                              zIndex: 40,
                                              pointerEvents: 'none'
                                        }}
                                      />
                                    )}
                                        {shift.status === 'open' && shift.isFirst && (
                                      <div 
                                        className="rounded"
                                        style={{
                                          position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              height: (shift.totalHeight) + 'px',
                                              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 10px, transparent 10px, transparent 20px)',
                                              borderRadius: 'inherit',
                                              zIndex: 40,
                                              pointerEvents: 'none'
                                        }}
                                      />
                                    )}
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
                                                top: '60px',
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
                                          <div>{shift.status === 'accepted' && shift.workerName ? shift.workerName : (shift.role.charAt(0).toUpperCase() + shift.role.slice(1))}</div>
                                          <div>{shift.location}</div>
                                        </div>
                                      </div>
                                    )}
                                        {/* View button removed; entire card now opens modal on click */}
                                      </div>
                                    );
                                  })()}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  )}

                  {modalShift && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{zIndex: 1000}} onClick={() => setModalShift(null)}>
                      <div className="bg-white rounded shadow-xl max-w-md w-full p-4" style={{zIndex: 1001}} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">Shift details</div>
                          <button className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200" onClick={() => setModalShift(null)}>Close</button>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">Window, similar to schedule view</div>
                        <div className="text-sm">
                          <div><strong>When:</strong> {formatTime(modalShift.startHour, modalShift.startMinute)} - {formatTime(modalShift.endHour, modalShift.endMinute)}</div>
                          <div><strong>Role:</strong> {modalShift.role.charAt(0).toUpperCase() + modalShift.role.slice(1)}</div>
                          <div><strong>Location:</strong> {modalShift.location}</div>
                          <div><strong>Status:</strong> {modalShift.status}</div>
                        </div>
                      </div>
                    </div>
                  )}

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
                        <div className="absolute inset-0 rounded" style={{background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 10px, transparent 10px, transparent 20px)'}}></div>
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

            const ProfileTab = () => {
              const [expanded, setExpanded] = useState({
                personal: true,
                identity: true,
                employment: true,
                roles: true,
                locations: true,
                scheduling: true,
                history: true,
                documents: true,
                skills: true
              });

              const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

              const daysUntil = (dateStr) => {
                const now = new Date();
                const d = new Date(dateStr);
                return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
              };

              const formatDate = (dateStr) => {
                if (!dateStr) return '-';
                const d = new Date(dateStr);
                return d.toLocaleDateString();
              };

              const employee = {
                id: 'EMP-1234',
                firstName: 'Sarah',
                middleName: 'A.',
                lastName: 'Johnson',
                preferredName: 'SJ',
                dob: '1995-04-12',
                contact: { phone: ['(555) 123-4567'], email: ['sarah.johnson@example.com'] },
                address: { line1: '123 Main St', line2: 'Apt 4B', city: 'Springfield', state: 'CA', postalCode: '94000', country: 'USA' },
                emergencyContacts: [
                  { name: 'Michael Johnson', relation: 'Father', phone: '(555) 987-6543', email: 'michael.j@example.com' }
                ],
                employment: { hireDate: '2022-06-15', rehireDate: null, terminationDate: null, status: 'Active' },
                pay: { type: 'Hourly', baseRate: 22.5, overtimeRate: 33.75, payrollId: 'PY-7788' },
                roles: [
                  { roleId: 'manager', subRoleId: 'shift-lead', effectiveDate: '2024-08-01', roleName: 'Manager', subRoleName: 'Shift Lead', color: '#f97316' },
                  { roleId: 'barista', subRoleId: 'senior', effectiveDate: '2023-01-01', roleName: 'Barista', subRoleName: 'Senior', color: '#3b82f6' }
                ],
                locations: [
                  { name: 'Downtown', primary: true, preferred: true, distanceMiles: 4.2 },
                  { name: 'Uptown', primary: false, preferred: false, distanceMiles: 8.7 }
                ],
                crossLocation: true,
                availability: {
                  desiredHoursPerWeek: 36,
                  weekly: {
                    Mon: [{ start: '09:00', end: '17:00' }],
                    Tue: [{ start: '09:00', end: '17:00' }],
                    Wed: [{ start: '12:00', end: '20:00' }],
                    Thu: [{ start: '09:00', end: '17:00' }],
                    Fri: [{ start: '09:00', end: '17:00' }],
                    Sat: [{ start: '10:00', end: '16:00' }],
                    Sun: []
                  },
                  preferredShifts: ['Morning', 'Evening'],
                  overtimeConsent: false,
                  shiftBidPreference: 'Maximize hours'
                },
                documents: {
                  identity: [
                    { type: "Driver's License", number: 'D1234567', expirationDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().slice(0,10), issuingAuthority: 'CA DMV' },
                    { type: 'Passport', number: 'P123456789', expirationDate: '2030-05-01', issuingAuthority: 'USA' }
                  ],
                  certifications: [
                    { type: 'Food Handler', issuedDate: '2024-02-01', expirationDate: '2027-02-01', documentFile: null },
                    { type: 'Alcohol Permit', issuedDate: '2023-03-10', expirationDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().slice(0,10), documentFile: null }
                  ]
                },
                analytics: { punctualityScore: 92, retentionFlag: true, performanceRating: 4.6 },
                notes: { managerNotes: ['Shows initiative during peak hours.'], employeeNotes: ['Prefers morning shifts on weekdays.'] }
              };

              const expiringSoon = [];
              employee.documents.identity.forEach((doc) => {
                const days = daysUntil(doc.expirationDate);
                if (days <= 30) {
                  expiringSoon.push({ label: doc.type + ' expires in ' + days + ' day(s)', severity: days < 0 ? 'error' : 'warn' });
                }
              });
              employee.documents.certifications.forEach((doc) => {
                const days = daysUntil(doc.expirationDate);
                if (days <= 30) {
                  expiringSoon.push({ label: doc.type + ' expires in ' + days + ' day(s)', severity: days < 0 ? 'error' : 'warn' });
                }
              });

              // Header chips
              const identityChips = (employee.documents.identity || []).map((doc, idx) => {
                const d = daysUntil(doc.expirationDate);
                const cls = d < 0
                  ? 'bg-red-100 text-red-700'
                  : d <= 180
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700';
                return (
                  <span key={'id-'+idx} className={"px-2 py-0.5 rounded-full text-xs font-medium " + cls}>{doc.type}</span>
                );
              });

              const rolesHeaderChips = (employee.roles || []).map((r, idx) => (
                <span key={'role-'+idx} className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{backgroundColor: r.color}}>{r.subRoleName}</span>
              ));

              const locationHeaderChips = (employee.locations || []).map((l, idx) => (
                <span key={'loc-'+idx} className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">{l.name}</span>
              ));

              const Section = ({ title, open, onToggle, children, subtitle, closedContent, inlineContent }) => (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                  <div role="button" tabIndex={0} onClick={onToggle} className="w-full flex items-start justify-between px-4 py-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium text-gray-900">{title}</div>
                        {inlineContent ? <div className="flex flex-wrap items-center gap-2">{inlineContent}</div> : null}
                </div>
                      {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
                    </div>
                    <ChevronDown className={"w-4 h-4 text-gray-500 transition-transform " + (open ? 'transform rotate-180' : '')} />
                  </div>
                  {open ? <div className="px-4 pb-4">{children}</div> : (closedContent ? <div className="px-4 pb-4">{closedContent}</div> : null)}
              </div>
            );

              const QuickButton = ({ children, onClick }) => (
                <button onClick={onClick} className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">
                  {children}
                </button>
              );

              const AvailabilityPreview = () => {
                const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                const widthPerDay = 100 / days.length + '%';
                const toMinutes = (t) => {
                  const [h,m] = t.split(':');
                  return parseInt(h,10)*60 + parseInt(m,10);
                };
                return (
                  <div>
                    <div className="mb-2 text-sm text-gray-600">Weekly template (preview)</div>
                    <div className="flex border border-gray-200 rounded overflow-hidden">
                      {days.map((d) => {
                        const blocks = (employee.availability.weekly[d] || []);
                        return (
                          <div key={d} className="relative h-12 border-r last:border-r-0 border-gray-200" style={{width: widthPerDay}}>
                            <div className="absolute inset-x-0 top-0 text-xs text-gray-500 text-center">{d}</div>
                            {blocks.map((b, idx) => {
                              const start = toMinutes(b.start);
                              const end = toMinutes(b.end);
                              const top = (start / (24*60)) * 100;
                              const height = ((end - start) / (24*60)) * 100;
                              return (
                                <div key={idx} className="absolute left-1 right-1 rounded bg-emerald-500/20 border border-emerald-500" style={{ top: top + '%', height: height + '%' }}></div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };

              // Simple Skills components (no external deps)
              const SkillManagementModal = ({ isOpen, onClose, skills, onSkillsChange, maxSkillLength = 25 }) => {
                const [newSkill, setNewSkill] = useState("");

                if (!isOpen) return null;

                const handleAdd = () => {
                  const trimmed = newSkill.trim();
                  if (!trimmed) return;
                  if (trimmed.length > maxSkillLength) return;
                  if ((skills || []).includes(trimmed)) return;
                  const updated = [...(skills || []), trimmed].sort();
                  onSkillsChange(updated);
                  setNewSkill("");
                };

                const handleDelete = (skill) => {
                  onSkillsChange((skills || []).filter((s) => s !== skill));
                };

                return (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{zIndex: 1000}} onClick={onClose}>
                    <div className="bg-white rounded shadow-xl w-full max-w-md p-4 max-h-[80vh] overflow-auto" style={{zIndex: 1001}} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">Manage Skills</div>
                        <button className="px-2 py-1 text-sm rounded border" onClick={onClose}>Close</button>
                      </div>
                      <div className="space-y-2 mb-3">
                        <label className="text-sm" htmlFor="new-skill">Add New Skill</label>
                        <div className="flex gap-2">
                          <input id="new-skill" className="flex-1 border rounded px-2 py-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} maxLength={maxSkillLength} placeholder="Enter skill name" />
                          <button className="px-2 py-1 rounded border" onClick={handleAdd} disabled={!newSkill.trim()}>Add</button>
                        </div>
                        <div className="text-xs text-gray-500">{newSkill.length}/{maxSkillLength} characters</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Current Skills ({(skills || []).length})</div>
                        <div className="border rounded p-2 max-h-64 overflow-auto">
                          {(skills || []).length === 0 ? (
                            <div className="text-center text-gray-500 py-6">No skills added yet</div>
                          ) : (
                            <div className="space-y-1">
                              {(skills || []).map((skill) => (
                                <div key={skill} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                                  <span className="text-sm" title={skill}>{skill}</span>
                                  <button className="px-2 py-1 text-xs rounded border" onClick={() => handleDelete(skill)}>Delete</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              };

              const ExpirationControl = ({ initialMode = null, initialDate = '', onChange }) => {
                const [mode, setMode] = useState(initialMode);
                const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
                const inputRef = useRef(null);

                useEffect(() => {
                  if (onChange) {
                    const value = mode === 'perpetual' ? 'perpetual' : (mode === 'date' ? date : null);
                    onChange(value);
                  }
                }, [mode, date, onChange]);

                const handleCalendarClick = (e) => {
                  e.stopPropagation();
                  setMode('date');
                  if (inputRef.current) {
                    if (typeof inputRef.current.showPicker === 'function') {
                      inputRef.current.showPicker();
                    } else {
                      inputRef.current.click();
                    }
                  }
                };

                const handleInfinityClick = (e) => {
                  e.stopPropagation();
                  setMode('perpetual');
                };

                const formatDate = (dateStr) => {
                  if (!dateStr) return '';
                  // Parse YYYY-MM-DD as a LOCAL date to avoid timezone shifting the day
                  const parts = dateStr.split('-');
                  if (parts.length !== 3) return dateStr;
                  const y = parseInt(parts[0], 10);
                  const m = parseInt(parts[1], 10) - 1;
                  const d = parseInt(parts[2], 10);
                  const localDate = new Date(y, m, d);
                  if (isNaN(localDate.getTime())) return dateStr;
                  return localDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                };

                return (
                  <div className="relative flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={handleCalendarClick} className={"transition-colors flex-shrink-0 " + (mode === 'date' ? 'text-gray-300 cursor-default' : 'text-blue-400 hover:text-blue-600')} disabled={mode === 'date'}>
                      <Calendar className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0" onClick={(e) => { e.stopPropagation(); handleCalendarClick(e); }}>
                      {mode === 'date' ? (
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap cursor-pointer">{formatDate(date)}</span>
                      ) : mode === 'perpetual' ? (
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap cursor-pointer">Perpetual</span>
                      ) : (
                        <span className="text-sm text-gray-400 whitespace-nowrap cursor-pointer">Expires</span>
                      )}
                    </div>
                    <button type="button" onClick={handleInfinityClick} className={"transition-colors flex-shrink-0 " + (mode === 'perpetual' ? 'text-gray-300 cursor-default' : 'text-blue-400 hover:text-blue-600')} disabled={mode === 'perpetual'}>
                      <InfinityIcon className="w-4 h-4" />
                    </button>
                    <input 
                      ref={inputRef}
                      type="date"
                      value={date}
                      onChange={(e) => { const v = e.target.value; if (v && v.length > 0) { setMode('date'); setDate(v); } else { setMode(null); setDate(''); } }}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                );
              };

              const SkillSelector = ({ skills, selectedSkills, onSelectionChange = () => {}, onSkillsChange = () => {}, allowManagement = true }) => {
                const [localSkills, setLocalSkills] = useState(skills || []);
                const [localSelected, setLocalSelected] = useState(selectedSkills || []);
                const [open, setOpen] = useState(false);
                const [expirationBySkill, setExpirationBySkill] = useState({}); // skill -> 'YYYY-MM-DD'
                const [docBySkill, setDocBySkill] = useState({}); // skill -> object URL or href

                useEffect(() => {
                  setLocalSkills(skills || []);
                  // initialize maps for new skills
                  const exp = {};
                  const docs = {};
                  (skills || []).forEach((s) => {
                    exp[s] = (expirationBySkill && expirationBySkill[s]) || '';
                    docs[s] = (docBySkill && docBySkill[s]) || '';
                  });
                  setExpirationBySkill(exp);
                  setDocBySkill(docs);
                }, [skills]);
                useEffect(() => { setLocalSelected(selectedSkills || []); }, [selectedSkills]);

                const total = (localSkills || []).length;
                const selectedCount = (localSelected || []).length;
                const allSelected = total > 0 && selectedCount === total;

                const toggleSkill = (skill) => {
                  const current = localSelected || [];
                  const next = current.includes(skill) ? current.filter((s) => s !== skill) : current.concat([skill]);
                  setLocalSelected(next);
                  onSelectionChange(next);
                };

                const toggleAll = () => {
                  const next = allSelected ? [] : [...(localSkills || [])];
                  setLocalSelected(next);
                  onSelectionChange(next);
                };

                const handleSkillsUpdate = (updated) => {
                  setLocalSkills(updated);
                  onSkillsChange(updated);
                  // also trim selected if needed
                  const filtered = (localSelected || []).filter((s) => updated.includes(s));
                  if (filtered.length !== (localSelected || []).length) {
                    setLocalSelected(filtered);
                    onSelectionChange(filtered);
                  }
                };

                return (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="w-12 p-2 text-center border-b border-gray-200">
                              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                            </th>
                            <th className="text-left p-2 font-semibold text-sm text-gray-700 border-b border-gray-200">Skill</th>
                            <th className="w-40 p-2 text-left font-semibold text-sm text-gray-700 border-b border-gray-200">Expiration</th>
                            <th className="w-48 p-2 text-center font-semibold text-sm text-gray-700 border-b border-gray-200">Documents</th>
                            <th className="w-32 p-2 text-center border-b border-gray-200">
                              {allowManagement ? (
                                <button onClick={() => setOpen(true)} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-xs font-medium rounded">Manage Skills</button>
                              ) : null}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(localSkills || []).map((skill) => {
                            const isSelected = (localSelected || []).includes(skill);
                            return (
                              <tr key={skill} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => toggleSkill(skill)}>
                                <td className="p-2 text-center">
                                  <input type="checkbox" checked={isSelected} onChange={() => toggleSkill(skill)} onClick={(e) => e.stopPropagation()} />
                                </td>
                                <td className="p-2 text-sm text-gray-700">{skill}</td>
                                <td className="p-2">
                                  <ExpirationControl
                                    initialMode={((expirationBySkill && expirationBySkill[skill]) === 'perpetual') ? 'perpetual' : ((expirationBySkill && expirationBySkill[skill]) ? 'date' : null)}
                                    initialDate={(expirationBySkill && expirationBySkill[skill] && expirationBySkill[skill] !== 'perpetual') ? expirationBySkill[skill] : ''}
                                    onChange={(val) => {
                                      setExpirationBySkill((prev) => ({ ...prev, [skill]: val }));
                                    }}
                                  />
                                </td>
                                <td className="p-2 text-sm text-center">
                                  {(docBySkill && docBySkill[skill]) ? (
                                    <a href={docBySkill[skill]} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 underline">view</a>
                                  ) : (
                                    <button className="text-blue-600 underline text-sm" onClick={(e) => {
                                      e.stopPropagation();
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.onchange = (ev) => {
                                        const file = ev.target && ev.target.files && ev.target.files[0];
                                        if (file) {
                                          const url = URL.createObjectURL(file);
                                          setDocBySkill((prev) => ({ ...prev, [skill]: url }));
                                        }
                                      };
                                      input.click();
                                    }}>upload</button>
                                  )}
                                </td>
                                <td className="p-2"></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {allowManagement ? (
                      <SkillManagementModal isOpen={open} onClose={() => setOpen(false)} skills={localSkills || []} onSkillsChange={handleSkillsUpdate} />
                    ) : null}
                  </div>
                );
              };

              // Skills state at tab level so we can show chips when the section is closed
              const [skillsList, setSkillsList] = useState(["Barista", "Cash Handling", "Milk Steaming", "Latte Art", "POS Operations", "Shift Lead", "Inventory", "Customer Service"]);
              const [selectedSkills, setSelectedSkills] = useState(["Customer Service", "Barista"]);

              const SkillsChips = ({ selected, onRemove }) => (
                <div className="flex flex-wrap gap-2">
                  {(selected || []).length === 0 ? (
                    <span className="text-sm text-gray-500">No skills selected</span>
                  ) : (
                    (selected || []).map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[11px]" style={{backgroundColor: '#4f46e5'}}>
                        <span className="leading-none">{s}</span>
                        <button className="w-3.5 h-3.5 leading-none text-white/90 hover:text-white flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onRemove(s); }}>×</button>
                      </span>
                    ))
                  )}
                </div>
              );

              return (
                <div className="p-4 md:p-6">
                  {/* Profile header removed per request */}

                  {/* Summary banner removed per request */}

                  <Section title="Personal Information" open={expanded.personal} onToggle={() => toggle('personal')}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="md:row-span-2">
                        <div className="text-gray-500 mb-1">Photograph</div>
                        <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border">
                          <img src="https://i.pravatar.cc/200?img=12" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Upload new photo')}>Upload</button>
                          <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Change photo')}>Change</button>
                          <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Remove photo')}>Remove</button>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Full name</div>
                        <div className="font-medium">{employee.firstName} {employee.middleName} {employee.lastName}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Preferred name</div>
                        <div className="font-medium">{employee.preferredName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Date of birth</div>
                        <div className="font-medium">{formatDate(employee.dob)}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Contact</div>
                        <div className="font-medium">{employee.contact.phone.join(', ')} • {employee.contact.email.join(', ')}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Address</div>
                        <div className="font-medium">{employee.address.line1}{employee.address.line2 ? ', ' + employee.address.line2 : ''}, {employee.address.city}, {employee.address.state} {employee.address.postalCode}, {employee.address.country}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Emergency contact</div>
                        <div className="font-medium">{employee.emergencyContacts[0].name} ({employee.emergencyContacts[0].relation}) — {employee.emergencyContacts[0].phone}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Password</div>
                        <div className="flex items-center gap-2">
                          <input type="password" value="••••••••" readOnly className="border rounded px-2 py-1 text-sm w-48 bg-gray-50" />
                          <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Password reset link sent')}>Reset</button>
                        </div>
                      </div>
                    </div>
                  </Section>

                  <Section title="Identity" open={expanded.identity} onToggle={() => toggle('identity')} inlineContent={identityChips}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <div className="font-medium mb-2">Government IDs</div>
                        <div className="space-y-2">
                          {employee.documents.identity.map((doc, idx) => {
                            const days = daysUntil(doc.expirationDate);
                            const badgeClass = days < 0 ? 'bg-red-100 text-red-700' : days <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
                            const badgeText = days < 0 ? 'Expired' : days <= 30 ? 'Expiring soon' : 'Valid';
                            return (
                              <div key={idx} className="flex items-start justify-between border rounded p-2 gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-10 bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
                                    <span className="text-[10px] text-gray-500">ID Image</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{doc.type}</div>
                                    <div className="text-gray-600 text-xs">No. {doc.number} • Issuer: {doc.issuingAuthority}</div>
                                    <div className="flex gap-2 mt-1">
                                      <button className="text-xs px-2 py-1 rounded border" onClick={() => alert('Upload photo of ID')}>Upload photo</button>
                                      <button className="text-xs px-2 py-1 rounded border" onClick={() => alert('Start video verification')}>Video verify</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Expires</div>
                                  <div className="font-medium text-sm">{formatDate(doc.expirationDate)}</div>
                                  <div className={"inline-block mt-1 px-2 py-0.5 text-xs rounded " + badgeClass}>{badgeText}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Section>

                  <Section title="Roles & Sub-roles" open={expanded.roles} onToggle={() => toggle('roles')} inlineContent={rolesHeaderChips}>
                    <div className="space-y-3 text-sm">
                      {employee.roles.map((r, idx) => (
                        <div key={idx} className="flex items-center justify-between border rounded p-2">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{backgroundColor: r.color}}></span>
                            <div>
                              <div className="font-medium">{r.roleName} <span className="text-gray-500">→ {r.subRoleName}</span></div>
                              <div className="text-xs text-gray-600">Effective {formatDate(r.effectiveDate)}</div>
                            </div>
                          </div>
                          <button className="text-xs px-2 py-1 rounded border">Change</button>
                        </div>
                      ))}
                      <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">Add role</button>
                    </div>
                  </Section>

                  <Section title="Skills" open={expanded.skills} onToggle={() => toggle('skills')} inlineContent={<SkillsChips selected={selectedSkills} onRemove={(s) => setSelectedSkills((selectedSkills || []).filter((x) => x !== s))} />}>
                    <div className="space-y-3">
                      <SkillSelector skills={skillsList} selectedSkills={selectedSkills} onSelectionChange={setSelectedSkills} onSkillsChange={setSkillsList} allowManagement={true} />
                    </div>
                  </Section>

                  <Section title="Locations" open={expanded.locations} onToggle={() => toggle('locations')} inlineContent={locationHeaderChips}>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <input id="crossloc" type="checkbox" checked={employee.crossLocation} onChange={() => {}} />
                        <label htmlFor="crossloc" className="text-gray-700">Allow cross-location scheduling</label>
                      </div>
                      {employee.locations.map((l, idx) => (
                        <div key={idx} className="flex items-center justify-between border rounded p-2">
                          <div>
                            <div className="font-medium">{l.name} {l.primary ? <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">Primary</span> : null} {l.preferred ? <span className="ml-2 px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700">Preferred</span> : null}</div>
                            <div className="text-xs text-gray-600">{l.distanceMiles} mi from home</div>
                          </div>
                          <button className="text-xs px-2 py-1 rounded border">Set preferred</button>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Scheduling Preferences" open={expanded.scheduling} onToggle={() => toggle('scheduling')}>
                    <div className="space-y-4 text-sm">
                      {(() => {
                        // Inline component: Scheduling Preferences Template (Week / 2W), paintable
                        const Template = () => {
                          const tplView = 'week';
                          const [tplBrush, setTplBrush] = useState('available'); // unavailable|available|preferred
                          const [tplDrawing, setTplDrawing] = useState(false);

                          const getTplStoreHours = (dow) => {
                            const isWeekend = dow === 0 || dow === 6;
                            return { open: isWeekend ? 10 : 9, close: isWeekend ? 22 : 19 };
                          };

                          const tplWeeks = 1;
                          const tplDayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                          const tplWeekDays = Array.from({length: tplWeeks * 7}, (_, i) => tplDayNames[i % 7]);

                          const generateTplTimeSlots = () => {
                            let earliest = 24; let latest = 0;
                            for (let d = 0; d < 7; d++) {
                              const h = getTplStoreHours(d);
                              earliest = Math.min(earliest, h.open);
                              latest = Math.max(latest, h.close);
                            }
                            const startHour = earliest - 1;
                            const endHour = latest + 1;
                            const slots = [];
                            for (let hour = startHour; hour < endHour; hour += 0.5) {
                              const hourInt = Math.floor(hour);
                              const minute = (hour % 1 === 0) ? 0 : 30;
                              const label = (hour % 1 === 0 && hourInt % 2 === 0)
                                ? (hourInt === 0 ? '12a' : (hourInt < 12 ? (hourInt + 'a') : (hourInt === 12 ? '12p' : ((hourInt - 12) + 'p'))))
                                : '';
                              slots.push({ hour: hourInt, minute, label });
                            }
                            return slots;
                          };

                          const [tplSlots, setTplSlots] = useState(() => generateTplTimeSlots());
                          useEffect(() => { setTplSlots(generateTplTimeSlots()); }, [tplView]);

                          const [tplAvail, setTplAvail] = useState(() => {
                            const init = {};
                            for (let d = 0; d < tplWeekDays.length; d++) {
                              const dow = d % 7;
                              for (let s = 0; s < tplSlots.length; s++) {
                                const key = d + '-' + s;
                                const outside = tplSlots[s] ? (tplSlots[s].hour < getTplStoreHours(dow).open || tplSlots[s].hour >= getTplStoreHours(dow).close) : false;
                                init[key] = outside ? 3 : 1;
                              }
                            }
                            return init;
                          });
                          useEffect(() => {
                            setTplAvail(prev => {
                              const next = {};
                              for (let d = 0; d < tplWeekDays.length; d++) {
                                const dow = d % 7;
                                for (let s = 0; s < tplSlots.length; s++) {
                                  const key = d + '-' + s;
                                  const prevVal = prev[key];
                                  const outside = tplSlots[s] ? (tplSlots[s].hour < getTplStoreHours(dow).open || tplSlots[s].hour >= getTplStoreHours(dow).close) : false;
                                  next[key] = typeof prevVal === 'number' ? prevVal : (outside ? 3 : 1);
                                }
                              }
                              return next;
                            });
                          }, [tplSlots, tplWeekDays.length]);

                          const hoursByState = useMemo(() => {
                            const tally = { 0: 0, 1: 0, 2: 0 };
                            const stepHours = 0.5;
                            for (let d = 0; d < tplWeekDays.length; d++) {
                              for (let s = 0; s < tplSlots.length; s++) {
                                const v = tplAvail[d + '-' + s];
                                if (v === 0 || v === 1 || v === 2) tally[v] += stepHours;
                              }
                            }
                            return tally;
                          }, [tplAvail, tplSlots.length, tplWeekDays.length]);

                          const tplGetColor = (state) => {
                            switch(state) {
                              case 0: return 'bg-gray-100'; // unavailable
                              case 1: return 'bg-yellow-100'; // available (light yellow)
                              case 2: return 'bg-green-100'; // preferred
                              case 3: return 'bg-gray-400'; // closed
                              default: return 'bg-yellow-100';
                            }
                          };

                          const paint = (dayIndex, slotIndex) => {
                            const key = dayIndex + '-' + slotIndex;
                            const current = tplAvail[key];
                            if (current === 3) return;
                            const val = tplBrush === 'unavailable' ? 0 : (tplBrush === 'available' ? 1 : 2);
                            setTplAvail(prev => ({ ...prev, [key]: val }));
                          };

                          const saveTemplate = (e) => {
                            e.stopPropagation();
                            // Build a weekly template by DOW → 48-slot array (0/1/2/3)
                            const weekly = {};
                            for (let dow = 0; dow < 7; dow++) {
                              const arr = new Array(48).fill(1);
                              for (let s = 0; s < tplSlots.length; s++) {
                                const v = tplAvail[dow + '-' + s];
                                const idx = tplSlots[s].hour * 2 + (tplSlots[s].minute === 30 ? 1 : 0);
                                arr[idx] = v;
                              }
                              weekly[dow] = arr;
                            }
                            savedAvailabilityTemplate = weekly;
                            alert('Scheduling template saved and applied to Schedule view background');
                          };

                          return (
                            <div className="border rounded" onMouseUp={() => setTplDrawing(false)} onMouseLeave={() => setTplDrawing(false)}>
                              <div className="px-3 py-2 flex items-center justify-between border-b bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <div className="text-sm font-medium"></div>
                                  <div className="flex items-center gap-4 ml-2">
                                    <label className="flex items-center text-xs cursor-pointer">
                                      <input type="radio" name="tplbrush" checked={tplBrush==='unavailable'} onChange={()=>setTplBrush('unavailable')} />
                                      <span className="ml-1 px-1 rounded border border-gray-300 bg-gray-100">Unavailable</span>
                                      <span className="ml-1 text-[11px] text-gray-600 inline-block w-14 text-right" style={{fontVariantNumeric:'tabular-nums', marginRight: '10px'}}>{hoursByState[0].toFixed(1)} h</span>
                                    </label>
                                    <label className="flex items-center text-xs cursor-pointer">
                                      <input type="radio" name="tplbrush" checked={tplBrush==='available'} onChange={()=>setTplBrush('available')} />
                                      <span className="ml-1 px-1 rounded border border-gray-300 bg-yellow-100">Available</span>
                                      <span className="ml-1 text-[11px] text-gray-600 inline-block w-14 text-right" style={{fontVariantNumeric:'tabular-nums', marginRight: '10px'}}>{hoursByState[1].toFixed(1)} h</span>
                                    </label>
                                    <label className="flex items-center text-xs cursor-pointer">
                                      <input type="radio" name="tplbrush" checked={tplBrush==='preferred'} onChange={()=>setTplBrush('preferred')} />
                                      <span className="ml-1 px-1 rounded border border-gray-300 bg-green-100">Preferred</span>
                                      <span className="ml-1 text-[11px] text-gray-600 inline-block w-14 text-right" style={{fontVariantNumeric:'tabular-nums', marginRight: '10px'}}>{hoursByState[2].toFixed(1)} h</span>
                                    </label>
                                  </div>
                                </div>
                                <button className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-100" onClick={saveTemplate}>Save Template</button>
                              </div>
                              <div className="grid" style={{gridTemplateColumns: ('auto repeat(' + tplWeekDays.length + ', 1fr)')}}>
                                <div className="border-r border-b bg-gray-50 p-2"></div>
                                {tplWeekDays.map((d, i) => (
                                  <div key={i} className="border-r border-b bg-gray-50 p-2 text-center text-xs font-medium">{d}</div>
                                ))}
                                {tplSlots.map((slot, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <div className="border-r border-b bg-gray-50 px-2 text-[10px] text-gray-600 text-right flex items-center justify-end select-none pointer-events-none" style={{height: '20px'}}>
                                      {slot.label}
                                    </div>
                                    {tplWeekDays.map((_, dIdx) => {
                                      const key = dIdx + '-' + sIdx;
                                      const color = tplGetColor(tplAvail[key]);
                                      return (
                                        <div key={key} className={("border-r border-b relative select-none " + color)} style={{height: '20px'}}
                                          onMouseDown={() => { setTplDrawing(true); paint(dIdx, sIdx); }}
                                          onMouseEnter={() => { if (tplDrawing) paint(dIdx, sIdx); }}
                                        />
                                      );
                                    })}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          );
                        };
                        return <Template />;
                      })()}
                    </div>
                  </Section>

                  <Section title="History & Analytics" open={expanded.history} onToggle={() => toggle('history')}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="border rounded p-3">
                        <div className="text-gray-500">Punctuality</div>
                        <div className="text-2xl font-semibold">{employee.analytics.punctualityScore}%</div>
                      </div>
                      <div className="border rounded p-3">
                        <div className="text-gray-500">Performance rating</div>
                        <div className="text-2xl font-semibold">{employee.analytics.performanceRating}</div>
                      </div>
                      <div className="border rounded p-3">
                        <div className="text-gray-500">90-day retention</div>
                        <div>
                          {employee.analytics.retentionFlag ? <span className="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700">On track</span> : <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700">At risk</span>}
                        </div>
                      </div>
                    </div>
                  </Section>

                  <Section title="Documents & Notes" open={expanded.documents} onToggle={() => toggle('documents')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="border rounded p-4">
                        <div className="font-medium mb-2">Upload documents</div>
                        <div className="border-2 border-dashed rounded p-6 text-center text-gray-500">Drop files here or <button className="underline" onClick={() => alert('Open file picker')}>browse</button></div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="font-medium mb-1">Manager notes</div>
                          <textarea className="w-full border rounded p-2" rows="3" defaultValue={(employee.notes.managerNotes || []).join(String.fromCharCode(10))}></textarea>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Employee notes</div>
                          <textarea className="w-full border rounded p-2" rows="3" defaultValue={(employee.notes.employeeNotes || []).join(String.fromCharCode(10))}></textarea>
                        </div>
                      </div>
                    </div>
                  </Section>
                </div>
              );
            };

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
  
  const current = screens[screenIndex]!;
  const updated = {
    ...current,
    name,
    type,
    description,
    components: components || current.components,
    status: status || current.status
  } as typeof screens[number];
  
  screens[screenIndex] = updated;
  
  res.json({
    success: true,
    data: screens[screenIndex]!,
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
