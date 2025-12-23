import React, { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday,
    isBefore, startOfToday
} from 'date-fns';
import BookingEvent from './BookingEvent';

const Calendar = ({ bookings = [], onDateClick, blockedDates = [], selectedDate, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Default restriction: today if not provided
    const effectiveMinDate = minDate ? startOfToday() : startOfToday();

    return (
        <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onPrevMonth} style={navButtonStyle}>&lt;</button>
                    <button onClick={onNextMonth} style={navButtonStyle}>&gt;</button>
                </div>
            </div>

            {/* Weekday Headers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
                {weekDays.map(day => (
                    <div key={day} style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'gray',
                        fontSize: '0.875rem'
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {calendarDays.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);

                    // Check if blocked
                    const isBlocked = blockedDates.some(blockedDate => isSameDay(blockedDate, day));
                    const isPast = isBefore(day, startOfToday());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    const isClickable = !isBlocked && !isPast && isCurrentMonth;

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => isClickable && onDateClick(day)}
                            style={{
                                minHeight: '80px',
                                padding: '0.5rem',
                                borderBottom: '1px solid var(--color-border)',
                                borderRight: (dayIdx + 1) % 7 !== 0 ? '1px solid var(--color-border)' : 'none',
                                backgroundColor: isSelected
                                    ? 'rgba(255, 215, 0, 0.1)' // Gold select
                                    : (isBlocked || isPast)
                                        ? '#0a0a0a' // Dark blocked
                                        : (isCurrentMonth ? 'transparent' : 'rgba(0,0,0,0.5)'),
                                opacity: (isBlocked || isPast) ? 0.3 : (isCurrentMonth ? 1 : 0.3),
                                cursor: isClickable ? 'pointer' : 'default',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            title={isBlocked ? "Not Available" : ""}
                        >
                            <span style={{
                                fontWeight: isDayToday ? 700 : 500,
                                color: isSelected ? '#ffd700' : (isDayToday ? 'white' : 'gray'),
                                backgroundColor: isDayToday ? 'rgba(255,255,255,0.1)' : 'transparent',
                                borderRadius: '50%',
                                width: '2rem',
                                height: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem'
                            }}>
                                {format(day, 'd')}
                            </span>

                            {isBlocked && isCurrentMonth && (
                                <span className="mt-2 text-red-500 font-bold text-xs">✕</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const navButtonStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
};

export default Calendar;
