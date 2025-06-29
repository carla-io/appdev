import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import '../CSS/AnimalCalendar.css'; // Import the separate CSS file

const AnimalCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks/getTask')
      .then(res => {
        // No need to map or expand anything
        setEvents(res.data);
      })
      .catch(err => console.error('Error fetching calendar tasks:', err));
  }, []);

  return (
    <div className="min-h-screen p-6" style={{background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%)'}}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {/* <div className="p-4 rounded-2xl shadow-lg" style={{background: '#315342'}}>
            <Calendar className="w-10 h-10 text-white" />
          </div> */}
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{color: '#315342'}}>Animal Task Calendar</h1>
            <p className="text-gray-600 text-lg">Manage and track all animal care tasks</p>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Calendar Body */}
          <div className="p-8">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventContent={renderEventContent}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  const { extendedProps } = eventInfo.event;
  const animal = extendedProps?.animal || {};
  const assignedTo = extendedProps?.assignedTo || '';
  const status = extendedProps?.status || '';
  const type = eventInfo.event.title?.split(' - ')[0] || '';

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // amber
      case 'in-progress':
        return '#3b82f6'; // blue
      default:
        return '#315342'; // default green
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'feeding':
        return '🍽️';
      case 'medical':
        return '🏥';
      case 'grooming':
        return '✂️';
      case 'exercise':
        return '🏃';
      default:
        return '📋';
    }
  };

  return (
    <div 
      className="rounded-lg p-2 text-xs shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4"
      style={{
        background: '#315342',
        color: 'white',
        borderLeftColor: getStatusColor(status),
        minHeight: '80px'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{getTypeIcon(type)}</span>
        <strong className="text-xs font-semibold truncate">{type}</strong>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        {animal.photo && (
          <img
            src={animal.photo}
            alt={animal.name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs truncate">{animal.name}</div>
          <div className="text-xs opacity-75 truncate">{animal.species}</div>
        </div>
      </div>
      
      <div className="text-xs opacity-75 truncate mb-2">👤 {assignedTo}</div>
      
      <div className="flex items-center justify-end">
        <span 
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            background: '#A4D9AB',
            color: '#315342'
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default AnimalCalendar;