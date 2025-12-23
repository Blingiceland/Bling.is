import React from 'react';

const BookingEvent = ({ booking }) => {
    const isPaid = booking.entryType === 'Paid';

    // Dark mode friendly colors
    const paidStyle = {
        backgroundColor: '#312e81', // Dark Indigo
        color: '#c7d2fe',   // Light Indigo
        borderLeftColor: '#6366f1'
    };

    const freeStyle = {
        backgroundColor: '#14532d', // Dark Green
        color: '#bbf7d0',   // Light Green
        borderLeftColor: '#22c55e'
    };

    const style = isPaid ? paidStyle : freeStyle;

    return (
        <div style={{
            backgroundColor: style.backgroundColor,
            color: style.color,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            marginTop: '4px',
            borderLeft: `3px solid ${style.borderLeftColor}`,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }}>
            <div style={{ fontWeight: 600 }}>{booking.title}</div>
        </div>
    );
};

export default BookingEvent;
