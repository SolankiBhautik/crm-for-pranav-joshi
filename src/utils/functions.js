import { format } from 'date-fns';

export const formatDate = (dateValue) => {
    if (!dateValue) return '-';

    // Handle Firestore Timestamp
    if (typeof dateValue === 'object' && 'seconds' in dateValue && 'nanoseconds' in dateValue) {
        return format(new Date(dateValue.seconds * 1000), 'dd/MM/yyyy'); // Convert seconds to milliseconds
    }

    // Handle Firebase Timestamp object (if using Firebase SDK)
    if (dateValue.toDate) {
        return format(dateValue.toDate(), 'dd/MM/yyyy');
    }

    // Handle regular Date objects or ISO strings
    try {
        return format(new Date(dateValue), 'dd/MM/yyyy');
    } catch (error) {
        console.error('Date formatting error:', error);
        return '-';
    }
};
